'use client';

import Link from 'next/link';
import Footer from '@/components/Footer';
import BottomNavigation from '@/components/BottomNavigation';

export default function HelpPage() {
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

      <div className="flex-1 pb-20">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-center mb-8">Centre d'aide</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* FAQ Clients */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Questions Fréquentes - Clients</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Comment passer une commande ?</h3>
                  <p className="text-gray-600 text-sm">Parcourez nos produits, ajoutez-les au panier et suivez le processus de commande.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Quels sont les modes de paiement ?</h3>
                  <p className="text-gray-600 text-sm">Nous acceptons Mobile Money, Orange Money et les cartes bancaires.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Délais de livraison ?</h3>
                  <p className="text-gray-600 text-sm">2-5 jours ouvrables à Abidjan, 5-7 jours en province.</p>
                </div>
              </div>
            </div>

            {/* FAQ Vendeurs */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Questions Fréquentes - Vendeurs</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Comment devenir vendeur ?</h3>
                  <p className="text-gray-600 text-sm">Remplissez notre formulaire KYC et attendez la validation de notre équipe.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Quelles sont les commissions ?</h3>
                  <p className="text-gray-600 text-sm">Nos commissions sont compétitives et transparentes. Contactez-nous pour plus de détails.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Comment gérer mes produits ?</h3>
                  <p className="text-gray-600 text-sm">Utilisez votre dashboard vendeur pour ajouter, modifier et gérer vos produits.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-lg p-8 shadow-sm mt-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Besoin d'aide supplémentaire ?</h2>
            <p className="text-gray-600 mb-6">Notre équipe est là pour vous aider</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                Nous contacter
              </Link>
              <a href="mailto:support@hypemarket.ci" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50">
                support@hypemarket.ci
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <BottomNavigation />
    </div>
  );
}
