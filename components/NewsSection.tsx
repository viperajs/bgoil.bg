'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Fuel, Sparkles, Loader2, Clock, ExternalLink, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react"
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
  const [currentIndex, setCurrentIndex] = useState(0)

  const fetchNews = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      params.set('limit', '3')
      
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
        const errorText = await res.text()
        console.error('API error:', res.status, errorText)
        throw new Error(`Failed to load news: ${res.status}`)
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

  // Навигационни функции
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? articles.length - 1 : prevIndex - 1
    )
  }, [articles.length])

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === articles.length - 1 ? 0 : prevIndex + 1
    )
  }, [articles.length])

  // Автоматична смяна на всеки 10 секунди
  useEffect(() => {
    if (articles.length === 0) return
    
    const autoPlayInterval = setInterval(() => {
      goToNext()
    }, 10000) // 10 секунди
    
    return () => clearInterval(autoPlayInterval)
  }, [articles.length, goToNext])

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
    <section id="нови" className="relative py-16 sm:py-20 lg:py-28 bg-gradient-to-b from-muted/20 via-background to-muted/30 overflow-hidden">

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full mb-6 backdrop-blur-sm border border-primary/20">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary">Актуални новини</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6">
            <span className="text-gradient-primary">Новини</span> за горивата
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Събираме новините за бензин, дизел, LPG и суров петрол. Резюмета на български.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Зареждане на новини...</span>
          </div>
        ) : error ? (
          <div className="text-center py-10">
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
          <div className="text-center py-10">
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
            {/* Карусел с новини */}
            <div className="relative max-w-5xl mx-auto mb-12">
              {/* Навигационни бутони */}
              <button
                onClick={goToPrevious}
                className="absolute left-0 md:-left-16 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-primary rounded-full p-3 md:p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-primary/20 hover:border-primary/40"
                aria-label="Предишна новина"
              >
                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
              </button>
              
              <button
                onClick={goToNext}
                className="absolute right-0 md:-right-16 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-primary rounded-full p-3 md:p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-primary/20 hover:border-primary/40"
                aria-label="Следваща новина"
              >
                <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
              </button>

              {/* Карусел контейнер */}
              <div className="overflow-hidden px-2 md:px-8">
                <div 
                  className="transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  <div className="flex">
                    {articles.map((article) => (
                      <div 
                        key={article.id}
                        className="w-full flex-shrink-0 px-2"
                      >
                        <Card
                          className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover-lift border-2 border-border hover:border-primary/50 bg-gradient-card"
                        >
                          {/* Decorative gradient overlay on hover */}
                          <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                          
                          {/* Top accent bar */}
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          
                          {/* Decorative corner element */}
                          <div className="absolute top-0 right-0 w-20 h-20 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                            <div className="absolute top-0 right-0 w-full h-full bg-gradient-primary rounded-bl-full"></div>
                          </div>

                          <CardHeader className="relative z-10">
                            <div className="flex flex-col sm:flex-row items-start justify-between mb-3 gap-3">
                              <div className="flex flex-wrap gap-2 flex-1">
                                {article.category && (
                                  <Badge className={`${getCategoryColor(article.category)} border-0 shadow-sm`}>
                                    {article.category}
                                  </Badge>
                                )}
                                {article.is_important && (
                                  <Badge className="bg-red-500 text-white text-xs border-0 shadow-sm">
                                    Важно
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full whitespace-nowrap">
                                <Clock className="w-3 h-3" />
                                <span>{formatDate(article.published_at)}</span>
                              </div>
                            </div>
                            <CardTitle className="text-2xl md:text-3xl lg:text-4xl group-hover:text-primary transition-colors flex items-start gap-3 leading-tight">
                              <span className="flex-1">{article.title}</span>
                              <ExternalLink className="w-5 h-5 md:w-6 md:h-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="relative z-10 pb-8">
                            <p className="text-muted-foreground leading-relaxed text-base md:text-lg mb-6">
                              {article.summary}
                            </p>
                            {article.keywords && article.keywords.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-border/50">
                                <div className="flex flex-wrap gap-2">
                                  {article.keywords.slice(0, 5).map((keyword, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs md:text-sm bg-background/50">
                                      {keyword}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            <div className="mt-6 pt-4 border-t border-border/50">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full">
                                  <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                                  <span className="font-medium">{article.source}</span>
                                </div>
                                <a
                                  href={article.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-sm md:text-base text-primary font-semibold group-hover:gap-3 transition-all hover:underline"
                                >
                                  <span>Прочети повече</span>
                                  <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
                                </a>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Индикатори */}
              <div className="flex justify-center gap-2 mt-8">
                {articles.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentIndex
                        ? 'w-8 h-3 bg-primary'
                        : 'w-3 h-3 bg-primary/30 hover:bg-primary/50'
                    }`}
                    aria-label={`Виж новина ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Stats Section */}
            <div className="mt-16 mb-12 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <Card className="bg-gradient-card border-2 border-border/50 hover:border-primary/50 transition-all duration-300 hover-lift">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-3xl md:text-4xl font-black text-foreground mb-2">{articles.length}+</h3>
                    <p className="text-sm md:text-base text-muted-foreground font-medium">Актуални новини</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-card border-2 border-border/50 hover:border-secondary/50 transition-all duration-300 hover-lift">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-3xl md:text-4xl font-black text-foreground mb-2">24/7</h3>
                    <p className="text-sm md:text-base text-muted-foreground font-medium">Обновяване</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-card border-2 border-border/50 hover:border-accent/50 transition-all duration-300 hover-lift">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-3xl md:text-4xl font-black text-foreground mb-2">100%</h3>
                    <p className="text-sm md:text-base text-muted-foreground font-medium">Актуални данни</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center relative z-10 mb-12">
              <div className="inline-block p-1 bg-gradient-primary rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <Link href="/news-feed">
                  <button className="px-8 py-4 bg-white text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300 font-semibold flex items-center gap-2 hover-lift shadow-sm">
                    <Fuel className="w-5 h-5" />
                    Виж всички новини
                  </button>
                </Link>
              </div>
            </div>
            
            {/* Decorative bottom section */}
            <div className="relative z-10">
              <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-2xl p-8 border border-border/30 backdrop-blur-sm">
                  <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-primary rounded-full animate-pulse shadow-lg"></div>
                      <span className="font-semibold text-foreground">Актуални новини</span>
                    </div>
                    <span className="hidden md:inline text-border">•</span>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span>Обновява се автоматично</span>
                    </div>
                    <span className="hidden md:inline text-border">•</span>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-secondary" />
                      <span>Последно обновяване: {articles.length > 0 ? formatDate(articles[0].published_at) : 'сега'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

