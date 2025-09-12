// lib/fuelStore.ts
import { fuels as defaultFuels, DISCOUNT_BGN } from '@/lib/config'
import type { Fuel } from '@/lib/types'
import { promises as fs } from 'fs'
import path from 'path'

type KVLike = { get: (k: string) => Promise<any>; set: (k: string, v: any) => Promise<any> }
const KEY = 'fuels:prices:v1'               // { [name]: price }
type FuelOverride = Record<string, number>

const isProd = process.env.NODE_ENV === 'production'
const hasKVEnv = !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN

// -------- KV (за Vercel) --------
let kv: KVLike | null = null
async function loadKv(): Promise<KVLike | null> {
  if (!hasKVEnv) return null
  if (kv) return kv
  try {
    const mod = await import('@vercel/kv')
    kv = (mod as any).kv as KVLike
    return kv
  } catch {
    return null
  }
}

// -------- JSON файл (за локално) --------
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

// -------- общи safe функции --------
async function safeGetOverrides(): Promise<FuelOverride | null> {
  const k = await loadKv()
  if (k) {
    try { return (await k.get(KEY)) as FuelOverride | null } catch { /* fallthrough */ }
  }
  // локален JSON
  return await fileRead()
}

async function safeSetOverrides(value: FuelOverride): Promise<void> {
  const k = await loadKv()
  if (k) {
    try { await k.set(KEY, value); return } catch { /* fallthrough */ }
  }
  // локален JSON
  await fileWrite(value)
}

// -------- публичен API за цените --------
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
