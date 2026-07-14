import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
  isValidAdminSession,
  checkBasicAuth,
  getAdminSessionToken,
  ADMIN_COOKIE,
  ADMIN_COOKIE_MAX_AGE,
} from '@/lib/adminSession'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Избягваме безкраен цикъл: ако сме на login страницата или API-то, не пренасочваме
  if (pathname.startsWith('/admin/login') || pathname.startsWith('/api/admin/login')) {
    return NextResponse.next();
  }

  // Проверка за подписан admin session cookie
  const adminSession = req.cookies.get(ADMIN_COOKIE);
  if (await isValidAdminSession(adminSession?.value)) {
    return NextResponse.next();
  }

  // Fallback към Basic Auth
  if (checkBasicAuth(req.headers.get('authorization'))) {
    const response = NextResponse.next();
    const token = await getAdminSessionToken();
    if (token) {
      response.cookies.set(ADMIN_COOKIE, token, {
        maxAge: ADMIN_COOKIE_MAX_AGE,
        httpOnly: true,
        path: '/',
        sameSite: 'lax'
      });
    }
    return response;
  }

  // Ако няма валидна автентикация, пренасочваме към login страницата
  return NextResponse.redirect(new URL('/admin/login', req.url));
}

export const config = {
  matcher: [
    '/admin',              // Защитава точно /admin
    '/admin/:path*',       // Защитава всички под-страници
    '/admin-hotel/:path*',
    '/admin-hotel',
    '/admin-bookings/:path*',
    '/admin-bookings',
    '/admin-shop/:path*',
    '/admin-shop',
    '/admin-prices/:path*',
    '/admin-prices',
    '/admin-promo/:path*',
    '/admin-promo',
    '/admin-promo-ai/:path*',
    '/admin-promo-ai',
  ]
}
