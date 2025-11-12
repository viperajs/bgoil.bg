'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Fuel, Sparkles, Loader2, Clock, ExternalLink, RefreshCw } from "lucide-react"
import Link from "next/link"

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

export default function NewsSection() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNews = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const base = process.env.NEXT_PUBLIC_BASE_URL ?? ''
      const params = new URLSearchParams()
      params.set('limit', '3')
      
      // Вземаме новини от последните 7 дни
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      params.set('from', weekAgo.toISOString())
      
      const res = await fetch(`${base}/api/news-feed?${params.toString()}`, { cache: 'no-store' })
      
      if (!res.ok) {
        throw new Error('Failed to load news')
      }
      
      const data = await res.json()
      if (data.ok && data.articles) {
        setArticles(data.articles)
        if (data.articles.length === 0) {
          // Не е грешка, просто няма данни
          setError(null)
        }
      } else {
        throw new Error(data.error || 'Invalid response')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Грешка при зареждане на новините'
      setError(errorMessage)
      console.error('Fetch news error:', err)
      setArticles([]) // Изчистваме старите данни при грешка
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
    // Автоматично обновяване на всеки 15 минути (по-рядко за да не презарежда постоянно)
    const interval = setInterval(fetchNews, 15 * 60 * 1000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffHours < 1) return 'преди малко'
    if (diffHours < 24) return `преди ${diffHours} ${diffHours === 1 ? 'час' : 'часа'}`
    if (diffDays === 1) return 'вчера'
    if (diffDays < 7) return `преди ${diffDays} ${diffDays === 1 ? 'ден' : 'дни'}`
    
    return date.toLocaleDateString("bg-BG", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Цени": "bg-primary",
      "Екология": "bg-secondary",
      "Качество": "bg-accent",
      "Индустрия": "bg-primary/80",
      "Оферти": "bg-secondary/80",
      "Безопасност": "bg-accent/80"
    }
    return colors[category] || "bg-muted"
  }

  return (
    <section id="нови" className="py-24 bg-gradient-to-b from-muted/20 via-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary">Актуални новини</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6">
            <span className="text-gradient-primary">Новини</span> за горивата
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Актуална информация и анализ на пазара на горива, генерирана с AI технология
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Зареждане на новини...</span>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchNews}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Опитай отново
            </button>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <Card className="max-w-md mx-auto border-2 border-muted">
              <CardContent className="p-8">
                <p className="text-muted-foreground text-lg mb-2">
                  Няма налични новини в момента
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  За да се появят новини, трябва да извикате ingest endpoint за събиране на данни от RSS източници.
                </p>
                <Link href="/news-feed">
                  <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm">
                    Виж пълния списък
                  </button>
                </Link>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {articles.map((article) => {
                return (
                  <div key={article.id}>
                    <Card
                      className="group hover:shadow-xl transition-all duration-300 hover-lift border-2 border-border hover:border-primary/50 bg-gradient-card"
                    >
                      <CardHeader>
                          <div className="flex items-start justify-between mb-2">
                          {article.category && (
                            <Badge className={getCategoryColor(article.category)}>
                              {article.category}
                            </Badge>
                          )}
                          {article.is_important && (
                            <Badge className="bg-red-500 text-white text-xs">
                              Важно
                            </Badge>
                          )}
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(article.published_at)}</span>
                          </div>
                        </div>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors flex items-center gap-2">
                          {article.title}
                          <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed line-clamp-3">
                          {article.summary}
                        </p>
                        {article.keywords && article.keywords.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-border">
                            <div className="flex flex-wrap gap-2">
                              {article.keywords.slice(0, 3).map((keyword, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="mt-4 pt-4 border-t border-border">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Sparkles className="w-3 h-3" />
                              <span>{article.source}</span>
                            </div>
                            <a
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-primary font-medium group-hover:gap-3 transition-all"
                            >
                              <span>Прочети повече</span>
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )
              })}
            </div>

            <div className="text-center">
              <Link href="/news-feed">
                <button className="px-6 py-3 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-opacity font-semibold flex items-center gap-2 mx-auto hover-lift">
                  <Fuel className="w-5 h-5" />
                  Виж всички новини
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

