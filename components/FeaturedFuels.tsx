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
    <section className="relative py-32 overflow-hidden">
      <div className="container relative mx-auto px-4 z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 border border-border bg-card/60 backdrop-blur-xl">
            <Fuel className="w-3.5 h-3.5 text-brand-500" />
            <span className="text-caption uppercase text-muted-foreground">Актуални цени</span>
          </div>

          <h2 className="text-h1 text-foreground mb-6">
            Горива &amp; Цени
          </h2>
          <p className="text-body text-muted-foreground max-w-xl mx-auto">
            Най-високо качество горива на конкурентни цени.
          </p>
        </motion.div>

        {/* Fuel cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {featuredFuels.map((fuel, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <FuelCard fuel={fuel} />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center"
        >
          <Button asChild size="lg" className="rounded-full px-10">
            <Link href="/products">
              <span>Виж всички цени</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </motion.div>

        {/* Messages */}
        <div className="mt-12 max-w-2xl mx-auto space-y-4 flex flex-col items-center">
          {discountMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="p-4 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.06] text-center w-full"
            >
              <p className="text-emerald-400 font-medium flex items-center justify-center gap-2 text-sm">
                <Sparkles className="w-4 h-4" /> {discountMessage}
              </p>
            </motion.div>
          )}

          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-amber-500/[0.08] border border-amber-500/20">
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
