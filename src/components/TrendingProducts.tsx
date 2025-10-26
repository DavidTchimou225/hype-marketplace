'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import Image from 'next/image';
import AddToCartButton from './AddToCartButton';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string;
  rating: number;
  slug: string;
  store: {
    name: string;
    avatar?: string | null;
  };
  colors: string;
  sizes: string;
  reviewCount: number;
  stock: number;
}

export default function TrendingProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingProducts();
  }, []);

  const fetchTrendingProducts = async () => {
    try {
      const response = await fetch('/api/trending?limit=10');
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price / 100) + ' FCFA';
  };

  if (loading) {
    return (
      <div className="px-4 py-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Tendances</h3>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
              <div className="h-40 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2 w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Tendances</h3>
      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <Link key={product.id} href={`/product/${product.slug}`} className="block">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm product-card cursor-pointer hover:shadow-md transition-shadow">
              <div className="h-40 bg-gray-200 flex items-center justify-center relative overflow-hidden">
                {product.images && (product.images.startsWith('http') || product.images.startsWith('/')) ? (
                  <img
                    src={product.images.split(',')[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-sm p-2 text-center">Pas d'image</div>
                )}
                {product.stock <= 5 && product.stock > 0 && (
                  <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                    Plus que {product.stock}
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-bold">Rupture de stock</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h4>
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={product.store.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.store.name)}&background=3B82F6&color=fff&size=32`}
                    alt={product.store.name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <p className="text-sm text-gray-500">{product.store.name}</p>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">({product.reviewCount})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  <div onClick={handleAddToCart}>
                    <AddToCartButton
                      productId={product.id}
                      quantity={1}
                      color={product.colors?.split(',')[0]}
                      size={product.sizes?.split(',')[0]}
                      className="w-8 h-8 bg-black rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      disabled={product.stock === 0}
                    >
                      <span className="text-white text-lg">+</span>
                    </AddToCartButton>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
