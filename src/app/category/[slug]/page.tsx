'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Données des catégories
const categories = {
  'femme': {
    name: 'Mode Femme',
    icon: '👗',
    slug: 'femme'
  },
  'homme': {
    name: 'Mode Homme',
    icon: '👔',
    slug: 'homme'
  },
  'accessoires': {
    name: 'Accessoires',
    icon: '👜',
    slug: 'accessoires'
  },
  'bijoux': {
    name: 'Bijoux',
    icon: '💎',
    slug: 'bijoux'
  },
  'cosmetiques': {
    name: 'Cosmétiques',
    icon: '💄',
    slug: 'cosmetiques'
  },
  'baskets': {
    name: 'Baskets',
    icon: '👟',
    slug: 'baskets'
  },
  'skincare': {
    name: 'Skincare',
    icon: '🧴',
    slug: 'skincare'
  }
};

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = categories[params.slug as keyof typeof categories];
  
  if (!category) {
    notFound();
  }

  const [filter, setFilter] = useState('populaire');
  const [viewMode, setViewMode] = useState('grid');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryProducts();
  }, [params.slug]);

  const fetchCategoryProducts = async () => {
    try {
      const response = await fetch(`/api/products?category=${params.slug}&limit=20`);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    let sortedProducts = [...products];
    
    switch (newFilter) {
      case 'prix-asc':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'prix-desc':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'nouveautes':
        sortedProducts.reverse();
        break;
      default: // populaire
        sortedProducts.sort((a, b) => b.rating - a.rating);
    }
    
    setProducts(sortedProducts);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black text-white px-4 py-3 flex justify-between items-center">
        <div className="text-sm font-medium">9:41 AM</div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white rounded-full"></div>
          <div className="w-4 h-4 bg-white rounded-full"></div>
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </div>
      </header>

      {/* Top Navigation */}
      <div className="bg-white px-4 py-3 flex justify-between items-center border-b">
        <h1 className="text-xl font-bold text-gray-900">Hype Market</h1>
        <div className="relative">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            🛒
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
            0
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="bg-white px-4 py-3 flex justify-between items-center border-b">
        <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <span className="text-xl">←</span>
        </Link>
        <h2 className="text-lg font-semibold text-gray-900">{category.name}</h2>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <span className="text-xl">🔍</span>
        </button>
      </div>

      <div className="max-w-md mx-auto bg-white lg:max-w-6xl">
        {/* Filters */}
        <div className="px-4 py-4 border-b">
          <div className="flex gap-2 mb-4 overflow-x-auto">
            <button
              onClick={() => handleFilterChange('populaire')}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                filter === 'populaire'
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Populaire
            </button>
            <button
              onClick={() => handleFilterChange('prix-asc')}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                filter === 'prix-asc'
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Prix ↑
            </button>
            <button
              onClick={() => handleFilterChange('prix-desc')}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                filter === 'prix-desc'
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Prix ↓
            </button>
            <button
              onClick={() => handleFilterChange('nouveautes')}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                filter === 'nouveautes'
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Nouveautés
            </button>
          </div>

          {/* Results count and view toggle */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">{products.length} produits trouvés</span>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-black text-white' : 'bg-gray-200'}`}
              >
                <span className="text-sm">⊞</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-black text-white' : 'bg-gray-200'}`}
              >
                <span className="text-sm">☰</span>
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="px-4 py-6">
          <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {products.map((product) => (
              <Link key={product.id} href={`/product/${product.slug}`} className="block">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm product-card cursor-pointer">
                  <div className={`${viewMode === 'grid' ? 'h-40' : 'h-32'} bg-gray-200 flex items-center justify-center relative overflow-hidden`}>
                    {product.images && product.images.trim() ? (
                      <img
                        src={product.images.split(',')[0].trim()}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = `<span class="${viewMode === 'grid' ? 'text-4xl' : 'text-3xl'}">📦</span>`;
                        }}
                      />
                    ) : (
                      <span className={`${viewMode === 'grid' ? 'text-4xl' : 'text-3xl'}`}>📦</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-1">{product.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{product.store?.name || 'Boutique'}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400 text-sm">⭐</span>
                        <span className="text-sm text-gray-600">{product.rating}</span>
                      </div>
                      <span className="font-bold text-gray-900">
                        {new Intl.NumberFormat('fr-FR').format(product.price / 100)} FCFA
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 lg:hidden">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <div className="flex flex-col items-center py-2">
            <span className="text-xl mb-1">🏠</span>
            <span className="text-xs text-gray-500">Accueil</span>
          </div>
          <div className="flex flex-col items-center py-2">
            <span className="text-xl mb-1">🏪</span>
            <span className="text-xs text-gray-500">Boutiques</span>
          </div>
          <div className="flex flex-col items-center py-2">
            <span className="text-xl mb-1">📹</span>
            <span className="text-xs text-gray-500">Live</span>
          </div>
          <div className="flex flex-col items-center py-2">
            <span className="text-xl mb-1">📊</span>
            <span className="text-xs text-gray-900 font-medium">Catégories</span>
          </div>
          <div className="flex flex-col items-center py-2">
            <span className="text-xl mb-1">👤</span>
            <span className="text-xs text-gray-500">Profil</span>
          </div>
        </div>
      </div>

      {/* Bottom padding for fixed navigation */}
      <div className="h-20"></div>
    </div>
  );
}
