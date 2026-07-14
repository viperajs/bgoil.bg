import Link from "next/link"
import {
  Hotel,
  ShoppingBag,
  Percent,
  CreditCard,
  ChevronRight,
  BedDouble,
  EyeOff,
  Euro,
  Sparkles,
} from "lucide-react"
import { getRooms } from "@/lib/roomsStore"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  const rooms = await getRooms()

  const availableRooms = rooms.filter(r => r.available)
  const hiddenRooms = rooms.length - availableRooms.length
  const minPrice = availableRooms.length > 0 ? Math.min(...availableRooms.map(r => r.price)) : 0
  const maxPrice = availableRooms.length > 0 ? Math.max(...availableRooms.map(r => r.price)) : 0

  const stats = [
    {
      label: "Видими стаи на сайта",
      value: String(availableRooms.length),
      hint: `${rooms.length} общо в системата`,
      icon: BedDouble,
      color: "#34d399",
      href: "/admin-hotel",
    },
    {
      label: "Скрити стаи",
      value: String(hiddenRooms),
      hint: "не се показват на сайта",
      icon: EyeOff,
      color: "#fbbf24",
      href: "/admin-hotel",
    },
    {
      label: "Цени на нощувка",
      value: availableRooms.length > 0 ? `${minPrice}–${maxPrice} €` : "—",
      hint: "от най-ниска до най-висока",
      icon: Euro,
      color: "#60a5fa",
      href: "/admin-hotel",
    },
  ]

  const modules = [
    {
      title: "Хотел и стаи",
      description: "Добавяне, редакция и изтриване на стаи, цени и снимки",
      href: "/admin-hotel",
      icon: Hotel,
      color: "#818cf8",
    },
    {
      title: "Магазин",
      description: "Продукти, категории и наличности",
      href: "/admin-shop",
      icon: ShoppingBag,
      color: "#34d399",
    },
    {
      title: "Промоции",
      description: "Активни промо кампании и отстъпки",
      href: "/admin-promo",
      icon: Percent,
      color: "#fb7185",
    },
    {
      title: "Промо AI",
      description: "Генериране на промо съдържание с изкуствен интелект",
      href: "/admin-promo-ai",
      icon: Sparkles,
      color: "#c084fc",
    },
    {
      title: "Цени горива",
      description: "Актуализация на цените на горивата",
      href: "/admin-prices",
      icon: CreditCard,
      color: "#22d3ee",
    },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-wide" style={{ fontFamily: "var(--font-display)" }}>
          Добре дошли
        </h2>
        <p className="text-sm text-white/40 mt-1">
          Преглед на системата за управление на BG OIL Враца.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(stat => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group relative rounded-2xl bg-white/[0.03] border border-white/[0.07] p-5 transition-colors duration-200 hover:bg-white/[0.05] hover:border-white/[0.14] cursor-pointer overflow-hidden"
            >
              <div
                className="absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-[0.07] group-hover:opacity-[0.14] transition-opacity duration-300"
                style={{ background: `radial-gradient(circle, ${stat.color}, transparent 70%)` }}
              />
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center border"
                  style={{ background: `${stat.color}14`, borderColor: `${stat.color}30` }}
                >
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />
              </div>
              <div className="text-3xl font-black text-white" style={{ fontFamily: "var(--font-mono)" }}>
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-white/70 mt-1">{stat.label}</div>
              <div className="text-xs text-white/30 mt-0.5">{stat.hint}</div>
            </Link>
          )
        })}
      </div>

      {/* Modules */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/35 mb-4">Модули</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {modules.map(item => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-start gap-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] p-5 transition-colors duration-200 hover:bg-white/[0.05] hover:border-white/[0.14] cursor-pointer"
              >
                <div
                  className="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center border"
                  style={{ background: `${item.color}14`, borderColor: `${item.color}30` }}
                >
                  <Icon className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-[15px] font-bold text-white group-hover:text-white transition-colors">
                      {item.title}
                    </h4>
                    <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed mt-1">{item.description}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      <p className="text-center text-xs text-white/25 pt-4 border-t border-white/[0.05]">
        BG OIL Admin System v3.0 • Защитена зона
      </p>
    </div>
  )
}
