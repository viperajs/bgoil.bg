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
  phoneOwner2: string
  hotelReservation: string
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

// Пълен модел на стая за CRUD управление от админ панела
export interface HotelRoomFull {
  id: string
  name: string
  type: string
  price: number // € на нощувка
  capacity: number
  size?: string
  bedType?: string
  description: string
  amenities: string[]
  images: string[]
  available: boolean
  sortOrder?: number
}

export interface Booking {
  id: string
  fullName: string
  phone: string
  roomId: string
  roomType: string
  checkIn: string
  checkOut: string
  nights: number
  callRequested: boolean
  preferredTime?: string
  totalPrice: number
  status: 'new' | 'confirmed'
  createdAt: string
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
