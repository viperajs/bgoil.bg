export const metadata = {
  title: "За нас",
  description: "Научете повече за BG OIL ВРАЦА - нашите услуги, история и ангажимент към качеството.",
}

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { services, companyInfo } from "@/lib/config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, Award, Clock, Shield, Heart } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  const values = [
    {
      icon: Award,
      title: "Качество",
      description: "Предлагаме само най-качествени горива и услуги на европейски стандарт",
    },
    {
      icon: Users,
      title: "Клиентоориентираност",
      description: "Нашите клиенти са в центъра на всичко, което правим",
    },
    {
      icon: Clock,
      title: "Надеждност",
      description: "24/7 обслужване и винаги готови да помогнем",
    },
    {
      icon: Shield,
      title: "Сигурност",
      description: "Най-високи стандарти за безопасност и качество",
    },
    {
      icon: Heart,
      title: "Грижа",
      description: "Грижим се за нашите клиенти, общността и околната среда",
    },
    {
      icon: Building2,
      title: "Иновации",
      description: "Постоянно инвестираме в нови технологии и подобрения",
    },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 to-accent/5 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">За нас</h1>
              <p className="text-lg md:text-xl text-muted-foreground text-pretty">
                Научете повече за BG OIL ВРАЦА - нашата история, мисия и ангажимент към качеството
              </p>
            </div>
          </div>
        </section>

        {/* Company Story */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Badge variant="outline" className="w-fit">
                    Нашата история
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">{companyInfo.slogan}</h2>
                  <p className="text-lg text-muted-foreground text-pretty">
                    BG OIL ВРАЦА е модерна бензиностанция, която служи на общността във Враца с най-високо качество на
                    горива и услуги. Нашата мисия е да предоставяме надеждни, качествени продукти и услуги, които
                    отговарят на нуждите на нашите клиенти.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">Нашата мисия</h3>
                  <p className="text-muted-foreground text-pretty">
                    Да бъдем водещата бензиностанция във Враца, предлагайки не само качествени горива, но и цялостно
                    обслужване - от комфортен хотел до професионални автомобилни услуги. Стремим се да създадем място,
                    където клиентите се чувстват добре дошли и получават повече от очакваното.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden">
                  <Image
                    src="/modern-fuel-station-exterior-view.jpg"
                    alt="BG OIL ВРАЦА бензиностанция"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Нашите ценности</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Принципите, които ръководят работата ни всеки ден
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="text-center pb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <value.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground text-center text-pretty">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Our Services */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Нашите услуги</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Пълен спектър от услуги за вашето удобство и комфорт
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="text-center pb-4">
                    <div className="text-4xl mb-3">{service.icon}</div>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground text-center text-pretty">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-center text-2xl md:text-3xl">Защо да изберете BG OIL ВРАЦА?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg text-card-foreground">Качество и надеждност</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start space-x-2">
                          <span className="text-primary">•</span>
                          <span>Сертифицирани горива от водещи производители</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-primary">•</span>
                          <span>Редовни проверки за качество и безопасност</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-primary">•</span>
                          <span>Модерно оборудване и технологии</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-primary">•</span>
                          <span>Професионален и обучен персонал</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg text-card-foreground">Удобство и комфорт</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start space-x-2">
                          <span className="text-primary">•</span>
                          <span>24/7 работно време за максимално удобство</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-primary">•</span>
                          <span>Безплатен паркинг и охрана</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-primary">•</span>
                          <span>Множество начини за плащане</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-primary">•</span>
                          <span>Лоялни програми и отстъпки</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
