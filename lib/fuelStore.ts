// lib/fuelStore.ts
import 'server-only'
import { fuels as defaultFuels, DISCOUNT_BGN } from '@/lib/config'
import type { Fuel } from '@/lib/types'
import { promises as fs } from 'fs'
import path from 'path'

type FuelOverride = Record<string, number>

// --- само JSON файл, без Redis ---
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

export async function getEffectiveFuels(): Promise<Fuel[]> {
  const overrides = (await fileRead()) ?? {}
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
  await fileWrite(clean)
}
