import type { Fuel, HotelRoom, Service, Contacts, CompanyInfo } from "./types"

export const companyInfo: CompanyInfo = {
  name: "BG OIL ВРАЦА",
  slogan: "Качеството над всичко",
  description: "Модерна бензиностанция с 24/7 магазин, хотел, автосервиз и пълен спектър от услуги във Враца.",
}

export const fuels: Fuel[] = [
  { name: "Дизел", price: 2.45, memberPrice: 2.4, unit: "лв/л" },
  { name: "Бензин А95", price: 2.55, memberPrice: 2.5, unit: "лв/л" },
  { name: "Бензин А98", price: 2.65, memberPrice: 2.6, unit: "лв/л" },
  { name: "AdBlue", price: 1.8, memberPrice: 1.75, unit: "лв/л" },
]

export const hotelRooms: HotelRoom[] = [
  { type: "Единична стая", price: 40 },
  { type: "Двойна стая", price: 50 },
  { type: "Апартамент", price: 70 },
  { type: "Луксозен апартамент", price: 90 },
]

export const services: Service[] = [
  { name: "24/7 Магазин", description: "Непрекъснато работещ магазин с всичко необходимо", icon: "🏪" },
  { name: "Паркинг", description: "Безплатен и охраняван паркинг за клиенти", icon: "🚗" },
  { name: "Хотел", description: "Комфортни стаи и апартаменти за нощувка", icon: "🏨" },
  { name: "Бързо хранене", description: "Свежи сандвичи, кафе и закуски", icon: "🍔" },
  { name: "Автосервиз", description: "Професионални услуги за вашия автомобил", icon: "🔧" },
  { name: "Автомивка", description: "Качествено почистване на автомобили", icon: "🚿" },
  { name: "EasyPay", description: "Плащане на сметки и услуги", icon: "💳" },
  { name: "MoneyGram", description: "Международни парични преводи", icon: "💰" },
  { name: "Застраховки", description: "Автомобилни и други видове застраховки", icon: "🛡️" },
]

export const contacts: Contacts = {
  address: "гр. Враца 3000, бул. Мито Орозов 34",
  phoneMain: "+359 878 618 640",
  hotelPhone: "0889 15 55 12",
  email: "bgoil_vraca@abv.bg",
  mapsLink: "https://maps.google.com/?q=43.203,23.548",
  workingHours: "Работно време: 24/7",
}
