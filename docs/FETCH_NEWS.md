# FetchNews Module

Прост TypeScript модул за взимане на новини от RSS източници, филтриране по ключови думи и време.

## Конфигурация

Добавете в `.env` файла:

```env
# Български източници (RSS URLs, разделени със запетая)
NEWS_FEED_SOURCES=https://www.investor.bg/rss.php?rub=168,https://www.money.bg/rss.html,https://www.bta.bg/bg/rss,https://www.dir.bg/rss/biznes,https://www.capital.bg/rss/energy/,https://bnr.bg/rss/energy,https://business.dir.bg/rss,https://nova.bg/rss/category/26/ikonomika

# Международни източници (RSS URLs, разделени със запетая)
INTERNATIONAL_FEEDS=https://oilprice.com/rss/main,https://feeds.reuters.com/reuters/energyNews,https://feeds.bloomberg.com/feeds/energy.rss,https://www.spglobal.com/rss/energy.xml,https://www.euractiv.com/section/energy-environment/feed/
```

## Използване

### Директно в код

```typescript
import { fetchNews } from "@/lib/fetchNews";

const news = await fetchNews({
  hoursBack: 72, // последните 3 дни (по подразбиране 72)
  maxPerFeed: 25, // максимум на източник (по подразбиране 30)
  maxTotal: 120, // глобален максимум (по подразбиране 150)
  requireKeywordMatch: true, // взима само релевантни към горива (по подразбиране true)
});

// news е масив от { title, link, publishedAt, source }
```

### Чрез API endpoint

```typescript
// GET /api/news-feed/simple
// Query parameters:
//   - hoursBack: number (по подразбиране 72)
//   - maxPerFeed: number (по подразбиране 30)
//   - maxTotal: number (по подразбиране 150)
//   - requireKeywordMatch: boolean (по подразбиране true)

const response = await fetch("/api/news-feed/simple?hoursBack=48&maxTotal=100");
const data = await response.json();
```

## Характеристики

- ✅ Чете източниците от `.env` (NEWS_FEED_SOURCES + INTERNATIONAL_FEEDS)
- ✅ Филтрира по ключови думи (горива, бензин, дизел, LPG, ОПЕК и т.н.)
- ✅ Реже по време (напр. последните 48 часа)
- ✅ Ограничава брой елементи на източник и общо
- ✅ Маха дубликати
- ✅ Сортира по дата (най-новите първо)
- ✅ Паралелна обработка на източници
- ✅ Игнорира паднали фийдове

## Ключови думи по подразбиране

### Български

- гориво, горива, бензин, дизел, lpg, метан, пропан, газ
- бензиностанция, бензиностанции, нефт, петрол, акциз, цена, цените
- рафинерия, лукойл, омв, shell, eko, petrol, rompetrol, nis

### Английски

- fuel, gasoline, diesel, petrol, lpg, autogas, refinery
- opec, brent, wti, crude, oil, gas station, petrol station

## Типове

```typescript
export type NewsItem = {
  title: string;
  link: string;
  publishedAt: string; // ISO
  source: string; // domain / feed origin
};

export type FetchNewsOptions = {
  hoursBack?: number; // колко часа назад да гледаме (по подразб. 72)
  keywords?: string[]; // ключови думи за филтриране
  maxPerFeed?: number; // максимум на източник (по подразб. 30)
  maxTotal?: number; // глобален максимум (по подразб. 150)
  requireKeywordMatch?: boolean; // ако е false, взима всичко по тема време; ако е true — и по ключови думи
};
```

## Разлики с newsFeedETL

`fetchNews` е по-прост модул който:

- Не записва в база данни
- Не генерира AI резюмета
- Не извлича пълното съдържание на статиите
- Само филтрира и връща новини

Използвайте го когато искате:

- Бързо взимане на новини без база данни
- Прост филтър по ключови думи
- API endpoint който връща филтрирани новини

За пълна обработка (резюмета, база данни, AI) използвайте `/api/news-feed/refresh`.
