"use client"

import { Zap, ShoppingBag, CreditCard, BedDouble, Wrench, Car, Disc, Camera, ParkingSquare, Fuel } from "lucide-react"
import Link from "next/link"
import * as motion from "motion/react-client"

const allServices = [
  {
    icon: Fuel,
    name: "Бензиностанция",
    description: "Висококачествени горива — Бензин А95, Дизел, ГПБ и AdBlue на конкурентни цени.",
    link: "/products",
    size: "large",
    accentColor: "rgba(239,68,68,0.12)",
    borderHover: "rgba(239,68,68,0.3)",
    iconColor: "#ef4444",
  },
  {
    icon: ShoppingBag,
    name: "Магазин 24/7",
    description: "Непрекъснато работещ магазин с всичко необходимо за пътуването и автомобила ви.",
    link: "/shop",
    size: "normal",
    accentColor: "rgba(249,115,22,0.10)",
    borderHover: "rgba(249,115,22,0.3)",
    iconColor: "#f97316",
  },
  {
    icon: CreditCard,
    name: "EasyPay 24/7",
    description: "Плащайте сметки, данъци и мобилни кредити денонощно без опашки.",
    link: "/about",
    size: "normal",
    accentColor: "rgba(251,191,36,0.08)",
    borderHover: "rgba(251,191,36,0.3)",
    iconColor: "#f87171",
  },
  {
    icon: BedDouble,
    name: "Хотел",
    description: "Комфортни стаи с климатизация и черни аут завеси. Единични, двойни, тройни и апартаменти.",
    link: "/hotel",
    size: "wide",
    accentColor: "rgba(239,68,68,0.08)",
    borderHover: "rgba(239,68,68,0.25)",
    iconColor: "#ef4444",
  },
  {
    icon: Wrench,
    name: "Автосервиз",
    description: "Пълен сервиз с бърза диагностика, оригинални части и честни цени.",
    link: "/about",
    size: "normal",
    accentColor: "rgba(249,115,22,0.08)",
    borderHover: "rgba(249,115,22,0.25)",
    iconColor: "#f97316",
  },
  {
    icon: Car,
    name: "Автомивка",
    description: "Самообслужваща се автомивка за финалното полиране преди път.",
    link: "/about",
    size: "normal",
    accentColor: "rgba(239,68,68,0.07)",
    borderHover: "rgba(239,68,68,0.25)",
    iconColor: "#f87171",
  },
  {
    icon: Disc,
    name: "Гуми и джанти",
    description: "Монтаж, баланс и изправяне на джанти с модерна техника.",
    link: "/about",
    size: "normal",
    accentColor: "rgba(249,115,22,0.07)",
    borderHover: "rgba(249,115,22,0.25)",
    iconColor: "#fb7185",
  },
  {
    icon: Camera,
    name: "Камера за боядисване",
    description: "Под наем за професионалисти, търсещи перфектен контрол над резултата.",
    link: "/about",
    size: "normal",
    accentColor: "rgba(239,68,68,0.07)",
    borderHover: "rgba(239,68,68,0.25)",
    iconColor: "#ef4444",
  },
  {
    icon: ParkingSquare,
    name: "Безплатен паркинг",
    description: "Охраняван и безплатен паркинг за всички клиенти на комплекса.",
    link: "/contact",
    size: "normal",
    accentColor: "rgba(249,115,22,0.07)",
    borderHover: "rgba(249,115,22,0.25)",
    iconColor: "#f97316",
  },
]

// Bento grid col-span classes (12-column grid)
const bentoSpans = [
  "col-span-12 md:col-span-7",  // 0: Бензиностанция - large
  "col-span-12 md:col-span-5",  // 1: Магазин 24/7
  "col-span-12 md:col-span-5",  // 2: EasyPay
  "col-span-12 md:col-span-7",  // 3: Хотел - wide
  "col-span-6 md:col-span-3",   // 4: Автосервиз
  "col-span-6 md:col-span-3",   // 5: Автомивка
  "col-span-6 md:col-span-3",   // 6: Гуми
  "col-span-6 md:col-span-3",   // 7: Камера
  "col-span-12 md:col-span-12", // 8: Паркинг - full
]

export default function ServicesSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 -left-20 w-[500px] h-[500px] rounded-full blur-[130px]"
          style={{ background: 'radial-gradient(ellipse, rgba(239,68,68,0.06), transparent)' }} />
        <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(ellipse, rgba(249,115,22,0.05), transparent)' }} />
      </div>

      <div className="container relative mx-auto px-4 z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 backdrop-blur-xl"
            style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
            <Zap className="w-3.5 h-3.5" style={{ color: '#ef4444' }} />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">Нашите услуги</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-white mb-5">
            Пълен <span className="text-gradient-primary">Спектър</span>
          </h2>
          <p className="text-base md:text-lg text-white/45 max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, textTransform: 'none', letterSpacing: '0.01em' }}>
            Всичко необходимо за вашето удобство — на едно място, 24 часа в денонощието.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-12 gap-4">
          {allServices.map((service, index) => {
            const Icon = service.icon
            const spanClass = bentoSpans[index] || "col-span-6 md:col-span-4"
            const isLarge = service.size === "large" || service.size === "wide"
            const isFull = service.size === "full"

            return (
              <motion.div
                key={index}
                className={`${spanClass}`}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={service.link}
                  className="group relative flex flex-col h-full cursor-pointer bento-card"
                  style={{ minHeight: isLarge ? '200px' : isFull ? '120px' : '180px', padding: isLarge ? '2rem' : '1.5rem' }}
                >
                  {/* Hover gradient overlay */}
                  <div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at 20% 50%, ${service.accentColor}, transparent 70%)` }}
                  />

                  {/* Top gradient line */}
                  <div className="absolute top-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                    style={{ background: `linear-gradient(90deg, transparent, ${service.iconColor}50, transparent)` }}
                  />

                  <div className={`relative z-10 ${isFull ? 'flex items-center gap-6' : 'flex flex-col'} h-full`}>
                    {/* Icon */}
                    <div
                      className="flex-shrink-0 rounded-2xl flex items-center justify-center transition-all duration-400 group-hover:scale-110"
                      style={{
                        width: isLarge ? '56px' : '48px',
                        height: isLarge ? '56px' : '48px',
                        background: service.accentColor,
                        border: `1px solid ${service.iconColor}25`,
                        marginBottom: isFull ? '0' : isLarge ? '1.5rem' : '1.25rem',
                        boxShadow: `0 0 0 0 ${service.iconColor}30`,
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget
                        el.style.boxShadow = `0 0 20px ${service.iconColor}35`
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget
                        el.style.boxShadow = `0 0 0 0 ${service.iconColor}30`
                      }}
                    >
                      <Icon
                        style={{ width: isLarge ? '26px' : '22px', height: isLarge ? '26px' : '22px', color: service.iconColor }}
                        strokeWidth={1.5}
                      />
                    </div>

                    <div className="flex-1">
                      <h3
                        className="font-bold text-white mb-2 transition-colors duration-300 group-hover:text-red-400"
                        style={{ fontSize: isLarge ? '1.25rem' : '1rem' }}
                      >
                        {service.name}
                      </h3>
                      <p
                        className="text-white/45 leading-relaxed group-hover:text-white/60 transition-colors duration-300"
                        style={{
                          fontSize: isFull ? '0.875rem' : '0.8125rem',
                          fontFamily: 'var(--font-sans)',
                          fontWeight: 400,
                          textTransform: 'none',
                          letterSpacing: '0.01em',
                          lineHeight: '1.6'
                        }}
                      >
                        {service.description}
                      </p>
                    </div>
                  </div>

                  {/* Corner glow */}
                  <div
                    className="absolute bottom-0 right-0 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-2xl"
                    style={{ background: `radial-gradient(circle, ${service.accentColor}, transparent)` }}
                  />
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-3 rounded-full px-8 py-3 backdrop-blur-xl"
            style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.12)' }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <p className="text-sm font-medium text-white/55" style={{ fontFamily: 'var(--font-sans)', textTransform: 'none', letterSpacing: '0.01em' }}>
              Работим <span className="font-bold" style={{ color: '#ef4444' }}>24/7</span> за вашето удобство
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
