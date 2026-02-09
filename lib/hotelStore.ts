// lib/hotelStore.ts
import 'server-only'
import { Redis } from '@upstash/redis'
import fs from 'fs/promises'
import path from 'path'
import type { HotelRoom, HotelInfo } from '@/lib/types'

type HotelOverrideValue = number | { price?: number }
type HotelOverrides = Record<string, HotelOverrideValue>

const KEY = 'hotel:prices:v1'
const INFO_KEY = 'hotel:info:v1'
const LOCAL_FILE = path.join(process.cwd(), '.data', 'hotel-overrides.json')
const INFO_FILE = path.join(process.cwd(), '.data', 'hotel-info.json')

// Default hotel rooms
const defaultRooms: HotelRoom[] = [
  { name: 'Единична стая', price: 25, unit: '€/нощ' },
  { name: 'Двойна стая', price: 35, unit: '€/нощ' },
  { name: 'Тройна стая', price: 45, unit: '€/нощ' },
  { name: 'Апартамент', price: 50, unit: '€/нощ' },
]

const defaultInfo: HotelInfo = {
  checkIn: '12:00',
  checkOut: '11:00',
}

// ---- Redis клиент ----
let redisAuthFailed = false

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
async function readLocalOverrides(): Promise<HotelOverrides | null> {
  try {
    const data = await fs.readFile(LOCAL_FILE, 'utf-8')
    return JSON.parse(data) as HotelOverrides
  } catch (e) {
    return null
  }
}

async function readLocalInfo(): Promise<HotelInfo | null> {
  try {
    const data = await fs.readFile(INFO_FILE, 'utf-8')
    return JSON.parse(data) as HotelInfo
  } catch (e) {
    return null
  }
}

// ---- запис в локален файл ----
async function writeLocalOverrides(value: HotelOverrides): Promise<void> {
  try {
    await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true })
    await fs.writeFile(LOCAL_FILE, JSON.stringify(value, null, 2), 'utf-8')
    console.log('hotelStore: saved to local file', LOCAL_FILE)
  } catch (e) {
    console.error('hotelStore: failed to write local file:', e)
  }
}

async function writeLocalInfo(value: HotelInfo): Promise<void> {
  try {
    await fs.mkdir(path.dirname(INFO_FILE), { recursive: true })
    await fs.writeFile(INFO_FILE, JSON.stringify(value, null, 2), 'utf-8')
    console.log('hotelStore: saved info to local file', INFO_FILE)
  } catch (e) {
    console.error('hotelStore: failed to write info file:', e)
  }
}

// ---- безопасно четене от KV ----
async function safeGetOverrides(): Promise<HotelOverrides | null> {
  const localData = await readLocalOverrides()
  if (localData !== null) {
    console.log('hotelStore: loaded from local file')
    return localData
  }

  if (!redis || redisAuthFailed) {
    console.log('hotelStore: no Redis, no local file - using defaults')
    return null
  }

  try {
    const val = (await redis.get(KEY as any)) as unknown
    if (val == null) return null

    if (typeof val === 'string') {
      try { return JSON.parse(val) as HotelOverrides }
      catch (e) { console.error('hotelStore: parse failed (string)', e); return null }
    }
    if (typeof val === 'object') {
      return val as HotelOverrides
    }
    return null
  } catch (e) {
    const error = e as Error
    const isAuthError = error.message.includes('WRONGPASS') ||
                       error.message.includes('invalid or missing auth token') ||
                       error.message.includes('unauthorized')

    if (isAuthError) {
      if (!redisAuthFailed) {
        console.warn('hotelStore: Redis authentication failed. Using local file storage.')
        redisAuthFailed = true
      }
    } else {
      console.error('hotelStore: redis.get failed:', error.message)
    }
    return null
  }
}

async function safeGetInfo(): Promise<HotelInfo | null> {
  const localData = await readLocalInfo()
  if (localData !== null) {
    return localData
  }

  if (!redis || redisAuthFailed) {
    return null
  }

  try {
    const val = (await redis.get(INFO_KEY as any)) as unknown
    if (val == null) return null

    if (typeof val === 'string') {
      try { return JSON.parse(val) as HotelInfo }
      catch (e) { console.error('hotelStore: parse info failed (string)', e); return null }
    }
    if (typeof val === 'object') {
      return val as HotelInfo
    }
    return null
  } catch (e) {
    const error = e as Error
    const isAuthError = error.message.includes('WRONGPASS') ||
                       error.message.includes('invalid or missing auth token') ||
                       error.message.includes('unauthorized')

    if (isAuthError) {
      if (!redisAuthFailed) {
        console.warn('hotelStore: Redis authentication failed. Using local file storage.')
        redisAuthFailed = true
      }
    } else {
      console.error('hotelStore: redis.get info failed:', error.message)
    }
    return null
  }
}

// ---- безопасен запис в KV ----
async function safeSetOverrides(value: HotelOverrides): Promise<void> {
  await writeLocalOverrides(value)

  if (!redis || redisAuthFailed) {
    console.log('hotelStore: saved to local file only (Redis not available)')
    return
  }

  try {
    await redis.set(KEY, value as any)
    console.log('hotelStore: saved to both Redis and local file')
  } catch (e) {
    const error = e as Error
    const isAuthError = error.message.includes('WRONGPASS') ||
                       error.message.includes('invalid or missing auth token') ||
                       error.message.includes('unauthorized')

    if (isAuthError) {
      if (!redisAuthFailed) {
        console.warn('hotelStore: Redis authentication failed. Saved to local file only.')
        redisAuthFailed = true
      }
    } else {
      console.error('hotelStore: redis.set failed, but saved to local file:', error.message)
    }
  }
}

async function safeSetInfo(value: HotelInfo): Promise<void> {
  await writeLocalInfo(value)

  if (!redis || redisAuthFailed) {
    console.log('hotelStore: saved info to local file only (Redis not available)')
    return
  }

  try {
    await redis.set(INFO_KEY, value as any)
    console.log('hotelStore: saved info to both Redis and local file')
  } catch (e) {
    const error = e as Error
    const isAuthError = error.message.includes('WRONGPASS') ||
                       error.message.includes('invalid or missing auth token') ||
                       error.message.includes('unauthorized')

    if (isAuthError) {
      if (!redisAuthFailed) {
        console.warn('hotelStore: Redis authentication failed. Saved info to local file only.')
        redisAuthFailed = true
      }
    } else {
      console.error('hotelStore: redis.set info failed, but saved to local file:', error.message)
    }
  }
}

// ---- публичен API: четене на ефективните цени ----
export async function getEffectiveRooms(): Promise<HotelRoom[]> {
  const overrides = (await safeGetOverrides()) ?? {}
  return defaultRooms.map(r => {
    const raw = overrides[r.name]
    const overridePrice =
      typeof raw === 'number'
        ? raw
        : typeof raw === 'object' && raw
          ? raw.price
          : undefined

    const price = typeof overridePrice === 'number' ? overridePrice : r.price
    return { ...r, price }
  })
}

export async function getHotelInfo(): Promise<HotelInfo> {
  const info = await safeGetInfo()
  return info ?? defaultInfo
}

// ---- запис на нови цени ----
export async function setHotelPrices(items: { name: string; price: number }[]) {
  const clean: Record<string, { price: number }> = {}
  for (const it of items) {
    const name = String(it?.name ?? '').trim()
    const price = Number(it?.price)
    if (!name || !Number.isFinite(price) || price < 0) continue
    clean[name] = { price }
  }

  await safeSetOverrides(clean)
}

export async function setHotelInfo(info: HotelInfo) {
  await safeSetInfo(info)
}


