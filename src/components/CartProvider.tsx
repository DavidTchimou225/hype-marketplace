'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  color?: string;
  size?: string;
  product: {
    id: string;
    name: string;
    price: number;
    images: string;
    slug: string;
    store: {
      name: string;
      avatar?: string | null;
    };
  };
}

interface CartContextType {
  items: CartItem[];
  addToCart: (productId: string, quantity?: number, color?: string, size?: string) => Promise<boolean>;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  total: number;
  cartCount: number;
  loading: boolean;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  // Charger le panier depuis localStorage au démarrage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('hype-market-cart');
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Erreur lors du chargement du panier:', error);
          localStorage.removeItem('hype-market-cart');
        }
      }
    }
  }, []);

  // Sauvegarder le panier dans localStorage à chaque modification
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hype-market-cart', JSON.stringify(items));
    }
  }, [items]);

  const addToCart = async (productId: string, quantity = 1, color?: string, size?: string) => {
    if (typeof window === 'undefined') return false;
    
    setLoading(true);
    try {
      // Récupérer les infos du produit depuis l'API
      const response = await fetch(`/api/products?id=${productId}`);
      if (!response.ok) {
        console.error('Produit introuvable');
        return false;
      }
      
      const data = await response.json();
      const product = data.products[0];
      
      if (!product) {
        console.error('Produit introuvable');
        return false;
      }

      // Créer un ID unique pour l'article du panier
      const cartItemId = `${productId}-${color || 'default'}-${size || 'default'}`;
      
      setItems(currentItems => {
        const existingItem = currentItems.find(item => item.id === cartItemId);
        
        if (existingItem) {
          // Augmenter la quantité si l'article existe déjà
          return currentItems.map(item =>
            item.id === cartItemId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          // Ajouter un nouvel article
          const newItem: CartItem = {
            id: cartItemId,
            productId,
            quantity,
            color,
            size,
            product: {
              id: product.id,
              name: product.name,
              price: product.price,
              images: product.images,
              slug: product.slug,
              store: {
                name: product.store.name,
              },
            },
          };
          return [...currentItems, newItem];
        }
      });
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (itemId: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      total: totalAmount,
      cartCount: totalItems,
      loading,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
