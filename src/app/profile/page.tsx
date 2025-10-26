'use client';

import { useAuth } from '@/components/AuthProvider';
import LoginButton from '@/components/LoginButton';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      name: string;
      images: string;
    };
  }>;
}

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadOrders();
    }
  }, [isAuthenticated, user]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/orders?userId=${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'PROCESSING': return 'bg-purple-100 text-purple-800';
      case 'SHIPPED': return 'bg-orange-100 text-orange-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'En attente';
      case 'CONFIRMED': return 'Confirmée';
      case 'PROCESSING': return 'En préparation';
      case 'SHIPPED': return 'Expédiée';
      case 'DELIVERED': return 'Livrée';
      case 'CANCELLED': return 'Annulée';
      default: return status;
    }
  };

  const handleLogout = () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      logout();
    }
  };

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
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <span className="text-xl">←</span>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Profil</h1>
          <div className="w-10"></div>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6 mx-auto">
              <span className="text-4xl">👤</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Connexion requise</h2>
            <p className="text-gray-600 mb-8 max-w-sm">
              Connectez-vous pour accéder à votre profil et voir votre historique de commandes.
            </p>
            <LoginButton />
          </div>
        </div>


        <div className="h-20"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
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
        <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <span className="text-xl">←</span>
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Profil</h1>
        <div className="w-10"></div>
      </div>

      {/* User Info */}
      <div className="bg-white mx-4 mt-4 rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-bold">
              {user?.firstName[0]}{user?.lastName[0]}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-gray-600">{user?.email}</p>
            {user?.phone && (
              <p className="text-gray-600">{user.phone}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
            <div className="text-sm text-gray-500">Commandes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {orders.filter(o => o.status === 'DELIVERED').length}
            </div>
            <div className="text-sm text-gray-500">Livrées</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {orders.filter(o => ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED'].includes(o.status)).length}
            </div>
            <div className="text-sm text-gray-500">En cours</div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <span className="text-lg">🚪</span>
          <span>Se déconnecter</span>
        </button>
      </div>

      {/* Orders History */}
      <div className="px-4 py-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Historique des commandes</h3>
        
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">📦</span>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Aucune commande</h4>
            <p className="text-gray-600 mb-4">Vous n'avez pas encore passé de commande.</p>
            <Link 
              href="/"
              className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
              Découvrir les produits
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">#{order.orderNumber}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
                
                <div className="space-y-2 mb-3">
                  {order.items.slice(0, 2).map((item) => {
                    const imageUrl = (item.product.images || '').split(',')[0] || '';
                    const hasValidImage = imageUrl && (imageUrl.startsWith('http') || imageUrl.startsWith('/'));
                    
                    return (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                          {hasValidImage ? (
                            <img 
                              src={imageUrl} 
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-400 text-xs">📦</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Quantité: {item.quantity} • {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  {order.items.length > 2 && (
                    <p className="text-xs text-gray-500 pl-13">
                      +{order.items.length - 2} autre(s) article(s)
                    </p>
                  )}
                </div>
                
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">
                    Total: {formatPrice(order.totalAmount)}
                  </span>
                  <button className="text-blue-500 text-sm font-medium">
                    Voir détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
