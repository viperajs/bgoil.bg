// lib/fuelStore.ts
import 'server-only'
import { Redis } from '@upstash/redis'
import { fuels as defaultFuels, DISCOUNT_BGN } from '@/lib/config'
import type { Fuel } from '@/lib/types'
import fs from 'fs/promises'
import path from 'path'

type FuelOverrideValue = number | { price?: number; discount?: number }
type FuelOverrides = Record<string, FuelOverrideValue>

// ↑ вдигаме версията, за да заобиколим стари, развалени данни
const KEY = 'fuels:prices:v3'
const LOCAL_FILE = path.join(process.cwd(), '.data', 'fuel-overrides.json')

// ---- Redis клиент ----
let redisAuthFailed = false // Flag to track auth failures and avoid repeated errors

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

// ---- четене от локален файл ----
async function readLocalOverrides(): Promise<FuelOverrides | null> {
  try {
    const data = await fs.readFile(LOCAL_FILE, 'utf-8')
    return JSON.parse(data) as FuelOverrides
  } catch (e) {
    // Файлът не съществува или е невалиден
    return null
  }
}

// ---- запис в локален файл ----
async function writeLocalOverrides(value: FuelOverrides): Promise<void> {
  try {
    // Създаваме директорията ако не съществува
    await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true })
    await fs.writeFile(LOCAL_FILE, JSON.stringify(value, null, 2), 'utf-8')
    console.log('fuelStore: saved to local file', LOCAL_FILE)
  } catch (e) {
    console.error('fuelStore: failed to write local file:', e)
  }
}

// ---- безопасно четене от KV (приема string ИЛИ object) ----
async function safeGetOverrides(): Promise<FuelOverrides | null> {
  // Първо опитваме локалния файл
  const localData = await readLocalOverrides()
  if (localData !== null) {
    console.log('fuelStore: loaded from local file')
    return localData
  }

  // Ако няма локални данни, опитваме Redis
  if (!redis || redisAuthFailed) {
    console.log('fuelStore: no Redis, no local file - using defaults')
    return null
  }

  try {
    const val = (await redis.get(KEY as any)) as unknown
    if (val == null) return null

    if (typeof val === 'string') {
      try { return JSON.parse(val) as FuelOverrides }
      catch (e) { console.error('fuelStore: parse failed (string)', e); return null }
    }
    if (typeof val === 'object') {
      return val as FuelOverrides
    }
    return null
  } catch (e) {
    const error = e as Error
    const isAuthError = error.message.includes('WRONGPASS') ||
                       error.message.includes('invalid or missing auth token') ||
                       error.message.includes('unauthorized')

    if (isAuthError) {
      if (!redisAuthFailed) {
        console.warn('fuelStore: Redis authentication failed. Using local file storage.')
        redisAuthFailed = true
      }
    } else {
      console.error('fuelStore: redis.get failed:', error.message)
    }
    return null
  }
}

// ---- безопасен запис в KV (пишем директно обект) ----
async function safeSetOverrides(value: FuelOverrides): Promise<void> {
  // ВИНАГИ записваме в локалния файл
  await writeLocalOverrides(value)

  // Опитваме се да запишем и в Redis (ако е наличен)
  if (!redis || redisAuthFailed) {
    console.log('fuelStore: saved to local file only (Redis not available)')
    return
  }

  try {
    await redis.set(KEY, value as any)
    console.log('fuelStore: saved to both Redis and local file')
  } catch (e) {
    const error = e as Error
    const isAuthError = error.message.includes('WRONGPASS') ||
                       error.message.includes('invalid or missing auth token') ||
                       error.message.includes('unauthorized')

    if (isAuthError) {
      if (!redisAuthFailed) {
        console.warn('fuelStore: Redis authentication failed. Saved to local file only.')
        redisAuthFailed = true
      }
    } else {
      console.error('fuelStore: redis.set failed, but saved to local file:', error.message)
    }
  }
}

// ---- публичен API: четене на ефективните цени ----
export async function getEffectiveFuels(): Promise<Fuel[]> {
  const overrides = (await safeGetOverrides()) ?? {}
  return defaultFuels.map(f => {
    const raw = overrides[f.name]
    const overridePrice =
      typeof raw === 'number'
        ? raw
        : typeof raw === 'object' && raw
          ? raw.price
          : undefined
    const overrideDiscount =
      typeof raw === 'object' && raw && typeof raw.discount === 'number'
        ? raw.discount
        : undefined

    const price = typeof overridePrice === 'number' ? overridePrice : f.price
    const fallbackDiscount =
      typeof f.discount === 'number' ? f.discount : DISCOUNT_BGN
    const discount = typeof overrideDiscount === 'number' ? overrideDiscount : fallbackDiscount
    const memberPrice = Math.max(0, price - discount)
    return { ...f, price, discount, memberPrice }
  })
}

// ---- запис на нови цени (алиаси към БГ каноните от config) ----
export async function setFuelPrices(items: { name: string; price: number; discount?: number }[]) {
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

  const clean: Record<string, { price: number; discount?: number }> = {}
  for (const it of items) {
    const canonical = resolve(String(it?.name ?? ''))
    const price = Number(it?.price)
    const discount = it?.discount
    if (!canonical) continue
    if (!Number.isFinite(price) || price < 0) continue
    const entry: { price: number; discount?: number } = { price }
    const discountNum = Number(discount)
    if (Number.isFinite(discountNum) && discountNum >= 0) {
      entry.discount = discountNum
    }
    clean[canonical] = entry
  }

  await safeSetOverrides(clean)
}
