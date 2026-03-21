import type { Metadata } from "next"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Hero from "@/components/Hero"
import ServicesSection from "@/components/ServicesSection"
import FeaturedFuels from "@/components/FeaturedFuels"
import { Suspense } from "react"
import { companyInfo } from "@/lib/config"

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

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />

        {/* Marquee Strip */}
        <div className="relative overflow-hidden py-4" style={{ borderTop: '1px solid rgba(239,68,68,0.08)', borderBottom: '1px solid rgba(239,68,68,0.08)', background: 'rgba(239,68,68,0.02)' }}>
          <div className="flex animate-marquee whitespace-nowrap">
            {['БЕНЗИН А95', 'ДИЗЕЛ', 'ADBLUE', 'МАГАЗИН 24/7', 'ХОТЕЛ', 'EASYPAY 24/7', 'БЕЗПЛАТЕН ПАРКИНГ', 'КАЧЕСТВО №1', 'БЕНЗИН А95', 'ДИЗЕЛ', 'ADBLUE', 'МАГАЗИН 24/7', 'ХОТЕЛ', 'EASYPAY 24/7', 'БЕЗПЛАТЕН ПАРКИНГ', 'КАЧЕСТВО №1'].map((item, i) => (
              <span key={i} className="mx-8 text-xs font-bold uppercase tracking-[0.2em] text-white/35 inline-flex items-center gap-3" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.2em' }}>
                <span className="w-1.5 h-1.5 rounded-full inline-block flex-shrink-0" style={{ background: 'rgba(239,68,68,0.7)' }}></span>
                {item}
              </span>
            ))}
          </div>
        </div>

        <ServicesSection />
        <Suspense fallback={null}>
          <FeaturedFuels />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
