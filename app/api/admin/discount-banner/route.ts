import { NextResponse } from 'next/server'
import { getDiscountBannerConfig, saveDiscountBannerConfig, isDiscountBannerActive, type DiscountBannerConfig } from '@/lib/discountBannerStore'

/**
 * Проверка за Basic Auth или Session Cookie (админ достъп)
 */
function requireAdminAuth(request: Request): boolean {
  // Check for session cookie first (set by middleware after Basic Auth)
  const cookieHeader = request.headers.get('cookie') || ''
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

/**
 * GET /api/admin/discount-banner
 * Връща текущата конфигурация на discount banner
 */
export async function GET(req: Request) {
  if (!requireAdminAuth(req)) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized' },
      { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' } }
    )
  }

  try {
    const config = await getDiscountBannerConfig()
    const active = isDiscountBannerActive(config)
    return NextResponse.json({ ok: true, config, active })
  } catch (error) {
    console.error('GET /api/admin/discount-banner failed:', error)
    return NextResponse.json(
      { ok: false, error: 'Failed to load discount banner config' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/discount-banner
 * Обновява конфигурацията на discount banner
 */
export async function PUT(req: Request) {
  if (!requireAdminAuth(req)) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized' },
      { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' } }
    )
  }

  try {
    const body = await req.json()
    const { enabled, message, startAt, endAt } = body

    // Validation
    if (typeof enabled !== 'boolean') {
      return NextResponse.json(
        { ok: false, error: 'enabled must be a boolean' },
        { status: 400 }
      )
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { ok: false, error: 'message is required' },
        { status: 400 }
      )
    }

    if (message.length > 200) {
      return NextResponse.json(
        { ok: false, error: 'message must be max 200 characters' },
        { status: 400 }
      )
    }

    const config: DiscountBannerConfig = {
      enabled: Boolean(enabled),
      message: String(message).trim(),
      startAt: startAt ? String(startAt) : null,
      endAt: endAt ? String(endAt) : null,
    }

    await saveDiscountBannerConfig(config)
    const active = isDiscountBannerActive(config)

    return NextResponse.json({ ok: true, config, active })
  } catch (error) {
    console.error('PUT /api/admin/discount-banner failed:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to save discount banner config'
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 400 }
    )
  }
}














