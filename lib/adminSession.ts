// lib/adminSession.ts — подписан (HMAC) session token за админ достъп.
// Работи и в Node, и в Edge runtime (Web Crypto), затова се ползва
// както от middleware-а, така и от API route handler-и.

const encoder = new TextEncoder()

async function hmacHex(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Токенът е детерминистичен HMAC от админ креденшълите — не може да бъде
 * подправен без ADMIN_USER/ADMIN_PASS, за разлика от стария константен
 * cookie 'authenticated'.
 */
export async function getAdminSessionToken(): Promise<string | null> {
  const user = process.env.ADMIN_USER
  const pass = process.env.ADMIN_PASS
  if (!user || !pass) return null
  return hmacHex(`${user}:${pass}`, 'bgoil-admin-session-v1')
}

export async function isValidAdminSession(value: string | undefined | null): Promise<boolean> {
  if (!value) return false
  const token = await getAdminSessionToken()
  if (!token || value.length !== token.length) return false
  // сравнение с постоянно време
  let diff = 0
  for (let i = 0; i < token.length; i++) {
    diff |= value.charCodeAt(i) ^ token.charCodeAt(i)
  }
  return diff === 0
}

export function checkBasicAuth(authHeader: string | null): boolean {
  if (!authHeader) return false
  const [type, blob] = authHeader.split(' ')
  if (type !== 'Basic' || !blob) return false
  try {
    const creds = atob(blob)
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

export const ADMIN_COOKIE = 'admin_session'
export const ADMIN_COOKIE_MAX_AGE = 86400 // 24 часа
