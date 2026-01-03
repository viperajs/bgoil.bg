import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Показва само цени в EUR, без BGN
 */
export function shouldShowOnlyEUR(): boolean {
  return true
}
