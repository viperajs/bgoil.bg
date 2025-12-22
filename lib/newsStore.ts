import 'server-only'
import { Redis } from '@upstash/redis'
import { promises as fs } from 'fs'
import path from 'path'

type NewsArticle = {
  id: string
  title: string
  content: string
  date: string
  category: string
  source?: string
  link?: string
}

interface NewsConfig {
  enabled: boolean
}

const KEY = 'news:articles:v1'
const NEWS_CONFIG_KEY = 'news:config:v1'
const MAX_ARTICLES = 6
const DATA_DIR = path.join(process.cwd(), 'data')
const NEWS_CONFIG_FILE = path.join(DATA_DIR, 'news-config.json')

// ---- Redis клиент ----
function getRedis() {
  const url = process.env.UPSTASH_REDIS_KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_KV_REST_API_TOKEN
  if (!url || !token) return null
  try {
    console.log('Upstash host:', new URL(url).hostname)
  } catch {}
  return new Redis({ url, token })
}
const redis = getRedis()

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Get news config (enabled/disabled)
export async function getNewsConfig(): Promise<NewsConfig> {
  // Try Redis first
  if (redis) {
    try {
      const val = (await redis.get(NEWS_CONFIG_KEY as any)) as unknown
      if (val != null) {
        if (typeof val === 'string') {
          try {
            return JSON.parse(val) as NewsConfig
          } catch {
            // fall through to file
          }
        }
        if (typeof val === 'object') {
          return val as NewsConfig
        }
      }
    } catch (e) {
      console.error('newsStore: redis.get config failed:', (e as Error).message)
    }
  }

  // Fallback to file
  try {
    await ensureDataDir()
    const content = await fs.readFile(NEWS_CONFIG_FILE, 'utf-8')
    return JSON.parse(content) as NewsConfig
  } catch {
    // Return default
    const defaultConfig: NewsConfig = {
      enabled: true,
    }
    await saveNewsConfig(defaultConfig)
    return defaultConfig
  }
}

// Save news config
export async function saveNewsConfig(config: NewsConfig): Promise<void> {
  // Save to Redis if available
  if (redis) {
    try {
      await redis.set(NEWS_CONFIG_KEY, config as any)
    } catch (e) {
      console.error('newsStore: redis.set config failed:', (e as Error).message)
    }
  }

  // Also save to file as backup
  try {
    await ensureDataDir()
    await fs.writeFile(NEWS_CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8')
  } catch (e) {
    console.error('newsStore: file save config failed:', (e as Error).message)
  }
}

// ---- безопасно четене от KV ----
export async function getNewsArticles(): Promise<NewsArticle[]> {
  if (!redis) {
    // Fallback to default articles if Redis is not available
    return getDefaultArticles()
  }
  try {
    const val = (await redis.get(KEY as any)) as unknown
    if (val == null) {
      // Initialize with default articles
      const defaultArticles = getDefaultArticles()
      await setNewsArticles(defaultArticles)
      return defaultArticles
    }

    if (typeof val === 'string') {
      try {
        return JSON.parse(val) as NewsArticle[]
      } catch (e) {
        console.error('newsStore: parse failed (string)', e)
        return getDefaultArticles()
      }
    }
    if (Array.isArray(val)) {
      return val as NewsArticle[]
    }
    return getDefaultArticles()
  } catch (e) {
    console.error('newsStore: redis.get failed:', (e as Error).message)
    return getDefaultArticles()
  }
}

// ---- добавяне на нова новина (отива отпред, последната се трие) ----
export async function addNewsArticle(article: Omit<NewsArticle, 'id' | 'date'>): Promise<NewsArticle[]> {
  const existing = await getNewsArticles()
  
  const newArticle: NewsArticle = {
    ...article,
    id: `news-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    date: new Date().toISOString(),
  }

  // Добавяме новата новина отпред
  const updated = [newArticle, ...existing]
  
  // Ограничаваме до MAX_ARTICLES (премахваме последната ако има повече)
  const trimmed = updated.slice(0, MAX_ARTICLES)

  if (redis) {
    try {
      await redis.set(KEY, JSON.stringify(trimmed))
    } catch (e) {
      console.error('newsStore: redis.set failed:', (e as Error).message)
    }
  }

  return trimmed
}

// ---- обновяване на новина ----
export async function updateNewsArticle(id: string, article: Omit<NewsArticle, 'id' | 'date'>): Promise<NewsArticle[]> {
  const existing = await getNewsArticles()
  const index = existing.findIndex(a => a.id === id)
  
  if (index === -1) {
    throw new Error(`Article with id ${id} not found`)
  }

  // Запазваме оригиналната дата
  const updatedArticle: NewsArticle = {
    ...article,
    id: existing[index].id,
    date: existing[index].date,
  }

  const updated = [...existing]
  updated[index] = updatedArticle

  if (redis) {
    try {
      await redis.set(KEY, JSON.stringify(updated))
    } catch (e) {
      console.error('newsStore: redis.set failed:', (e as Error).message)
    }
  }

  return updated
}

// ---- изтриване на новина ----
export async function deleteNewsArticle(id: string): Promise<NewsArticle[]> {
  const existing = await getNewsArticles()
  const filtered = existing.filter(a => a.id !== id)

  if (redis) {
    try {
      await redis.set(KEY, JSON.stringify(filtered))
    } catch (e) {
      console.error('newsStore: redis.set failed:', (e as Error).message)
    }
  }

  return filtered
}

// ---- запис на новини ----
async function setNewsArticles(articles: NewsArticle[]): Promise<void> {
  if (!redis) return
  try {
    await redis.set(KEY, JSON.stringify(articles))
  } catch (e) {
    console.error('newsStore: redis.set failed:', (e as Error).message)
  }
}

// ---- дефолтни новини ----
function getDefaultArticles(): NewsArticle[] {
  return [
    {
      id: "1",
      title: "Нови цени на горивата за септември 2024",
      content: "Според последните данни от пазара на горива, цените на бензина и дизела остават стабилни през септември. Очаква се леко увеличение на търсенето поради началото на учебната година. BG OIL продължава да предлага конкурентни цени и специални отстъпки за членове на клубната програма.",
      date: new Date().toISOString(),
      category: "Цени",
      source: "AI Analysis",
      link: "/products"
    },
    {
      id: "2",
      title: "Екологични горива - бъдещето на транспорта",
      content: "Повишеното внимание към екологичните решения в транспорта води до растеж на търсенето на алтернативни горива. BG OIL инвестира в модерни технологии за зареждане на електрически и хибридни превозни средства. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      date: new Date(Date.now() - 86400000).toISOString(),
      category: "Екология",
      source: "AI Analysis",
      link: "/about"
    },
    {
      id: "3",
      title: "Подобрения в качеството на горивата",
      content: "Производителите на горива продължават да подобряват качеството на своите продукти, като добавят нови добавки за по-добра производителност на двигателите. BG OIL работи само с сертифицирани доставчици, гарантиращи най-високо качество. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      date: new Date(Date.now() - 172800000).toISOString(),
      category: "Качество",
      source: "AI Analysis",
      link: "/products"
    },
    {
      id: "4",
      title: "Трендове в автомобилната индустрия",
      content: "Автомобилната индустрия преминава през значителни промени с фокус върху устойчивост и ефективност. Това се отразява и на пазара на горива, където се наблюдава увеличение на търсенето на премиум горива. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      date: new Date(Date.now() - 259200000).toISOString(),
      category: "Индустрия",
      source: "AI Analysis",
      link: "/news-feed"
    },
    {
      id: "5",
      title: "Специални оферти за лоялни клиенти",
      content: "BG OIL въвежда нови програми за лоялност с допълнителни отстъпки и бонуси за редовни клиенти. Членовете на клубната програма могат да се възползват от ексклузивни оферти и приоритетно обслужване. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      date: new Date(Date.now() - 345600000).toISOString(),
      category: "Оферти",
      source: "AI Analysis",
      link: "/products"
    },
    {
      id: "6",
      title: "Безопасност при работа с горива",
      content: "Спазването на стандартите за безопасност е от първостепенно значение при работа с горива. BG OIL следва най-строгите протоколи за безопасност и редовно провежда обучения на персонала. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
      date: new Date(Date.now() - 432000000).toISOString(),
      category: "Безопасност",
      source: "AI Analysis",
      link: "/about"
    }
  ]
}

