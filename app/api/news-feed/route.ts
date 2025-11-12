import { NextResponse } from 'next/server'
import { getPublishedNewsArticles } from '@/lib/newsFeedStore'
import { isFuelRelevant } from '@/lib/newsFeedRelevance'
import { fetchNews } from '@/lib/fetchNews'

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
    
    // Първо опитваме да взимаме от базата данни
    let articles
    try {
      // Взимаме повече статии, защото ще филтрираме по релевантност
      articles = await getPublishedNewsArticles({
        limit: Math.min(limit * 3, 30), // Взимаме 3x повече за да филтрираме
        from,
        to,
        source,
        language: lang,
        category,
        search: q,
        topic,
      })
    } catch (dbError) {
      console.error('Database error:', dbError)
      articles = []
    }
    
    // Ако няма статии в базата данни, използваме fetchNews модула като fallback
    if (articles.length === 0) {
      try {
        console.log('No articles in database, fetching from RSS feeds...')
        
        // Проверяваме дали има конфигурирани RSS източници
        const newsFeedSources = process.env.NEWS_FEED_SOURCES
        const internationalFeeds = process.env.INTERNATIONAL_FEEDS
        
        if (!newsFeedSources && !internationalFeeds) {
          console.warn('No RSS feed sources configured in environment variables')
          // Връщаме празен списък ако няма конфигурирани източници
          return NextResponse.json({
            ok: true,
            count: 0,
            articles: [],
            warning: 'No RSS feed sources configured. Please add NEWS_FEED_SOURCES and/or INTERNATIONAL_FEEDS to your .env file.',
          }, {
            headers: {
              'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
            },
          })
        }
        
        const hoursBack = from ? Math.ceil((Date.now() - new Date(from).getTime()) / (1000 * 60 * 60)) : 168 // 7 дни по подразбиране
        const newsItems = await fetchNews({
          hoursBack: Math.max(hoursBack, 168), // Минимум 7 дни назад (168 часа)
          maxPerFeed: 50, // Увеличаваме за да взимаме повече новини
          maxTotal: Math.max(limit * 5, 200), // Взимаме повече за да филтрираме
          requireKeywordMatch: true,
        })
        
        console.log(`Fetched ${newsItems.length} items from RSS feeds`)
        
        // Преобразуваме NewsItem в NewsFeedArticle формат
        articles = newsItems.map(item => ({
          id: item.link, // Използваме link като ID
          url: item.link,
          title: item.title,
          source: item.source,
          publishedAt: item.publishedAt,
          language: 'bg' as const,
          summary: '', // fetchNews не връща summary
          keywords: [],
          indexedAt: new Date().toISOString(),
          status: 'PUBLISHED' as const,
        }))
        
        console.log(`Converted ${articles.length} articles from RSS feeds`)
        
      } catch (fetchError) {
        console.error('Failed to fetch news from RSS:', fetchError)
        const errorDetails = fetchError instanceof Error ? fetchError.message : String(fetchError)
        console.error('Error details:', errorDetails)
        // Продължаваме с празен масив
        articles = []
      }
    }
    
    // Филтрираме само релевантни статии за горива и бензиностанции
    const relevantArticles = articles.filter(article => {
      return isFuelRelevant(article.title, article.summary || '', article.url)
    })
    
    // Ограничаваме до желания лимит
    const limitedArticles = relevantArticles.slice(0, limit)
    
    return NextResponse.json({
      ok: true,
      count: limitedArticles.length,
      articles: limitedArticles.map(a => ({
        id: a.id,
        title: a.title,
        url: a.url,
        source: a.source,
        published_at: a.publishedAt,
        summary: a.summary || '', // Ако няма summary, връщаме празен string
        keywords: a.keywords || [],
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error details:', errorMessage)
    return NextResponse.json(
      { ok: false, error: `Failed to fetch news: ${errorMessage}` },
      { status: 500 }
    )
  }
}

