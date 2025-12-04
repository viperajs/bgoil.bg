export interface Fuel {
  name: string
  price: number
  memberPrice: number
  unit: string
  discount?: number
}

export interface HotelRoom {
  type: string
  price: number
}

export interface Service {
  name: string
  description: string
  icon: string
}


export interface Contacts {
  address: string
  phoneMain: string
  hotelPhone: string
  servicePhone: string
  email: string
  serviceEmail: string
  mapsLink: string
  workingHours: string
}

export interface CompanyInfo {
  name: string
  slogan: string
  description: string
}
