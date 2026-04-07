"use client"

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { contacts } from "@/lib/config"
import { Badge } from "@/components/ui/badge"
import {
  ShoppingBag, Package, Clock, CreditCard, MapPin, Sparkles,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ArrowUpRight,
} from "lucide-react"
import { useState, useEffect, useCallback, useRef } from "react"
import * as motion from "motion/react-client"
import useEmblaCarousel from "embla-carousel-react"
import Tilt3DCard from "@/components/Tilt3DCard"

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
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25 }}
      className="group relative flex flex-col h-full overflow-hidden rounded-2xl glass-depth animated-gradient-border transition-all duration-500"
      style={{ border: "1px solid rgba(255,255,255,0.06)" }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)" }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)" }}
    >
      {/* Image area */}
      <div className="relative w-full aspect-square p-6 overflow-hidden flex items-center justify-center"
        style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(239,68,68,0.04), transparent)" }} />
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-110 ${isOutOfStock ? "grayscale opacity-40" : ""}`}
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
            <span className="px-4 py-2 rounded-full border backdrop-blur-md uppercase tracking-wider text-xs font-bold"
              style={{ background: "rgba(239,68,68,0.12)", color: "#f87171", borderColor: "rgba(239,68,68,0.3)" }}>
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
          <div className={`text-xs text-white/35 leading-relaxed overflow-hidden transition-all duration-300 ${expanded ? "max-h-48" : "max-h-[2.4em]"}`}
            style={{ fontFamily: "var(--font-sans)", textTransform: "none" }}>
            {product.description}
          </div>
          {product.description.length > 50 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-[11px] text-primary hover:text-white mt-1.5 font-semibold transition-colors cursor-pointer"
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
              <p className="text-[10px] text-white/25 mb-1">Редовна</p>
              <p className="text-sm font-bold text-white/45 line-through">€{product.price.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-primary font-bold mb-1 uppercase tracking-wider">BG OIL Club</p>
              <p className="text-xl font-black text-white" style={{ fontFamily: "var(--font-mono)" }}>
                €{product.cardPrice.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Savings badge */}
          <div
            className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2"
            style={{
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.3)",
              boxShadow: "0 0 12px rgba(34,197,94,0.08)",
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-green-400" />
            <p className="text-xs font-bold text-green-400 tracking-wide">
              Спестявате €{(product.price - product.cardPrice).toFixed(2)}
            </p>
          </div>

          {/* CTA button */}
          <a
            href={isOutOfStock ? undefined : contacts.mapsLink}
            target={isOutOfStock ? undefined : "_blank"}
            rel={isOutOfStock ? undefined : "noopener noreferrer"}
            className={`w-full flex items-center justify-center gap-1.5 text-center py-3 rounded-xl font-bold text-sm transition-all duration-300 ${isOutOfStock
              ? "bg-white/[0.03] text-white/15 cursor-not-allowed"
              : "bg-white text-black hover:bg-primary hover:text-white cursor-pointer hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.06)]"
              }`}
          >
            {isOutOfStock ? "Недостъпен" : (
              <>Купи на място <ArrowUpRight className="w-3.5 h-3.5" /></>
            )}
          </a>
        </div>
      </div>
    </motion.div>
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
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center text-white hover:text-primary transition-all -ml-2 md:-ml-5 lg:-ml-10 w-10 h-10 rounded-full cursor-pointer ${!canScrollPrev ? "opacity-0 pointer-events-none" : "opacity-100"}`}
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center text-white hover:text-primary transition-all -mr-2 md:-mr-5 lg:-mr-10 w-10 h-10 rounded-full cursor-pointer ${!canScrollNext ? "opacity-0 pointer-events-none" : "opacity-100"}`}
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
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
              className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${i === selectedIndex ? "w-6 bg-primary" : "w-1.5 bg-white/[0.08]"}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </motion.div>
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
    { icon: Package, title: "Качествени Продукти", description: "Само оригинални и проверени авто продукти", color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)" },
    { icon: Clock, title: "24/7 Наличност", description: "Винаги на разположение на нашата станция", color: "#f97316", bg: "rgba(249,115,22,0.08)", border: "rgba(249,115,22,0.2)" },
    { icon: CreditCard, title: "Удобно Плащане", description: "Кеш, карта и карти за гориво", color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.2)" },
    { icon: MapPin, title: "Лесна Локация", description: "Директно на бензиностанцията във Враца", color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)" },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen text-white overflow-hidden">

        {/* Page Hero */}
        <section className="relative pt-28 sm:pt-36 pb-14 sm:pb-20 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] rounded-full"
              style={{ background: "radial-gradient(ellipse, rgba(239,68,68,0.07), transparent 60%)", filter: "blur(100px)" }} />
            <div className="absolute inset-0 opacity-[0.012]"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }} />
          </div>

          <div className="container relative z-10 px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 backdrop-blur-xl"
              style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)" }}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">Магазин</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 tracking-tight"
            >
              Premium <span className="text-gradient-primary">Авто Части</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg text-white/35 max-w-2xl mx-auto mb-12"
              style={{ fontFamily: "var(--font-sans)", textTransform: "none", letterSpacing: "0.01em" }}
            >
              Всичко необходимо за вашия автомобил. Налично 24/7.
            </motion.p>

            {/* Club discount banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.4 }}
              className="inline-flex flex-col sm:flex-row items-center gap-5 p-5 md:px-8 rounded-2xl max-w-3xl mx-auto glass-depth"
              style={{ border: "1px solid rgba(239,68,68,0.18)", boxShadow: "0 0 30px rgba(239,68,68,0.06)" }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)" }}>
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-base font-bold text-white">
                  -10% отстъпка с карта <span className="text-primary">BG OIL CLUB</span>
                </p>
                <p className="text-xs text-white/30"
                  style={{ fontFamily: "var(--font-sans)", textTransform: "none" }}>
                  Важи за всички продукти в магазина при представяне на карта.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features strip */}
        <section className="py-14 relative overflow-hidden"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.008)" }}>
          <div className="container px-4 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5" style={{ perspective: "1000px" }}>
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30, rotateX: 10, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Tilt3DCard className="text-center group p-6 rounded-2xl cursor-default glass-depth animated-gradient-border" intensity={8} glowColor={f.bg}>
                    <div
                      className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-400 group-hover:scale-110"
                      style={{ background: f.bg, border: `1px solid ${f.border}` }}
                    >
                      <f.icon className="w-6 h-6 transition-colors duration-300" style={{ color: f.color }} />
                    </div>
                    <h3 className="font-bold text-sm mb-1.5 text-white">{f.title}</h3>
                    <p className="text-xs text-white/30"
                      style={{ fontFamily: "var(--font-sans)", textTransform: "none" }}>
                      {f.description}
                    </p>
                  </Tilt3DCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Products section */}
        <section className="py-24 relative">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-black mb-2">Нашите Продукти</h2>
                <p className="text-white/30 text-sm"
                  style={{ fontFamily: "var(--font-sans)", textTransform: "none" }}>
                  Избрани продукти с гарантирано качество
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex flex-wrap gap-2"
              >
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${selectedCategory === cat
                      ? "bg-primary text-white shadow-[0_0_18px_rgba(239,68,68,0.35)]"
                      : "text-white/40 hover:bg-white/[0.08] hover:text-white/70"
                      }`}
                    style={selectedCategory !== cat ? { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" } : {}}
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
                className="py-20 text-center rounded-2xl glass-depth border border-dashed border-white/[0.06]"
              >
                <Package className="w-14 h-14 text-white/10 mx-auto mb-4" />
                <p className="text-sm text-white/30"
                  style={{ fontFamily: "var(--font-sans)", textTransform: "none" }}>
                  Няма намерени продукти в тази категория
                </p>
              </motion.div>
            )}
          </div>
        </section>

        {/* How to buy */}
        <section className="py-24 relative overflow-hidden">
          <div className="container px-4 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85 }}
              className="rounded-3xl p-6 sm:p-10 md:p-16 relative overflow-hidden glass-depth animated-gradient-border"
              style={{ border: "1px solid rgba(255,255,255,0.07)" }}
            >
              {/* Background gradient */}
              <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"
                style={{ background: "linear-gradient(to left, rgba(239,68,68,0.04), transparent)" }} />

              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(239,68,68,0.35), transparent)" }} />

              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6"
                  style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">Купуване</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-6">Как да закупите?</h2>
                <p className="text-base text-white/35 mb-8 leading-relaxed"
                  style={{ fontFamily: "var(--font-sans)", textTransform: "none", letterSpacing: "0.01em" }}>
                  Всички продукти са налични на място. Заповядайте на нашата станция, където нашият екип ще ви консултира.
                </p>

                <div className="space-y-3">
                  {[
                    { icon: MapPin, text: contacts.address },
                    { icon: Clock, text: "Отворено 24/7" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 group cursor-default">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-white/55 group-hover:text-white/75 transition-colors"
                        style={{ fontFamily: "var(--font-sans)", textTransform: "none" }}>
                        {item.text}
                      </span>
                    </div>
                  ))}
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
