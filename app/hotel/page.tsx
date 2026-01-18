// app/hotel/page.tsx
import type { Metadata } from "next"
import { companyInfo } from "@/lib/config"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Hotel as HotelIcon, Clock, Bed, Users, Home, Info, Phone, MapPin, Mail, Calendar } from "lucide-react"
import { getEffectiveRooms, getHotelInfo } from "@/lib/hotelStore"
import { contacts } from "@/lib/config"

export const revalidate = 0

export const metadata: Metadata = {
  title: "Хотел",
  description:
    "Комфортни стаи за настаняване в BG OIL - единични, двойни, тройни стаи и апартаменти. Идеално за професионални шофьори и семейства. Настаняване от 12:00, напускане до 11:00.",
  keywords: [
    "хотел Враца",
    "настаняване Враца",
    "стаи Враца",
    "BG OIL хотел",
    "комфортни стаи Враца",
    "апартаменти Враца",
  ],
  openGraph: {
    title: `Хотел - ${companyInfo.name}`,
    description: "Комфортни стаи за настаняване с климатизация и черни аут блокиращи завеси. Идеално за професионални шофьори и семейства.",
    url: "https://bgoil.bg/hotel",
    type: "website",
    images: [
      {
        url: "https://bgoil.bg/background.png",
        width: 1200,
        height: 630,
        alt: "BG OIL ВРАЦА - Хотел",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Хотел - ${companyInfo.name}`,
    description: "Комфортни стаи за настаняване с климатизация. Идеално за професионални шофьори и семейства.",
    images: ["https://bgoil.bg/background.png"],
  },
  alternates: {
    canonical: "https://bgoil.bg/hotel",
  },
}

const ROOM_ICONS: Record<string, any> = {
  'Единична стая': Users,
  'Двойна стая': Bed,
  'Тройна стая': Users,
  'Апартамент': Home,
}

export default async function HotelPage() {
  const rooms = await getEffectiveRooms()
  const info = await getHotelInfo()

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 to-accent/5 pt-28 md:pt-32 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <div className="p-3 bg-primary/10 rounded-full">
                  <HotelIcon className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
                Хотел BG OIL
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground text-pretty">
                Комфортни стаи с климатизация и черни аут блокиращи завеси. Идеално за професионални шофьори и семейства.
              </p>
            </div>
          </div>
        </section>

        {/* Rooms Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {rooms.map((room, index) => {
                const Icon = ROOM_ICONS[room.name] || HotelIcon
                return (
                  <Card
                    key={index}
                    className="relative overflow-hidden transition-all duration-300 hover-lift bg-gradient-card shadow-lg hover:shadow-xl hover:shadow-primary/10"
                  >
                    <CardHeader className="text-center pb-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-primary/10">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <CardTitle className="text-xl font-bold text-foreground">
                        {room.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="mb-4">
                        <div className="text-3xl font-black text-primary mb-1">
                          {room.price.toFixed(0)} €
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {room.unit}
                        </div>
                      </div>
                    </CardContent>
                    <div className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-1000 shine opacity-20 pointer-events-none"></div>
                  </Card>
                )
              })}
            </div>

            {/* Check-in/Check-out Info */}
            <Card className="mb-10 rounded-3xl bg-[#120814]/95 px-8 py-10 text-white shadow-[0_25px_60px_rgba(0,0,0,0.45)]">
              <CardHeader className="pb-0">
                <div className="flex flex-col gap-2">
                  <div className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
                    <Clock className="h-4 w-4 text-primary" />
                    Час на настаняване
                  </div>
                  <CardTitle className="text-3xl font-bold text-white">
                    Информация за настаняване
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="grid gap-6 pt-8 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/10">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">
                        Настаняване
                      </p>
                      <p className="text-2xl font-bold text-white">
                        от {info.checkIn}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/10">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">
                        Напускане
                      </p>
                      <p className="text-2xl font-bold text-white">
                        до {info.checkOut}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Удобства</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-2xl">❄️</span>
                    </div>
                    <h3 className="font-semibold">Климатизация</h3>
                    <p className="text-sm text-muted-foreground">
                      Пълна климатизация във всички стаи
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-2xl">🌙</span>
                    </div>
                    <h3 className="font-semibold">Черни аут завеси</h3>
                    <p className="text-sm text-muted-foreground">
                      Блокиращи светлина за спокоен сън
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-2xl">🚗</span>
                    </div>
                    <h3 className="font-semibold">Паркинг</h3>
                    <p className="text-sm text-muted-foreground">
                      Безплатен паркинг за гости
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reservation Section */}
            <Card className="mb-10 rounded-2xl bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 px-6 py-6 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold uppercase tracking-wide text-primary">Резервация</span>
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  Как да резервирате стая?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr]">
                  {/* Contact Methods */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-foreground">Свържете се с нас</h3>
                    
                    <div className="space-y-3">
                      {/* Phone */}
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-white/60 hover:bg-white/80 transition-all shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Phone className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <a 
                            href={`tel:${contacts.phoneMain}`}
                            className="text-lg font-bold text-foreground hover:text-primary transition-colors block"
                          >
                            {contacts.phoneMain}
                          </a>
                        </div>
                        <Button 
                          asChild
                          size="sm"
                          className="bg-gradient-primary hover:opacity-90 text-white px-4 py-2 flex-shrink-0"
                        >
                          <a href={`tel:${contacts.phoneMain}`}>Обади се</a>
                        </Button>
                      </div>

                      {/* Email */}
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-white/60 hover:bg-white/80 transition-all shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <a 
                            href={`mailto:${contacts.email}?subject=Резервация на стая`}
                            className="text-base font-bold text-foreground hover:text-primary transition-colors break-all block"
                          >
                            {contacts.email}
                          </a>
                        </div>
                        <Button 
                          asChild
                          size="sm"
                          className="bg-gradient-primary hover:opacity-90 text-white px-4 py-2 flex-shrink-0"
                        >
                          <a href={`mailto:${contacts.email}?subject=Резервация на стая`}>Изпрати</a>
                        </Button>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-white/60 hover:bg-white/80 transition-all shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-bold text-foreground">
                            {contacts.address}
                          </p>
                        </div>
                        <Button 
                          asChild
                          size="sm"
                          className="bg-gradient-primary hover:opacity-90 text-white px-4 py-2 flex-shrink-0"
                        >
                          <a href={contacts.mapsLink} target="_blank" rel="noopener noreferrer">Карта</a>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Reservation Steps */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-foreground">Информация за резервация</h3>
                    
                    <div className="space-y-3">
                      {/* Steps */}
                      <div className="p-4 rounded-xl bg-gradient-primary/10">
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">1</span>
                            <p className="text-sm font-semibold text-foreground pt-0.5">Изберете тип стая</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">2</span>
                            <p className="text-sm font-semibold text-foreground pt-0.5">Свържете се с нас</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">3</span>
                            <p className="text-sm font-semibold text-foreground pt-0.5">Потвърждение</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">4</span>
                            <p className="text-sm font-semibold text-foreground pt-0.5">Настаняване</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Additional Info */}
                      <div className="p-4 rounded-xl bg-gradient-primary/10">
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          <span className="font-semibold text-foreground">Резервации 24/7</span> • Предварителна резервация препоръчителна • Плащане на място • Климатизация и черни аут завеси • Безплатен паркинг
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Disclaimer */}
            <div className="mt-10 rounded-2xl bg-gradient-to-r from-[#1c0b11] via-[#0c0c18] to-[#080a12] p-6 text-white shadow-[0_20px_45px_rgba(0,0,0,0.45)]">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
                <div className="flex items-center gap-3 text-[#ffb3b3]">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ff4d4d]/15 text-[#ffb3b3]">
                    <Info className="h-6 w-6" />
                  </span>
                  <p className="text-base font-bold uppercase tracking-[0.2em] text-[#ff8f72]">
                    Важна информация
                  </p>
                </div>
                <p className="text-base text-[#ffe0e0] md:flex-1">
                  Цените са ориентировъчни и подлежат на промяна. За резервация и потвърждение на актуалните стойности, моля, обърнете се към персонала на място или по телефон <strong>{contacts.phoneMain}</strong>.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

