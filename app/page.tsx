import type { Metadata } from "next"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Hero from "@/components/Hero"
import ServicesSection from "@/components/ServicesSection"
import FeaturedFuels from "@/components/FeaturedFuels"
import { Suspense } from "react"
import { companyInfo, contacts } from "@/lib/config"
import { MapPin, Phone, Clock, ArrowUpRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Начало",
  description: `${companyInfo.name} - модерна бензиностанция с 24/7 магазин, хотел, автосервиз и автомивка във Враца. Качествени горива (бензин, дизел, AdBlue), комфортни стаи за настаняване и пълен спектър от услуги. Работим 24/7 за вашето удобство.`,
  keywords: [
    "BG OIL ВРАЦА",
    "BG OIL Враца",
    "бензиностанция Враца",
    "горива Враца",
    "хотел Враца",
    "автосервиз Враца",
    "автомивка Враца",
    "бензин Враца",
    "дизел Враца",
    "AdBlue Враца",
    "24/7 бензиностанция Враца",
    "качествени горива Враца",
  ],
  openGraph: {
    title: `${companyInfo.name} - ${companyInfo.slogan}`,
    description: `${companyInfo.name} - модерна бензиностанция с 24/7 магазин, хотел, автосервиз и автомивка във Враца. Качествени горива, комфортни стаи и пълен спектър от услуги.`,
    url: "https://bgoil.bg",
    type: "website",
    images: [
      {
        url: "https://bgoil.bg/background.png",
        width: 1200,
        height: 630,
        alt: `${companyInfo.name} - Бензиностанция, хотел и автосервиз във Враца`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${companyInfo.name} - ${companyInfo.slogan}`,
    description: `${companyInfo.name} - модерна бензиностанция с 24/7 магазин, хотел, автосервиз и автомивка във Враца.`,
    images: ["https://bgoil.bg/background.png"],
  },
  alternates: {
    canonical: "https://bgoil.bg",
  },
}

const marqueeItems = [
  'БЕНЗИН А95', 'ДИЗЕЛ', 'ADBLUE', 'МАГАЗИН 24/7',
  'ХОТЕЛ', 'EASYPAY 24/7', 'БЕЗПЛАТЕН ПАРКИНГ',
  'АВТОСЕРВИЗ', 'АВТОМИВКА', 'КАЧЕСТВО №1',
]

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />

        {/* Marquee strip */}
        <div className="relative overflow-hidden py-5" style={{
          borderTop: '1px solid rgba(239,68,68,0.09)',
          borderBottom: '1px solid rgba(239,68,68,0.09)',
          background: 'linear-gradient(90deg, transparent 0%, rgba(239,68,68,0.025) 50%, transparent 100%)',
        }}>
          {/* Gradient edge fades */}
          <div className="absolute left-0 top-0 bottom-0 w-28 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(90deg, #0A0A0B, transparent)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-28 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(-90deg, #0A0A0B, transparent)' }} />

          <div className="flex animate-marquee whitespace-nowrap">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span
                key={i}
                className="mx-10 text-[11px] font-bold uppercase tracking-[0.25em] text-white/25 inline-flex items-center gap-3"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: 'rgba(239,68,68,0.55)' }} />
                {item}
              </span>
            ))}
          </div>
        </div>

        <ServicesSection />
        <Suspense fallback={null}>
          <FeaturedFuels />
        </Suspense>

        {/* Location CTA */}
        <section className="relative py-28 overflow-hidden">
          {/* Layered background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-px section-divider" />
            <div className="absolute bottom-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(239,68,68,0.1), transparent)' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] rounded-full"
              style={{ background: 'radial-gradient(ellipse, rgba(239,68,68,0.06), transparent)', filter: 'blur(100px)' }} />
            <div className="absolute -bottom-20 left-1/4 w-[400px] h-[300px] rounded-full"
              style={{ background: 'radial-gradient(ellipse, rgba(249,115,22,0.04), transparent)', filter: 'blur(80px)' }} />
            {/* Dot grid */}
            <div className="absolute inset-0 opacity-[0.012]"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)',
                backgroundSize: '48px 48px',
              }} />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              {/* Card with animated gradient border */}
              <div
                className="relative rounded-3xl overflow-hidden animated-gradient-border"
                style={{
                  background: 'linear-gradient(145deg, rgba(20,20,22,0.92), rgba(10,10,11,0.97))',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(32px)',
                  boxShadow: '0 40px 100px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}
              >
                {/* Multi-layer inner glow */}
                <div className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1/2"
                    style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(239,68,68,0.09), transparent 60%)' }} />
                  <div className="absolute -top-20 left-1/4 w-72 h-72 rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.06), transparent)', filter: 'blur(60px)' }} />
                </div>

                {/* Top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(239,68,68,0.6) 30%, rgba(249,115,22,0.4) 50%, rgba(239,68,68,0.6) 70%, transparent 100%)' }} />

                <div className="relative z-10 px-5 py-10 sm:px-8 sm:py-14 md:px-16">
                  {/* Header */}
                  <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 backdrop-blur-xl"
                      style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)' }}>
                      <MapPin className="w-3.5 h-3.5 text-red-400" />
                      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">Намерете ни</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                      Ние сме <span className="text-gradient-primary">тук за вас</span>
                    </h2>
                    <p className="text-white/40 text-base max-w-md mx-auto leading-relaxed"
                      style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, textTransform: 'none', letterSpacing: '0.01em' }}>
                      Намираме се в центъра на Враца. Работим денонощно — никога не затваряме.
                    </p>
                  </div>

                  {/* Info grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                    {[
                      {
                        icon: MapPin,
                        label: "Адрес",
                        value: contacts.address,
                        href: contacts.mapsLink,
                        external: true,
                      },
                      {
                        icon: Phone,
                        label: "Телефон",
                        value: contacts.phoneMain,
                        href: `tel:${contacts.phoneMain}`,
                        external: false,
                      },
                      {
                        icon: Clock,
                        label: "Работно време",
                        value: "24/7 — Никога не затваряме",
                        href: null,
                        external: false,
                      },
                    ].map(({ icon: Icon, label, value, href, external }, i) => {
                      const inner = (
                        <div className="group flex flex-col items-center text-center p-6 rounded-2xl transition-all duration-400 neon-card-glow glass-depth cursor-pointer"
                          style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-400 group-hover:scale-110"
                            style={{ background: 'rgba(239,68,68,0.09)', border: '1px solid rgba(239,68,68,0.2)' }}>
                            <Icon className="w-5 h-5 text-red-400" />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-2" style={{ fontFamily: 'var(--font-mono)' }}>
                            {label}
                          </span>
                          <span className="text-white/65 text-sm leading-snug font-medium group-hover:text-white/80 transition-colors" style={{ fontFamily: 'var(--font-sans)', textTransform: 'none', letterSpacing: '0.01em' }}>
                            {value}
                          </span>
                        </div>
                      )
                      return href ? (
                        <a key={i} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="cursor-pointer block">
                          {inner}
                        </a>
                      ) : (
                        <div key={i}>{inner}</div>
                      )
                    })}
                  </div>

                  {/* CTA buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <a
                      href={contacts.mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 sm:px-9 py-4 rounded-full font-bold text-white text-sm transition-all duration-300 cursor-pointer neon-glow shimmer-btn hover:scale-[1.03] w-full sm:w-auto justify-center"
                      style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}
                    >
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span>Отвори в Google Maps</span>
                      <ArrowUpRight className="w-4 h-4 opacity-70 flex-shrink-0" />
                    </a>
                    <a
                      href={`tel:${contacts.phoneMain}`}
                      className="inline-flex items-center gap-2 px-6 sm:px-9 py-4 rounded-full font-bold text-white text-sm transition-all duration-300 cursor-pointer hover:bg-white/[0.08] hover:scale-[1.02] glass-depth w-full sm:w-auto justify-center"
                    >
                      <Phone className="w-4 h-4" />
                      Обади се
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
