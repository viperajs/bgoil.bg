'use client'

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Calendar, User, ChevronLeft, ChevronRight } from "lucide-react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import "dayjs/locale/bg"

// Инициализация на dayjs
dayjs.extend(relativeTime)
dayjs.locale('bg')

interface NewsArticle {
  id: string
  title: string
  url: string
  source: string
  published_at: string
  summary: string
  keywords?: string[]
  category?: string
  language: 'bg' | 'en'
  is_important?: boolean
}

interface NewsFeedListProps {
  articles: NewsArticle[]
}

export default function NewsFeedList({ articles }: NewsFeedListProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

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

  // Автоматична смяна на всеки 8 секунди
  useEffect(() => {
    if (articles.length <= 1) return

    const autoPlayInterval = setInterval(() => {
      goToNext()
    }, 8000) // 8 секунди

    return () => clearInterval(autoPlayInterval)
  }, [articles.length, goToNext])

  if (articles.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="p-12">
          <CardContent className="text-center">
            <p className="text-muted-foreground text-lg">
              Няма намерени новини. Опитайте с различни критерии за търсене.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Компонент за показване на една новина
  const NewsCard = ({ article }: { article: NewsArticle }) => {
    const publishedDate = dayjs(article.published_at)
    const timeAgo = publishedDate.fromNow()

    return (
      <Card
        className="group relative overflow-hidden hover-lift border-2 border-border hover:border-primary/50 transition-all duration-500 bg-gradient-card h-full shadow-lg hover:shadow-2xl"
      >
        {/* Gradient Background Effect */}
        <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>

        {/* Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Corner Decoration */}
        <div className="absolute top-0 right-0 w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-primary rounded-bl-full"></div>
        </div>

        <CardHeader className="pb-4 relative z-10">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h2 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors flex-1 leading-tight">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {article.title}
              </a>
            </h2>
            <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-all flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100" />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
              <Calendar className="w-3.5 h-3.5" />
              <span className="font-medium">{timeAgo}</span>
            </div>
            {article.source && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                <User className="w-3.5 h-3.5" />
                <span className="font-medium">{article.source}</span>
              </div>
            )}
            {article.is_important && (
              <Badge variant="destructive" className="shadow-sm">
                🔥 Важно
              </Badge>
            )}
            {article.category && (
              <Badge className="bg-primary/10 text-primary border-primary/20 shadow-sm">
                {article.category}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="relative z-10">
          {article.summary && (
            <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-4 text-sm md:text-base">
              {article.summary}
            </p>
          )}

          {article.keywords && article.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/50">
              {article.keywords.slice(0, 5).map((keyword, idx) => (
                <Badge key={idx} variant="outline" className="text-xs bg-background/50 hover:bg-primary/10 transition-colors">
                  {keyword}
                </Badge>
              ))}
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-border/50">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold text-sm md:text-base inline-flex items-center gap-2 group-hover:gap-3 transition-all"
            >
              <span>Прочети повече</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </CardContent>

        {/* Shine Effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 shine opacity-20"></div>
      </Card>
    )
  }

  // Карусел с една новина
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="relative flex items-center gap-4 md:gap-8">
        {/* Навигационни бутони - Ляв */}
        {articles.length > 1 && (
          <button
            onClick={goToPrevious}
            className="flex-shrink-0 bg-white/95 dark:bg-gray-900/95 hover:bg-white dark:hover:bg-gray-900 text-primary rounded-full p-2.5 md:p-4 shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:scale-110 border-2 border-primary/30 hover:border-primary backdrop-blur-sm"
            aria-label="Предишна новина"
          >
            <ChevronLeft className="w-5 h-5 md:w-8 md:h-8" />
          </button>
        )}

        {/* Карусел контейнер */}
        <div className="flex-1 overflow-hidden">
          <div
            className="transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            <div className="flex">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="w-full flex-shrink-0"
                >
                  <NewsCard article={article} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Навигационни бутони - Десен */}
        {articles.length > 1 && (
          <button
            onClick={goToNext}
            className="flex-shrink-0 bg-white/95 dark:bg-gray-900/95 hover:bg-white dark:hover:bg-gray-900 text-primary rounded-full p-2.5 md:p-4 shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:scale-110 border-2 border-primary/30 hover:border-primary backdrop-blur-sm"
            aria-label="Следваща новина"
          >
            <ChevronRight className="w-5 h-5 md:w-8 md:h-8" />
          </button>
        )}
      </div>

      {/* Индикатори */}
      {articles.length > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {articles.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-10 h-3 bg-primary'
                  : 'w-3 h-3 bg-primary/30 hover:bg-primary/50'
              }`}
              aria-label={`Виж новина ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/*Брояч */}
      {articles.length > 1 && (
        <div className="text-center mt-4">
          <span className="text-sm text-muted-foreground font-medium">
            {currentIndex + 1} / {articles.length}
          </span>
        </div>
      )}
    </div>
  )
}
