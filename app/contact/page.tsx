import type { Metadata } from "next"
import { companyInfo, contacts } from "@/lib/config"

export const metadata: Metadata = {
  title: "Контакти",
  description:
    `Свържете се с ${companyInfo.name} - адрес: ${contacts.address}, телефони: ${contacts.phoneMain} (основен), ${contacts.servicePhone} (автосервиз). Работно време: 24/7.`,
  keywords: [
    "BG OIL ВРАЦА контакти",
    "BG OIL контакти",
    "бензиностанция Враца адрес",
    "BG OIL телефон",
    "BG OIL адрес",
    "BG OIL Враца телефон",
    "бензиностанция Враца телефон",
    "автосервиз Враца телефон",
    "бул. Мито Орозов 34",
    "BG OIL имейл",
    "работи 24/7 Враца",
    "BG OIL местоположение",
    "бензиностанция Враца адрес",
    "как да стигна до BG OIL",
    "BG OIL GPS координати",
    "бензиностанция близо до центъра",
    "контакти бензиностанция Враца",
  ],
  openGraph: {
    title: `Контакти - ${companyInfo.name}`,
    description: `Свържете се с ${companyInfo.name}. Адрес: ${contacts.address}. Телефон: ${contacts.phoneMain}. Работно време: 24/7.`,
    url: "https://bgoil.bg/contact",
    type: "website",
    images: [
      {
        url: "https://bgoil.bg/background.png",
        width: 1200,
        height: 630,
        alt: `${companyInfo.name} - Контакти и местоположение`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Контакти - ${companyInfo.name}`,
    description: `Адрес: ${contacts.address}. Телефон: ${contacts.phoneMain}. Работно време: 24/7.`,
    images: ["https://bgoil.bg/background.png"],
  },
  alternates: {
    canonical: "https://bgoil.bg/contact",
  },
}

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ContactBlock from "@/components/ContactBlock"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Clock, Navigation } from "lucide-react"

export default function ContactPage() {
  const workingHours = [
    { service: "Бензиностанция", hours: "24/7" },
    { service: "Магазин", hours: "24/7" },
    { service: "EasyPay каса", hours: "24/7" },
    { service: "Автосервиз", hours: "Пон-Пет: 08:00-18:00, Съб: 08:00-14:00" },
    { service: "Автомивка", hours: "24/7" },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section - Compact */}
        <section className="bg-gradient-to-br from-primary/10 to-accent/5 pt-24 md:pt-28 pb-12">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                <div className="p-2.5 bg-primary/10 rounded-full">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance">Контакти</h1>
              <p className="text-base md:text-lg text-muted-foreground text-pretty">
                Свържете се с нас или ни посетете във Враца
              </p>
            </div>
          </div>
        </section>

        {/* Main Contact Section - Compact Grid */}
        <section className="py-10 md:py-12 -mt-6">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                {/* Quick Contact Cards - Compact */}
                <Card className="hover:shadow-lg transition-all duration-300 hover-lift border-2 border-border hover:border-primary/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle className="text-base font-semibold">Телефон</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <a 
                      href={`tel:${contacts.phoneMain}`}
                      className="text-lg font-bold text-primary hover:underline transition-colors block"
                    >
                      {contacts.phoneMain}
                    </a>
                    <p className="text-xs text-muted-foreground mt-1">Автосервиз: {contacts.servicePhone}</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 hover-lift border-2 border-border hover:border-primary/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle className="text-base font-semibold">Имейл</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <a 
                      href={`mailto:${contacts.email}`}
                      className="text-sm font-medium text-primary hover:underline transition-colors block break-all"
                    >
                      {contacts.email}
                    </a>
                    <p className="text-xs text-muted-foreground mt-1">Отговаряме в рамките на 24 часа</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 hover-lift border-2 border-border hover:border-primary/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle className="text-base font-semibold">Адрес</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm font-medium mb-2">{contacts.address}</p>
                    <Button size="sm" asChild className="w-full">
                      <a href={contacts.mapsLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                        <Navigation className="w-4 h-4" />
                        Навигация
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Working Hours - Compact */}
              <Card className="border-2 border-border hover:border-primary/50 transition-all duration-300 mb-8">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="w-5 h-5 text-primary" />
                    <span>Работно време</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {workingHours.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2 px-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <span className="text-sm font-medium text-card-foreground">{item.service}</span>
                        <span className="text-xs text-muted-foreground font-medium">{item.hours}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <p className="flex items-center justify-center gap-2 text-sm text-primary font-semibold text-center">
                      <span className="text-lg">🕐</span>
                      <span>Основните услуги работят 24/7</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Details and Map */}
              <ContactBlock />
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
