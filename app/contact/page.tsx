export const metadata = {
  title: "Контакти",
  description:
    "Свържете се с BG OIL ВРАЦА - адрес, телефони, имейл и работно време. Намерете ни на бул. Мито Орозов 34.",
}

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ContactBlock from "@/components/ContactBlock"
import { contacts } from "@/lib/config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Clock, Navigation } from "lucide-react"

export default function ContactPage() {
  const workingHours = [
    { service: "Бензиностанция", hours: "Работно време: 24/7" },
    { service: "Магазин", hours: "Работно време: 24/7" },
    { service: "EasyPay каса", hours: "Работно време: 24/7" },
    { service: "Хотел рецепция", hours: "Работно време: 24/7" },
    { service: "Автосервиз", hours: "Пон-Пет: 08:00-18:00, Съб: 08:00-14:00" },
    { service: "Автомивка", hours: "Работно време: 24/7" },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 to-accent/5 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <div className="p-3 bg-primary/10 rounded-full">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Контакти</h1>
              <p className="text-lg md:text-xl text-muted-foreground text-pretty">
                Свържете се с нас или ни посетете във Враца
              </p>
            </div>
          </div>
        </section>

        {/* Quick Contact */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Обадете се</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">Основен телефон:</p>
                  <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
                    <a href={`tel:${contacts.phoneMain}`}>{contacts.phoneMain}</a>
                  </Button>
                  <p className="text-sm text-muted-foreground">Хотел резервации:</p>
                  <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
                    <a href={`tel:${contacts.hotelPhone}`}>{contacts.hotelPhone}</a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Изпратете имейл</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">Имейл адрес:</p>
                  <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
                    <a href={`mailto:${contacts.email}`}>{contacts.email}</a>
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">Отговаряме в рамките на 24 часа</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Navigation className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Намерете ни</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">Адрес:</p>
                  <p className="text-sm font-medium">{contacts.address}</p>
                  <Button size="sm" asChild className="w-full">
                    <a href={contacts.mapsLink} target="_blank" rel="noopener noreferrer">
                      Навигация
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Working Hours */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Работно време</h2>
                <p className="text-lg text-muted-foreground text-pretty">
                  Различните ни услуги са достъпни в следните часове
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-6 h-6 text-primary" />
                    <span>График на работа</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {workingHours.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2 border-b border-border/50 last:border-b-0"
                      >
                        <span className="font-medium text-card-foreground">{item.service}</span>
                        <span className="text-sm text-muted-foreground">{item.hours}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                    <p className="text-sm text-primary font-medium text-center">
                      🕐 Основните услуги  работят 24/7 за вашето удобство
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Details and Map */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Подробна информация</h2>
              <p className="text-lg text-muted-foreground text-pretty">
                Всичко необходимо за да ни намерите и се свържете с нас
              </p>
            </div>

            <ContactBlock />
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
