import 'server-only'
import { saveNewsArticle, articleExists, markAsImportant } from './newsFeedStore'
import type { NewsFeedArticle, NewsStatus } from './newsFeedStore'
import { isFuelRelevant, STRONG_FUEL } from './newsFeedRelevance'

// Правила за важни новини
const IMPORTANT_TRIGGERS = [
  'акциз', 'санкции', 'спиране на рафинерия', 'регулаторни промени',
  'tax', 'sanctions', 'refinery shutdown', 'regulatory'
]

// ---- Проверка за релевантност ----
// Използваме по-строгия филтър от newsFeedRelevance, който изключва политика, заплати и т.н.
export function isRelevant(title: string, content: string, url: string = ''): boolean {
  return isFuelRelevant(title, content, url)
}

// ---- Проверка за важна новина ----
export function isImportant(title: string, content: string): boolean {
  const text = `${title} ${content}`.toLowerCase()
  return IMPORTANT_TRIGGERS.some(trigger => text.includes(trigger.toLowerCase()))
}

// ---- Детекция на език (базова) ----
export function detectLanguage(text: string): 'bg' | 'en' {
  // Проста евристика: ако има кирилица -> български
  const cyrillicPattern = /[А-Яа-яЁё]/
  return cyrillicPattern.test(text) ? 'bg' : 'en'
}

// ---- Парсиране на RSS feed ----
export async function parseRSSFeed(feedUrl: string, sourceName: string): Promise<{
  articles: Array<{
    title: string
    url: string
    content: string
    publishedAt: string
    language: 'bg' | 'en'
  }>
  errors: string[]
}> {
  const articles: Array<{
    title: string
    url: string
    content: string
    publishedAt: string
    language: 'bg' | 'en'
  }> = []
  const errors: string[] = []
  
  try {
    // Fetch RSS feed
    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BG OIL News Feed Bot)',
      },
      next: { revalidate: 300 } // Cache за 5 минути
    })
    
    if (!response.ok) {
      errors.push(`HTTP ${response.status} for ${feedUrl}`)
      return { articles, errors }
    }
    
    const xmlText = await response.text()
    
    // Парсиране на XML (базово, без библиотека)
    const items = extractRSSItems(xmlText)
    
    for (const item of items) {
      try {
        const title = item.title || ''
        const url = item.link || ''
        const content = item.description || item.content || ''
        const pubDate = item.pubDate || new Date().toISOString()
        
        if (!url || !title) {
          continue
        }
        
        // Проверка за релевантност (използваме по-строг филтър който изключва политика, заплати и т.н.)
        if (!isRelevant(title, content, url)) {
          continue
        }
        
        // Проверка за дата (не по-стари от 48 часа за първоначално филтриране)
        // По-строга филтрация ще се направи в processNewsFeed с maxAgeDays
        const publishedDate = parseDate(pubDate)
        const daysDiff = (Date.now() - publishedDate.getTime()) / (1000 * 60 * 60 * 24)
        if (daysDiff > 48) {
          continue
        }
        
        const language = detectLanguage(`${title} ${content}`)
        
        articles.push({
          title: cleanText(title),
          url: cleanUrl(url),
          content: cleanText(content),
          publishedAt: publishedDate.toISOString(),
          language,
        })
      } catch (e) {
        errors.push(`Failed to parse item: ${(e as Error).message}`)
      }
    }
  } catch (e) {
    errors.push(`Failed to fetch RSS: ${(e as Error).message}`)
  }
  
  return { articles, errors }
}

// ---- Извличане на items от RSS XML ----
function extractRSSItems(xmlText: string): Array<{
  title?: string
  link?: string
  description?: string
  content?: string
  pubDate?: string
}> {
  const items: Array<{
    title?: string
    link?: string
    description?: string
    content?: string
    pubDate?: string
  }> = []
  
  // Просто парсиране на XML (за по-сложни случаи може да се използва библиотека)
  const itemMatches = xmlText.matchAll(/<item[^>]*>([\s\S]*?)<\/item>/gi)
  
  for (const match of itemMatches) {
    const itemXml = match[1]
    const item: {
      title?: string
      link?: string
      description?: string
      content?: string
      pubDate?: string
    } = {}
    
    // Извличане на title
    const titleMatch = itemXml.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
    if (titleMatch) {
      item.title = stripHtmlTags(titleMatch[1])
    }
    
    // Извличане на link
    const linkMatch = itemXml.match(/<link[^>]*>([\s\S]*?)<\/link>/i)
    if (linkMatch) {
      item.link = stripHtmlTags(linkMatch[1]).trim()
    }
    
    // Извличане на description
    const descMatch = itemXml.match(/<description[^>]*>([\s\S]*?)<\/description>/i)
    if (descMatch) {
      item.description = stripHtmlTags(descMatch[1])
    }
    
    // Извличане на content:encoded (за WordPress feeds)
    const contentMatch = itemXml.match(/<content:encoded[^>]*>([\s\S]*?)<\/content:encoded>/i)
    if (contentMatch) {
      item.content = stripHtmlTags(contentMatch[1])
    }
    
    // Извличане на pubDate
    const dateMatch = itemXml.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)
    if (dateMatch) {
      item.pubDate = stripHtmlTags(dateMatch[1]).trim()
    }
    
    items.push(item)
  }
  
  return items
}

// ---- Премахване на HTML тагове ----
function stripHtmlTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()
}

// ---- Почистване на текст ----
function cleanText(text: string): string {
  return stripHtmlTags(text)
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 10000) // Ограничаване на дължината
}

// ---- Почистване на URL ----
function cleanUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.toString()
  } catch {
    return url.trim()
  }
}

// ---- Парсиране на дата ----
function parseDate(dateStr: string): Date {
  try {
    const parsed = new Date(dateStr)
    if (!isNaN(parsed.getTime())) {
      return parsed
    }
  } catch {}
  
  // Fallback към текущата дата
  return new Date()
}

// ---- Извличане на ключови думи ----
export function extractKeywords(title: string, content: string): string[] {
  const text = `${title} ${content}`.toLowerCase()
  const keywords: string[] = []
  
  // Силни ключови думи за горива
  const STRONG_KEYWORDS = STRONG_FUEL
  
  // Вторични (поддържащи) термини
  const RELATED_KEYWORDS = [
    'цени', 'котировки', 'пазар', 'barrel', 'нефт', 'търговия', 'energy market',
    'petrochemical', 'refinery', 'pipeline', 'доставка', 'склад', 'резерви',
    'gas station', 'бензиностанции', 'газстанция'
  ]
  
  // Добавяне на намерените ключови думи
  for (const kw of [...STRONG_KEYWORDS, ...RELATED_KEYWORDS]) {
    if (text.includes(kw.toLowerCase())) {
      keywords.push(kw)
    }
  }
  
  // Премахване на дубликати
  return [...new Set(keywords)].slice(0, 10) // Максимум 10 ключови думи
}

// ---- AI резюме с Google Gemini API ----
// ВАЖНО: Gemini Free tier има лимит от 15 RPM (requests per minute)
// За да спазваме този лимит, в processNewsFeed() има 5 секунди пауза между заявки
export async function generateAISummary(
  title: string,
  content: string,
  language: 'bg' | 'en'
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY // Използваме същата променлива за Gemini ключа

  // Ако няма API ключ, използваме fallback метод
  if (!apiKey) {
    console.warn('Gemini API key not found, using fallback summary')
    return generateFallbackSummary(title, content, language)
  }

  try {
    // Ограничаваме дължината на текста за API заявката
    const textToSummarize = (content || title).substring(0, 8000)

    // Подготвяме промпта за Gemini
    const prompt = language === 'bg'
      ? `Ти си експерт по енергийни пазари и горива. Създай кратко резюме на български език от следната статия.

Резюмето трябва да бъде:
- 3-4 изречения, фактологично и неутрално
- Запазвай числа, дати и конкретни данни
- Без маркетингови суперлативи
- На български език, дори ако оригиналът е на друг език
- Фокус върху ключовата информация за пазара на горива

Заглавие: ${title}

Съдържание:
${textToSummarize}

Създай кратко резюме на български език (3-4 изречения):`
      : `You are an expert in energy markets and fuels. Create a brief summary in Bulgarian from the following article.

The summary should be:
- 3-4 sentences, factual and neutral
- Preserve numbers, dates and specific data
- No marketing superlatives
- In Bulgarian language, even if the original is in another language
- Focus on key information about fuel markets

Title: ${title}

Content:
${textToSummarize}

Create a brief summary in Bulgarian (3-4 sentences):`

    // Извикваме Google Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 300,
        }
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Gemini API error:', response.status, errorData)
      return generateFallbackSummary(title, content, language)
    }

    const data = await response.json()
    const summary = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

    if (summary && summary.length > 20) {
      return summary.substring(0, 500)
    }

    // Fallback ако отговорът е невалиден
    return generateFallbackSummary(title, content, language)
  } catch (error) {
    console.error('Failed to generate AI summary:', error)
    return generateFallbackSummary(title, content, language)
  }
}

// ---- Fallback резюме (ако AI не е наличен) ----
function generateFallbackSummary(
  title: string,
  content: string,
  language: 'bg' | 'en'
): string {
  const text = content || title
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20)

  if (sentences.length === 0) {
    return language === 'bg'
      ? 'Статия за горива и енергийни пазари.'
      : 'Article about fuels and energy markets.'
  }

  // Вземаме първите 3-4 изречения и ги форматираме
  const summary = sentences.slice(0, 4)
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .join('. ')
    .trim()

  // Добавяме точка в края ако няма
  const finalSummary = summary.endsWith('.') ? summary : summary + '.'

  return finalSummary.substring(0, 500)
}

// ---- Функция за забавяне (throttling) ----
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ---- Основен ETL процес за един източник ----
export async function processNewsFeed(
  feedUrl: string,
  sourceName: string,
  maxAgeDays: number = 30
): Promise<{
  found: number // Общо намерени статии
  filtered_out: number // Отхвърлени поради нерелевантност/стари/дубликати
  summarized: number // Успешно резюмирани
  published: number // Публикувани в базата
  errors: string[]
}> {
  const result = {
    found: 0,
    filtered_out: 0,
    summarized: 0,
    published: 0,
    errors: [] as string[],
  }
  
  try {
    // Парсиране на RSS
    const { articles, errors } = await parseRSSFeed(feedUrl, sourceName)
    result.errors.push(...errors)
    result.found = articles.length
    
    // Обработка на всяка статия със забавяне за спазване на rate limits
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i]
      try {
        // Проверка за дата (не по-стари от maxAgeDays)
        const publishedDate = new Date(article.publishedAt)
        const daysDiff = (Date.now() - publishedDate.getTime()) / (1000 * 60 * 60 * 24)
        if (daysDiff > maxAgeDays) {
          result.filtered_out++
          continue
        }

        // Проверка за дубликати
        if (await articleExists(article.url)) {
          result.filtered_out++
          continue
        }

        // Генериране на резюме
        const summary = await generateAISummary(
          article.title,
          article.content,
          article.language
        )

        if (!summary || summary.length < 20) {
          result.filtered_out++
          result.errors.push(`Failed to generate summary for ${article.url}`)
          continue
        }

        result.summarized++

        // Извличане на ключови думи
        const keywords = extractKeywords(article.title, article.content)

        // Определяне на категория (базова логика)
        const category = determineCategory(article.title, article.content)

        // Проверка за важна новина
        const important = isImportant(article.title, article.content)

        // Запис в базата със статус PUBLISHED
        const savedArticle = await saveNewsArticle({
          url: article.url,
          title: article.title,
          source: sourceName,
          publishedAt: article.publishedAt,
          language: article.language,
          summary,
          keywords,
          fullContent: article.content.substring(0, 50000), // Ограничаване
          status: 'PUBLISHED' as NewsStatus,
          category,
          isImportant: important,
        })

        if (important) {
          await markAsImportant(savedArticle.id)
        }

        result.published++

        // Забавяне след всяка AI заявка за спазване на rate limit
        // Gemini Free tier: 15 RPM (requests per minute)
        // 60000ms / 15 = 4000ms между заявки
        // Използваме 5000ms (5 секунди) за безопасност
        if (i < articles.length - 1) {
          console.log(`[processNewsFeed] Processed ${i + 1}/${articles.length}, waiting 5s before next...`)
          await sleep(5000)
        }
      } catch (e) {
        result.errors.push(`Failed to process article ${article.url}: ${(e as Error).message}`)
        result.filtered_out++
      }
    }
  } catch (e) {
    result.errors.push(`ETL process failed for ${sourceName}: ${(e as Error).message}`)
  }
  
  return result
}

// ---- Ръчно обновяване на всички източници (on-demand) ----
export async function refreshNewsFeed(): Promise<{
  total_found: number
  total_filtered_out: number
  total_summarized: number
  total_published: number
  sources: Array<{
    source: string
    found: number
    filtered_out: number
    summarized: number
    published: number
    errors: string[]
  }>
  errors: string[]
}> {
  const { getActiveSources } = await import('./newsFeedSources')
  const sources = getActiveSources()
  
  const result = {
    total_found: 0,
    total_filtered_out: 0,
    total_summarized: 0,
    total_published: 0,
    sources: [] as Array<{
      source: string
      found: number
      filtered_out: number
      summarized: number
      published: number
      errors: string[]
    }>,
    errors: [] as string[],
  }
  
  console.log(`[refreshNewsFeed] Starting refresh for ${sources.length} sources...`)
  
  // Обработка на всеки източник последователно
  for (const sourceConfig of sources) {
    try {
      console.log(`[refreshNewsFeed] Processing ${sourceConfig.name}...`)
      
      const sourceResult = await processNewsFeed(
        sourceConfig.url,
        sourceConfig.name,
        sourceConfig.maxAgeDays || 30
      )
      
      result.total_found += sourceResult.found
      result.total_filtered_out += sourceResult.filtered_out
      result.total_summarized += sourceResult.summarized
      result.total_published += sourceResult.published
      
      result.sources.push({
        source: sourceConfig.name,
        ...sourceResult,
      })
      
      if (sourceResult.errors.length > 0) {
        result.errors.push(...sourceResult.errors.map(e => `[${sourceConfig.name}] ${e}`))
      }
      
      console.log(`[refreshNewsFeed] ${sourceConfig.name}: found=${sourceResult.found}, published=${sourceResult.published}`)
    } catch (e) {
      const errorMsg = `Failed to process source ${sourceConfig.name}: ${(e as Error).message}`
      result.errors.push(errorMsg)
      console.error(`[refreshNewsFeed] ${errorMsg}`)
    }
  }
  
  console.log(`[refreshNewsFeed] Completed: published=${result.total_published}, errors=${result.errors.length}`)
  
  return result
}

// ---- Определяне на категория ----
function determineCategory(title: string, content: string): string {
  const text = `${title} ${content}`.toLowerCase()
  
  if (text.includes('акциз') || text.includes('регулация') || text.includes('tax') || text.includes('regulation')) {
    return 'Регулации'
  }
  if (text.includes('екология') || text.includes('екологичен') || text.includes('eco') || text.includes('green')) {
    return 'Екология'
  }
  if (text.includes('качество') || text.includes('стандарт') || text.includes('quality') || text.includes('standard')) {
    return 'Качество'
  }
  if (text.includes('рафинерия') || text.includes('логистика') || text.includes('refinery') || text.includes('logistics')) {
    return 'Индустрия'
  }
  if (text.includes('оферта') || text.includes('отстъпка') || text.includes('offer') || text.includes('discount')) {
    return 'Оферти'
  }
  if (text.includes('безопасност') || text.includes('safety') || text.includes('security')) {
    return 'Безопасност'
  }
  
  return 'Цени' // По подразбиране
}

