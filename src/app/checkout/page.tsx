'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../components/CartProvider';
import { useAuth } from '../../components/AuthProvider';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: 'Abidjan',
    paymentMethod: 'mobile_money',
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const validate = () => {
    const e: any = {};
    if (!form.firstName.trim()) e.firstName = 'Prénom requis';
    if (!form.lastName.trim()) e.lastName = 'Nom requis';
    if (!form.email.trim()) e.email = 'Email requis';
    if (!form.phone.trim()) e.phone = 'Téléphone requis';
    if (!form.address.trim()) e.address = 'Adresse requise';
    if (!form.city.trim()) e.city = 'Ville requise';
    if (!form.paymentMethod.trim()) e.paymentMethod = 'Mode de paiement requis';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev: any) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const orderData = {
        userId: user?.id || 'guest-user',
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
          color: item.color,
          size: item.size
        })),
        paymentMethod: form.paymentMethod,
        shippingAddress: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city
        }
      };
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setOrderNumber(result.order.orderNumber);
        setOrderComplete(true);
        clearCart();
      } else {
        setErrors({ submit: result.details || result.error || 'Erreur lors de la création de la commande' });
      }
    } catch (error: any) {
      setErrors({ submit: error?.message || 'Erreur lors de la commande' });
    } finally {
      setLoading(false);
    }
  };

  let content = null;
  const formatPrice = (price: number) => new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0 }).format(price / 100) + ' FCFA';
  const shippingFee = 200000;
  const totalWithShipping = total + shippingFee;

  if (!isAuthenticated) {
    content = <div className="min-h-screen flex items-center justify-center">Veuillez vous connecter.</div>;
  } else if (orderComplete) {
    content = (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-md p-8 text-center max-w-md w-full">
          <div className="text-4xl mb-4">✅</div>
          <h2 className="text-xl font-bold mb-2">Commande confirmée !</h2>
          <p className="mb-4">Votre commande #{orderNumber} a été enregistrée avec succès.</p>
          <button onClick={() => router.push('/')} className="w-full bg-black text-white py-3 rounded-lg font-medium">Retour à l'accueil</button>
        </div>
      </div>
    );
  } else if (items.length === 0) {
    content = <div className="min-h-screen flex items-center justify-center">Panier vide.</div>;
  } else {
    content = (
      <div className="min-h-screen bg-gray-50 pb-32">
        <div className="max-w-md mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Finaliser la commande</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input name="firstName" placeholder="Prénom" value={form.firstName} onChange={handleChange} className="w-full p-3 border rounded-lg mb-1" />
              {errors.firstName && <div className="text-red-500 text-sm">{errors.firstName}</div>}
            </div>
            <div>
              <input name="lastName" placeholder="Nom" value={form.lastName} onChange={handleChange} className="w-full p-3 border rounded-lg mb-1" />
              {errors.lastName && <div className="text-red-500 text-sm">{errors.lastName}</div>}
            </div>
            <div>
              <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full p-3 border rounded-lg mb-1" />
              {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
            </div>
            <div>
              <input name="phone" type="tel" placeholder="Téléphone" value={form.phone} onChange={handleChange} className="w-full p-3 border rounded-lg mb-1" />
              {errors.phone && <div className="text-red-500 text-sm">{errors.phone}</div>}
            </div>
            <div>
              <input name="address" placeholder="Adresse de livraison" value={form.address} onChange={handleChange} className="w-full p-3 border rounded-lg mb-1" />
              {errors.address && <div className="text-red-500 text-sm">{errors.address}</div>}
            </div>
            <div>
              <select name="city" value={form.city} onChange={handleChange} className="w-full p-3 border rounded-lg mb-1">
                <option value="Abidjan">Abidjan</option>
                <option value="Bouaké">Bouaké</option>
                <option value="Daloa">Daloa</option>
                <option value="Yamoussoukro">Yamoussoukro</option>
                <option value="San-Pédro">San-Pédro</option>
              </select>
              {errors.city && <div className="text-red-500 text-sm">{errors.city}</div>}
            </div>
            <div>
              <div className="font-semibold mb-2">Mode de paiement</div>
              <label className="flex items-center mb-2">
                <input type="radio" name="paymentMethod" value="mobile_money" checked={form.paymentMethod === 'mobile_money'} onChange={handleChange} className="mr-2" /> Mobile Money (Orange/MTN)
              </label>
              <label className="flex items-center">
                <input type="radio" name="paymentMethod" value="cash_on_delivery" checked={form.paymentMethod === 'cash_on_delivery'} onChange={handleChange} className="mr-2" /> Paiement à la livraison
              </label>
              {errors.paymentMethod && <div className="text-red-500 text-sm">{errors.paymentMethod}</div>}
            </div>
            {errors.submit && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">{errors.submit}</div>}
            <div className="mt-8">
              <div className="fixed bottom-0 left-0 w-full max-w-md mx-auto px-4 pb-4 z-50 bg-gradient-to-t from-white via-white/90 to-transparent md:static md:px-0 md:pb-0">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-4 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 shadow-xl"
                >
                  {loading ? 'Traitement...' : `Valider et payer • ${formatPrice(totalWithShipping)}`}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
  return content;
}