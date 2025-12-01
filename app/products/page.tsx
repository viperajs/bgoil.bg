// app/products/page.tsx
export const revalidate = 0; // без кеширане на страницата (или export const dynamic = 'force-dynamic')

export const metadata = {
  title: "Продукти",
  description:
    "Актуални цени на горива в BG OIL - дизел, бензин А95, А98 и AdBlue с отстъпки за картови клиенти.",
}

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import FuelCard from "@/components/FuelCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Fuel as FuelIcon, CreditCard, Info } from "lucide-react"

// 🔑 вече четем динамичните цени
import { getEffectiveFuels } from "@/lib/fuelStore"

const CARD_STEPS = [
  "Посетете нашата бензиностанция",
  "Попълнете заявление за карта",
  "Получете картата си веднага",
]

const EXTRA_BENEFITS = [
  "Отстъпки при всяко зареждане",
  "Специални промоции за членове",
  "Бонус точки за лоялност",
]

export default async function ProductsPage() {
  const fuels = await getEffectiveFuels() // актуални цени от store

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
                  <FuelIcon className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
                Продукти и цени
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground text-pretty">
                Качествени горива на конкурентни цени с допълнителни отстъпки за картови клиенти
              </p>
            </div>
          </div>
        </section>

        {/* Fuel Prices Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
              {fuels.map((fuel, index) => (
                <FuelCard key={index} fuel={fuel} />
              ))}
            </div>

            {/* Member Benefits Card */}
            <Card className="mb-10 rounded-3xl border border-white/10 bg-[#120814]/95 px-8 py-10 text-white shadow-[0_25px_60px_rgba(0,0,0,0.45)]">
              <CardHeader className="pb-0">
                <div className="flex flex-col gap-2">
                  <div className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
                    <CreditCard className="h-4 w-4 text-primary" />
                    BG OIL CARD
                  </div>
                  <CardTitle className="text-3xl font-bold text-white">
                    Предимства на картата BG OIL
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="grid gap-10 pt-8 md:grid-cols-2">
                <div className="space-y-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/50">
                    Как да получите карта
                  </p>
                  <ol className="space-y-4">
                    {CARD_STEPS.map((step, index) => (
                      <li key={step} className="flex items-center gap-4">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-lg font-bold text-white">
                          {index + 1}
                        </span>
                        <p className="text-base font-medium text-white/90">{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="space-y-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/50">
                    Допълнителни предимства
                  </p>
                  <ul className="space-y-4">
                    {EXTRA_BENEFITS.map(benefit => (
                      <li
                        key={benefit}
                        className="flex items-center gap-4 rounded-full bg-gradient-to-r from-[#ff3b3b] via-[#ff5a3a] to-[#ff8c3c] px-6 py-4 text-white shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
                      >
                        <span className="h-3 w-3 rounded-full bg-white/85 shadow-md shadow-white/40"></span>
                        <span className="text-base font-semibold">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Additional Services */}
            <Card>
              <CardHeader>
                <CardTitle>Допълнителни услуги</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-2xl">🚿</span>
                    </div>
                    <h3 className="font-semibold">Автомивка</h3>
                    <p className="text-sm text-muted-foreground">
                      Професионално почистване на автомобили
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-2xl">🔧</span>
                    </div>
                    <h3 className="font-semibold">Автосервиз</h3>
                    <p className="text-sm text-muted-foreground">
                      Техническо обслужване и ремонти
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-2xl">🏪</span>
                    </div>
                    <h3 className="font-semibold">24/7 Магазин</h3>
                    <p className="text-sm text-muted-foreground">
                      Непрекъснато работещ магазин
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Disclaimer */}
            <div className="mt-10 rounded-2xl border border-[#ff5b5b]/40 bg-gradient-to-r from-[#1c0b11] via-[#0c0c18] to-[#080a12] p-6 text-white shadow-[0_20px_45px_rgba(0,0,0,0.45)]">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
                <div className="flex items-center gap-3 text-[#ffb3b3]">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ff4d4d]/15 text-[#ffb3b3]">
                    <Info className="h-6 w-6" />
                  </span>
                  <p className="text-base font-bold uppercase tracking-[0.2em] text-[#ff8f72]">
                    Важна информация за цените
                  </p>
                </div>
                <p className="text-base text-[#ffe0e0] md:flex-1">
                  Цените са ориентировъчни и подлежат на промяна. За потвърждение
                  на актуалните стойности, моля, обърнете се към персонала на място.
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
