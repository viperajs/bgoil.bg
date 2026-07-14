// app/api/admin/rooms/seed/route.ts — възстановява стандартните 4 стаи.
// Извиква се само ръчно от бутона в админ панела при празен списък.
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireAdmin, unauthorizedResponse } from '@/lib/auth'
import { restoreDefaultRooms } from '@/lib/roomsStore'

export async function POST(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorizedResponse()
  try {
    const rooms = await restoreDefaultRooms()
    revalidatePath('/hotel')
    revalidatePath('/')
    return NextResponse.json({ ok: true, rooms })
  } catch (e) {
    console.error('POST /api/admin/rooms/seed error:', e)
    return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 })
  }
}
