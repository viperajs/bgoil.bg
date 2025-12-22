import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Fuel, ArrowRight, Shield, Sparkles } from "lucide-react"

export default function AdminPage() {
  const adminLinks = [
    {
      title: "Управление на цени",
      description: "Редактиране на цените на горива",
      href: "/admin-prices",
      icon: Fuel,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Промоции/Новини",
      description: "Управление на промоции и новини за сайта",
      href: "/admin-promo",
      icon: Sparkles,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-black text-gradient-primary">Админ Панел</h1>
              <p className="text-muted-foreground">Управление на системата</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Достъпът е защитен с Basic Auth (middleware). Изберете секция за управление.
          </p>
        </div>

        {/* Admin Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {adminLinks.map((link, index) => {
            const Icon = link.icon
            return (
              <Card
                key={index}
                className="group relative overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-500 hover-lift bg-gradient-card shadow-lg hover:shadow-2xl"
              >
                <CardHeader className="pb-4">
                  <div className={`w-14 h-14 ${link.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-7 h-7 ${link.color}`} />
                  </div>
                  <CardTitle className="text-xl font-bold">{link.title}</CardTitle>
                  <CardDescription className="text-sm">{link.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full group-hover:bg-primary group-hover:text-white transition-colors duration-300"
                  >
                    <Link href={link.href} className="flex items-center justify-center space-x-2">
                      <span>Отвори</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </Button>
                </CardContent>
                {/* Shine Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 shine opacity-20"></div>
              </Card>
            )
          })}
        </div>

        {/* Info Card */}
        <div className="mt-12 max-w-4xl mx-auto">
          <Card className="border-primary/20 bg-gradient-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-6 h-6 text-primary" />
                <span>Сигурност</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Админ панелът е защитен с Basic Authentication. Само авторизирани потребители могат да достъпят тези функции.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <span className="text-primary">•</span>
                  <span>Всички админ функции изискват автентикация</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary">•</span>
                  <span>Промените се запазват веднага в системата</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary">•</span>
                  <span>Препоръчва се да се прави резервно копие преди важни промени</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
