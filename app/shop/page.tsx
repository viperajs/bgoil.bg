'use client'

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { contacts } from "@/lib/config"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Package, Clock, CreditCard, MapPin, Sparkles, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Check } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"
import * as motion from "motion/react-client"
import useEmblaCarousel from "embla-carousel-react"
import { useCallback } from "react"

// Product interface
interface Product {
  id: number
  name: string
  description: string
  price: number
  cardPrice: number
  stock: number
  category: string
  image: string
}

// Product Card Component with new glass design
function ProductCard({ product }: { product: Product }) {
  const [expanded, setExpanded] = useState(false)
  const isOutOfStock = product.stock === 0

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="glass-card group relative flex flex-col h-full overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:border-white/20"
    >
      {/* Image Area */}
      <div className="relative w-full aspect-square bg-white/5 p-6 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-110 drop-shadow-2xl ${isOutOfStock ? 'grayscale opacity-50' : ''}`}
        />

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
            <span className="px-4 py-2 bg-red-600/20 text-red-200 font-bold rounded-full border border-red-500/50 shadow-xl backdrop-blur-md uppercase tracking-wider text-sm">
              Изчерпан
            </span>
          </div>
        )}

        <div className="absolute top-3 left-3 z-20">
          <Badge className="bg-primary/90 hover:bg-primary text-white border-0 backdrop-blur-md shadow-lg">
            {product.category}
          </Badge>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 p-5 relative z-10">
        <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors mb-2 line-clamp-2 min-h-[3.5rem]">
          {product.name}
        </h3>

        {/* Description - Fixed Height to prevent layout shift */}
        <div className="mb-4 relative">
          <div className={`text-sm text-white/50 leading-relaxed transition-all duration-300 ${expanded ? 'h-24 overflow-y-auto pr-2 custom-scrollbar' : 'h-[2.6em] line-clamp-2 overflow-hidden'}`}>
            {product.description}
          </div>

          {product.description.length > 50 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-xs text-primary hover:text-white mt-2 font-medium transition-colors"
            >
              {expanded ? (
                <><ChevronUp className="w-3 h-3" /> Скрий</>
              ) : (
                <><ChevronDown className="w-3 h-3" /> Виж повече</>
              )}
            </button>
          )}
        </div>

        <div className="mt-auto space-y-4">
          {/* Prices */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-white/40 mb-1">Редовна цена</p>
              <p className="text-lg font-bold text-white/80 line-through decoration-white/30 decoration-2">€{product.price.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-primary font-bold mb-1 uppercase tracking-wide">BG OIL Club</p>
              <p className="text-2xl font-black text-white">€{product.cardPrice.toFixed(2)}</p>
            </div>
          </div>

          {/* Savings Badge */}
          <div className="w-full py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-center gap-2">
            <Sparkles className="w-3 h-3 text-green-400" />
            <p className="text-xs font-bold text-green-400">
              Спестявате €{(product.price - product.cardPrice).toFixed(2)}
            </p>
          </div>

          {/* Button */}
          <a
            href={isOutOfStock ? undefined : contacts.mapsLink}
            target={isOutOfStock ? undefined : '_blank'}
            rel={isOutOfStock ? undefined : 'noopener noreferrer'}
            className={`w-full block text-center py-3.5 rounded-xl font-bold transition-all duration-300 ${isOutOfStock
              ? 'bg-white/5 text-white/20 cursor-not-allowed'
              : 'bg-white text-black hover:bg-primary hover:text-white shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]'
              }`}
          >
            {isOutOfStock ? 'Недостъпен' : 'Купи на място'}
          </a>
        </div>
      </div>
    </motion.div>
  )
}

function ProductCarousel({ products }: { products: Product[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: false,
    containScroll: 'trimSnaps',
    dragFree: true
  })

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect, products])

  if (products.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative group/carousel"
    >
      {/* Controls */}
      {products.length > 0 && (
        <>
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white transition-all border border-white/10 -ml-2 md:-ml-6 ${!canScrollPrev ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:bg-primary hover:text-white'}`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white transition-all border border-white/10 -mr-2 md:-mr-6 ${!canScrollNext ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:bg-primary hover:text-white'}`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Embla Viewport */}
      <div className="overflow-hidden px-1 md:px-0 py-4 -my-4" ref={emblaRef}>
        <div className="flex -ml-4 touch-pan-y">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_25%] pl-4 min-w-0"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots (Mobile & Desktop) */}
      {products.length > 0 && (
        <div className="flex justify-center gap-2 mt-6 flex-wrap">
          {scrollSnaps.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === selectedIndex ? 'w-8 bg-primary' : 'w-1.5 bg-white/10'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Всички')
  const [products, setProducts] = useState<Product[]>([])

  // Load products
  useEffect(() => {
    fetch('/api/admin/products')
      .then(res => res.json())
      .then(data => {
        if (data.ok) setProducts(data.products)
      })
      .catch(error => console.error('Failed to load products:', error))
  }, [])

  const categories = ['Всички', ...Array.from(new Set(products.map((p) => p.category)))]
  const filteredProducts = selectedCategory === 'Всички'
    ? products
    : products.filter((p) => p.category === selectedCategory)

  const features = [
    { icon: Package, title: "Качествени Продукти", description: "Само оригинални и проверени авто продукти" },
    { icon: Clock, title: "24/7 Наличност", description: "Винаги на разположение на нашата станция" },
    { icon: CreditCard, title: "Удобно Плащане", description: "Кеш, карта и карти за гориво" },
    { icon: MapPin, title: "Лесна Локация", description: "Директно на бензиностанцията във Враца" }
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">

        {/* Dynamic Hero */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="container relative z-10 px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md"
            >
              <ShoppingBag className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/50">Магазин</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-7xl font-black mb-6 tracking-tight"
            >
              Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Авто Части</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl text-white/50 max-w-2xl mx-auto font-light mb-12"
            >
              Всичко необходимо за вашия автомобил. Налично 24/7.
            </motion.p>

            {/* Discount Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="glass-card inline-flex flex-col sm:flex-row items-center gap-6 p-6 md:px-10 max-w-3xl mx-auto border-primary/20 bg-primary/5"
            >
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-lg font-bold text-white">
                  -10% отстъпка с карта <span className="text-primary">BG OIL CLUB</span>
                </p>
                <p className="text-sm text-white/50">Важи за всички продукти в магазина при представяне на карта.</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-12 border-y border-white/5 bg-white/[0.02]">
          <div className="container px-4 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center group"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-500">
                    <f.icon className="w-8 h-8 text-white group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-white/40">{f.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-24 relative">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl font-black mb-2">Нашите Продукти</h2>
                <p className="text-white/40">Избрани продукти с гарантирано качество</p>
              </motion.div>

              {/* Category Filter */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex flex-wrap gap-2"
              >
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${selectedCategory === cat
                      ? 'bg-primary text-white shadow-lg shadow-primary/25'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </motion.div>
            </div>

            {filteredProducts.length > 0 ? (
              <ProductCarousel products={filteredProducts} />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center glass-card border-dashed"
              >
                <Package className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-lg text-white/40">Няма намерени продукти в тази категория</p>
              </motion.div>
            )}

          </div>
        </section>

        {/* Info Section */}
        <section className="py-24">
          <div className="container px-4 mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="glass-card p-10 md:p-16 rounded-[2.5rem] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none"></div>

              <div className="relative z-10 max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-black mb-6">Как да закупите?</h2>
                <p className="text-xl text-white/60 mb-8 leading-relaxed">
                  Всички продукти са налични на място. Заповядайте на нашата станция, където нашият екип ще ви консултира.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-lg font-medium">{contacts.address}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-lg font-medium">Отворено 24/7</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
