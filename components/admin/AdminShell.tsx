'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Hotel,
  ShoppingBag,
  Percent,
  CreditCard,
  Menu,
  X,
  LogOut,
  ExternalLink,
  Sparkles,
} from 'lucide-react'

const NAV_ITEMS = [
  { name: 'Табло', href: '/admin', icon: LayoutDashboard },
  { name: 'Хотел и стаи', href: '/admin-hotel', icon: Hotel },
  { name: 'Магазин', href: '/admin-shop', icon: ShoppingBag },
  { name: 'Промоции', href: '/admin-promo', icon: Percent },
  { name: 'Промо AI', href: '/admin-promo-ai', icon: Sparkles },
  { name: 'Цени горива', href: '/admin-prices', icon: CreditCard },
]

// Страници без административна рамка (login/2fa)
const BARE_ROUTES = ['/admin/login', '/admin/2fa']

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  if (BARE_ROUTES.some(r => pathname.startsWith(r))) {
    return <>{children}</>
  }

  const activeItem = NAV_ITEMS.find(item =>
    item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
  )

  async function handleLogout() {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
    } finally {
      router.push('/admin/login')
      router.refresh()
    }
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-white/[0.06] shrink-0">
        <img src="/bg-oil-logo.webp" alt="BG OIL" className="h-7 w-auto object-contain" />
        <div className="leading-tight">
          <span className="block text-[13px] font-bold text-white tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
            АДМИН ПАНЕЛ
          </span>
          <span className="block text-[10px] text-white/35 uppercase tracking-[0.18em]">BG OIL Враца</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {NAV_ITEMS.map(item => {
          const active = item === activeItem
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-3.5 min-h-[44px] text-sm font-medium transition-colors duration-200 cursor-pointer ${
                active
                  ? 'bg-primary/10 text-white border border-primary/25'
                  : 'text-white/50 hover:text-white hover:bg-white/[0.05] border border-transparent'
              }`}
            >
              <Icon className={`w-[18px] h-[18px] shrink-0 transition-colors ${active ? 'text-primary' : 'text-white/35 group-hover:text-white/70'}`} />
              {item.name}
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(239,68,68,0.8)]" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-3 border-t border-white/[0.06] space-y-1 shrink-0">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3.5 min-h-[44px] text-sm font-medium text-white/50 hover:text-white hover:bg-white/[0.05] transition-colors duration-200 cursor-pointer"
        >
          <ExternalLink className="w-[18px] h-[18px] text-white/35" />
          Виж сайта
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-xl px-3.5 min-h-[44px] text-sm font-medium text-white/50 hover:text-red-400 hover:bg-red-500/[0.07] transition-colors duration-200 cursor-pointer"
        >
          <LogOut className="w-[18px] h-[18px]" />
          Изход
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 fixed inset-y-0 left-0 z-40 bg-[#0c0c0e] border-r border-white/[0.06]">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-[#0c0c0e] border-r border-white/[0.08] flex flex-col animate-fade-in-left">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Затвори менюто"
              className="absolute top-3 right-3 w-11 h-11 flex items-center justify-center rounded-xl text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 min-w-0 lg:pl-64 flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 flex items-center gap-3 px-4 sm:px-6 bg-[#09090b]/85 backdrop-blur-xl border-b border-white/[0.06]">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Отвори менюто"
            className="lg:hidden w-11 h-11 -ml-2 flex items-center justify-center rounded-xl text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-base sm:text-lg font-bold tracking-wide truncate" style={{ fontFamily: 'var(--font-display)' }}>
            {activeItem?.name ?? 'Админ'}
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-emerald-400/90 bg-emerald-500/[0.08] border border-emerald-500/20 rounded-full px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Онлайн
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
