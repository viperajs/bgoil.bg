import 'server-only'
import { getDb, hashId } from './db'
import crypto from 'crypto'

// Типове за новини
export type NewsStatus = 'NEW' | 'PARSED' | 'SUMMARIZED' | 'PUBLISHED' | 'ERROR'

export interface NewsFeedArticle {
  id: string // хеш на URL
  url: string
  title: string
  source: string // име/домейн на източника
  publishedAt: string // ISO дата
  language: 'bg' | 'en'
  summary: string // AI резюме на български (3-4 изречения)
  keywords: string[] // основни ключови думи
  fullContent?: string // пълно съдържание (за вътрешно)
  indexedAt: string // ISO дата на индексиране
  status: NewsStatus
  category?: string // Цени, Екология, Качество, Индустрия, Оферти, Безопасност
  isImportant?: boolean // маркиране за важни новини
  errorMessage?: string // ако status = ERROR
}

// ---- Извличане на домейн от URL ----
function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.replace('www.', '')
  } catch {
    return 'unknown'
  }
}

// ---- Четене на всички статии ----
export async function getAllNewsArticles(): Promise<NewsFeedArticle[]> {
  const db = getDb()
  
  try {
    const rows = db.prepare(`
      SELECT id, url, title, source, published_at, lang, summary_bg, topics, status, created_at
      FROM articles
      ORDER BY published_at DESC
    `).all() as Array<{
      id: string
      url: string
      title: string
      source: string
      published_at: string
      lang: string
      summary_bg: string
      topics: string
      status: string
      created_at: string
    }>
    
    return rows.map(row => ({
      id: row.id,
      url: row.url,
      title: row.title,
      source: row.source,
      publishedAt: row.published_at,
      language: (row.lang || 'bg') as 'bg' | 'en',
      summary: row.summary_bg || '',
      keywords: row.topics ? row.topics.split(',').filter(Boolean) : [],
      indexedAt: row.created_at,
      status: row.status as NewsStatus,
    }))
  } catch (e) {
    console.error('newsFeedStore: getAllNewsArticles failed:', (e as Error).message)
    return []
  }
}

// ---- Четене на публикувани статии (филтрирани) ----
export async function getPublishedNewsArticles(filters?: {
  limit?: number
  from?: string
  to?: string
  source?: string
  language?: 'bg' | 'en'
  category?: string
  search?: string
  topic?: string // Филтър по topic (по подразбиране 'fuels')
}): Promise<NewsFeedArticle[]> {
  const db = getDb()
  
  try {
    let sql = `
      SELECT id, url, title, source, published_at, lang, summary_bg, topics, status, created_at
      FROM articles
      WHERE status = 'PUBLISHED'
    `
    const params: any[] = []
    
    // Филтър по topic е премахнат - филтрирането се прави на клиентската страна
    // Това е защото колоната topic може да не съществува в базата данни
    
    if (filters?.from) {
      sql += ` AND published_at >= ?`
      params.push(filters.from)
    }
    
    if (filters?.to) {
      sql += ` AND published_at <= ?`
      params.push(filters.to)
    }
    
    if (filters?.source) {
      sql += ` AND LOWER(source) LIKE ?`
      params.push(`%${filters.source.toLowerCase()}%`)
    }
    
    if (filters?.language) {
      sql += ` AND lang = ?`
      params.push(filters.language)
    }
    
    if (filters?.search) {
      sql += ` AND (LOWER(title) LIKE ? OR LOWER(summary_bg) LIKE ?)`
      const searchTerm = `%${filters.search.toLowerCase()}%`
      params.push(searchTerm, searchTerm)
    }
    
    sql += ` ORDER BY published_at DESC`
    
    if (filters?.limit) {
      sql += ` LIMIT ?`
      params.push(filters.limit)
    }
    
    const rows = db.prepare(sql).all(...params) as Array<{
      id: string
      url: string
      title: string
      source: string
      published_at: string
      lang: string
      summary_bg: string | null
      topics: string | null
      status: string
      created_at: string
    }>
    
    return rows.map(row => ({
      id: row.id,
      url: row.url,
      title: row.title,
      source: row.source,
      publishedAt: row.published_at,
      language: (row.lang || 'bg') as 'bg' | 'en',
      summary: row.summary_bg || '',
      keywords: row.topics ? row.topics.split(',').filter(Boolean) : [],
      indexedAt: row.created_at,
      status: row.status as NewsStatus,
    }))
  } catch (e) {
    const error = e as Error
    console.error('newsFeedStore: getPublishedNewsArticles failed:', error.message)
    console.error('Stack:', error.stack)
    return []
  }
}

// ---- Запис на статия ----
export async function saveNewsArticle(article: Omit<NewsFeedArticle, 'id' | 'indexedAt'>): Promise<NewsFeedArticle> {
  const db = getDb()
  const id = hashId(article.url)
  const domain = extractDomain(article.url)
  
  const fullArticle: NewsFeedArticle = {
    ...article,
    id,
    source: article.source || domain,
    indexedAt: new Date().toISOString(),
    status: article.status || 'NEW',
  }
  
  try {
    const stmt = db.prepare(`
      INSERT INTO articles (id, url, title, source, published_at, lang, summary_bg, topics, status)
      VALUES (@id, @url, @title, @source, @published_at, @lang, @summary_bg, @topics, @status)
      ON CONFLICT(url) DO UPDATE SET
        title = excluded.title,
        source = excluded.source,
        published_at = excluded.published_at,
        lang = excluded.lang,
        summary_bg = COALESCE(NULLIF(excluded.summary_bg, ''), articles.summary_bg),
        topics = excluded.topics,
        status = excluded.status
    `)
    
    stmt.run({
      id: fullArticle.id,
      url: fullArticle.url,
      title: fullArticle.title,
      source: fullArticle.source,
      published_at: fullArticle.publishedAt,
      lang: fullArticle.language,
      summary_bg: fullArticle.summary || '',
      topics: fullArticle.keywords.join(','),
      status: fullArticle.status,
    })
    
    return fullArticle
  } catch (e) {
    console.error('newsFeedStore: saveNewsArticle failed:', (e as Error).message)
    throw e
  }
}

// ---- Проверка дали статия съществува (дедупликация) ----
export async function articleExists(url: string): Promise<boolean> {
  const db = getDb()
  const id = hashId(url)
  
  try {
    const row = db.prepare('SELECT 1 FROM articles WHERE id = ?').get(id)
    return row != null
  } catch (e) {
    console.error('newsFeedStore: articleExists failed:', (e as Error).message)
    return false
  }
}

// ---- Маркиране на важни новини (за сега не се поддържа в SQLite схемата, но запазваме интерфейса) ----
export async function markAsImportant(articleId: string): Promise<void> {
  // За сега не се поддържа в SQLite схемата
  // Може да се добави колона is_important в бъдеще
  console.log(`Marking article ${articleId} as important (not yet implemented in SQLite)`)
}

// ---- Статистика ----
export async function getStats(): Promise<{
  total: number
  published: number
  byStatus: Record<NewsStatus, number>
  byLanguage: { bg: number; en: number }
  byCategory: Record<string, number>
}> {
  const db = getDb()
  
  try {
    const totalRow = db.prepare('SELECT COUNT(*) as count FROM articles').get() as { count: number }
    const publishedRow = db.prepare("SELECT COUNT(*) as count FROM articles WHERE status = 'PUBLISHED'").get() as { count: number }
    
    const statusRows = db.prepare(`
      SELECT status, COUNT(*) as count
      FROM articles
      GROUP BY status
    `).all() as Array<{ status: string; count: number }>
    
    const langRows = db.prepare(`
      SELECT lang, COUNT(*) as count
      FROM articles
      GROUP BY lang
    `).all() as Array<{ lang: string; count: number }>
    
    const stats = {
      total: totalRow.count,
      published: publishedRow.count,
      byStatus: {
        NEW: 0,
        PARSED: 0,
        SUMMARIZED: 0,
        PUBLISHED: 0,
        ERROR: 0,
      } as Record<NewsStatus, number>,
      byLanguage: { bg: 0, en: 0 },
      byCategory: {} as Record<string, number>,
    }
    
    for (const row of statusRows) {
      if (row.status in stats.byStatus) {
        stats.byStatus[row.status as NewsStatus] = row.count
      }
    }
    
    for (const row of langRows) {
      if (row.lang === 'bg' || row.lang === 'en') {
        stats.byLanguage[row.lang as 'bg' | 'en'] = row.count
      }
    }
    
    return stats
  } catch (e) {
    console.error('newsFeedStore: getStats failed:', (e as Error).message)
    return {
      total: 0,
      published: 0,
      byStatus: { NEW: 0, PARSED: 0, SUMMARIZED: 0, PUBLISHED: 0, ERROR: 0 },
      byLanguage: { bg: 0, en: 0 },
      byCategory: {},
    }
  }
}
