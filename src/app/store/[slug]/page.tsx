'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ShareButton from '@/components/ShareButton';
import BottomNavigation from '@/components/BottomNavigation';

type Store = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  initials?: string;
  avatar?: string;
  rating?: number;
  liveSessions?: Array<{ id: string }>;
  _count?: { products: number };
};

export default function StorePage({ params }: { params: { slug: string } }) {
  const [store, setStore] = useState<Store | null>(null);
  const [loadingStore, setLoadingStore] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoadingStore(true);
        const res = await fetch(`/api/stores?slug=${params.slug}`);
        const data = res.ok ? await res.json() : { stores: [] };
        if (!active) return;
        setStore(data.stores?.[0] || null);
      } finally {
        setLoadingStore(false);
      }
    })();
    return () => { active = false; };
  }, [params.slug]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoadingProducts(true);
        const response = await fetch(`/api/products?store=${params.slug}&limit=20`);
        const data = await response.json();
        if (!active) return;
        setProducts(data.products || []);
      } catch (e) {
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    })();
    return () => { active = false; };
  }, [params.slug]);

  const initials = (store?.name || '?').split(' ').map(w => w[0]).slice(0,2).join('');
  // Build category list from m2m relation
  const allCategoryNames: string[] = Array.from(
    new Set(
      (products || []).flatMap((p: any) => (p.categories || []).map((c: any) => c?.name).filter(Boolean))
    )
  );
  const filteredProducts = selectedCategory === 'Tous'
    ? products
    : products.filter((p: any) => (p.categories || []).some((c: any) => c?.name === selectedCategory));

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

      {/* Store Navigation */}
      <div className="bg-white px-4 py-3 flex justify-between items-center border-b">
        <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <span className="text-xl">←</span>
        </Link>
        <h2 className="text-lg font-semibold text-gray-900">Boutique</h2>
        <div className="w-10"></div>
      </div>

      <div className="max-w-md mx-auto bg-white lg:max-w-4xl">
        {/* Store Header */}
        <div className="px-4 py-6">
          <div className="bg-slate-800 rounded-2xl p-6 text-white mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-200">
                  {store?.avatar ? (
                    <img 
                      src={store.avatar} 
                      alt={store.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(store?.name || 'Store')}&background=3B82F6&color=fff`}
                      alt={store?.name || 'Store'}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <h1 className="text-xl font-bold">{store?.name || (loadingStore ? 'Chargement…' : 'Boutique')}</h1>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="flex text-yellow-400">
                      <span>⭐⭐⭐⭐⭐</span>
                    </div>
                    {store?.rating ? <span className="text-sm">({store.rating})</span> : null}
                  </div>
                </div>
              </div>
              {store?.liveSessions?.length ? (
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  EN LIVE
                </div>
              ) : null}
            </div>
            
            {store?.description ? <p className="text-slate-200 mb-4">{store.description}</p> : null}
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{store?._count?.products ?? products.length}</div>
                <div className="text-sm text-slate-300">Produits</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">—</div>
                <div className="text-sm text-slate-300">Ventes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">—</div>
                <div className="text-sm text-slate-300">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Link href={store?.liveSessions?.length ? `/lives/watch?room=room-store-${store.id}` : '#'} className={`text-center py-3 rounded-xl font-semibold transition-colors ${store?.liveSessions?.length ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>
              {store?.liveSessions?.length ? '🔴 Voir le Live' : 'Pas de Live'}
            </Link>
            <button className="border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
              💬 Contacter
            </button>
          </div>
          
          {/* Share Button */}
          <div className="mb-6">
            <ShareButton 
              url={`/store/${params.slug}`}
              title={store?.name || 'Boutique'}
              description={store?.description || `Découvrez ${store?.name} sur Hype Market`}
              type="store"
            />
          </div>

          {/* Category Tabs */}
          <div className="mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {['Tous', ...allCategoryNames]
                .map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? 'bg-black text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))
            }
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 gap-4">
            {loadingProducts ? (
              <div className="text-sm text-gray-500">Chargement…</div>
            ) : (
              filteredProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.slug}`} className="block">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm product-card cursor-pointer border">
                    <div className="h-40 bg-gray-200 flex items-center justify-center relative overflow-hidden">
                      {product.images && product.images.trim() ? (
                        <img
                          src={product.images.split(',')[0].trim()}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = '<span class="text-4xl">📦</span>';
                          }}
                        />
                      ) : (
                        <span className="text-4xl">📦</span>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-1">{product.name}</h4>
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex text-yellow-400 text-sm">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                              ⭐
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">({product.rating})</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">
                          {new Intl.NumberFormat('fr-FR').format(product.price / 100)} FCFA
                        </span>
                        <button 
                          className="w-8 h-8 bg-black rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="text-white text-lg">+</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
