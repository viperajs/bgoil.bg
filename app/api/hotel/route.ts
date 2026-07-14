// app/api/hotel/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireAdmin, unauthorizedResponse } from '@/lib/auth'
import { getAvailableRooms } from '@/lib/roomsStore'
import { getHotelInfo, setHotelInfo } from '@/lib/hotelStore'
import type { HotelInfo } from '@/lib/types'

// Публично: налични стаи + информация за настаняване
export async function GET() {
  try {
    const [rooms, info] = await Promise.all([getAvailableRooms(), getHotelInfo()])
    return NextResponse.json({ rooms, info })
  } catch (e) {
    console.error('GET /api/hotel error:', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

// Админ: запис на часове за настаняване/напускане
export async function POST(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorizedResponse()
  try {
    const body = await req.json()
    const info = body?.info as HotelInfo | undefined

    const timePattern = /^([01]?\d|2[0-3]):[0-5]\d$/
    if (
      !info ||
      typeof info.checkIn !== 'string' ||
      typeof info.checkOut !== 'string' ||
      !timePattern.test(info.checkIn.trim()) ||
      !timePattern.test(info.checkOut.trim())
    ) {
      return NextResponse.json(
        { ok: false, error: 'Часовете трябва да са във формат ЧЧ:ММ' },
        { status: 400 }
      )
    }

    await setHotelInfo({ checkIn: info.checkIn.trim(), checkOut: info.checkOut.trim() })
    revalidatePath('/hotel')
    revalidatePath('/booking')
    return NextResponse.json({ ok: true, info })
  } catch (e) {
    console.error('POST /api/hotel error:', e)
    return NextResponse.json({ ok: false, error: 'Bad JSON' }, { status: 400 })
  }
}
