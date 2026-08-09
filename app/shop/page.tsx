"use client"

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { contacts } from "@/lib/config"
import { Badge } from "@/components/ui/badge"
import {
  ShoppingBag, Package, Clock, CreditCard, MapPin, Sparkles,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ArrowUpRight,
} from "lucide-react"
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
    <div className="group relative flex flex-col h-full overflow-hidden rounded-lg border border-border bg-card hover-lift">
      {/* Image area */}
      <div className="relative w-full aspect-square p-6 overflow-hidden flex items-center justify-center bg-secondary/40">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-110 ${isOutOfStock ? "grayscale opacity-40" : ""}`}
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-background/70 backdrop-blur-[2px] z-20 flex items-center justify-center">
            <span className="px-4 py-2 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-400 uppercase tracking-wider text-xs font-bold">
              Изчерпан
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3 z-20">
          <Badge className="text-[10px]">
            {product.category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 relative z-10">
        <h3 className="font-bold text-base text-foreground group-hover:text-brand-500 transition-colors mb-2 line-clamp-2 min-h-[3rem]">
          {product.name}
        </h3>

        <div className="mb-4 relative">
          <div className={`text-xs text-muted-foreground leading-relaxed overflow-hidden transition-all duration-300 ${expanded ? "max-h-48" : "max-h-[2.4em]"}`}>
            {product.description}
          </div>
          {product.description.length > 50 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-[11px] text-brand-500 hover:text-foreground mt-1.5 font-semibold transition-colors cursor-pointer"
            >
              {expanded
                ? <><ChevronUp className="w-3.5 h-3.5" /> Скрий</>
                : <><ChevronDown className="w-3.5 h-3.5" /> Виж повече</>
              }
            </button>
          )}
        </div>

        <div className="mt-auto space-y-3">
          {/* Prices */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground/70 mb-1">Редовна</p>
              <p className="text-sm font-bold text-muted-foreground line-through">€{product.price.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-brand-500 font-bold mb-1 uppercase tracking-wider">BG OIL Club</p>
              <p className="text-xl font-black text-foreground font-mono">
                €{product.cardPrice.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Savings badge */}
          <div className="w-full py-2.5 rounded-md flex items-center justify-center gap-2 border border-emerald-500/25 bg-emerald-500/10">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <p className="text-xs font-bold text-emerald-400 tracking-wide">
              Спестявате €{(product.price - product.cardPrice).toFixed(2)}
            </p>
          </div>

          {/* CTA button */}
          <a
            href={isOutOfStock ? undefined : contacts.mapsLink}
            target={isOutOfStock ? undefined : "_blank"}
            rel={isOutOfStock ? undefined : "noopener noreferrer"}
            className={`w-full flex items-center justify-center gap-1.5 text-center py-3 rounded-md font-bold text-sm transition-colors duration-200 ${isOutOfStock
              ? "bg-secondary text-muted-foreground/40 cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:bg-primary-hover cursor-pointer"
              }`}
          >
            {isOutOfStock ? "Недостъпен" : (
              <>Купи на място <ArrowUpRight className="w-3.5 h-3.5" /></>
            )}
          </a>
        </div>
      </div>
    </div>
  )
}

function ProductCarousel({ products }: { products: Product[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    containScroll: "trimSnaps",
    dragFree: true,
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
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi, onSelect, products])

  if (products.length === 0) return null

  return (
    <div className="relative">
      <button
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        aria-label="Предишни продукти"
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center text-foreground hover:text-brand-500 transition-colors -ml-2 md:-ml-5 lg:-ml-10 w-10 h-10 rounded-full cursor-pointer border border-border bg-card ${!canScrollPrev ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={scrollNext}
        disabled={!canScrollNext}
        aria-label="Следващи продукти"
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center text-foreground hover:text-brand-500 transition-colors -mr-2 md:-mr-5 lg:-mr-10 w-10 h-10 rounded-full cursor-pointer border border-border bg-card ${!canScrollNext ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="overflow-hidden px-1 md:px-0 py-4 -my-4" ref={emblaRef}>
        <div className="flex -ml-4 touch-pan-y">
          {products.map((product) => (
            <div key={product.id} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_25%] pl-4 min-w-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-1.5 mt-6 flex-wrap">
        {scrollSnaps.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${i === selectedIndex ? "w-6 bg-brand-500" : "w-1.5 bg-border"}`}
            aria-label={`Отиди на слайд ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Всички")
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => { if (data.ok) setProducts(data.products) })
      .catch((error) => console.error("Failed to load products:", error))
  }, [])

  const categories = ["Всички", ...Array.from(new Set(products.map((p) => p.category)))]
  const filteredProducts = selectedCategory === "Всички"
    ? products
    : products.filter((p) => p.category === selectedCategory)

  const features = [
    { icon: Package, title: "Качествени продукти", description: "Само оригинални и проверени авто продукти" },
    { icon: Clock, title: "24/7 наличност", description: "Винаги на разположение на нашата станция" },
    { icon: CreditCard, title: "Удобно плащане", description: "Кеш, карта и карти за гориво" },
    { icon: MapPin, title: "Лесна локация", description: "Директно на бензиностанцията във Враца" },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen text-foreground overflow-hidden">

        {/* Page Hero */}
        <section className="relative pt-28 sm:pt-36 pb-14 sm:pb-20 overflow-hidden">
          <div className="container relative z-10 px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 border border-border bg-card/60 backdrop-blur-xl"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-brand-500" />
              <span className="text-caption uppercase text-muted-foreground">Магазин</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-display text-foreground mb-6"
            >
              Premium авто части
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-body text-muted-foreground max-w-2xl mx-auto mb-12"
            >
              Всичко необходимо за вашия автомобил. Налично 24/7.
            </motion.p>

            {/* Club discount banner */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-flex flex-col sm:flex-row items-center gap-5 p-5 md:px-8 rounded-lg max-w-3xl mx-auto border border-brand-500/25 bg-card"
            >
              <div className="w-10 h-10 rounded-full border border-brand-500/25 bg-brand-500/10 flex items-center justify-center shrink-0 text-brand-500">
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-base font-bold text-foreground">
                  -10% отстъпка с карта <span className="text-brand-500">BG OIL CLUB</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Важи за всички продукти в магазина при представяне на карта.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features strip */}
        <section className="py-14 relative overflow-hidden border-y border-border bg-card/30">
          <div className="container px-4 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="text-center p-6 rounded-lg border border-border bg-card hover-lift"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-md border border-border bg-secondary flex items-center justify-center text-brand-500">
                    <f.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-sm mb-1.5 text-foreground">{f.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {f.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Products section */}
        <section className="py-24 relative">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
              <div>
                <h2 className="text-h2 text-foreground mb-2">Нашите продукти</h2>
                <p className="text-muted-foreground text-sm">
                  Избрани продукти с гарантирано качество
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-colors duration-200 cursor-pointer border ${selectedCategory === cat
                      ? "bg-primary text-primary-foreground border-transparent"
                      : "text-muted-foreground border-border bg-card hover:text-foreground hover:bg-secondary"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <ProductCarousel products={filteredProducts} />
            ) : (
              <div className="py-20 text-center rounded-lg border border-dashed border-border">
                <Package className="w-14 h-14 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  Няма намерени продукти в тази категория
                </p>
              </div>
            )}
          </div>
        </section>

        {/* How to buy */}
        <section className="py-24 relative overflow-hidden">
          <div className="container px-4 mx-auto">
            <div className="rounded-lg p-6 sm:p-10 md:p-16 border border-border bg-card">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 border border-border bg-secondary">
                  <span className="text-caption uppercase text-muted-foreground">Купуване</span>
                </div>
                <h2 className="text-h1 text-foreground mb-6">Как да закупите?</h2>
                <p className="text-body text-muted-foreground mb-8">
                  Всички продукти са налични на място. Заповядайте на нашата станция, където нашият екип ще ви консултира.
                </p>

                <div className="space-y-3">
                  {[
                    { icon: MapPin, text: contacts.address },
                    { icon: Clock, text: "Отворено 24/7" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full border border-border bg-secondary flex items-center justify-center shrink-0 text-brand-500">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
