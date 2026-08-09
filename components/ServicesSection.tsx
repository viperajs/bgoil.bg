"use client"

import { Zap, ShoppingBag, CreditCard, BedDouble, Wrench, Car, Disc, Camera, ParkingSquare, Fuel, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import * as motion from "motion/react-client"

const allServices = [
  {
    icon: Fuel,
    name: "Бензиностанция",
    description: "Висококачествени горива — Бензин А95, Дизел, Пропан-бутан (ПБ) и AdBlue на конкурентни цени.",
    link: "/products",
    size: "large",
    tag: "01",
  },
  {
    icon: ShoppingBag,
    name: "Магазин 24/7",
    description: "Непрекъснато работещ магазин с всичко необходимо за пътуването и автомобила ви.",
    link: "/shop",
    size: "normal",
    tag: "02",
  },
  {
    icon: CreditCard,
    name: "EasyPay 24/7",
    description: "Плащайте сметки, данъци и мобилни кредити денонощно без опашки.",
    link: "/about",
    size: "normal",
    tag: "03",
  },
  {
    icon: BedDouble,
    name: "Хотел",
    description: "Комфортни стаи с климатизация и затъмняващи завеси. Единични, двойни, тройни и апартаменти.",
    link: "/hotel",
    size: "wide",
    tag: "04",
  },
  {
    icon: Wrench,
    name: "Автосервиз",
    description: "Пълен сервиз с бърза диагностика, оригинални части и честни цени.",
    link: "/about",
    size: "normal",
    tag: "05",
  },
  {
    icon: Car,
    name: "Автомивка",
    description: "Самообслужваща се автомивка за финалното полиране преди път.",
    link: "/about",
    size: "normal",
    tag: "06",
  },
  {
    icon: Disc,
    name: "Гуми и джанти",
    description: "Монтаж, баланс и изправяне на джанти с модерна техника.",
    link: "/about",
    size: "normal",
    tag: "07",
  },
  {
    icon: Camera,
    name: "Камера за боядисване",
    description: "Под наем за професионалисти, търсещи перфектен контрол над резултата.",
    link: "/about",
    size: "normal",
    tag: "08",
  },
  {
    icon: ParkingSquare,
    name: "Безплатен паркинг",
    description: "Охраняван и безплатен паркинг за всички клиенти на комплекса.",
    link: "/contact",
    size: "full",
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
      <div className="container relative mx-auto px-4 z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 border border-border bg-card/60 backdrop-blur-xl">
            <Zap className="w-3.5 h-3.5 text-brand-500" />
            <span className="text-caption uppercase text-muted-foreground">Нашите услуги</span>
          </div>

          <h2 className="text-h1 text-foreground mb-5">
            Пълен спектър
          </h2>
          <p className="text-body text-muted-foreground max-w-2xl mx-auto">
            Всичко необходимо за вашето удобство — на едно място, 24 часа в денонощието.
          </p>
        </motion.div>

        {/* Services grid — numbered cards with clear hierarchy */}
        <div className="grid grid-cols-12 gap-4">
          {allServices.map((service, index) => {
            const Icon = service.icon
            const spanClass = bentoSpans[index] || "col-span-6 md:col-span-4"
            const isLarge = service.size === "large" || service.size === "wide"
            const isFull = service.size === "full"

            return (
              <motion.div
                key={index}
                className={spanClass}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={service.link}
                  className={[
                    "group relative flex h-full rounded-lg border border-border bg-card hover-lift",
                    isFull ? "items-center gap-6 p-6" : "flex-col",
                    isLarge && !isFull ? "p-6" : !isFull ? "p-5" : "",
                  ].join(" ")}
                >
                  {/* Service number tag */}
                  <span className="absolute top-4 right-5 text-caption font-mono text-muted-foreground/40 group-hover:text-brand-500/70 transition-colors">
                    {service.tag}
                  </span>

                  <div className={isFull ? "flex-shrink-0" : "mb-5"}>
                    <div
                      className={[
                        "flex items-center justify-center rounded-md border border-border bg-secondary text-brand-500 transition-colors group-hover:border-brand-500/40 group-hover:bg-brand-500/10",
                        isLarge ? "w-12 h-12" : "w-10 h-10",
                      ].join(" ")}
                    >
                      <Icon className={isLarge ? "w-6 h-6" : "w-5 h-5"} strokeWidth={1.5} />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className={["font-semibold text-foreground mb-2 flex items-center gap-1.5", isLarge ? "text-h4" : "text-base"].join(" ")}>
                      {service.name}
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-70 transition-all -translate-x-1 group-hover:translate-x-0 text-brand-500" />
                    </h3>
                    <p className={["text-muted-foreground leading-relaxed", isFull ? "text-sm" : "text-sm"].join(" ")}>
                      {service.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-3 rounded-full px-8 py-3 border border-border bg-card/60 backdrop-blur-xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <p className="text-sm font-medium text-muted-foreground">
              Работим <span className="font-bold text-brand-500">24/7</span> за вашето удобство
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
