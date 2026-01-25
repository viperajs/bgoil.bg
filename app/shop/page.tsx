'use client'

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { contacts } from "@/lib/config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Package, Clock, CreditCard, MapPin, Sparkles, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect, useRef } from "react"

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

// Product Card Component with expand functionality
function ProductCard({ product, index }: { product: Product; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const isOutOfStock = product.stock === 0

  return (
    <div className="group relative bg-card rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 lg:hover:-translate-y-1 flex flex-col overflow-hidden shadow-lg h-full">
      {/* Product Image */}
      <div className="relative w-full aspect-square bg-muted/50 overflow-hidden flex-shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
        />
        {isOutOfStock && (
          <div className="absolute top-3 right-3 bg-destructive text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            Изчерпан
          </div>
        )}
        <Badge
          variant="secondary"
          className="absolute top-3 left-3 bg-primary/90 text-white border-0 text-xs"
        >
          {product.category}
        </Badge>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 min-w-0">
        {/* Name */}
        <h3 className="font-bold text-lg lg:text-base text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Description - expandable on both mobile and desktop */}
        <div className="mb-3">
          <p className={`text-sm text-muted-foreground ${expanded ? '' : 'line-clamp-2'}`}>
            {product.description}
          </p>
          {product.description.length > 50 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 mt-2 font-medium"
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Скрий
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Виж повече
                </>
              )}
            </button>
          )}
        </div>

        {/* Mobile: Full price display like desktop */}
        <div className="lg:hidden mt-auto space-y-3">
          {/* Regular Price */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Редовна цена:</span>
            <span className="text-lg font-bold text-foreground">
              €{product.price.toFixed(2)}
            </span>
          </div>

          {/* Card Price */}
          <div className="flex items-center justify-between bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg px-3 py-2">
            <span className="text-sm font-semibold text-primary">С карта BG OIL:</span>
            <span className="text-xl font-black text-primary">
              €{product.cardPrice.toFixed(2)}
            </span>
          </div>

          {/* Savings */}
          <p className="text-sm text-center text-green-500 font-semibold">
            Спестявате €{(product.price - product.cardPrice).toFixed(2)}!
          </p>

          {/* Stock Status */}
          <div className="flex items-center justify-center py-1">
            {isOutOfStock ? (
              <div className="flex items-center text-destructive">
                <span className="w-2 h-2 rounded-full bg-destructive mr-2 animate-pulse"></span>
                <span className="text-sm font-semibold">Няма наличност</span>
              </div>
            ) : (
              <div className="flex items-center text-green-500">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                <span className="text-sm font-semibold">В наличност</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <a
            href={isOutOfStock ? undefined : contacts.mapsLink}
            target={isOutOfStock ? undefined : '_blank'}
            rel={isOutOfStock ? undefined : 'noopener noreferrer'}
            className={`w-full block text-center py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
              isOutOfStock
                ? 'bg-muted text-muted-foreground cursor-not-allowed pointer-events-none'
                : 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-md'
            }`}
          >
            {isOutOfStock ? 'Временно Недостъпен' : 'Купи на Станцията'}
          </a>
        </div>

        {/* Desktop: Full price display */}
        <div className="hidden lg:block mt-auto space-y-2">
          {/* Regular Price */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Редовна цена:</span>
            <span className="text-lg font-bold text-foreground">
              €{product.price.toFixed(2)}
            </span>
          </div>

          {/* Card Price */}
          <div className="flex items-center justify-between bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg px-3 py-2">
            <span className="text-sm font-semibold text-primary">С карта BG OIL:</span>
            <span className="text-xl font-black text-primary">
              €{product.cardPrice.toFixed(2)}
            </span>
          </div>

          {/* Savings */}
          <p className="text-xs text-center text-green-500 font-semibold">
            Спестявате €{(product.price - product.cardPrice).toFixed(2)}!
          </p>

          {/* Stock Status */}
          <div className="flex items-center justify-center py-1">
            {isOutOfStock ? (
              <div className="flex items-center text-destructive">
                <span className="w-2 h-2 rounded-full bg-destructive mr-2 animate-pulse"></span>
                <span className="text-sm font-semibold">Няма наличност</span>
              </div>
            ) : (
              <div className="flex items-center text-green-500">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                <span className="text-sm font-semibold">В наличност</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <a
            href={isOutOfStock ? undefined : contacts.mapsLink}
            target={isOutOfStock ? undefined : '_blank'}
            rel={isOutOfStock ? undefined : 'noopener noreferrer'}
            className={`w-full block text-center py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
              isOutOfStock
                ? 'bg-muted text-muted-foreground cursor-not-allowed pointer-events-none'
                : 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-md hover:shadow-lg hover:shadow-primary/30 hover:brightness-110'
            }`}
          >
            {isOutOfStock ? 'Временно Недостъпен' : 'Купи на Станцията'}
          </a>
        </div>
      </div>
    </div>
  )
}

// Product Carousel Component - Works on both mobile and desktop
function ProductCarousel({ products }: { products: Product[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    setCurrentIndex(0)
  }, [products])

  const itemsPerView = isMobile ? 1 : 4
  const maxIndex = Math.max(0, products.length - itemsPerView)

  const goNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))
  }

  const goPrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  if (products.length === 0) return null

  // Mobile: Carousel with 1 item per view - BIG cards
  if (isMobile) {
    return (
      <div className="relative">
        {/* Carousel Container */}
        <div className="relative px-12">
          {/* Navigation Arrows */}
          {products.length > 1 && (
            <>
              <button
                onClick={goPrev}
                disabled={currentIndex === 0}
                className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card shadow-lg border border-border flex items-center justify-center transition-all duration-300 ${
                  currentIndex === 0
                    ? 'opacity-30 cursor-not-allowed'
                    : 'active:bg-primary active:text-white active:border-primary'
                }`}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={goNext}
                disabled={currentIndex >= maxIndex}
                className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card shadow-lg border border-border flex items-center justify-center transition-all duration-300 ${
                  currentIndex >= maxIndex
                    ? 'opacity-30 cursor-not-allowed'
                    : 'active:bg-primary active:text-white active:border-primary'
                }`}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Products Container */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="w-full flex-shrink-0 px-2"
                >
                  <ProductCard key={`mobile-${product.id}-${currentIndex}`} product={product} index={index} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dots Indicator */}
        {products.length > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {products.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'bg-primary w-8'
                    : 'bg-muted-foreground/30 w-2.5'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  // Desktop: Carousel with arrows
  return (
    <div className="relative px-14">
      {/* Navigation Arrows */}
      {products.length > itemsPerView && (
        <>
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-card shadow-lg border border-border flex items-center justify-center transition-all duration-300 ${
              currentIndex === 0
                ? 'opacity-40 cursor-not-allowed'
                : 'hover:bg-primary hover:text-white hover:border-primary hover:scale-110'
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goNext}
            disabled={currentIndex >= maxIndex}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-card shadow-lg border border-border flex items-center justify-center transition-all duration-300 ${
              currentIndex >= maxIndex
                ? 'opacity-40 cursor-not-allowed'
                : 'hover:bg-primary hover:text-white hover:border-primary hover:scale-110'
            }`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Products Container */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 25}%)`,
          }}
        >
          {products.map((product, index) => (
            <div
              key={product.id}
              className="w-1/4 flex-shrink-0 px-3"
            >
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      {products.length > itemsPerView && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-3 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'bg-primary w-8'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50 w-3'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Всички')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Load products from API
  useEffect(() => {
    fetch('/api/admin/products')
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setProducts(data.products)
        }
      })
      .catch(error => console.error('Failed to load products:', error))
      .finally(() => setLoading(false))
  }, [])

  // Get unique categories
  const categories = ['Всички', ...Array.from(new Set(products.map((p) => p.category)))]

  // Filter products by category
  const filteredProducts =
    selectedCategory === 'Всички'
      ? products
      : products.filter((p) => p.category === selectedCategory)

  const features = [
    {
      icon: Package,
      title: "Качествени Продукти",
      description: "Само оригинални и проверени авто продукти"
    },
    {
      icon: Clock,
      title: "24/7 Наличност",
      description: "Винаги на разположение на нашата станция"
    },
    {
      icon: CreditCard,
      title: "Удобно Плащане",
      description: "Кеш, карта и карти за гориво"
    },
    {
      icon: MapPin,
      title: "Лесна Локация",
      description: "Директно на бензиностанцията във Враца"
    }
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-24 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
          </div>
          {/* Fade into main background */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent via-background/80 to-background"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto animate-fade-in-up">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-primary">Магазин</span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-foreground mb-6">
                <span className="text-gradient-primary">Магазин</span> за Авто Продукти
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Качествени продукти за вашия автомобил
              </p>

              {/* BG OIL Card Discount Banner */}
              <div className="mt-8 inline-flex flex-col sm:flex-row items-center gap-4 px-6 py-4 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-2xl">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-8 h-8 text-primary" />
                  <div className="text-left">
                    <p className="text-lg font-bold text-foreground">Картата BG OIL дава <span className="text-primary">10% отстъпка</span> в магазина!</p>
                    <p className="text-sm text-muted-foreground">Имаме още много продукти за вашите коли</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="group relative overflow-hidden transition-all duration-500 hover-lift bg-gradient-card shadow-lg hover:shadow-xl hover:shadow-primary/10"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>

                  <CardHeader className="text-center pb-3">
                    <div className="inline-flex items-center justify-center w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-primary/10 group-hover:bg-gradient-primary transition-all duration-500 group-hover:scale-110">
                      <feature.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors duration-300" />
                    </div>
                    <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center text-sm">
                      {feature.description}
                    </p>
                  </CardContent>

                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 shine opacity-20"></div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-24 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
          </div>
          {/* Blend with surrounding sections */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background via-background/85 to-transparent"></div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-background/70 to-background"></div>

          <div className="container mx-auto px-4 relative z-10">
            {/* Section Header */}
            <div className="text-center mb-12 animate-fade-in-up">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-primary">Нашите продукти</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6">
                Продукти за <span className="text-gradient-primary">всеки автомобил</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Всички продукти са налични за покупка директно на станцията
              </p>
            </div>

            {/* Products Carousel */}
            <ProductCarousel products={filteredProducts} />

            {/* No Products Message */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <Package className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  Няма намерени продукти в тази категория
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <Card className="max-w-5xl mx-auto bg-gradient-card shadow-2xl hover:shadow-primary/20">
              <CardHeader className="text-center pb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-primary/10">
                  <ShoppingBag className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-3xl md:text-4xl font-black text-gradient-primary mb-2">
                  Как да закупите?
                </CardTitle>
                <p className="text-muted-foreground">
                  Всички продукти са налични директно на нашата бензиностанция
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-foreground flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-primary" />
                      Посетете ни
                    </h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start space-x-3">
                        <span className="text-primary font-bold mt-1">•</span>
                        <span>Адрес: {contacts.address}</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-primary font-bold mt-1">•</span>
                        <span>Работно време: {contacts.workingHours}</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-primary font-bold mt-1">•</span>
                        <span>Наличността се актуализира в реално време</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-foreground flex items-center">
                      <CreditCard className="w-5 h-5 mr-2 text-primary" />
                      Начини на плащане
                    </h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start space-x-3">
                        <span className="text-primary font-bold mt-1">•</span>
                        <span>Кеш</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-primary font-bold mt-1">•</span>
                        <span>Кредитна и дебитна карта</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-primary font-bold mt-1">•</span>
                        <span>Карти за гориво</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-primary font-bold mt-1">•</span>
                        <span>Професионални съвети от персонала</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
