import { NextResponse } from 'next/server'
import { getNewsConfig, saveNewsConfig } from '@/lib/newsStore'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  try {
    const config = await getNewsConfig()
    return NextResponse.json({ ok: true, config, active: config.enabled })
  } catch (error) {
    console.error('GET /api/news/config failed:', error)
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch news config' },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
  if (!await requireAdmin(req)) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized' },
      { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' } }
    )
  }

  try {
    const body = await req.json()
    const { enabled } = body

    if (typeof enabled !== 'boolean') {
      return NextResponse.json(
        { ok: false, error: 'enabled must be a boolean' },
        { status: 400 }
      )
    }

    const config = { enabled }
    await saveNewsConfig(config)

    return NextResponse.json({ ok: true, config, active: config.enabled })
  } catch (error) {
    console.error('PUT /api/news/config failed:', error)
    const errorMessage = error instanceof Error ? error.message : 'Bad request'
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 400 }
    )
  }
}

















