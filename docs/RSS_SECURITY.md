# RSS Security Guide

## Защита на RSS Endpoint

RSS endpoint-ът (`/api/news-feed/rss`) е защитен и изисква автентикация.

## Методи за автентикация

### Вариант 1: Secret Key (Query Parameter)

Добави в `.env`:
```env
RSS_SECRET=your-secret-key-here
```

Използване:
```
GET /api/news-feed/rss?key=your-secret-key-here
```

### Вариант 2: Basic Auth

Добави в `.env`:
```env
ADMIN_USER=admin
ADMIN_PASS=your-password
```

Използване:
```bash
curl -u admin:your-password http://localhost:3000/api/news-feed/rss
```

Или в браузър: браузърът ще поиска username/password.

### Комбинация

Можеш да използваш и двата метода едновременно - ако някой от тях е валиден, достъпът е разрешен.

## Скриване от UI

RSS бутонът в UI-то се показва само ако има cookie `isAdmin=true` или `admin=true`.

За да зададеш админ cookie (за тестване):
```javascript
document.cookie = "isAdmin=true; path=/"
```

## Privacy Headers

RSS endpoint-ът автоматично добавя:
- `X-Robots-Tag: noindex, nofollow` - предотвратява индексиране от търсачки

## 404 вместо 401

При невалидна автентикация endpoint-ът връща 404 вместо 401, за да "скрие" съществуването на ресурса от неоторизирани потребители.

## Best Practices

1. **Не използвай публичен secret key** - не добавяй `NEXT_PUBLIC_RSS_SECRET` в client-side код
2. **Използвай Basic Auth за RSS читатели** - повечето RSS читатели поддържат Basic Auth
3. **Ротация на ключовете** - сменяй secret key периодично
4. **IP Allowlist (опционално)** - можеш да добавиш IP филтриране в `requireRssAccess` функцията

## Пример за IP Allowlist

```typescript
function requireRssAccess(request: Request): boolean {
  const allowedIPs = (process.env.RSS_ALLOWED_IPS || '').split(',').map(ip => ip.trim())
  const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || ''
  
  if (allowedIPs.length > 0 && !allowedIPs.includes(clientIP)) {
    return false
  }
  
  // ... останалата логика за secret key и Basic Auth
}
```








