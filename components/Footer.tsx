import Link from "next/link"
import { Clock, Facebook, Mail, MapPin, Phone } from "lucide-react"
import { companyInfo, contacts } from "@/lib/config"

const quickLinks = [
  { name: "Цени на горива", href: "/products" },
  { name: "Нашите услуги", href: "/about" },
  { name: "Магазин", href: "/shop" },
  { name: "Хотел", href: "/hotel" },
  { name: "Как да ни намерите", href: "/contact" },
]

export default function Footer() {
  return (
    <footer className="s-footer s-on-ink">
      <div className="s-footer__stripe" aria-hidden="true" />
      <div className="s-wrap">
        <div className="s-footer__grid">
          <div className="s-footer__brand">
            <img src="/bg-oil-logo.webp" alt={companyInfo.name} width={128} height={44} loading="lazy" />
            <p>{companyInfo.description}</p>
            <p className="s-footer__slogan">{companyInfo.slogan}</p>
            <a
              className="s-footer__social"
              href="https://www.facebook.com/share/1ZaL36Ykbk/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook aria-hidden="true" />
              Facebook
            </a>
          </div>

          <div>
            <h3>Контакти</h3>
            <div className="s-footer__list">
              <a href={contacts.mapsLink} target="_blank" rel="noopener noreferrer">
                <MapPin aria-hidden="true" />
                {contacts.address}
              </a>
              <a href={`tel:${contacts.phoneMain.replace(/\s+/g, "")}`}>
                <Phone aria-hidden="true" />
                {contacts.phoneMain}
              </a>
              <a href={`mailto:${contacts.email}`}>
                <Mail aria-hidden="true" />
                {contacts.email}
              </a>
              <span className="row">
                <Clock aria-hidden="true" />
                {contacts.workingHours}
              </span>
            </div>
          </div>

          <div>
            <h3>Бързи връзки</h3>
            <div className="s-footer__links">
              {quickLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3>За клиенти</h3>
            <div className="s-footer__perks">
              <div>
                <b>24/7 обслужване</b>
                <small>Винаги на ваше разположение</small>
              </div>
              <div>
                <b>Безплатен паркинг</b>
                <small>Удобно паркиране за всички клиенти</small>
              </div>
            </div>
          </div>
        </div>

        <div className="s-footer__bottom">
          <span>
            © {new Date().getFullYear()} {companyInfo.name}. Всички права запазени.
          </span>
          <nav aria-label="Долна навигация">
            <Link href="/about">За нас</Link>
            <Link href="/contact">Контакти</Link>
            <Link href="/products">Горива</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
