// app/api/admin/rooms/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireAdmin, unauthorizedResponse } from '@/lib/auth'
import { getRooms, createRoom, updateRoom, deleteRoom } from '@/lib/roomsStore'

const roomSchema = z.object({
  name: z.string().trim().min(2, 'Името трябва да е поне 2 символа').max(100),
  type: z.string().trim().min(2, 'Типът е задължителен').max(50),
  price: z.number().finite().min(0, 'Цената не може да е отрицателна').max(10000),
  capacity: z.number().int().min(1, 'Капацитетът трябва да е поне 1').max(20),
  size: z.string().trim().max(30).optional().default(''),
  bedType: z.string().trim().max(100).optional().default(''),
  description: z.string().trim().min(10, 'Описанието трябва да е поне 10 символа').max(2000),
  amenities: z.array(z.string().trim().min(1).max(60)).max(30).default([]),
  images: z.array(z.string().trim().min(1).max(500)).max(12).default([]),
  available: z.boolean().default(true),
  sortOrder: z.number().int().optional(),
})

function revalidatePublicPages() {
  revalidatePath('/hotel')
  revalidatePath('/')
}

export async function GET(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorizedResponse()
  try {
    const rooms = await getRooms()
    return NextResponse.json({ ok: true, rooms })
  } catch (e) {
    console.error('GET /api/admin/rooms error:', e)
    return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorizedResponse()
  try {
    const body = await req.json()
    const parsed = roomSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues.map(i => i.message).join('; ') },
        { status: 400 }
      )
    }
    const room = await createRoom(parsed.data)
    revalidatePublicPages()
    return NextResponse.json({ ok: true, room })
  } catch (e) {
    console.error('POST /api/admin/rooms error:', e)
    return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorizedResponse()
  try {
    const body = await req.json()
    const id = typeof body?.id === 'string' ? body.id : ''
    if (!id) {
      return NextResponse.json({ ok: false, error: 'Липсва id на стаята' }, { status: 400 })
    }
    const parsed = roomSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues.map(i => i.message).join('; ') },
        { status: 400 }
      )
    }
    const room = await updateRoom(id, parsed.data)
    if (!room) {
      return NextResponse.json({ ok: false, error: 'Стаята не е намерена' }, { status: 404 })
    }
    revalidatePublicPages()
    return NextResponse.json({ ok: true, room })
  } catch (e) {
    console.error('PUT /api/admin/rooms error:', e)
    return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorizedResponse()
  try {
    const id = req.nextUrl.searchParams.get('id') || ''
    if (!id) {
      return NextResponse.json({ ok: false, error: 'Липсва id на стаята' }, { status: 400 })
    }
    const deleted = await deleteRoom(id)
    if (!deleted) {
      return NextResponse.json({ ok: false, error: 'Стаята не е намерена' }, { status: 404 })
    }
    revalidatePublicPages()
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('DELETE /api/admin/rooms error:', e)
    return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 })
  }
}
