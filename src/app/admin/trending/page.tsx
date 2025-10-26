'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string;
  store: {
    name: string;
    slug: string;
  };
}

interface TrendingProduct {
  id: string;
  productId: string;
  order: number;
  isActive: boolean;
  product: Product;
}

export default function AdminTrendingPage() {
  const [trending, setTrending] = useState<TrendingProduct[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [trendingRes, productsRes] = await Promise.all([
        fetch('/api/admin/trending'),
        fetch('/api/products?limit=100')
      ]);

      if (trendingRes.ok) {
        const data = await trendingRes.json();
        setTrending(data.trending || []);
      }

      if (productsRes.ok) {
        const data = await productsRes.json();
        setAllProducts(data.products || []);
      }
    } catch (error) {
      console.error('Erreur fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (productId: string) => {
    try {
      const response = await fetch('/api/admin/trending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          order: trending.length
        })
      });

      if (response.ok) {
        alert('✅ Produit ajouté aux tendances !');
        fetchData();
        setShowAddModal(false);
        setSearchQuery('');
      } else {
        const data = await response.json();
        alert(`❌ ${data.error}`);
      }
    } catch (error) {
      console.error('Erreur add:', error);
      alert('❌ Erreur lors de l\'ajout');
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm('Retirer ce produit des tendances ?')) return;

    try {
      const response = await fetch(`/api/admin/trending?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('✅ Produit retiré des tendances');
        fetchData();
      } else {
        alert('❌ Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur remove:', error);
      alert('❌ Erreur lors de la suppression');
    }
  };

  const filteredProducts = allProducts.filter(p => {
    const inTrending = trending.some(t => t.productId === p.id);
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return !inTrending && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Produits Tendances</h1>
              <p className="text-sm text-gray-500 mt-1">
                Sélectionnez les produits à afficher sur la page d'accueil
              </p>
            </div>
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              ← Retour Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                    🔥
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tendances actives</p>
                    <p className="text-2xl font-bold text-gray-900">{trending.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                    📦
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Produits disponibles</p>
                    <p className="text-2xl font-bold text-gray-900">{allProducts.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  ➕ Ajouter un produit
                </button>
              </div>
            </div>

            {/* Produits Tendances Actuels */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Produits en Tendances ({trending.length})
              </h2>

              {trending.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-gray-500">Aucun produit en tendances</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Ajouter le premier produit
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trending.map((item, index) => {
                    const firstImage = item.product.images.split(',')[0];
                    const priceInFCFA = item.product.price / 100;

                    return (
                      <div key={item.id} className="bg-gray-50 rounded-xl p-4 relative">
                        {/* Ordre */}
                        <div className="absolute top-2 left-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm z-10">
                          {index + 1}
                        </div>

                        {/* Image */}
                        <div className="relative h-48 bg-gray-200 rounded-lg mb-3 overflow-hidden">
                          {firstImage ? (
                            <Image
                              src={firstImage}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl">
                              📦
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-1">
                          {item.product.store.name}
                        </p>
                        <p className="text-lg font-bold text-gray-900 mb-3">
                          {priceInFCFA.toLocaleString()} FCFA
                        </p>

                        {/* Actions */}
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="w-full bg-red-100 text-red-600 py-2 rounded-lg font-medium hover:bg-red-200 transition-colors"
                        >
                          ❌ Retirer
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal Ajouter */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowAddModal(false);
            setSearchQuery('');
          }}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  Ajouter un produit aux tendances
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setSearchQuery('');
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Search */}
              <div className="mt-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un produit..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Liste Produits */}
            <div className="p-6 overflow-y-auto max-h-[500px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProducts.length === 0 ? (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    {searchQuery
                      ? 'Aucun produit trouvé'
                      : 'Tous les produits sont déjà en tendances'}
                  </div>
                ) : (
                  filteredProducts.map((product) => {
                    const firstImage = product.images.split(',')[0];
                    const priceInFCFA = product.price / 100;

                    return (
                      <div
                        key={product.id}
                        className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => handleAddProduct(product.id)}
                      >
                        <div className="flex gap-3">
                          {/* Image */}
                          <div className="relative w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            {firstImage ? (
                              <Image
                                src={firstImage}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-2xl">
                                📦
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                              {product.name}
                            </h4>
                            <p className="text-xs text-gray-500 mb-1">
                              {product.store.name}
                            </p>
                            <p className="text-sm font-bold text-gray-900">
                              {priceInFCFA.toLocaleString()} FCFA
                            </p>
                          </div>

                          {/* Bouton */}
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                              +
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
