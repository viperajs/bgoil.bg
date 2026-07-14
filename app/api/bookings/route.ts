// app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin, unauthorizedResponse } from '@/lib/auth'
import {
  getBookings,
  createBooking,
  updateBookingStatus,
  deleteBooking,
  deleteAllBookings,
} from '@/lib/bookingStore'
import { getRoomById } from '@/lib/roomsStore'

// Реална календарна дата (отхвърля напр. 2026-02-31, който Date() тихо превърта)
function isRealDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false
  const d = new Date(`${s}T00:00:00Z`)
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s
}

const dateSchema = z.string().refine(isRealDate, 'Невалидна дата')

const bookingSchema = z.object({
  fullName: z.string().trim().min(3, 'Името трябва да е поне 3 символа').max(120),
  phone: z.string().trim().min(6, 'Невалиден телефон').max(30),
  roomId: z.string().trim().min(1),
  checkIn: dateSchema,
  checkOut: dateSchema,
  callRequested: z.boolean().default(false),
  preferredTime: z.string().trim().max(10).optional(),
})

// Публично: създаване на резервация
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = bookingSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues.map(i => i.message).join('; ') },
        { status: 400 }
      )
    }

    const data = parsed.data
    const room = await getRoomById(data.roomId)
    if (!room || !room.available) {
      return NextResponse.json({ ok: false, error: 'Стаята не е налична' }, { status: 400 })
    }

    const start = new Date(`${data.checkIn}T00:00:00Z`)
    const end = new Date(`${data.checkOut}T00:00:00Z`)
    const nights = Math.round((end.getTime() - start.getTime()) / 86400000)
    if (!Number.isFinite(nights) || nights < 1) {
      return NextResponse.json(
        { ok: false, error: 'Датата на напускане трябва да е след датата на настаняване' },
        { status: 400 }
      )
    }

    // Настаняването не може да е в миналото (локална дата за България)
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Sofia' })
    if (data.checkIn < today) {
      return NextResponse.json(
        { ok: false, error: 'Датата на настаняване не може да е в миналото' },
        { status: 400 }
      )
    }

    const booking = await createBooking({
      fullName: data.fullName,
      phone: data.phone,
      roomId: room.id,
      roomType: room.name,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      nights,
      callRequested: data.callRequested,
      preferredTime: data.preferredTime,
      totalPrice: nights * room.price,
    })

    return NextResponse.json({ ok: true, booking })
  } catch (e) {
    console.error('POST /api/bookings error:', e)
    return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 })
  }
}

// Админ: списък с резервации
export async function GET(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorizedResponse()
  try {
    const bookings = await getBookings()
    return NextResponse.json({ ok: true, bookings })
  } catch (e) {
    console.error('GET /api/bookings error:', e)
    return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 })
  }
}

// Админ: смяна на статус
export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorizedResponse()
  try {
    const body = await req.json()
    const id = typeof body?.id === 'string' ? body.id : ''
    const status = body?.status === 'confirmed' ? 'confirmed' : body?.status === 'new' ? 'new' : null
    if (!id || !status) {
      return NextResponse.json({ ok: false, error: 'Невалидни данни' }, { status: 400 })
    }
    const booking = await updateBookingStatus(id, status)
    if (!booking) {
      return NextResponse.json({ ok: false, error: 'Резервацията не е намерена' }, { status: 404 })
    }
    return NextResponse.json({ ok: true, booking })
  } catch (e) {
    console.error('PATCH /api/bookings error:', e)
    return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 })
  }
}

// Админ: изтриване (?id=... или ?all=1)
export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorizedResponse()
  try {
    const id = req.nextUrl.searchParams.get('id')
    const all = req.nextUrl.searchParams.get('all')

    if (all === '1') {
      await deleteAllBookings()
      return NextResponse.json({ ok: true })
    }

    if (!id) {
      return NextResponse.json({ ok: false, error: 'Липсва id' }, { status: 400 })
    }
    const deleted = await deleteBooking(id)
    if (!deleted) {
      return NextResponse.json({ ok: false, error: 'Резервацията не е намерена' }, { status: 404 })
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('DELETE /api/bookings error:', e)
    return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 })
  }
}
