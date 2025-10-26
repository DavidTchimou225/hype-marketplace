'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Banner {
  id: string;
  title: string;
  description: string | null;
  image: string;
  link: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminBannersPage() {
  const router = useRouter();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    link: '',
    order: 0,
    isActive: true
  });

  useEffect(() => {
    fetchBanners();
    // Log pour déboguer l'authentification
    console.log('🔐 Page bannières chargée - Vérification auth...');
    console.log('Cookies:', document.cookie);
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/admin/banners');
      
      if (response.status === 401 || response.status === 403) {
        router.push('/admin/login');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setBanners(data.banners);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des bannières:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.log('Aucun fichier sélectionné');
      return;
    }

    console.log('📤 Upload fichier:', {
      nom: file.name,
      type: file.type,
      taille: `${(file.size / 1024 / 1024).toFixed(2)} MB`
    });

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      console.log('🚀 Envoi vers /api/upload/banners...');
      const response = await fetch('/api/upload/banners', {
        method: 'POST',
        body: uploadFormData,
        credentials: 'include'
      });
      
      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      console.log('📥 Response body:', responseText);

      if (response.ok) {
        const data = JSON.parse(responseText);
        console.log('✅ Upload réussi:', data);
        setFormData((prev) => ({ ...prev, image: data.path || data.url }));
        alert(`✓ Image uploadée avec succès !\nChemin: ${data.path || data.url}`);
      } else {
        console.error('❌ Erreur upload:', response.status, responseText);
        let errorMsg = 'Erreur lors de l\'upload';
        try {
          const errorData = JSON.parse(responseText);
          errorMsg = errorData.error || errorMsg;
        } catch (e) {
          errorMsg = responseText || errorMsg;
        }
        alert(`❌ ${errorMsg}`);
      }
    } catch (error: any) {
      console.error('❌ Exception lors de l\'upload:', error);
      alert(`❌ Erreur lors de l'upload: ${error.message || 'Erreur réseau'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('🎯 handleSubmit - formData:', JSON.stringify(formData, null, 2));

    // Validation côté client
    if (!formData.title) {
      alert('❌ Le titre est obligatoire');
      return;
    }
    
    if (!formData.image) {
      alert('❌ L\'image est obligatoire. Veuillez d\'abord uploader une image.');
      return;
    }

    const activeBannersCount = banners.filter((b) => b.isActive).length;
    if (formData.isActive && activeBannersCount >= 5 && !editingBanner) {
      alert('❌ Vous ne pouvez pas avoir plus de 5 bannières actives');
      return;
    }

    try {
      const url = editingBanner
        ? `/api/admin/banners/${editingBanner.id}`
        : '/api/admin/banners';

      const method = editingBanner ? 'PATCH' : 'POST';

      console.log('🚀 Envoi requête:', {
        method,
        url,
        data: formData
      });

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      console.log('📥 Response status:', response.status);
      
      const responseText = await response.text();
      console.log('📥 Response body:', responseText);

      if (response.ok) {
        console.log('✅ Bannière enregistrée avec succès');
        await fetchBanners();
        resetForm();
        alert(editingBanner ? '✓ Bannière modifiée avec succès' : '✓ Bannière créée avec succès');
      } else {
        console.error('❌ Erreur API:', response.status, responseText);
        let errorMsg = 'Erreur lors de l\'enregistrement';
        try {
          const data = JSON.parse(responseText);
          errorMsg = data.error || errorMsg;
        } catch (e) {
          errorMsg = responseText || errorMsg;
        }
        alert(`❌ ${errorMsg}`);
      }
    } catch (error: any) {
      console.error('❌ Exception lors de l\'enregistrement:', error);
      alert(`❌ Erreur lors de l'enregistrement: ${error.message || 'Erreur inconnue'}`);
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description || '',
      image: banner.image,
      link: banner.link || '',
      order: banner.order,
      isActive: banner.isActive
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette bannière ?')) return;

    try {
      const response = await fetch(`/api/admin/banners/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchBanners();
        alert('Bannière supprimée avec succès');
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression de la bannière');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      link: '',
      order: 0,
      isActive: true
    });
    setEditingBanner(null);
    setShowForm(false);
  };

  const activeBannersCount = banners.filter((b) => b.isActive).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Gestion du Carrousel</h1>
                <p className="text-sm text-gray-500">
                  {activeBannersCount}/5 bannières actives
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              {showForm ? 'Annuler' : '+ Nouvelle Bannière'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingBanner ? 'Modifier la bannière' : 'Nouvelle bannière'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Titre *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lien (optionnel)
                  </label>
                  <input
                    type="text"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="/category/promo"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optionnelle)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image * (1200x400 recommandé)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-purple-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full"
                    disabled={uploading}
                    id="banner-image"
                  />
                  {uploading && (
                    <div className="mt-2 flex items-center gap-2 text-purple-600">
                      <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-sm">Upload en cours...</p>
                    </div>
                  )}
                  {formData.image && !uploading && (
                    <div className="mt-2">
                      <p className="text-sm text-green-600 mb-2">✓ Image uploadée avec succès</p>
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="h-32 rounded-lg object-cover border-2 border-green-200"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ordre d'affichage
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="0"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer mt-7">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Bannière active</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={!formData.image || uploading || !formData.title}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Upload en cours...' : (editingBanner ? 'Mettre à jour' : 'Créer')}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Banners List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des bannières...</p>
            </div>
          ) : banners.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">🖼️</div>
              <p className="text-gray-600">Aucune bannière configurée</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {banners.map((banner) => (
                <div key={banner.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="w-32 h-20 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {banner.title}
                          </h3>
                          {banner.description && (
                            <p className="text-sm text-gray-600">{banner.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              banner.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {banner.isActive ? '✓ Active' : '○ Inactive'}
                          </span>
                          <span className="text-xs text-gray-500">Ordre: {banner.order}</span>
                        </div>
                      </div>

                      {banner.link && (
                        <p className="text-sm text-gray-500 mb-2">
                          🔗 {banner.link}
                        </p>
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(banner)}
                          className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(banner.id)}
                          className="text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <div className="text-blue-600 text-xl">ℹ️</div>
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">Bonnes pratiques :</p>
              <ul className="list-disc list-inside space-y-1 text-blue-800">
                <li>Maximum 5 bannières actives en simultané</li>
                <li>Dimensions recommandées : 1200x400 pixels</li>
                <li>Format : JPG ou PNG optimisé (max 500KB)</li>
                <li>Les bannières défilent automatiquement toutes les 5 secondes</li>
                <li>Le swipe tactile est activé sur mobile</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
