// lib/roomsStore.ts
import 'server-only'
import fs from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'
import { createJsonKvStore } from '@/lib/jsonKvStore'
import type { HotelRoomFull } from '@/lib/types'

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

const store = createJsonKvStore<HotelRoomFull[]>({
  key: 'hotel:rooms:v2',
  filename: 'hotel-rooms.json',
  label: 'roomsStore',
})

// Възстановяване на стандартните стаи (ползва се и от админ бутона)
export async function restoreDefaultRooms(): Promise<HotelRoomFull[]> {
  return store.withLock(() => seedRooms())
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
  await store.write(seeded)
  return seeded
}

// Нормализация на записи от склада: стари/непълни записи (напр. {name, price}
// от предишната версия на сайта) получават всички задължителни полета, за да
// не гърми UI-ят на липсващи масиви и да се показват на сайта.
function normalizeRoom(raw: unknown, index: number): HotelRoomFull {
  const r = (raw ?? {}) as Partial<HotelRoomFull> & Record<string, unknown>
  const name = typeof r.name === 'string' && r.name.trim() ? r.name.trim() : `Стая ${index + 1}`
  const price = Number(r.price)
  const capacity = Number(r.capacity)
  return {
    id: typeof r.id === 'string' && r.id ? r.id : name,
    name,
    type: typeof r.type === 'string' && r.type.trim() ? r.type : name,
    price: Number.isFinite(price) && price >= 0 ? price : 0,
    capacity: Number.isInteger(capacity) && capacity >= 1 ? capacity : 2,
    size: typeof r.size === 'string' ? r.size : '',
    bedType: typeof r.bedType === 'string' ? r.bedType : '',
    description: typeof r.description === 'string' ? r.description : '',
    amenities: Array.isArray(r.amenities) ? r.amenities.filter((a): a is string => typeof a === 'string') : [],
    images: Array.isArray(r.images) ? r.images.filter((i): i is string => typeof i === 'string') : [],
    available: typeof r.available === 'boolean' ? r.available : true,
    sortOrder: typeof r.sortOrder === 'number' ? r.sortOrder : index,
  }
}

// ---- публичен API ----
export async function getRooms(): Promise<HotelRoomFull[]> {
  const rooms = await store.read()
  // null = никога не е записвано (празният масив [] е валидно състояние)
  if (rooms === null) return sortRooms(await seedRooms())
  return sortRooms(rooms.map(normalizeRoom))
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
  return store.withLock(async () => {
    const rooms = await getRooms()
    const room: HotelRoomFull = {
      ...input,
      id: randomUUID(),
      sortOrder: input.sortOrder ?? (rooms.length > 0 ? Math.max(...rooms.map(r => r.sortOrder ?? 0)) + 1 : 0),
    }
    await store.write([...rooms, room])
    return room
  })
}

export async function updateRoom(id: string, input: Partial<RoomInput>): Promise<HotelRoomFull | null> {
  return store.withLock(async () => {
    const rooms = await getRooms()
    const idx = rooms.findIndex(r => r.id === id)
    if (idx === -1) return null
    const updated: HotelRoomFull = { ...rooms[idx], ...input, id }
    const next = [...rooms]
    next[idx] = updated
    await store.write(next)
    return updated
  })
}

export async function deleteRoom(id: string): Promise<boolean> {
  return store.withLock(async () => {
    const rooms = await getRooms()
    const next = rooms.filter(r => r.id !== id)
    if (next.length === rooms.length) return false
    await store.write(next)
    return true
  })
}

function sortRooms(rooms: HotelRoomFull[]): HotelRoomFull[] {
  return [...rooms].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
}
