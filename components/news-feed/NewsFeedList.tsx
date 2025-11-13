'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Calendar, User } from "lucide-react"
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
  }

  // Показваме всички новини в центриран grid layout
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  )
}
