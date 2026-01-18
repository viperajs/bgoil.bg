'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Product interface
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string;
}

// Mock product data
const products: Product[] = [
  {
    id: 1,
    name: 'Дизелов Инжекторен Очистител',
    description: 'Професионален очистител за дизелови инжектори. Подобрява горивната ефективност и работата на двигателя.',
    price: 14.99,
    stock: 12,
    category: 'Горивни Добавки',
    image: 'https://placehold.co/400x300/ff3b3b/ffffff?text=Инжекторен+Очистител',
  },
  {
    id: 2,
    name: 'AdBlue DEF Течност',
    description: 'Високочиста течност за дизелови двигатели (DEF) за SCR системи. Намалява NOx емисиите с до 90%.',
    price: 8.50,
    stock: 24,
    category: 'Контрол на Емисии',
    image: 'https://placehold.co/400x300/0891b2/ffffff?text=AdBlue',
  },
  {
    id: 3,
    name: 'Зимна Дизелова Анти-Гел Добавка',
    description: 'Предотвратява замръзването на горивото при студено време. Защитава до -35°C. Задължителна за зимно шофиране.',
    price: 12.99,
    stock: 0,
    category: 'Сезонни Продукти',
    image: 'https://placehold.co/400x300/0284c7/ffffff?text=Анти-Гел',
  },
  {
    id: 4,
    name: 'Добавка за Моторно Масло',
    description: 'Усъвършенствана синтетична добавка за масло. Намалява триенето, спира теченията и удължава живота на двигателя.',
    price: 18.75,
    stock: 8,
    category: 'Маслени Продукти',
    image: 'https://placehold.co/400x300/7c3aed/ffffff?text=Маслена+Добавка',
  },
  {
    id: 5,
    name: 'Октанов Бустер',
    description: 'Премиум повишител на октановото число за високопроизводителни двигатели. Увеличава октана с до 7 точки.',
    price: 16.50,
    stock: 5,
    category: 'Производителност',
    image: 'https://placehold.co/400x300/dc2626/ffffff?text=Октанов+Бустер',
  },
  {
    id: 6,
    name: 'DPF Регенерационна Течност',
    description: 'Професионален очистител за дизелов филтър за твърди частици. Възстановява ефективността и предотвратява запушване.',
    price: 22.99,
    stock: 6,
    category: 'Поддръжка',
    image: 'https://placehold.co/400x300/16a34a/ffffff?text=DPF+Очистител',
  },
  {
    id: 7,
    name: 'Очистител за Горивна Система',
    description: 'Пълна обработка на горивната система за бензин и дизел. Почиства инжектори, клапани и камери за горене.',
    price: 13.50,
    stock: 15,
    category: 'Горивни Добавки',
    image: 'https://placehold.co/400x300/ea580c/ffffff?text=Системен+Очистител',
  },
  {
    id: 8,
    name: 'Добавка за Скоростна Кутия',
    description: 'Подобрява плавността на смяната на предавките и намалява износването. Съвместима с автоматични и механични.',
    price: 19.99,
    stock: 0,
    category: 'Грижа за Трансмисия',
    image: 'https://placehold.co/400x300/8b5cf6/ffffff?text=Трансмисия',
  },
];

// Product Card Component
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const isOutOfStock = product.stock === 0;

  return (
    <div className="bg-[#0a0a0f] rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-[#ef4444]/20 hover:-translate-y-1 flex flex-col h-full border border-white/10">
      {/* Product Image */}
      <div className="relative h-48 bg-[#111827] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {isOutOfStock && (
          <div className="absolute top-3 right-3 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
            Изчерпан
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Category Badge */}
        <div className="mb-2">
          <span className="inline-block bg-gradient-to-r from-[#ef4444]/10 to-[#f43f5e]/10 text-[#ef4444] text-xs font-medium px-2.5 py-0.5 rounded border border-[#ef4444]/20">
            {product.category}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
          {product.name}
        </h3>

        {/* Product Description */}
        <p className="text-sm text-gray-300 mb-4 line-clamp-2 flex-grow">
          {product.description}
        </p>

        {/* Price */}
        <div className="mb-3">
          <span className="text-3xl font-bold text-white">
            €{product.price.toFixed(2)}
          </span>
        </div>

        {/* Stock Indicator */}
        <div className="mb-4">
          {isOutOfStock ? (
            <div className="flex items-center text-primary">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-semibold">Няма наличност</span>
            </div>
          ) : (
            <div className="flex items-center text-green-600">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-semibold">
                Налични: {product.stock} бр.
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <a
          href="#contact"
          className={`w-full text-center py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
            isOutOfStock
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'border-2 border-[#ef4444] text-[#ef4444] hover:bg-gradient-to-r hover:from-[#ef4444] hover:to-[#f43f5e] hover:text-white hover:border-transparent shadow-md hover:shadow-lg'
          }`}
          onClick={(e) => isOutOfStock && e.preventDefault()}
        >
          {isOutOfStock ? 'Временно Недостъпен' : 'Купи на Станцията'}
        </a>
      </div>
    </div>
  );
};

// Main Product Catalog Component
const ProductCatalog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Всички');

  // Get unique categories
  const categories = ['Всички', ...Array.from(new Set(products.map((p) => p.category)))];

  // Filter products by category
  const filteredProducts =
    selectedCategory === 'Всички'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#0a0a0f] pt-20 lg:pt-24">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-[#ef4444] to-[#f43f5e] text-white py-16 px-4 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'repeating-linear-gradient(120deg, rgba(255, 255, 255, 0.1) 0px, rgba(255, 255, 255, 0.1) 2px, transparent 2px, transparent 60px)'
            }}></div>
          </div>
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Магазин за Авто Добавки
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
              Продуктите са налични за покупка директно на нашата станция.
              Проверете наличността по-долу и ни посетете за най-добрите решения за грижа за автомобила.
            </p>
            <div className="mt-6 flex items-center justify-center text-white/90">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-sm">Всички цени са в EUR (€)</span>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-[#ef4444] to-[#f43f5e] text-white shadow-lg shadow-[#ef4444]/40'
                    : 'bg-white/10 text-white/80 hover:bg-white/15 border border-white/20 hover:border-[#ef4444]/50 backdrop-blur-md'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* No Products Message */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">
                Няма намерени продукти в тази категория.
              </p>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-md">
            <div className="flex items-start">
              <svg
                className="w-6 h-6 text-[#ef4444] mr-3 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Важна Информация
                </h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Всички продукти са налични за покупка на нашата станция</li>
                  <li>• Наличността се актуализира в реално време</li>
                  <li>• Професионални съвети от нашия персонал на място</li>
                  <li>• Приемаме плащания: Кеш, Кредитна Карта, Карта за Гориво</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductCatalog;
