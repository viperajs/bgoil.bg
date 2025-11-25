import type { Fuel, HotelRoom, Service, Contacts, CompanyInfo } from '@/lib/types'

export const BGN_PER_EUR = 1.95583
export const DISCOUNT_BGN = 0.10

const withDiscount = (name: string, price: number, unit = 'лв/л', discount = DISCOUNT_BGN): Fuel => ({
  name,
  price,
  unit,
  discount,
  memberPrice: Math.max(0, price - discount),
})

export const fuels: Fuel[] = [
  withDiscount('Дизел', 2.29),
  withDiscount('Бензин А95', 2.29),
  withDiscount('Г П Б', 1.05),
  withDiscount('AdBlue', 1.19),
]

// (по желание) останалите секции може да си оставиш както са при теб:
export const companyInfo: CompanyInfo = {
  name: 'BG OIL',
  slogan: 'Качеството над всичко',
  description: 'Модерна бензиностанция с 24/7 магазин, хотел, автосервиз и пълен спектър от услуги във Враца.',
}

export const hotelRooms: HotelRoom[] = [
  { type: 'Единична стая', price: 40 },
  { type: 'Двойна стая',   price: 50 },
  { type: 'Апартамент',    price: 70 },
  { type: 'Луксозен апартамент', price: 90 },
]

export const services: Service[] = [
  { name: '24/7 Магазин',  description: 'Непрекъснато работещ магазин с всичко необходимо', icon: '🏪' },
  { name: 'Паркинг',       description: 'Безплатен и охраняван паркинг за клиенти',         icon: '🚗' },
  { name: 'Хотел',         description: 'Комфортни стаи и апартаменти за нощувка',         icon: '🏨' },
]

export const contacts: Contacts = {
  address: 'гр. Враца 3000, бул. Мито Орозов 34',
  phoneMain: '+359 878 618 640',
  hotelPhone: '0889 15 55 12',
  email: 'bgoil_3000@abv.bg',
  mapsLink: 'https://maps.app.goo.gl/8KYkuhrDv4fAZLbn8',
  workingHours: 'Работно време: 24/7',
}
