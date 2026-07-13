import type { Metadata } from "next"
import Link from "next/link"
import { companyInfo, contacts } from "@/lib/config"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import {
  Hotel as HotelIcon, Clock, Users, Info, Ruler, BedDouble,
  Phone, MapPin, Mail, Calendar, Sparkles, ArrowUpRight, ArrowRight, CheckCircle2,
} from "lucide-react"
import { getAvailableRooms } from "@/lib/roomsStore"
import { getHotelInfo } from "@/lib/hotelStore"
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

const amenitiesGeneral = [
  { title: "Климатизация", description: "Пълна климатизация във всички стаи" },
  { title: "Черни аут завеси", description: "Блокиращи светлина за спокоен сън" },
  { title: "Безплатен паркинг", description: "Охраняван паркинг за гостите на хотела" },
]

const bookingSteps = ["Изберете тип стая", "Свържете се с нас или резервирайте онлайн", "Потвърждение", "Настаняване"]

export default async function HotelPage() {
  const rooms = await getAvailableRooms()
  const info = await getHotelInfo()

  return (
    <>
      <Header />
      <main className="min-h-screen text-white overflow-x-hidden">

        {/* Page Hero */}
        <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-20 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full"
              style={{ background: "radial-gradient(ellipse, rgba(239,68,68,0.07), transparent 65%)", filter: "blur(100px)" }} />
            <div className="absolute -bottom-20 right-0 w-[400px] h-[400px] rounded-full"
              style={{ background: "radial-gradient(circle, rgba(249,115,22,0.04), transparent)", filter: "blur(80px)" }} />
            <div className="absolute inset-0 opacity-[0.013]"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
              }} />
          </div>

          <div className="container relative z-10 px-4 text-center mx-auto">
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
              className="text-lg text-white/35 max-w-2xl mx-auto mb-10"
              style={{ fontFamily: "var(--font-sans)", textTransform: "none", letterSpacing: "0.01em" }}
            >
              Комфортни стаи с климатизация и черни аут блокиращи завеси. Идеално за професионални шофьори и семейства.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <Link
                href="/booking"
                className="group inline-flex items-center justify-center gap-2 min-h-[48px] px-8 rounded-xl bg-primary hover:bg-red-500 text-sm font-bold text-white transition-all duration-200 cursor-pointer shadow-[0_0_32px_rgba(239,68,68,0.3)] hover:shadow-[0_0_44px_rgba(239,68,68,0.45)]"
              >
                Резервирай онлайн
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a
                href={`tel:${contacts.hotelReservation}`}
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-8 rounded-xl border border-white/[0.12] text-sm font-bold text-white/70 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                {contacts.hotelReservation}
              </a>
            </motion.div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-12">
              {rooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 50, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="group rounded-2xl glass-depth neon-card-glow overflow-hidden relative flex flex-col hover-border-red"
                >
                  {/* Photo */}
                  <div className="relative h-52 overflow-hidden bg-white/[0.02]">
                    {room.images[0] ? (
                      <img
                        src={room.images[0]}
                        alt={room.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BedDouble className="w-10 h-10 text-white/10" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101012] via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold uppercase tracking-[0.18em] bg-black/60 backdrop-blur-md border border-white/10 text-white/70 rounded-full px-3 py-1.5">
                        {room.type}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-2">{room.name}</h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-white/40 mb-4"
                      style={{ fontFamily: "var(--font-sans)", textTransform: "none" }}>
                      <span className="inline-flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-primary/60" />{room.capacity} {room.capacity === 1 ? "гост" : "гости"}</span>
                      {room.size && <span className="inline-flex items-center gap-1.5"><Ruler className="w-3.5 h-3.5 text-primary/60" />{room.size}</span>}
                    </div>

                    <p className="text-xs text-white/35 leading-relaxed mb-5 line-clamp-3"
                      style={{ fontFamily: "var(--font-sans)", textTransform: "none", letterSpacing: "0.01em" }}>
                      {room.description}
                    </p>

                    {room.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {room.amenities.slice(0, 4).map((a) => (
                          <span key={a} className="text-[10px] font-medium bg-white/[0.04] border border-white/[0.07] text-white/50 rounded-md px-2 py-1"
                            style={{ fontFamily: "var(--font-sans)", textTransform: "none" }}>
                            {a}
                          </span>
                        ))}
                        {room.amenities.length > 4 && (
                          <span className="text-[10px] font-medium text-white/30 px-1 py-1">+{room.amenities.length - 4}</span>
                        )}
                      </div>
                    )}

                    {/* Price + CTA */}
                    <div className="mt-auto flex items-end justify-between gap-3 pt-4 border-t border-white/[0.06]">
                      <div>
                        <div className="text-3xl font-black transition-colors duration-300 text-white group-hover:text-primary"
                          style={{ fontFamily: "var(--font-mono)", letterSpacing: "-0.03em" }}>
                          {room.price.toFixed(0)} €
                        </div>
                        <div className="text-[10px] text-white/25 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>
                          на нощувка
                        </div>
                      </div>
                      <Link
                        href="/booking"
                        aria-label={`Резервирай ${room.name}`}
                        className="inline-flex items-center gap-1.5 min-h-[44px] px-4 rounded-xl bg-primary/10 border border-primary/25 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-colors duration-200 cursor-pointer"
                      >
                        Резервирай
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
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
                {amenitiesGeneral.map((a, i) => (
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
                          className="text-sm font-bold text-white hover:text-primary transition-colors flex-1 min-w-0 break-words cursor-pointer"
                        >
                          {item.value}
                        </a>
                        <a
                          href={item.href}
                          {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className="hidden sm:inline-flex items-center gap-1 min-h-[40px] px-4 rounded-xl bg-primary hover:bg-red-500 text-white text-xs font-bold transition-colors duration-200 cursor-pointer"
                        >
                          {item.btnText}
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/booking"
                    className="group flex items-center justify-center gap-2 min-h-[48px] rounded-2xl bg-primary/[0.07] border border-primary/25 text-sm font-bold text-primary hover:bg-primary hover:text-white transition-colors duration-200 cursor-pointer"
                  >
                    Или резервирайте онлайн
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
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
