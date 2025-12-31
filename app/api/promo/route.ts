import { NextResponse } from 'next/server'
import { getPromoConfig, isPromoActive } from '@/lib/promoStore'

/**
 * GET /api/promo
 * Публичен endpoint за получаване на активна промоция
 */
export async function GET() {
  try {
    const config = await getPromoConfig()
    const active = isPromoActive(config)
    
    if (!active) {
      return NextResponse.json({ active: false, config: null })
    }

    return NextResponse.json({ active: true, config }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30' }
    })
  } catch (error) {
    console.error('GET /api/promo failed:', error)
    return NextResponse.json(
      { active: false, config: null },
      { status: 500 }
    )
  }
}













