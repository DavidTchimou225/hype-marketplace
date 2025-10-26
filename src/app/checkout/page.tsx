'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '../../components/CartProvider';
import { useAuth } from '../../components/AuthProvider';
import LoginButton from '../../components/LoginButton';
import AddressMapPicker from '@/components/AddressMapPicker';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
    city: 'Abidjan',
    paymentMethod: 'mobile_money'
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || '',
      }));
    }
  }, [user]);

  if (!isAuthenticated) {
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
          <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <span className="text-xl">←</span>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Commande</h1>
          <div className="w-10"></div>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Créer la commande
      const orderData = {
        userId: user?.id || 'guest-user',
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
          color: item.color,
          size: item.size
        })),
        paymentMethod: formData.paymentMethod,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city
        }
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setOrderNumber(result.order.orderNumber);
        setOrderComplete(true);
        clearCart();
      } else {
        const errorMessage = result.details || result.error || 'Erreur lors de la création de la commande';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la commande. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price / 100) + ' FCFA';
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✅</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Commande confirmée !</h2>
          <p className="text-gray-600 mb-4">
            Votre commande #{orderNumber} a été enregistrée avec succès.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Vous recevrez un SMS de confirmation sous peu.
          </p>
          <Link 
            href="/"
            className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors inline-block"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Panier vide</h2>
          <p className="text-gray-600 mb-6">Ajoutez des articles à votre panier avant de passer commande.</p>
          <Link 
            href="/"
            className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors inline-block"
          >
            Continuer mes achats
          </Link>
        </div>
      </div>
    );
  }

  const shippingFee = 200000; // 2,000 FCFA en centimes
  const totalWithShipping = total + shippingFee;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white px-4 py-3 flex items-center border-b">
        <Link href="/cart" className="mr-4">
          <span className="text-xl">←</span>
        </Link>
        <h1 className="text-lg font-semibold">Finaliser la commande</h1>
      </header>

      <div className="p-4 max-w-md mx-auto">
        {/* Résumé commande */}
        <div className="bg-white rounded-2xl p-4 mb-4">
          <h3 className="font-semibold mb-3">Résumé de la commande</h3>
          {items.map((item) => (
            <div key={`${item.productId}-${item.color}-${item.size}`} className="flex justify-between items-center mb-2">
              <div className="flex-1">
                <p className="text-sm font-medium">{item.product.name}</p>
                <p className="text-xs text-gray-500">
                  {item.color && `Couleur: ${item.color}`} {item.size && `• Taille: ${item.size}`}
                </p>
                <p className="text-xs text-gray-500">Qté: {item.quantity}</p>
              </div>
              <span className="text-sm font-medium">
                {formatPrice(item.product.price * item.quantity)}
              </span>
            </div>
          ))}
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between text-sm">
              <span>Sous-total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Livraison</span>
              <span>{formatPrice(shippingFee)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg mt-2">
              <span>Total</span>
              <span>{formatPrice(totalWithShipping)}</span>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-2xl p-4">
            <h3 className="font-semibold mb-3">Informations de livraison</h3>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                name="firstName"
                placeholder="Prénom"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-lg"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Nom"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-lg"
                required
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-200 rounded-lg mb-3"
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Téléphone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-200 rounded-lg mb-3"
              required
            />

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse de livraison *
              </label>
              <AddressMapPicker
                initialAddress={formData.address}
                onAddressSelect={(address, lat, lng) => {
                  setFormData(prev => ({
                    ...prev,
                    address,
                    latitude: lat,
                    longitude: lng
                  }));
                }}
              />
            </div>

            <select
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-200 rounded-lg"
              required
            >
              <option value="Abidjan">Abidjan</option>
              <option value="Bouaké">Bouaké</option>
              <option value="Daloa">Daloa</option>
              <option value="Yamoussoukro">Yamoussoukro</option>
              <option value="San-Pédro">San-Pédro</option>
            </select>
          </div>

          <div className="bg-white rounded-2xl p-4">
            <h3 className="font-semibold mb-3">Mode de paiement</h3>
            
            <div className="space-y-2">
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="mobile_money"
                  checked={formData.paymentMethod === 'mobile_money'}
                  onChange={handleInputChange}
                  className="mr-3"
                />
                <span>Mobile Money (Orange/MTN)</span>
              </label>
              
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash_on_delivery"
                  checked={formData.paymentMethod === 'cash_on_delivery'}
                  onChange={handleInputChange}
                  className="mr-3"
                />
                <span>Paiement à la livraison</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Traitement...' : `Confirmer la commande • ${formatPrice(totalWithShipping)}`}
          </button>
        </form>
      </div>
    </div>
  );
}
