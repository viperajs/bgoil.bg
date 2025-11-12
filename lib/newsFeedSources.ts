import 'server-only'

/**
 * Конфигурация на RSS източници за новини за горива
 * 
 * Може да се добавя/премахва източници без redeploy чрез environment variables
 * или чрез админ интерфейс в бъдеще.
 */

export interface NewsSource {
  url: string
  name: string
  enabled?: boolean // По подразбиране true
  maxAgeDays?: number // Максимална възраст на статиите (по подразбиране 30)
}

// Базови източници - могат да се override-нат чрез env
const DEFAULT_SOURCES: NewsSource[] = [
  {
    url: 'https://www.dnevnik.bg/rss/?rubrid=3', // Икономика
    name: 'Дневник',
    enabled: true,
    maxAgeDays: 30,
  },
  {
    url: 'https://www.capital.bg/rss.xml', // Икономически новини
    name: 'Капитал',
    enabled: true,
    maxAgeDays: 30,
  },
  {
    url: 'https://www.mediapool.bg/rss.xml', // Общи новини (може да има енергетика)
    name: 'Mediapool',
    enabled: true,
    maxAgeDays: 30,
  },
  // Може да се добавят международни източници за Brent/WTI
  // {
  //   url: 'https://feeds.reuters.com/reuters/energy',
  //   name: 'Reuters Energy',
  //   enabled: true,
  //   maxAgeDays: 7,
  // },
]

/**
 * Взема активните източници от конфигурацията
 * 
 * Поддържа override чрез env variable NEWS_FEED_SOURCES (JSON масив)
 */
export function getActiveSources(): NewsSource[] {
  // Проверка за env override
  const envSources = process.env.NEWS_FEED_SOURCES
  if (envSources) {
    try {
      const parsed = JSON.parse(envSources) as NewsSource[]
      return parsed.filter(s => s.enabled !== false)
    } catch (e) {
      console.error('Failed to parse NEWS_FEED_SOURCES env:', e)
    }
  }
  
  // Връщане на default източници
  return DEFAULT_SOURCES.filter(s => s.enabled !== false)
}

