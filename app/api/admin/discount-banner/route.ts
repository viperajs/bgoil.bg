import { NextResponse } from 'next/server'
import { getDiscountBannerConfig, saveDiscountBannerConfig, isDiscountBannerActive, type DiscountBannerConfig } from '@/lib/discountBannerStore'
import { requireAdmin } from '@/lib/auth'

/**
 * GET /api/admin/discount-banner
 * Връща текущата конфигурация на discount banner
 */
export async function GET(req: Request) {
  if (!await requireAdmin(req)) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized' },
      { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' } }
    )
  }

  try {
    const config = await getDiscountBannerConfig()
    const active = isDiscountBannerActive(config)
    return NextResponse.json({ ok: true, config, active })
  } catch (error) {
    console.error('GET /api/admin/discount-banner failed:', error)
    return NextResponse.json(
      { ok: false, error: 'Failed to load discount banner config' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/discount-banner
 * Обновява конфигурацията на discount banner
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
    const { enabled, message, startAt, endAt } = body

    // Validation
    if (typeof enabled !== 'boolean') {
      return NextResponse.json(
        { ok: false, error: 'enabled must be a boolean' },
        { status: 400 }
      )
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { ok: false, error: 'message is required' },
        { status: 400 }
      )
    }

    if (message.length > 200) {
      return NextResponse.json(
        { ok: false, error: 'message must be max 200 characters' },
        { status: 400 }
      )
    }

    const config: DiscountBannerConfig = {
      enabled: Boolean(enabled),
      message: String(message).trim(),
      startAt: startAt ? String(startAt) : null,
      endAt: endAt ? String(endAt) : null,
    }

    await saveDiscountBannerConfig(config)
    const active = isDiscountBannerActive(config)

    return NextResponse.json({ ok: true, config, active })
  } catch (error) {
    console.error('PUT /api/admin/discount-banner failed:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to save discount banner config'
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 400 }
    )
  }
}


















