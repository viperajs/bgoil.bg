import type { Metadata } from "next"
import { companyInfo, contacts } from "@/lib/config"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import {
  Hotel as HotelIcon, Clock, Users, Info, Ruler, BedDouble,
  Phone, MapPin, Mail, Calendar, Sparkles, ArrowUpRight, CheckCircle2,
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
    description: "Комфортни стаи за настаняване с климатизация и затъмняващи завеси.",
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
  { title: "Затъмняващи завеси", description: "Блокиращи светлина за спокоен сън" },
  { title: "Безплатен паркинг", description: "Охраняван паркинг за гостите на хотела" },
]

const bookingSteps = ["Изберете тип стая", "Свържете се с нас", "Потвърждение", "Настаняване"]

export default async function HotelPage() {
  const [rooms, info] = await Promise.all([getAvailableRooms(), getHotelInfo()])

  return (
    <>
      <Header />
      <main className="min-h-screen text-foreground overflow-x-hidden">

        {/* Page Hero */}
        <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-20 overflow-hidden">
          <div className="container relative z-10 px-4 text-center mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 border border-border bg-card/60 backdrop-blur-xl"
            >
              <HotelIcon className="w-3.5 h-3.5 text-brand-500" />
              <span className="text-caption uppercase text-muted-foreground">Настаняване</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-display text-foreground mb-6"
            >
              Хотел BG OIL
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-body text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              Комфортни стаи с климатизация и затъмняващи завеси. Идеално за професионални шофьори и семейства.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button asChild size="lg">
                <a href={`tel:${contacts.hotelReservation}`}>
                  <Phone className="w-4 h-4" />
                  Резервация: {contacts.hotelReservation}
                </a>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Room Cards */}
        <section className="pb-20 relative">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-h1 text-foreground mb-3">Видове стаи</h2>
              <p className="text-muted-foreground text-sm">
                Изберете стая според вашите нужди
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-12">
              {rooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="group rounded-lg border border-border bg-card hover-lift overflow-hidden relative flex flex-col"
                >
                  {/* Photo */}
                  <div className="relative h-52 overflow-hidden bg-secondary/40">
                    {room.images?.[0] ? (
                      <img
                        src={room.images[0]}
                        alt={room.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BedDouble className="w-10 h-10 text-muted-foreground/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold uppercase tracking-[0.18em] bg-background/70 backdrop-blur-md border border-border text-foreground/80 rounded-full px-3 py-1.5">
                        {room.type}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-h4 text-foreground mb-2">{room.name}</h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground mb-4">
                      <span className="inline-flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-brand-500/70" />{room.capacity} {room.capacity === 1 ? "гост" : "гости"}</span>
                      {room.size && <span className="inline-flex items-center gap-1.5"><Ruler className="w-3.5 h-3.5 text-brand-500/70" />{room.size}</span>}
                    </div>

                    {room.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed mb-5 line-clamp-3">
                        {room.description}
                      </p>
                    )}

                    {(room.amenities?.length ?? 0) > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {room.amenities.slice(0, 4).map((a) => (
                          <span key={a} className="text-[10px] font-medium bg-secondary border border-border text-muted-foreground rounded-md px-2 py-1">
                            {a}
                          </span>
                        ))}
                        {room.amenities.length > 4 && (
                          <span className="text-[10px] font-medium text-muted-foreground/60 px-1 py-1">+{room.amenities.length - 4}</span>
                        )}
                      </div>
                    )}

                    {/* Price + CTA */}
                    <div className="mt-auto flex items-end justify-between gap-3 pt-4 border-t border-border">
                      <div>
                        <div className="text-h3 font-mono tabular-nums text-foreground group-hover:text-brand-500 transition-colors">
                          {room.price.toFixed(0)} €
                        </div>
                        <div className="text-[10px] text-muted-foreground/70 uppercase tracking-wider font-mono">
                          на нощувка
                        </div>
                      </div>
                      <a
                        href={`tel:${contacts.hotelReservation}`}
                        aria-label={`Обади се за ${room.name}`}
                        className="inline-flex items-center gap-1.5 min-h-[44px] px-4 rounded-md border border-brand-500/30 bg-brand-500/10 text-xs font-bold text-brand-500 hover:bg-primary hover:text-primary-foreground hover:border-transparent transition-colors duration-200 cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Обади се
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Check-in/out */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-lg border border-border bg-card p-8 md:p-10 mb-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-md border border-border bg-secondary flex items-center justify-center text-brand-500">
                  <Clock className="h-4 w-4" />
                </div>
                <span className="text-caption uppercase text-muted-foreground font-mono">Часове</span>
              </div>
              <h3 className="text-h2 text-foreground mb-8">Информация за настаняване</h3>

              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { label: "Настаняване", time: `от ${info.checkIn}` },
                  { label: "Напускане", time: `до ${info.checkOut}` },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 rounded-lg border border-border bg-secondary/40 hover-lift">
                    <div className="w-12 h-12 rounded-full border border-brand-500/25 bg-brand-500/10 flex items-center justify-center shrink-0 text-brand-500">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-caption uppercase text-muted-foreground/70 font-mono mb-1">{item.label}</p>
                      <p className="text-h3 text-foreground">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Amenities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-lg border border-border bg-card p-8 mb-6"
            >
              <div className="flex items-center gap-3 mb-8">
                <h3 className="text-h4 text-foreground">Удобства</h3>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {amenitiesGeneral.map((a, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="text-center space-y-3"
                  >
                    <div className="w-14 h-14 border border-amber-500/25 bg-amber-500/10 rounded-lg flex items-center justify-center mx-auto text-amber-400">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-foreground text-sm">{a.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {a.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Reservation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-lg border border-border bg-card p-8 md:p-10 mb-6"
            >
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-brand-500" />
                <span className="text-caption uppercase text-brand-500">Резервация</span>
              </div>
              <h3 className="text-h2 text-foreground mb-8">Как да резервирате стая?</h3>

              <div className="grid gap-6 md:gap-8 md:grid-cols-2">
                {/* Contact methods */}
                <div className="space-y-4">
                  <h4 className="text-base font-bold text-foreground mb-4">Свържете се с нас</h4>
                  <div className="space-y-3">
                    {[
                      { icon: Phone, href: `tel:${contacts.hotelReservation}`, value: contacts.hotelReservation, btnText: "Обади се" },
                      { icon: Mail, href: `mailto:${contacts.email}?subject=Резервация на стая`, value: contacts.email, btnText: "Изпрати" },
                      { icon: MapPin, href: contacts.mapsLink, value: contacts.address, btnText: "Карта", external: true },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 sm:p-4 rounded-lg border border-border bg-secondary/40 hover-lift">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-brand-500/25 bg-brand-500/10 flex items-center justify-center flex-shrink-0 text-brand-500">
                          <item.icon className="w-4 h-4" />
                        </div>
                        <a
                          href={item.href}
                          {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className="text-sm font-bold text-foreground hover:text-brand-500 transition-colors flex-1 min-w-0 break-words cursor-pointer"
                        >
                          {item.value}
                        </a>
                        <a
                          href={item.href}
                          {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className="hidden sm:inline-flex items-center gap-1 min-h-[40px] px-4 rounded-md bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-bold transition-colors duration-200 cursor-pointer"
                        >
                          {item.btnText}
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Steps */}
                <div className="space-y-4">
                  <h4 className="text-base font-bold text-foreground mb-4">Информация за резервация</h4>

                  <div className="p-5 rounded-lg border border-brand-500/20 bg-brand-500/[0.05]">
                    <div className="space-y-4">
                      {bookingSteps.map((step, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 12 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.35, delay: i * 0.06 }}
                          className="flex items-center gap-4"
                        >
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-black text-primary-foreground">
                            {i + 1}
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-brand-500/50 flex-shrink-0" />
                            <p className="text-sm text-muted-foreground">
                              {step}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-border bg-secondary/40">
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      <span className="font-bold text-foreground/80">Резервации 24/7</span> • Предварителна резервация препоръчителна • Плащане на място
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Disclaimer */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="rounded-lg p-6 border border-brand-500/20 bg-card"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md border border-brand-500/25 bg-brand-500/10 text-brand-500">
                    <Info className="h-5 w-5" />
                  </span>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-500">Важна информация</p>
                </div>
                <p className="text-sm text-muted-foreground md:flex-1">
                  Цените са ориентировъчни и подлежат на промяна. За резервация и потвърждение на актуалните стойности, моля, обърнете се към персонала на място или по телефон{" "}
                  <strong className="text-foreground/80">{contacts.phoneMain}</strong>.
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
