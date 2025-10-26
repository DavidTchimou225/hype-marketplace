'use client';

import Link from 'next/link';
import Footer from '@/components/Footer';

export default function DevenirVendeurPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Hype Market
            </Link>
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Devenez Vendeur sur Hype Market
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            Rejoignez la plus grande marketplace de mode africaine en Côte d'Ivoire
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/boutique/inscription"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Créer ma Boutique
            </Link>
            <Link
              href="/boutique/login"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Connecter ma Boutique
            </Link>
          </div>
        </div>
      </div>

      {/* Avantages */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Pourquoi vendre sur Hype Market ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Audience Ciblée</h3>
              <p className="text-gray-600">
                Accédez à des milliers de clients passionnés par la mode africaine et les produits artisanaux.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Commissions Faibles</h3>
              <p className="text-gray-600">
                Gardez plus de vos profits avec nos commissions compétitives et transparentes.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Outils Modernes</h3>
              <p className="text-gray-600">
                Dashboard complet, gestion des stocks, analytics et outils de marketing intégrés.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Catégories acceptées */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Catégories Acceptées
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl text-center">
              <div className="text-4xl mb-4">👗</div>
              <h3 className="text-xl font-semibold mb-2">Mode & Vêtements</h3>
              <p className="text-gray-600">Robes, chemises, pantalons, tenues traditionnelles</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl text-center">
              <div className="text-4xl mb-4">💄</div>
              <h3 className="text-xl font-semibold mb-2">Beauté & Cosmétiques</h3>
              <p className="text-gray-600">Maquillage, soins, parfums, produits naturels</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl text-center">
              <div className="text-4xl mb-4">💍</div>
              <h3 className="text-xl font-semibold mb-2">Bijoux & Accessoires</h3>
              <p className="text-gray-600">Colliers, bracelets, sacs, montres</p>
            </div>
          </div>
        </div>
      </div>

      {/* Processus d'inscription */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Comment ça marche ?
          </h2>
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Inscription KYC</h3>
                <p className="text-gray-600">
                  Remplissez notre formulaire d'inscription avec vos informations personnelles et celles de votre boutique.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Validation Admin</h3>
                <p className="text-gray-600">
                  Notre équipe examine votre demande sous 24-48h et vous notifie par email.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Commencez à Vendre</h3>
                <p className="text-gray-600">
                  Une fois approuvé, accédez à votre dashboard et commencez à ajouter vos produits !
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Prêt à rejoindre Hype Market ?
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Démarrez votre aventure entrepreneuriale dès aujourd'hui
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/boutique/inscription"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Créer ma Boutique
            </Link>
            <Link
              href="/boutique/login"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
            >
              J'ai déjà une Boutique
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
