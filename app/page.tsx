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
        <ServicesSection />
        <Suspense fallback={null}>
          <FeaturedFuels />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
