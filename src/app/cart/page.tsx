'use client';

import { useCart } from '@/components/CartProvider';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, total, cartCount, loading } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price / 100) + ' FCFA';
  };

  const shippingCost = 200000; // 2,000 FCFA en centimes

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
          <h1 className="text-xl font-bold text-gray-900">Mon Panier</h1>
        </div>
        <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          {cartCount}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="px-4 py-16 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Votre panier est vide</h2>
          <p className="text-gray-500 mb-6">Découvrez nos produits et ajoutez vos favoris !</p>
          <Link 
            href="/" 
            className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            Continuer mes achats
          </Link>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="px-4 py-6 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
                    {item.product.images && (item.product.images.startsWith('http') || item.product.images.startsWith('/')) ? (
                      <img
                        src={item.product.images.split(',')[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400 text-xs">Pas d'image</div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <Link href={`/product/${item.product.slug}`}>
                      <h3 className="font-semibold text-gray-900 mb-1 hover:text-blue-600">
                        {item.product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mb-2">
                      <img
                        src={item.product.store.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.product.store.name)}&background=3B82F6&color=fff&size=32`}
                        alt={item.product.store.name}
                        className="w-4 h-4 rounded-full object-cover"
                      />
                      <p className="text-sm text-gray-500">{item.product.store.name}</p>
                    </div>
                    
                    {/* Variants */}
                    <div className="flex gap-4 text-sm text-gray-600 mb-3">
                      {item.color && <span>Couleur: {item.color}</span>}
                      {item.size && <span>Taille: {item.size}</span>}
                    </div>

                    {/* Price and Quantity */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={loading || item.quantity <= 1}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                        >
                          -
                        </button>
                        <span className="font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={loading}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold text-gray-900">
                          {formatPrice(item.product.price * item.quantity)}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          disabled={loading}
                          className="text-red-500 text-sm hover:text-red-700 disabled:opacity-50"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="px-4 pb-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Résumé de la commande</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Sous-total ({cartCount} articles)</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frais de livraison</span>
                  <span>{formatPrice(shippingCost)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(total + shippingCost)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-center block hover:bg-gray-800 transition-colors"
              >
                Passer la commande
              </Link>
            </div>
          </div>
        </>
      )}

      {/* Bottom padding */}
      <div className="h-20"></div>
    </div>
  );
}
