'use client'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Loader2, CheckCircle2, AlertCircle, Send, Copy } from "lucide-react"

interface PromoConfig {
  enabled: boolean
  kind: 'promo' | 'news'
  title?: string
  message: string
  ctaText?: string
  ctaUrl?: string
  startAt?: string | null
  endAt?: string | null
}

export default function AdminPromoAIPage() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [generatedConfig, setGeneratedConfig] = useState<PromoConfig | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  async function generatePromo() {
    if (!prompt.trim()) {
      setError('Моля, напишете какво искате да генерирате')
      return
    }

    setLoading(true)
    setError(null)
    setGeneratedConfig(null)
    setSaveSuccess(false)

    try {
      const res = await fetch('/api/admin/promo/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
      })

      const data = await res.json()

      if (!res.ok || !data.ok) {
        throw new Error(data.error || `HTTP ${res.status}`)
      }

      setGeneratedConfig(data.config)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Неизвестна грешка'
      setError(`Грешка при генериране: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  async function savePromo() {
    if (!generatedConfig) return

    setLoading(true)
    setError(null)
    setSaveSuccess(false)

    try {
      const res = await fetch('/api/admin/promo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generatedConfig),
      })

      const data = await res.json()

      if (!res.ok || !data.ok) {
        throw new Error(data.error || `HTTP ${res.status}`)
      }

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 5000)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Неизвестна грешка'
      setError(`Грешка при запис: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  function copyJSON() {
    if (!generatedConfig) return
    navigator.clipboard.writeText(JSON.stringify(generatedConfig, null, 2))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gradient-primary">
                AI Генератор на Промоции
              </h1>
              <p className="text-sm text-muted-foreground">
                Опишете какво искате и AI-ят ще генерира готова промоция или новина
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card className="border-2 shadow-lg bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Send className="w-5 h-5 text-primary" />
                <span>Опишете промоцията</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Напишете какво искате (на естествен език):
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full rounded-lg border-2 border-border px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-[200px] resize-none"
                  placeholder={`Примери:

- Добави промоция за 15% отстъпка на бензин за целия февруари
- Работим на Нова година от 10 до 18 часа
- Безплатно кафе при зареждане над 40 литра
- LPG на супер цена този уикенд
- Обновена луксозна баня и тоалетна за клиенти`}
                  disabled={loading}
                />
              </div>

              <Button
                onClick={generatePromo}
                disabled={loading || !prompt.trim()}
                className="w-full bg-gradient-primary hover:opacity-90 text-white border-0 shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Генериране...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Генерирай с AI
                  </>
                )}
              </Button>

              {/* Examples */}
              <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-xs font-bold text-muted-foreground mb-2">💡 Съвети:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Пишете на естествен български език</li>
                  <li>• Споменете конкретни дати ако има</li>
                  <li>• Опишете вида на промоцията (отстъпка, подарък, информация)</li>
                  <li>• AI-ят ще генерира привлекателно съобщение автоматично</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="border-2 shadow-lg bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span>Генерирана промоция</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-4 rounded-lg bg-red-50 border-2 border-red-300">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-sm font-semibold text-red-800">{error}</p>
                  </div>
                </div>
              )}

              {saveSuccess && (
                <div className="p-4 rounded-lg bg-green-50 border-2 border-green-300">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <p className="text-sm font-semibold text-green-800">
                      ✅ Промоцията е запазена успешно!
                    </p>
                  </div>
                </div>
              )}

              {!generatedConfig && !error && !loading && (
                <div className="text-center py-12 text-muted-foreground">
                  <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="text-sm">
                    Опишете промоцията в лявата част и натиснете "Генерирай с AI"
                  </p>
                </div>
              )}

              {generatedConfig && (
                <div className="space-y-4">
                  {/* Preview */}
                  <div className={`p-6 rounded-xl border-2 ${
                    generatedConfig.kind === 'promo'
                      ? 'bg-gradient-to-r from-pink-50 to-pink-100 border-pink-300'
                      : 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-300'
                  }`}>
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-white/80">
                        {generatedConfig.kind === 'promo' ? '🎁 ПРОМОЦИЯ' : '📢 НОВИНА'}
                      </span>
                      {generatedConfig.enabled && (
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-500 text-white">
                          ✓ АКТИВНА
                        </span>
                      )}
                    </div>

                    {generatedConfig.title && (
                      <h3 className="text-lg font-black text-gray-800 mb-2">
                        {generatedConfig.title}
                      </h3>
                    )}

                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      {generatedConfig.message}
                    </p>

                    {generatedConfig.ctaText && (
                      <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold">
                        {generatedConfig.ctaText}
                      </button>
                    )}

                    {(generatedConfig.startAt || generatedConfig.endAt) && (
                      <div className="mt-3 pt-3 border-t border-gray-300 text-xs text-gray-600">
                        {generatedConfig.startAt && (
                          <div>📅 Начало: {new Date(generatedConfig.startAt).toLocaleDateString('bg-BG')}</div>
                        )}
                        {generatedConfig.endAt && (
                          <div>📅 Край: {new Date(generatedConfig.endAt).toLocaleDateString('bg-BG')}</div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* JSON View */}
                  <div className="relative">
                    <button
                      onClick={copyJSON}
                      className="absolute top-2 right-2 p-2 bg-muted hover:bg-muted/80 rounded-lg"
                      title="Копирай JSON"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <pre className="p-4 rounded-lg bg-muted border border-border text-xs overflow-x-auto">
{JSON.stringify(generatedConfig, null, 2)}
                    </pre>
                  </div>

                  {/* Save Button */}
                  <Button
                    onClick={savePromo}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white border-0 shadow-lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Записване...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Запази промоцията
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info */}
        <Card className="mt-8 border-primary/20 bg-gradient-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span>Как работи AI генераторът?</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start space-x-2">
                <span className="text-primary font-bold">1.</span>
                <span>Пишете на естествен български език какво искате да покажете</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary font-bold">2.</span>
                <span>AI-ят анализира текста и разбира дали е промоция или новина</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary font-bold">3.</span>
                <span>Генерира привлекателно съобщение до 180 символа</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary font-bold">4.</span>
                <span>Добавя заглавие, бутони и дати ако е необходимо</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary font-bold">5.</span>
                <span>Преглеждате резултата и го записвате с един клик</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
