import { NextResponse } from 'next/server'
import { fetchNews } from '@/lib/fetchNews'
import { isFuelRelevant } from '@/lib/newsFeedRelevance'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Cache за 60 секунди

/**
 * GET /api/news-feed/simple
 * 
 * Прост endpoint който използва fetchNews модула за взимане на новини от RSS източници.
 * Връща новини филтрирани по ключови думи (горива, бензин, дизел и т.н.).
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const hoursBack = parseInt(searchParams.get('hoursBack') || '72', 10)
    const maxPerFeed = parseInt(searchParams.get('maxPerFeed') || '30', 10)
    const maxTotal = parseInt(searchParams.get('maxTotal') || '150', 10)
    const requireKeywordMatch = searchParams.get('requireKeywordMatch') !== 'false'
    
    // Извикваме новия fetchNews модул
    const newsItems = await fetchNews({
      hoursBack,
      maxPerFeed,
      maxTotal,
      requireKeywordMatch,
    })
    
    // Допълнително филтриране с isFuelRelevant за да гарантираме само релевантни новини
    const relevantNews = newsItems.filter(item => {
      return isFuelRelevant(item.title, '', item.link)
    })
    
    return NextResponse.json({
      ok: true,
      count: relevantNews.length,
      articles: relevantNews.map(item => ({
        id: item.link, // Използваме link като ID
        title: item.title,
        url: item.link,
        source: item.source,
        published_at: item.publishedAt,
        summary: '', // Новото API не връща summary, само title и link
        keywords: [],
        category: undefined,
        language: 'bg' as const,
        is_important: false,
      })),
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    })
  } catch (error) {
    console.error('GET /api/news-feed/simple failed:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { ok: false, error: `Failed to fetch news: ${errorMessage}` },
      { status: 500 }
    )
  }
}

