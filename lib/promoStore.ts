import 'server-only'
import { promises as fs } from 'fs'
import path from 'path'

export interface PromoConfig {
  enabled: boolean
  kind: 'promo' | 'news'
  title?: string
  message: string
  ctaText?: string
  ctaUrl?: string
  startAt?: string | null
  endAt?: string | null
}

const DATA_DIR = path.join(process.cwd(), 'data')
const PROMO_FILE = path.join(DATA_DIR, 'promo.json')

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Read promo config
export async function getPromoConfig(): Promise<PromoConfig> {
  try {
    await ensureDataDir()
    const content = await fs.readFile(PROMO_FILE, 'utf-8')
    return JSON.parse(content) as PromoConfig
  } catch (error) {
    // Return default if file doesn't exist
    const defaultConfig: PromoConfig = {
      enabled: false,
      kind: 'promo',
      title: '',
      message: '',
      ctaText: '',
      ctaUrl: '',
      startAt: null,
      endAt: null,
    }
    await savePromoConfig(defaultConfig)
    return defaultConfig
  }
}

// Save promo config
export async function savePromoConfig(config: PromoConfig): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(PROMO_FILE, JSON.stringify(config, null, 2), 'utf-8')
}

// Check if promo is active
export function isPromoActive(config: PromoConfig): boolean {
  if (!config.enabled) return false
  
  const now = new Date()
  
  if (config.startAt) {
    const startAt = new Date(config.startAt)
    if (now < startAt) return false
  }
  
  if (config.endAt) {
    const endAt = new Date(config.endAt)
    if (now > endAt) return false
  }
  
  return true
}












