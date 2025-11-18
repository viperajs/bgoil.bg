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
      <header className={`hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white shadow-lg border-b border-gray-200" 
          : "bg-gradient-to-r from-pink-50 via-pink-100 to-pink-50 border-b border-pink-200"
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center group hover-scale transition-transform duration-300"
            >
              <Image
                src="/bg-oil-logo.webp"
                alt="BG OIL Logo"
                width={140}
                height={50}
                className="h-12 w-auto transition-transform duration-300 group-hover:scale-110"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="flex items-center space-x-1">
              {navigation.map((item, index) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative px-4 py-2 font-medium transition-all duration-300 rounded-lg ${
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-gray-700 hover:text-primary hover:bg-gray-100"
                    }`}
                  >
                    <span className="relative z-10">{item.name}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm" 
                asChild
                className="hover-lift border-2 border-gray-300 bg-white hover:border-primary text-gray-700 transition-all duration-300"
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
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <header className={`lg:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white shadow-lg border-b border-gray-200" 
          : "bg-white border-b border-gray-200"
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Image
                src="/bg-oil-logo.webp"
                alt="BG OIL Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="p-2 transition-colors rounded-lg text-gray-700 hover:text-primary hover:bg-gray-100"
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
            <nav className="py-4 space-y-2 border-t border-gray-200">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-gray-700 hover:text-primary hover:bg-gray-100"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              })}
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
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
    </>
  )
}