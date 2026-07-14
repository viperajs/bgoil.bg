import { NextResponse } from 'next/server'
import type { PromoConfig } from '@/lib/promoStore'
import { requireAdmin } from '@/lib/auth'

/**
 * POST /api/admin/promo/ai-generate
 *
 * Генерира промоция/новина от естествен текст с помощта на Gemini AI
 *
 * Body: { prompt: string }
 * Response: { ok: boolean, config?: PromoConfig, error?: string }
 */
export async function POST(req: Request) {
  if (!await requireAdmin(req)) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized' },
      { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' } }
    )
  }

  try {
    const { prompt } = await req.json()

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { ok: false, error: 'prompt is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { ok: false, error: 'Gemini API key not configured' },
        { status: 500 }
      )
    }

    // Създаваме system prompt за Gemini
    const systemPrompt = `Ти си AI асистент за бензиностанция BG OIL. Твоята задача е да генерираш промоции и новини от описание на естествен език.

Получаваш: Описание на промоция или новина (на български или английски)

Връщаш: JSON обект със следната структура:
{
  "enabled": true,
  "kind": "promo" или "news",
  "title": "Кратко заглавие (опционално, макс 50 символа)",
  "message": "Основно съобщение (ЗАДЪЛЖИТЕЛНО, макс 180 символа)",
  "ctaText": "Текст на бутон (опционално, напр. 'Научи повече')",
  "ctaUrl": "URL на бутон (опционално)",
  "startAt": "ISO дата на начало (опционално)",
  "endAt": "ISO дата на край (опционално)"
}

ВАЖНИ ПРАВИЛА:
1. "message" е ЗАДЪЛЖИТЕЛНО и трябва да е кратко, привлекателно и до 180 символа
2. Използвай емоджита умерено (1-2 максимум)
3. Ако има конкретни дати в описанието, използвай ги за startAt/endAt
4. Ако е промоция за горива, използвай kind: "promo"
5. Ако е информационна новина, използвай kind: "news"
6. Текстът трябва да е на български
7. Винаги enabled: true
8. Отговорът трябва да е САМО JSON, без друг текст

ПРИМЕРИ:

Вход: "Добави промоция за 10% отстъпка на дизел през януари"
Изход:
{
  "enabled": true,
  "kind": "promo",
  "title": "Дизел -10%",
  "message": "Специална промоция! 10% отстъпка на дизел за целия януари. Не пропускайте! ⛽",
  "ctaText": "Вземи отстъпката",
  "ctaUrl": "/contact",
  "startAt": "${new Date(new Date().getFullYear(), 0, 1).toISOString()}",
  "endAt": "${new Date(new Date().getFullYear(), 0, 31, 23, 59, 59).toISOString()}"
}

Вход: "Работим на Нова година от 10 до 18 часа"
Изход:
{
  "enabled": true,
  "kind": "news",
  "message": "На 1 януари работим от 10:00 до 18:00 часа. Честита Нова година! 🎉",
  "startAt": null,
  "endAt": null
}

Вход: "Безплатно измиване на стъкла за клиенти над 50 литра"
Изход:
{
  "enabled": true,
  "kind": "promo",
  "title": "Подарък при 50л+",
  "message": "Зареди над 50 литра и получи безплатно измиване на стъкла! 🎁",
  "ctaText": null,
  "ctaUrl": null,
  "startAt": null,
  "endAt": null
}`

    const userPrompt = `Генерирай промоция/новина от следното описание:

${prompt.trim()}

Отговори САМО с JSON обект (без markdown, без backticks, само чистия JSON).`

    // Извикваме Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\n${userPrompt}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Gemini API error:', response.status, errorData)
      return NextResponse.json(
        { ok: false, error: `Gemini API error: ${response.status}` },
        { status: 500 }
      )
    }

    const data = await response.json()
    let generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

    if (!generatedText) {
      return NextResponse.json(
        { ok: false, error: 'No response from Gemini' },
        { status: 500 }
      )
    }

    // Почистваме markdown formatting ако има
    generatedText = generatedText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()

    // Парсваме JSON отговора
    let config: PromoConfig
    try {
      config = JSON.parse(generatedText)
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', generatedText)
      return NextResponse.json(
        { ok: false, error: 'Failed to parse AI response', raw: generatedText },
        { status: 500 }
      )
    }

    // Валидация
    if (!config.message || config.message.length === 0) {
      return NextResponse.json(
        { ok: false, error: 'AI response missing message field' },
        { status: 500 }
      )
    }

    if (config.message.length > 180) {
      config.message = config.message.substring(0, 177) + '...'
    }

    // Уверяваме се че структурата е правилна
    const validatedConfig: PromoConfig = {
      enabled: Boolean(config.enabled),
      kind: config.kind === 'news' ? 'news' : 'promo',
      title: config.title?.substring(0, 50) || undefined,
      message: config.message.substring(0, 180),
      ctaText: config.ctaText?.substring(0, 30) || undefined,
      ctaUrl: config.ctaUrl || undefined,
      startAt: config.startAt || null,
      endAt: config.endAt || null,
    }

    return NextResponse.json({ ok: true, config: validatedConfig })
  } catch (error) {
    console.error('POST /api/admin/promo/ai-generate failed:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate promo'
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 500 }
    )
  }
}
