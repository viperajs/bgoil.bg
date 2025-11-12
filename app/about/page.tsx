import { generateLocalBusinessSchema } from "@/lib/schema"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { services, companyInfo } from "@/lib/config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, Award, Clock, Shield, Heart, Sparkles, Target, Zap } from "lucide-react"
import Image from "next/image"

export const metadata = {
  title: "За нас",
  description: "Научете повече за BG OIL ВРАЦА - нашите услуги, история и ангажимент към качеството.",
}

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
        <section className="py-24 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto animate-fade-in-up">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-primary">За нас</span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-foreground mb-6">
                <span className="text-gradient-primary">BG OIL ВРАЦА</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Научете повече за нашата история, мисия и ангажимент към качеството
              </p>
            </div>
          </div>
        </section>

        {/* Company Story */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8 animate-fade-in-left">
                <div className="space-y-6">
                  <Badge variant="outline" className="w-fit px-4 py-2 text-sm font-semibold">
                    <Target className="w-4 h-4 mr-2 inline" />
                    Нашата история
                  </Badge>
                  <h2 className="text-4xl md:text-5xl font-black text-foreground text-balance">
                    <span className="text-gradient-primary">{companyInfo.slogan}</span>
                  </h2>
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                    BG OIL ВРАЦА е модерна бензиностанция, която служи на общността във Враца с най-високо качество на
                    горива и услуги. Нашата мисия е да предоставяме надеждни, качествени продукти и услуги, които
                    отговарят на нуждите на нашите клиенти.
                  </p>
                </div>
                <div className="space-y-4 p-6 rounded-2xl bg-gradient-primary/5 border border-primary/20">
                  <div className="flex items-center space-x-3 mb-4">
                    <Zap className="w-6 h-6 text-primary" />
                    <h3 className="text-2xl font-bold text-foreground">Нашата мисия</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Да бъдем водещата бензиностанция във Враца, предлагайки не само качествени горива, но и цялостно
                    обслужване - от комфортен хотел до професионални автомобилни услуги. Стремим се да създадем място,
                    където клиентите се чувстват добре дошли и получават повече от очакваното.
                  </p>
                </div>
                <div className="space-y-4 p-6 rounded-2xl bg-gradient-secondary/5 border border-secondary/20">
                  <div className="flex items-center space-x-3 mb-4">
                    <Building2 className="w-6 h-6 text-secondary" />
                    <h3 className="text-2xl font-bold text-foreground">Хотел BG OIL</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Нашият хотел предлага комфортни стаи и апартаменти за вашия престой във Враца. Всички стаи са оборудвани с модерни удобства, безплатен WiFi, климатик и кабелна телевизия. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Разполагаме с единични и двойни стаи, както и луксозни апартаменти за по-дълги престои. Всички гости имат достъп до безплатен паркинг и 24/7 рецепция. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                  </p>
                </div>
                <div className="space-y-4 p-6 rounded-2xl bg-gradient-accent/5 border border-accent/20">
                  <div className="flex items-center space-x-3 mb-4">
                    <Sparkles className="w-6 h-6 text-accent" />
                    <h3 className="text-2xl font-bold text-foreground">Допълнителни услуги</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Освен горива и хотел, предлагаме и широк спектър от допълнителни услуги. Нашият 24/7 магазин предлага всичко необходимо за пътуване и ежедневие. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Разполагаме с автомивка и автосервиз за пълно обслужване на вашия автомобил. Нашият професионален екип е винаги на разположение да помогне с всякакви нужди. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.
                  </p>
                </div>
              </div>
              <div className="relative animate-fade-in-right">
                <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-primary/20 hover-lift">
                  <Image
                    src="/fuel-station-reference.png"
                    alt="BG OIL ВРАЦА бензиностанция"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-24 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-fade-in-up">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-primary">Нашите ценности</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6">
                Принципите, които ръководят работата ни
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Ценности, които ни водят всеки ден към по-добро обслужване
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <Card
                  key={index}
                  className="group relative overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-500 hover-lift bg-gradient-card shadow-lg hover:shadow-2xl"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                  
                  <CardHeader className="text-center pb-4 relative z-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-primary/10 group-hover:bg-gradient-primary transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <value.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-300" />
                    </div>
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
                      {value.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <p className="text-muted-foreground text-center leading-relaxed group-hover:text-foreground transition-colors duration-300">
                      {value.description}
                    </p>
                  </CardContent>
                  
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 shine opacity-20"></div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Our Services */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-fade-in-up">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-primary">Нашите услуги</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6">
                <span className="text-gradient-primary">Пълен спектър</span> от услуги
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Предлагаме всичко необходимо за вашето удобство и комфорт
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card
                  key={index}
                  className="group relative overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-500 hover-lift bg-gradient-card shadow-lg hover:shadow-2xl"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                  
                  <CardHeader className="text-center pb-4 relative z-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-primary/10 group-hover:bg-gradient-primary transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <span className="text-5xl group-hover:scale-110 transition-transform duration-500">{service.icon}</span>
                    </div>
                    <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors duration-300">
                      {service.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <p className="text-muted-foreground text-center leading-relaxed group-hover:text-foreground transition-colors duration-300">
                      {service.description}
                    </p>
                  </CardContent>
                  
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 shine opacity-20"></div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-24 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <Card className="border-2 border-primary/20 bg-gradient-card shadow-2xl hover-lift">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-3xl md:text-4xl lg:text-5xl font-black text-gradient-primary mb-4">
                    Защо да изберете BG OIL ВРАЦА?
                  </CardTitle>
                  <p className="text-lg text-muted-foreground">
                    Вашият надежден партньор за качествени горива и услуги
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-primary/10 flex items-center justify-center">
                          <Award className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold text-card-foreground">Качество и надеждност</h3>
                      </div>
                      <ul className="space-y-3 text-muted-foreground">
                        <li className="flex items-start space-x-3">
                          <span className="text-primary font-bold mt-1">•</span>
                          <span>Сертифицирани горива от водещи производители</span>
                        </li>
                        <li className="flex items-start space-x-3">
                          <span className="text-primary font-bold mt-1">•</span>
                          <span>Редовни проверки за качество и безопасност</span>
                        </li>
                        <li className="flex items-start space-x-3">
                          <span className="text-primary font-bold mt-1">•</span>
                          <span>Модерно оборудване и технологии</span>
                        </li>
                        <li className="flex items-start space-x-3">
                          <span className="text-primary font-bold mt-1">•</span>
                          <span>Професионален и обучен персонал</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-primary/10 flex items-center justify-center">
                          <Clock className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold text-card-foreground">Удобство и комфорт</h3>
                      </div>
                      <ul className="space-y-3 text-muted-foreground">
                        <li className="flex items-start space-x-3">
                          <span className="text-primary font-bold mt-1">•</span>
                          <span>24/7 работно време за максимално удобство</span>
                        </li>
                        <li className="flex items-start space-x-3">
                          <span className="text-primary font-bold mt-1">•</span>
                          <span>Безплатен паркинг и охрана</span>
                        </li>
                        <li className="flex items-start space-x-3">
                          <span className="text-primary font-bold mt-1">•</span>
                          <span>Множество начини за плащане</span>
                        </li>
                        <li className="flex items-start space-x-3">
                          <span className="text-primary font-bold mt-1">•</span>
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