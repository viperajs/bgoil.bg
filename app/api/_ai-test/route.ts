import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export const dynamic = 'force-dynamic'

/**
 * GET /api/_ai-test
 * 
 * Тестов endpoint за валидация на OpenAI API ключ и модел.
 * Връща примерен резюме на български за тест.
 */
export async function GET() {
  const apiKey = (process.env.OPENAI_API_KEY || '').trim()
  
  if (!apiKey) {
    return NextResponse.json({
      ok: false,
      error: 'OPENAI_API_KEY не е намерен или е празен'
    }, { status: 400 })
  }
  
  const openai = new OpenAI({ apiKey })
  
  const testText = `
    Цените на бензина и дизела в България се покачиха с 5% през последния месец.
    Причините са свързани с покачването на котировките на суровия петрол Brent и WTI.
    Рафинерията в Бургас обяви, че ще увеличи производството с 10% през следващия квартал.
  `
  
  try {
    const resp = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      messages: [{
        role: 'user',
        content: `Резюмирай на български в 3–4 изречения:\n\n${testText}`
      }]
    })
    
    const sample = resp.choices[0]?.message?.content?.trim() || ''
    
    if (!sample) {
      return NextResponse.json({
        ok: false,
        error: 'OpenAI върна празен отговор'
      }, { status: 500 })
    }
    
    return NextResponse.json({
      ok: true,
      sample,
      model: 'gpt-4o-mini',
      hasKey: true
    })
  } catch (e: any) {
    return NextResponse.json({
      ok: false,
      error: e?.message || String(e),
      hasKey: true
    }, { status: 500 })
  }
}

