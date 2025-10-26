'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminSettingsPage() {
  const [headerMessage, setHeaderMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        const messageSetting = data.settings?.find((s: any) => s.key === 'header_message');
        setHeaderMessage(messageSetting?.value || '');
      }
    } catch (error) {
      console.error('Erreur fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'header_message',
          value: headerMessage
        })
      });

      if (response.ok) {
        alert('✅ Message enregistré avec succès !');
      } else {
        alert('❌ Erreur lors de l\'enregistrement');
      }
    } catch (error) {
      console.error('Erreur save:', error);
      alert('❌ Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
              <p className="text-sm text-gray-500 mt-1">
                Gérez les messages et paramètres globaux
              </p>
            </div>
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              ← Retour Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Message Header */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">💬</span>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Message d'en-tête</h2>
                  <p className="text-sm text-gray-500">
                    Ce message s'affiche dans le header noir de la page d'accueil
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message actuel
                  </label>
                  <textarea
                    value={headerMessage}
                    onChange={(e) => setHeaderMessage(e.target.value)}
                    placeholder="Ex: 🎉 Livraison gratuite ce week-end !"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    maxLength={100}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {headerMessage.length}/100 caractères
                  </p>
                </div>

                {/* Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aperçu
                  </label>
                  <div className="bg-black text-white px-4 py-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">
                        {headerMessage || '(Aucun message)'}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {saving ? 'Enregistrement...' : '💾 Enregistrer le message'}
                </button>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                💡 Conseils d'utilisation
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Utilisez des emojis pour attirer l'attention (🎉 🔥 ⭐ 💝)</li>
                <li>• Restez concis: max 100 caractères</li>
                <li>• Mettez en avant les promotions et événements</li>
                <li>• Changez régulièrement pour garder l'intérêt</li>
              </ul>
            </div>

            {/* Examples */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">📝 Exemples de messages</h3>
              <div className="space-y-2">
                {[
                  '🎉 Livraison gratuite ce week-end !',
                  '🔥 -30% sur toute la collection été',
                  '⭐ Nouveautés disponibles maintenant',
                  '💝 Fête des Mères: Offres spéciales',
                  '🚀 Flash Sale: 2h seulement !',
                ].map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setHeaderMessage(example)}
                    className="block w-full text-left px-4 py-2 bg-white hover:bg-gray-100 rounded-lg text-sm transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
