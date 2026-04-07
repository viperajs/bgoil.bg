"use client"

import { Zap, ShoppingBag, CreditCard, BedDouble, Wrench, Car, Disc, Camera, ParkingSquare, Fuel, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import * as motion from "motion/react-client"
import Tilt3DCard from "./Tilt3DCard"

const allServices = [
  {
    icon: Fuel,
    name: "Бензиностанция",
    description: "Висококачествени горива — Бензин А95, Дизел, ГПБ и AdBlue на конкурентни цени.",
    link: "/products",
    size: "large",
    accentColor: "rgba(239,68,68,0.12)",
    borderHover: "rgba(239,68,68,0.35)",
    iconColor: "#ef4444",
    iconBg: "rgba(239,68,68,0.1)",
    tag: "01",
  },
  {
    icon: ShoppingBag,
    name: "Магазин 24/7",
    description: "Непрекъснато работещ магазин с всичко необходимо за пътуването и автомобила ви.",
    link: "/shop",
    size: "normal",
    accentColor: "rgba(249,115,22,0.10)",
    borderHover: "rgba(249,115,22,0.35)",
    iconColor: "#f97316",
    iconBg: "rgba(249,115,22,0.1)",
    tag: "02",
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
    iconBg: "rgba(248,113,113,0.1)",
    tag: "03",
  },
  {
    icon: BedDouble,
    name: "Хотел",
    description: "Комфортни стаи с климатизация и черни аут завеси. Единични, двойни, тройни и апартаменти.",
    link: "/hotel",
    size: "wide",
    accentColor: "rgba(239,68,68,0.08)",
    borderHover: "rgba(239,68,68,0.3)",
    iconColor: "#ef4444",
    iconBg: "rgba(239,68,68,0.1)",
    tag: "04",
  },
  {
    icon: Wrench,
    name: "Автосервиз",
    description: "Пълен сервиз с бърза диагностика, оригинални части и честни цени.",
    link: "/about",
    size: "normal",
    accentColor: "rgba(249,115,22,0.08)",
    borderHover: "rgba(249,115,22,0.3)",
    iconColor: "#f97316",
    iconBg: "rgba(249,115,22,0.1)",
    tag: "05",
  },
  {
    icon: Car,
    name: "Автомивка",
    description: "Самообслужваща се автомивка за финалното полиране преди път.",
    link: "/about",
    size: "normal",
    accentColor: "rgba(239,68,68,0.07)",
    borderHover: "rgba(239,68,68,0.3)",
    iconColor: "#f87171",
    iconBg: "rgba(248,113,113,0.1)",
    tag: "06",
  },
  {
    icon: Disc,
    name: "Гуми и джанти",
    description: "Монтаж, баланс и изправяне на джанти с модерна техника.",
    link: "/about",
    size: "normal",
    accentColor: "rgba(249,115,22,0.07)",
    borderHover: "rgba(249,115,22,0.3)",
    iconColor: "#fb7185",
    iconBg: "rgba(251,113,133,0.1)",
    tag: "07",
  },
  {
    icon: Camera,
    name: "Камера за боядисване",
    description: "Под наем за професионалисти, търсещи перфектен контрол над резултата.",
    link: "/about",
    size: "normal",
    accentColor: "rgba(239,68,68,0.07)",
    borderHover: "rgba(239,68,68,0.3)",
    iconColor: "#ef4444",
    iconBg: "rgba(239,68,68,0.1)",
    tag: "08",
  },
  {
    icon: ParkingSquare,
    name: "Безплатен паркинг",
    description: "Охраняван и безплатен паркинг за всички клиенти на комплекса.",
    link: "/contact",
    size: "full",
    accentColor: "rgba(249,115,22,0.07)",
    borderHover: "rgba(249,115,22,0.3)",
    iconColor: "#f97316",
    iconBg: "rgba(249,115,22,0.1)",
    tag: "09",
  },
]

const bentoSpans = [
  "col-span-12 md:col-span-7",
  "col-span-12 md:col-span-5",
  "col-span-12 md:col-span-5",
  "col-span-12 md:col-span-7",
  "col-span-6 md:col-span-3",
  "col-span-6 md:col-span-3",
  "col-span-6 md:col-span-3",
  "col-span-6 md:col-span-3",
  "col-span-12 md:col-span-12",
]

export default function ServicesSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Deep ambient glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(239,68,68,0.05), transparent 70%)", filter: "blur(80px)" }}
        />
        <div
          className="absolute bottom-0 -left-32 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(239,68,68,0.06), transparent 70%)", filter: "blur(100px)" }}
        />
        <div
          className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(249,115,22,0.05), transparent 70%)", filter: "blur(90px)" }}
        />
        {/* Grid lines decoration */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="container relative mx-auto px-4 z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 backdrop-blur-xl"
            style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)" }}
          >
            <Zap className="w-3.5 h-3.5" style={{ color: "#ef4444" }} />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">Нашите услуги</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-5">
            Пълен <span className="text-gradient-primary">Спектър</span>
          </h2>
          <p
            className="text-base md:text-lg text-white/45 max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 400, textTransform: "none", letterSpacing: "0.01em" }}
          >
            Всичко необходимо за вашето удобство — на едно място, 24 часа в денонощието.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-12 gap-4" style={{ perspective: "1200px" }}>
          {allServices.map((service, index) => {
            const Icon = service.icon
            const spanClass = bentoSpans[index] || "col-span-6 md:col-span-4"
            const isLarge = service.size === "large" || service.size === "wide"
            const isFull = service.size === "full"

            return (
              <motion.div
                key={index}
                className={`${spanClass}`}
                initial={{ opacity: 0, y: 50, rotateX: 12, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  duration: 0.65,
                  delay: index * 0.065,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <Tilt3DCard
                  className="h-full"
                  intensity={isFull ? 4 : isLarge ? 6 : 9}
                  glowColor={service.accentColor}
                >
                  <Link
                    href={service.link}
                    className="group relative flex flex-col h-full cursor-pointer animated-gradient-border"
                    style={{
                      minHeight: isFull ? "auto" : "auto",
                      padding: isLarge ? "1.5rem" : "1.25rem",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "1.5rem",
                      overflow: "hidden",
                      transition: "border-color 0.4s ease, background 0.4s ease",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget
                      el.style.borderColor = service.borderHover
                      el.style.background = "rgba(255,255,255,0.035)"
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget
                      el.style.borderColor = "rgba(255,255,255,0.07)"
                      el.style.background = "rgba(255,255,255,0.02)"
                    }}
                  >
                    {/* Top shimmer sweep */}
                    <div
                      className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                      style={{
                        background: `linear-gradient(135deg, ${service.accentColor}, transparent 50%)`,
                      }}
                    />

                    {/* Inner top accent line */}
                    <div
                      className="absolute top-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"
                      style={{ background: `linear-gradient(90deg, transparent, ${service.iconColor}60, transparent)` }}
                    />

                    {/* Service number tag */}
                    <div
                      className="absolute top-4 right-4 text-[10px] font-bold opacity-15 group-hover:opacity-40 transition-opacity duration-400"
                      style={{ fontFamily: "var(--font-mono)", color: service.iconColor }}
                    >
                      {service.tag}
                    </div>

                    <div
                      className={`relative z-10 ${isFull ? "flex items-center gap-6" : "flex flex-col"} h-full`}
                    >
                      {/* Icon */}
                      <div
                        className="flex-shrink-0 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110"
                        style={{
                          width: isLarge ? "52px" : "46px",
                          height: isLarge ? "52px" : "46px",
                          background: service.iconBg,
                          border: `1px solid ${service.iconColor}25`,
                          marginBottom: isFull ? "0" : isLarge ? "1.5rem" : "1.25rem",
                          boxShadow: `0 0 0 0 ${service.iconColor}30`,
                          position: "relative",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = `0 0 24px ${service.iconColor}40, 0 0 48px ${service.iconColor}15`
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = `0 0 0 0 ${service.iconColor}30`
                        }}
                      >
                        {/* Icon inner glow */}
                        <div
                          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{ background: `radial-gradient(circle at center, ${service.iconColor}15, transparent)` }}
                        />
                        <Icon
                          style={{
                            width: isLarge ? "26px" : "22px",
                            height: isLarge ? "26px" : "22px",
                            color: service.iconColor,
                            position: "relative",
                            zIndex: 1,
                          }}
                          strokeWidth={1.5}
                        />
                      </div>

                      <div className="flex-1">
                        <h3
                          className="font-bold text-white mb-2 transition-colors duration-300 group-hover:text-white flex items-center gap-2"
                          style={{ fontSize: isLarge ? "1.25rem" : "1rem" }}
                        >
                          {service.name}
                          <ArrowUpRight
                            className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-all duration-300 -translate-x-1 group-hover:translate-x-0 flex-shrink-0"
                            style={{ color: service.iconColor }}
                          />
                        </h3>
                        <p
                          className="text-white/45 leading-relaxed group-hover:text-white/65 transition-colors duration-300"
                          style={{
                            fontSize: isFull ? "0.875rem" : "0.8125rem",
                            fontFamily: "var(--font-sans)",
                            fontWeight: 400,
                            textTransform: "none",
                            letterSpacing: "0.01em",
                            lineHeight: "1.6",
                          }}
                        >
                          {service.description}
                        </p>
                      </div>
                    </div>

                    {/* Corner depth glow */}
                    <div
                      className="absolute bottom-0 right-0 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-600 pointer-events-none"
                      style={{ background: `radial-gradient(circle, ${service.accentColor}, transparent)`, filter: "blur(20px)" }}
                    />
                  </Link>
                </Tilt3DCard>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-center mt-16"
        >
          <div
            className="inline-flex items-center gap-3 rounded-full px-8 py-3 backdrop-blur-xl"
            style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.14)" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <p
              className="text-sm font-medium text-white/55"
              style={{ fontFamily: "var(--font-sans)", textTransform: "none", letterSpacing: "0.01em" }}
            >
              Работим <span className="font-bold" style={{ color: "#ef4444" }}>24/7</span> за вашето удобство
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
