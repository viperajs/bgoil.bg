// lib/bookingStore.ts
import 'server-only'
import { Redis } from '@upstash/redis'
import fs from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'
import type { Booking } from '@/lib/types'

const BOOKINGS_KEY = 'hotel:bookings:v1'
const BOOKINGS_FILE = path.join(process.cwd(), '.data', 'bookings.json')

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

async function readLocal(): Promise<Booking[] | null> {
  try {
    const data = await fs.readFile(BOOKINGS_FILE, 'utf-8')
    const parsed = JSON.parse(data)
    return Array.isArray(parsed) ? (parsed as Booking[]) : null
  } catch {
    return null
  }
}

async function writeLocal(bookings: Booking[]): Promise<void> {
  try {
    await fs.mkdir(path.dirname(BOOKINGS_FILE), { recursive: true })
    await fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), 'utf-8')
  } catch (e) {
    console.error('bookingStore: failed to write local file:', e)
  }
}

async function save(bookings: Booking[]): Promise<void> {
  await writeLocal(bookings)
  if (!redis || redisAuthFailed) return
  try {
    await redis.set(BOOKINGS_KEY, bookings as any)
  } catch (e) {
    if (isRedisAuthError(e)) {
      redisAuthFailed = true
      console.warn('bookingStore: Redis authentication failed. Using local file storage.')
    } else {
      console.error('bookingStore: redis.set failed:', e)
    }
  }
}

export async function getBookings(): Promise<Booking[]> {
  const local = await readLocal()
  if (local !== null) return sortByDate(local)

  if (redis && !redisAuthFailed) {
    try {
      const val = (await redis.get(BOOKINGS_KEY)) as unknown
      const parsed = typeof val === 'string' ? JSON.parse(val) : val
      if (Array.isArray(parsed)) {
        const bookings = parsed as Booking[]
        await writeLocal(bookings)
        return sortByDate(bookings)
      }
    } catch (e) {
      if (isRedisAuthError(e)) {
        redisAuthFailed = true
      } else {
        console.error('bookingStore: redis.get failed:', e)
      }
    }
  }

  return []
}

export type BookingInput = Omit<Booking, 'id' | 'status' | 'createdAt'>

export async function createBooking(input: BookingInput): Promise<Booking> {
  const bookings = await getBookings()
  const booking: Booking = {
    ...input,
    id: randomUUID(),
    status: 'new',
    createdAt: new Date().toISOString(),
  }
  await save([booking, ...bookings])
  return booking
}

export async function updateBookingStatus(id: string, status: Booking['status']): Promise<Booking | null> {
  const bookings = await getBookings()
  const idx = bookings.findIndex(b => b.id === id)
  if (idx === -1) return null
  const updated = { ...bookings[idx], status }
  const next = [...bookings]
  next[idx] = updated
  await save(next)
  return updated
}

export async function deleteBooking(id: string): Promise<boolean> {
  const bookings = await getBookings()
  const next = bookings.filter(b => b.id !== id)
  if (next.length === bookings.length) return false
  await save(next)
  return true
}

export async function deleteAllBookings(): Promise<void> {
  await save([])
}

function sortByDate(bookings: Booking[]): Booking[] {
  return [...bookings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}
