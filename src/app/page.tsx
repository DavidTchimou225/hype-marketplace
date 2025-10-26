'use client';

import Link from 'next/link';
import TrendingProducts from '../components/TrendingProducts';
import CartIcon from '../components/CartIcon';
import LoginButton from '../components/LoginButton';
import SearchBar from '../components/SearchBar';
import HeroCarousel from '../components/HeroCarousel';
import { useAuth } from '@/components/AuthProvider';
import { useEffect, useState } from 'react';

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [stores, setStores] = useState<any[]>([]);
  const [liveStores, setLiveStores] = useState<any[]>([]);
  const [loadingStores, setLoadingStores] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [headerMessage, setHeaderMessage] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [allRes, liveRes, catRes, msgRes] = await Promise.all([
          fetch('/api/stores?limit=6'),
          fetch('/api/stores?live=true&limit=6'),
          fetch('/api/categories?limit=6'),
          fetch('/api/settings?key=header_message'),
        ]);
        const allData = allRes.ok ? await allRes.json() : { stores: [] };
        const liveData = liveRes.ok ? await liveRes.json() : { stores: [] };
        const catData = catRes.ok ? await catRes.json() : { categories: [] };
        const msgData = msgRes.ok ? await msgRes.json() : { value: '' };
        
        setStores(allData.stores || []);
        setLiveStores(liveData.stores || []);
        setCategories(catData.categories || []);
        setHeaderMessage(msgData.value || '');
      } catch (e) {
        setStores([]);
        setLiveStores([]);
        setCategories([]);
        setHeaderMessage('');
      } finally {
        setLoadingStores(false);
        setLoadingCategories(false);
      }
    })();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black text-white px-4 py-3 flex justify-between items-center">
        <div className="text-sm font-medium flex-1">
          {headerMessage || '9:41 AM'}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white rounded-full"></div>
          <div className="w-4 h-4 bg-white rounded-full"></div>
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </div>
      </header>

      {/* Top Navigation */}
      <div className="bg-white px-4 py-3 flex justify-between items-center border-b">
        <h1 className="text-xl font-bold text-gray-900">Hype Market</h1>
        <div className="flex items-center gap-3">
          {!isAuthenticated && (
            <Link 
              href="/login" 
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Connexion
            </Link>
          )}
          <Link 
            href="/devenir-vendeur" 
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1.5 rounded-full text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Devenir Vendeur
          </Link>
          <CartIcon />
          {isAuthenticated && (
            <Link 
              href="/profile" 
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
              title="Mon profil"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Hero Carousel - Bannières dynamiques */}
      <HeroCarousel />

      {/* Search Bar Section */}
      <div className="bg-white px-4 py-6 border-b">
        <SearchBar 
          placeholder="Rechercher des produits, boutiques, catégories..."
          onSearch={(query, filters) => {
            // Rediriger vers la page de résultats
            window.location.href = `/search?q=${encodeURIComponent(query)}&type=${filters.type}`;
          }}
        />
      </div>

      {/* Categories */}
      <div className="px-4 py-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Catégories</h3>
        {loadingCategories ? (
          <div className="text-sm text-gray-500">Chargement...</div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/category/${cat.slug}`} className="flex flex-col items-center category-item">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mb-2 overflow-hidden">
                  {cat.icon ? (
                    <img src={cat.icon} alt={cat.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">📦</span>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700 text-center">{cat.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Tendances */}
      <TrendingProducts />

      {/* Boutiques depuis la base */}
      <div className="px-4 py-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <h3 className="text-lg font-bold text-gray-900">En Live Maintenant</h3>
        </div>
        {loadingStores ? (
          <div className="text-sm text-gray-500 mb-6">Chargement…</div>
        ) : liveStores.length === 0 ? (
          <div className="text-sm text-gray-500 mb-6">Aucune boutique en live</div>
        ) : (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {liveStores.map((s) => (
              <Link key={s.id} href={`/store/${s.slug}`} className="block">
                <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow relative border-2 border-red-500">
                  {/* Badge LIVE en haut à droite */}
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                    LIVE
                  </div>
                  
                  {/* Logo boutique centré */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-white border-2 border-red-200 flex-shrink-0 mb-3">
                      <img
                        src={s.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=EF4444&color=fff`}
                        alt={s.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Nom et produits */}
                    <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                      {s.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {s._count?.products || 0} produit{(s._count?.products || 0) > 1 ? 's' : ''}
                    </p>
                    
                    {/* Note si disponible */}
                    {s.rating > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-yellow-500 text-xs">⭐</span>
                        <span className="text-xs font-medium text-gray-700">{s.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <h3 className="text-lg font-bold text-gray-900 mb-4">Boutiques</h3>
        {loadingStores ? (
          <div className="text-sm text-gray-500">Chargement…</div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {stores.map((s) => (
              <Link key={s.id} href={`/store/${s.slug}`} className="block">
                <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow relative">
                  {/* Badge LIVE si en direct */}
                  {s.liveSessions?.length ? (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      LIVE
                    </div>
                  ) : null}
                  
                  {/* Logo boutique centré */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-white border-2 border-gray-200 flex-shrink-0 mb-3">
                      <img
                        src={s.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=3B82F6&color=fff`}
                        alt={s.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Nom et produits */}
                    <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                      {s.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {s._count?.products || 0} produit{(s._count?.products || 0) > 1 ? 's' : ''}
                    </p>
                    
                    {/* Note si disponible */}
                    {s.rating > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-yellow-500 text-xs">⭐</span>
                        <span className="text-xs font-medium text-gray-700">{s.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="h-20"></div>
    </div>
  );
}
