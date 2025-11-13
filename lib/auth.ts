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



