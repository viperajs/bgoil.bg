// lib/fuelStore.ts
import { fuels as defaultFuels, DISCOUNT_BGN } from '@/lib/config'
import type { Fuel } from '@/lib/types'
import { Redis } from '@upstash/redis'
import { promises as fs } from 'fs'
import path from 'path'

type FuelOverride = Record<string, number>
const KEY = 'fuels:prices:v1'

// --- Upstash Redis ---
let redis: Redis | null = null
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  })
}

// --- JSON файл за локално ---
const dataDir = path.join(process.cwd(), '.data')
const dataFile = path.join(dataDir, 'fuels.json')

async function fileRead(): Promise<FuelOverride | null> {
  try {
    const raw = await fs.readFile(dataFile, 'utf8')
    return JSON.parse(raw) as FuelOverride
  } catch {
    return null
  }
}
async function fileWrite(value: FuelOverride): Promise<void> {
  await fs.mkdir(dataDir, { recursive: true })
  await fs.writeFile(dataFile, JSON.stringify(value, null, 2), 'utf8')
}

// --- Safe функции ---
async function safeGetOverrides(): Promise<FuelOverride | null> {
  if (redis) {
    try {
      const res = await redis.get<FuelOverride>(KEY)
      return res ?? null
    } catch {}
  }
  return await fileRead()
}

async function safeSetOverrides(value: FuelOverride): Promise<void> {
  if (redis) {
    try {
      await redis.set(KEY, value)
      return
    } catch {}
  }
  await fileWrite(value)
}

// --- Публичен API ---
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
