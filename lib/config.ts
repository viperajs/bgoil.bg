import type { Fuel, HotelRoom, Service, Contacts, CompanyInfo } from '@/lib/types'

export const BGN_PER_EUR = 1.95583
export const DISCOUNT_BGN = 0.10

export const fuels: Fuel[] = [
  { name: 'Бензин А95', price: 2.29, memberPrice: 2.29 - DISCOUNT_BGN, unit: 'лв/л' },
  { name: 'Дизел',      price: 2.29, memberPrice: 2.29 - DISCOUNT_BGN, unit: 'лв/л' },
  { name: 'Г П Б',      price: 1.05, memberPrice: 1.05 - DISCOUNT_BGN, unit: 'лв/л' },
  { name: 'AdBlue',     price: 1.19, memberPrice: 1.19 - DISCOUNT_BGN, unit: 'лв/л' },
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
  servicePhone: '+359 87 714 1742',
  email: 'bgoil_3000@abv.bg',
  serviceEmail: 'autoservice_1313@abv.bg',
  mapsLink: 'https://maps.app.goo.gl/8KYkuhrDv4fAZLbn8',
  workingHours: 'Работно време: 24/7',
}
