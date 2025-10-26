'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface OrderItem {
  quantity: number;
  price: number; // cents
  color?: string | null;
  size?: string | null;
  product: { name: string; images?: string | null };
}
interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number; // cents
  createdAt: string;
  user: { firstName: string; lastName: string; email?: string };
  items: OrderItem[];
}

export default function BoutiqueOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (status) params.set('status', status);
      if (from) params.set('from', from);
      if (to) params.set('to', to);
      const url = `/api/boutique/orders${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await fetch(url);
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || 'Erreur lors du chargement des commandes');
      }
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (e: any) {
      setError(e.message || 'Erreur inattendue');
    } finally {
      setLoading(false);
    }
  };


  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      PROCESSING: 'bg-purple-100 text-purple-800',
      SHIPPED: 'bg-indigo-100 text-indigo-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    const cls = classes[status] || 'bg-gray-100 text-gray-800';
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${cls}`}>{status}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Chargement des commandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Commandes</h1>
              <p className="text-gray-600">Suivez et gérez vos commandes</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/boutique/dashboard?tab=orders')}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Retour au dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">Tous</option>
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Du</label>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Au</label>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div className="flex items-end gap-2">
              <button onClick={loadOrders} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Filtrer</button>
              <button onClick={() => { setStatus(''); setFrom(''); setTo(''); setTimeout(loadOrders, 0); }} className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">Réinitialiser</button>
            </div>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center bg-white rounded-lg shadow-sm p-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune commande</h3>
            <p className="text-gray-500">Les commandes de vos produits apparaîtront ici.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">Commande #{order.orderNumber}</h3>
                    <p className="text-sm text-gray-500">
                      {order.user.firstName} {order.user.lastName} • {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(order.status)}
                    <p className="text-sm font-medium text-gray-900 mt-1">{(order.totalAmount / 100).toLocaleString('fr-FR')} FCFA</p>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {order.items.map((item, idx) => {
                    const imageUrl = (item.product.images || '').split(',')[0] || '';
                    const hasValidImage = imageUrl && (imageUrl.startsWith('http') || imageUrl.startsWith('/'));
                    
                    return (
                      <div key={idx} className="flex items-center justify-between py-2">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 mr-3 flex-shrink-0">
                            {hasValidImage ? (
                              <img
                                src={imageUrl}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                📦
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-800">
                              {item.product.name} ×{item.quantity}
                            </div>
                            {(item.color || item.size) && (
                              <div className="text-xs text-gray-500 mt-0.5">
                                {item.color && <span>Couleur: {item.color}</span>}
                                {item.color && item.size && <span> • </span>}
                                {item.size && <span>Taille: {item.size}</span>}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {((item.price * item.quantity) / 100).toLocaleString('fr-FR')} FCFA
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
