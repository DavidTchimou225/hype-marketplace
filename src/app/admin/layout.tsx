'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  useEffect(() => {
    // Force redirect if not authenticated
    if (isAuthenticated === false && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [isAuthenticated, pathname]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth/check');
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 mb-4">Redirection vers la connexion…</p>
          <Link href="/admin/login" className="text-blue-600 hover:underline">Aller à la page de connexion</Link>
        </div>
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin/dashboard" className="flex items-center">
                <span className="text-xl font-bold text-blue-600">Hype Market</span>
                <span className="ml-2 text-sm text-gray-500">Admin</span>
              </Link>
              
              <div className="hidden md:flex ml-10 space-x-8">
                <Link
                  href="/admin/dashboard"
                  className={`px-3 py-2 text-sm font-medium ${
                    pathname === '/admin/dashboard'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Tableau de bord
                </Link>
                <Link
                  href="/admin/stores"
                  className={`px-3 py-2 text-sm font-medium ${
                    pathname === '/admin/stores'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Boutiques
                </Link>
                <Link
                  href="/admin/users"
                  className={`px-3 py-2 text-sm font-medium ${
                    pathname === '/admin/users'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Utilisateurs
                </Link>
                <Link
                  href="/admin/orders"
                  className={`px-3 py-2 text-sm font-medium ${
                    pathname === '/admin/orders'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Commandes
                </Link>
                <Link
                  href="/admin/categories"
                  className={`px-3 py-2 text-sm font-medium ${
                    pathname === '/admin/categories'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Catégories
                </Link>
                <Link
                  href="/admin/banners"
                  className={`px-3 py-2 text-sm font-medium ${
                    pathname === '/admin/banners'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Carrousel
                </Link>
                <Link
                  href="/admin/system"
                  className={`px-3 py-2 text-sm font-medium ${
                    pathname === '/admin/system'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Système
                </Link>
                <Link
                  href="/admin/applications"
                  className={`px-3 py-2 text-sm font-medium ${
                    pathname === '/admin/applications'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Demandes
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/"
                target="_blank"
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Voir le site
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main>{children}</main>
    </div>
  );
}
