import { NextResponse } from 'next/server'
import { generateAISummary } from '@/lib/newsFeedETL'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, content, language } = body
    
    if (!title || !content) {
      return NextResponse.json(
        { ok: false, error: 'Title and content are required' },
        { status: 400 }
      )
    }
    
    const summary = await generateAISummary(
      title,
      content,
      language || 'bg'
    )
    
    return NextResponse.json({
      ok: true,
      summary,
      hasOpenAI: !!process.env.OPENAI_API_KEY,
    })
  } catch (error) {
    console.error('Test summary failed:', error)
    return NextResponse.json(
      { 
        ok: false, 
        error: (error as Error).message,
        hasOpenAI: !!process.env.OPENAI_API_KEY,
      },
      { status: 500 }
    )
  }
}

// GET endpoint за проверка на конфигурацията
export async function GET() {
  return NextResponse.json({
    hasOpenAI: !!process.env.OPENAI_API_KEY,
    message: 'Use POST to test summary generation',
    example: {
      title: 'Цените на бензина растат',
      content: 'Според последните данни цените на бензина са се увеличили с 5% през последния месец...',
      language: 'bg',
    },
  })
}


