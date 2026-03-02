'use client'

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { contacts } from "@/lib/config"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Package, Clock, CreditCard, MapPin, Sparkles, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import * as motion from "motion/react-client"
import useEmblaCarousel from "embla-carousel-react"

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

function ProductCard({ product }: { product: Product }) {
  const [expanded, setExpanded] = useState(false)
  const isOutOfStock = product.stock === 0

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col h-full overflow-hidden rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-500"
    >
      {/* Image */}
      <div className="relative w-full aspect-square bg-white/[0.03] p-6 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-110 ${isOutOfStock ? 'grayscale opacity-40' : ''}`}
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
            <span className="px-4 py-2 bg-red-600/15 text-red-300 font-bold rounded-full border border-red-500/30 backdrop-blur-md uppercase tracking-wider text-xs">
              Изчерпан
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3 z-20">
          <Badge className="bg-primary/80 hover:bg-primary text-white border-0 backdrop-blur-md text-[10px]">
            {product.category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 relative z-10">
        <h3 className="font-bold text-base text-white group-hover:text-primary transition-colors mb-2 line-clamp-2 min-h-[3rem]">
          {product.name}
        </h3>

        <div className="mb-4 relative">
          <div className={`text-xs text-white/35 leading-relaxed transition-all duration-300 ${expanded ? 'h-20 overflow-y-auto pr-2' : 'h-[2.4em] line-clamp-2 overflow-hidden'}`}>
            {product.description}
          </div>
          {product.description.length > 50 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-[10px] text-primary hover:text-white mt-1.5 font-medium transition-colors"
            >
              {expanded ? <><ChevronUp className="w-3 h-3" /> Скрий</> : <><ChevronDown className="w-3 h-3" /> Виж повече</>}
            </button>
          )}
        </div>

        <div className="mt-auto space-y-3">
          {/* Prices */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] text-white/25 mb-1">Редовна</p>
              <p className="text-sm font-bold text-white/50 line-through">€{product.price.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-primary font-bold mb-1 uppercase tracking-wider">BG OIL Club</p>
              <p className="text-xl font-black text-white">€{product.cardPrice.toFixed(2)}</p>
            </div>
          </div>

          {/* Savings */}
          <div className="w-full py-1.5 bg-green-500/[0.06] border border-green-500/15 rounded-lg flex items-center justify-center gap-1.5">
            <Sparkles className="w-3 h-3 text-green-400" />
            <p className="text-[10px] font-bold text-green-400">
              Спестявате €{(product.price - product.cardPrice).toFixed(2)}
            </p>
          </div>

          {/* Button */}
          <a
            href={isOutOfStock ? undefined : contacts.mapsLink}
            target={isOutOfStock ? undefined : '_blank'}
            rel={isOutOfStock ? undefined : 'noopener noreferrer'}
            className={`w-full block text-center py-3 rounded-xl font-bold text-sm transition-all duration-300 ${isOutOfStock
              ? 'bg-white/[0.03] text-white/15 cursor-not-allowed'
              : 'bg-white text-black hover:bg-primary hover:text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]'
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative"
    >
      {products.length > 0 && (
        <>
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white transition-all border border-white/[0.06] -ml-2 md:-ml-5 ${!canScrollPrev ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:bg-primary'}`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white transition-all border border-white/[0.06] -mr-2 md:-mr-5 ${!canScrollNext ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:bg-primary'}`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      <div className="overflow-hidden px-1 md:px-0 py-4 -my-4" ref={emblaRef}>
        <div className="flex -ml-4 touch-pan-y">
          {products.map((product) => (
            <div key={product.id} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_25%] pl-4 min-w-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {products.length > 0 && (
        <div className="flex justify-center gap-1.5 mt-6 flex-wrap">
          {scrollSnaps.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`h-1 rounded-full transition-all duration-300 ${i === selectedIndex ? 'w-6 bg-primary' : 'w-1.5 bg-white/[0.08]'}`}
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

  useEffect(() => {
    fetch('/api/admin/products')
      .then(res => res.json())
      .then(data => { if (data.ok) setProducts(data.products) })
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
      <main className="min-h-screen text-white overflow-hidden">

        {/* Hero */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/[0.04] rounded-full blur-[120px] pointer-events-none"></div>

          <div className="container relative z-10 px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] mb-8 backdrop-blur-xl"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">Магазин</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-7xl font-black mb-6 tracking-tight"
            >
              Premium <span className="text-gradient-primary">Авто Части</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg text-white/35 max-w-2xl mx-auto mb-12"
            >
              Всичко необходимо за вашия автомобил. Налично 24/7.
            </motion.p>

            {/* Discount banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="inline-flex flex-col sm:flex-row items-center gap-5 p-5 md:px-8 rounded-2xl bg-primary/[0.04] border border-primary/15 backdrop-blur-xl max-w-3xl mx-auto"
            >
              <div className="w-10 h-10 rounded-full bg-primary/[0.12] flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-base font-bold text-white">
                  -10% отстъпка с карта <span className="text-primary">BG OIL CLUB</span>
                </p>
                <p className="text-xs text-white/30">Важи за всички продукти в магазина при представяне на карта.</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 border-y border-white/[0.04] bg-white/[0.01]">
          <div className="container px-4 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="text-center group"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/[0.04] border border-white/[0.05] flex items-center justify-center group-hover:bg-primary/[0.08] transition-colors duration-500">
                    <f.icon className="w-6 h-6 text-white/40 group-hover:text-primary transition-colors duration-300" />
                  </div>
                  <h3 className="font-bold text-sm mb-1.5">{f.title}</h3>
                  <p className="text-xs text-white/30">{f.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="py-24 relative">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-black mb-2">Нашите Продукти</h2>
                <p className="text-white/30 text-sm">Избрани продукти с гарантирано качество</p>
              </motion.div>

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
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${selectedCategory === cat
                      ? 'bg-primary text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                      : 'bg-white/[0.04] text-white/40 hover:bg-white/[0.08] border border-white/[0.05]'
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
                className="py-20 text-center rounded-2xl bg-white/[0.02] border border-dashed border-white/[0.06]"
              >
                <Package className="w-14 h-14 text-white/10 mx-auto mb-4" />
                <p className="text-sm text-white/30">Няма намерени продукти в тази категория</p>
              </motion.div>
            )}
          </div>
        </section>

        {/* How to buy */}
        <section className="py-24">
          <div className="container px-4 mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="rounded-3xl p-10 md:p-16 relative overflow-hidden bg-white/[0.02] border border-white/[0.05]"
            >
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/[0.05] to-transparent pointer-events-none"></div>

              <div className="relative z-10 max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-black mb-6">Как да закупите?</h2>
                <p className="text-base text-white/35 mb-8 leading-relaxed">
                  Всички продукти са налични на място. Заповядайте на нашата станция, където нашият екип ще ви консултира.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-white/[0.05] border border-white/[0.06] flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-white/60">{contacts.address}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-white/[0.05] border border-white/[0.06] flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-white/60">Отворено 24/7</span>
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
