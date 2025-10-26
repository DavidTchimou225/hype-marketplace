'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  image: string | null;
}

export default function NewProductPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryIds: [] as string[],
    colors: [''],
    sizes: [''],
    stock: ''
  });
  const [files, setFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addArrayItem = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field as keyof typeof prev] as string[], '']
    }));
  };

  const updateArrayItem = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).map((item, i) => 
        i === index ? value : item
      )
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Nom du produit requis';
    if (!formData.description.trim()) newErrors.description = 'Description requise';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Prix valide requis';
    if (!formData.categoryIds || formData.categoryIds.length === 0) newErrors.categoryId = 'Au moins une catégorie requise';
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Stock valide requis';
    if (files.length === 0) newErrors.images = 'Au moins une image requise';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('description', formData.description);
      fd.append('price', String(parseFloat(formData.price)));
      fd.append('stock', String(parseInt(formData.stock)));
      // multiple categories
      for (const id of formData.categoryIds) fd.append('categoryIds', id);
      // Send colors/sizes as comma-separated for server convenience
      fd.append('colors', formData.colors.filter(c => c.trim()).join(','));
      fd.append('sizes', formData.sizes.filter(s => s.trim()).join(','));
      for (const f of files) fd.append('images', f);

      const response = await fetch('/api/boutique/products', { method: 'POST', body: fd });

      if (response.ok) {
        router.push('/boutique/dashboard');
      } else {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || 'Erreur lors de la création');
      }
    } catch (error: any) {
      console.error('Erreur lors de la création:', error);
      setErrors({ submit: error?.message || 'Erreur lors de la création du produit' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nouveau Produit</h1>
              <p className="text-gray-600">Ajoutez un nouveau produit à votre boutique</p>
            </div>
            <button
              onClick={() => router.push('/boutique/dashboard')}
              className="text-gray-500 hover:text-gray-700"
            >
              ← Retour au dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
          <div className="space-y-6">
            {/* Informations de base */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informations de base</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du produit *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Robe élégante en soie"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Décrivez votre produit en détail..."
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix (FCFA) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => updateFormData('price', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="15000"
                  />
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => updateFormData('stock', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.stock ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="10"
                  />
                  {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégories * (plusieurs possibles)
                  </label>
                  {categories.length === 0 ? (
                    <p className="text-gray-500 text-sm">Chargement des catégories...</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {categories.map((category) => (
                        <label
                          key={category.id}
                          className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                            formData.categoryIds.includes(category.id)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.categoryIds.includes(category.id)}
                            onChange={(e) => {
                              const newIds = e.target.checked
                                ? [...formData.categoryIds, category.id]
                                : formData.categoryIds.filter(id => id !== category.id);
                              updateFormData('categoryIds', newIds);
                            }}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-900">{category.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>}
                  {formData.categoryIds.length > 0 && (
                    <p className="text-blue-600 text-sm mt-2">
                      {formData.categoryIds.length} catégorie(s) sélectionnée(s)
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Images et Vidéos (upload local) */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">📸 Images et Vidéos du produit</h3>
              <input
                type="file"
                accept="image/*,video/*,.heic,.heif,.mov,.m4v"
                multiple
                onChange={(e) => {
                  const newFiles = Array.from(e.target.files || []);
                  const totalFiles = [...files, ...newFiles];
                  
                  if (totalFiles.length > 10) {
                    setErrors(prev => ({ ...prev, images: 'Maximum 10 fichiers autorisés' }));
                    setFiles(totalFiles.slice(0, 10));
                  } else {
                    setFiles(totalFiles);
                    if (errors.images) setErrors(prev => ({ ...prev, images: '' }));
                  }
                  
                  // Réinitialiser l'input pour permettre de resélectionner le même fichier
                  e.target.value = '';
                }}
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500 mt-2">
                Formats acceptés : Images (JPG, PNG, GIF, WEBP, HEIC) et Vidéos (MP4, MOV, M4V, AVI) • Maximum 10 fichiers
              </p>
              {files.length > 0 && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-700 text-sm font-medium">
                      {files.length}/10 fichier(s) sélectionné(s)
                    </p>
                    {files.length === 10 && (
                      <span className="text-xs text-orange-600 font-medium">⚠️ Limite atteinte</span>
                    )}
                  </div>
                  <ul className="space-y-2">
                    {Array.from(files).map((file, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        {file.type.startsWith('video/') ? '🎥' : '📷'}
                        <span className="flex-1">{file.name}</span>
                        <span className="text-xs text-gray-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newFiles = files.filter((_, i) => i !== idx);
                            setFiles(newFiles);
                            if (errors.images && newFiles.length > 0) {
                              setErrors(prev => ({ ...prev, images: '' }));
                            }
                          }}
                          className="text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {errors.images && <p className="text-red-500 text-sm mt-2">{errors.images}</p>}
            </div>

            {/* Couleurs */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Couleurs disponibles</h3>
              <div className="space-y-3">
                {formData.colors.map((color, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => updateArrayItem('colors', index, e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Rouge, Bleu, Noir"
                    />
                    {formData.colors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('colors', index)}
                        className="px-3 py-2 text-red-600 hover:text-red-800"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('colors')}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + Ajouter une couleur
                </button>
              </div>
            </div>

            {/* Tailles */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tailles disponibles</h3>
              <div className="space-y-3">
                {formData.sizes.map((size, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={size}
                      onChange={(e) => updateArrayItem('sizes', index, e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: S, M, L, XL"
                    />
                    {formData.sizes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('sizes', index)}
                        className="px-3 py-2 text-red-600 hover:text-red-800"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('sizes')}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + Ajouter une taille
                </button>
              </div>
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Boutons */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => router.push('/boutique/dashboard')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Création...' : 'Créer le produit'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
