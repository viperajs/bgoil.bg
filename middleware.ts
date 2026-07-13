import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Избягваме безкраен цикъл: ако сме на login страницата или API-то, не пренасочваме
  if (pathname.startsWith('/admin/login') || pathname.startsWith('/api/admin/login')) {
    return NextResponse.next();
  }

  // Проверка за admin session cookie
  const adminSession = req.cookies.get('admin_session');

  if (adminSession?.value === 'authenticated') {
    return NextResponse.next();
  }

  // Fallback към Basic Auth
  const authHeader = req.headers.get('authorization');

  if (authHeader) {
    const [type, blob] = authHeader.split(' ');
    if (type === 'Basic' && blob) {
      try {
        const creds = Buffer.from(blob, 'base64').toString('utf8');
        const [username, password] = creds.split(':');

        if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
          const response = NextResponse.next();
          // Задаваме admin session cookie
          response.cookies.set('admin_session', 'authenticated', {
            maxAge: 86400, // 24 часа
            httpOnly: true,
            path: '/',
            sameSite: 'lax'
          });
          // Също задаваме isAdmin cookie за обратна съвместимост
          response.cookies.set('isAdmin', 'true', {
            maxAge: 86400,
            httpOnly: false,
            path: '/',
            sameSite: 'lax'
          });
          return response;
        }
      } catch {
        // Invalid auth
      }
    }
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
