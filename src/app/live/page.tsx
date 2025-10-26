'use client';

import Link from 'next/link';

export default function LivePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white px-4 py-3 flex items-center border-b">
        <Link href="/" className="mr-4">
          <span className="text-xl">←</span>
        </Link>
        <h1 className="text-lg font-semibold">Live Shopping</h1>
      </header>

      {/* Content */}
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm max-w-sm w-full">
          {/* Animation icon */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="relative">
              <span className="text-3xl">📺</span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Live Shopping
          </h2>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            Patientez, cette fonctionnalité sera bientôt disponible !
          </p>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-500 mb-2">
              🔜 Prochainement :
            </p>
            <ul className="text-sm text-gray-600 space-y-1 text-left">
              <li>• Shopping en direct avec les boutiques</li>
              <li>• Interactions en temps réel</li>
              <li>• Offres exclusives live</li>
              <li>• Chat avec les vendeurs</li>
            </ul>
          </div>
          
          <Link 
            href="/"
            className="w-full bg-black text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-800 transition-colors inline-block"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 opacity-20">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  );
}
