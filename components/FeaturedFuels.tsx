// components/FeaturedFuels.tsx
export const revalidate = 0

import Link from "next/link"
import { Button } from "@/components/ui/button"
import FuelCard from "./FuelCard"
import { ArrowRight, Fuel, Sparkles } from "lucide-react"
import PromoCard from "@/components/PromoCard"

import { getEffectiveFuels } from "@/lib/fuelStore"
import { getActiveDiscountBannerMessage } from "@/lib/discountBannerStore"

export default async function FeaturedFuels() {
  const allFuels = await getEffectiveFuels()
  const featuredFuels = allFuels.slice(0, 3)
  const discountBannerMessage = await getActiveDiscountBannerMessage()

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Fuel className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary">Актуални цени</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6">
            <span className="text-gradient-primary">Цени на горива</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Качествени горива на конкурентни цени с допълнителни отстъпки за картови клиенти
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredFuels.map((fuel, index) => (
            <div 
              key={index} 
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <FuelCard fuel={fuel} />
            </div>
          ))}
        </div>

        {/* Promo Card - Featured Fuels Section */}
        <div className="max-w-2xl mx-auto mb-12 animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
          <PromoCard />
        </div>

        <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Button 
            asChild 
            size="lg"
            className="bg-gradient-primary hover:opacity-90 text-white border-0 text-lg px-8 py-6 hover-lift shadow-xl hover:shadow-2xl transition-all duration-300 group"
          >
            <Link href="/products" className="flex items-center space-x-3">
              <span>Виж всички цени</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </Button>
        </div>

        {/* Store Discount Banner */}
        {discountBannerMessage && (
          <div className="mt-8 p-6 bg-gradient-to-r from-green-500/15 via-green-400/15 to-green-500/15 border-2 border-green-400/30 rounded-2xl animate-fade-in-up shadow-lg" style={{ animationDelay: '0.45s' }}>
            <div className="flex items-center justify-center space-x-3">
              <Sparkles className="w-6 h-6 text-green-600 dark:text-green-400" />
              <p className="text-base md:text-lg font-bold text-foreground text-center">
                {discountBannerMessage}
              </p>
              <Sparkles className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        )}

        <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 border-2 border-primary/20 rounded-2xl animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center justify-center space-x-3">
            <Sparkles className="w-6 h-6 text-primary" />
            <p className="text-sm font-bold text-foreground text-center">
              ⚠️ Цените са ориентировъчни. Моля, потвърдете актуалните цени на място.
            </p>
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>
    </section>
  )
}