import type { Metadata } from "next"
import { companyInfo } from "@/lib/config"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import {
  Hotel as HotelIcon, Clock, Bed, Users, Home, Info,
  Phone, MapPin, Mail, Calendar, Sparkles, ArrowUpRight, CheckCircle2,
} from "lucide-react"
import { getEffectiveRooms, getHotelInfo } from "@/lib/hotelStore"
import { contacts } from "@/lib/config"
import * as motion from "motion/react-client"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Хотел",
  description: "Комфортни стаи за настаняване в BG OIL - единични, двойни, тройни стаи и апартаменти.",
  keywords: ["хотел Враца", "настаняване Враца", "стаи Враца", "BG OIL хотел"],
  openGraph: {
    title: `Хотел - ${companyInfo.name}`,
    description: "Комфортни стаи за настаняване с климатизация и черни аут блокиращи завеси.",
    url: "https://bgoil.bg/hotel",
    type: "website",
    images: [{ url: "https://bgoil.bg/background.png", width: 1200, height: 630, alt: "BG OIL ВРАЦА - Хотел" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Хотел - ${companyInfo.name}`,
    description: "Комфортни стаи за настаняване с климатизация.",
    images: ["https://bgoil.bg/background.png"],
  },
  alternates: { canonical: "https://bgoil.bg/hotel" },
}

const ROOM_ICONS: Record<string, typeof HotelIcon> = {
  "Единична стая": Users,
  "Двойна стая": Bed,
  "Тройна стая": Users,
  "Апартамент": Home,
}

const ROOM_COLORS = [
  { text: "#ef4444", border: "rgba(239,68,68,0.25)", bg: "rgba(239,68,68,0.08)", glow: "rgba(239,68,68,0.12)" },
  { text: "#f97316", border: "rgba(249,115,22,0.25)", bg: "rgba(249,115,22,0.08)", glow: "rgba(249,115,22,0.12)" },
  { text: "#f87171", border: "rgba(248,113,113,0.25)", bg: "rgba(248,113,113,0.08)", glow: "rgba(248,113,113,0.12)" },
  { text: "#ef4444", border: "rgba(239,68,68,0.25)", bg: "rgba(239,68,68,0.08)", glow: "rgba(239,68,68,0.12)" },
]

export default async function HotelPage() {
  const rooms = await getEffectiveRooms()
  const info = await getHotelInfo()

  const amenities = [
    { title: "Климатизация", description: "Пълна климатизация във всички стаи", icon: Sparkles },
    { title: "Черни аут завеси", description: "Блокиращи светлина за спокоен сън", icon: Sparkles },
    { title: "Безплатен паркинг", description: "Охраняван паркинг за гостите на хотела", icon: Sparkles },
  ]

  const bookingSteps = ["Изберете тип стая", "Свържете се с нас", "Потвърждение", "Настаняване"]

  return (
    <>
      <Header />
      <main className="min-h-screen text-white overflow-x-hidden">

        {/* Page Hero */}
        <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 overflow-hidden">
          {/* Background layers */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full"
              style={{ background: "radial-gradient(ellipse, rgba(239,68,68,0.07), transparent 65%)", filter: "blur(100px)" }} />
            <div className="absolute -bottom-20 right-0 w-[400px] h-[400px] rounded-full"
              style={{ background: "radial-gradient(circle, rgba(249,115,22,0.04), transparent)", filter: "blur(80px)" }} />
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-[0.013]"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
              }} />
          </div>

          <div className="container relative z-10 px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 backdrop-blur-xl"
              style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)" }}
            >
              <HotelIcon className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">Настаняване</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 tracking-tight"
            >
              Хотел <span className="text-gradient-primary">BG OIL</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg text-white/35 max-w-2xl mx-auto"
              style={{ fontFamily: "var(--font-sans)", textTransform: "none", letterSpacing: "0.01em" }}
            >
              Комфортни стаи с климатизация и черни аут блокиращи завеси. Идеално за професионални шофьори и семейства.
            </motion.p>
          </div>
        </section>

        {/* Room Cards */}
        <section className="pb-20 relative">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Видове стаи</h2>
              <p className="text-white/30 text-sm"
                style={{ fontFamily: "var(--font-sans)", textTransform: "none" }}>
                Изберете стая според вашите нужди
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12" style={{ perspective: "1100px" }}>
              {rooms.map((room, index) => {
                const Icon = ROOM_ICONS[room.name] || HotelIcon
                const colors = ROOM_COLORS[index % ROOM_COLORS.length]
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50, rotateX: 14, scale: 0.94 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.65, delay: index * 0.09, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformStyle: "preserve-3d" }}
                    className="group p-8 rounded-2xl glass-depth neon-card-glow animated-gradient-border text-center relative overflow-hidden cursor-default hover-border-red"
                  >
                    {/* Top accent line */}
                    <div className="absolute top-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `linear-gradient(90deg, transparent, ${colors.text}70, transparent)` }} />

                    {/* BG glow */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                      style={{ background: `radial-gradient(ellipse at 50% 0%, ${colors.bg}, transparent 70%)` }} />

                    <div className="relative z-10">
                      {/* Icon */}
                      <div
                        className="w-14 h-14 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-400 group-hover:scale-110"
                        style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
                      >
                        <Icon className="w-6 h-6 transition-colors duration-300" style={{ color: colors.text }} />
                      </div>

                      <h3 className="text-base font-bold text-white mb-4 group-hover:text-white transition-colors">{room.name}</h3>

                      {/* Price display */}
                      <div className="relative">
                        <div className="text-4xl font-black mb-1 transition-all duration-300"
                          style={{ color: colors.text, fontFamily: "var(--font-mono)", letterSpacing: "-0.03em" }}>
                          {room.price.toFixed(0)} €
                        </div>
                        <div className="text-xs text-white/25 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>
                          {room.unit}
                        </div>
                      </div>
                    </div>

                    {/* Corner glow */}
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `radial-gradient(circle, ${colors.glow}, transparent)`, filter: "blur(16px)" }} />
                  </motion.div>
                )
              })}
            </div>

            {/* Check-in/out */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-3xl glass-depth p-8 md:p-10 mb-6 relative overflow-hidden animated-gradient-border"
              style={{ border: "1px solid rgba(255,255,255,0.07)" }}
            >
              {/* Top bar */}
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(239,68,68,0.4), rgba(249,115,22,0.3), transparent)" }} />

              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(239,68,68,0.09)", border: "1px solid rgba(239,68,68,0.2)" }}>
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40" style={{ fontFamily: "var(--font-mono)" }}>Часове</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-8">Информация за настаняване</h3>

              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { label: "Настаняване", time: `от ${info.checkIn}`, color: "#4ade80" },
                  { label: "Напускане", time: `до ${info.checkOut}`, color: "#ef4444" },
                ].map((item, i) => (
                  <div key={i} className="group flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 neon-card-glow cursor-default"
                    style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: `${item.color}12`, border: `1px solid ${item.color}30` }}>
                      <Clock className="w-5 h-5" style={{ color: item.color }} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-1" style={{ fontFamily: "var(--font-mono)" }}>{item.label}</p>
                      <p className="text-2xl font-black text-white">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Amenities */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-3xl glass-depth p-8 mb-6 relative overflow-hidden"
              style={{ border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="flex items-center gap-3 mb-8">
                <h3 className="text-xl font-bold text-white">Удобства</h3>
                <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.06), transparent)" }} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {amenities.map((a, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.88, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: i * 0.1 }}
                    className="text-center space-y-3 group cursor-default"
                  >
                    <div
                      className="w-14 h-14 border rounded-2xl flex items-center justify-center mx-auto transition-all duration-400 group-hover:scale-110"
                      style={{ background: "rgba(245,158,11,0.07)", borderColor: "rgba(245,158,11,0.2)" }}
                    >
                      <Sparkles className="w-5 h-5 transition-colors" style={{ color: "#F59E0B" }} />
                    </div>
                    <h4 className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">{a.title}</h4>
                    <p className="text-xs text-white/35" style={{ fontFamily: "var(--font-sans)", textTransform: "none", letterSpacing: "0.01em" }}>
                      {a.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Reservation */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-3xl glass-depth p-8 md:p-10 mb-6 relative overflow-hidden"
              style={{ border: "1px solid rgba(255,255,255,0.07)" }}
            >
              {/* Top bar */}
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(239,68,68,0.35), transparent)" }} />

              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">Резервация</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-8">Как да резервирате стая?</h3>

              <div className="grid gap-6 md:gap-8 md:grid-cols-2">
                {/* Contact methods */}
                <div className="space-y-4">
                  <h4 className="text-base font-bold text-white mb-4">Свържете се с нас</h4>
                  <div className="space-y-3">
                    {[
                      { icon: Phone, href: `tel:${contacts.hotelReservation}`, value: contacts.hotelReservation, btnText: "Обади се" },
                      { icon: Mail, href: `mailto:${contacts.email}?subject=Резервация на стая`, value: contacts.email, btnText: "Изпрати" },
                      { icon: MapPin, href: contacts.mapsLink, value: contacts.address, btnText: "Карта", external: true },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 sm:p-4 rounded-2xl transition-all duration-300 neon-card-glow group"
                        style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)" }}>
                          <item.icon className="w-4 h-4 text-primary" />
                        </div>
                        <a
                          href={item.href}
                          {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className="text-sm font-bold text-white hover:text-primary transition-colors flex-1 min-w-0 break-words"
                        >
                          {item.value}
                        </a>
                        <Button asChild size="sm" className="hidden sm:flex bg-primary hover:bg-red-600 text-white px-4 py-2 flex-shrink-0 text-xs rounded-xl transition-all duration-200 hover:scale-105 cursor-pointer">
                          <a href={item.href} {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                            {item.btnText}
                            <ArrowUpRight className="w-3 h-3 ml-1 inline" />
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Steps */}
                <div className="space-y-4">
                  <h4 className="text-base font-bold text-white mb-4">Информация за резервация</h4>

                  <div className="p-5 rounded-2xl relative overflow-hidden"
                    style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.1)" }}>
                    <div className="absolute top-0 left-0 right-0 h-px"
                      style={{ background: "linear-gradient(90deg, transparent, rgba(239,68,68,0.3), transparent)" }} />
                    <div className="space-y-4">
                      {bookingSteps.map((step, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: i * 0.07 }}
                          className="flex items-center gap-4 group"
                        >
                          <div
                            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white transition-all duration-300 group-hover:scale-110"
                            style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)", boxShadow: "0 0 12px rgba(239,68,68,0.25)" }}
                          >
                            {i + 1}
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary/40 flex-shrink-0" />
                            <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors mb-0"
                              style={{ fontFamily: "var(--font-sans)", textTransform: "none", marginBottom: 0 }}>
                              {step}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                    <p className="text-xs leading-relaxed text-white/30"
                      style={{ fontFamily: "var(--font-sans)", textTransform: "none" }}>
                      <span className="font-bold text-white/50">Резервации 24/7</span> • Предварителна резервация препоръчителна • Плащане на място
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Disclaimer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl p-6 glass-depth"
              style={{ border: "1px solid rgba(239,68,68,0.1)" }}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)" }}>
                    <Info className="h-5 w-5 text-primary" />
                  </span>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Важна информация</p>
                </div>
                <p className="text-sm text-white/35 md:flex-1"
                  style={{ fontFamily: "var(--font-sans)", textTransform: "none", letterSpacing: "0.01em" }}>
                  Цените са ориентировъчни и подлежат на промяна. За резервация и потвърждение на актуалните стойности, моля, обърнете се към персонала на място или по телефон{" "}
                  <strong className="text-white/55">{contacts.phoneMain}</strong>.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
