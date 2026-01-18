'use client'
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Fuel, ArrowRight, Shield, Sparkles, ShoppingBag } from "lucide-react"

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
    {
      title: "Управление на продукти",
      description: "Редактиране на цени и наличност в магазина",
      href: "/admin-shop",
      icon: ShoppingBag,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-black text-gradient-primary">Админ Панел</h1>
              <p className="text-green-600 font-bold">✓ Автентикация успешна</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {adminLinks.map((link, index) => {
            const Icon = link.icon
            return (
              <Card key={index} className="group relative overflow-hidden transition-all duration-500 hover-lift bg-gradient-card shadow-lg hover:shadow-xl hover:shadow-primary/10">
                <CardHeader className="pb-4">
                  <div className={`w-14 h-14 ${link.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-7 h-7 ${link.color}`} />
                  </div>
                  <CardTitle className="text-xl font-bold">{link.title}</CardTitle>
                  <CardDescription className="text-sm">{link.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                    <Link href={link.href} className="flex items-center justify-center space-x-2">
                      <span>Отвори</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}