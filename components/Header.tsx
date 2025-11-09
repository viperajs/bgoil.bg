"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { contacts } from "@/lib/config"
import { Button } from "@/components/ui/button"
import { Menu, X, Phone, MapPin, ChevronDown } from "lucide-react"
import Image from "next/image"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

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
    { name: "Хотел", href: "/hotel" },
    { name: "Контакти", href: "/contact" },
  ]

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-background/95 backdrop-blur-md shadow-lg border-b border-border/50" 
          : "bg-white/10 backdrop-blur-md border-b border-white/20"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 group hover-scale transition-transform duration-300"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BG%20OIL-OjX1ISOYZyh3zOlTd5DSuVyk2Y1c3B.webp"
                alt="BG OIL Logo"
                width={140}
                height={50}
                className="h-12 w-auto relative z-10 transition-transform duration-300 group-hover:scale-110"
                priority
              />
            </div>
            <span className={`hidden sm:block text-xl font-bold ${
              isScrolled 
                ? "text-gradient-primary" 
                : "text-white drop-shadow-lg"
            }`}>
              BG OIL
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative px-4 py-2 font-medium transition-all duration-300 link-underline group ${
                  isScrolled 
                    ? "text-foreground hover:text-primary" 
                    : "text-white hover:text-yellow-300 drop-shadow-lg"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="relative z-10">{item.name}</span>
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                  isScrolled ? "bg-gradient-primary" : "bg-yellow-300"
                }`}></span>
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className={`hover-lift border-2 transition-all duration-300 ${
                isScrolled 
                  ? "hover:border-primary border-border" 
                  : "border-white/30 hover:border-white/50 bg-white/10 text-white backdrop-blur-sm"
              }`}
            >
              <a href={`tel:${contacts.phoneMain}`} className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>Обади се</span>
              </a>
            </Button>
            <Button 
              size="sm" 
              asChild
              className="bg-gradient-primary hover:opacity-90 text-white border-0 hover-lift shadow-lg hover:shadow-xl transition-all duration-300"
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

          {/* Mobile menu button */}
          <button
            className={`lg:hidden p-2 transition-colors rounded-lg backdrop-blur-sm ${
              isScrolled 
                ? "text-foreground hover:text-primary hover:bg-muted" 
                : "text-white hover:text-yellow-300 hover:bg-white/20 border border-white/20"
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="py-4 space-y-2 border-t border-border/50">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-3 text-foreground hover:text-primary hover:bg-muted rounded-lg transition-all duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col space-y-2 pt-4 border-t border-border/50">
              <Button 
                variant="outline" 
                size="sm" 
                asChild
                className="mx-4 hover-lift"
              >
                <a href={`tel:${contacts.phoneMain}`} className="flex items-center justify-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>Обади се</span>
                </a>
              </Button>
              <Button 
                size="sm" 
                asChild
                className="mx-4 bg-gradient-primary text-white border-0 hover-lift"
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
  )
}