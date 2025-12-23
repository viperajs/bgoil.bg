import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { companyInfo } from "@/lib/config"
import { Fuel, Phone, ArrowRight, Sparkles } from "lucide-react"
import ChristmasLightsTitle from "@/components/ChristmasLightsTitle"
import PromoCard from "@/components/PromoCard"
import { getActiveDiscountBannerMessage } from "@/lib/discountBannerStore"
import StatsCounter from "@/components/StatsCounter"

export default async function Hero() {
  const discountBannerMessage = await getActiveDiscountBannerMessage()
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-[#03060f]">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/modern-fuel-station-with-blue-and-red-branding.jpg"
          alt="BG OIL бензиностанция"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Gradient Overlay - показва снимката, но оставя нощно усещане */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#03060f] via-[#050a18]/70 to-transparent mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/35 via-transparent to-secondary/40 mix-blend-screen"></div>
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-[#020309]/65"></div>
        
        {/* Subtle animated particles */}
        <div className="absolute inset-0 particle-bg opacity-10"></div>
        {/* Soft fade into body background */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent via-[#04060f]/80 to-[#04060f]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white/20 rounded-full border border-white/30 mb-6 animate-fade-in-down shadow-lg">
            <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
            <span className="text-sm font-semibold text-white">24/7 Обслужване</span>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-balance leading-tight">
              <span className="block text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] mb-3">
                {/* 
                  Christmas Lights Decoration
                  To enable/disable: Set enabled prop to true/false
                  To adjust glow: Use glowIntensity prop ('subtle' | 'medium' | 'strong')
                  To adjust animation speed: Use animationSpeed prop ('slow' | 'normal' | 'fast')
                */}
                <ChristmasLightsTitle enabled={true} glowIntensity="medium" animationSpeed="normal">
                  BG OIL
                </ChristmasLightsTitle>
              </span>
            </h1>
            
            {/* Christmas Greeting */}
            <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500/20 via-yellow-400/20 to-red-500/20 rounded-full border border-yellow-300/40 backdrop-blur-sm animate-fade-in-down shadow-lg" style={{ animationDelay: "0.1s" }}>
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
              <span className="text-lg md:text-xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                Весели Празници
              </span>
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" style={{ animationDelay: "0.5s" }} />
            </div>
            
            <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] mb-4">
              {companyInfo.slogan}
            </p>
            
            <p className="text-lg md:text-xl lg:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] px-4">
              {companyInfo.description}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-10 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <Button 
              size="lg" 
              asChild 
              className="w-full sm:w-auto bg-gradient-primary hover:opacity-90 text-white border-0 text-lg px-8 py-7 hover-lift shadow-2xl hover:shadow-primary/50 transition-all duration-300 group font-bold"
            >
              <Link href="/products" className="flex items-center space-x-3">
                <Fuel className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                <span>Горива</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>

            

            <Button
              size="lg"
              variant="outline"
              asChild
              className="w-full sm:w-auto bg-white border-2 border-white text-primary hover:bg-white/95 hover:text-primary-dark text-lg px-8 py-7 hover-lift shadow-xl transition-all duration-300 group font-bold"
            >
              <Link href="/contact" className="flex items-center space-x-3">
                <Phone className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                <span>Контакти</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
          </div>

          {/* Promo Card - Hero Section */}
          <div className="animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
            <PromoCard />
          </div>

          {/* Discount Banner */}
          {discountBannerMessage && (
            <div className="mt-8 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <div className="inline-flex items-center space-x-3 px-6 py-4 bg-gradient-to-r from-green-500/20 via-green-400/20 to-green-500/20 rounded-2xl border-2 border-green-400/40 backdrop-blur-md shadow-2xl shadow-green-500/20 hover-lift transition-all duration-300">
                <Sparkles className="w-5 h-5 text-green-300 animate-pulse" />
                <span className="text-lg md:text-xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  {discountBannerMessage}
                </span>
                <Sparkles className="w-5 h-5 text-green-300 animate-pulse" style={{ animationDelay: "0.5s" }} />
              </div>
            </div>
          )}

          {/* Stats - по-видими */}
          <StatsCounter
            items={[
              { value: 24, suffix: '/7', label: 'Работно време', isStatic: true, staticText: '24/7' },
              { value: 100, suffix: '%', label: 'Качество' },
              { value: 21, suffix: '+', label: 'Години опит' },
            ]}
          />
        </div>
      </div>

      
    </section>
  )
}