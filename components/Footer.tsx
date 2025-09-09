import Link from "next/link"
import { companyInfo, contacts } from "@/lib/config"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">BG</span>
              </div>
              <span className="font-bold text-lg text-card-foreground">{companyInfo.name}</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">{companyInfo.description}</p>
            <p className="text-sm font-medium text-card-foreground">{companyInfo.slogan}</p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-card-foreground">Контакти</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{contacts.address}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href={`tel:${contacts.phoneMain}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {contacts.phoneMain}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href={`mailto:${contacts.email}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {contacts.email}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{contacts.workingHours}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-card-foreground">Бързи връзки</h3>
            <div className="space-y-2">
              <Link
                href="/products"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Цени на горива
              </Link>
              <Link href="/hotel" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Хотелски резервации
              </Link>
              <Link href="/about" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Нашите услуги
              </Link>
              <Link
                href="/contact"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Как да ни намерите
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">© 2024 {companyInfo.name}. Всички права запазени.</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Политика за поверителност
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Условия за ползване
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
