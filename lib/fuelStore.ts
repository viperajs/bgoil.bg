// lib/fuelStore.ts
import { fuels as defaultFuels, DISCOUNT_BGN } from '@/lib/config'
import type { Fuel } from '@/lib/types'
import { promises as fs } from 'fs'
import path from 'path'

type FuelOverride = Record<string, number>
const KEY = 'fuels:prices:v1'

// ======================
// KV през REST (Vercel)
// ======================
const KV_URL = process.env.KV_REST_API_URL
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.KV_REST_API_READ_ONLY_TOKEN // ако имаш само read-only токен, ще може да чете

async function kvGet<T = any>(key: string): Promise<T | null> {
  if (!KV_URL || !KV_TOKEN) return null
  try {
    const res = await fetch(`${KV_URL}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
      cache: 'no-store',
    })
    if (!res.ok) return null
    const data = await res.json().catch(() => null) as { result?: T } | null
    return data?.result ?? null
  } catch {
    return null
  }
}

async function kvSet<T = any>(key: string, value: T): Promise<boolean> {
  if (!KV_URL || !process.env.KV_REST_API_TOKEN) return false // за запис ни трябва write token
  try {
    const res = await fetch(`${KV_URL}/set/${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.KV_REST_API_TOKEN!}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value }),
    })
    return res.ok
  } catch {
    return false
  }
}

// ======================
// Локален JSON fallback
// ======================
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

// ======================
// Публични функции
// ======================
export async function getEffectiveFuels(): Promise<Fuel[]> {
  // 1) Опитай KV (ако е конфигуриран)
  const fromKv = await kvGet<FuelOverride>(KEY)
  const overrides = fromKv ?? (await fileRead()) ?? {}
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

  // 1) опитай да пишеш в KV (ако имаме write token)
  const ok = await kvSet(KEY, clean)
  if (ok) return

  // 2) иначе — локален файл (localhost/dev)
  await fileWrite(clean)
}
