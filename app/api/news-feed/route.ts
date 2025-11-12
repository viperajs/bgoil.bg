import { NextResponse } from 'next/server'
import { getPublishedNewsArticles } from '@/lib/newsFeedStore'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Cache за 60 секунди

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const from = searchParams.get('from') || undefined
    const to = searchParams.get('to') || undefined
    const source = searchParams.get('source') || undefined
    const lang = (searchParams.get('lang') as 'bg' | 'en' | undefined) || undefined
    const category = searchParams.get('category') || undefined
    const q = searchParams.get('q') || undefined
    const topic = searchParams.get('topic') || 'fuels' // По подразбиране само горива
    
    // Показваме само статии за горива по подразбиране
    const articles = await getPublishedNewsArticles({
      limit: Math.min(limit, 10), // Максимум 10
      from,
      to,
      source,
      language: lang,
      category,
      search: q,
      topic,
    })
    
    return NextResponse.json({
      ok: true,
      count: articles.length,
      articles: articles.map(a => ({
        id: a.id,
        title: a.title,
        url: a.url,
        source: a.source,
        published_at: a.publishedAt,
        summary: a.summary,
        keywords: a.keywords,
        category: a.category,
        language: a.language,
        is_important: a.isImportant || false,
      })),
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    })
  } catch (error) {
    console.error('GET /api/news-feed failed:', error)
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}

