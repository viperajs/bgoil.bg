import 'server-only'
import { isValidAdminSession, checkBasicAuth, ADMIN_COOKIE } from '@/lib/adminSession'

/**
 * Проверка за админ в API route handler-и (route.ts).
 * Приема Request, за да работи и с Basic Auth fallback.
 */
export async function requireAdmin(request: Request): Promise<boolean> {
  const cookieHeader = request.headers.get('cookie') || ''
  const cookiePairs = cookieHeader.split(';').map(c => c.trim())
  const sessionPair = cookiePairs.find(c => c.startsWith(`${ADMIN_COOKIE}=`))
  const sessionValue = sessionPair?.slice(ADMIN_COOKIE.length + 1)
  if (await isValidAdminSession(sessionValue)) return true

  return checkBasicAuth(request.headers.get('authorization'))
}

export function unauthorizedResponse() {
  return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  })
}
