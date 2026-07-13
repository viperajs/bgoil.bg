// lib/roomsStore.ts
import 'server-only'
import { Redis } from '@upstash/redis'
import fs from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'
import type { HotelRoomFull } from '@/lib/types'

const ROOMS_KEY = 'hotel:rooms:v2'
const ROOMS_FILE = path.join(process.cwd(), '.data', 'hotel-rooms.json')
const LEGACY_OVERRIDES_FILE = path.join(process.cwd(), '.data', 'hotel-overrides.json')

// Първоначални стаи – обединени данни от старите hotel/booking страници
const defaultRooms: HotelRoomFull[] = [
  {
    id: 'single',
    name: 'Единична стая',
    type: 'Единична',
    price: 25,
    capacity: 1,
    size: '18 m²',
    bedType: '1 единично легло',
    description:
      'Перфектно за самостоятелни пътници. Уютно и ефективно пространство с удобно единично легло, модерно бюро за работа и самостоятелна баня.',
    amenities: ['Wi-Fi', 'Климатик', 'Телевизор', 'Бюро', 'Душ', 'Тоалетни принадлежности'],
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=1000',
    ],
    available: true,
    sortOrder: 0,
  },
  {
    id: 'double',
    name: 'Двойна стая',
    type: 'Двойна',
    price: 35,
    capacity: 2,
    size: '24 m²',
    bedType: '1 голяма спалня',
    description:
      'Идеално за двойки или бизнес пътници, които се нуждаят от повече пространство. Просторно двойно легло, кът за сядане и светъл модерен декор.',
    amenities: ['Wi-Fi', 'Климатик', 'Телевизор', 'Кът за сядане', 'Минибар', 'Сешоар'],
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1000',
    ],
    available: true,
    sortOrder: 1,
  },
  {
    id: 'triple',
    name: 'Тройна стая',
    type: 'Тройна',
    price: 45,
    capacity: 3,
    size: '30 m²',
    bedType: '1 единично, 1 двойно легло',
    description:
      'Чудесно за малки семейства или групи. Тази просторна стая предлага гъвкавост с множество опции за легла и достатъчно място.',
    amenities: ['Wi-Fi', 'Климатик', 'Телевизор', 'Шумоизолация', 'Гардероб', 'Събуждане'],
    images: [
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=1000',
    ],
    available: true,
    sortOrder: 2,
  },
  {
    id: 'apartment',
    name: 'Апартамент',
    type: 'Апартамент',
    price: 50,
    capacity: 4,
    size: '45 m²',
    bedType: '1 спалня + хол',
    description:
      'Луксозен престой с отделна спалня и всекидневна. Първокласно обзавеждане и спиращи дъха гледки към Врачанския балкан.',
    amenities: ['Wi-Fi', 'Климатик', '2 Телевизора', 'Диван', 'Хладилник', 'Балкон'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000',
    ],
    available: true,
    sortOrder: 3,
  },
]

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

// ---- локален файл ----
async function readLocalRooms(): Promise<HotelRoomFull[] | null> {
  try {
    const data = await fs.readFile(ROOMS_FILE, 'utf-8')
    const parsed = JSON.parse(data)
    return Array.isArray(parsed) ? (parsed as HotelRoomFull[]) : null
  } catch {
    return null
  }
}

async function writeLocalRooms(rooms: HotelRoomFull[]): Promise<void> {
  try {
    await fs.mkdir(path.dirname(ROOMS_FILE), { recursive: true })
    await fs.writeFile(ROOMS_FILE, JSON.stringify(rooms, null, 2), 'utf-8')
  } catch (e) {
    console.error('roomsStore: failed to write local file:', e)
  }
}

// Миграция: пренасяме старите ценови override-и (име -> цена) върху дефолтните стаи
async function seedRooms(): Promise<HotelRoomFull[]> {
  let seeded = defaultRooms
  try {
    const data = await fs.readFile(LEGACY_OVERRIDES_FILE, 'utf-8')
    const overrides = JSON.parse(data) as Record<string, number | { price?: number }>
    seeded = defaultRooms.map(r => {
      const raw = overrides[r.name]
      const price = typeof raw === 'number' ? raw : typeof raw === 'object' && raw ? raw.price : undefined
      return typeof price === 'number' && Number.isFinite(price) ? { ...r, price } : r
    })
  } catch {
    // няма стари данни
  }
  await saveRooms(seeded)
  return seeded
}

async function saveRooms(rooms: HotelRoomFull[]): Promise<void> {
  await writeLocalRooms(rooms)

  if (!redis || redisAuthFailed) return
  try {
    await redis.set(ROOMS_KEY, rooms as any)
  } catch (e) {
    if (isRedisAuthError(e)) {
      redisAuthFailed = true
      console.warn('roomsStore: Redis authentication failed. Using local file storage.')
    } else {
      console.error('roomsStore: redis.set failed:', e)
    }
  }
}

// ---- публичен API ----
export async function getRooms(): Promise<HotelRoomFull[]> {
  const local = await readLocalRooms()
  if (local !== null) return sortRooms(local)

  if (redis && !redisAuthFailed) {
    try {
      const val = (await redis.get(ROOMS_KEY)) as unknown
      const parsed = typeof val === 'string' ? JSON.parse(val) : val
      if (Array.isArray(parsed) && parsed.length > 0) {
        const rooms = parsed as HotelRoomFull[]
        await writeLocalRooms(rooms)
        return sortRooms(rooms)
      }
    } catch (e) {
      if (isRedisAuthError(e)) {
        redisAuthFailed = true
        console.warn('roomsStore: Redis authentication failed. Using local file storage.')
      } else {
        console.error('roomsStore: redis.get failed:', e)
      }
    }
  }

  return sortRooms(await seedRooms())
}

export async function getAvailableRooms(): Promise<HotelRoomFull[]> {
  const rooms = await getRooms()
  return rooms.filter(r => r.available)
}

export async function getRoomById(id: string): Promise<HotelRoomFull | null> {
  const rooms = await getRooms()
  return rooms.find(r => r.id === id) ?? null
}

export type RoomInput = Omit<HotelRoomFull, 'id' | 'sortOrder'> & { sortOrder?: number }

export async function createRoom(input: RoomInput): Promise<HotelRoomFull> {
  const rooms = await getRooms()
  const room: HotelRoomFull = {
    ...input,
    id: randomUUID(),
    sortOrder: input.sortOrder ?? (rooms.length > 0 ? Math.max(...rooms.map(r => r.sortOrder ?? 0)) + 1 : 0),
  }
  await saveRooms([...rooms, room])
  return room
}

export async function updateRoom(id: string, input: Partial<RoomInput>): Promise<HotelRoomFull | null> {
  const rooms = await getRooms()
  const idx = rooms.findIndex(r => r.id === id)
  if (idx === -1) return null
  const updated: HotelRoomFull = { ...rooms[idx], ...input, id }
  const next = [...rooms]
  next[idx] = updated
  await saveRooms(next)
  return updated
}

export async function deleteRoom(id: string): Promise<boolean> {
  const rooms = await getRooms()
  const next = rooms.filter(r => r.id !== id)
  if (next.length === rooms.length) return false
  await saveRooms(next)
  return true
}

function sortRooms(rooms: HotelRoomFull[]): HotelRoomFull[] {
  return [...rooms].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
}
