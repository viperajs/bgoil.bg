'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ShoppingBag, Edit, Trash2, Plus, Save, X, Upload, ImageIcon } from 'lucide-react'
import Image from 'next/image'

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

const emptyProduct: Omit<Product, 'id'> = {
  name: '',
  description: '',
  price: 0,
  cardPrice: 0,
  stock: 0,
  category: '',
  image: '',
}

export default function AdminShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<Product | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>(emptyProduct)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadingEdit, setUploadingEdit] = useState(false)

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
        credentials: 'include',
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

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Сигурни ли сте, че искате да изтриете този продукт?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      const data = await response.json()
      console.log('Delete response:', data)

      if (data.ok) {
        await fetchProducts()
        alert('Продуктът беше изтрит успешно!')
      } else {
        alert('Грешка при изтриване: ' + (data.error || 'Неизвестна грешка'))
      }
    } catch (error) {
      console.error('Failed to delete product:', error)
      alert('Грешка при изтриване: ' + (error instanceof Error ? error.message : 'Неизвестна грешка'))
    }
  }

  const uploadImage = async (file: File, isEditMode: boolean = false): Promise<string | null> => {
    if (isEditMode) {
      setUploadingEdit(true)
    } else {
      setUploading(true)
    }

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      const data = await response.json()
      if (data.ok) {
        return data.url
      } else {
        alert('Грешка при качване: ' + data.error)
        return null
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Грешка при качване на снимката')
      return null
    } finally {
      if (isEditMode) {
        setUploadingEdit(false)
      } else {
        setUploading(false)
      }
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, isEditMode: boolean = false) => {
    const file = e.target.files?.[0]
    if (!file) return

    const url = await uploadImage(file, isEditMode)
    if (url) {
      if (isEditMode && editForm) {
        setEditForm({ ...editForm, image: url })
      } else {
        setNewProduct({ ...newProduct, image: url })
      }
    }

    // Reset the input so the same file can be selected again
    e.target.value = ''
  }

  const addNewProduct = async () => {
    if (!newProduct.name || !newProduct.description || !newProduct.category || !newProduct.image) {
      alert('Моля, попълнете всички задължителни полета')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newProduct),
      })

      const data = await response.json()
      if (data.ok) {
        await fetchProducts()
        setNewProduct(emptyProduct)
        setShowAddForm(false)
      } else {
        alert('Грешка при добавяне: ' + data.error)
      }
    } catch (error) {
      console.error('Failed to add product:', error)
      alert('Грешка при добавяне')
    } finally {
      setSaving(false)
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
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl sm:text-4xl font-black text-gradient-primary">Управление на Продукти</h1>
                <p className="text-sm sm:text-base text-muted-foreground">Редактирай цени и наличност на продуктите</p>
              </div>
            </div>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="w-full sm:w-auto bg-gradient-primary hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5 mr-2" />
              {showAddForm ? 'Скрий формата' : 'Добави продукт'}
            </Button>
          </div>
        </div>

        {/* Add New Product Form */}
        {showAddForm && (
          <Card className="mb-8 border-2 border-primary/30 shadow-xl max-w-4xl mx-auto">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
              <CardTitle className="flex items-center text-xl">
                <Plus className="w-5 h-5 mr-2 text-primary" />
                Добавяне на нов продукт
              </CardTitle>
              <CardDescription>Попълнете информацията за новия продукт</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="md:col-span-2">
                  <Label htmlFor="new-name" className="text-sm font-medium">
                    Име на продукта <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="new-name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="напр. Антифриз G11 -30°C 5л"
                    className="mt-1"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <Label htmlFor="new-description" className="text-sm font-medium">
                    Описание <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="new-description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Кратко описание на продукта..."
                    rows={3}
                    className="mt-1"
                  />
                </div>

                {/* Category */}
                <div>
                  <Label htmlFor="new-category" className="text-sm font-medium">
                    Категория <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="new-category"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    placeholder="напр. Антифриз"
                    className="mt-1"
                  />
                </div>

                {/* Image Upload */}
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium">
                    Снимка <span className="text-destructive">*</span>
                  </Label>
                  <div className="mt-1 flex flex-col sm:flex-row gap-4 items-start">
                    {/* Upload Button */}
                    <div className="flex-1 w-full">
                      <label
                        htmlFor="new-image-upload"
                        className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                          uploading
                            ? 'border-primary/50 bg-primary/5'
                            : 'border-muted-foreground/30 hover:border-primary hover:bg-primary/5'
                        }`}
                      >
                        {uploading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm text-muted-foreground">Качване...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-5 h-5 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Избери снимка от галерията</span>
                          </>
                        )}
                      </label>
                      <input
                        id="new-image-upload"
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={(e) => handleFileSelect(e, false)}
                        className="hidden"
                        disabled={uploading}
                      />
                      <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP или GIF. Макс. 5MB</p>
                    </div>

                    {/* Image Preview */}
                    {newProduct.image && (
                      <div className="relative w-24 h-24 rounded-lg border overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={newProduct.image}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setNewProduct({ ...newProduct, image: '' })}
                          className="absolute top-1 right-1 w-6 h-6 bg-destructive text-white rounded-full flex items-center justify-center hover:bg-destructive/90"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <Label htmlFor="new-price" className="text-sm font-medium">
                    Цена (EUR)
                  </Label>
                  <Input
                    id="new-price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    className="mt-1"
                  />
                </div>

                {/* Card Price */}
                <div>
                  <Label htmlFor="new-cardPrice" className="text-sm font-medium">
                    Цена с карта BG OIL (EUR)
                  </Label>
                  <Input
                    id="new-cardPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={newProduct.cardPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, cardPrice: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    className="mt-1"
                  />
                </div>

                {/* Stock */}
                <div>
                  <Label htmlFor="new-stock" className="text-sm font-medium">
                    Наличност (бр.)
                  </Label>
                  <Input
                    id="new-stock"
                    type="number"
                    min="0"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t">
                <Button
                  onClick={addNewProduct}
                  disabled={saving}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Запазване...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Запази продукт
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => {
                    setNewProduct(emptyProduct)
                    setShowAddForm(false)
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Откажи
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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
                      {isEditing ? (
                        <Input
                          value={form.category}
                          onChange={(e) =>
                            setEditForm({ ...form, category: e.target.value })
                          }
                          className="text-xs mt-2"
                          placeholder="Категория"
                        />
                      ) : (
                        <div className="inline-block bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded mt-2">
                          {product.category}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Product Image */}
                  <div className="relative w-full h-32 rounded-lg overflow-hidden bg-muted">
                    {form.image ? (
                      <Image
                        src={form.image}
                        alt={form.name}
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>

                  {/* Image Upload for Edit */}
                  {isEditing && (
                    <div>
                      <label
                        htmlFor={`edit-image-upload-${product.id}`}
                        className={`flex items-center justify-center gap-2 px-3 py-2 border-2 border-dashed rounded-lg cursor-pointer transition-colors text-sm ${
                          uploadingEdit
                            ? 'border-primary/50 bg-primary/5'
                            : 'border-muted-foreground/30 hover:border-primary hover:bg-primary/5'
                        }`}
                      >
                        {uploadingEdit ? (
                          <>
                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            <span className="text-muted-foreground">Качване...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Смени снимката</span>
                          </>
                        )}
                      </label>
                      <input
                        id={`edit-image-upload-${product.id}`}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={(e) => handleFileSelect(e, true)}
                        className="hidden"
                        disabled={uploadingEdit}
                      />
                    </div>
                  )}

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

                  {/* Card Price */}
                  <div>
                    <Label className="text-xs text-muted-foreground">Цена с карта (EUR)</Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={form.cardPrice}
                        onChange={(e) =>
                          setEditForm({ ...form, cardPrice: parseFloat(e.target.value) || 0 })
                        }
                        className="mt-1"
                        placeholder="0.00"
                      />
                    ) : (
                      <div className="text-lg font-bold text-primary mt-1">
                        €{product.cardPrice?.toFixed(2) || '0.00'}
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
                          onClick={() => handleDeleteProduct(product.id)}
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
