import Link from "next/link"
import { companyInfo, contacts } from "@/lib/config"
import { Phone, Mail, MapPin, Clock, Facebook, ArrowRight } from "lucide-react"

export default function Footer() {
  return (
    <footer className="relative text-foreground border-t border-border">
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-5">
            <span className="text-h4 text-foreground">{companyInfo.name}</span>
            <p className="text-muted-foreground leading-relaxed text-sm">
              {companyInfo.description}
            </p>
            <p className="text-brand-500 font-bold text-sm">{companyInfo.slogan}</p>

            {/* Social */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://www.facebook.com/share/1ZaL36Ykbk/?mibextid=wwXIfr"
                className="w-10 h-10 rounded-md border border-border bg-secondary hover:bg-brand-500/10 hover:border-brand-500/30 flex items-center justify-center transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-5">
            <h3 className="font-bold text-lg text-foreground">Контакти</h3>
            <div className="space-y-1">
              <a
                href={contacts.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 group -mx-2 px-2 py-2.5 rounded-md hover:bg-secondary transition-colors duration-200"
              >
                <div className="w-9 h-9 rounded-md border border-border bg-secondary flex items-center justify-center flex-shrink-0 text-brand-500">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-muted-foreground text-sm leading-relaxed pt-1.5 group-hover:text-foreground transition-colors duration-200">{contacts.address}</span>
              </a>
              <a
                href={`tel:${contacts.phoneMain}`}
                className="flex items-center gap-3 group -mx-2 px-2 py-2.5 rounded-md hover:bg-secondary transition-colors duration-200"
              >
                <div className="w-9 h-9 rounded-md border border-border bg-secondary flex items-center justify-center flex-shrink-0 text-brand-500">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-200 font-medium text-sm">
                  {contacts.phoneMain}
                </span>
              </a>
              <a
                href={`mailto:${contacts.email}`}
                className="flex items-center gap-3 group -mx-2 px-2 py-2.5 rounded-md hover:bg-secondary transition-colors duration-200"
              >
                <div className="w-9 h-9 rounded-md border border-border bg-secondary flex items-center justify-center flex-shrink-0 text-brand-500">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-200 font-medium text-sm">
                  {contacts.email}
                </span>
              </a>
              <div className="flex items-center gap-3 -mx-2 px-2 py-2.5">
                <div className="w-9 h-9 rounded-md border border-border bg-secondary flex items-center justify-center flex-shrink-0 text-brand-500">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-muted-foreground text-sm font-medium">{contacts.workingHours}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h3 className="font-bold text-lg text-foreground">Бързи връзки</h3>
            <div className="space-y-1">
              {[
                { name: "Цени на горива", href: "/products" },
                { name: "Нашите услуги", href: "/about" },
                { name: "Магазин", href: "/shop" },
                { name: "Как да ни намерите", href: "/contact" },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 group text-sm -mx-2 px-2 py-2.5 rounded-md hover:bg-secondary"
                >
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 text-brand-500" />
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-5">
            <h3 className="font-bold text-lg text-foreground">За клиенти</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Предимства и удобства на едно място
            </p>
            <div className="space-y-3">
              <div className="p-4 rounded-md border border-brand-500/20 bg-brand-500/[0.06]">
                <p className="text-foreground font-bold text-sm mb-1">24/7 обслужване</p>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Винаги на ваше разположение
                </p>
              </div>
              <div className="p-4 rounded-md border border-border bg-secondary">
                <p className="text-foreground font-bold text-sm mb-1">Безплатен паркинг</p>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Удобно паркиране за всички клиенти
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground/70 text-xs text-center md:text-left">
              © {new Date().getFullYear()} {companyInfo.name}. Всички права запазени.
            </p>
            <div className="flex items-center gap-6 text-xs">
              <Link href="/about" className="text-muted-foreground/70 hover:text-foreground transition-colors duration-200">
                За нас
              </Link>
              <Link href="/contact" className="text-muted-foreground/70 hover:text-foreground transition-colors duration-200">
                Контакти
              </Link>
              <Link href="/products" className="text-muted-foreground/70 hover:text-foreground transition-colors duration-200">
                Горива
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
