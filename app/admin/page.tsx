import Link from "next/link"
import {
  Hotel,
  CalendarDays,
  ShoppingBag,
  Percent,
  CreditCard,
  ChevronRight,
  LayoutDashboard
} from "lucide-react"

export default function AdminDashboard() {
  const modules = [
    {
      title: "Резервации",
      description: "Управление на резервации и заявки за настаняване",
      href: "/admin-bookings",
      icon: CalendarDays,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "hover:border-blue-500/50"
    },
    {
      title: "Хотел & Стаи",
      description: "Управление на стаи, наличности и информация",
      href: "/admin-hotel",
      icon: Hotel,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      border: "hover:border-indigo-500/50"
    },
    {
      title: "Магазин",
      description: "Продукти, категории и наличности",
      href: "/admin-shop",
      icon: ShoppingBag,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "hover:border-emerald-500/50"
    },
    {
      title: "Промоции",
      description: "Активни промо кампании и отстъпки",
      href: "/admin-promo",
      icon: Percent,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "hover:border-rose-500/50"
    },
    {
      title: "Цени горива",
      description: "Актуализация на цените на горивата",
      href: "/admin-prices",
      icon: CreditCard,
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
      border: "hover:border-cyan-500/50"
    }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-primary rounded-xl shadow-lg shadow-primary/20 border border-white/10">
              <LayoutDashboard className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Административен Панел</h1>
              <p className="text-muted-foreground">Добре дошли в системата за управление на BG OIL</p>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {modules.map((item, idx) => {
            const Icon = item.icon
            return (
              <Link
                key={idx}
                href={item.href}
                className={`group relative bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-card ${item.border}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${item.bg}`}>
                    <Icon className={`w-8 h-8 ${item.color}`} />
                  </div>
                  <div className="p-2 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </Link>
            )
          })}
        </div>

        {/* Quick Stats or Footer */}
        <div className="mt-16 pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            BG OIL Admin System v2.0 • Secured Area
          </p>
        </div>
      </div>
    </div>
  )
}