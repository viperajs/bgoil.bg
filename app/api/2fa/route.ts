import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend('re_bi4yjZMr_ChWbYwDLQMsYiVmKDULda66K');
const ALLOWED_EMAILS = ['balakchiev09@gmail.com', 'втори-имейл@gmail.com'];

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, code, action } = body;

  if (action === 'send') {
    if (!ALLOWED_EMAILS.includes(email)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Код за достъп: ' + generatedCode,
        html: `<h1>Вашият код е: ${generatedCode}
         <p> Ако сте доволни от услугата, дайте някое евро че трудни време идват 😆</p>
        </h1>`
      });

      const response = NextResponse.json({ success: true });
      response.cookies.set('temp_code', generatedCode, { maxAge: 300, httpOnly: true });
      return response;
    } catch (err) {
      return NextResponse.json({ error: 'Email failed' }, { status: 500 });
    }
  }

  if (action === 'verify') {
    // В Next.js API маршрути четем бисквитките така:
    const savedCode = req.cookies.get('temp_code')?.value;

    if (code && code === savedCode) {
      const response = NextResponse.json({ success: true });
      
      // Записваме финалната бисквитка
      response.cookies.set('admin_2fa_verified', 'true', { 
        maxAge: 86400, 
        httpOnly: false, // Оставяме false за момента, за да може JS да я види
        path: '/' 
      });

      // Изтриваме временния код
      response.cookies.delete('temp_code');
      
      return response;
    }
    return NextResponse.json({ error: 'Грешен код' }, { status: 400 });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}