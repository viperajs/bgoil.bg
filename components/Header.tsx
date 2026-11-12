"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowUpRight, Clock, MapPin, Menu, Phone, X } from "lucide-react"
import { contacts } from "@/lib/config"

const navItems = [
  { name: "Начало", link: "/" },
  { name: "За нас", link: "/about" },
  { name: "Горива", link: "/products" },
  { name: "Магазин", link: "/shop" },
  { name: "Хотел", link: "/hotel" },
]

export default function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Затваряме мобилното меню при смяна на страницата и с Escape
  useEffect(() => { setOpen(false) }, [pathname])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  const current = (link: string) => (pathname === link ? "page" : undefined)
  const telHref = `tel:${contacts.phoneMain.replace(/\s+/g, "")}`

  return (
    <>
      <div className="s-topbar s-on-red">
        <div className="s-wrap">
          <span className="s-topbar__item">
            <span className="s-live" aria-hidden="true" />
            Отворено 24/7
          </span>
          <div className="s-topbar__group">
            <a
              className="s-topbar__item s-topbar__hide"
              href={contacts.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MapPin aria-hidden="true" />
              {contacts.address}
            </a>
            <a className="s-topbar__item" href={telHref}>
              <Phone aria-hidden="true" />
              {contacts.phoneMain}
            </a>
          </div>
        </div>
      </div>

      <header className={`s-header${stuck ? " is-stuck" : ""}`}>
        <div className="s-wrap s-header__in">
          <Link href="/" className="s-logo" aria-label="BG OIL — начало">
            <img src="/bg-oil-logo.webp" alt="BG OIL" width={111} height={38} />
          </Link>

          <nav className="s-nav" aria-label="Основна навигация">
            {navItems.map((item) => (
              <Link key={item.link} href={item.link} aria-current={current(item.link)}>
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="s-header__cta">
            <Link href="/contact" className="s-btn s-btn--red s-btn--sm">
              Контакти
              <ArrowUpRight className="s-arrow" aria-hidden="true" />
            </Link>
            <button
              type="button"
              className="s-burger"
              aria-label="Отвори менюто"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(true)}
            >
              <Menu aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={`s-mobile s-on-red${open ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Меню"
        aria-hidden={!open}
      >
        <div className="s-mobile__top">
          <span className="s-plate">BG OIL</span>
          <button
            type="button"
            className="s-mobile__close"
            aria-label="Затвори менюто"
            tabIndex={open ? 0 : -1}
            onClick={() => setOpen(false)}
          >
            <X aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Мобилна навигация">
          {[...navItems, { name: "Контакти", link: "/contact" }].map((item) => (
            <Link
              key={item.link}
              href={item.link}
              aria-current={current(item.link)}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
            >
              {item.name}
              <ArrowUpRight aria-hidden="true" />
            </Link>
          ))}
        </nav>
        <div className="s-mobile__foot">
          <a className="s-btn s-btn--white s-btn--block" href={telHref} tabIndex={open ? 0 : -1}>
            <Phone aria-hidden="true" />
            {contacts.phoneMain}
          </a>
          <a
            className="s-btn s-btn--ghost-white s-btn--block"
            href={contacts.mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={open ? 0 : -1}
          >
            <MapPin aria-hidden="true" />
            Навигация до нас
          </a>
          <p>
            <Clock aria-hidden="true" style={{ display: "inline", width: 14, height: 14, verticalAlign: "-2px", marginRight: 6 }} />
            {contacts.address} · 24/7
          </p>
        </div>
      </div>
    </>
  )
}
