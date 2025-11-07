'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AddressMapPicker from '@/components/AddressMapPicker';

interface KYCFormData {
  // Informations essentielles
  ownerFullName: string;  // Nom complet du créateur
  email: string;          // Une seule adresse email
  phone: string;          // Un seul numéro
  address: string;        // Adresse
  latitude?: number;      // Latitude GPS
  longitude?: number;     // Longitude GPS
  storeName: string;      // Nom de la boutique
  logo: string | null;    // Logo de la boutique
  mobileMoneyProvider: 'orange' | 'mtn' | 'wave' | 'moov'; // Mobile Money privilégié
  
  // Type d'articles vendus
  productCategories: string[];
  
  // Authentification boutique
  password?: string;
  confirmPassword?: string;
  
  // Vérification et CGU
  otp?: string;
  acceptedTerms: boolean;
}

const PRODUCT_CATEGORIES = [
  { id: 'mode', label: 'Mode & Vêtements', icon: '👗' },
  { id: 'beaute', label: 'Beauté & Cosmétiques', icon: '💄' },
  { id: 'bijoux', label: 'Bijoux & Accessoires', icon: '💍' }
];

const MOBILE_MONEY_PROVIDERS = [
  { 
    id: 'orange', 
    label: 'Orange Money',
    logo: '/mobile-money/orange.png'
  },
  { 
    id: 'mtn', 
    label: 'MTN Money',
    logo: '/mobile-money/mtn.png'
  },
  { 
    id: 'wave', 
    label: 'Wave',
    logo: '/mobile-money/wave.png'
  },
  { 
    id: 'moov', 
    label: 'Moov Money',
    logo: '/mobile-money/moov.png'
  }
];

export default function BoutiqueInscriptionPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<KYCFormData>({
    ownerFullName: '',
    email: '',
    phone: '',
    address: '',
    storeName: '',
    logo: null,
    mobileMoneyProvider: 'orange',
    productCategories: [],
    password: '',
    confirmPassword: '',
    otp: '',
    acceptedTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const updateFormData = (field: keyof KYCFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleCategory = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      productCategories: prev.productCategories.includes(categoryId)
        ? prev.productCategories.filter(id => id !== categoryId)
        : [...prev.productCategories, categoryId]
    }));
  };

  const sendOTP = async () => {
    if (!formData.email || !formData.phone) {
      setErrors({ otp: 'Email et téléphone requis pour envoyer l\'OTP' });
      return;
    }

    setOtpLoading(true);
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
          type: 'boutique'
        })
      });

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true);
        
        // En développement, afficher le code OTP
        if (data.debug?.code) {
          alert(`OTP envoyé !\n\n🔑 CODE OTP (dev): ${data.debug.code}`);
        } else {
          alert('Code OTP envoyé par SMS et Email');
        }
      } else {
        throw new Error(data.error || 'Erreur lors de l\'envoi de l\'OTP');
      }
    } catch (error) {
      setErrors({ otp: 'Erreur lors de l\'envoi de l\'OTP' });
    } finally {
      setOtpLoading(false);
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.ownerFullName) newErrors.ownerFullName = 'Nom complet requis';
        if (!formData.email) newErrors.email = 'Email requis';
        if (!formData.phone) newErrors.phone = 'Téléphone requis';
        if (!formData.address) newErrors.address = 'Adresse requise';
        if (!formData.storeName) newErrors.storeName = 'Nom de boutique requis';
        break;
      case 2:
        if (formData.productCategories.length === 0) {
          newErrors.productCategories = 'Sélectionnez au moins une catégorie';
        }
        break;
      case 3:
        if (!formData?.password || (formData.password || '').length < 6) {
          newErrors.password = 'Mot de passe requis (min. 6 caractères)';
        }
        if ((formData.password || '') !== (formData.confirmPassword || '')) {
          newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
        }
        if (!otpSent || !formData.otp || formData.otp.length !== 6) {
          newErrors.otp = 'Code OTP à 6 chiffres requis';
        }
        if (!formData.acceptedTerms) {
          newErrors.acceptedTerms = 'Vous devez accepter les conditions d\'utilisation';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    console.log('🚀 Début de la soumission du formulaire');
    
    if (!validateStep(currentStep)) {
      console.log('❌ Validation échouée');
      return;
    }

    setLoading(true);
    setErrors({});
    
    try {
      console.log('📤 Envoi des données à l\'API...');
      const payload = {
        ...formData,
        productCategories: formData.productCategories
      };
      
      console.log('📦 Payload:', payload);
      
      const response = await fetch('/api/boutique/inscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log('📥 Réponse reçue:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Boutique créée avec succès:', result);
        
        // Sauvegarder les infos de la boutique
        try {
          if (result?.store) {
            localStorage.setItem('store', JSON.stringify(result.store));
          }
        } catch (e) {
          console.warn('Impossible de sauvegarder dans localStorage:', e);
        }
        
        // Afficher un message de succès
        alert(`✅ Boutique "${result.store?.name}" créée avec succès !\n\nVous allez être redirigé vers votre dashboard.`);
        
        // Redirection vers le dashboard
        console.log('🔄 Redirection vers le dashboard...');
        router.push('/boutique/dashboard');
      } else {
        const err = await response.json().catch(() => ({ error: 'Erreur inconnue' }));
        console.error('❌ Erreur API:', err);
        throw new Error(err?.error || 'Erreur lors de la création de la boutique');
      }
    } catch (error) {
      console.error('💥 Erreur lors de la soumission:', error);
      const errorMessage = (error as Error)?.message || 'Erreur lors de la soumission. Veuillez réessayer.';
      setErrors({ submit: errorMessage });
      alert(`❌ Erreur: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Créer ma Boutique</h1>
              <p className="text-gray-600">Inscription simple et rapide en 3 étapes</p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="text-gray-500 hover:text-gray-700"
            >
              ← Retour à l'accueil
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Step 1: Informations Essentielles */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Informations Essentielles</h2>
                <p className="text-gray-600 mt-2">Renseignez les informations de base de votre boutique</p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet du créateur *</label>
                  <input
                    type="text"
                    value={formData.ownerFullName}
                    onChange={(e) => updateFormData('ownerFullName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.ownerFullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Kouao Kouassi Aristide"
                  />
                  {errors.ownerFullName && <p className="text-red-500 text-sm mt-1">{errors.ownerFullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adresse email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="votre@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de téléphone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+225 07 XX XX XX XX"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adresse *</label>
                  <AddressMapPicker
                    initialAddress={formData.address}
                    onAddressSelect={(address, lat, lng) => {
                      updateFormData('address', address);
                      updateFormData('latitude', lat);
                      updateFormData('longitude', lng);
                    }}
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la boutique *</label>
                  <input
                    type="text"
                    value={formData.storeName}
                    onChange={(e) => updateFormData('storeName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.storeName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Style Abidjan"
                  />
                  {errors.storeName && <p className="text-red-500 text-sm mt-1">{errors.storeName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo de la boutique (optionnel)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          updateFormData('logo', reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {formData.logo && (
                    <div className="mt-2">
                      <img src={formData.logo} alt="Logo" className="w-20 h-20 object-cover rounded-lg" />
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG - Taille max: 2MB</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Money privilégié pour les paiements *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {MOBILE_MONEY_PROVIDERS.map((provider) => (
                      <div
                        key={provider.id}
                        onClick={() => updateFormData('mobileMoneyProvider', provider.id)}
                        className={`relative p-4 rounded-xl cursor-pointer transition-all hover:scale-105 border-2 ${
                          formData.mobileMoneyProvider === provider.id
                            ? 'border-blue-500 bg-blue-50 ring-4 ring-blue-200'
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center p-6">
                          <div className="w-full h-24 flex items-center justify-center mb-2">
                            <img
                              src={provider.logo}
                              alt={provider.label}
                              className="max-w-full max-h-full object-contain"
                              style={{ maxWidth: '140px', maxHeight: '80px' }}
                            />
                          </div>
                          {formData.mobileMoneyProvider === provider.id && (
                            <div className="absolute top-3 right-3">
                              <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Types d'Articles Vendus */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Types d'Articles Vendus</h2>
                <p className="text-gray-600 mt-2">Sélectionnez les catégories de produits que vous vendez</p>
              </div>

              {errors.productCategories && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-600 text-sm">{errors.productCategories}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {PRODUCT_CATEGORIES.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => toggleCategory(category.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      formData.productCategories.includes(category.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{category.icon}</span>
                      <div>
                        <h3 className="font-medium text-gray-900">{category.label}</h3>
                      </div>
                      {formData.productCategories.includes(category.id) && (
                        <div className="ml-auto">
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <h4 className="font-medium text-blue-900 mb-2">Catégories sélectionnées:</h4>
                {formData.productCategories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.productCategories.map((categoryId: string) => {
                      const category = PRODUCT_CATEGORIES.find(cat => cat.id === categoryId);
                      return (
                        <span key={categoryId} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {category?.icon} {category?.label}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-blue-600 text-sm">Aucune catégorie sélectionnée</p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Finalisation */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Finalisation de votre inscription</h2>
                <p className="text-gray-600 mt-2">Vérification et sécurité de votre compte</p>
              </div>

              <div className="space-y-6">
                {/* Vérification OTP */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-4">🔐 Vérification de votre identité</h3>
                  <p className="text-sm text-blue-700 mb-4">
                    Pour sécuriser votre compte, nous allons vous envoyer un code de vérification par SMS et Email.
                  </p>
                  
                  {!otpSent ? (
                    <button
                      type="button"
                      onClick={sendOTP}
                      disabled={otpLoading || !formData.email || !formData.phone}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {otpLoading ? '📤 Envoi en cours...' : '📨 Envoyer le code OTP'}
                    </button>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-blue-900 mb-2">
                        Code OTP (6 chiffres) *
                      </label>
                      <input
                        type="text"
                        value={formData.otp || ''}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                          updateFormData('otp', value);
                        }}
                        className={`w-full px-4 py-3 border rounded-lg text-center text-2xl font-bold tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.otp ? 'border-red-500' : 'border-blue-300'
                        }`}
                        placeholder="_ _ _ _ _ _"
                        maxLength={6}
                      />
                      {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
                      
                      <div className="mt-3 text-sm text-blue-700">
                        <p>📧 Le code a été envoyé à votre adresse email</p>
                        <p className="text-xs text-blue-600 mt-1">Vérifiez votre boîte de réception (et vos spams)</p>
                      </div>
                      
                      <button
                        type="button"
                        onClick={sendOTP}
                        disabled={otpLoading}
                        className="text-sm text-blue-600 hover:text-blue-800 mt-2 underline"
                      >
                        Renvoyer le code
                      </button>
                    </div>
                  )}
                </div>

                {/* Mot de passe de la boutique */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe *</label>
                    <input
                      type="password"
                      value={formData.password || ''}
                      onChange={(e) => updateFormData('password', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="••••••••"
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe *</label>
                    <input
                      type="password"
                      value={formData.confirmPassword || ''}
                      onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="••••••••"
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>

                {/* Acceptation des CGU */}
                <div className={`border-2 rounded-lg p-4 ${errors.acceptedTerms ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}>
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      checked={formData.acceptedTerms}
                      onChange={(e) => updateFormData('acceptedTerms', e.target.checked)}
                      className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <label htmlFor="acceptTerms" className="text-sm text-gray-700 flex-1">
                      J'ai lu et j'accepte les{' '}
                      <Link 
                        href="/terms" 
                        target="_blank"
                        className="text-blue-600 font-semibold underline hover:text-blue-800"
                      >
                        Conditions Générales d'Utilisation
                      </Link>
                      {' '}de Hype Marketplace *
                    </label>
                  </div>
                  {errors.acceptedTerms && <p className="text-red-500 text-sm mt-2 ml-8">{errors.acceptedTerms}</p>}
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">📋 Résumé de votre inscription</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Créateur:</span>
                      <span className="font-medium">{formData.ownerFullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{formData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Téléphone:</span>
                      <span className="font-medium">{formData.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Adresse:</span>
                      <span className="font-medium text-right">{formData.address}</span>
                    </div>
                    {formData.latitude && formData.longitude && (
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">GPS:</span>
                        <span className="text-gray-500">{formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nom de la boutique:</span>
                      <span className="font-medium">{formData.storeName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mobile Money:</span>
                      <span className="font-medium">
                        {MOBILE_MONEY_PROVIDERS.find(p => p.id === formData.mobileMoneyProvider)?.label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Catégories:</span>
                      <span className="font-medium">{formData.productCategories.length} sélectionnée(s)</span>
                    </div>
                  </div>
                </div>

                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-medium text-red-900 mb-2">❌ Erreur</h4>
                    <p className="text-sm text-red-700">{errors.submit}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>

            {currentStep < 3 ? (
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Suivant
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Envoi en cours...' : 'Créer ma Boutique'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
