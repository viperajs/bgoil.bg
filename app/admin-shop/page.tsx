'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ShoppingBag, Edit, Trash2, Plus, Save, X } from 'lucide-react'

interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  category: string
  image: string
}

export default function AdminShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<Product | null>(null)

  // Load products
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products')
      const data = await response.json()
      if (data.ok) {
        setProducts(data.products)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (product: Product) => {
    setEditingId(product.id)
    setEditForm({ ...product })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm(null)
  }

  const saveEdit = async () => {
    if (!editForm) return

    try {
      const response = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })

      const data = await response.json()
      if (data.ok) {
        await fetchProducts()
        setEditingId(null)
        setEditForm(null)
      } else {
        alert('Грешка при запазване: ' + data.error)
      }
    } catch (error) {
      console.error('Failed to save product:', error)
      alert('Грешка при запазване')
    }
  }

  const deleteProduct = async (id: number) => {
    if (!confirm('Сигурни ли сте, че искате да изтриете този продукт?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      if (data.ok) {
        await fetchProducts()
      } else {
        alert('Грешка при изтриване: ' + data.error)
      }
    } catch (error) {
      console.error('Failed to delete product:', error)
      alert('Грешка при изтриване')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Зареждане на продукти...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-black text-gradient-primary">Управление на Продукти</h1>
              <p className="text-muted-foreground">Редактирай цени и наличност на продуктите</p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {products.map((product) => {
            const isEditing = editingId === product.id
            const form = isEditing ? editForm! : product

            return (
              <Card
                key={product.id}
                className={`border-2 transition-all duration-300 ${
                  isEditing
                    ? 'border-primary shadow-xl scale-105'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {isEditing ? (
                        <Input
                          value={form.name}
                          onChange={(e) =>
                            setEditForm({ ...form, name: e.target.value })
                          }
                          className="text-lg font-bold mb-2"
                          placeholder="Име на продукт"
                        />
                      ) : (
                        <CardTitle className="text-lg font-bold">{product.name}</CardTitle>
                      )}
                      <div className="inline-block bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded mt-2">
                        {product.category}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Description */}
                  <div>
                    <Label className="text-xs text-muted-foreground">Описание</Label>
                    {isEditing ? (
                      <Textarea
                        value={form.description}
                        onChange={(e) =>
                          setEditForm({ ...form, description: e.target.value })
                        }
                        className="mt-1 text-sm"
                        rows={3}
                        placeholder="Описание на продукт"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {product.description}
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div>
                    <Label className="text-xs text-muted-foreground">Цена (EUR)</Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={form.price}
                        onChange={(e) =>
                          setEditForm({ ...form, price: parseFloat(e.target.value) || 0 })
                        }
                        className="mt-1"
                        placeholder="0.00"
                      />
                    ) : (
                      <div className="text-2xl font-black text-foreground mt-1">
                        €{product.price.toFixed(2)}
                      </div>
                    )}
                  </div>

                  {/* Stock */}
                  <div>
                    <Label className="text-xs text-muted-foreground">Наличност (бр.)</Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={form.stock}
                        onChange={(e) =>
                          setEditForm({ ...form, stock: parseInt(e.target.value) || 0 })
                        }
                        className="mt-1"
                        placeholder="0"
                      />
                    ) : (
                      <div
                        className={`text-lg font-bold mt-1 ${
                          product.stock === 0 ? 'text-destructive' : 'text-green-600'
                        }`}
                      >
                        {product.stock === 0 ? 'Неналично' : `${product.stock} бр.`}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    {isEditing ? (
                      <>
                        <Button
                          onClick={saveEdit}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Запази
                        </Button>
                        <Button
                          onClick={cancelEdit}
                          variant="outline"
                          className="flex-1"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Откажи
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => startEdit(product)}
                          className="flex-1 bg-gradient-primary"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Редактирай
                        </Button>
                        <Button
                          onClick={() => deleteProduct(product.id)}
                          variant="destructive"
                          className="px-4"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Button
            onClick={() => (window.location.href = '/admin')}
            variant="outline"
            className="px-8"
          >
            Назад към Админ Панел
          </Button>
        </div>
      </div>
    </div>
  )
}
