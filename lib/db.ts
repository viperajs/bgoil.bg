import 'server-only'
import Database from 'better-sqlite3'
import { createHash } from 'crypto'
import path from 'path'
import fs from 'fs'

// Път към SQLite базата данни
const DB_PATH = process.env.NEWS_DB_PATH || path.join(process.cwd(), 'news.db')

// Създаване на директорията ако не съществува
const dbDir = path.dirname(DB_PATH)
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

// Инициализация на базата данни
let db: Database.Database | null = null

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH)
    
    // Включване на foreign keys
    db.pragma('foreign_keys = ON')
    
    // Създаване на таблиците ако не съществуват
    db.exec(`
      CREATE TABLE IF NOT EXISTS articles (
        id TEXT PRIMARY KEY,
        url TEXT UNIQUE,
        title TEXT,
        source TEXT,
        published_at TEXT,
        lang TEXT,
        summary_bg TEXT,
        topics TEXT,
        status TEXT DEFAULT 'PUBLISHED',
        created_at TEXT DEFAULT (datetime('now'))
      );
      
      CREATE INDEX IF NOT EXISTS idx_pub ON articles(published_at);
      CREATE INDEX IF NOT EXISTS idx_source ON articles(source);
      CREATE INDEX IF NOT EXISTS idx_status ON articles(status);
    `)
    
    // Добавяне на нови колони ако не съществуват (миграция)
    try {
      db.exec(`
        ALTER TABLE articles ADD COLUMN key_facts TEXT;
        ALTER TABLE articles ADD COLUMN entities TEXT;
        ALTER TABLE articles ADD COLUMN topic TEXT DEFAULT 'fuels';
        ALTER TABLE articles ADD COLUMN lead_image TEXT;
        ALTER TABLE articles ADD COLUMN author TEXT;
        ALTER TABLE articles ADD COLUMN reading_time INTEGER;
      `)
    } catch (e) {
      // Колоните вече съществуват или има друга грешка - игнорираме
    }
    
    // Миграция: задаване на default стойност 'fuels' за съществуващи статии без topic
    try {
      db.exec(`
        UPDATE articles SET topic = 'fuels' WHERE topic IS NULL;
        CREATE INDEX IF NOT EXISTS idx_topic ON articles(topic);
      `)
    } catch (e) {
      // Индексът вече съществува или има друга грешка - игнорираме
    }
  }
  
  return db
}

// Генериране на ID от URL (SHA-256 хеш)
export function hashId(url: string): string {
  return createHash('sha256').update(url).digest('hex').slice(0, 32)
}

// Затваряне на базата данни (за graceful shutdown)
export function closeDb(): void {
  if (db) {
    db.close()
    db = null
  }
}

