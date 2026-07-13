// lib/hotelStore.ts — часове за настаняване/напускане.
// Стаите се управляват от lib/roomsStore.ts.
import 'server-only'
import { Redis } from '@upstash/redis'
import fs from 'fs/promises'
import path from 'path'
import type { HotelInfo } from '@/lib/types'

const INFO_KEY = 'hotel:info:v1'
const INFO_FILE = path.join(process.cwd(), '.data', 'hotel-info.json')

const defaultInfo: HotelInfo = {
  checkIn: '12:00',
  checkOut: '11:00',
}

// ---- Redis клиент (по избор, продукция) ----
let redisAuthFailed = false

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_KV_REST_API_TOKEN
  if (!url || !token) return null
  return new Redis({ url, token })
}
const redis = getRedis()

function isRedisAuthError(e: unknown): boolean {
  const msg = e instanceof Error ? e.message : ''
  return msg.includes('WRONGPASS') || msg.includes('invalid or missing auth token') || msg.includes('unauthorized')
}

async function readLocalInfo(): Promise<HotelInfo | null> {
  try {
    const data = await fs.readFile(INFO_FILE, 'utf-8')
    return JSON.parse(data) as HotelInfo
  } catch {
    return null
  }
}

async function writeLocalInfo(value: HotelInfo): Promise<void> {
  try {
    await fs.mkdir(path.dirname(INFO_FILE), { recursive: true })
    await fs.writeFile(INFO_FILE, JSON.stringify(value, null, 2), 'utf-8')
  } catch (e) {
    console.error('hotelStore: failed to write info file:', e)
  }
}

export async function getHotelInfo(): Promise<HotelInfo> {
  const local = await readLocalInfo()
  if (local !== null) return local

  if (redis && !redisAuthFailed) {
    try {
      const val = (await redis.get(INFO_KEY)) as unknown
      const parsed = typeof val === 'string' ? JSON.parse(val) : val
      if (parsed && typeof parsed === 'object') {
        return parsed as HotelInfo
      }
    } catch (e) {
      if (isRedisAuthError(e)) {
        redisAuthFailed = true
        console.warn('hotelStore: Redis authentication failed. Using local file storage.')
      } else {
        console.error('hotelStore: redis.get info failed:', e)
      }
    }
  }

  return defaultInfo
}

export async function setHotelInfo(info: HotelInfo): Promise<void> {
  await writeLocalInfo(info)

  if (!redis || redisAuthFailed) return
  try {
    await redis.set(INFO_KEY, info as any)
  } catch (e) {
    if (isRedisAuthError(e)) {
      redisAuthFailed = true
      console.warn('hotelStore: Redis authentication failed. Saved info to local file only.')
    } else {
      console.error('hotelStore: redis.set info failed:', e)
    }
  }
}
