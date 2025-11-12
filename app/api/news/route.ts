import { NextResponse } from 'next/server'
import { getNewsArticles, addNewsArticle } from '@/lib/newsStore'

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
  try {
    const body = await req.json()
    const { title, content, category, source, link } = body

    if (!title || !content || !category) {
      return NextResponse.json(
        { ok: false, reason: 'Missing required fields' },
        { status: 400 }
      )
    }

    const articles = await addNewsArticle({
      title: String(title).trim(),
      content: String(content).trim(),
      category: String(category).trim(),
      source: source ? String(source).trim() : undefined,
      link: link ? String(link).trim() : undefined,
    })

    return NextResponse.json({ ok: true, articles })
  } catch (error) {
    console.error('POST /api/news failed:', error)
    return NextResponse.json(
      { ok: false, error: 'Bad request' },
      { status: 400 }
    )
  }
}


