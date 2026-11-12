"use client"

import { useEffect, useState } from "react"
import { ArrowUpRight, ChevronDown, ChevronUp, Package } from "lucide-react"
import { contacts } from "@/lib/config"

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

const eur = (n: number) => `${n.toFixed(2)} €`

function ProductCard({ product }: { product: Product }) {
  const [expanded, setExpanded] = useState(false)
  const isOutOfStock = product.stock === 0
  const saving = product.price - product.cardPrice

  return (
    <article className="s-product">
      <div className={`s-product__img${isOutOfStock ? " is-out" : ""}`}>
        <img src={product.image} alt={product.name} loading="lazy" />
        <span className="s-tag s-tag--red">{product.category}</span>
        {isOutOfStock && <span className="s-product__out">Изчерпан</span>}
      </div>

      <div className="s-product__body">
        <h3>{product.name}</h3>
        <p className={`s-product__desc${expanded ? " is-open" : ""}`}>{product.description}</p>
        {product.description.length > 50 && (
          <button type="button" className="s-product__more" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>
            {expanded ? (
              <><ChevronUp aria-hidden="true" /> Скрий</>
            ) : (
              <><ChevronDown aria-hidden="true" /> Виж повече</>
            )}
          </button>
        )}

        <div className="s-product__prices">
          <div>
            <small>Редовна</small>
            <s>{eur(product.price)}</s>
          </div>
          <div className="club">
            <small>BG OIL Club</small>
            <b>{eur(product.cardPrice)}</b>
          </div>
        </div>

        {saving > 0 && <p className="s-product__save">Спестявате {eur(saving)}</p>}

        {isOutOfStock ? (
          <span className="s-btn s-btn--block s-btn--sm" aria-disabled="true">
            Недостъпен
          </span>
        ) : (
          <a
            href={contacts.mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="s-btn s-btn--ink s-btn--block s-btn--sm"
          >
            Купи на място
            <ArrowUpRight aria-hidden="true" />
          </a>
        )}
      </div>
    </article>
  )
}

export default function ShopCatalog() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Всички")
  const [products, setProducts] = useState<Product[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => { if (data.ok) setProducts(data.products) })
      .catch((error) => console.error("Failed to load products:", error))
      .finally(() => setLoaded(true))
  }, [])

  const categories = ["Всички", ...Array.from(new Set(products.map((p) => p.category)))]
  const filteredProducts =
    selectedCategory === "Всички" ? products : products.filter((p) => p.category === selectedCategory)

  return (
    <>
      <div className="s-head s-head--row">
        <div className="s-head" style={{ marginBottom: 0 }}>
          <span className="s-eyebrow">Каталог</span>
          <h2 className="s-h2">Нашите продукти</h2>
          <p className="s-lead">Избрани продукти с гарантирано качество.</p>
        </div>
        <div className="s-filters" role="group" aria-label="Категории">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className="s-filter"
              aria-pressed={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="s-products">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="s-empty" aria-live="polite">
          <Package aria-hidden="true" />
          {loaded ? "Няма намерени продукти в тази категория" : "Зареждаме продуктите…"}
        </div>
      )}
    </>
  )
}
