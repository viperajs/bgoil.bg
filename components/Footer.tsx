import Link from "next/link"
import { companyInfo, contacts } from "@/lib/config"
import { Phone, Mail, MapPin, Clock, Facebook, ArrowRight } from "lucide-react"

export default function Footer() {
  return (
    <footer className="relative text-white overflow-hidden">
      {/* Gradient separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-5">
            <div className="flex items-center space-x-3">
              <span className="font-black text-2xl text-white tracking-tight">{companyInfo.name}</span>
            </div>
            <p className="text-white/40 leading-relaxed text-sm">
              {companyInfo.description}
            </p>
            <p className="text-primary font-bold text-sm">{companyInfo.slogan}</p>

            {/* Social */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://www.facebook.com/share/1ZaL36Ykbk/?mibextid=wwXIfr"
                className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-primary/20 hover:border-primary/30 flex items-center justify-center transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 text-white/60 hover:text-white" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-5">
            <h3 className="font-bold text-lg text-white">Контакти</h3>
            <div className="space-y-4">
              <a
                href={contacts.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start space-x-3 group"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/[0.08] border border-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300 flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <span className="text-white/40 text-sm leading-relaxed pt-1.5 group-hover:text-white/60 transition-colors duration-300">{contacts.address}</span>
              </a>
              <div className="flex items-center space-x-3 group">
                <div className="w-9 h-9 rounded-lg bg-primary/[0.08] border border-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300 flex-shrink-0">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <a
                  href={`tel:${contacts.phoneMain}`}
                  className="text-white/40 hover:text-white/70 transition-colors duration-300 font-medium text-sm"
                >
                  {contacts.phoneMain}
                </a>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="w-9 h-9 rounded-lg bg-primary/[0.08] border border-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300 flex-shrink-0">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <a
                  href={`mailto:${contacts.email}`}
                  className="text-white/40 hover:text-white/70 transition-colors duration-300 font-medium text-sm"
                >
                  {contacts.email}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-primary/[0.08] border border-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <span className="text-white/40 text-sm font-medium">{contacts.workingHours}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h3 className="font-bold text-lg text-white">Бързи връзки</h3>
            <div className="space-y-3">
              {[
                { name: "Цени на горива", href: "/products" },
                { name: "Нашите услуги", href: "/about" },
                { name: "Магазин", href: "/shop" },
                { name: "Как да ни намерите", href: "/contact" },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center space-x-2 text-white/40 hover:text-white/70 transition-all duration-300 group text-sm"
                >
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-primary" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-5">
            <h3 className="font-bold text-lg text-white">За клиенти</h3>
            <p className="text-white/40 text-sm leading-relaxed">
              Предимства и удобства на едно място
            </p>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-primary/[0.06] border border-primary/10">
                <p className="text-white font-bold text-sm mb-1">24/7 Обслужване</p>
                <p className="text-white/30 text-xs leading-relaxed">
                  Винаги на ваше разположение
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <p className="text-white font-bold text-sm mb-1">Безплатен паркинг</p>
                <p className="text-white/30 text-xs leading-relaxed">
                  Удобно паркиране за всички клиенти
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/[0.04]">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/25 text-xs text-center md:text-left">
              © {new Date().getFullYear()} {companyInfo.name}. Всички права запазени.
            </p>
            <div className="flex items-center space-x-6 text-xs">
              <Link href="/about" className="text-white/25 hover:text-white/50 transition-colors duration-300">
                За нас
              </Link>
              <Link href="/contact" className="text-white/25 hover:text-white/50 transition-colors duration-300">
                Контакти
              </Link>
              <Link href="/products" className="text-white/25 hover:text-white/50 transition-colors duration-300">
                Горива
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
