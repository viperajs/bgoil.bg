import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Проверява дали текущата дата е след или на 01.01.2026
 * Ако е, трябва да се показват само цени в EUR, без BGN
 */
export function shouldShowOnlyEUR(): boolean {
  const cutoffDate = new Date('2026-01-01T00:00:00')
  const now = new Date()
  return now >= cutoffDate
}
