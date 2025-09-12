// app/admin-prices/page.tsx
'use client'
import { useEffect, useMemo, useState } from 'react'

const BGN_PER_EUR = 1.95583
const DISCOUNT_BGN = 0.10
const fx2 = (n: number) => n.toFixed(2)

type Fuel = { name: string; price: number; unit: string; memberPrice?: number }
type Row  = { name: string; priceStr: string }

export default function AdminPricesPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    setLoading(true)
    try {
      const res = await fetch('/api/fuel', { cache: 'no-store' })
      if (!res.ok) throw new Error(`GET /api/fuel -> ${res.status}`)
      const data = (await res.json()) as Fuel[]
      setRows(data.map(f => ({ name: f.name, priceStr: String(f.price) })))
    } catch (e) {
      console.error(e)
      setMsg('Грешка при зареждане ❌')
    } finally {
      setLoading(false)
    }
  }

  const computed = useMemo(() => rows.map(r => {
    const priceBGN = Number(r.priceStr)
    const valid = r.name.trim().length > 0 && Number.isFinite(priceBGN) && priceBGN >= 0
    const memberBGN = valid ? Math.max(0, priceBGN - DISCOUNT_BGN) : 0
    const priceEUR  = valid ? priceBGN / BGN_PER_EUR : 0
    const memberEUR = valid ? memberBGN / BGN_PER_EUR : 0
    return { ...r, valid, priceBGN, memberBGN, priceEUR, memberEUR }
  }), [rows])

  async function saveAll() {
    setSaving(true); setMsg(null)
    try {
      const items = computed.filter(r => r.valid).map(r => ({ name: r.name.trim(), price: r.priceBGN }))
      const res = await fetch('/api/fuel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })
      if (!res.ok) throw new Error(`POST /api/fuel -> ${res.status}`)

      await loadData()                // ← опресни веднага
      setMsg('Записано успешно ✅')
      setTimeout(() => setMsg(null), 3000) // по избор: скрий съобщението след 3s
    } catch (e) {
      console.error(e)
      setMsg('Грешка при запис ❌')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold text-primary">Админ – Цени</h1>
        <p>Зареждане…</p>
      </main>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-primary">Админ – Цени</h1>
          <p className="text-sm text-muted-foreground">
            Отстъпката ({fx2(DISCOUNT_BGN)} лв/л) се смята автоматично.
          </p>
        </div>
        <button onClick={saveAll} disabled={saving}
          className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-60">
          {saving ? 'Записване…' : '💾 Запази всички'}
        </button>
      </div>

      {msg && <p className="mb-4 text-sm">{msg}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {computed.map((it, idx) => (
          <div key={idx} className="relative overflow-hidden rounded-xl border border-accent/30 bg-accent/10 p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{it.name}</h3>
              <span className="text-xs rounded-full bg-secondary px-3 py-1 text-secondary-foreground">лв/л • €/л</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Стандартна цена:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number" step="0.01" min="0"
                    value={it.priceStr}
                    onChange={(e) => setRows(prev => { const n=[...prev]; n[idx]={...n[idx], priceStr:e.target.value}; return n })}
                    className={`w-28 rounded-md border px-2 py-1 text-right font-semibold ${it.valid ? 'border-border' : 'border-red-300'}`}
                  />
                  <span className="text-sm font-semibold">лв</span>
                  <span className="mx-1 text-muted-foreground">/</span>
                  <span className="text-right font-semibold">{fx2(it.priceEUR)} €</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">С карта BG OIL:</span>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">
                    {fx2(it.memberBGN)} лв / {fx2(it.memberEUR)} €
                  </div>
                  <div className="text-xs text-primary font-medium">
                    спестяване {fx2(DISCOUNT_BGN)} лв/л / {fx2(DISCOUNT_BGN / BGN_PER_EUR)} €/л
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-md border border-accent/20 bg-accent/10 p-2 text-center text-xs font-medium text-black">
              Получете карта BG OIL и спестете!
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
