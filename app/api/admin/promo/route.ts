import { NextResponse } from 'next/server'
import { getPromoConfig, savePromoConfig, isPromoActive, type PromoConfig } from '@/lib/promoStore'
import { requireAdmin } from '@/lib/auth'

/**
 * GET /api/admin/promo
 * Връща текущата конфигурация на промоцията
 */
export async function GET(req: Request) {
  if (!await requireAdmin(req)) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized' },
      { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' } }
    )
  }

  try {
    const config = await getPromoConfig()
    const active = isPromoActive(config)
    return NextResponse.json({ ok: true, config, active })
  } catch (error) {
    console.error('GET /api/admin/promo failed:', error)
    return NextResponse.json(
      { ok: false, error: 'Failed to load promo config' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/promo
 * Обновява конфигурацията на промоцията
 */
export async function PUT(req: Request) {
  if (!await requireAdmin(req)) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized' },
      { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' } }
    )
  }

  try {
    const body = await req.json()
    const { enabled, kind, title, message, ctaText, ctaUrl, startAt, endAt } = body

    // Validation
    if (typeof enabled !== 'boolean') {
      return NextResponse.json(
        { ok: false, error: 'enabled must be a boolean' },
        { status: 400 }
      )
    }

    if (kind && kind !== 'promo' && kind !== 'news') {
      return NextResponse.json(
        { ok: false, error: 'kind must be "promo" or "news"' },
        { status: 400 }
      )
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { ok: false, error: 'message is required' },
        { status: 400 }
      )
    }

    if (message.length > 180) {
      return NextResponse.json(
        { ok: false, error: 'message must be max 180 characters' },
        { status: 400 }
      )
    }

    const config: PromoConfig = {
      enabled: Boolean(enabled),
      kind: kind === 'news' ? 'news' : 'promo',
      title: title ? String(title).trim() : undefined,
      message: String(message).trim(),
      ctaText: ctaText ? String(ctaText).trim() : undefined,
      ctaUrl: ctaUrl ? String(ctaUrl).trim() : undefined,
      startAt: startAt ? String(startAt) : null,
      endAt: endAt ? String(endAt) : null,
    }

    await savePromoConfig(config)
    const active = isPromoActive(config)

    return NextResponse.json({ ok: true, config, active })
  } catch (error) {
    console.error('PUT /api/admin/promo failed:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to save promo config'
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 400 }
    )
  }
}


















