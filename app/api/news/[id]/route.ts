import { NextResponse } from 'next/server'
import { getNewsArticles, updateNewsArticle, deleteNewsArticle } from '@/lib/newsStore'

/**
 * Проверка за Basic Auth или Session Cookie (админ достъп)
 */
function requireAdminAuth(request: Request): boolean {
  // Check for session cookie first (set by middleware after Basic Auth)
  const cookieHeader = request.headers.get('cookie') || ''
  // Parse cookies properly
  const cookies = cookieHeader.split(';').map(c => c.trim())
  const adminSessionCookie = cookies.find(c => c.startsWith('admin_session='))
  if (adminSessionCookie && adminSessionCookie.includes('authenticated')) {
    return true
  }

  // Fallback to Basic Auth
  const authHeader = request.headers.get('authorization') || ''
  if (!authHeader) return false
  
  const [type, blob] = authHeader.split(' ')
  if (type !== 'Basic' || !blob) return false
  
  try {
    const creds = Buffer.from(blob, 'base64').toString('utf8')
    const [u, p] = creds.split(':')
    const basicOk = u === process.env.ADMIN_USER && p === process.env.ADMIN_PASS
    return basicOk
  } catch {
    return false
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  // Проверка за автентикация
  if (!requireAdminAuth(req)) {
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
  if (!requireAdminAuth(req)) {
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

