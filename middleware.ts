import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  // 1. Първо: Вашата съществуваща Basic Auth логика тук...
  // (Ако паролата е грешна -> връщате 401)

  const { pathname } = req.nextUrl;
  
  // Избягваме безкраен цикъл: ако сме на 2FA страницата или API-то, не пренасочваме
  if (pathname.startsWith('/admin/2fa') || pathname.startsWith('/api/2fa')) {
    return NextResponse.next();
  }

  // 2. Проверка за финалната 2FA бисквитка
  const is2faDone = req.cookies.get('admin_2fa_verified');

  if (!is2faDone) {
    // Пренасочваме към страницата за въвеждане на имейл и код
    return NextResponse.redirect(new URL('/admin/2fa', req.url));
  }

  return NextResponse.next();
}

export const config = { 
  matcher: [
    '/admin',          // Защитава точно /admin
    '/admin/:path*',   // Защитава всички под-страници
    '/admin-prices/:path*', 
    '/admin-promo/:path*'
  ] 
}