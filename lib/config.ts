import type { Fuel, HotelRoom, Service, Contacts, CompanyInfo } from "./types"

/* =========================
   Основна информация за фирмата
   ========================= */
export const companyInfo: CompanyInfo = {
  name: "BG OIL ВРАЦА",
  slogan: "Качеството над всичко",
  description:
    "Модерна бензиностанция с 24/7 магазин, хотел, автосервиз и пълен спектър от услуги във Враца.",
}

/* =========================
   Валутни настройки и отстъпка
   ========================= */
export const BGN_PER_EUR = 1.95583          // фиксиран курс
export const DISCOUNT_BGN = 0.10            // 0.10 лв/л отстъпка
const toEUR = (bgn: number) => bgn / BGN_PER_EUR
const fx2 = (n: number) => n.toFixed(2)

/* =========================
   Горива (тип Fuel) + отстъпка 0.10 лв/л
   ========================= */
export const fuels: Fuel[] = [
  { name: "Дизел",      price: 2.45, memberPrice: 2.45 - DISCOUNT_BGN, unit: "лв/л" },
  { name: "Бензин А95", price: 2.55, memberPrice: 2.55 - DISCOUNT_BGN, unit: "лв/л" },
  { name: "Бензин А98", price: 2.65, memberPrice: 2.65 - DISCOUNT_BGN, unit: "лв/л" },
  { name: "AdBlue",     price: 1.80, memberPrice: 1.80 - DISCOUNT_BGN, unit: "лв/л" },
]

/* UI-помощна версия за горива: лв + €, текстове за директен рендер */
export type FuelDisplay = {
  name: string
  priceText: string           // напр. "2.45 лв / 1.25 €"
  memberPriceText: string     // напр. "2.35 лв / 1.20 €"
  savingsText: string         // напр. "спестяване 0.10 лв/л / 0.05 €/л"
  unitBGN: string
  unitEUR: string
}

export const fuelsDisplay: FuelDisplay[] = fuels.map(f => {
  const priceEUR = toEUR(f.price)
  const memberEUR = toEUR(f.memberPrice)
  const savingsEUR = toEUR(DISCOUNT_BGN)

  return {
    name: f.name,
    priceText:        `${fx2(f.price)} лв / ${fx2(priceEUR)} €`,
    memberPriceText:  `${fx2(f.memberPrice)} лв / ${fx2(memberEUR)} €`,
    savingsText:      `спестяване ${fx2(DISCOUNT_BGN)} лв/л / ${fx2(savingsEUR)} €/л`,
    unitBGN: "лв/л",
    unitEUR: "€/л",
  }
})

/* =========================
   Хотел – базови данни (тип HotelRoom)
   ========================= */
export const hotelRooms: HotelRoom[] = [
  { type: "Единична стая", price: 40 },
  { type: "Двойна стая", price: 50 },
  { type: "Апартамент", price: 70 },
  { type: "Луксозен апартамент", price: 90 },
]

/* UI-помощна версия за хотел: лв + €, текстове за директен рендер */
export type HotelRoomDisplay = {
  type: string
  priceText: string           // напр. "40.00 лв / 20.45 €"
  unitBGN: string
  unitEUR: string
}

export const hotelRoomsDisplay: HotelRoomDisplay[] = hotelRooms.map(r => {
  const priceEUR = toEUR(r.price)
  return {
    type: r.type,
    priceText: `${fx2(r.price)} лв / ${fx2(priceEUR)} €`,
    unitBGN: "лв/нощ",
    unitEUR: "€/нощ",
  }
})

/* =========================
   Услуги
   ========================= */
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

/* =========================
   Контакти
   ========================= */
export const contacts: Contacts = {
  address: "гр. Враца 3000, бул. Мито Орозов 34",
  phoneMain: "+359 878 618 640",
  hotelPhone: "0889 15 55 12",
  email: "bgoil_vraca@abv.bg",
  mapsLink: "https://maps.google.com/?q=43.203,23.548",
  workingHours: "Работно време: 24/7",
}
