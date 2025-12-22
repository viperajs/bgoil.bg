'use client'

import { useState, useEffect } from 'react'
import { Sparkles } from "lucide-react"
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

interface NewsConfig {
  enabled: boolean
}

export default function NewsSection() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [config, setConfig] = useState<NewsConfig | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNews()
    // Refresh every 60 seconds
    const interval = setInterval(fetchNews, 60000)
    return () => clearInterval(interval)
  }, [])

  async function fetchNews() {
    try {
      setLoading(true)
      
      // Fetch config first to check if news is enabled
      const configRes = await fetch('/api/news/config', { cache: 'no-store' })
      if (configRes.ok) {
        const configData = await configRes.json()
        if (configData.ok) {
          setConfig(configData.config)
          
          // Only fetch articles if news is enabled
          if (!configData.config.enabled) {
            setArticles([])
            setLoading(false)
            return
          }
        }
      }

      // Fetch news articles
      const res = await fetch('/api/news', { cache: 'no-store' })
      if (!res.ok) {
        setArticles([])
        return
      }
      
      const data = await res.json()
      if (Array.isArray(data)) {
        // Take only first 3 articles
        setArticles(data.slice(0, 3))
      }
    } catch (error) {
      console.error('Failed to fetch news:', error)
      setArticles([])
    } finally {
      setLoading(false)
    }
  }

  // Don't render if news is disabled or no config loaded yet
  if (loading || !config || !config.enabled || articles.length === 0) {
    return null
  }

  return (
    <section id="нови" className="relative py-16 sm:py-20 lg:py-28 bg-gradient-to-b from-muted/20 via-background to-muted/30 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full mb-6 backdrop-blur-sm border border-primary/20">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary">Актуални новини</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6">
            <span className="text-gradient-primary">Новини</span> за горивата
          </h2>
        </div>

        {/* News Items - 3 divs in discount banner style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {articles.map((article, index) => {
            const content = article.content.length > 120 
              ? article.content.substring(0, 120) + '...' 
              : article.content

            const newsDiv = (
              <div 
                key={article.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="inline-flex items-center space-x-3 px-6 py-4 bg-gradient-to-r from-green-500/20 via-green-400/20 to-green-500/20 rounded-2xl border-2 border-green-400/40 backdrop-blur-md shadow-2xl shadow-green-500/20 hover-lift transition-all duration-300 w-full">
                  <Sparkles className="w-5 h-5 text-green-300 animate-pulse flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    {article.title && (
                      <h3 className="text-lg md:text-xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mb-2">
                        {article.title}
                      </h3>
                    )}
                    <p className="text-sm md:text-base text-white/95 drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
                      {content}
                    </p>
                    {article.category && (
                      <div className="mt-2">
                        <span className="text-xs px-2 py-1 bg-white/20 rounded-full text-white/90">
                          {article.category}
                        </span>
                      </div>
                    )}
                  </div>
                  <Sparkles className="w-5 h-5 text-green-300 animate-pulse flex-shrink-0" style={{ animationDelay: '0.5s' }} />
                </div>
              </div>
            )

            // If article has a link, wrap in Link component
            if (article.link) {
              return (
                <Link key={article.id} href={article.link} className="block">
                  {newsDiv}
                </Link>
              )
            }

            return newsDiv
          })}
        </div>
      </div>
    </section>
  )
}
