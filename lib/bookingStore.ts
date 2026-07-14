// lib/bookingStore.ts
import 'server-only'
import { randomUUID } from 'crypto'
import { createJsonKvStore } from '@/lib/jsonKvStore'
import type { Booking } from '@/lib/types'

const store = createJsonKvStore<Booking[]>({
  key: 'hotel:bookings:v1',
  filename: 'bookings.json',
  label: 'bookingStore',
})

export async function getBookings(): Promise<Booking[]> {
  const bookings = await store.read()
  return sortByDate(bookings ?? [])
}

export type BookingInput = Omit<Booking, 'id' | 'status' | 'createdAt'>

export async function createBooking(input: BookingInput): Promise<Booking> {
  return store.withLock(async () => {
    const bookings = await getBookings()
    const booking: Booking = {
      ...input,
      id: randomUUID(),
      status: 'new',
      createdAt: new Date().toISOString(),
    }
    await store.write([booking, ...bookings])
    return booking
  })
}

export async function updateBookingStatus(id: string, status: Booking['status']): Promise<Booking | null> {
  return store.withLock(async () => {
    const bookings = await getBookings()
    const idx = bookings.findIndex(b => b.id === id)
    if (idx === -1) return null
    const updated = { ...bookings[idx], status }
    const next = [...bookings]
    next[idx] = updated
    await store.write(next)
    return updated
  })
}

export async function deleteBooking(id: string): Promise<boolean> {
  return store.withLock(async () => {
    const bookings = await getBookings()
    const next = bookings.filter(b => b.id !== id)
    if (next.length === bookings.length) return false
    await store.write(next)
    return true
  })
}

export async function deleteAllBookings(): Promise<void> {
  return store.withLock(async () => {
    await store.write([])
  })
}

function sortByDate(bookings: Booking[]): Booking[] {
  return [...bookings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}
