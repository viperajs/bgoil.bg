import fs from 'fs/promises'
import path from 'path'

export interface Product {
  id: number
  name: string
  description: string
  price: number
  cardPrice: number // Цена с карта BG OIL
  stock: number
  category: string
  image: string
}

const dataDir = path.join(process.cwd(), 'data')
const productsFile = path.join(dataDir, 'products.json')

// Default products
const defaultProducts: Product[] = [
  {
    id: 1,
    name: 'Cooltech Антифриз G11 -30°C 5л',
    description: 'Висококачествен син антифриз G11 за защита до -30°C. Готов за употреба. Осигурява надеждна защита на двигателя през цялата година.',
    price: 9.15,
    cardPrice: 8.24,
    stock: 20,
    category: 'Антифриз',
    image: '/products/antifreeze-sheron-g11-5l.png',
  },
  {
    id: 2,
    name: 'Cooltech Антифриз Концентрат -60°C 1л',
    description: 'Висококачествен син антифриз концентрат за защита до -60°C. Компактен размер за доливане и разреждане.',
    price: 1.99,
    cardPrice: 1.79,
    stock: 50,
    category: 'Антифриз',
    image: '/products/antifreeze-sevan-1l.png',
  },
  {
    id: 3,
    name: 'Cooltech Antifreeze Long Life S12+ 5л',
    description: 'Премиум червен антифриз S12+ с алуминиева защита и дълготраен живот. Подходящ за VW/Audi, Ford, Volvo, Mercedes, Opel.',
    price: 10.69,
    cardPrice: 9.62,
    stock: 20,
    category: 'Антифриз',
    image: '/products/antifreeze-north-s12-5l.png',
  },
  {
    id: 4,
    name: 'Cooltech Longlife G12 -60°C 1кг',
    description: 'Премиум червен антифриз G12 с дълготрайна защита до -60°C. Високоефективна охлаждаща течност.',
    price: 3.02,
    cardPrice: 2.72,
    stock: 50,
    category: 'Антифриз',
    image: '/products/antifreeze-winterworld-g12-1kg.png',
  },
]

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(dataDir, { recursive: true })
  } catch (error) {
    console.error('Error creating data directory:', error)
  }
}

// Get all products
export async function getProducts(): Promise<Product[]> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(productsFile, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    // If file doesn't exist, create it with default products
    await saveProducts(defaultProducts)
    return defaultProducts
  }
}

// Save all products
export async function saveProducts(products: Product[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(productsFile, JSON.stringify(products, null, 2), 'utf-8')
}

// Get a single product by ID
export async function getProductById(id: number): Promise<Product | null> {
  const products = await getProducts()
  return products.find((p) => p.id === id) || null
}

// Update a product
export async function updateProduct(id: number, updates: Partial<Product>): Promise<Product | null> {
  const products = await getProducts()
  const index = products.findIndex((p) => p.id === id)

  if (index === -1) {
    return null
  }

  products[index] = { ...products[index], ...updates, id } // Keep the same ID
  await saveProducts(products)
  return products[index]
}

// Add a new product
export async function addProduct(product: Omit<Product, 'id'>): Promise<Product> {
  const products = await getProducts()
  const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1
  const newProduct = { ...product, id: newId }
  products.push(newProduct)
  await saveProducts(products)
  return newProduct
}

// Delete a product
export async function deleteProduct(id: number): Promise<boolean> {
  const products = await getProducts()
  const filtered = products.filter((p) => p.id !== id)

  if (filtered.length === products.length) {
    return false // Product not found
  }

  await saveProducts(filtered)
  return true
}
