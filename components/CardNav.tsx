"use client"

import React, { useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import Link from 'next/link'
import { HiOutlineArrowRight } from 'react-icons/hi'

// --- Типове ---
type CardNavLink = {
  label: string
  href: string
  ariaLabel: string
}

export type CardNavItem = {
  label: string
  bgColor: string
  textColor: string
  links: CardNavLink[]
}

export interface CardNavProps {
  logo?: string
  logoAlt?: string
  items?: CardNavItem[]
  className?: string
}

const CardNav: React.FC<CardNavProps> = ({
  logo = '/bg-oil-logo.webp',
  logoAlt = 'BG OIL',
  items = [],
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const menuRef = useRef<HTMLDivElement | null>(null)
  const linksRef = useRef<HTMLAnchorElement[]>([])
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  // Всички линкове
  const allLinks = [
    { label: 'Начало', href: '/', ariaLabel: 'Начална страница' },
    ...items.flatMap(item => item.links)
  ]

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // GSAP Timeline
  useEffect(() => {
    if (!menuRef.current) return

    gsap.set(menuRef.current, {
      height: 0,
      opacity: 0,
      display: 'none'
    })
    gsap.set(linksRef.current, {
      y: 15,
      opacity: 0
    })

    tlRef.current = gsap.timeline({ paused: true })
      .to(menuRef.current, {
        display: 'block',
        height: 'auto',
        opacity: 1,
        duration: 0.4,
        ease: 'power3.out'
      })
      .to(linksRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
        stagger: 0.05
      }, '-=0.2')

    return () => {
      tlRef.current?.kill()
    }
  }, [items])

  const toggleMenu = () => {
    if (!isOpen) {
      setIsOpen(true)
      tlRef.current?.play()
    } else {
      tlRef.current?.reverse().then(() => {
        setIsOpen(false)
      })
    }
  }

  const closeMenu = () => {
    if (!isOpen) return
    tlRef.current?.reverse().then(() => {
      setIsOpen(false)
    })
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ${
          scrolled ? 'py-2' : 'py-3 sm:py-4'
        } ${className}`}
      >
        <div className="mx-auto px-3 sm:px-4 max-w-6xl">
          <nav
            className={`relative rounded-2xl transition-all duration-500 ${
              scrolled
                ? 'bg-[#0d0d12]/95 shadow-2xl shadow-black/40'
                : 'bg-[#0d0d12]/80 shadow-xl shadow-black/20'
            } backdrop-blur-xl border border-white/[0.08]`}
          >
            {/* Gradient border glow */}
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-red-500/20 via-rose-500/10 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity blur-sm pointer-events-none" />

            {/* Main Bar */}
            <div className="relative flex items-center justify-between h-14 sm:h-16 px-4 sm:px-5">

              {/* Left: Hamburger */}
              <button
                onClick={toggleMenu}
                className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] active:bg-white/[0.12] border border-white/[0.06] transition-all duration-300 group"
                aria-label={isOpen ? 'Затвори меню' : 'Отвори меню'}
                aria-expanded={isOpen}
              >
                <div className="flex flex-col justify-center items-center w-5 h-5">
                  <span
                    className={`block w-4 h-[1.5px] bg-gradient-to-r from-red-400 to-rose-400 rounded-full transition-all duration-300 ${
                      isOpen
                        ? 'translate-y-[0.5px] rotate-45'
                        : '-translate-y-1 group-hover:w-5'
                    }`}
                  />
                  <span
                    className={`block w-4 h-[1.5px] bg-gradient-to-r from-rose-400 to-orange-400 rounded-full transition-all duration-300 ${
                      isOpen
                        ? '-translate-y-[0.5px] -rotate-45'
                        : 'translate-y-1 group-hover:w-5'
                    }`}
                  />
                </div>
              </button>

              {/* Center: Logo */}
              <Link
                href="/"
                onClick={closeMenu}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <img
                  src={logo}
                  alt={logoAlt}
                  className="h-7 sm:h-8 w-auto object-contain transition-transform duration-300 hover:scale-105"
                />
              </Link>

              {/* Right: CTA */}
              <Link
                href="/contact"
                onClick={closeMenu}
                className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400 text-white font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25"
              >
                <span className="hidden sm:inline">Контакти</span>
                <HiOutlineArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Dropdown Menu */}
            <div
              ref={menuRef}
              className="overflow-hidden border-t border-white/[0.06]"
            >
              <div className="p-4 sm:p-5">
                {/* Links Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {allLinks.map((link, idx) => (
                    <Link
                      key={`nav-link-${idx}`}
                      ref={(el) => { if (el) linksRef.current[idx] = el }}
                      href={link.href}
                      onClick={closeMenu}
                      className="group relative flex items-center justify-between p-3 sm:p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] hover:border-white/[0.1] transition-all duration-300"
                      aria-label={link.ariaLabel}
                    >
                      {/* Hover glow */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                      <span className="relative text-white/80 group-hover:text-white font-medium text-sm transition-colors">
                        {link.label}
                      </span>

                      <HiOutlineArrowRight className="relative w-4 h-4 text-white/30 group-hover:text-red-400 transition-all duration-300 group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>

                {/* Bottom Info */}
                <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <p className="text-white/40 text-xs">
                    Работим <span className="text-red-400 font-semibold">24/7</span>
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-white/40 text-xs">Онлайн</span>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Backdrop */}
      <div
        onClick={closeMenu}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] transition-all duration-400 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />
    </>
  )
}

export default CardNav
