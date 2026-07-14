import { NextRequest, NextResponse } from 'next/server';
import { getAdminSessionToken, ADMIN_COOKIE, ADMIN_COOKIE_MAX_AGE } from '@/lib/adminSession';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Потребителското име и паролата са задължителни' },
        { status: 400 }
      );
    }

    // Проверка срещу environment variables
    const adminUser = process.env.ADMIN_USER;
    const adminPass = process.env.ADMIN_PASS;

    if (!adminUser || !adminPass) {
      return NextResponse.json(
        { error: 'Конфигурационна грешка' },
        { status: 500 }
      );
    }

    if (username === adminUser && password === adminPass) {
      const token = await getAdminSessionToken();
      if (!token) {
        return NextResponse.json({ error: 'Конфигурационна грешка' }, { status: 500 });
      }

      const response = NextResponse.json({ success: true });
      response.cookies.set(ADMIN_COOKIE, token, {
        maxAge: ADMIN_COOKIE_MAX_AGE,
        httpOnly: true,
        path: '/',
        sameSite: 'lax'
      });
      return response;
    }

    return NextResponse.json(
      { error: 'Грешно потребителско име или парола' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Възникна грешка при обработка на заявката' },
      { status: 500 }
    );
  }
}
