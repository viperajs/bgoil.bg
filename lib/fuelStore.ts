// lib/fuelStore.ts
import 'server-only'
import { Redis } from '@upstash/redis'
import { fuels as defaultFuels, DISCOUNT_BGN } from '@/lib/config'
import type { Fuel } from '@/lib/types'

type FuelOverride = Record<string, number>
const KEY = 'fuels:prices:v1'

// ---- Redis клиент ----
function getRedis() {
  const url = process.env.UPSTASH_REDIS_KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_KV_REST_API_TOKEN
  if (!url || !token) return null
  try {
    console.log('Upstash host:', new URL(url).hostname)
  } catch {}
  return new Redis({ url, token })
}

const redis = getRedis()

// ---- безопасно четене от KV ----
async function safeGetOverrides(): Promise<FuelOverride | null> {
  if (!redis) return null
  try {
    const val = await redis.get(KEY as any) as unknown
    if (val == null) return null

    // приемаме и string JSON, и директен обект
    if (typeof val === 'string') {
      try {
        return JSON.parse(val) as FuelOverride
      } catch (e) {
        console.error('fuelStore: parse failed (string)', e)
        return null
      }
    }

    if (typeof val === 'object') {
      // Upstash може да върне директно JSON
      return val as FuelOverride
    }

    return null
  } catch (e) {
    console.error('fuelStore: redis.get failed:', (e as Error).message)
    return null
  }
}

// ---- безопасен запис в KV ----
async function safeSetOverrides(value: FuelOverride): Promise<void> {
  if (!redis) { console.warn('fuelStore: no redis env; skip set'); return }
  try {
    // записвай директно като JSON обект (без stringify)
    await redis.set(KEY, value as any)
    console.log('fuelStore: saved overrides', value)
  } catch (e) {
    console.error('fuelStore: redis.set failed:', (e as Error).message)
  }
}


// ---- публичен API ----
export async function getEffectiveFuels(): Promise<Fuel[]> {
  const overrides = (await safeGetOverrides()) ?? {}
  return defaultFuels.map(f => {
    const price =
      typeof overrides[f.name] === 'number' ? overrides[f.name] : f.price
    const memberPrice = Math.max(0, price - DISCOUNT_BGN)
    return { ...f, price, memberPrice }
  })
}

// ---- запис на нови цени ----
export async function setFuelPrices(items: { name: string; price: number }[]) {
  // нормализатор
  const norm = (s: string) => s.toLowerCase().replace(/[\s\-\._]+/g, '')

  // канонични имена от config
  const byNorm = new Map(
    defaultFuels.map(f => [norm(f.name), f.name]) // напр. diesel -> 'Diesel'
  )

  // ✅ алиаси за българските етикети
  const aliases: Record<string, string> = {
    [norm('Дизел')]: 'Diesel',
    [norm('Бензин А95')]: 'A95',
    [norm('A95')]: 'A95',
    [norm('ГПБ')]: 'LPG',
    [norm('Г П Б')]: 'LPG',
    [norm('Газ Пропан Бутан')]: 'LPG',
    [norm('Газ')]: 'LPG',
    [norm('AdBlue')]: 'AdBlue',
  }

  // обединен резолвер: първо алиаси, после директно съвпадение
  const resolve = (raw: string) => {
    const n = norm(raw)
    return aliases[n] ?? byNorm.get(n) ?? null
  }

  const clean: Record<string, number> = {}
  for (const it of items) {
    const canonical = resolve(String(it?.name ?? ''))
    const price = Number(it?.price)
    if (!canonical) continue                      // непознато име → игнор
    if (!Number.isFinite(price) || price < 0) continue
    clean[canonical] = price
  }

  await safeSetOverrides(clean)
}

