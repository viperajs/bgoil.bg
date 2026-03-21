# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

No test framework is configured.

## Architecture Overview

This is a **Next.js 16 App Router** application for a Bulgarian fuel/hotel/shop business (bgoil.bg). It uses TypeScript, Tailwind CSS 4, and shadcn/ui (new-york style).

### Path Alias
`@/` maps to the project root (not `src/`).

### Data Layer
The app uses a hybrid persistence approach:
- **SQLite** (`news.db`, via `better-sqlite3`) — news feed storage
- **Upstash Redis** (`@upstash/redis`) — KV store for promo banners, prices, and other mutable state
- **Vercel Blob** — file/image uploads from admin panels
- **JSON files** (`.data/fuels.json`) — static fuel data

Store files in `lib/` (e.g., `fuelStore.ts`, `promoStore.ts`, `hotelStore.ts`) are the data access layer for each domain.

### Admin System
All admin pages live at `/admin-*` routes (e.g., `/admin-bookings`, `/admin-prices`, `/admin-promo`). Authentication uses a 2FA flow at `/admin/login` → `/admin/2fa`. Auth logic is in `lib/auth.ts`.

### AI Integration
- **Google GenAI** (`@google/genai`) — used in the chat widget and promo AI generation
- **OpenAI** (`openai`) — secondary AI integration
- AI routes live under `app/api/_ai-test/` and `app/api/admin/promo/ai-generate/`

### News Feed Pipeline
A cron job at `/api/news-feed/cron` (runs daily at 00:00 UTC, configured in `vercel.json`) drives an ETL pipeline. Key files:
- `lib/newsFeedSources.ts` — RSS source configuration
- `lib/newsFeedETL.ts` — extract/transform/load logic
- `lib/newsFeedRelevance.ts` — relevance scoring
- `lib/newsFeedKeywords.ts` — keyword filtering

Docs are in `docs/NEWS_FEED.md` and `docs/NEWS_FEED_SETUP.md`.

### Key Conventions
- **TypeScript build errors are ignored** (`ignoreBuildErrors: true` in `next.config.mjs`) — the build will not fail on type errors.
- **Tailwind CSS 4** is used via `@tailwindcss/postcss` (no `tailwind.config.js` — configuration is in CSS).
- Component aliases: `@/components/ui` for shadcn/ui primitives, `@/components` for custom components.
- Middleware (`middleware.ts`) handles route protection for admin pages.
