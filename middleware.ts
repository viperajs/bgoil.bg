// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: ['/admin/:path*'],
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false
  let res = 0
  for (let i = 0; i < a.length; i++) {
    res |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return res === 0
}

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization')
  const user = process.env.ADMIN_USER ?? ''
  const pass = process.env.ADMIN_PASS ?? ''

  if (!basicAuth) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' },
    })
  }

  const [scheme, encoded] = basicAuth.split(' ')
  if (scheme !== 'Basic' || !encoded) {
    return new NextResponse('Invalid auth header', { status: 400 })
  }

  let decoded = ''
  try {
    decoded = atob(encoded)
  } catch {
    return new NextResponse('Bad credentials encoding', { status: 400 })
  }

  const sepIndex = decoded.indexOf(':')
  if (sepIndex === -1) {
    return new NextResponse('Bad credentials format', { status: 400 })
  }

  const u = decoded.slice(0, sepIndex)
  const p = decoded.slice(sepIndex + 1)

  if (safeEqual(u, user) && safeEqual(p, pass)) {
    return NextResponse.next()
  }
  // Позволени IP-та (примерно офис/дом)
const ALLOW_IPS = (process.env.ALLOW_IPS ?? '').split(',').map(s => s.trim()).filter(Boolean)
// В Edge runtime req.ip може да е undefined → ползвай x-forwarded-for
const ip = req.ip || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
if (ALLOW_IPS.length && ip && !ALLOW_IPS.includes(ip)) {
  return new NextResponse('IP not allowed', { status: 403 })
}


  return new NextResponse('Forbidden', { status: 403 })
}
