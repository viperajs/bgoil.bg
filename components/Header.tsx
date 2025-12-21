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
        className={`hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-[#050910]/98 backdrop-blur-xl shadow-2xl"
            : "bg-[#04060f]/60 backdrop-blur-md"
        }`}
        style={{
          borderBottom: isScrolled 
            ? '1px solid transparent'
            : '1px solid transparent',
          backgroundImage: isScrolled
            ? 'linear-gradient(to bottom, rgba(255, 59, 59, 0.15), transparent), linear-gradient(to bottom, rgba(255, 59, 59, 0.05), transparent)'
            : 'linear-gradient(to bottom, rgba(255, 255, 255, 0.03), transparent)',
          backgroundClip: 'padding-box, border-box',
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center h-20 gap-6 relative z-10">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center group transition-all duration-300 hover:scale-105 relative z-20 min-w-[140px]"
            >
              <div className="relative isolate">
                <div className="bg-white p-1 rounded">
                  <Image
                    src="/bg-oil-logo.webp"
                    alt="BG OIL"
                    width={140}
                    height={50}
                    className="h-12 w-auto transition-all duration-300 relative z-10 block"
                    priority
                    unoptimized
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl z-0 pointer-events-none"></div>
              </div>
            </Link>

            {/* Desktop Navigation & CTA cluster */}
            <div className="flex-1 flex justify-end">
              <div 
                className="flex items-center gap-2 px-2 py-1.5 rounded-full bg-white/5 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
                style={{
                  border: '1px solid transparent',
                  backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05)), linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent)',
                  backgroundClip: 'padding-box, border-box',
                }}
              >
                <nav 
                  className="flex items-center gap-1.5 pr-2"
                  style={{
                    borderRight: '1px solid transparent',
                    backgroundImage: 'linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.1), transparent)',
                    backgroundClip: 'padding-box',
                  }}
                >
                  {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`relative px-4 py-2 text-sm font-semibold tracking-wide rounded-full transition-all duration-300 ${
                          isActive
                            ? "text-white bg-gradient-to-r from-[#ff3b3b] to-[#ff6a2c] shadow-lg shadow-[#ff3b3b]/40"
                            : "text-white/80 hover:text-white hover:bg-white/10"
                        }`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {item.name}
                        {isActive && (
                          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>
                        )}
                      </Link>
                    )
                  })}
                </nav>

                {/* CTA Buttons */}
                <div className="flex items-center gap-1.5 pl-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild
                    className="hover-lift border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 rounded-full"
                  >
                    <a href={`tel:${contacts.phoneMain}`} className="flex items-center space-x-2 px-4 py-2">
                      <Phone className="w-4 h-4" />
                      <span>Обади се</span>
                    </a>
                  </Button>
                  <Button 
                    size="sm" 
                    asChild
                    className="bg-gradient-to-r from-[#ff6a2c] via-[#ff3b3b] to-[#ff3b3b] hover:from-[#ff7a3c] hover:via-[#ff4b4b] hover:to-[#ff4b4b] text-white border-0 hover-lift shadow-lg shadow-[#ff3b3b]/30 hover:shadow-[#ff3b3b]/50 transition-all duration-300 rounded-full"
                  >
                    <a
                      href={contacts.mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-4 py-2"
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
            ? "bg-[#050910]/95 backdrop-blur-xl shadow-2xl"
            : "bg-[#04060f]/85 backdrop-blur-lg"
        }`}
        style={{
          borderBottom: '1px solid transparent',
          backgroundImage: isScrolled
            ? 'linear-gradient(to bottom, rgba(255, 59, 59, 0.2), transparent), linear-gradient(to bottom, rgba(255, 59, 59, 0.1), transparent)'
            : 'linear-gradient(to bottom, rgba(255, 255, 255, 0.05), transparent)',
          backgroundClip: 'padding-box, border-box',
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 relative z-10">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center group relative z-20 min-w-[120px]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="relative isolate">
                <div className="bg-white p-1 rounded">
                  <Image
                    src="/bg-oil-logo.webp"
                    alt="BG OIL"
                    width={120}
                    height={40}
                    className="h-10 w-auto relative z-10 block"
                    priority
                    unoptimized
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl z-0 pointer-events-none"></div>
              </div>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="p-2.5 rounded-lg transition-all duration-300 text-white/80 hover:text-white hover:bg-white/10 hover:scale-110 active:scale-95"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 transition-transform duration-300 rotate-90" />
              ) : (
                <Menu className="w-6 h-6 transition-transform duration-300" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <nav 
              className="py-4 space-y-2"
              style={{
                borderTop: '1px solid transparent',
                backgroundImage: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent)',
                backgroundClip: 'padding-box',
              }}
            >
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-4 py-3 mx-2 rounded-lg transition-all duration-200 font-semibold ${
                      isActive
                        ? "text-white bg-gradient-to-r from-[#ff3b3b] to-[#ff6a2c] shadow-lg shadow-[#ff3b3b]/40"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.name}
                  </Link>
                )
              })}
              <div 
                className="flex flex-col gap-2 pt-2 px-2"
                style={{
                  borderTop: '1px solid transparent',
                  backgroundImage: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent)',
                  backgroundClip: 'padding-box',
                }}
              >
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild
                  className="hover-lift border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 rounded-lg"
                >
                  <a href={`tel:${contacts.phoneMain}`} className="flex items-center justify-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>Обади се</span>
                  </a>
                </Button>
                <Button 
                  size="sm" 
                  asChild
                  className="bg-gradient-to-r from-[#ff6a2c] via-[#ff3b3b] to-[#ff3b3b] hover:from-[#ff7a3c] hover:via-[#ff4b4b] hover:to-[#ff4b4b] text-white border-0 hover-lift shadow-lg shadow-[#ff3b3b]/30 hover:shadow-[#ff3b3b]/50 transition-all duration-300 rounded-lg"
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