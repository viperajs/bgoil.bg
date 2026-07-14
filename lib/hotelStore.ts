// lib/hotelStore.ts — часове за настаняване/напускане.
// Стаите се управляват от lib/roomsStore.ts.
import 'server-only'
import { createJsonKvStore } from '@/lib/jsonKvStore'
import type { HotelInfo } from '@/lib/types'

const defaultInfo: HotelInfo = {
  checkIn: '12:00',
  checkOut: '11:00',
}

const store = createJsonKvStore<HotelInfo>({
  key: 'hotel:info:v1',
  filename: 'hotel-info.json',
  label: 'hotelStore',
})

export async function getHotelInfo(): Promise<HotelInfo> {
  return (await store.read()) ?? defaultInfo
}

export async function setHotelInfo(info: HotelInfo): Promise<void> {
  await store.write(info)
}
