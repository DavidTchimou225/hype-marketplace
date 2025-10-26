'use client';

import Link from 'next/link';
import BottomNavigation from '@/components/BottomNavigation';

export default function AboutPage() {
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
          <h1 className="text-4xl font-bold text-center mb-8">À propos de Hype Market</h1>
          
          <div className="prose prose-lg mx-auto">
            <p className="text-xl text-gray-600 text-center mb-12">
              La marketplace de référence pour la mode africaine et les produits artisanaux de Côte d'Ivoire.
            </p>

            <div className="bg-white rounded-lg p-8 shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">Notre Mission</h2>
              <p className="text-gray-600">
                Hype Market a pour mission de promouvoir et valoriser la richesse culturelle ivoirienne à travers 
                une plateforme moderne qui connecte les artisans, créateurs et boutiques locales avec une clientèle 
                passionnée par l'authenticité et la qualité.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">Notre Vision</h2>
              <p className="text-gray-600">
                Devenir la référence incontournable du e-commerce en Côte d'Ivoire, en offrant une expérience 
                d'achat unique qui célèbre la créativité locale tout en respectant les standards internationaux 
                de qualité et de service.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-3">🎯 Notre Engagement</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Soutenir les entrepreneurs locaux</li>
                  <li>• Garantir la qualité des produits</li>
                  <li>• Offrir une expérience client exceptionnelle</li>
                  <li>• Promouvoir la culture ivoirienne</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-3">🌟 Nos Valeurs</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Authenticité et transparence</li>
                  <li>• Innovation et modernité</li>
                  <li>• Respect et inclusivité</li>
                  <li>• Excellence et qualité</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
