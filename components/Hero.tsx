import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { companyInfo } from "@/lib/config"
import { Fuel, Hotel, Phone, ArrowRight, Sparkles } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/modern-fuel-station-with-blue-and-red-branding.jpg"
          alt="BG OIL Враца бензиностанция"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Gradient Overlay - по-силен за по-добра четливост */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/75 to-secondary/85"></div>
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Subtle animated particles */}
        <div className="absolute inset-0 particle-bg opacity-20"></div>
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
                BG OIL
              </span>
              <span className="block text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                ВРАЦА
              </span>
            </h1>
            
            <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] mb-4">
              {companyInfo.slogan}
            </p>
            
            <p className="text-lg md:text-xl lg:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] px-4">
              {companyInfo.description}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
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
              variant="secondary" 
              asChild 
              className="w-full sm:w-auto bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 text-lg px-8 py-7 hover-lift shadow-xl transition-all duration-300 group font-bold"
            >
              <Link href="/hotel" className="flex items-center space-x-3">
                <Hotel className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                <span>Хотел</span>
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

          {/* Stats - по-видими */}
          <div className="grid grid-cols-3 gap-6 mt-20 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="glass rounded-2xl p-6 border-2 border-white/30 hover-lift shadow-xl">
              <div className="text-4xl md:text-5xl font-black text-white mb-2 drop-shadow-lg">24/7</div>
              <div className="text-sm font-semibold text-white/90">Работно време</div>
            </div>
            <div className="glass rounded-2xl p-6 border-2 border-white/30 hover-lift shadow-xl">
              <div className="text-4xl md:text-5xl font-black text-white mb-2 drop-shadow-lg">100%</div>
              <div className="text-sm font-semibold text-white/90">Качество</div>
            </div>
            <div className="glass rounded-2xl p-6 border-2 border-white/30 hover-lift shadow-xl">
              <div className="text-4xl md:text-5xl font-black text-white mb-2 drop-shadow-lg">15+</div>
              <div className="text-sm font-semibold text-white/90">Години опит</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <div className="flex flex-col items-center space-y-2">
          <span className="text-white/90 text-sm font-semibold drop-shadow-lg">Превърти надолу</span>
          <div className="w-6 h-10 border-2 border-white/70 rounded-full flex justify-center p-2 bg-white/10">
            <div className="w-1.5 h-3 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  )
}