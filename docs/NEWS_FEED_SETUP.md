# News Feed System - SQLite Setup

## Инсталация

Зависимостите са вече инсталирани:

- `rss-parser` - за парсиране на RSS feeds
- `cheerio` - за извличане на текст от HTML страници
- `better-sqlite3` - за SQLite база данни
- `dayjs` - за работа с дати
- `openai` - за AI резюмета
- `undici` - за fetch заявки

## Конфигурация

Създайте `.env` файл в root директорията с:

```env
# Base URL на приложението
BASE_URL=https://bgoil-vraca.com
NEXT_PUBLIC_BASE_URL=https://bgoil-vraca.com

# OpenAI API ключ за генериране на резюмета
OPENAI_API_KEY=скрий-тук-ключа

# RSS източници (CSV списък)
# Препоръчани източници:
NEWS_FEED_SOURCES=https://www.investor.bg/rss.php?rub=9,https://oilprice.com/rss/main,https://www.reuters.com/markets/commodities/rss,https://www.segabg.com/rss,https://www.economedia.bg/rss.php?rubrid=51

# RSS защита (secret key за достъп)
RSS_SECRET=your-secret-key-here

# Опционално: Basic Auth за RSS (ако не използваш secret key)
ADMIN_USER=admin
ADMIN_PASS=your-password

# Опционално: Път към SQLite базата данни (по подразбиране: news.db в root директорията)
# NEWS_DB_PATH=./data/news.db

# Опционално: Токен за автентикация на refresh endpoint (POST)
# NEWS_FEED_INGEST_TOKEN=your-secret-token
```

**ВАЖНО:** `NEWS_FEED_SOURCES` е CSV списък с RSS източници. Добавете реалните си RSS-и тук.

## RSS Защита

RSS endpoint-ът е защитен и изисква:

- **Secret key** в query параметър: `/api/news-feed/rss?key=YOUR_SECRET`
- **ИЛИ** Basic Auth с `ADMIN_USER` и `ADMIN_PASS`

Ако няма валидна автентикация, endpoint-ът връща 404 (за да "скрие" ресурса).

В UI-то RSS бутонът се показва само за админи (cookie `isAdmin=true`).

## API Endpoints

### 1. Ръчно обновяване (refresh)

**GET** `/api/news-feed/refresh`

Събира новини от RSS източниците, филтрира по ключови думи, извлича текст от страниците, прави AI резюме на български и ги записва в SQLite.

**Отговор:**

```json
{
  "ok": true,
  "scanned": 50,
  "relevant": 12,
  "inserted": 12,
  "summarized": 8,
  "errors": 0,
  "sources": 3,
  "took_ms": 45000
}
```

**POST** `/api/news-feed/refresh` - същото като GET, но с опционална автентикация чрез `Authorization: Bearer <token>` header.

### 2. Списък за UI (list)

**GET** `/api/news-feed/list?limit=30&q=бензин&from=2024-01-01&to=2024-12-31`

Връща JSON списък със статии за UI-то.

**Query параметри:**

- `limit` - брой статии (максимум 100, по подразбиране 30)
- `q` - търсене в заглавие/резюме
- `from` - начална дата (ISO формат)
- `to` - крайна дата (ISO формат)

**Отговор:**

```json
[
  {
    "id": "abc123...",
    "url": "https://example.com/article",
    "title": "Заглавие на статията",
    "source": "Дневник",
    "published_at": "2024-01-15T10:00:00Z",
    "summary": "Резюме на български...",
    "topics": ["горива", "бензин", "дизел"],
    "key_facts": ["Brent +2.3% до $83.4", "Акцизът остава непроменен"],
    "entities": ["Лукойл", "МИЕ", "ЕК"],
    "topic": "Цени",
    "lead_image": "https://example.com/image.jpg",
    "author": "Иван Петров",
    "reading_time": 3
  }
]
```

**Нови полета:**

- `key_facts` - масив с ключови факти (числа, проценти, дати)
- `entities` - масив с компании/институции/географски обекти
- `topic` - тема/категория (Цени, Регулации, Индустрия, Екология, Качество, Оферти, Безопасност)
- `lead_image` - URL на основна снимка от статията
- `author` - автор на статията
- `reading_time` - приблизително време за четене в минути

### 3. RSS Feed

**GET** `/api/news-feed/rss`

Генерира валиден RSS feed с `<item>` елементи.

**Отговор:** XML RSS feed

### 4. Health Check

**GET** `/api/news-feed/health`

Връща здравословен статус на системата.

**Отговор:**

```json
{
  "ok": true,
  "published": 45,
  "sources": 3
}
```

## Как да го ползваш

### Стъпка 1: Конфигурирай .env

Добави реални RSS източници в `NEWS_FEED_SOURCES` и OpenAI API ключ.

### Стъпка 2: Стартирай Next.js

```bash
npm run dev
```

### Стъпка 3: Ръчно събиране на новини

Отвори в браузър или използвай curl:

```bash
curl http://localhost:3000/api/news-feed/refresh
```

Това ще:

1. Сканира всички RSS източници
2. Филтрира по ключови думи
3. Извлича текст от страниците
4. Генерира AI резюмета на български
5. Записва в SQLite базата

### Стъпка 4: Проверка на резултата

```bash
# Виж списъка
curl http://localhost:3000/api/news-feed/list?limit=10

# Виж RSS
curl http://localhost:3000/api/news-feed/rss

# Health check
curl http://localhost:3000/api/news-feed/health
```

## Интеграция в UI

### Бутон "Обнови"

```typescript
const handleRefresh = async () => {
  const res = await fetch("/api/news-feed/refresh");
  const data = await res.json();
  console.log("Refresh result:", data);
  // Рефрешни списъка след това
  await refetchArticles();
};
```

### Списък в UI

```typescript
const fetchArticles = async (filters?: {
  q?: string;
  from?: string;
  to?: string;
}) => {
  const params = new URLSearchParams();
  if (filters?.q) params.set("q", filters.q);
  if (filters?.from) params.set("from", filters.from);
  if (filters?.to) params.set("to", filters.to);

  const res = await fetch(`/api/news-feed/list?${params}`);
  const articles = await res.json();
  return articles;
};
```

### RSS линк

```tsx
<a href="/api/news-feed/rss" target="_blank">
  RSS Feed
</a>
```

## Често срещани проблеми

### Празен RSS

**Причина:** В SQLite няма статии със `status='PUBLISHED'`.

**Решение:** Пусни `/api/news-feed/refresh`, провери `.env` за източници.

### Няма резюме

**Причина:** `OPENAI_API_KEY` не е настроен или е невалиден.

**Решение:** Провери `.env` файла. Ако няма ключ, статията ще се запише без резюме.

### Няма извлечен текст

**Причина:** Някои сайтове пазят съдържанието в нестандартни контейнери.

**Решение:** Смени селектора в `fetchArticleBody` функцията в `app/api/news-feed/refresh/route.ts`.

### Дубликати

**Решение:** Системата пази `url` уникално и използва `id` като SHA-256 хеш. Дубликатите се обновяват автоматично.

### Бавен refresh

**Причина:** Твърде много източници или бавни RSS feeds.

**Решение:** Започни с 3–5 RSS-а; при нужда добави паралелизъм или пакетиране.

## Структура на базата данни

SQLite таблица `articles`:

```sql
CREATE TABLE articles (
  id TEXT PRIMARY KEY,              -- SHA-256 хеш на URL
  url TEXT UNIQUE,                  -- URL на статията
  title TEXT,                       -- Заглавие
  source TEXT,                      -- Източник (RSS feed име)
  published_at TEXT,                -- ISO дата на публикуване
  lang TEXT,                        -- Език (bg/en)
  summary_bg TEXT,                  -- AI резюме на български
  topics TEXT,                      -- CSV списък с ключови думи
  status TEXT DEFAULT 'PUBLISHED',  -- Статус
  created_at TEXT DEFAULT (datetime('now')),
  -- Нови полета (добавени чрез миграция):
  key_facts TEXT,                   -- JSON масив с ключови факти
  entities TEXT,                     -- JSON масив с компании/институции
  topic TEXT,                        -- Тема/категория
  lead_image TEXT,                   -- URL на основна снимка
  author TEXT,                       -- Автор на статията
  reading_time INTEGER               -- Време за четене в минути
);
```

**Автоматична миграция:** При първо стартиране системата автоматично добавя новите колони ако не съществуват.

## Ключови думи за филтриране

Системата филтрира статии по следните ключови думи:

- **Силни:** горива, гориво, бензин, дизел, lpg, пропан-бутан, нефт, brent, wti, барел, рафинерия, акциз, цени на горивата, бензиностанции, котировки
- **Слаби:** цени, литър, петрол, рафинер

Статията е релевантна ако има поне една силна ключова дума или две слаби.
