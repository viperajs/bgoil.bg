import { NextResponse } from 'next/server'
import { processNewsFeed } from '@/lib/newsFeedETL'
import { getActiveSources } from '@/lib/newsFeedSources'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * POST /api/news-feed/ingest
 * 
 * Legacy endpoint за обратна съвместимост.
 * Препоръчително е да се използва /api/news-feed/refresh вместо това.
 * 
 * Поддържа:
 * - Обработка на конкретен източник (feedUrl + sourceName в body)
 * - Обработка на всички конфигурирани източници (без body)
 */
export async function POST(request: Request) {
  try {
    // Проверка за автентикация (опционално)
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.NEWS_FEED_INGEST_TOKEN
    
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const body = await request.json().catch(() => ({}))
    const { feedUrl, sourceName } = body
    
    // Ако са подадени конкретни параметри, използваме ги
    if (feedUrl && sourceName) {
      const result = await processNewsFeed(feedUrl, sourceName)
      return NextResponse.json({
        ok: true,
        processed: result.published,
        skipped: result.filtered_out,
        found: result.found,
        summarized: result.summarized,
        published: result.published,
        errors: result.errors,
      })
    }
    
    // Иначе обработваме всички конфигурирани източници
    const sources = getActiveSources()
    const results = []
    
    for (const sourceConfig of sources) {
      try {
        const result = await processNewsFeed(
          sourceConfig.url,
          sourceConfig.name,
          sourceConfig.maxAgeDays || 30
        )
        results.push({
          source: sourceConfig.name,
          processed: result.published,
          skipped: result.filtered_out,
          found: result.found,
          summarized: result.summarized,
          published: result.published,
          errors: result.errors,
        })
      } catch (e) {
        results.push({
          source: sourceConfig.name,
          processed: 0,
          skipped: 0,
          found: 0,
          summarized: 0,
          published: 0,
          errors: [(e as Error).message],
        })
      }
    }
    
    const total = results.reduce((sum, r) => sum + r.published, 0)
    const totalSkipped = results.reduce((sum, r) => sum + r.skipped, 0)
    const allErrors = results.flatMap(r => r.errors)
    
    return NextResponse.json({
      ok: true,
      total_processed: total,
      total_skipped: totalSkipped,
      sources: results,
      errors: allErrors,
      note: 'Consider using /api/news-feed/refresh for better reporting',
    })
  } catch (error) {
    console.error('POST /api/news-feed/ingest failed:', error)
    return NextResponse.json(
      { ok: false, error: 'Failed to ingest news' },
      { status: 500 }
    )
  }
}

// GET endpoint за ръчно задействане (за тестване)
export async function GET() {
  const sources = getActiveSources()
  return NextResponse.json({
    message: 'Use POST to ingest news feeds, or use /api/news-feed/refresh for manual refresh',
    sources: sources.map(s => ({ name: s.name, url: s.url, enabled: s.enabled !== false })),
  })
}

