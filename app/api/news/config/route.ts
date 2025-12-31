import { NextResponse } from 'next/server'
import { getNewsConfig, saveNewsConfig } from '@/lib/newsStore'

/**
 * Проверка за Basic Auth или Session Cookie (админ достъп)
 */
function requireAdminAuth(request: Request): boolean {
  const cookieHeader = request.headers.get('cookie') || ''
  const cookies = cookieHeader.split(';').map(c => c.trim())
  const adminSessionCookie = cookies.find(c => c.startsWith('admin_session='))
  if (adminSessionCookie && adminSessionCookie.includes('authenticated')) {
    return true
  }

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

export async function GET() {
  try {
    const config = await getNewsConfig()
    return NextResponse.json({ ok: true, config, active: config.enabled })
  } catch (error) {
    console.error('GET /api/news/config failed:', error)
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch news config' },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
  if (!requireAdminAuth(req)) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized' },
      { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' } }
    )
  }

  try {
    const body = await req.json()
    const { enabled } = body

    if (typeof enabled !== 'boolean') {
      return NextResponse.json(
        { ok: false, error: 'enabled must be a boolean' },
        { status: 400 }
      )
    }

    const config = { enabled }
    await saveNewsConfig(config)

    return NextResponse.json({ ok: true, config, active: config.enabled })
  } catch (error) {
    console.error('PUT /api/news/config failed:', error)
    const errorMessage = error instanceof Error ? error.message : 'Bad request'
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 400 }
    )
  }
}













