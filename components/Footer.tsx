import Link from "next/link"
import { companyInfo, contacts } from "@/lib/config"
import { Phone, Mail, MapPin, Clock, Facebook, ArrowRight } from "lucide-react"

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-[#0a0a0f] via-[#111827] to-[#0a0a0f] text-white overflow-hidden">
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-5">
            <div className="flex items-center space-x-3">
              <span className="font-black text-2xl text-white">{companyInfo.name}</span>
            </div>
            <p className="text-white/95 leading-relaxed text-sm font-medium">
              {companyInfo.description}
            </p>
            <p className="text-primary font-bold text-base">{companyInfo.slogan}</p>

            {/* Social Media */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://www.facebook.com/share/1ZaL36Ykbk/?mibextid=wwXIfr"
                className="w-11 h-11 rounded-xl bg-white/15 hover:bg-primary flex items-center justify-center transition-all duration-300 hover-lift hover:shadow-lg"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>

            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-5">
            <h3 className="font-bold text-xl text-white mb-2">Контакти</h3>
            <div className="space-y-4">
              <a
                href={contacts.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start space-x-3 group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/30 flex items-center justify-center group-hover:bg-primary transition-colors duration-300 flex-shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="text-white/95 text-sm leading-relaxed pt-1.5 font-medium hover:text-white transition-colors duration-300">{contacts.address}</span>
              </a>
              <div className="flex items-center space-x-3 group">
                <div className="w-10 h-10 rounded-lg bg-primary/30 flex items-center justify-center group-hover:bg-primary transition-colors duration-300 flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <a
                  href={`tel:${contacts.phoneMain}`}
                  className="text-white/95 hover:text-white transition-colors duration-300 font-semibold text-base"
                >
                  {contacts.phoneMain}
                </a>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="w-10 h-10 rounded-lg bg-primary/30 flex items-center justify-center group-hover:bg-primary transition-colors duration-300 flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <a
                  href={`mailto:${contacts.email}`}
                  className="text-white/95 hover:text-white transition-colors duration-300 font-semibold text-base"
                >
                  {contacts.email}
                </a>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="w-10 h-10 rounded-lg bg-primary/30 flex items-center justify-center group-hover:bg-primary transition-colors duration-300 flex-shrink-0">
                  <Clock className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="text-white/95 text-sm font-semibold">{contacts.workingHours}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h3 className="font-bold text-xl text-white mb-2">Бързи връзки</h3>
            <div className="space-y-3">
              {[
                { name: "Цени на горива", href: "/products" },
                { name: "Новини за горивата", href: "/news" },
                { name: "Нашите услуги", href: "/about" },
                { name: "Как да ни намерите", href: "/contact" },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center space-x-2 text-white/95 hover:text-white transition-all duration-300 group font-semibold"
                >
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                  <span className="group-hover:translate-x-2 transition-transform duration-300">{link.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Customer Benefits */}
          <div className="space-y-5">
            <h3 className="font-bold text-xl text-white mb-2">За клиенти</h3>
            <p className="text-white/95 text-sm leading-relaxed font-medium">
              Предимства и удобства на едно място
            </p>
            <div className="p-4 rounded-xl bg-gradient-primary/25 shadow-lg">
              <p className="text-white font-bold text-sm mb-2">24/7 Обслужване</p>
              <p className="text-white/95 text-xs leading-relaxed">
                Винаги на ваше разположение за вашия комфорт
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/10">
              <p className="text-white font-bold text-sm mb-2">Безплатен паркинг</p>
              <p className="text-white/95 text-xs leading-relaxed">
                Удобно паркиране за всички клиенти
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/90 text-sm text-center md:text-left font-semibold">
              © {new Date().getFullYear()} {companyInfo.name}. Всички права запазени.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <Link href="/about" className="text-white/90 hover:text-white transition-colors duration-300 font-semibold">
                За нас
              </Link>
              <Link href="/contact" className="text-white/90 hover:text-white transition-colors duration-300 font-semibold">
                Контакти
              </Link>
              <Link href="/products" className="text-white/90 hover:text-white transition-colors duration-300 font-semibold">
                Горива
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}