"use client"

import Link from "next/link"
import { useState } from "react"
import { contacts } from "@/lib/config"
import { Button } from "@/components/ui/button"
import { Menu, X, Phone, MapPin } from "lucide-react"
import Image from "next/image"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: "Начало", href: "/" },
    { name: "За нас", href: "/about" },
    { name: "Продукти", href: "/products" },
    { name: "Хотел", href: "/hotel" },
    { name: "Контакти", href: "/contact" },
  ]

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BG%20OIL-OjX1ISOYZyh3zOlTd5DSuVyk2Y1c3B.webp"
              alt="BG OIL Logo"
              width={120}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="outline" size="sm" asChild>
              <a href={`tel:${contacts.phoneMain}`} className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>Обади се</span>
              </a>
            </Button>
            <Button size="sm" asChild>
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
            className="md:hidden p-2 text-foreground hover:text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-foreground hover:text-primary transition-colors font-medium px-2 py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                <Button variant="outline" size="sm" asChild>
                  <a href={`tel:${contacts.phoneMain}`} className="flex items-center justify-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>Обади се</span>
                  </a>
                </Button>
                <Button size="sm" asChild>
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
        )}
      </div>
    </header>
  )
}
