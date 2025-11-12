'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'center',
    slidesToScroll: 1,
    containScroll: 'trimSnaps',
    loop: false,
  })

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  if (articles.length === 0) {
    return (
      <Card className="p-12">
        <CardContent className="text-center">
          <p className="text-muted-foreground text-lg">
            Няма намерени новини. Опитайте с различни критерии за търсене.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Групиране на новини по 2 на слайд (на десктоп)
  const slides: NewsArticle[][] = []
  for (let i = 0; i < articles.length; i += 2) {
    const pair = articles.slice(i, i + 2)
    slides.push(pair)
  }

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {slides.map((slideArticles, slideIndex) => (
            <div key={slideIndex} className="flex-[0_0_100%] md:flex-[0_0_50%] min-w-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                {slideArticles.map((article) => {
                  const publishedDate = dayjs(article.published_at)
                  const timeAgo = publishedDate.fromNow()

                  return (
                    <Card
                      key={article.id}
                      className="group hover-lift border-2 border-border hover:border-primary/50 transition-all duration-300 bg-gradient-card h-full"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h2 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors flex-1">
                            <a
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {article.title}
                            </a>
                          </h2>
                          <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{timeAgo}</span>
                          </div>
                          {article.source && (
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>{article.source}</span>
                            </div>
                          )}
                          {article.is_important && (
                            <Badge variant="destructive" className="ml-auto">
                              Важно
                            </Badge>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent>
                        {article.summary && (
                          <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                            {article.summary}
                          </p>
                        )}

                        {article.keywords && article.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {article.keywords.slice(0, 5).map((keyword, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-border">
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-semibold text-sm inline-flex items-center gap-1"
                          >
                            Прочети повече
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="outline"
        size="icon"
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 rounded-full w-12 h-12 shadow-lg bg-background hover:bg-muted"
        aria-label="Предишен слайд"
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={scrollNext}
        disabled={!canScrollNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 rounded-full w-12 h-12 shadow-lg bg-background hover:bg-muted"
        aria-label="Следващ слайд"
      >
        <ChevronRight className="w-6 h-6" />
      </Button>
    </div>
  )
}
