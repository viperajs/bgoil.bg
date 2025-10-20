// app/api/fuel/route.ts
import { NextResponse } from 'next/server'
import { fuels as configFuels, DISCOUNT_BGN } from '@/lib/config'
import type { Fuel } from '@/lib/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic' // забранява статично кеширане

async function safeGetEffective(): Promise<Fuel[]> {
  try {
    const mod = await import('@/lib/fuelStore')
    if (typeof (mod as any).getEffectiveFuels === 'function') {
      return await (mod as any).getEffectiveFuels()
    }
  } catch {}
  // fallback към дефолти (не се очаква често)
  return configFuels.map(f => ({
    ...f,
    memberPrice: Math.max(0, f.price - DISCOUNT_BGN),
  }))
}

async function safeSetPrices(items: { name: string; price: number }[]) {
  try {
    const mod = await import('@/lib/fuelStore')
    if (typeof (mod as any).setFuelPrices === 'function') {
      await (mod as any).setFuelPrices(items)
      return true
    }
  } catch {}
  return false
}

export async function GET() {
  const items = await safeGetEffective()
  return NextResponse.json(items, {
    headers: { 'Cache-Control': 'no-store' },
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const raw = Array.isArray(body?.items) ? body.items : []
    const items = raw
      .map((x: any) => ({
        name: String(x?.name ?? '').trim(),
        price: Number(x?.price),
      }))
      .filter((x: any) => x.name && Number.isFinite(x.price) && x.price >= 0)

    const ok = await safeSetPrices(items)
    return NextResponse.json({ ok, saved: items })
  } catch {
    return NextResponse.json({ error: 'Bad JSON' }, { status: 400 })
  }
}
