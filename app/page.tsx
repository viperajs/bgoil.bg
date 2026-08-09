import type { Metadata } from "next"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Hero from "@/components/Hero"
import ServicesSection from "@/components/ServicesSection"
import FeaturedFuels from "@/components/FeaturedFuels"
import { Button } from "@/components/ui/button"
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

        {/* Marquee strip — slower, masked edges, pauses on hover/focus */}
        <div className="marquee-row marquee-mask relative overflow-hidden py-5 border-y border-border">
          <div className="flex animate-marquee whitespace-nowrap motion-reduce:animate-none">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span
                key={i}
                className="mx-10 text-caption uppercase text-muted-foreground/70 font-mono inline-flex items-center gap-3"
              >
                <span className="w-1 h-1 rounded-full flex-shrink-0 bg-brand-500/70" />
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
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="relative rounded-lg border border-border bg-card">
                <div className="px-5 py-10 sm:px-8 sm:py-14 md:px-16">
                  {/* Header */}
                  <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 border border-border bg-secondary">
                      <MapPin className="w-3.5 h-3.5 text-brand-500" />
                      <span className="text-caption uppercase text-muted-foreground">Намерете ни</span>
                    </div>
                    <h2 className="text-h1 text-foreground mb-4">
                      Ние сме тук за вас
                    </h2>
                    <p className="text-body text-muted-foreground max-w-md mx-auto">
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
                        <div className="group flex flex-col items-center text-center p-6 rounded-md border border-border hover-lift">
                          <div className="w-12 h-12 rounded-md border border-border bg-secondary flex items-center justify-center mb-4 text-brand-500">
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-caption uppercase text-muted-foreground/60 font-mono mb-2">
                            {label}
                          </span>
                          <span className="text-foreground/80 text-sm leading-snug font-medium group-hover:text-foreground transition-colors">
                            {value}
                          </span>
                        </div>
                      )
                      return href ? (
                        <a key={i} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="block">
                          {inner}
                        </a>
                      ) : (
                        <div key={i}>{inner}</div>
                      )
                    })}
                  </div>

                  {/* CTA buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button asChild size="lg" className="rounded-full w-full sm:w-auto">
                      <a href={contacts.mapsLink} target="_blank" rel="noopener noreferrer">
                        <MapPin className="w-4 h-4" />
                        <span>Отвори в Google Maps</span>
                        <ArrowUpRight className="w-4 h-4 opacity-80" />
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="rounded-full w-full sm:w-auto">
                      <a href={`tel:${contacts.phoneMain}`}>
                        <Phone className="w-4 h-4" />
                        Обади се
                      </a>
                    </Button>
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
