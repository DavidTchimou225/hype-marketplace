'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  _count: {
    products: number;
  };
  storesCount: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Hype Market</h1>
        </div>
        <div className="relative">
          <span className="text-2xl">🛒</span>
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            0
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="px-4 py-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Toutes les Catégories</h2>

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 mb-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center animate-pulse">
                <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-3"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded mb-1"></div>
                <div className="h-3 bg-gray-300 rounded w-20 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 mb-8">
            {categories.map((category) => (
              <Link key={category.id} href={`/category/${category.slug}`} className="block">
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-xl overflow-hidden bg-gray-100">
                    {category.icon ? (
                      <img src={category.icon} alt={category.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Image</div>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category._count.products} produits</p>
                  <p className="text-xs text-gray-400">{category.storesCount} boutiques</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Tags Populaires */}
        <div className="mb-20">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Tags Populaires</h3>
          <div className="flex flex-wrap gap-2">
            <span className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">#wax</span>
            <span className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">#bogolan</span>
            <span className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">#kente</span>
            <span className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">#traditionnel</span>
            <span className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">#moderne</span>
            <span className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">#artisanal</span>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around items-center">
          <Link href="/" className="flex flex-col items-center py-2">
            <span className="text-xl mb-1">🏠</span>
            <span className="text-xs text-gray-500">Accueil</span>
          </Link>
          <Link href="/boutiques" className="flex flex-col items-center py-2">
            <span className="text-xl mb-1">🏪</span>
            <span className="text-xs text-gray-500">Boutiques</span>
          </Link>
          <Link href="/live" className="flex flex-col items-center py-2">
            <span className="text-xl mb-1">📹</span>
            <span className="text-xs text-gray-500">Live</span>
          </Link>
          <div className="flex flex-col items-center py-2">
            <span className="text-xl mb-1">📱</span>
            <span className="text-xs text-gray-900 font-medium">Catégories</span>
          </div>
          <Link href="/profil" className="flex flex-col items-center py-2">
            <span className="text-xl mb-1">👤</span>
            <span className="text-xs text-gray-500">Profil</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
