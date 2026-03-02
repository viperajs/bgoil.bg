import type { Metadata } from "next"
import { companyInfo } from "@/lib/config"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Hotel as HotelIcon, Clock, Bed, Users, Home, Info, Phone, MapPin, Mail, Calendar, Sparkles } from "lucide-react"
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
  'Единична стая': Users,
  'Двойна стая': Bed,
  'Тройна стая': Users,
  'Апартамент': Home,
}

export default async function HotelPage() {
  const rooms = await getEffectiveRooms()
  const info = await getHotelInfo()

  const amenities = [
    { emoji: "❄️", title: "Климатизация", description: "Пълна климатизация във всички стаи" },
    { emoji: "🌙", title: "Черни аут завеси", description: "Блокиращи светлина за спокоен сън" },
    { emoji: "🚗", title: "Паркинг", description: "Безплатен паркинг за гости" },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen text-white overflow-x-hidden">

        {/* Hero */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.04] rounded-full blur-[150px] pointer-events-none"></div>

          <div className="container relative z-10 px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] mb-8 backdrop-blur-xl"
            >
              <HotelIcon className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">Настаняване</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-7xl font-black mb-6 tracking-tight"
            >
              Хотел <span className="text-gradient-primary">BG OIL</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg text-white/35 max-w-2xl mx-auto"
            >
              Комфортни стаи с климатизация и черни аут блокиращи завеси. Идеално за професионални шофьори и семейства.
            </motion.p>
          </div>
        </section>

        {/* Rooms */}
        <section className="pb-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
              {rooms.map((room, index) => {
                const Icon = ROOM_ICONS[room.name] || HotelIcon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.08 }}
                    className="group p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-center hover:border-primary/20 hover:bg-white/[0.04] transition-all duration-500 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="relative z-10">
                      <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-white/[0.04] border border-white/[0.05] flex items-center justify-center group-hover:bg-primary/[0.1] group-hover:border-primary/20 transition-all duration-300">
                        <Icon className="w-6 h-6 text-white/50 group-hover:text-primary transition-colors duration-300" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-4">{room.name}</h3>
                      <div className="text-3xl font-black text-primary mb-1">{room.price.toFixed(0)} €</div>
                      <div className="text-xs text-white/25">{room.unit}</div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Check-in/out */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-8 md:p-10 mb-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">Часове</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-8">Информация за настаняване</h3>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="flex items-center gap-4 p-5 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                  <div className="w-11 h-11 rounded-full bg-primary/[0.08] flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-1">Настаняване</p>
                    <p className="text-xl font-bold text-white">от {info.checkIn}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                  <div className="w-11 h-11 rounded-full bg-primary/[0.08] flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-1">Напускане</p>
                    <p className="text-xl font-bold text-white">до {info.checkOut}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Amenities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-8 mb-8"
            >
              <h3 className="text-xl font-bold mb-8">Удобства</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {amenities.map((a, i) => (
                  <div key={i} className="text-center space-y-3 group">
                    <div className="w-12 h-12 bg-white/[0.04] border border-white/[0.05] rounded-xl flex items-center justify-center mx-auto group-hover:bg-primary/[0.08] transition-colors duration-300">
                      <span className="text-xl">{a.emoji}</span>
                    </div>
                    <h4 className="font-bold text-white text-sm">{a.title}</h4>
                    <p className="text-xs text-white/30">{a.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Reservation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-8 md:p-10 mb-8"
            >
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">Резервация</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-8">Как да резервирате стая?</h3>

              <div className="grid gap-8 md:grid-cols-2">
                {/* Contact Methods */}
                <div className="space-y-4">
                  <h4 className="text-base font-bold text-white mb-4">Свържете се с нас</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.04] hover:border-white/[0.08] transition-colors">
                      <div className="w-9 h-9 rounded-full bg-primary/[0.08] flex items-center justify-center flex-shrink-0">
                        <Phone className="w-4 h-4 text-primary" />
                      </div>
                      <a href={`tel:${contacts.phoneMain}`} className="text-sm font-bold text-white hover:text-primary transition-colors flex-1">
                        {contacts.phoneMain}
                      </a>
                      <Button asChild size="sm" className="bg-primary hover:bg-primary-light text-white px-4 py-2 flex-shrink-0 text-xs">
                        <a href={`tel:${contacts.phoneMain}`}>Обади се</a>
                      </Button>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.04] hover:border-white/[0.08] transition-colors">
                      <div className="w-9 h-9 rounded-full bg-primary/[0.08] flex items-center justify-center flex-shrink-0">
                        <Mail className="w-4 h-4 text-primary" />
                      </div>
                      <a href={`mailto:${contacts.email}?subject=Резервация на стая`} className="text-sm font-bold text-white hover:text-primary transition-colors flex-1 break-all">
                        {contacts.email}
                      </a>
                      <Button asChild size="sm" className="bg-primary hover:bg-primary-light text-white px-4 py-2 flex-shrink-0 text-xs">
                        <a href={`mailto:${contacts.email}?subject=Резервация на стая`}>Изпрати</a>
                      </Button>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.04] hover:border-white/[0.08] transition-colors">
                      <div className="w-9 h-9 rounded-full bg-primary/[0.08] flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-sm font-bold text-white flex-1">{contacts.address}</p>
                      <Button asChild size="sm" className="bg-primary hover:bg-primary-light text-white px-4 py-2 flex-shrink-0 text-xs">
                        <a href={contacts.mapsLink} target="_blank" rel="noopener noreferrer">Карта</a>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Steps */}
                <div className="space-y-4">
                  <h4 className="text-base font-bold text-white mb-4">Информация за резервация</h4>
                  <div className="p-5 rounded-xl bg-primary/[0.04] border border-primary/10">
                    <div className="space-y-4">
                      {["Изберете тип стая", "Свържете се с нас", "Потвърждение", "Настаняване"].map((step, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
                          <p className="text-sm text-white/60">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <p className="text-xs leading-relaxed text-white/30">
                      <span className="font-bold text-white/50">Резервации 24/7</span> • Предварителна резервация препоръчителна • Плащане на място
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Disclaimer */}
            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/[0.08]">
                    <Info className="h-5 w-5 text-primary" />
                  </span>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Важна информация</p>
                </div>
                <p className="text-sm text-white/35 md:flex-1">
                  Цените са ориентировъчни и подлежат на промяна. За резервация и потвърждение на актуалните стойности, моля, обърнете се към персонала на място или по телефон <strong className="text-white/50">{contacts.phoneMain}</strong>.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
