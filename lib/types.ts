export interface Fuel {
  name: string
  price: number
  memberPrice: number
  unit: string
  discount?: number
}

export interface Service {
  name: string
  description: string
  icon: string
}


export interface Contacts {
  address: string
  phoneMain: string
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

export interface HotelRoom {
  name: string
  price: number
  unit: string
}

export interface HotelInfo {
  checkIn: string
  checkOut: string
}

export interface Reservation {
  id: string
  name: string
  email: string
  phone: string
  roomType: string
  checkInDate: string
  checkOutDate: string
  guests: number
  specialRequests?: string
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
  totalPrice: number
}
