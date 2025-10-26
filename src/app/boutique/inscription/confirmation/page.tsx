'use client';

import { useRouter } from 'next/navigation';

export default function ConfirmationPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Demande envoyée !</h1>
          <p className="text-gray-600">
            Votre demande d'inscription boutique a été soumise avec succès.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-blue-900 mb-2">Prochaines étapes</h3>
          <ul className="text-sm text-blue-800 space-y-1 text-left">
            <li>• Notre équipe va examiner votre dossier</li>
            <li>• Vous recevrez une réponse sous 2-3 jours ouvrés</li>
            <li>• Si approuvée, vous recevrez vos accès boutique</li>
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.push('/')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Retour à l'accueil
          </button>
          <button
            onClick={() => router.push('/boutique/inscription')}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50"
          >
            Nouvelle demande
          </button>
        </div>
      </div>
    </div>
  );
}
