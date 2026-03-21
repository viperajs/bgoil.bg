export const revalidate = 60

import Link from "next/link"
import { Button } from "@/components/ui/button"
import FuelCard from "./FuelCard"
import { ArrowRight, Fuel, Sparkles } from "lucide-react"
import * as motion from "motion/react-client"

import { getEffectiveFuels } from "@/lib/fuelStore"
import { getActiveDiscountBannerMessage } from "@/lib/discountBannerStore"

export default async function FeaturedFuels() {
  const allFuels = await getEffectiveFuels()
  const featuredFuels = allFuels.slice(0, 3)
  const discountMessage = await getActiveDiscountBannerMessage()

  return (
    <section className="relative py-32">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/[0.04] rounded-full blur-[150px]"></div>
      </div>

      <div className="container relative mx-auto px-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.10] mb-8 backdrop-blur-xl">
            <Fuel className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/65">Актуални цени</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            <span className="text-gradient-primary">Горива</span> & Цени
          </h2>
          <p className="text-base md:text-lg text-white/55 max-w-2xl mx-auto leading-relaxed">
            Най-високо качество горива на конкурентни цени.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {featuredFuels.map((fuel, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <FuelCard fuel={fuel} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <Button
            asChild
            size="lg"
            className="rounded-full font-bold px-10 py-7 text-lg hover:scale-105 transition-all duration-300 neon-glow shimmer-btn cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: '#fff', border: 'none' }}
          >
            <Link href="/products" className="flex items-center space-x-3">
              <span>Виж всички цени</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </motion.div>

        {/* Messages */}
        <div className="mt-12 max-w-2xl mx-auto space-y-4 flex flex-col items-center">
          {discountMessage && (
            <div className="p-4 rounded-2xl border border-green-500/15 bg-green-500/[0.04] backdrop-blur-sm text-center w-full">
              <p className="text-green-400 font-medium flex items-center justify-center gap-2 text-sm">
                <Sparkles className="w-4 h-4" /> {discountMessage}
              </p>
            </div>
          )}

          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/[0.08] border border-amber-500/20">
            <span className="text-amber-400 text-sm font-semibold">*</span>
            <p className="text-sm text-amber-300/80 font-medium">
              Цените са ориентировъчни и подлежат на промяна
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
