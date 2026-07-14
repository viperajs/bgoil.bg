// app/(admin)/admin-bookings/page.tsx
"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  Trash2,
  Clock,
  Search,
  ExternalLink,
  RefreshCw,
  Phone,
  CalendarDays,
  Inbox,
} from "lucide-react"
import { ConfirmDialog, useFlash, FlashBanner, LoadingState } from "@/components/admin/ui"
import type { Booking } from "@/lib/types"

type Filter = "all" | "new" | "confirmed"

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<Filter>("all")
  const [msg, flash] = useFlash()
  const [deleteTarget, setDeleteTarget] = useState<Booking | null>(null)
  const [clearAllOpen, setClearAllOpen] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    loadBookings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadBookings() {
    setLoading(true)
    try {
      const res = await fetch("/api/bookings", { cache: "no-store" })
      if (!res.ok) throw new Error(`GET /api/bookings -> ${res.status}`)
      const data = await res.json()
      setBookings(data.bookings || [])
    } catch (e) {
      console.error(e)
      flash({ type: "error", text: "Грешка при зареждане на резервациите" })
    } finally {
      setLoading(false)
    }
  }

  async function toggleStatus(booking: Booking) {
    const nextStatus = booking.status === "new" ? "confirmed" : "new"
    setBookings(prev => prev.map(b => (b.id === booking.id ? { ...b, status: nextStatus } : b)))
    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: booking.id, status: nextStatus }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error)
    } catch (e) {
      console.error(e)
      setBookings(prev => prev.map(b => (b.id === booking.id ? { ...b, status: booking.status } : b)))
      flash({ type: "error", text: "Неуспешна смяна на статуса" })
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setBusy(true)
    try {
      const res = await fetch(`/api/bookings?id=${encodeURIComponent(deleteTarget.id)}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error)
      setDeleteTarget(null)
      await loadBookings()
      flash({ type: "success", text: "Резервацията е изтрита" })
    } catch (e) {
      console.error(e)
      flash({ type: "error", text: "Грешка при изтриване" })
    } finally {
      setBusy(false)
    }
  }

  async function handleClearAll() {
    setBusy(true)
    try {
      const res = await fetch("/api/bookings?all=1", { method: "DELETE" })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error)
      setClearAllOpen(false)
      await loadBookings()
      flash({ type: "success", text: "Всички резервации са изтрити" })
    } catch (e) {
      console.error(e)
      flash({ type: "error", text: "Грешка при изтриване" })
    } finally {
      setBusy(false)
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return bookings.filter(b => {
      if (filter !== "all" && b.status !== filter) return false
      if (!q) return true
      return (
        b.fullName.toLowerCase().includes(q) ||
        b.phone.toLowerCase().includes(q) ||
        b.roomType.toLowerCase().includes(q)
      )
    })
  }, [bookings, query, filter])

  const newCount = bookings.filter(b => b.status === "new").length

  const filterTabs: { key: Filter; label: string }[] = [
    { key: "all", label: `Всички (${bookings.length})` },
    { key: "new", label: `Нови (${newCount})` },
    { key: "confirmed", label: `Потвърдени (${bookings.length - newCount})` },
  ]

  if (loading) {
    return <LoadingState />
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide" style={{ fontFamily: "var(--font-display)" }}>
            Резервации
          </h2>
          <p className="text-sm text-white/40 mt-0.5">Заявки от страницата за резервации на сайта</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/booking"
            target="_blank"
            className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-xl border border-white/[0.1] text-sm font-semibold text-white/60 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Страница за резервации</span>
          </Link>
          <button
            onClick={loadBookings}
            aria-label="Обнови"
            className="w-11 h-11 flex items-center justify-center rounded-xl border border-white/[0.1] text-white/60 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <FlashBanner msg={msg} />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Търсене по име, телефон или стая…"
            aria-label="Търсене на резервации"
            className="w-full min-h-[44px] rounded-xl bg-white/[0.04] border border-white/[0.1] pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
          />
        </div>
        <div className="flex rounded-xl border border-white/[0.08] bg-white/[0.02] p-1 gap-1 overflow-x-auto">
          {filterTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`min-h-[36px] px-4 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                filter === tab.key ? "bg-primary/15 text-white border border-primary/30" : "text-white/45 hover:text-white border border-transparent"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {bookings.length > 0 && (
          <button
            onClick={() => setClearAllOpen(true)}
            className="min-h-[44px] px-4 rounded-xl border border-red-500/25 bg-red-500/[0.06] text-sm font-semibold text-red-300 hover:bg-red-500/[0.12] transition-colors cursor-pointer whitespace-nowrap"
          >
            Изтрий всички
          </button>
        )}
      </div>

      {/* Table / empty state */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/[0.12] p-12 text-center">
          <Inbox className="w-10 h-10 text-white/20 mx-auto mb-3" />
          <p className="text-white/50 font-semibold mb-1">
            {bookings.length === 0 ? "Все още няма резервации" : "Няма съвпадения"}
          </p>
          <p className="text-sm text-white/30">
            {bookings.length === 0
              ? "Заявките от страницата за резервации ще се появят тук веднага."
              : "Опитайте с друго търсене или филтър."}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.07] text-left">
                  {["Клиент", "Стая и дати", "Сума", "Обаждане", "Статус", ""].map((h, i) => (
                    <th
                      key={i}
                      scope="col"
                      className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-white/35 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {filtered.map(b => (
                  <tr key={b.id} className="hover:bg-white/[0.025] transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-bold text-white">{b.fullName}</div>
                      <a
                        href={`tel:${b.phone}`}
                        className="inline-flex items-center gap-1.5 text-white/45 hover:text-primary transition-colors text-xs mt-1 cursor-pointer"
                      >
                        <Phone className="w-3 h-3" /> {b.phone}
                      </a>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-semibold text-white/85">{b.roomType}</div>
                      <div className="inline-flex items-center gap-1.5 text-xs text-white/40 bg-white/[0.04] border border-white/[0.06] rounded-lg px-2 py-1 mt-1.5">
                        <CalendarDays className="w-3 h-3" />
                        {b.checkIn} → {b.checkOut}
                        <span className="text-white/25">({b.nights} нощ.)</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-black text-white" style={{ fontFamily: "var(--font-mono)" }}>
                        {b.totalPrice.toFixed(2)} €
                      </div>
                      <div className="text-[11px] text-white/35 mt-0.5">
                        Депозит: {(b.totalPrice * 0.3).toFixed(2)} €
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {b.callRequested ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/[0.08] text-amber-300 border border-amber-500/25">
                          <Clock className="w-3 h-3" />
                          {b.preferredTime || "По всяко време"}
                        </span>
                      ) : (
                        <span className="text-white/20">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                          b.status === "confirmed"
                            ? "bg-emerald-500/[0.08] text-emerald-300 border-emerald-500/25"
                            : "bg-blue-500/[0.08] text-blue-300 border-blue-500/25"
                        }`}
                      >
                        {b.status === "confirmed" ? "Потвърдена" : "Нова"}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end items-center gap-1.5">
                        <button
                          onClick={() => toggleStatus(b)}
                          className={`min-h-[36px] text-xs font-bold px-3.5 rounded-lg transition-colors cursor-pointer border ${
                            b.status === "new"
                              ? "bg-emerald-500/[0.08] text-emerald-300 border-emerald-500/25 hover:bg-emerald-500/[0.15]"
                              : "bg-white/[0.04] text-white/50 border-white/[0.08] hover:bg-white/[0.08]"
                          }`}
                        >
                          {b.status === "new" ? "Потвърди" : "Върни като нова"}
                        </button>
                        <button
                          onClick={() => setDeleteTarget(b)}
                          aria-label={`Изтрий резервацията на ${b.fullName}`}
                          className="w-10 h-10 flex items-center justify-center rounded-lg text-white/35 hover:text-red-400 hover:bg-red-500/[0.08] transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete single */}
      <ConfirmDialog
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        busy={busy}
        title="Изтриване на резервация"
        description={`Сигурни ли сте, че искате да изтриете резервацията на ${deleteTarget?.fullName}? Действието е необратимо.`}
      />

      {/* Clear all */}
      <ConfirmDialog
        open={clearAllOpen}
        onCancel={() => setClearAllOpen(false)}
        onConfirm={handleClearAll}
        busy={busy}
        title="Изтриване на всички резервации"
        description="Сигурни ли сте, че искате да изтриете ВСИЧКИ резервации? Действието е необратимо."
        confirmText="Изтрий всички"
      />
    </div>
  )
}
