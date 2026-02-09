import type { Metadata } from "next"
import { companyInfo } from "@/lib/config"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import FuelCard from "@/components/FuelCard"
import { Fuel as FuelIcon, CreditCard, Info, Sparkles, Check, ChevronRight } from "lucide-react"
import { getEffectiveFuels } from "@/lib/fuelStore"
import * as motion from "motion/react-client"

export const revalidate = 0;

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
      <main className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">

        {/* Hero */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          {/* Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>

          <div className="container relative z-10 px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md"
            >
              <FuelIcon className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/50">Ценова Листа</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-7xl font-black mb-6 tracking-tight"
            >
              Горива и <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Цени</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl text-white/50 max-w-2xl mx-auto font-light"
            >
              Винаги актуални цени за най-качествените горива във Враца.
            </motion.p>
          </div>
        </section>

        {/* Prices Grid */}
        <section className="pb-24">
          <div className="container px-4 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
              {fuels.map((fuel, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="h-full"
                >
                  <FuelCard fuel={fuel} />
                </motion.div>
              ))}
            </div>

            {/* Loyalty Card Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-[2.5rem] overflow-hidden glass-card border-none bg-gradient-to-br from-[#121212] to-[#0a0a0f] p-8 md:p-12 lg:p-16"
            >
              {/* Decorative Background */}
              <div className="absolute top-0 right-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3"></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                <div className="space-y-8">
                  <div>
                    <div className="inline-flex items-center gap-2 text-primary font-bold mb-4">
                      <CreditCard className="w-5 h-5" />
                      <span className="uppercase tracking-widest text-sm">BG OIL CLUB</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4">
                      Спестете с <br /> всяко зареждане
                    </h2>
                    <p className="text-lg text-white/50 max-w-md">
                      Присъединете се към нашата лоялна програма и се възползвайте от ексклузивни отстъпки и предимства.
                    </p>
                  </div>

                  <ul className="space-y-4">
                    {benefits.map((b, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 + (i * 0.1) }}
                        className="flex items-center gap-4 group"
                      >
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Check className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium text-white/80">{b}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-primary hover:text-white transition-all shadow-xl shadow-white/5"
                  >
                    Заявете карта на място
                  </motion.button>
                </div>

                <div className="flex justify-center lg:justify-end">
                  {/* Abstract Card Visualization */}
                  <motion.div
                    initial={{ rotate: 10, y: 50, opacity: 0 }}
                    whileInView={{ rotate: 3, y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    whileHover={{ rotate: 0, scale: 1.05 }}
                    className="relative w-80 h-52 lg:w-96 lg:h-60 rounded-3xl bg-gradient-to-br from-zinc-800 to-black border border-white/10 shadow-2xl transition-all duration-500"
                  >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                    <div className="absolute top-6 left-6">
                      <span className="font-black text-2xl tracking-tighter text-white">BG OIL</span>
                    </div>
                    <div className="absolute bottom-6 left-6">
                      <span className="font-mono text-white/50 tracking-widest">8823 **** **** 9281</span>
                    </div>
                    <div className="absolute bottom-6 right-6">
                      <CreditCard className="w-8 h-8 text-primary" />
                    </div>
                    {/* Chip */}
                    <div className="absolute top-1/2 left-6 -translate-y-1/2 w-10 h-8 rounded bg-gradient-to-r from-yellow-200 to-yellow-500 shadow-inner opacity-80"></div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Disclaimer */}
            <div className="mt-12 flex justify-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/5 text-sm text-white/40">
                <Info className="w-4 h-4" />
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
