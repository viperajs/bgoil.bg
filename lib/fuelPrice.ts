import type { Fuel } from "@/lib/types"
import { BGN_PER_EUR } from "@/lib/config"

/**
 * Цените на горивата се пазят вътрешно в лева (така ги записва админ панелът),
 * а публичният сайт ги показва само в евро.
 */
export interface FuelPriceEUR {
  price: number
  member: number
  saving: number
}

export function fuelPriceEUR(fuel: Fuel): FuelPriceEUR {
  const priceBGN = fuel.price
  const fallbackMember = typeof fuel.memberPrice === "number" ? fuel.memberPrice : priceBGN
  const discountBGN =
    typeof fuel.discount === "number" ? fuel.discount : Math.max(0, priceBGN - fallbackMember)
  const memberBGN = Math.max(0, priceBGN - discountBGN)

  return {
    price: priceBGN / BGN_PER_EUR,
    member: memberBGN / BGN_PER_EUR,
    saving: discountBGN / BGN_PER_EUR,
  }
}

export const eur = (n: number) => n.toFixed(2)

export type FuelKind = "petrol" | "diesel" | "lpg" | "adblue"

/** Вид гориво по име — за цвета на пистолета и иконата. */
export function fuelKind(name: string): FuelKind {
  const n = name.toLowerCase().replace(/\s+/g, "")
  if (n.includes("adblue")) return "adblue"
  if (n.includes("дизел") || n.includes("diesel")) return "diesel"
  if (n.includes("гпб") || n.includes("газ") || n.includes("lpg") || n.includes("gas")) return "lpg"
  return "petrol"
}

/** Цветове на пистолетите на колонката: зелен бензин, черен дизел, жълт газ, син AdBlue. */
export const nozzleColor: Record<FuelKind, string> = {
  petrol: "#1fa34a",
  diesel: "#131316",
  lpg: "#f5a300",
  adblue: "#1d6fd8",
}

export function fuelLabel(name: string) {
  return name.replace("Diesel", "Дизел").replace("Gasoline", "Бензин").replace("Г П Б", "ГПБ")
}
