import type { Metadata } from "next"
import { companyInfo } from "@/lib/config"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import FuelCard from "@/components/FuelCard"
import { Fuel as FuelIcon, CreditCard, Info, Check } from "lucide-react"
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
    "Бързо обслужване с приоритет"
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen text-white overflow-x-hidden">

        {/* Hero */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[400px] bg-primary/[0.06] blur-[120px] rounded-full pointer-events-none"></div>

          <div className="container relative z-10 px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] mb-8 backdrop-blur-xl"
            >
              <FuelIcon className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">Ценова Листа</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-7xl font-black mb-6 tracking-tight"
            >
              Горива и <span className="text-gradient-primary">Цени</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg text-white/35 max-w-2xl mx-auto"
            >
              Винаги актуални цени за най-качествените горива във Враца.
            </motion.p>
          </div>
        </section>

        {/* Prices Grid */}
        <section className="pb-24">
          <div className="container px-4 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
              {fuels.map((fuel, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  className="h-full"
                >
                  <FuelCard fuel={fuel} />
                </motion.div>
              ))}
            </div>

            {/* Loyalty Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-3xl overflow-hidden bg-white/[0.02] border border-white/[0.05] p-8 md:p-12 lg:p-16"
            >
              <div className="absolute top-0 right-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/[0.08] rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3"></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                <div className="space-y-8">
                  <div>
                    <div className="inline-flex items-center gap-2 text-primary font-bold mb-4">
                      <CreditCard className="w-4 h-4" />
                      <span className="uppercase tracking-[0.2em] text-xs">BG OIL CLUB</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
                      Спестете с <br /> всяко зареждане
                    </h2>
                    <p className="text-base text-white/35 max-w-md">
                      Присъединете се към нашата лоялна програма и се възползвайте от ексклузивни отстъпки и предимства.
                    </p>
                  </div>

                  <ul className="space-y-3">
                    {benefits.map((b, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 + (i * 0.08) }}
                        className="flex items-center gap-3 group"
                      >
                        <div className="w-7 h-7 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center group-hover:bg-primary/[0.1] transition-colors">
                          <Check className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="text-sm text-white/50">{b}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-8 py-4 font-bold rounded-xl transition-all duration-300 neon-glow shimmer-btn cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff' }}
                  >
                    Заявете карта на място
                  </motion.button>
                </div>

                <div className="flex justify-center lg:justify-end">
                  <motion.div
                    initial={{ rotate: 8, y: 40, opacity: 0 }}
                    whileInView={{ rotate: 3, y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    whileHover={{ rotate: 0, scale: 1.03 }}
                    className="relative w-80 h-52 lg:w-96 lg:h-60 rounded-3xl bg-gradient-to-br from-zinc-800/80 to-black border border-white/[0.08] shadow-2xl transition-all duration-500"
                  >
                    <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_at_top_right,rgba(239,68,68,0.1),transparent_60%)]"></div>
                    <div className="absolute top-6 left-6">
                      <span className="font-black text-xl tracking-tighter text-white">BG OIL</span>
                    </div>
                    <div className="absolute bottom-6 left-6">
                      <span className="font-mono text-white/30 tracking-widest text-sm">8823 **** **** 9281</span>
                    </div>
                    <div className="absolute bottom-6 right-6">
                      <CreditCard className="w-7 h-7 text-primary/60" />
                    </div>
                    <div className="absolute top-1/2 left-6 -translate-y-1/2 w-10 h-7 rounded bg-gradient-to-r from-yellow-200/60 to-yellow-500/60 shadow-inner"></div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Disclaimer */}
            <div className="mt-12 flex justify-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/[0.02] border border-white/[0.04] text-xs text-white/25">
                <Info className="w-3.5 h-3.5" />
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
