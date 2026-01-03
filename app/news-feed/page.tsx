'use client'

import { useState, useEffect, useMemo } from 'react'
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import NewsFeedList from "@/components/news-feed/NewsFeedList"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import dayjs from "dayjs"

interface NewsArticle {
  id: string
  title: string
  url: string
  source: string
  published_at: string
  summary: string
  keywords: string[]
  category?: string
  language: 'bg' | 'en'
  is_important?: boolean
}

export default function NewsFeedPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNews = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      params.set('limit', '50') // Увеличаваме лимита за да показваме повече новини
      
      // Вземаме новини от последните 7 дни
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      params.set('from', weekAgo.toISOString())
      
      // Използваме относителен път за да работи и в development и в production
      const res = await fetch(`/api/news-feed?${params.toString()}`, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!res.ok) {
        const errorText = await res.text().catch(() => '')
        throw new Error(`HTTP ${res.status}: ${errorText || 'Failed to load news'}`)
      }
      
      const data = await res.json()
      if (data.ok) {
        setArticles(data.articles || [])
      } else {
        throw new Error(data.error || 'Unknown error')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Грешка при зареждане на новините'
      setError(errorMessage)
      console.error('Fetch news error:', err)
      setArticles([])
    } finally {
      setLoading(false)
    }
  }

  // Филтриране на новини - показваме всички новини от последните 7 дни
  // Филтрирането по релевантност се прави в API endpoint-а
  const filteredArticles = useMemo(() => {
    const now = dayjs()
    const sevenDaysAgo = now.subtract(7, 'days')
    
    // Филтрираме само по време - последните 7 дни
    // Филтрирането по релевантност вече е направено в API endpoint-а
    return articles.filter(article => {
      const publishedDate = dayjs(article.published_at)
      return publishedDate.isAfter(sevenDaysAgo)
    })
  }, [articles])

  useEffect(() => {
    fetchNews()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
        {/* Animated background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 -right-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/15 via-accent/10 to-secondary/15 py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-5xl mx-auto animate-fade-in-up">
              <div className="inline-flex items-center space-x-2 px-6 py-3 bg-primary/20 backdrop-blur-sm rounded-full mb-8 border border-primary/30">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
                <span className="text-sm font-bold text-primary tracking-wide uppercase">Актуални новини</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground mb-6 leading-tight">
                Новини за <span className="text-gradient-primary">горива</span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
                Събираме новините за бензин, дизел, LPG и суров петрол от международни източници.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 px-4 py-2 bg-background/50 backdrop-blur-sm rounded-full border border-border">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold">Автоматично обновяване</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-background/50 backdrop-blur-sm rounded-full border border-border">
                  <span className="font-semibold">📰 Последните 7 дни</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* News List */}
        <div className="container mx-auto px-4 py-16 relative z-10">
          {loading ? (
            <Card className="p-16 max-w-2xl mx-auto border-2 shadow-xl bg-gradient-card">
              <CardContent className="flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <span className="text-lg text-muted-foreground font-medium">Зареждане на новини...</span>
                <p className="text-sm text-muted-foreground">Моля изчакайте, докато съберем най-актуалните новини за вас</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="p-16 max-w-2xl mx-auto border-2 border-red-300 bg-red-50/50 shadow-xl">
              <CardContent className="text-center space-y-6">
                <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">⚠️</span>
                </div>
                <h3 className="text-2xl font-bold text-red-700">Възникна проблем</h3>
                <p className="text-red-600 text-lg">{error}</p>
                <button
                  onClick={() => fetchNews()}
                  className="px-8 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover-lift"
                >
                  🔄 Опитай отново
                </button>
              </CardContent>
            </Card>
          ) : filteredArticles.length > 0 ? (
            <div className="space-y-8">
              {/* Stats bar */}
              <div className="max-w-5xl mx-auto mb-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-card border-2 border-primary/20 rounded-2xl p-6 text-center hover-lift hover:border-primary/40 transition-all">
                    <div className="text-4xl font-black text-primary mb-2">{filteredArticles.length}</div>
                    <div className="text-sm text-muted-foreground font-semibold">Актуални новини</div>
                  </div>
                  <div className="bg-gradient-card border-2 border-secondary/20 rounded-2xl p-6 text-center hover-lift hover:border-secondary/40 transition-all">
                    <div className="text-4xl font-black text-secondary mb-2">24/7</div>
                    <div className="text-sm text-muted-foreground font-semibold">Мониторинг на източници</div>
                  </div>
                  <div className="bg-gradient-card border-2 border-accent/20 rounded-2xl p-6 text-center hover-lift hover:border-accent/40 transition-all">
                    <div className="text-4xl font-black text-accent mb-2">100%</div>
                    <div className="text-sm text-muted-foreground font-semibold">Безплатно</div>
                  </div>
                </div>
              </div>

              <NewsFeedList articles={filteredArticles} />
            </div>
          ) : (
            <Card className="p-16 max-w-2xl mx-auto border-2 shadow-xl bg-gradient-card">
              <CardContent className="text-center space-y-6">
                <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <span className="text-4xl">📰</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground">Няма нови новини</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Показват се само новини за горива и бензиностанции, публикувани в последните 7 дни.
                </p>
                <p className="text-sm text-muted-foreground">
                  Системата автоматично ще зареди нови новини при публикуване.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

