# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Next.js 16 (App Router) marketing site for BG OIL, a gas station in Vratsa, Bulgaria (24/7 shop, fuel prices, auto service, hotel, promos, an AI-assisted fuel news feed). Code comments and UI copy are largely in Bulgarian.

## Commands

```bash
npm run dev      # start dev server (localhost:3000)
npm run build    # production build
npm run start    # run production build
npm run lint     # next lint
```

There is no test suite configured. `next.config.mjs` sets `typescript.ignoreBuildErrors: true`, so `npm run build` succeeding does **not** mean the code type-checks — run `tsc --noEmit` or check editor diagnostics separately when correctness matters.

### Local admin login

Admin routes 500 with "Конфигурационна грешка" unless `.env.local` has `ADMIN_USER` / `ADMIN_PASS` set (see `.env.local` in the repo root, gitignored).

## Architecture

### Route groups

- `app/(site)/` + top-level pages (`app/page.tsx`, `app/hotel`, `app/shop`, `app/products`, `app/about`, `app/contact`) — public marketing pages.
- `app/(admin)/` — admin dashboard pages (`admin`, `admin-hotel`, `admin-prices`, `admin-shop`, `admin-promo`, `admin-promo-ai`, `admin/login`, `admin/2fa`). Its `layout.tsx` provides the sidebar shell.
- `app/api/` — route handlers backing both the public site (`fuel`, `hotel`, `promo`, `news*`) and admin CRUD (`api/admin/*`).

### Admin auth

Auth is a signed session, not a hardcoded cookie:

- `lib/adminSession.ts` derives a deterministic HMAC-SHA256 token from `ADMIN_USER`/`ADMIN_PASS` (Web Crypto, so it works in both Node and Edge runtime) and compares it in constant time. There's a Basic Auth fallback (`checkBasicAuth`) for scripts/curl.
- `middleware.ts` gatekeeps all `/admin*` page routes (see its `matcher`) using the signed cookie, falling back to Basic Auth and setting the cookie if that succeeds.
- `lib/auth.ts` (`requireAdmin`, `unauthorizedResponse`) is the equivalent guard for API route handlers, since middleware doesn't parse cookies the same way route handlers do.
- Any new `/admin-*` page needs to be added to the `matcher` array in `middleware.ts` or it will be served unauthenticated.

### Persistence: JSON-file-first, Redis-mirrored

Most admin-editable content (hotel rooms/info, products, promos, discount banner, fuel prices) goes through `lib/jsonKvStore.ts`, a small store factory rather than a real database:

- **Read**: local `.data/*.json` file first; if missing, falls back to Upstash Redis (and backfills the local file). A transient Redis error is *thrown*, not swallowed, so a network blip can't be mistaken for "no data" and overwrite real state on next write.
- **Write**: always writes the local file; also mirrors to Redis if configured (`UPSTASH_REDIS_KV_REST_API_URL`/`_TOKEN`). Missing/failed Redis auth degrades to local-file-only (logged, not thrown).
- **withLock**: serializes read-modify-write mutations within a process (no cross-instance locking — fine for a single Vercel function but not a distributed guarantee).
- Per-domain stores (`lib/hotelStore.ts`, `lib/roomsStore.ts`, `lib/fuelStore.ts`, `lib/promoStore.ts`, `lib/productsStore.ts`, `lib/discountBannerStore.ts`, `lib/newsStore.ts`) each wrap `createJsonKvStore` with their own Redis key / filename / default value — follow that pattern for new admin-editable content rather than inventing a new persistence mechanism.
- `.data/` is gitignored local dev state; in production on Vercel, Redis is the only persistent layer (the local file lives on ephemeral function storage), so any new store **must** be wired to Redis to survive deploys.
- Photo uploads (`app/api/admin/upload`) go to Vercel Blob (`BLOB_READ_WRITE_TOKEN`) when configured, else fall back to local `public/uploads/` (also gitignored, also ephemeral in prod).

### News feed subsystem

A separate, more involved ETL pipeline for fuel-market news, distinct from the JSON-KV stores above:

- `lib/newsFeedETL.ts` — fetches RSS sources, filters by relevance keywords (`lib/newsFeedKeywords.ts`, `lib/newsFeedRelevance.ts`), detects language, extracts key facts, and generates Bulgarian AI summaries.
- `lib/newsFeedStore.ts` — Redis-backed storage with URL-hash dedup, filtering, and stats (required in production — no local-file fallback documented).
- `lib/newsFeedSources.ts` — configured RSS sources (also editable inline in `app/api/news-feed/ingest/route.ts`'s `RSS_SOURCES`).
- AI summaries use OpenAI `gpt-4o-mini` (`OPENAI_API_KEY`); without a key the ETL falls back to a naive first-N-sentences summary (`lib/newsFeedLocalSummary.ts`).
- `app/api/news-feed/ingest` triggers the ETL (optionally `Authorization: Bearer <NEWS_FEED_INGEST_TOKEN>`); `vercel.json` schedules this indirectly via `/api/news-feed/cron` (daily, `0 0 * * *`).
- A second, older/simpler news system (`lib/newsStore.ts`, `app/api/news/*`, `data/news-config.json`) and a SQLite-backed one (`lib/db.ts`, using `better-sqlite3` against `news.db`) also exist — check which one a given news-related route actually uses before assuming; don't conflate the three.
- Full behavior/config reference: `docs/NEWS_FEED.md`, `docs/FETCH_NEWS.md`, `docs/RSS_SECURITY.md`, `docs/NEWS_FEED_SETUP.md`.

### Validation

`lib/schema.ts` holds Zod schemas used to validate admin API request bodies (rooms, products, promos, etc.) — extend this rather than hand-rolling checks in route handlers.

### UI

- shadcn/ui (`components/ui/`) configured via `components.json`: "new-york" style, neutral base color, Tailwind CSS variables, `lucide-react` icons.
- Site-specific components live flat in `components/` (e.g. `Header.tsx`, `Hero.tsx`, `NewsSection.tsx`, `FuelCard.tsx`); admin-only and news-feed-only components are namespaced in `components/admin/` and `components/news-feed/`.
- Path alias `@/*` maps to the repo root (`tsconfig.json`).
- Static config/copy (fuel prices, company info, services, contacts) that isn't admin-editable lives in `lib/config.ts`.
