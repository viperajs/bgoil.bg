import { generateHotelSchema } from "@/lib/schema"

export const metadata = {
  title: "Хотел",
  description: "Комфортни стаи и апартаменти в хотела на BG OIL ВРАЦА. Резервации на телефон 0889 15 55 12.",
}

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import HotelTable from "@/components/HotelTable"
import { hotelRooms, contacts } from "@/lib/config"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Hotel, Phone, Wifi, Car, Coffee, Tv, AirVent, Shield } from "lucide-react"
import Image from "next/image"

export default function HotelPage() {
  const hotelSchema = generateHotelSchema()

  const amenities = [
    { icon: Wifi, name: "Безплатен WiFi", description: "Високоскоростен интернет във всички стаи" },
    { icon: Car, name: "Безплатен паркинг", description: "Охраняем паркинг за гостите на хотела" },
    { icon: Coffee, name: "24/7 Рецепция", description: "Непрекъсната рецепция и обслужване" },
    { icon: Tv, name: "Кабелна телевизия", description: "Широк избор от канали във всички стаи" },
    { icon: AirVent, name: "Климатик", description: "Индивидуален климатик във всяка стая" },
    { icon: Shield, name: "Сигурност", description: "24/7 охрана и видеонаблюдение" },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(hotelSchema),
        }}
      />
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 to-accent/5 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Hotel className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Хотел BG OIL</h1>
              <p className="text-lg md:text-xl text-muted-foreground text-pretty mb-8">
                Комфортни стаи и апартаменти с всички удобства за вашия престой във Враца
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <a href={`tel:${contacts.hotelPhone}`} className="flex items-center space-x-2">
                    <Phone className="w-5 h-5" />
                    <span>Резервирай сега</span>
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href={`tel:${contacts.phoneMain}`} className="flex items-center space-x-2">
                    <Phone className="w-5 h-5" />
                    <span>Информация</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Hotel Images */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image src="/modern-hotel-room-with-comfortable-bed.jpg" alt="Хотелска стая" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/20" />
                <Badge className="absolute top-4 left-4 bg-primary">Единична стая</Badge>
              </div>
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image src="/hotel-double-room-with-two-beds.jpg" alt="Двойна стая" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/20" />
                <Badge className="absolute top-4 left-4 bg-primary">Двойна стая</Badge>
              </div>
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image src="/luxury-hotel-apartment-suite.jpg" alt="Апартамент" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/20" />
                <Badge className="absolute top-4 left-4 bg-accent">Луксозен апартамент</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Room Prices */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Цени и резервации</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Изберете най-подходящата стая за вашия престой
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <HotelTable rooms={hotelRooms} />
            </div>
          </div>
        </section>

        {/* Amenities */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Удобства и услуги</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Всичко необходимо за комфортен престой
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {amenities.map((amenity, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="text-center pb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <amenity.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{amenity.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground text-center text-pretty">{amenity.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Location Benefits */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-center text-2xl">Защо да изберете нашия хотел?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg text-card-foreground">Удобно местоположение</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start space-x-2">
                          <span className="text-primary">•</span>
                          <span>В центъра на Враца с лесен достъп до всички забележителности</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-primary">•</span>
                          <span>Директно до бензиностанцията - удобно за пътуващи</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-primary">•</span>
                          <span>Близо до магазини, ресторанти и обществен транспорт</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg text-card-foreground">Допълнителни услуги</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start space-x-2">
                          <span className="text-primary">•</span>
                          <span>24/7 магазин за всичко необходимо</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-primary">•</span>
                          <span>Автомивка и автосервиз на място</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-primary">•</span>
                          <span>Бързо хранене и кафе</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact for Reservations */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl font-bold text-foreground">Готови за резервация?</h2>
              <p className="text-lg text-muted-foreground text-pretty">
                Обадете се сега за да резервирате вашата стая или за повече информация
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <a href={`tel:${contacts.hotelPhone}`} className="flex items-center space-x-2">
                    <Phone className="w-5 h-5" />
                    <span>{contacts.hotelPhone}</span>
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href={`mailto:${contacts.email}`} className="flex items-center space-x-2">
                    <span>Изпратете имейл</span>
                  </a>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">Работим 24/7 за вашето удобство</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
