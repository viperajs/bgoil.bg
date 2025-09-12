// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  // смени /admin ако искаш по-„скрит“ път (напр. /admin-a9f_42_x)
  matcher: ['/admin/:path*'],
}

// сравнение в константно време
function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false
  let res = 0
  for (let i = 0; i < a.length; i++) {
    res |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return res === 0
}

export function middleware(req: NextRequest) {
  // 1) IP allowlist (първо!)
  const allowList = (process.env.ALLOW_IPS ?? '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

  // Vercel/Edge: вземи IP от req.ip или първия x-forwarded-for
  const clientIp = req.ip || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()

  if (allowList.length > 0) {
    // ако няма IP (рядко) и имаме allowlist → блокирай
    if (!clientIp || !allowList.includes(clientIp)) {
      return new NextResponse('IP not allowed', { status: 403 })
    }
  }

  // 2) Basic Auth
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
  if (scheme !== 'Basic' || !encoded) {
    return new NextResponse('Invalid auth header', { status: 400 })
  }

  let decoded = ''
  try {
    decoded = atob(encoded) // налично в Edge runtime
  } catch {
    return new NextResponse('Bad credentials encoding', { status: 400 })
  }

  const sep = decoded.indexOf(':')
  if (sep === -1) {
    return new NextResponse('Bad credentials format', { status: 400 })
  }

  const u = decoded.slice(0, sep)
  const p = decoded.slice(sep + 1)

  if (safeEqual(u, user) && safeEqual(p, pass)) {
    return NextResponse.next()
  }

  return new NextResponse('Forbidden', { status: 403 })
}
