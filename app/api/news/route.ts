import { NextResponse } from 'next/server'
import { getNewsArticles, addNewsArticle } from '@/lib/newsStore'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  try {
    const articles = await getNewsArticles()
    return NextResponse.json(articles, { 
      headers: { 'Cache-Control': 'no-store' } 
    })
  } catch (error) {
    console.error('GET /api/news failed:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  // Проверка за автентикация
  const isAuthenticated = await requireAdmin(req)
  if (!isAuthenticated) {
    console.error('POST /api/news: Unauthorized - no valid auth')
    return NextResponse.json(
      { ok: false, error: 'Unauthorized' },
      { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' } }
    )
  }

  try {
    const body = await req.json()
    const { title, content, category, source, link } = body

    if (!title || !content || !category) {
      return NextResponse.json(
        { ok: false, reason: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('POST /api/news: Adding article:', { title, category })
    const articles = await addNewsArticle({
      title: String(title).trim(),
      content: String(content).trim(),
      category: String(category).trim(),
      source: source ? String(source).trim() : undefined,
      link: link ? String(link).trim() : undefined,
    })

    console.log('POST /api/news: Article added successfully, total articles:', articles.length)
    return NextResponse.json({ ok: true, articles })
  } catch (error) {
    console.error('POST /api/news failed:', error)
    const errorMessage = error instanceof Error ? error.message : 'Bad request'
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 400 }
    )
  }
}








