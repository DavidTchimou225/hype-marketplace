'use client';

import { useState } from 'react';
import { useCart } from './CartProvider';

interface AddToCartButtonProps {
  productId: string;
  quantity?: number;
  color?: string;
  size?: string;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export default function AddToCartButton({
  productId,
  quantity = 1,
  color,
  size,
  className = "w-full bg-black text-white py-4 rounded-2xl font-semibold text-lg hover:bg-gray-800 transition-colors active:scale-95",
  children = "Ajouter au Panier",
  disabled = false
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { addToCart } = useCart();

  const handleClick = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    try {
      const success = await addToCart(productId, quantity, color, size);
      
      if (success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 1500);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${
        showSuccess ? 'bg-green-500 hover:bg-green-600' : ''
      }`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Ajout...
        </div>
      ) : showSuccess ? (
        <div className="flex items-center justify-center gap-2">
          <span>✓</span>
          Ajouté !
        </div>
      ) : (
        children
      )}
    </button>
  );
}
