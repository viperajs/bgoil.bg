import Link from "next/link"
import { companyInfo, contacts } from "@/lib/config"
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, ArrowRight } from "lucide-react"

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-[#04060f] via-[#080f1f] to-[#04060f] text-white overflow-hidden">
      {/* Christmas Footer Accents - Lights, Trees, Stars */}
      <div className="absolute top-0 left-0 right-0 h-20 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Decorative lights */}
        <div className="absolute top-2 left-[3%] christmas-light text-red-500/50" style={{ fontSize: "8px" }}>●</div>
        <div className="absolute top-2 left-[10%] christmas-light text-green-500/50" style={{ animationDelay: "0.2s", fontSize: "8px" }}>●</div>
        <div className="absolute top-2 left-[18%] christmas-light text-yellow-500/50" style={{ animationDelay: "0.4s", fontSize: "8px" }}>●</div>
        <div className="absolute top-2 left-[26%] christmas-light text-red-500/50" style={{ animationDelay: "0.6s", fontSize: "8px" }}>●</div>
        <div className="absolute top-2 left-[34%] christmas-light text-green-500/50" style={{ animationDelay: "0.1s", fontSize: "8px" }}>●</div>
        <div className="absolute top-2 left-[42%] christmas-light text-yellow-500/50" style={{ animationDelay: "0.3s", fontSize: "8px" }}>●</div>
        <div className="absolute top-2 left-[50%] christmas-light text-red-500/50" style={{ animationDelay: "0.5s", fontSize: "8px" }}>●</div>
        <div className="absolute top-2 left-[58%] christmas-light text-green-500/50" style={{ animationDelay: "0.7s", fontSize: "8px" }}>●</div>
        <div className="absolute top-2 left-[66%] christmas-light text-yellow-500/50" style={{ animationDelay: "0.2s", fontSize: "8px" }}>●</div>
        <div className="absolute top-2 left-[74%] christmas-light text-red-500/50" style={{ animationDelay: "0.4s", fontSize: "8px" }}>●</div>
        <div className="absolute top-2 left-[82%] christmas-light text-green-500/50" style={{ animationDelay: "0.6s", fontSize: "8px" }}>●</div>
        <div className="absolute top-2 left-[90%] christmas-light text-yellow-500/50" style={{ animationDelay: "0.1s", fontSize: "8px" }}>●</div>
        <div className="absolute top-2 left-[97%] christmas-light text-red-500/50" style={{ animationDelay: "0.3s", fontSize: "8px" }}>●</div>
        
        {/* Small tree decorations */}
        <div className="absolute top-1 left-[7%] christmas-float text-green-500/40" style={{ fontSize: "12px" }}>🎄</div>
        <div className="absolute top-1 right-[8%] christmas-float text-green-500/40" style={{ animationDelay: "1s", fontSize: "12px" }}>🎄</div>
        <div className="absolute top-1 left-[50%] christmas-float text-green-500/35" style={{ animationDelay: "2s", fontSize: "10px" }}>🎄</div>
        
        {/* Stars */}
        <div className="absolute top-4 left-[15%] christmas-star text-yellow-300/40" style={{ fontSize: "10px" }}>✦</div>
        <div className="absolute top-4 left-[38%] christmas-star text-yellow-300/35" style={{ animationDelay: "0.5s", fontSize: "9px" }}>✦</div>
        <div className="absolute top-4 left-[62%] christmas-star text-yellow-300/40" style={{ animationDelay: "1s", fontSize: "10px" }}>✦</div>
        <div className="absolute top-4 left-[85%] christmas-star text-yellow-300/35" style={{ animationDelay: "1.5s", fontSize: "9px" }}>✦</div>
      </div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 bg-gradient-primary rounded-full flex items-center justify-center shadow-xl">
                <span className="text-white font-black text-xl">BG</span>
              </div>
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
                className="w-11 h-11 rounded-full bg-white/15 hover:bg-primary border border-white/30 flex items-center justify-center transition-all duration-300 hover-lift hover:border-primary hover:shadow-lg"
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
              <div className="flex items-start space-x-3 group">
                <div className="w-10 h-10 rounded-lg bg-primary/30 border border-primary/50 flex items-center justify-center group-hover:bg-primary transition-colors duration-300 flex-shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="text-white/95 text-sm leading-relaxed pt-1.5 font-medium">{contacts.address}</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="w-10 h-10 rounded-lg bg-primary/30 border border-primary/50 flex items-center justify-center group-hover:bg-primary transition-colors duration-300 flex-shrink-0">
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
                <div className="w-10 h-10 rounded-lg bg-primary/30 border border-primary/50 flex items-center justify-center group-hover:bg-primary transition-colors duration-300 flex-shrink-0">
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
                <div className="w-10 h-10 rounded-lg bg-primary/30 border border-primary/50 flex items-center justify-center group-hover:bg-primary transition-colors duration-300 flex-shrink-0">
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

          {/* Newsletter/CTA */}
          <div className="space-y-5">
            <h3 className="font-bold text-xl text-white mb-2">Следвайте ни</h3>
            <p className="text-white/95 text-sm leading-relaxed font-medium">
              Получавайте актуални новини и специални оферти
            </p>
            <div className="p-4 rounded-xl bg-gradient-primary/25 border-2 border-primary/40 shadow-lg">
              <p className="text-white font-bold text-sm mb-2">24/7 Обслужване</p>
              <p className="text-white/95 text-xs leading-relaxed">
                Винаги на ваше разположение за вашия комфорт
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-12 pt-8">
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
                Продукти
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}