export const metadata = {
  title: "Продукти",
  description:
    "Актуални цени на горива в BG OIL ВРАЦА - дизел, бензин А95, А98 и AdBlue с отстъпки за картови клиенти.",
}

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import FuelCard from "@/components/FuelCard"
import { fuels } from "@/lib/config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Fuel, CreditCard, Info } from "lucide-react"

export default function ProductsPage() {
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
                  <Fuel className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Продукти и цени</h1>
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
            <Card className="bg-primary/5 border-primary/20 mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-6 h-6 text-primary" />
                  <span>Предимства на картата BG OIL</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-card-foreground">Как да получите карта:</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start space-x-2">
                        <Badge variant="outline" className="mt-0.5 text-xs">
                          1
                        </Badge>
                        <span>Посетете нашата бензиностанция</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Badge variant="outline" className="mt-0.5 text-xs">
                          2
                        </Badge>
                        <span>Попълнете заявление за карта</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Badge variant="outline" className="mt-0.5 text-xs">
                          3
                        </Badge>
                        <span>Получете картата си веднага</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-card-foreground">Допълнителни предимства:</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start space-x-2">
                        <span className="text-accent-foreground">•</span>
                        <span>Отстъпки при всяко зареждане</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-accent-foreground">•</span>
                        <span>Специални промоции за членове</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-accent-foreground">•</span>
                        <span>Бонус точки за лоялност</span>
                      </li>
                    </ul>
                  </div>
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
                    <p className="text-sm text-muted-foreground">Професионално почистване на автомобили</p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-2xl">🔧</span>
                    </div>
                    <h3 className="font-semibold">Автосервиз</h3>
                    <p className="text-sm text-muted-foreground">Техническо обслужване и ремонти</p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-2xl">🏪</span>
                    </div>
                    <h3 className="font-semibold">24/7 Магазин</h3>
                    <p className="text-sm text-muted-foreground">Непрекъснато работещ магазин</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Disclaimer */}
            <div className="mt-8 p-4 bg-black border border-gray-800 rounded-lg">
  <div className="flex items-start space-x-3">
    <Info className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
    <div className="space-y-1">
      <p className="text-sm font-medium text-white">Важна информация за цените</p>
      <p className="text-sm text-gray-300">
        Цените са ориентировъчни и могат да се променят без предварително уведомление. 
        Моля, потвърдете актуалните цени на място при персонала на бензиностанцията.
      </p>
    </div>
  </div>
</div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
