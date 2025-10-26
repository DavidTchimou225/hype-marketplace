'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SystemHealth {
  timestamp: string;
  status: 'healthy' | 'warning' | 'critical';
  checks: {
    dataIntegrity: any;
    performance: any;
    security: any;
  };
}

interface ConsistencyCheck {
  orphanedProducts: number;
  orphanedOrders: number;
  negativeValues: number;
  emptyStores: number;
  fixedIssues?: number;
}

export default function SystemPage() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [consistency, setConsistency] = useState<ConsistencyCheck | null>(null);
  const [performance, setPerformance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fixing, setFixing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadSystemData();
  }, []);

  const loadSystemData = async () => {
    try {
      setLoading(true);
      
      const [healthRes, consistencyRes, performanceRes] = await Promise.all([
        fetch('/api/admin/validation'),
        fetch('/api/admin/data/consistency'),
        fetch('/api/admin/performance')
      ]);

      if (healthRes.ok) {
        setHealth(await healthRes.json());
      }
      if (consistencyRes.ok) {
        setConsistency(await consistencyRes.json());
      }
      if (performanceRes.ok) {
        setPerformance(await performanceRes.json());
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const fixDataInconsistencies = async () => {
    try {
      setFixing(true);
      const response = await fetch('/api/admin/data/consistency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoFix: true })
      });

      if (response.ok) {
        const result = await response.json();
        setConsistency(prev => prev ? { ...prev, fixedIssues: result.fixedIssues } : null);
        await loadSystemData();
      }
    } catch (error) {
      console.error('Erreur lors de la correction:', error);
    } finally {
      setFixing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'ok':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Analyse du système...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Système & Performance</h1>
              <p className="text-gray-600">Surveillance et optimisation de la plateforme</p>
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
        {/* État général du système */}
        {health && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">État général du système</h2>
              <div className="flex items-center mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(health.status)}`}>
                  {health.status === 'healthy' ? 'Sain' : health.status === 'warning' ? 'Attention' : 'Critique'}
                </span>
                <span className="ml-3 text-gray-500 text-sm">
                  Dernière vérification: {new Date(health.timestamp).toLocaleString('fr-FR')}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Intégrité des données</h3>
                  <span className={`px-2 py-1 rounded text-sm ${getStatusColor(health.checks.dataIntegrity.status)}`}>
                    {health.checks.dataIntegrity.status === 'ok' ? 'OK' : 'Problèmes détectés'}
                  </span>
                  {health.checks.dataIntegrity.issues > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      {health.checks.dataIntegrity.issues} problème(s) détecté(s)
                    </p>
                  )}
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Performance</h3>
                  <span className={`px-2 py-1 rounded text-sm ${getStatusColor(health.checks.performance.status)}`}>
                    {health.checks.performance.responseTime}ms
                  </span>
                  <p className="text-sm text-gray-600 mt-1">Temps de réponse</p>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Sécurité</h3>
                  <span className={`px-2 py-1 rounded text-sm ${getStatusColor(health.checks.security.status)}`}>
                    {health.checks.security.adminCount} admin(s)
                  </span>
                  <p className="text-sm text-gray-600 mt-1">Comptes administrateur</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cohérence des données */}
        {consistency && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Cohérence des données</h2>
                <button
                  onClick={fixDataInconsistencies}
                  disabled={fixing}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {fixing ? 'Correction...' : 'Corriger automatiquement'}
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{consistency.orphanedProducts}</div>
                  <div className="text-sm text-gray-600">Produits orphelins</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{consistency.orphanedOrders}</div>
                  <div className="text-sm text-gray-600">Commandes orphelines</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{consistency.negativeValues}</div>
                  <div className="text-sm text-gray-600">Valeurs négatives</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{consistency.emptyStores}</div>
                  <div className="text-sm text-gray-600">Boutiques vides</div>
                </div>
              </div>

              {consistency.fixedIssues !== undefined && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                  <p className="text-green-800">
                    ✅ {consistency.fixedIssues} problème(s) corrigé(s) automatiquement
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Métriques de performance */}
        {performance && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Métriques de performance</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Résumé</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Opérations totales:</span>
                      <span className="font-medium">{performance.summary.totalOperations}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Temps de réponse moyen:</span>
                      <span className="font-medium">{Math.round(performance.summary.avgResponseTime)}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dernière mise à jour:</span>
                      <span className="font-medium">{new Date(performance.timestamp).toLocaleString('fr-FR')}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Actions recommandées</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-green-600">
                      <span className="mr-2">✅</span>
                      Cache en mémoire activé
                    </div>
                    <div className="flex items-center text-green-600">
                      <span className="mr-2">✅</span>
                      Optimisation des requêtes
                    </div>
                    <div className="flex items-center text-green-600">
                      <span className="mr-2">✅</span>
                      Monitoring des performances
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
