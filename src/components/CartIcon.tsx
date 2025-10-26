'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';

export default function CartIcon() {
  const { cartCount } = useCart();

  return (
    <Link href="/cart" className="relative">
      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
        🛒
      </div>
      {cartCount > 0 && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
          {cartCount}
        </div>
      )}
    </Link>
  );
}
