'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface Store {
  id: string;
  name: string;
  email: string;
  slug: string;
  description: string;
  avatar: string | null;
  isLive: boolean;
}

export default function BoutiqueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Vérifier si on est sur la page de connexion ou d'inscription
    if (pathname === '/boutique/login' || pathname === '/boutique/inscription') {
      setLoading(false);
      return;
    }

    // Vérifier l'authentification
    const storeData = localStorage.getItem('store');
    if (storeData) {
      try {
        const parsedStore = JSON.parse(storeData);
        setStore(parsedStore);
      } catch (error) {
        console.error('Erreur parsing store data:', error);
        router.push('/boutique/login');
      }
    } else {
      router.push('/boutique/login');
    }
    setLoading(false);
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/boutique/auth', { method: 'DELETE' });
      localStorage.removeItem('store');
      router.push('/boutique/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const stopLive = async () => {
    try {
      const res = await fetch('/api/boutique/live', { method: 'DELETE' });
      if (res.ok) {
        // Mettre à jour l'état local et le localStorage
        setStore((prev) => {
          if (!prev) return prev;
          const updated = { ...prev, isLive: false } as Store;
          localStorage.setItem('store', JSON.stringify(updated));
          return updated;
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'arrêt du live:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Pages publiques (connexion/inscription)
  if (pathname === '/boutique/login' || pathname === '/boutique/inscription') {
    return <>{children}</>;
  }

  // Pages protégées
  if (!store) {
    return null; // Redirection en cours
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full overflow-hidden bg-white border-2 border-gray-200 flex-shrink-0">
                  <img
                    src={store.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(store.name)}&background=3B82F6&color=fff`}
                    alt={store.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">{store.name}</h1>
                  {store.isLive && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                      🔴 EN LIVE
                    </span>
                  )}
                </div>
              </div>
            </div>

            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => router.push('/boutique/dashboard')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/boutique/dashboard'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => router.push('/boutique/products')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname.startsWith('/boutique/products')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Produits
              </button>
              <button
                onClick={() => router.push('/boutique/orders')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/boutique/orders'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Commandes
              </button>
              <button
                onClick={() => router.push('/boutique/live')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/boutique/live'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Live
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              {store.isLive ? (
                <button
                  onClick={stopLive}
                  className="bg-red-600 text-white px-3 py-2 rounded-md text-sm hover:bg-red-700"
                >
                  Arrêter le live
                </button>
              ) : (
                <button
                  onClick={() => router.push('/boutique/live')}
                  className="bg-pink-600 text-white px-3 py-2 rounded-md text-sm hover:bg-pink-700"
                >
                  Lancer un live
                </button>
              )}
              <button
                onClick={() => router.push('/')}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Voir le site
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main>{children}</main>
    </div>
  );
}
