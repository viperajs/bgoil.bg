import type { Fuel, Service, Contacts, CompanyInfo } from '@/lib/types'

export const BGN_PER_EUR = 1.95583
export const DISCOUNT_BGN = 0.10

// Попълни цените на горивата според твоите предпочитания

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
  description: 'Модерна бензиностанция с 24/7 магазин, автосервиз и пълен спектър от услуги във Враца.',
}

export const services: Service[] = [
  { name: '24/7 Магазин',  description: 'Непрекъснато работещ магазин с всичко необходимо.', icon: '🏪' },
  { name: 'EASYPAY 24/7',  description: 'Удобно плащане 24/7 с различни методи за плащане. Безплатен и охраняван паркинг за клиенти.', icon: '💳' },
  { name: 'Хотел',         description: 'Комфортни стаи с климатизация и черни аут завеси. Подходящи за професионални шофьори и семейства.', icon: '🛏️' },
]

export const contacts: Contacts = {
  address: 'гр. Враца 3000, бул. Мито Орозов 34',
  phoneMain: '+359 878 618 640',
  phoneOwner2: '+359 89 2995584',
  hotelReservation: '087 8618625',
  servicePhone: '+359 87 714 1742',
  email: 'bgoil_3000@abv.bg',
  serviceEmail: 'autoservice_1313@abv.bg',
  mapsLink: 'https://maps.app.goo.gl/8KYkuhrDv4fAZLbn8',
  workingHours: 'Работно време: 24/7',
}
