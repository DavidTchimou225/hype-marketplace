'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function VerifyEmailPage() {
  const search = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const e = search.get('email') || '';
    setEmail(e);
  }, [search]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Vérification échouée');
      setMessage('✅ Email vérifié avec succès ! Redirection...');
      setTimeout(() => router.push('/login'), 1500);
    } catch (err: any) {
      setError(err.message || 'Code invalide ou expiré');
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    if (!email) {
      setError('Email requis');
      return;
    }
    setResending(true);
    setMessage('');
    setError('');
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'REGISTER' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors du renvoi');
      
      // Afficher le code en développement
      if (data.debug?.otpCode) {
        setMessage(`📧 Code renvoyé ! 🔑 CODE (dev): ${data.debug.otpCode}`);
      } else {
        setMessage('📧 Un nouveau code a été envoyé à votre email');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors du renvoi');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo et branding */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-slate-700 font-bold text-lg">HYPE</span>
          </div>
          <h1 className="text-white text-2xl font-bold mb-2">Vérification Email</h1>
          <p className="text-slate-300 text-sm">Entrez le code reçu par email</p>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Code OTP (6 chiffres)</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="000000"
                maxLength={6}
                required
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-gray-50 text-center text-2xl font-bold tracking-widest"
              />
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Vérification...' : 'Vérifier mon email'}
            </button>
          </form>

          {/* Bouton de renvoi */}
          <div className="mt-4 text-center">
            <button
              onClick={resendOTP}
              disabled={resending}
              className="text-sm text-slate-600 hover:text-slate-800 underline disabled:text-gray-400"
            >
              {resending ? 'Envoi en cours...' : 'Renvoyer le code'}
            </button>
          </div>

          {/* Messages */}
          {message && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">{message}</p>
            </div>
          )}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
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
