import 'server-only'
import { cookies } from 'next/headers'

/**
 * Проверка дали потребителят е админ
 * Проверява cookie 'isAdmin' или 'admin' за стойност 'true'
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const isAdminCookie = cookieStore.get('isAdmin')?.value === 'true' || 
                         cookieStore.get('admin')?.value === 'true'
    return isAdminCookie
  } catch {
    return false
  }
}

/**
 * Проверка за админ в API route handler-и (route.ts).
 * Приема Request, за да работи и с Basic Auth fallback.
 */
export function requireAdmin(request: Request): boolean {
  const cookieHeader = request.headers.get('cookie') || ''
  const cookiePairs = cookieHeader.split(';').map(c => c.trim())
  const adminSession = cookiePairs.find(c => c.startsWith('admin_session='))
  if (adminSession && adminSession.split('=')[1] === 'authenticated') {
    return true
  }

  const authHeader = request.headers.get('authorization') || ''
  const [type, blob] = authHeader.split(' ')
  if (type !== 'Basic' || !blob) return false

  try {
    const creds = Buffer.from(blob, 'base64').toString('utf8')
    const idx = creds.indexOf(':')
    if (idx === -1) return false
    const u = creds.slice(0, idx)
    const p = creds.slice(idx + 1)
    return !!process.env.ADMIN_USER && !!process.env.ADMIN_PASS &&
      u === process.env.ADMIN_USER && p === process.env.ADMIN_PASS
  } catch {
    return false
  }
}

export function unauthorizedResponse() {
  return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * Проверка за админ в client-side компонент
 * Използва document.cookie за проверка
 */
export function checkAdminClient(): boolean {
  if (typeof window === 'undefined') return false
  
  const cookies = document.cookie.split(';')
  const adminCookie = cookies.find(c => 
    c.trim().startsWith('isAdmin=true') || c.trim().startsWith('admin=true')
  )
  return !!adminCookie
}








