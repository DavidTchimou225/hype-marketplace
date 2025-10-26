'use client';

import Link from 'next/link';
import { useState } from 'react';
import BottomNavigation from '@/components/BottomNavigation';

export default function VendeurPage() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [storeName, setStoreName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simuler l'envoi du formulaire
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black text-white px-4 py-3 flex justify-between items-center">
        <div className="text-sm font-medium">{new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white rounded-full"></div>
          <div className="w-4 h-4 bg-white rounded-full"></div>
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </div>
      </header>

      {/* Top Navigation */}
      <div className="bg-white px-4 py-3 flex justify-between items-center border-b">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <span className="text-xl">←</span>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Devenir Vendeur Hype</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-3xl p-8 mb-8">
            <h1 className="text-4xl font-bold mb-4">🚀 Rejoignez Hype Market</h1>
            <p className="text-xl text-purple-100">La marketplace #1 de la mode africaine en Côte d'Ivoire</p>
          </div>
        </div>

        {/* Qu'est-ce que Hype */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">🎯 Qu'est-ce que Hype Market ?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Hype Market est la première marketplace dédiée à la mode africaine en Côte d'Ivoire. 
                Nous connectons les créateurs, artisans et boutiques avec des milliers de clients passionnés 
                par la mode traditionnelle et moderne africaine.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Notre plateforme offre une expérience d'achat unique avec des fonctionnalités innovantes 
                comme le live shopping, les recommandations personnalisées et un système de paiement sécurisé.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6">
              <div className="text-center">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="font-bold text-gray-900 mb-2">Nos chiffres</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Utilisateurs actifs</span>
                    <span className="font-bold">50,000+</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vendeurs partenaires</span>
                    <span className="font-bold">500+</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Commandes mensuelles</span>
                    <span className="font-bold">10,000+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Avantages */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">✨ Pourquoi vendre sur Hype Market ?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Avantage 1 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
              <div className="text-3xl mb-4">💰</div>
              <h3 className="font-bold text-gray-900 mb-2">Revenus attractifs</h3>
              <p className="text-gray-700 text-sm">
                Commission compétitive de seulement 8% sur chaque vente. 
                Paiements rapides sous 48h après livraison.
              </p>
            </div>

            {/* Avantage 2 */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
              <div className="text-3xl mb-4">📱</div>
              <h3 className="font-bold text-gray-900 mb-2">Live Shopping</h3>
              <p className="text-gray-700 text-sm">
                Vendez en direct avec notre système de live shopping. 
                Interagissez avec vos clients en temps réel.
              </p>
            </div>

            {/* Avantage 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="font-bold text-gray-900 mb-2">Audience ciblée</h3>
              <p className="text-gray-700 text-sm">
                Accédez à une communauté de 50,000+ passionnés 
                de mode africaine déjà engagés.
              </p>
            </div>

            {/* Avantage 4 */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
              <div className="text-3xl mb-4">📈</div>
              <h3 className="font-bold text-gray-900 mb-2">Outils marketing</h3>
              <p className="text-gray-700 text-sm">
                Analytics détaillées, promotions, codes promo 
                et mise en avant de vos produits.
              </p>
            </div>

            {/* Avantage 5 */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-100">
              <div className="text-3xl mb-4">🚚</div>
              <h3 className="font-bold text-gray-900 mb-2">Logistique simplifiée</h3>
              <p className="text-gray-700 text-sm">
                Gestion automatique des commandes, 
                étiquettes d'expédition et suivi des livraisons.
              </p>
            </div>

            {/* Avantage 6 */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
              <div className="text-3xl mb-4">🛡️</div>
              <h3 className="font-bold text-gray-900 mb-2">Support dédié</h3>
              <p className="text-gray-700 text-sm">
                Équipe support disponible 7j/7 pour vous accompagner 
                dans votre réussite sur la plateforme.
              </p>
            </div>
          </div>
        </div>

        {/* Processus d'inscription */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">🚀 Comment ça marche ?</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">1. Inscription</h3>
              <p className="text-gray-600 text-sm">Remplissez le formulaire ci-dessous avec vos informations</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">2. Validation</h3>
              <p className="text-gray-600 text-sm">Notre équipe valide votre profil sous 24h</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏪</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">3. Configuration</h3>
              <p className="text-gray-600 text-sm">Créez votre boutique et ajoutez vos premiers produits</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💸</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">4. Vente</h3>
              <p className="text-gray-600 text-sm">Commencez à vendre et générez vos premiers revenus</p>
            </div>
          </div>
        </div>

        {/* Formulaire d'inscription */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">📋 Rejoignez-nous dès maintenant</h2>
          
          {!submitted ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
              <div>
                <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de votre boutique *
                </label>
                <input
                  type="text"
                  id="storeName"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ex: Afrique Style"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email professionnel *
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="votre@email.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de téléphone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="+225 XX XX XX XX XX"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Démarrer mon aventure Hype 🚀
              </button>

              <p className="text-xs text-gray-500 text-center">
                En vous inscrivant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
              </p>
            </form>
          ) : (
            <div className="max-w-md mx-auto text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">✅</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Demande envoyée avec succès !</h3>
              <p className="text-gray-700 mb-6">
                Merci <strong>{storeName}</strong> ! Notre équipe va examiner votre demande et vous contacter sous 24h à l'adresse <strong>{email}</strong>.
              </p>
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-800">
                  💡 <strong>Prochaines étapes :</strong> Préparez vos photos de produits en haute qualité et réfléchissez à votre stratégie de prix.
                </p>
              </div>
              <Link 
                href="/"
                className="inline-block bg-gray-900 text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-colors"
              >
                Retour à l'accueil
              </Link>
            </div>
          )}
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl p-8 mt-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">❓ Questions fréquentes</h2>
          
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-bold text-gray-900 mb-2">Quels sont les frais pour vendre sur Hype Market ?</h3>
              <p className="text-gray-700">
                L'inscription est gratuite. Nous prélevons seulement 8% de commission sur chaque vente réalisée, 
                ce qui est très compétitif par rapport aux autres plateformes.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-bold text-gray-900 mb-2">Combien de temps prend la validation ?</h3>
              <p className="text-gray-700">
                Notre équipe examine chaque demande sous 24h. Vous recevrez un email de confirmation 
                avec les prochaines étapes pour configurer votre boutique.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-bold text-gray-900 mb-2">Puis-je vendre tous types de produits ?</h3>
              <p className="text-gray-700">
                Nous nous concentrons sur la mode africaine : vêtements traditionnels et modernes, 
                accessoires, bijoux, chaussures et cosmétiques. Tous les produits doivent respecter nos standards de qualité.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-2">Comment fonctionne le paiement ?</h3>
              <p className="text-gray-700">
                Vous êtes payé automatiquement 48h après la confirmation de livraison par le client. 
                Les paiements se font par virement bancaire ou Mobile Money.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
