export const revalidate = 0

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
    <section className="relative py-32 bg-[#0a0a0f]">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]"></div>
      </div>

      <div className="container relative mx-auto px-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
            <Fuel className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-white/50">Актуални цени</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Горива</span> & Цени
          </h2>
          <p className="text-lg text-white/40 max-w-2xl mx-auto leading-relaxed">
            Най-високо качество горива на конкурентни цени.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {featuredFuels.map((fuel, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <FuelCard fuel={fuel} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Button
            asChild
            size="lg"
            className="rounded-full bg-white text-black font-bold hover:bg-white/90 px-10 py-7 text-lg hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            <Link href="/products" className="flex items-center space-x-3">
              <span>Виж всички</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </motion.div>

        {/* Messages */}
        <div className="mt-12 max-w-2xl mx-auto space-y-4">
          {discountMessage && (
            <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/5 backdrop-blur-sm text-center">
              <p className="text-green-400 font-medium flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" /> {discountMessage}
              </p>
            </div>
          )}

          <p className="text-xs text-center text-white/20 uppercase tracking-widest">
            * Цените са ориентировъчни и подлежат на промяна
          </p>
        </div>

      </div>
    </section>
  )
}