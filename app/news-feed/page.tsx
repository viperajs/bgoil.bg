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
      <main className="min-h-screen pt-20 bg-gradient-to-b from-background via-muted/20 to-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Новини за горива
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Събираме новините за бензин, дизел, LPG и суров петрол. Резюмета на български.
              </p>
            </div>
          </div>
        </section>

        {/* News List */}
        <div className="container mx-auto px-4 pb-12">
          {loading ? (
            <Card className="p-12">
              <CardContent className="flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Зареждане на новини...</span>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="p-12 border-red-300 bg-red-50">
              <CardContent className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={() => fetchNews()}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Опитай отново
                </button>
              </CardContent>
            </Card>
          ) : filteredArticles.length > 0 ? (
            <NewsFeedList articles={filteredArticles} />
          ) : (
            <Card className="p-12">
              <CardContent className="text-center">
                <p className="text-muted-foreground text-lg mb-2">
                  Няма нови новини за показване.
                </p>
                <p className="text-sm text-muted-foreground">
                  Показват се само новини за горива и бензиностанции, публикувани в последните 7 дни.
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

