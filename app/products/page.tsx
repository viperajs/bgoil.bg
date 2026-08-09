import type { Metadata } from "next"
import { companyInfo } from "@/lib/config"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import FuelCard from "@/components/FuelCard"
import { Button } from "@/components/ui/button"
import { Fuel as FuelIcon, CreditCard, Info, Check, Sparkles } from "lucide-react"
import { getEffectiveFuels } from "@/lib/fuelStore"
import * as motion from "motion/react-client"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Горива и цени",
  description: "Актуални цени на горива в BG OIL.",
}

export default async function ProductsPage() {
  const fuels = await getEffectiveFuels()

  const benefits = [
    "Отстъпки при всяко зареждане",
    "Специални промоции за членове",
    "Бонус точки за лоялност",
    "Бързо обслужване с приоритет",
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen text-foreground overflow-x-hidden">

        {/* Page Hero */}
        <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 overflow-hidden">
          <div className="container relative z-10 px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 border border-border bg-card/60 backdrop-blur-xl"
            >
              <FuelIcon className="w-3.5 h-3.5 text-brand-500" />
              <span className="text-caption uppercase text-muted-foreground">Ценова листа</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-display text-foreground mb-6"
            >
              Горива и цени
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-body text-muted-foreground max-w-2xl mx-auto"
            >
              Винаги актуални цени за най-качествените горива във Враца.
            </motion.p>
          </div>
        </section>

        {/* Prices Grid */}
        <section className="pb-24 relative">
          <div className="container px-4 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <h2 className="text-h2 text-foreground mb-2">Актуални цени на горива</h2>
              <p className="text-muted-foreground text-sm">
                Цени с и без BG OIL CLUB карта
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
              {fuels.map((fuel, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full"
                >
                  <FuelCard fuel={fuel} />
                </motion.div>
              ))}
            </div>

            {/* Loyalty Card section */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative rounded-lg overflow-hidden border border-border bg-card"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10 p-6 sm:p-8 md:p-12 lg:p-16">
                {/* Left: text */}
                <div className="space-y-8">
                  <div>
                    <div className="inline-flex items-center gap-2 text-brand-500 font-bold mb-4">
                      <CreditCard className="w-4 h-4" />
                      <span className="text-caption uppercase font-mono">BG OIL CLUB</span>
                    </div>
                    <h2 className="text-h1 text-foreground leading-tight mb-4">
                      Спестете с <br /> всяко зареждане
                    </h2>
                    <p className="text-body text-muted-foreground max-w-md">
                      Присъединете се към нашата лоялна програма и се възползвайте от ексклузивни отстъпки и предимства.
                    </p>
                  </div>

                  <ul className="space-y-3">
                    {benefits.map((b, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: 0.1 + i * 0.06 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-7 h-7 rounded-full border border-brand-500/25 bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3.5 h-3.5 text-brand-500" />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {b}
                        </span>
                      </motion.li>
                    ))}
                  </ul>

                  <Button size="lg">
                    <Sparkles className="w-4 h-4" />
                    Заявете карта на място
                  </Button>
                </div>

                {/* Right: credit card */}
                <div className="flex justify-center lg:justify-end">
                  <div className="relative w-full max-w-[280px] h-44 sm:w-80 sm:h-52 lg:w-96 lg:h-60 rounded-2xl border border-border bg-gradient-to-br from-secondary to-background shadow-elevation-3">
                    <div className="absolute top-6 left-6">
                      <span className="font-black text-xl tracking-tighter text-foreground">BG OIL</span>
                      <div className="text-[9px] uppercase tracking-widest text-muted-foreground/60 mt-0.5 font-mono">CLUB</div>
                    </div>

                    {/* Chip */}
                    <div className="absolute top-1/2 left-6 -translate-y-1/2 w-11 h-8 rounded-md bg-gradient-to-br from-amber-400/70 to-amber-600/50" />

                    <div className="absolute bottom-6 left-6">
                      <span className="font-mono text-muted-foreground/60 tracking-widest text-sm">8823 **** **** 9281</span>
                    </div>
                    <div className="absolute bottom-6 right-6">
                      <CreditCard className="w-7 h-7 text-brand-500/60" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Disclaimer */}
            <div className="mt-10 flex justify-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-border bg-card text-xs text-muted-foreground">
                <Info className="w-3.5 h-3.5 flex-shrink-0" />
                Цените подлежат на промяна. Попитайте на касата за актуални стойности.
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
