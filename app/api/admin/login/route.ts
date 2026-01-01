import { NextRequest, NextResponse } from 'next/server';

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
      const response = NextResponse.json({ success: true });
      
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

    return NextResponse.json(
      { error: 'Грешно потребителско име или парола' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Възникна грешка при обработка на заявката' },
      { status: 500 }
    );
  }
}

