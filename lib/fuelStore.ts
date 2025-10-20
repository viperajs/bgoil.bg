import 'server-only'
import { Redis } from '@upstash/redis'
import { fuels as defaultFuels, DISCOUNT_BGN } from '@/lib/config'
import type { Fuel } from '@/lib/types'

type FuelOverride = Record<string, number>
const KEY = 'fuels:prices:v1'

// чете твоите UPSTASH_* променливи
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_KV_REST_API_URL!,
  token: process.env.UPSTASH_REDIS_KV_REST_API_TOKEN!,
})

async function safeGetOverrides(): Promise<FuelOverride | null> {
  const str = await redis.get<string>(KEY)
  return str ? (JSON.parse(str) as FuelOverride) : null
}
async function safeSetOverrides(value: FuelOverride): Promise<void> {
  await redis.set(KEY, JSON.stringify(value))
}

export async function getEffectiveFuels(): Promise<Fuel[]> {
  const overrides = (await safeGetOverrides()) ?? {}
  return defaultFuels.map(f => {
    const price = typeof overrides[f.name] === 'number' ? overrides[f.name] : f.price
    const memberPrice = Math.max(0, price - DISCOUNT_BGN)
    return { ...f, price, memberPrice }
  })
}
export async function setFuelPrices(items: { name: string; price: number }[]) {
  const clean: FuelOverride = {}
  for (const it of items) {
    const name = String(it.name ?? '').trim()
    const price = Number(it.price)
    if (!name) continue
    if (!Number.isFinite(price) || price < 0) continue
    clean[name] = price
  }
  await safeSetOverrides(clean)
}
