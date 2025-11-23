# Бърз старт - News Feed System

## Проблем: Няма информация / Празен списък

Ако виждате съобщение "Няма налични новини в момента", това означава че базата данни е празна. Ето как да добавите първите новини:

## Стъпка 1: Конфигурирайте RSS източници

Редактирайте `app/api/news-feed/ingest/route.ts` и добавете реални RSS източници:

```typescript
const RSS_SOURCES = [
  {
    url: "https://www.dnevnik.bg/rss/?rubrid=3", // Пример
    name: "Дневник",
  },
  // Добавете повече източници тук
];
```

## Стъпка 2: Извикайте Ingest Endpoint

### Вариант A: От браузъра (за тестване)

Отворете в браузъра:

```
http://localhost:3000/api/news-feed/ingest
```

Или използвайте POST заявка:

```bash
curl -X POST http://localhost:3000/api/news-feed/ingest
```

### Вариант B: От код (за production)

Създайте admin страница или използвайте cron job:

```typescript
// Пример: app/admin/news-feed-ingest/page.tsx
"use client";

export default function IngestPage() {
  const handleIngest = async () => {
    const res = await fetch("/api/news-feed/ingest", {
      method: "POST",
      headers: {
        Authorization: "Bearer YOUR_TOKEN", // Ако имате токен
      },
    });
    const data = await res.json();
    console.log("Ingest result:", data);
  };

  return <button onClick={handleIngest}>Събери новини</button>;
}
```

## Стъпка 3: Проверете резултата

След извикване на ingest endpoint:

1. Проверете конзолата за грешки
2. Отидете на `/news-feed` - трябва да видите новини
3. Проверете `/api/news-feed/health` за статистика

## Често срещани проблеми

### Проблем: "Failed to fetch RSS"

- Проверете дали RSS URL-ът е валиден
- Някои сайтове блокират автоматични заявки
- Опитайте с друг RSS източник

### Проблем: "No relevant articles found"

- RSS източникът може да няма статии за горива
- Проверете ключовите думи в `lib/newsFeedETL.ts`
- Опитайте с друг източник

### Проблем: "OpenAI API error"

- Проверете дали `OPENAI_API_KEY` е настроен правилно
- Системата ще работи и без OpenAI (с fallback резюмета)
- Проверете баланса на OpenAI акаунта

## Автоматично събиране

За автоматично събиране на новини всеки час, добавете в `app/api/news-feed/ingest/route.ts`:

```typescript
// В началото на файла
export const revalidate = 3600; // 1 час
```

Или използвайте Vercel Cron Jobs:

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/news-feed/ingest",
      "schedule": "0 * * * *"
    }
  ]
}
```

## Тестване

1. Тест на AI резюме:

```
POST /api/news-feed/test-summary
{
  "title": "Цените на бензина растат",
  "content": "Текст...",
  "language": "bg"
}
```

2. Проверка на здравословен статус:

```
GET /api/news-feed/health
```

3. Проверка на данни:

```
GET /api/news-feed?limit=5
```






