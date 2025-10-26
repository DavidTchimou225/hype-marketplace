'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface StoreApplication {
  id: string;
  ownerFirstName: string;
  ownerLastName: string;
  ownerEmail: string;
  ownerPhone: string;
  storeName: string;
  storeDescription: string;
  productCategories: string[];
  businessType: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  hasBusinessLicense: boolean;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<StoreApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState<StoreApplication | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string; link?: { href: string; label: string } } | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadApplications();
  }, [statusFilter, searchTerm]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/admin/applications?${params}`);
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (applicationId: string, action: 'approve' | 'reject') => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/admin/applications/${applicationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action, 
          rejectionReason: action === 'reject' ? rejectionReason : undefined 
        })
      });

      if (response.ok) {
        const data = await response.json();
        await loadApplications();
        setSelectedApp(null);
        setRejectionReason('');

        if (action === 'approve') {
          // Afficher une notification de succès avec lien rapide
          const slug = data?.slug as string | undefined;
          setNotice({
            type: 'success',
            message: 'Boutique approuvée et inscrite avec succès.',
            link: slug ? { href: `/store/${slug}`, label: 'Voir la boutique' } : { href: '/admin/stores', label: 'Voir les boutiques' }
          });
        } else {
          setNotice({ type: 'success', message: 'Demande rejetée.' });
        }
      } else {
        const err = await response.json().catch(() => ({}));
        setNotice({ type: 'error', message: err?.error || 'Action impossible. Vérifiez votre session admin.' });
      }
    } catch (error) {
      console.error('Erreur lors de l\'action:', error);
      setNotice({ type: 'error', message: 'Erreur lors du traitement. Réessayez.' });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800'
    };
    const labels = {
      PENDING: 'En attente',
      APPROVED: 'Approuvée',
      REJECTED: 'Rejetée'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {notice && (
        <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4`}>
          <div className={`${notice.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'} border rounded-lg p-4 flex items-center justify-between`}>
            <div>
              <p className="text-sm font-medium">{notice.message}</p>
              {notice.link && (
                <a href={notice.link.href} className="text-sm underline font-medium block mt-1">
                  {notice.link.label}
                </a>
              )}
            </div>
            <button onClick={() => setNotice(null)} className="text-sm opacity-70 hover:opacity-100">Fermer</button>
          </div>
        </div>
      )}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Demandes d'inscription</h1>
              <p className="text-gray-600">Gérer les demandes de création de boutiques</p>
            </div>
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="px-4 py-2 text-blue-600 hover:text-blue-800"
            >
              ← Retour au tableau de bord
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Rechercher par nom, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="PENDING">En attente</option>
              <option value="APPROVED">Approuvées</option>
              <option value="REJECTED">Rejetées</option>
            </select>
          </div>
        </div>

        {/* Liste des demandes */}
        <div className="bg-white rounded-lg shadow-sm">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Chargement...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Aucune demande trouvée
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Propriétaire
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Boutique
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Catégories
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {app.ownerFirstName} {app.ownerLastName}
                          </div>
                          <div className="text-sm text-gray-500">{app.ownerEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{app.storeName}</div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">{app.storeDescription}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {app.productCategories.map((cat, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(app.submittedAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Voir détails
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de détails */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Détails de la demande</h2>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Informations du propriétaire</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Nom:</span>
                      <span className="ml-2">{selectedApp.ownerFirstName} {selectedApp.ownerLastName}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <span className="ml-2">{selectedApp.ownerEmail}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Téléphone:</span>
                      <span className="ml-2">{selectedApp.ownerPhone}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Informations de la boutique</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Nom:</span>
                      <span className="ml-2">{selectedApp.storeName}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Description:</span>
                      <p className="mt-1 text-gray-900">{selectedApp.storeDescription}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <span className="ml-2">{selectedApp.businessType}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Catégories de produits</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedApp.productCategories.map((cat, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedApp.status === 'PENDING' && (
                  <div className="border-t pt-6">
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleAction(selectedApp.id, 'approve')}
                        disabled={actionLoading}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        {actionLoading ? 'Traitement...' : 'Approuver'}
                      </button>
                      <button
                        onClick={() => handleAction(selectedApp.id, 'reject')}
                        disabled={actionLoading}
                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50"
                      >
                        Rejeter
                      </button>
                    </div>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Raison du rejet (optionnel)"
                      className="w-full mt-3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
