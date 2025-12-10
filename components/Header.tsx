"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { contacts } from "@/lib/config"
import { Button } from "@/components/ui/button"
import { Phone, MapPin, Menu, X } from "lucide-react"
import Image from "next/image"
import { usePathname } from "next/navigation"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navigation = [
    { name: "Начало", href: "/" },
    { name: "За нас", href: "/about" },
    { name: "Продукти", href: "/products" },
    { name: "Новини", href: "/news-feed" },
    { name: "Контакти", href: "/contact" },
  ]

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Desktop Navigation */}
      <header
        className={`hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#050910]/95 backdrop-blur-xl shadow-2xl border-b border-primary/40"
            : "bg-[#04060f]/80 backdrop-blur-lg border-b border-white/10"
        }`}
      >
        {/* Christmas Header Accents - Lights and Stars */}
        <div className="absolute top-0 left-0 right-0 h-full pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute top-2 left-[5%] christmas-light text-red-500/60" style={{ fontSize: "8px" }}>●</div>
          <div className="absolute top-2 left-[15%] christmas-light text-green-500/60" style={{ animationDelay: "0.3s", fontSize: "8px" }}>●</div>
          <div className="absolute top-2 left-[25%] christmas-light text-red-500/60" style={{ animationDelay: "0.6s", fontSize: "8px" }}>●</div>
          <div className="absolute top-2 left-[35%] christmas-light text-yellow-500/60" style={{ animationDelay: "0.2s", fontSize: "8px" }}>●</div>
          <div className="absolute top-2 left-[45%] christmas-light text-red-500/60" style={{ animationDelay: "0.5s", fontSize: "8px" }}>●</div>
          <div className="absolute top-2 left-[55%] christmas-light text-green-500/60" style={{ animationDelay: "0.4s", fontSize: "8px" }}>●</div>
          <div className="absolute top-2 left-[65%] christmas-light text-yellow-500/60" style={{ animationDelay: "0.7s", fontSize: "8px" }}>●</div>
          <div className="absolute top-2 left-[75%] christmas-light text-red-500/60" style={{ animationDelay: "0.1s", fontSize: "8px" }}>●</div>
          <div className="absolute top-2 left-[85%] christmas-light text-green-500/60" style={{ animationDelay: "0.8s", fontSize: "8px" }}>●</div>
          <div className="absolute top-2 left-[95%] christmas-light text-yellow-500/60" style={{ animationDelay: "0.5s", fontSize: "8px" }}>●</div>
          
          {/* Small stars */}
          <div className="absolute top-4 right-[8%] christmas-star text-yellow-300/40" style={{ fontSize: "10px" }}>✦</div>
          <div className="absolute top-4 right-[12%] christmas-star text-yellow-300/30" style={{ animationDelay: "1s", fontSize: "8px" }}>✦</div>
        </div>
        
        <div className="container mx-auto px-4">
          <div className="flex items-center h-20 gap-6 relative z-10">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center group hover-scale transition-transform duration-300"
            >
              <Image
                src="/bg-oil-logo.webp"
                alt="BG OIL"
                width={140}
                height={50}
                className="h-12 w-auto transition-transform duration-300 group-hover:scale-110"
                priority
              />
            </Link>

            {/* Desktop Navigation & CTA cluster */}
            <div className="flex-1 flex justify-end">
              <div className="flex items-center gap-4 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.45)] flex-nowrap">
                <nav className="flex items-center gap-3 pr-4 border-r border-white/10">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`inline-flex flex-col items-center gap-2 px-4 py-1.5 text-sm font-semibold tracking-wide transition-all duration-300 rounded-lg ${
                          isActive
                            ? "text-white bg-primary/30 shadow-lg shadow-primary/25 ring-1 ring-primary/40"
                            : "text-white/70 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <span>{item.name}</span>
                        {isActive && (
                          <span className="block w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_12px_rgba(255,59,59,0.8)]"></span>
                        )}
                      </Link>
                    )
                  })}
                </nav>

                {/* CTA Buttons */}
                <div className="flex items-center gap-2 pl-4 ml-2 border-l border-white/10">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild
                    className="hover-lift border border-white/30 bg-white/5 text-white hover:border-primary/60 hover:bg-white/10 transition-all duration-300 backdrop-blur flex-shrink-0"
                  >
                    <a href={`tel:${contacts.phoneMain}`} className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>Обади се</span>
                    </a>
                  </Button>
                  <Button 
                    size="sm" 
                    asChild
                    className="bg-gradient-primary hover:opacity-90 text-white border-0 hover-lift shadow-lg hover:shadow-xl transition-all duration-300 flex-shrink-0"
                  >
                    <a
                      href={contacts.mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Навигация</span>
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <header
        className={`lg:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#050910]/95 backdrop-blur-xl shadow-2xl border-b border-primary/40"
            : "bg-[#04060f]/85 backdrop-blur-lg border-b border-white/10"
        }`}
      >
        {/* Christmas Mobile Header Accents */}
        <div className="absolute top-0 left-0 right-0 h-full pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute top-1 left-[10%] christmas-light text-red-500/50" style={{ fontSize: "6px" }}>●</div>
          <div className="absolute top-1 left-[30%] christmas-light text-green-500/50" style={{ animationDelay: "0.3s", fontSize: "6px" }}>●</div>
          <div className="absolute top-1 left-[50%] christmas-light text-yellow-500/50" style={{ animationDelay: "0.6s", fontSize: "6px" }}>●</div>
          <div className="absolute top-1 left-[70%] christmas-light text-red-500/50" style={{ animationDelay: "0.2s", fontSize: "6px" }}>●</div>
          <div className="absolute top-1 left-[90%] christmas-light text-green-500/50" style={{ animationDelay: "0.5s", fontSize: "6px" }}>●</div>
        </div>
        
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 relative z-10">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Image
                src="/bg-oil-logo.webp"
                alt="BG OIL"
                width={120}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="p-2 transition-colors rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <nav className="py-4 space-y-2 border-t border-white/10">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-4 py-3 rounded-lg transition-all duration-200 font-semibold ${
                      isActive
                        ? "text-white bg-primary/30 shadow-lg shadow-primary/25"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              })}
              <div className="flex flex-col space-y-2 pt-4 border-t border-white/10">
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild
                  className="mx-4 hover-lift border border-white/30 bg-white/5 text-white hover:border-primary/60 hover:bg-white/10"
                >
                  <a href={`tel:${contacts.phoneMain}`} className="flex items-center justify-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>Обади се</span>
                  </a>
                </Button>
                <Button 
                  size="sm" 
                  asChild
                  className="mx-4 bg-gradient-primary text-white border-0 hover-lift shadow-lg shadow-primary/50"
                >
                  <a
                    href={contacts.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Навигация</span>
                  </a>
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </header>
    </>
  )
}