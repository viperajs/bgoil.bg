"use client"

import { useState, useEffect } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Fuel, Sparkles, Loader2, TrendingUp, Clock, ExternalLink } from "lucide-react"
import Link from "next/link"

interface NewsArticle {
  id: string
  title: string
  content: string
  date: string
  category: string
  source?: string
  link?: string
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNews()
    const interval = setInterval(fetchNews, 5 * 60 * 1000) // Автоматично обновяване на всеки 5 минути
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchNews = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const base = process.env.NEXT_PUBLIC_BASE_URL ?? ''
      const res = await fetch(`${base}/api/news`, { cache: 'no-store' })
      
      if (!res.ok) {
        throw new Error('Failed to load news')
      }
      
      const data = await res.json()
      setArticles(data)
    } catch (err) {
      setError("Грешка при зареждане на новините")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
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
    <>
      <Header />
      <main className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Fuel className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
                Новини за горивата
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground text-pretty mb-8">
                Актуална информация и анализ на пазара на горива, генерирана с AI технология
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>AI-генерирано съдържание</span>
              </div>
            </div>
          </div>
        </section>

        {/* News Articles */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
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
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Опитай отново
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => {
                  const CardWrapper = article.link ? Link : 'div'
                  const wrapperProps = article.link 
                    ? { href: article.link, className: "block" }
                    : {}
                  
                  return (
                    <CardWrapper key={article.id} {...wrapperProps}>
                      <Card
                        className={`group hover:shadow-xl transition-all duration-300 hover-lift border-2 border-border hover:border-primary/50 ${
                          article.link ? 'cursor-pointer' : ''
                        }`}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between mb-2">
                            <Badge className={getCategoryColor(article.category)}>
                              {article.category}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              <span>{formatDate(article.date)}</span>
                            </div>
                          </div>
                          <CardTitle className="text-xl group-hover:text-primary transition-colors flex items-center gap-2">
                            {article.title}
                            {article.link && (
                              <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground leading-relaxed line-clamp-4">
                            {article.content}
                          </p>
                          {article.source && (
                            <div className="mt-4 pt-4 border-t border-border">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <TrendingUp className="w-3 h-3" />
                                <span>{article.source}</span>
                              </div>
                            </div>
                          )}
                          {article.link && (
                            <div className="mt-4 pt-4 border-t border-border">
                              <div className="flex items-center gap-2 text-sm text-primary font-medium group-hover:gap-3 transition-all">
                                <span>Прочети повече</span>
                                <ExternalLink className="w-4 h-4" />
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </CardWrapper>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-center text-2xl md:text-3xl">
                  За новините
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Нашите новини за горивата се генерират с помощта на AI технологии, които анализират пазарни данни,
                  трендове и актуална информация. Целта е да предоставим на нашите клиенти актуална и полезна информация
                  за пазара на горива, нови технологии и промени в индустрията.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Всички статии са внимателно проверени и актуализирани редовно, за да гарантираме точност и релевантност
                  на информацията. За актуални цени и оферти, моля проверете нашата страница с продукти.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

