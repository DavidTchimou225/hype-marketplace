'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/CartProvider';
import CartIcon from '@/components/CartIcon';
import ShareButton from '@/components/ShareButton';
import BottomNavigation from '@/components/BottomNavigation';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string;
  colors: string;
  sizes: string;
  stock: number;
  rating: number;
  reviewCount: number;
  store: {
    id: string;
    name: string;
    rating: number;
    slug: string;
    avatar?: string | null;
  };
  categories: Array<{
    id: string;
    name: string;
    image: string | null;
  }>;
  reviews: Array<{
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    user: {
      firstName: string;
      lastName: string;
    };
  }>;
}

interface ProductClientProps {
  product: Product;
}

export default function ProductClient({ product }: ProductClientProps) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Parse product data
  const images = product.images.split(',').filter(img => img.trim());
  const colors = product.colors.split(',').filter(color => color.trim());
  const sizes = product.sizes.split(',').filter(size => size.trim());
  const priceInFCFA = product.price / 100; // Convert from centimes to FCFA

  // Tracker la vue du produit au chargement
  useEffect(() => {
    const trackView = async () => {
      try {
        await fetch(`/api/products/${product.id}/track`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'view' })
        });
      } catch (error) {
        console.error('Erreur tracking vue:', error);
      }
    };

    trackView();
  }, [product.id]);

  // Set default selections
  if (!selectedColor && colors.length > 0) {
    setSelectedColor(colors[0]);
  }
  if (!selectedSize && sizes.length > 0) {
    setSelectedSize(sizes[0]);
  }

  const handleAddToCart = async () => {
    if (!selectedColor || !selectedSize) {
      return;
    }

    setIsAddingToCart(true);
    try {
      // Ajouter au panier
      await addToCart(product.id, quantity, selectedColor, selectedSize);
      
      // Tracker l'ajout au panier
      await fetch(`/api/products/${product.id}/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cart_add' })
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const getColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'rouge': 'bg-red-500',
      'red': 'bg-red-500',
      'bleu': 'bg-blue-500',
      'blue': 'bg-blue-500',
      'vert': 'bg-green-500',
      'green': 'bg-green-500',
      'jaune': 'bg-yellow-500',
      'yellow': 'bg-yellow-500',
      'noir': 'bg-black',
      'black': 'bg-black',
      'blanc': 'bg-white border border-gray-300',
      'white': 'bg-white border border-gray-300',
      'rose': 'bg-pink-500',
      'pink': 'bg-pink-500',
      'violet': 'bg-purple-500',
      'purple': 'bg-purple-500',
      'orange': 'bg-orange-500',
      'marron': 'bg-amber-800',
      'brown': 'bg-amber-800',
      'beige': 'bg-amber-200',
      'gris': 'bg-gray-500',
      'gray': 'bg-gray-500',
    };
    return colorMap[color.toLowerCase()] || 'bg-gray-400';
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
        <CartIcon />
      </div>

      {/* Product Navigation */}
      <div className="bg-white px-4 py-3 flex justify-between items-center border-b">
        <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <span className="text-xl">←</span>
        </Link>
        <h2 className="text-lg font-semibold text-gray-900">Détails Produit</h2>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <span className="text-xl">♡</span>
        </button>
      </div>

      <div className="max-w-md mx-auto bg-white lg:max-w-4xl lg:grid lg:grid-cols-2 lg:gap-8">
        {/* Product Image Gallery */}
        <div className="px-4 py-6 lg:px-6">
          <div className="bg-gray-200 rounded-2xl h-80 lg:h-96 flex items-center justify-center mb-4 relative overflow-hidden">
            {images.length > 0 ? (
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : product.categories[0]?.image ? (
              <Image
                src={product.categories[0].image}
                alt={product.categories[0].name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <span className="text-8xl lg:text-9xl">📦</span>
            )}
          </div>
          
          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="flex gap-2 justify-center lg:justify-start">
              {images.slice(0, 4).map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-16 h-16 lg:w-20 lg:h-20 rounded-lg relative overflow-hidden ${
                    selectedImage === index 
                      ? 'border-2 border-black' 
                      : 'border border-gray-200'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="px-4 pb-6 lg:px-6 lg:py-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          
          {/* Rating and Price */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>{i < Math.floor(product.rating) ? '⭐' : '☆'}</span>
                ))}
              </div>
              <span className="text-sm text-gray-500">({product.rating}) • {product.reviewCount} avis</span>
            </div>
            <span className="text-2xl lg:text-3xl font-bold text-gray-900 sm:ml-auto">
              {priceInFCFA.toLocaleString()} FCFA
            </span>
          </div>

          {/* Store Info */}
          <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white border-2 border-gray-200 flex-shrink-0">
                <img
                  src={product.store.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.store.name)}&background=000&color=fff`}
                  alt={product.store.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{product.store.name}</h3>
                <div className="flex items-center gap-1">
                  <div className="flex text-yellow-400 text-sm">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>{i < Math.floor(product.store.rating) ? '⭐' : '☆'}</span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">({product.store.rating})</span>
                </div>
              </div>
            </div>
            <Link href={`/store/${product.store.slug}`} className="text-blue-500 font-medium">
              Visiter
            </Link>
          </div>

          {/* Size Selection */}
          {sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Taille</h3>
              <div className="flex gap-2 flex-wrap">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedSize === size
                        ? 'bg-black text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {colors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Couleur</h3>
              <div className="flex gap-3 flex-wrap">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full ${getColorClass(color)} transition-all ${
                      selectedColor === color
                        ? 'ring-2 ring-gray-400 ring-offset-2 scale-110'
                        : 'hover:scale-105'
                    }`}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantité</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold hover:bg-gray-300 transition-colors"
              >
                -
              </button>
              <span className="text-xl lg:text-2xl font-semibold w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold hover:bg-gray-300 transition-colors"
              >
                +
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">Stock disponible: {product.stock}</p>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Add to Cart Button */}
          <button 
            onClick={handleAddToCart}
            disabled={isAddingToCart || product.stock === 0}
            className="w-full bg-black text-white py-4 rounded-2xl font-semibold text-lg mb-4 hover:bg-gray-800 transition-colors active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isAddingToCart ? 'Ajout en cours...' : product.stock === 0 ? 'Rupture de stock' : 'Ajouter au Panier'}
          </button>

          {/* Share Button */}
          <div className="w-full">
            <ShareButton 
              url={`/product/${product.slug}`}
              title={product.name}
              description={`${product.description.substring(0, 100)}... - ${priceInFCFA.toLocaleString()} FCFA`}
              type="product"
            />
          </div>

          {/* Customer Reviews */}
          {product.reviews.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Avis Clients ({product.reviewCount})</h3>
              
              {product.reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="bg-gray-50 rounded-2xl p-4 mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm">👤</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {review.user.firstName} {review.user.lastName[0]}.
                      </h4>
                      <div className="flex text-yellow-400 text-sm">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>{i < review.rating ? '⭐' : '☆'}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-gray-600 text-sm">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}

              {product.reviewCount > 3 && (
                <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-2xl font-medium">
                  Voir tous les avis
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
