// app/admin-prices/page.tsx
'use client'
import { useEffect, useMemo, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Fuel, Save, RefreshCw, CheckCircle2, AlertCircle, Sparkles } from "lucide-react"

const BGN_PER_EUR = 1.95583
const DISCOUNT_BGN = 0.10
const fx2 = (n: number) => n.toFixed(2)

type Fuel = { name: string; price: number; unit: string; memberPrice?: number }
type Row  = { name: string; priceStr: string }

export default function AdminPricesPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    setLoading(true)
    try {
      const res = await fetch('/api/fuel', { cache: 'no-store' })
      if (!res.ok) throw new Error(`GET /api/fuel -> ${res.status}`)
      const data = (await res.json()) as Fuel[]
      setRows(data.map(f => ({ name: f.name, priceStr: String(f.price) })))
      setMsg(null)
    } catch (e) {
      console.error(e)
      setMsg({ type: 'error', text: 'Грешка при зареждане ❌' })
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
      if (items.length === 0) {
        setMsg({ type: 'error', text: 'Няма валидни цени за записване ❌' })
        return
      }

      const res = await fetch('/api/fuel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })
      if (!res.ok) throw new Error(`POST /api/fuel -> ${res.status}`)

      await loadData()
      setMsg({ type: 'success', text: 'Записано успешно ✅' })
      setTimeout(() => setMsg(null), 5000)
    } catch (e) {
      console.error(e)
      setMsg({ type: 'error', text: 'Грешка при запис ❌' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-12 text-center">
            <RefreshCw className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-lg font-semibold text-foreground">Зареждане…</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-primary/10 flex items-center justify-center">
                  <Fuel className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-gradient-primary">Админ – Цени</h1>
                  <p className="text-sm text-muted-foreground">
                    Отстъпката ({fx2(DISCOUNT_BGN)} лв/л) се смята автоматично.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={loadData}
                disabled={loading}
                variant="outline"
                className="hover-lift"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Обнови
              </Button>
              <Button
                onClick={saveAll}
                disabled={saving}
                className="bg-gradient-primary hover:opacity-90 text-white border-0 hover-lift shadow-lg"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Записване…
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Запази всички
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Message */}
          {msg && (
            <Card className={`mb-6 border-2 ${
              msg.type === 'success' 
                ? 'border-green-500 bg-green-50' 
                : 'border-red-500 bg-red-50'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  {msg.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <p className={`font-semibold ${
                    msg.type === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {msg.text}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Fuel Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {computed.map((it, idx) => (
            <Card
              key={idx}
              className={`relative overflow-hidden border-2 transition-all duration-300 hover-lift shadow-lg ${
                it.valid 
                  ? 'border-border hover:border-primary/50 bg-gradient-card' 
                  : 'border-red-300 bg-red-50/50'
              }`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <CardTitle className="text-xl font-bold">{it.name}</CardTitle>
                  <span className="text-xs rounded-full bg-gradient-secondary px-3 py-1 text-white font-semibold">
                    лв/л • €/л
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Standard Price Input */}
                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Стандартна цена:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={it.priceStr}
                      onChange={(e) => setRows(prev => {
                        const n = [...prev]
                        n[idx] = { ...n[idx], priceStr: e.target.value }
                        return n
                      })}
                      className={`flex-1 rounded-lg border-2 px-4 py-2 text-right font-bold text-lg transition-colors ${
                        it.valid
                          ? 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20'
                          : 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                      }`}
                    />
                    <span className="text-sm font-semibold text-muted-foreground">лв</span>
                    <span className="mx-1 text-muted-foreground">/</span>
                    <span className="text-right font-bold text-primary min-w-[60px]">
                      {fx2(it.priceEUR)} €
                    </span>
                  </div>
                </div>

                {/* Member Price Display */}
                <div className="p-4 rounded-xl bg-gradient-primary/10 border-2 border-primary/20">
                  <div className="flex items-center space-x-2 mb-3">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-primary">С карта BG OIL:</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-primary mb-1">
                      {fx2(it.memberBGN)} лв / {fx2(it.memberEUR)} €
                    </div>
                    <div className="text-xs font-bold text-green-600">
                      спестяване {fx2(DISCOUNT_BGN)} лв/л / {fx2(DISCOUNT_BGN / BGN_PER_EUR)} €/л
                    </div>
                  </div>
                </div>

                {/* Validation Message */}
                {!it.valid && (
                  <div className="p-3 rounded-lg bg-red-100 border border-red-300">
                    <p className="text-xs font-medium text-red-800 text-center">
                      Моля, въведете валидна цена
                    </p>
                  </div>
                )}

                {/* CTA Banner */}
                <div className="p-3 rounded-lg bg-gradient-accent text-white text-center text-xs font-bold">
                  Получете карта BG OIL и спестете!
                </div>
              </CardContent>

              {/* Shine Effect */}
              <div className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-1000 shine opacity-20 pointer-events-none"></div>
            </Card>
          ))}
        </div>

        {/* Info Card */}
        <Card className="mt-8 border-primary/20 bg-gradient-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Fuel className="w-5 h-5 text-primary" />
              <span>Информация</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start space-x-2">
                <span className="text-primary font-bold">•</span>
                <span>Промените се запазват веднага след натискане на "Запази всички"</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary font-bold">•</span>
                <span>Отстъпката от {fx2(DISCOUNT_BGN)} лв/л се прилага автоматично за картови клиенти</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary font-bold">•</span>
                <span>Цените трябва да са положителни числа</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}