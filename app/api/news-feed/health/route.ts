import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * GET /api/news-feed/health
 * 
 * Връща здравословен статус на системата.
 */
export async function GET() {
  try {
    const db = getDb()
    const c = db.prepare('SELECT COUNT(*) as n FROM articles WHERE status = "PUBLISHED"').get() as { n: number }
    
    const SOURCES = (process.env.NEWS_FEED_SOURCES || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
    
    return NextResponse.json({
      ok: true,
      published: c.n,
      sources: SOURCES.length
    })
  } catch (error) {
    console.error('GET /api/news-feed/health failed:', error)
    return NextResponse.json(
      {
        ok: false,
        error: (error as Error).message
      },
      { status: 500 }
    )
  }
}
