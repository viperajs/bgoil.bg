export const metadata = {
  title: "Начало",
  description:
    "BG OIL ВРАЦА - Модерна бензиностанция с 24/7 магазин, хотел и пълен спектър от услуги във Враца.",
}

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Hero from "@/components/Hero"
import ServicesSection from "@/components/ServicesSection"
import FeaturedFuels from "@/components/FeaturedFuels"

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ServicesSection />
        {/* Тук картите за горива са динамични (идват от /api/fuel) */}
        <FeaturedFuels />
      </main>
      <Footer />
    </>
  )
}
