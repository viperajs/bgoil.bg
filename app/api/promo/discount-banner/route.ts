import { NextResponse } from 'next/server'
import { getDiscountBannerConfig, isDiscountBannerActive } from '@/lib/discountBannerStore'

/**
 * GET /api/promo/discount-banner
 * Public endpoint - returns active discount banner message
 */
export async function GET() {
  try {
    const config = await getDiscountBannerConfig()
    const active = isDiscountBannerActive(config)
    
    return NextResponse.json({
      active,
      message: active ? config.message : null,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    })
  } catch (error) {
    console.error('GET /api/promo/discount-banner failed:', error)
    return NextResponse.json(
      { active: false, message: null },
      { status: 500 }
    )
  }
}















