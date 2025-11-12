# News Feed System - Документация

## Преглед

Системата за събиране и показване на новини за горива автоматично събира статии от RSS източници, филтрира по релевантност, генерира AI резюмета на български и ги показва в уеб интерфейс.

## Компоненти

### 1. Database Store (`lib/newsFeedStore.ts`)

- Съхранение на новини в Redis/Upstash
- Дедупликация по URL
- Филтриране и търсене
- Статистика

### 2. ETL Процес (`lib/newsFeedETL.ts`)

- Парсиране на RSS feeds
- Филтриране по релевантност (ключови думи)
- Детекция на език
- Генериране на AI резюмета
- Извличане на ключови думи

### 3. API Endpoints

#### GET `/api/news-feed`

Връща списък с новини в JSON формат.

**Параметри:**

- `limit` - брой статии (по подразбиране: 20)
- `from` - начална дата (ISO формат)
- `to` - крайна дата (ISO формат)
- `source` - филтър по източник
- `lang` - филтър по език (`bg` или `en`)
- `category` - филтър по категория
- `q` - търсене по текст

**Пример:**

```
GET /api/news-feed?limit=10&from=2024-01-01T00:00:00Z&lang=bg&q=бензин
```

#### GET `/api/news-feed/rss`

Връща RSS feed с новините.

**Параметри:** Същите като JSON endpoint.

**Пример:**

```
GET /api/news-feed/rss?limit=30
```

#### POST `/api/news-feed/ingest`

Задейства ETL процеса за събиране на новини от конфигурираните RSS източници.

**Автентикация:** Опционално чрез `Authorization: Bearer <token>` header (конфигурира се чрез `NEWS_FEED_INGEST_TOKEN` env variable).

**Body (опционално):**

```json
{
  "feedUrl": "https://example.com/rss",
  "sourceName": "Example Source"
}
```

Ако не се подаде body, обработва всички конфигурирани източници от `RSS_SOURCES` в `app/api/news-feed/ingest/route.ts`.

#### GET `/api/news-feed/health`

Връща здравословен статус и статистика на системата.

### 4. UI Компоненти

#### Страница: `/news-feed`

Пълна страница с новини, търсене и филтри.

#### Компонент: `NewsSection` (на началната страница)

Показва последните 3 новини в секция с id "нови".

## Конфигурация

### RSS Източници

Редактирайте `app/api/news-feed/ingest/route.ts` и добавете източници в `RSS_SOURCES`:

```typescript
const RSS_SOURCES = [
  {
    url: "https://example.com/rss",
    name: "Example Source",
  },
];
```

### Environment Variables

```bash
# Redis/Upstash (задължително)
UPSTASH_REDIS_KV_REST_API_URL=...
UPSTASH_REDIS_KV_REST_API_TOKEN=...

# OpenAI API (задължително за AI резюмета)
OPENAI_API_KEY=sk-...

# Опционално - за автентикация на ingest endpoint
NEWS_FEED_INGEST_TOKEN=your-secret-token

# Base URL за RSS links
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

**За OpenAI API ключ:**

1. Регистрирайте се на https://platform.openai.com
2. Създайте API ключ от секцията "API Keys"
3. Добавете го като environment variable `OPENAI_API_KEY`
4. Системата използва `gpt-4o-mini` модела (по-евтин вариант, подходящ за резюмета)

## Автоматично Обновяване

За автоматично събиране на новини, настройте cron job или scheduled task, който да извиква:

```bash
POST /api/news-feed/ingest
Authorization: Bearer <your-token>
```

**Препоръчителна честота:** Веднъж на всеки 1-2 часа.

## Ключови Думи за Релевантност

Системата филтрира статии по следните ключови думи:

**Силни ключови думи** (поне една трябва да присъства):

- горива, бензин, дизел, LPG, пропан-бутан
- нефт, Brent, WTI
- рафинерия, акциз, цени на горивата
- барел, котировки, бензиностанции

**Слаби ключови думи** (трябват поне две):

- цени, цена, пазар, енергия
- транспорт, автомобил, автомобили

## AI Резюме

Системата използва **OpenAI GPT-4o-mini** за генериране на резюмета на български език.

**Как работи:**

- Автоматично превежда и резюмира статии на английски на български
- Генерира 3-4 изречения, фактологични и неутрални
- Запазва числа, дати и конкретни данни
- Фокус върху ключовата информация за пазара на горива

**Fallback режим:**
Ако OpenAI API ключът не е наличен, системата автоматично използва fallback метод (първите 3-4 изречения от текста).

**Конфигурация:**

- Модел: `gpt-4o-mini` (по-евтин вариант)
- Temperature: `0.3` (за по-фактологични резюмета)
- Max tokens: `300` (ограничава дължината)

## Категории

Автоматично определяне на категория по ключови думи:

- **Регулации** - акциз, регулация, tax, regulation
- **Екология** - екология, екологичен, eco, green
- **Качество** - качество, стандарт, quality, standard
- **Индустрия** - рафинерия, логистика, refinery, logistics
- **Оферти** - оферта, отстъпка, offer, discount
- **Безопасност** - безопасност, safety, security
- **Цени** - по подразбиране

## Важни Новини

Статии се маркират като важни, ако съдържат:

- акциз, санкции, спиране на рафинерия, регулаторни промени
- tax, sanctions, refinery shutdown, regulatory

## Дедупликация

Системата автоматично предотвратява дублиране на статии чрез SHA-256 хеш на URL адреса.

## Ограничения

- Максимум 30 дни назад (стари статии се игнорират)
- Максимум 1000 статии в базата (най-старите се премахват автоматично)
- Максимум 50KB пълно съдържание на статия

## Тестване

### Тест на AI Резюме

Използвайте endpoint `/api/news-feed/test-summary` за тестване на AI резюметата:

```bash
# GET - Проверка на конфигурацията
curl http://localhost:3000/api/news-feed/test-summary

# POST - Тест на резюме
curl -X POST http://localhost:3000/api/news-feed/test-summary \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Цените на бензина растат с 5%",
    "content": "Според последните данни от пазара на горива, цените на бензина са се увеличили с 5% през последния месец. Това се дължи на повишените цени на суровия петрол и промените в акцизите.",
    "language": "bg"
  }'
```

### Първо събиране на новини

1. Конфигурирайте RSS източници в `app/api/news-feed/ingest/route.ts`
2. Добавете OpenAI API ключ в environment variables
3. Извикайте ingest endpoint:

```bash
curl -X POST http://localhost:3000/api/news-feed/ingest \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

Или за конкретен източник:

```bash
curl -X POST http://localhost:3000/api/news-feed/ingest \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "feedUrl": "https://example.com/rss",
    "sourceName": "Example Source"
  }'
```

## Подобрения за V2

- [x] Реална AI интеграция за резюме и превод (OpenAI GPT-4o-mini)
- [ ] Email абонаменти
- [ ] Telegram бот/канал
- [ ] Тенденции и анализи
- [ ] Исторически данни и експорти
- [ ] По-сложни филтри и търсене
