import 'server-only'
import { Redis } from '@upstash/redis'
import { fuels as defaultFuels, DISCOUNT_BGN } from '@/lib/config'
import type { Fuel } from '@/lib/types'

type FuelOverride = Record<string, number>
const KEY = 'fuels:prices:v1'

function getRedis() {
  const url = process.env.UPSTASH_REDIS_KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_KV_REST_API_TOKEN
  if (!url || !token) return null
  try {
    // Лог за диагностика (ще го видиш в Runtime Logs)
    console.log('Upstash host:', new URL(url).hostname)
  } catch {}
  return new Redis({ url, token })
}

const redis = getRedis()

async function safeGetOverrides(): Promise<FuelOverride | null> {
  if (!redis) return null
  try {
    const str = await redis.get<string>(KEY)
    if (!str) return null
    try { return JSON.parse(str) as FuelOverride } 
    catch (e) { console.error('fuelStore: bad JSON', e); return null }
  } catch (e) {
    console.error('fuelStore: redis.get failed:', (e as Error).message)
    return null
  }
}

async function safeSetOverrides(value: FuelOverride): Promise<void> {
  if (!redis) { console.warn('fuelStore: no redis env; skip set'); return }
  try {
    await redis.set(KEY, JSON.stringify(value))
  } catch (e) {
    console.error('fuelStore: redis.set failed:', (e as Error).message)
  }
}

export async function getEffectiveFuels(): Promise<Fuel[]> {
  const overrides = (await safeGetOverrides()) ?? {}
  return defaultFuels.map((f) => {
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
