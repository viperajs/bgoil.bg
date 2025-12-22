'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Save, RefreshCw, CheckCircle2, AlertCircle, Sparkles, Eye, X } from "lucide-react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface DiscountBannerConfig {
  enabled: boolean
  message: string
  startAt?: string | null
  endAt?: string | null
}

export default function AdminPromoPage() {
  const [loading, setLoading] = useState(true)
  
  // Discount Banner state
  const [discountBanner, setDiscountBanner] = useState<DiscountBannerConfig>({
    enabled: true,
    message: '💳 С карта BG OIL имате 10 % отстъпка при закупуване стоки от магазина на бензиностанцията',
    startAt: null,
    endAt: null,
  })
  const [discountBannerActive, setDiscountBannerActive] = useState(false)
  const [savingDiscountBanner, setSavingDiscountBanner] = useState(false)
  const [discountBannerMsg, setDiscountBannerMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      // Load discount banner
      const discountRes = await fetch('/api/admin/discount-banner', {
        credentials: 'include',
        cache: 'no-store'
      })
      if (discountRes.ok) {
        const discountData = await discountRes.json()
        if (discountData.ok) {
          setDiscountBanner(discountData.config)
          setDiscountBannerActive(discountData.active)
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const updateDiscountBanner = (updates: Partial<DiscountBannerConfig>) => {
    setDiscountBanner(prev => ({ ...prev, ...updates }))
  }

  async function saveDiscountBanner() {
    setSavingDiscountBanner(true)
    setDiscountBannerMsg(null)
    try {
      if (!discountBanner.message.trim()) {
        setDiscountBannerMsg({ type: 'error', text: 'Съобщението е задължително ❌' })
        return
      }

      if (discountBanner.message.length > 200) {
        setDiscountBannerMsg({ type: 'error', text: 'Съобщението трябва да е максимум 200 символа ❌' })
        return
      }

      const res = await fetch('/api/admin/discount-banner', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discountBanner),
        credentials: 'include',
      })

      let data
      try {
        data = await res.json()
      } catch (parseError) {
        throw new Error(`Server error: ${res.status} ${res.statusText}`)
      }

      if (!res.ok || !data.ok) {
        const errorMsg = data?.error || `Failed to save (${res.status})`
        throw new Error(errorMsg)
      }

      setDiscountBanner(data.config)
      setDiscountBannerActive(data.active)
      setDiscountBannerMsg({ type: 'success', text: 'Записано успешно ✅' })
      setTimeout(() => setDiscountBannerMsg(null), 5000)
    } catch (e) {
      console.error(e)
      const errorMsg = e instanceof Error ? e.message : 'Грешка при запис ❌'
      setDiscountBannerMsg({ type: 'error', text: errorMsg })
    } finally {
      setSavingDiscountBanner(false)
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
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад към админ панела
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500/10 to-green-400/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-gradient-primary">Discount Banner</h1>
                  <p className="text-sm text-muted-foreground">
                    Управление на съобщението за отстъпка с карта BG OIL
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
                onClick={saveDiscountBanner}
                disabled={savingDiscountBanner}
                className="bg-gradient-to-r from-green-500 to-green-400 hover:opacity-90 text-white border-0 hover-lift shadow-lg"
              >
                {savingDiscountBanner ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Записване…
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Запази
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Discount Banner Status */}
          <div className="mb-6">
            <Badge 
              className={`text-sm px-4 py-2 ${
                discountBannerActive 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-400 text-white'
              }`}
            >
              {discountBannerActive ? '✓ АКТИВНО' : '○ НЕАКТИВНО'}
            </Badge>
          </div>

          {/* Discount Banner Message */}
          {discountBannerMsg && (
            <Card className={`mb-6 border-2 ${
              discountBannerMsg.type === 'success' 
                ? 'border-green-500 bg-green-50' 
                : 'border-red-500 bg-red-50'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  {discountBannerMsg.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <p className={`font-semibold ${
                    discountBannerMsg.type === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {discountBannerMsg.text}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Discount Banner Form */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Настройки</CardTitle>
              <CardDescription>Конфигурирайте съобщението за отстъпка</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Enabled Toggle */}
              <div className="flex items-center justify-between p-4 rounded-lg border-2 border-border bg-muted/50">
                <div>
                  <Label htmlFor="discountEnabled" className="text-base font-semibold">
                    Активиране
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Включи/изключи discount banner
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => updateDiscountBanner({ enabled: !discountBanner.enabled })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    discountBanner.enabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      discountBanner.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Message */}
              <div>
                <Label htmlFor="discountMessage">
                  Съобщение <span className="text-red-500">*</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    ({discountBanner.message.length}/200)
                  </span>
                </Label>
                <textarea
                  id="discountMessage"
                  value={discountBanner.message}
                  onChange={(e) => updateDiscountBanner({ message: e.target.value })}
                  placeholder="Въведете съобщение за отстъпка (макс. 200 символа)"
                  maxLength={200}
                  rows={4}
                  className="w-full mt-2 px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              {/* Start Date */}
              <div>
                <Label htmlFor="discountStartAt">Начална дата (опционално)</Label>
                <Input
                  id="discountStartAt"
                  type="datetime-local"
                  value={discountBanner.startAt ? new Date(discountBanner.startAt).toISOString().slice(0, 16) : ''}
                  onChange={(e) => updateDiscountBanner({ startAt: e.target.value ? new Date(e.target.value).toISOString() : null })}
                  className="mt-2"
                />
              </div>

              {/* End Date */}
              <div>
                <Label htmlFor="discountEndAt">Крайна дата (опционално)</Label>
                <Input
                  id="discountEndAt"
                  type="datetime-local"
                  value={discountBanner.endAt ? new Date(discountBanner.endAt).toISOString().slice(0, 16) : ''}
                  onChange={(e) => updateDiscountBanner({ endAt: e.target.value ? new Date(e.target.value).toISOString() : null })}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Discount Banner Preview */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Преглед
              </CardTitle>
              <CardDescription>Как ще изглежда на сайта</CardDescription>
            </CardHeader>
            <CardContent>
              {discountBannerActive && discountBanner.message ? (
                <div className="space-y-4">
                  {/* Hero Section Preview */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Hero Section</p>
                    <div className="inline-flex items-center space-x-3 px-6 py-4 bg-gradient-to-r from-green-500/20 via-green-400/20 to-green-500/20 rounded-2xl border-2 border-green-400/40 backdrop-blur-md shadow-2xl shadow-green-500/20">
                      <Sparkles className="w-5 h-5 text-green-300 animate-pulse" />
                      <p className="text-lg md:text-xl font-bold text-white">
                        {discountBanner.message}
                      </p>
                      <Sparkles className="w-5 h-5 text-green-300 animate-pulse" />
                    </div>
                  </div>

                  {/* Featured Fuels Section Preview */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Featured Fuels Section</p>
                    <div className="p-6 bg-gradient-to-r from-green-500/15 via-green-400/15 to-green-500/15 border-2 border-green-400/30 rounded-2xl shadow-lg">
                      <div className="flex items-center justify-center space-x-3">
                        <Sparkles className="w-6 h-6 text-green-600" />
                        <p className="text-base md:text-lg font-bold text-foreground text-center">
                          {discountBanner.message}
                        </p>
                        <Sparkles className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </div>

                  {/* Fuel Card Preview */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Fuel Card</p>
                    <div className="p-3 rounded-lg border border-green-500/30 bg-green-500/10">
                      <p className="text-xs font-medium text-center text-green-700">
                        {discountBanner.message}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <X className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Discount banner не е активен</p>
                  <p className="text-xs mt-2">Включете го и попълнете съобщението</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
