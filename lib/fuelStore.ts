// lib/fuelStore.ts
import 'server-only'
import { Redis } from '@upstash/redis'
import { fuels as defaultFuels, DISCOUNT_BGN } from '@/lib/config'
import type { Fuel } from '@/lib/types'

type FuelOverride = Record<string, number>

// ↑ вдигаме версията, за да заобиколим стари, развалени данни
const KEY = 'fuels:prices:v3'

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

// ---- безопасно четене от KV (приема string ИЛИ object) ----
async function safeGetOverrides(): Promise<FuelOverride | null> {
  if (!redis) return null
  try {
    const val = (await redis.get(KEY as any)) as unknown
    if (val == null) return null

    if (typeof val === 'string') {
      try { return JSON.parse(val) as FuelOverride }
      catch (e) { console.error('fuelStore: parse failed (string)', e); return null }
    }
    if (typeof val === 'object') {
      return val as FuelOverride
    }
    return null
  } catch (e) {
    console.error('fuelStore: redis.get failed:', (e as Error).message)
    return null
  }
}

// ---- безопасен запис в KV (пишем директно обект) ----
async function safeSetOverrides(value: FuelOverride): Promise<void> {
  if (!redis) { console.warn('fuelStore: no redis env; skip set'); return }
  try {
    await redis.set(KEY, value as any)
    console.log('fuelStore: saved overrides', value)
  } catch (e) {
    console.error('fuelStore: redis.set failed:', (e as Error).message)
  }
}

// ---- публичен API: четене на ефективните цени ----
export async function getEffectiveFuels(): Promise<Fuel[]> {
  const overrides = (await safeGetOverrides()) ?? {}
  return defaultFuels.map(f => {
    const price =
      typeof overrides[f.name] === 'number' ? overrides[f.name] : f.price
    const memberPrice = Math.max(0, price - DISCOUNT_BGN)
    return { ...f, price, memberPrice }
  })
}

// ---- запис на нови цени (алиаси към БГ каноните от config) ----
export async function setFuelPrices(items: { name: string; price: number }[]) {
  const norm = (s: string) => s.toLowerCase().replace(/[\s\-\._]+/g, '')

  // каноничните ИМЕНА са тези от config (на български)
  const byNorm = new Map(defaultFuels.map(f => [norm(f.name), f.name]))

  // алиаси → винаги сочат към БГ каноните
  const aliases: Record<string, string> = {
    [norm('Дизел')]: 'Дизел',
    [norm('Diesel')]: 'Дизел',
    [norm('Dizel')]: 'Дизел',

    [norm('Бензин А95')]: 'Бензин А95',
    [norm('A95')]: 'Бензин А95',
    [norm('А95')]: 'Бензин А95',
    [norm('Бензин A95')]: 'Бензин А95',

    [norm('Г П Б')]: 'Г П Б',
    [norm('ГПБ')]: 'Г П Б',
    [norm('Газ Пропан Бутан')]: 'Г П Б',
    [norm('Газ')]: 'Г П Б',
    [norm('LPG')]: 'Г П Б',

    [norm('AdBlue')]: 'AdBlue',
  }

  const resolve = (raw: string) => {
    const n = norm(raw)
    return aliases[n] ?? byNorm.get(n) ?? null
  }

  const clean: Record<string, number> = {}
  for (const it of items) {
    const canonical = resolve(String(it?.name ?? ''))
    const price = Number(it?.price)
    if (!canonical) continue
    if (!Number.isFinite(price) || price < 0) continue
    clean[canonical] = price
  }

  await safeSetOverrides(clean)
}
