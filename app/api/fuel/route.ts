// app/api/fuel/route.ts
import { NextResponse } from 'next/server'
import { fuels as configFuels, DISCOUNT_BGN } from '@/lib/config'
import type { Fuel } from '@/lib/types'

type FuelUpdate = { name: string; price: number; discount?: number }

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic' // без статичен кеш

async function safeGetEffective(): Promise<Fuel[]> {
  try {
    const mod = await import('@/lib/fuelStore')
    if (typeof (mod as any).getEffectiveFuels === 'function') {
      return await (mod as any).getEffectiveFuels()
    }
  } catch {}
  // fallback към дефолтите от config
  return configFuels.map(f => {
    const discount = typeof f.discount === 'number' ? f.discount : DISCOUNT_BGN
    return {
      ...f,
      discount,
      memberPrice: Math.max(0, f.price - discount),
    }
  })
}

export async function GET() {
  const items = await safeGetEffective()
  return NextResponse.json(items, { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const raw = Array.isArray(body?.items) ? body.items : []

    const items: FuelUpdate[] = raw
      .map((x: any) => ({
        name: String(x?.name ?? '').trim(),
        price: Number(x?.price),
        discount: x?.discount === undefined ? undefined : Number(x.discount),
      }))
      .filter((x: FuelUpdate) => {
        const priceValid = Number.isFinite(x.price) && x.price >= 0
        const discountValid =
          x.discount === undefined ? true : (Number.isFinite(x.discount) && x.discount >= 0)
        return x.name.length > 0 && priceValid && discountValid
      })

    if (items.length === 0) {
      return NextResponse.json({ ok: false, reason: 'empty_items' }, { status: 400 })
    }

    const mod = (await import('@/lib/fuelStore')) as typeof import('@/lib/fuelStore')

    const before = await mod.getEffectiveFuels()
    await mod.setFuelPrices(items)
    const after = await mod.getEffectiveFuels()

    const resolveDiscount = (fuel?: Fuel) => {
      if (!fuel) return undefined
      if (typeof fuel.discount === 'number') return fuel.discount
      return Math.max(0, fuel.price - fuel.memberPrice)
    }

    const changed = items.filter((it: FuelUpdate) => {
      const beforeFuel = before.find(f => f.name === it.name)
      const afterFuel = after.find(f => f.name === it.name)
      if (!beforeFuel || !afterFuel) return false
      const priceChanged = beforeFuel.price !== afterFuel.price
      const discountChanged = resolveDiscount(beforeFuel) !== resolveDiscount(afterFuel)
      return priceChanged || discountChanged
    })

    const wrote = changed.length > 0
    return NextResponse.json({ ok: wrote, saved: items, changed })
  } catch {
    return NextResponse.json({ ok: false, error: 'Bad JSON' }, { status: 400 })
  }
}
