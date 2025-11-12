// fetchNews.ts
import 'server-only'
import Parser from "rss-parser";

type RSSItem = {
  title?: string;
  link?: string;
  isoDate?: string;
  pubDate?: string;
  contentSnippet?: string;
  content?: string;
};

export type NewsItem = {
  title: string;
  link: string;
  publishedAt: string; // ISO
  source: string;      // domain / feed origin
};

export type FetchNewsOptions = {
  hoursBack?: number;          // колко часа назад да гледаме (по подразб. 72)
  keywords?: string[];         // ключови думи за филтриране
  maxPerFeed?: number;         // максимум на източник (по подразб. 30)
  maxTotal?: number;           // глобален максимум (по подразб. 150)
  requireKeywordMatch?: boolean; // ако е false, взима всичко по тема време; ако е true — и по ключови думи
};

const DEFAULT_KEYWORDS = [
  // BG
  "гориво","горива","бензин","дизел","lpg","метан","пропан","газ",
  "бензиностанция","бензиностанции","нефт","петрол","акциз","цена","цените",
  "рафинерия","лукойл","омв","shell","eko","petrol","rompetrol","nis",
  // EN
  "fuel","gasoline","diesel","petrol","lpg","autogas","refinery",
  "opec","brent","wti","crude","oil","gas station","petrol station"
];

const parser = new Parser<RSSItem>({
  timeout: 15000, // 15s
  headers: { "User-Agent": "NewsFetcher/1.0 (+https://example.com)" }
});

function splitEnvList(name: string): string[] {
  const v = process.env[name]?.trim();
  if (!v) return [];
  return v
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);
}

function toISODate(item: RSSItem): string | null {
  const raw = item.isoDate || item.pubDate;
  if (!raw) return null;
  const d = new Date(raw);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

function domainFromUrl(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, ""); }
  catch { return "unknown"; }
}

function normalizeText(s: string | undefined): string {
  return (s || "").toLowerCase();
}

function matchesKeywords(item: RSSItem, keywords: string[]): boolean {
  const hay = normalizeText(
    [item.title, item.contentSnippet, item.content].filter(Boolean).join(" ")
  );
  if (!hay) return false;
  return keywords.some(kw => hay.includes(kw.toLowerCase()));
}

function dedupe(items: NewsItem[]): NewsItem[] {
  const seen = new Set<string>();
  const out: NewsItem[] = [];
  for (const it of items) {
    const key = `${it.title.toLowerCase()}|${it.link}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push(it);
    }
  }
  return out;
}

async function fetchFeed(url: string, opt: Required<FetchNewsOptions>): Promise<NewsItem[]> {
  try {
    const feed = await parser.parseURL(url);
    const since = Date.now() - opt.hoursBack * 3600 * 1000;
    const items: NewsItem[] = [];

    for (const e of feed.items.slice(0, opt.maxPerFeed * 3)) {
      const iso = toISODate(e);
      if (!iso) continue;
      if (new Date(iso).getTime() < since) continue;
      if (opt.requireKeywordMatch && !matchesKeywords(e, opt.keywords)) continue;

      const link = e.link || "";
      const title = (e.title || "").trim();
      if (!link || !title) continue;

      items.push({
        title,
        link,
        publishedAt: iso,
        source: domainFromUrl(link) || domainFromUrl(url)
      });

      if (items.length >= opt.maxPerFeed) break;
    }

    return items;
  } catch {
    // Игнорирай паднали фийдове — продължаваме със следващите
    return [] as NewsItem[];
  }
}

export async function fetchNews(options: FetchNewsOptions = {}): Promise<NewsItem[]> {
  const feeds = [
    ...splitEnvList("NEWS_FEED_SOURCES"),
    ...splitEnvList("INTERNATIONAL_FEEDS")
  ];

  const opt: Required<FetchNewsOptions> = {
    hoursBack: options.hoursBack ?? 72,
    keywords: (options.keywords?.length ? options.keywords : DEFAULT_KEYWORDS),
    maxPerFeed: options.maxPerFeed ?? 30,
    maxTotal: options.maxTotal ?? 150,
    requireKeywordMatch: options.requireKeywordMatch ?? true
  };

  if (!feeds.length) return [];

  // паралелно, но без доп. зависимости; Promise.allSettled е достатъчно
  const results = await Promise.allSettled(feeds.map(f => fetchFeed(f, opt)));
  const merged = results.flatMap(r => (r.status === "fulfilled" ? r.value : []));

  // премахни дубликати и сортирай
  const unique = dedupe(merged).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return unique.slice(0, opt.maxTotal);
}

/* ---- пример за CLI пускане (по избор) ----
if (require.main === module) {
  fetchNews({ hoursBack: 48, maxTotal: 100 }).then(list => {
    console.log(JSON.stringify(list, null, 2));
  });
}
*/

