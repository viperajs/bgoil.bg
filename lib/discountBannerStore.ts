import 'server-only'
import { promises as fs } from 'fs'
import path from 'path'

export interface DiscountBannerConfig {
  enabled: boolean
  message: string
  startAt?: string | null
  endAt?: string | null
}

const DATA_DIR = path.join(process.cwd(), 'data')
const DISCOUNT_BANNER_FILE = path.join(DATA_DIR, 'discount-banner.json')

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Read discount banner config
export async function getDiscountBannerConfig(): Promise<DiscountBannerConfig> {
  try {
    await ensureDataDir()
    const content = await fs.readFile(DISCOUNT_BANNER_FILE, 'utf-8')
    return JSON.parse(content) as DiscountBannerConfig
  } catch (error) {
    // Return default if file doesn't exist
    const defaultConfig: DiscountBannerConfig = {
      enabled: true,
      message: '💳 С карта BG OIL имате 10 % отстъпка при закупуване стоки от магазина на бензиностанцията',
      startAt: null,
      endAt: null,
    }
    await saveDiscountBannerConfig(defaultConfig)
    return defaultConfig
  }
}

// Save discount banner config
export async function saveDiscountBannerConfig(config: DiscountBannerConfig): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(DISCOUNT_BANNER_FILE, JSON.stringify(config, null, 2), 'utf-8')
}

// Check if discount banner is active
export function isDiscountBannerActive(config: DiscountBannerConfig): boolean {
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

// Get active discount banner message (for server components)
export async function getActiveDiscountBannerMessage(): Promise<string | null> {
  const config = await getDiscountBannerConfig()
  if (isDiscountBannerActive(config)) {
    return config.message
  }
  return null
}


















