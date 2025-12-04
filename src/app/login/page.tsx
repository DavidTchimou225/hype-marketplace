'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData.emailOrPhone, formData.password);
      
      if (result.success) {
        router.push('/');
      } else if (result.needsVerification && result.email) {
        // Compte non vérifié, rediriger vers la vérification
        alert(result.error || 'Votre compte n\'est pas vérifié. Vous allez être redirigé vers la page de vérification.');
        const email = encodeURIComponent(result.email);
        router.push(`/verify-email?email=${email}`);
      } else {
        alert(result.error || 'Email/téléphone ou mot de passe incorrect');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      alert('Erreur lors de la connexion. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-700 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo et branding */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-slate-700 font-bold text-lg">HYPE</span>
          </div>
          <h1 className="text-white text-2xl font-bold mb-2">Hype</h1>
          <p className="text-slate-300 text-sm">Mode Ivoirienne en Live</p>
        </div>

        {/* Formulaire de connexion */}
        <div className="bg-white rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-center mb-6">Connexion</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email ou Téléphone
              </label>
              <input
                type="text"
                name="emailOrPhone"
                value={formData.emailOrPhone}
                onChange={handleInputChange}
                placeholder="votre@email.com ou +225 XX XX XX XX"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-gray-50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-gray-50 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 mt-6"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          {/* Mot de passe oublié */}
          <div className="text-center mt-4">
            <Link href="/forgot-password" className="text-sm text-gray-500 hover:text-gray-700">
              Mot de passe oublié ?
            </Link>
          </div>

          {/* Connexion boutique */}
          <div className="text-center mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-700 text-sm font-medium mb-2">
              Vous êtes une boutique ?
            </p>
            <Link href="/boutique/login" className="text-blue-600 font-semibold hover:underline">
              Connexion Boutique
            </Link>
          </div>

          {/* Lien d'inscription */}
          <div className="text-center mt-4">
            <p className="text-gray-600 text-sm">
              Pas encore de compte ?
            </p>
            <Link href="/register" className="text-black font-semibold hover:underline">
              Créer un compte
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-slate-400 text-xs">
            © 2025 Hype. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
}
