import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Hero from "@/components/Hero"
import ServicesSection from "@/components/ServicesSection"
import FeaturedFuels from "@/components/FeaturedFuels"
import NewsSection from "@/components/NewsSection"
import { Suspense } from "react"

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ServicesSection />
        <Suspense fallback={null}>
          {/* @ts-expect-error Async Server Component */}
          <FeaturedFuels />
        </Suspense>
        <NewsSection />
      </main>
      <Footer />
    </>
  )
}
