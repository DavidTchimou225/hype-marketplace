'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AdminStats {
  overview: {
    totalUsers: number;
    totalStores: number;
    totalProducts: number;
    totalOrders: number;
    totalCategories: number;
    recentOrders: number;
    monthlyRevenue: number;
  };
  ordersByStatus: Record<string, number>;
  topStores: Array<{
    id: string;
    name: string;
    totalSales: number;
    rating: number;
    _count: { products: number };
  }>;
  userGrowth: number;
  role?: 'ADMIN' | 'SUPER_ADMIN';
  superAdmin?: {
    adminCount: number;
    pendingApplications: number;
    paidOrdersCount: number;
    revenue: { today: number; last7d: number; lifetime: number };
    itemsSold: number;
    averageOrderValue: number;
    dailyOrders: Record<string, number>;
    dailyRevenue: Record<string, number>;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.status === 401 || response.status === 403) {
        router.push('/admin/login');
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setError('Erreur lors du chargement des statistiques');
      }
    } catch (error) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchStats}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">⚡</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Hype Market Administration</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                Voir le site
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation rapide */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link href="/admin/users" className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border-l-4 border-blue-500">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Clients</h3>
                <p className="text-sm text-gray-500">Gestion utilisateurs</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/stores" className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border-l-4 border-green-500">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏪</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Boutiques</h3>
                <p className="text-sm text-gray-500">Gestion vendeurs</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/orders" className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border-l-4 border-orange-500">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Commandes</h3>
                <p className="text-sm text-gray-500">Suivi des ventes</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/categories" className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border-l-4 border-purple-500">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Catégories</h3>
                <p className="text-sm text-gray-500">Organisation produits</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilisateurs</p>
                <p className="text-3xl font-bold text-gray-900">{(stats?.overview?.totalUsers || 0).toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
            <p className="text-sm text-green-600 mt-2">+{stats?.userGrowth} ce mois</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Boutiques</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.overview?.totalStores || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏪</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Partenaires actifs</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Commandes</p>
                <p className="text-3xl font-bold text-gray-900">{(stats?.overview?.totalOrders || 0).toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
            </div>
            <p className="text-sm text-blue-600 mt-2">{stats?.overview.recentOrders} cette semaine</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenus (mois)</p>
                <p className="text-3xl font-bold text-gray-900">{(((stats?.overview?.monthlyRevenue || 0)) / 100).toLocaleString()} FCFA</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Commissions incluses</p>
          </div>
        </div>

        {/* KPIs Super Admin */}
        {stats?.role === 'SUPER_ADMIN' && stats?.superAdmin && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Super Admin - Vue Globale</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Admins</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.superAdmin.adminCount}</p>
                  </div>
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🛡️</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Demandes boutiques</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.superAdmin.pendingApplications}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📝</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Commandes payées</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.superAdmin.paidOrdersCount}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">✅</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">CA à vie</p>
                    <p className="text-3xl font-bold text-gray-900">{((stats.superAdmin.revenue.lifetime || 0) / 100).toLocaleString()} FCFA</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🏦</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-600">Revenu du jour</p>
                <p className="text-3xl font-bold text-gray-900">{((stats.superAdmin.revenue.today || 0) / 100).toLocaleString()} FCFA</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-600">Revenu 7 jours</p>
                <p className="text-3xl font-bold text-gray-900">{((stats.superAdmin.revenue.last7d || 0) / 100).toLocaleString()} FCFA</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-600">Panier moyen</p>
                <p className="text-3xl font-bold text-gray-900">{((stats.superAdmin.averageOrderValue || 0) / 100).toLocaleString()} FCFA</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Commandes - 30 derniers jours</h3>
                <div className="text-sm text-gray-600 space-y-1 max-h-64 overflow-auto">
                  {Object.entries(stats.superAdmin.dailyOrders || {}).map(([date, count]) => (
                    <div key={date} className="flex justify-between"><span>{date}</span><span className="font-medium text-gray-900">{count}</span></div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenus - 30 derniers jours</h3>
                <div className="text-sm text-gray-600 space-y-1 max-h-64 overflow-auto">
                  {Object.entries(stats.superAdmin.dailyRevenue || {}).map(([date, amount]) => (
                    <div key={date} className="flex justify-between"><span>{date}</span><span className="font-medium text-gray-900">{((amount || 0) / 100).toLocaleString()} FCFA</span></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Statuts des commandes */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statuts des commandes</h3>
            <div className="space-y-3">
              {Object.entries(stats?.ordersByStatus || {}).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      status === 'PENDING' ? 'bg-yellow-400' :
                      status === 'CONFIRMED' ? 'bg-blue-400' :
                      status === 'PROCESSING' ? 'bg-orange-400' :
                      status === 'SHIPPED' ? 'bg-purple-400' :
                      status === 'DELIVERED' ? 'bg-green-400' :
                      'bg-red-400'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-700">
                      {status === 'PENDING' ? 'En attente' :
                       status === 'CONFIRMED' ? 'Confirmées' :
                       status === 'PROCESSING' ? 'En traitement' :
                       status === 'SHIPPED' ? 'Expédiées' :
                       status === 'DELIVERED' ? 'Livrées' :
                       'Annulées'}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Top boutiques */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Boutiques</h3>
            <div className="space-y-4">
              {stats?.topStores?.map((store, index) => (
                <div key={store?.id} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{store?.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>⭐ {store?.rating ?? 0}</span>
                      <span>{store?._count?.products ?? 0} produits</span>
                      <span>{(store?.totalSales ?? 0).toLocaleString()} ventes</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/admin/orders?status=PENDING" className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">⏳</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Commandes en attente</h4>
                <p className="text-sm text-gray-500">Traiter les nouvelles commandes</p>
              </div>
            </Link>

            <Link href="/admin/stores?status=pending" className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">🏪</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Nouvelles boutiques</h4>
                <p className="text-sm text-gray-500">Valider les demandes</p>
              </div>
            </Link>

            <Link href="/admin/banners" className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">🎠</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Carrousel d'accueil</h4>
                <p className="text-sm text-gray-500">Gérer les bannières</p>
              </div>
            </Link>

            <Link href="/admin/reports" className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Rapports détaillés</h4>
                <p className="text-sm text-gray-500">Analyses et statistiques</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
