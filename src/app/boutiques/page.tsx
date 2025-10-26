'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Store {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  avatar?: string | null;
  isLive: boolean;
  rating: number;
  totalSales: number;
  location: string;
  _count: {
    products: number;
  };
}

export default function BoutiquesPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [liveStores, setLiveStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        // Récupérer toutes les boutiques
        const allStoresResponse = await fetch('/api/stores');
        const allStoresData = await allStoresResponse.json();
        
        // Récupérer seulement les boutiques en live
        const liveStoresResponse = await fetch('/api/stores?live=true');
        const liveStoresData = await liveStoresResponse.json();
        
        setStores(allStoresData.stores || []);
        setLiveStores(liveStoresData.stores || []);
      } catch (error) {
        console.error('Erreur lors du chargement des boutiques:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
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
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Toutes les Boutiques</h2>

        {/* Boutiques Premium - En Live Maintenant */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <h3 className="text-lg font-bold text-gray-900">En Live Maintenant</h3>
          </div>
          
          {loading ? (
            <div className="space-y-3">
              <div className="bg-white rounded-2xl p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-24"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {liveStores.length > 0 ? (
                liveStores.map((store) => (
                  <Link key={store.id} href={`/store/${store.slug}`} className="block">
                    <div className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow border-l-4 border-red-500">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-white border-2 border-gray-200 flex-shrink-0">
                          <img
                            src={store.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(store.name)}&background=EF4444&color=fff`}
                            alt={store.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{store.name}</h4>
                          <p className="text-sm text-gray-500">{Math.floor(store.totalSales / 10)} spectateurs</p>
                        </div>
                      </div>
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        LIVE
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Aucune boutique en live pour le moment
                </div>
              )}
            </div>
          )}
        </div>

        {/* Toutes les Boutiques */}
        <div className="mb-20">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Toutes les Boutiques</h3>
          
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-32"></div>
                      </div>
                    </div>
                    <div className="w-16 h-8 bg-gray-300 rounded"></div>
                  </div>
                  <div className="h-3 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-24"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {stores.map((store) => (
                <Link key={store.id} href={`/store/${store.slug}`} className="block">
                  <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-white border-2 border-gray-200 flex-shrink-0">
                          <img
                            src={store.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(store.name)}&background=3B82F6&color=fff`}
                            alt={store.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{store.name}</h4>
                          <div className="flex items-center gap-1">
                            <div className="flex text-yellow-400">
                              <span>{'⭐'.repeat(Math.floor(store.rating))}</span>
                            </div>
                            <span className="text-sm text-gray-500">
                              ({store.rating}) • {store._count.products} produits
                            </span>
                          </div>
                        </div>
                      </div>
                      <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                        Visiter
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{store.description}</p>
                    <p className="text-sm text-gray-500">{store.totalSales.toLocaleString()} ventes</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around items-center">
          <Link href="/" className="flex flex-col items-center py-2">
            <span className="text-xl mb-1">🏠</span>
            <span className="text-xs text-gray-500">Accueil</span>
          </Link>
          <div className="flex flex-col items-center py-2">
            <span className="text-xl mb-1">🏪</span>
            <span className="text-xs text-gray-900 font-medium">Boutiques</span>
          </div>
          <Link href="/live" className="flex flex-col items-center py-2">
            <span className="text-xl mb-1">📹</span>
            <span className="text-xs text-gray-500">Live</span>
          </Link>
          <Link href="/categories" className="flex flex-col items-center py-2">
            <span className="text-xl mb-1">📱</span>
            <span className="text-xs text-gray-500">Catégories</span>
          </Link>
          <Link href="/profil" className="flex flex-col items-center py-2">
            <span className="text-xl mb-1">👤</span>
            <span className="text-xs text-gray-500">Profil</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
