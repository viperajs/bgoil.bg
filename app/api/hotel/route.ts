// app/api/hotel/route.ts
import { NextResponse } from 'next/server'
import type { HotelRoom, HotelInfo } from '@/lib/types'

export async function GET() {
  try {
    const mod = (await import('@/lib/hotelStore')) as typeof import('@/lib/hotelStore')
    const rooms = await mod.getEffectiveRooms()
    const info = await mod.getHotelInfo()
    return NextResponse.json({ rooms, info })
  } catch (e) {
    console.error('GET /api/hotel error:', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

type HotelUpdate = {
  name: string
  price: number
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const raw = Array.isArray(body?.items) ? body.items : []
    const info = body?.info as HotelInfo | undefined

    const items: HotelUpdate[] = raw
      .map((x: any) => ({
        name: String(x?.name ?? '').trim(),
        price: Number(x?.price),
      }))
      .filter((x: HotelUpdate) => {
        const priceValid = Number.isFinite(x.price) && x.price >= 0
        return x.name.length > 0 && priceValid
      })

    const mod = (await import('@/lib/hotelStore')) as typeof import('@/lib/hotelStore')

    if (items.length > 0) {
      await mod.setHotelPrices(items)
    }

    if (info && typeof info.checkIn === 'string' && typeof info.checkOut === 'string') {
      await mod.setHotelInfo(info)
    }

    const before = await mod.getEffectiveRooms()
    const after = await mod.getEffectiveRooms()

    const changed = items.filter((it: HotelUpdate) => {
      const beforeRoom = before.find(r => r.name === it.name)
      const afterRoom = after.find(r => r.name === it.name)
      if (!beforeRoom || !afterRoom) return false
      return beforeRoom.price !== afterRoom.price
    })

    const wrote = changed.length > 0 || !!info
    return NextResponse.json({ ok: wrote, saved: items, changed, info })
  } catch {
    return NextResponse.json({ ok: false, error: 'Bad JSON' }, { status: 400 })
  }
}

