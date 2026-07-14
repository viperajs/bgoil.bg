import { NextResponse } from 'next/server'
import { getNewsArticles, updateNewsArticle, deleteNewsArticle } from '@/lib/newsStore'
import { requireAdmin } from '@/lib/auth'

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  // Проверка за автентикация
  if (!await requireAdmin(req)) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized' },
      { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' } }
    )
  }

  try {
    const id = params.id
    const body = await req.json()
    const { title, content, category, source, link } = body

    if (!title || !content || !category) {
      return NextResponse.json(
        { ok: false, reason: 'Missing required fields' },
        { status: 400 }
      )
    }

    const articles = await updateNewsArticle(id, {
      title: String(title).trim(),
      content: String(content).trim(),
      category: String(category).trim(),
      source: source ? String(source).trim() : undefined,
      link: link ? String(link).trim() : undefined,
    })

    return NextResponse.json({ ok: true, articles })
  } catch (error) {
    console.error('PUT /api/news/[id] failed:', error)
    return NextResponse.json(
      { ok: false, error: 'Failed to update article' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  // Проверка за автентикация
  if (!await requireAdmin(req)) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized' },
      { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' } }
    )
  }

  try {
    const id = params.id
    const articles = await deleteNewsArticle(id)

    return NextResponse.json({ ok: true, articles })
  } catch (error) {
    console.error('DELETE /api/news/[id] failed:', error)
    return NextResponse.json(
      { ok: false, error: 'Failed to delete article' },
      { status: 500 }
    )
  }
}

