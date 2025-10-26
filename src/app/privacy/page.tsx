'use client';

import Link from 'next/link';
import Footer from '@/components/Footer';
import BottomNavigation from '@/components/BottomNavigation';

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-bold text-center mb-8">Politique de confidentialité</h1>
          
          <div className="bg-white rounded-lg p-8 shadow-sm prose prose-lg max-w-none">
            <h2>1. Collecte des données</h2>
            <p>Nous collectons les informations que vous nous fournissez lors de l'inscription, des commandes et de l'utilisation de nos services.</p>

            <h2>2. Utilisation des données</h2>
            <p>Vos données sont utilisées pour :</p>
            <ul>
              <li>Traiter vos commandes</li>
              <li>Améliorer nos services</li>
              <li>Vous envoyer des communications pertinentes</li>
              <li>Assurer la sécurité de la plateforme</li>
            </ul>

            <h2>3. Partage des données</h2>
            <p>Nous ne vendons pas vos données personnelles. Nous pouvons les partager avec :</p>
            <ul>
              <li>Les vendeurs pour le traitement des commandes</li>
              <li>Nos partenaires de paiement et de livraison</li>
              <li>Les autorités légales si requis par la loi</li>
            </ul>

            <h2>4. Sécurité des données</h2>
            <p>Nous mettons en place des mesures techniques et organisationnelles pour protéger vos données contre tout accès non autorisé.</p>

            <h2>5. Cookies</h2>
            <p>Nous utilisons des cookies pour améliorer votre expérience utilisateur et analyser l'utilisation de notre site.</p>

            <h2>6. Vos droits</h2>
            <p>Vous avez le droit de :</p>
            <ul>
              <li>Accéder à vos données personnelles</li>
              <li>Rectifier vos données</li>
              <li>Supprimer vos données</li>
              <li>Vous opposer au traitement</li>
            </ul>

            <h2>7. Conservation des données</h2>
            <p>Nous conservons vos données aussi longtemps que nécessaire pour fournir nos services et respecter nos obligations légales.</p>

            <h2>8. Contact</h2>
            <p>Pour toute question concernant cette politique, contactez-nous à privacy@hypemarket.ci</p>

            <p className="text-sm text-gray-500 mt-8">
              Dernière mise à jour : Janvier 2025
            </p>
          </div>
        </div>
      </div>

      <Footer />
      <BottomNavigation />
    </div>
  );
}
