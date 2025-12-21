import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = { matcher: ['/admin/:path*', '/admin-prices/:path*'] }

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false
  let res = 0
  for (let i = 0; i < a.length; i++) res |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return res === 0
}

export function middleware(req: NextRequest) {
  const user = process.env.ADMIN_USER ?? ''
  const pass = process.env.ADMIN_PASS ?? ''
  const auth = req.headers.get('authorization')

  if (!auth) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' },
    })
  }

  const [scheme, encoded] = auth.split(' ')
  if (scheme !== 'Basic' || !encoded) return new NextResponse('Invalid auth', { status: 400 })

  let decoded = ''
  try { decoded = atob(encoded) } catch { return new NextResponse('Bad encoding', { status: 400 }) }

  const i = decoded.indexOf(':')
  const u = i >= 0 ? decoded.slice(0, i) : ''
  const p = i >= 0 ? decoded.slice(i + 1) : ''

  if (safeEqual(u, user) && safeEqual(p, pass)) {
    // Set admin session cookie for API authentication
    const response = NextResponse.next()
    response.cookies.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    })
    return response
  }
  return new NextResponse('Forbidden', { status: 403 })
}
