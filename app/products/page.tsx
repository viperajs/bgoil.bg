import type { Metadata } from "next"
import { companyInfo } from "@/lib/config"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import FuelCard from "@/components/FuelCard"
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
      <main className="min-h-screen text-white overflow-x-hidden">

        {/* Page Hero */}
        <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full"
              style={{ background: "radial-gradient(ellipse, rgba(239,68,68,0.08), transparent 60%)", filter: "blur(100px)" }} />
            <div className="absolute inset-0 opacity-[0.012]"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
              }} />
          </div>

          <div className="container relative z-10 px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 backdrop-blur-xl"
              style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)" }}
            >
              <FuelIcon className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">Ценова Листа</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 tracking-tight"
            >
              Горива и <span className="text-gradient-primary">Цени</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg text-white/35 max-w-2xl mx-auto"
              style={{ fontFamily: "var(--font-sans)", textTransform: "none", letterSpacing: "0.01em" }}
            >
              Винаги актуални цени за най-качествените горива във Враца.
            </motion.p>

            {/* Decorative line */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex items-center justify-center gap-4 mt-8"
            >
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-red-500/30" />
              <FuelIcon className="w-4 h-4 text-red-500/30" />
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-red-500/30" />
            </motion.div>
          </div>
        </section>

        {/* Prices Grid */}
        <section className="pb-24 relative">
          <div className="container px-4 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center mb-10"
            >
              <h2 className="text-2xl font-black text-white mb-2">Актуални цени на горива</h2>
              <p className="text-white/30 text-sm"
                style={{ fontFamily: "var(--font-sans)", textTransform: "none" }}>
                Цени с и без BG OIL CLUB карта
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-20" style={{ perspective: "1000px" }}>
              {fuels.map((fuel, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50, rotateX: 14, scale: 0.93 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65, delay: index * 0.09, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformStyle: "preserve-3d" }}
                  className="h-full"
                >
                  <FuelCard fuel={fuel} />
                </motion.div>
              ))}
            </div>

            {/* Loyalty Card section */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85 }}
              className="relative rounded-3xl overflow-hidden glass-depth animated-gradient-border"
              style={{
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
              }}
            >
              {/* Background layers */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full"
                  style={{ background: "radial-gradient(circle, rgba(239,68,68,0.08), transparent 60%)", filter: "blur(80px)", transform: "translate(30%, -20%)" }} />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full"
                  style={{ background: "radial-gradient(circle, rgba(249,115,22,0.05), transparent)", filter: "blur(60px)", transform: "translate(-20%, 30%)" }} />
              </div>

              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(239,68,68,0.5), rgba(249,115,22,0.3), transparent)" }} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10 p-6 sm:p-8 md:p-12 lg:p-16">
                {/* Left: text */}
                <div className="space-y-8">
                  <div>
                    <div className="inline-flex items-center gap-2 text-primary font-bold mb-4">
                      <CreditCard className="w-4 h-4" />
                      <span className="uppercase tracking-[0.2em] text-xs" style={{ fontFamily: "var(--font-mono)" }}>BG OIL CLUB</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
                      Спестете с <br /> всяко зареждане
                    </h2>
                    <p className="text-base text-white/35 max-w-md"
                      style={{ fontFamily: "var(--font-sans)", textTransform: "none", letterSpacing: "0.01em" }}>
                      Присъединете се към нашата лоялна програма и се възползвайте от ексклузивни отстъпки и предимства.
                    </p>
                  </div>

                  <ul className="space-y-3">
                    {benefits.map((b, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -25 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 + i * 0.09 }}
                        className="flex items-center gap-3 group cursor-default"
                      >
                        <div className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                          <Check className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="text-sm text-white/50 group-hover:text-white/70 transition-colors"
                          style={{ fontFamily: "var(--font-sans)", textTransform: "none" }}>
                          {b}
                        </span>
                      </motion.li>
                    ))}
                  </ul>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-8 py-4 font-bold rounded-xl transition-all duration-300 neon-glow shimmer-btn cursor-pointer"
                    style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "#fff" }}
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Заявете карта на място
                    </span>
                  </motion.button>
                </div>

                {/* Right: 3D credit card */}
                <div className="flex justify-center lg:justify-end">
                  <motion.div
                    initial={{ rotate: 8, y: 50, opacity: 0, scale: 0.9 }}
                    whileInView={{ rotate: 3, y: 0, opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.2 }}
                    whileHover={{ rotate: 0, scale: 1.04, y: -6 }}
                    className="relative w-full max-w-[280px] h-44 sm:w-80 sm:h-52 lg:w-96 lg:h-60 rounded-3xl shadow-2xl cursor-pointer"
                    style={{
                      background: "linear-gradient(135deg, rgba(25,25,28,0.95), rgba(10,10,12,0.98))",
                      border: "1px solid rgba(255,255,255,0.1)",
                      boxShadow: "0 30px 80px rgba(0,0,0,0.7), 0 0 40px rgba(239,68,68,0.08), inset 0 1px 0 rgba(255,255,255,0.05)",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {/* Card inner glow */}
                    <div className="absolute inset-0 rounded-3xl"
                      style={{ background: "radial-gradient(ellipse at 70% 20%, rgba(239,68,68,0.1), transparent 55%)" }} />

                    {/* Holographic shimmer band */}
                    <div className="absolute inset-0 rounded-3xl overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 bottom-0 opacity-30 animate-marquee pointer-events-none"
                        style={{
                          background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)",
                          backgroundSize: "200% 100%",
                          animation: "shimmer 3s ease-in-out infinite",
                        }} />
                    </div>

                    <div className="absolute top-6 left-6">
                      <span className="font-black text-xl tracking-tighter text-white">BG OIL</span>
                      <div className="text-[9px] uppercase tracking-widest text-white/25 mt-0.5" style={{ fontFamily: "var(--font-mono)" }}>CLUB</div>
                    </div>

                    {/* Chip */}
                    <div className="absolute top-1/2 left-6 -translate-y-1/2 w-11 h-8 rounded-lg"
                      style={{ background: "linear-gradient(135deg, rgba(255,215,0,0.6), rgba(255,193,7,0.4))", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), 0 2px 8px rgba(0,0,0,0.3)" }}>
                      <div className="absolute inset-0 rounded-lg grid grid-cols-2 gap-0.5 p-1 opacity-50">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="rounded-sm" style={{ background: "rgba(180,140,0,0.4)" }} />
                        ))}
                      </div>
                    </div>

                    <div className="absolute bottom-6 left-6">
                      <span className="font-mono text-white/30 tracking-widest text-sm">8823 **** **** 9281</span>
                    </div>
                    <div className="absolute bottom-6 right-6">
                      <CreditCard className="w-7 h-7" style={{ color: "rgba(239,68,68,0.55)" }} />
                    </div>

                    {/* Bottom gradient fade */}
                    <div className="absolute bottom-0 left-0 right-0 h-1/3 rounded-b-3xl"
                      style={{ background: "linear-gradient(to top, rgba(239,68,68,0.06), transparent)" }} />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Disclaimer */}
            <div className="mt-10 flex justify-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl glass-depth text-xs text-white/25"
                style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
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
