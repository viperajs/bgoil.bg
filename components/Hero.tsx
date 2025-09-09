import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { companyInfo } from "@/lib/config"
import { Fuel, Hotel, Phone } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/modern-fuel-station-with-blue-and-red-branding.jpg"
          alt="BG OIL Враца бензиностанция"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-balance">{companyInfo.name}</h1>
            <p className="text-xl md:text-2xl font-medium text-balance">{companyInfo.slogan}</p>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto text-pretty">
              {companyInfo.description}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href="/products" className="flex items-center space-x-2">
                <Fuel className="w-5 h-5" />
                <span>Горива</span>
              </Link>
            </Button>

            <Button size="lg" variant="secondary" asChild className="w-full sm:w-auto">
              <Link href="/hotel" className="flex items-center space-x-2">
                <Hotel className="w-5 h-5" />
                <span>Хотел</span>
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              asChild
              className="w-full sm:w-auto bg-white border-white text-black hover:bg-white/90 hover:text-black"
            >
              <Link href="/contact" className="flex items-center space-x-2">
                <Phone className="w-5 h-5" />
                <span>Контакти</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
