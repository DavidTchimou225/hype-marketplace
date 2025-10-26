'use client';

import { useState } from 'react';

interface ShareButtonProps {
  url: string;
  title: string;
  description?: string;
  type?: 'product' | 'store';
}

export default function ShareButton({ url, title, description, type = 'product' }: ShareButtonProps) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // URL complète pour le partage
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${url}` 
    : url;

  // Copier le lien dans le presse-papier
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
      // Fallback pour les navigateurs plus anciens
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Partager via l'API Web Share (mobile)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description || title,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Partage annulé ou erreur:', err);
      }
    } else {
      setShowShareModal(true);
    }
  };

  // URLs de partage pour les réseaux sociaux
  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title}\n${shareUrl}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
  };

  return (
    <>
      {/* Bouton Partager */}
      <button
        onClick={handleNativeShare}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
        title="Partager"
      >
        <span className="text-lg">📤</span>
        <span className="text-sm font-medium text-gray-700">Partager</span>
      </button>

      {/* Modal de partage */}
      {showShareModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50"
          onClick={() => setShowShareModal(false)}
        >
          <div 
            className="bg-white rounded-t-3xl w-full max-w-md p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                Partager {type === 'product' ? 'ce produit' : 'cette boutique'}
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Copier le lien */}
            <div className="mb-6">
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3 mb-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 bg-transparent text-sm text-gray-600 outline-none"
                />
                <button
                  onClick={copyToClipboard}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {copied ? '✓ Copié' : 'Copier'}
                </button>
              </div>
              {copied && (
                <p className="text-xs text-green-600 text-center">
                  ✓ Lien copié dans le presse-papier !
                </p>
              )}
            </div>

            {/* Options de partage */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700 mb-3">Partager via:</p>
              
              {/* WhatsApp */}
              <a
                href={shareLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">
                  💬
                </div>
                <div>
                  <p className="font-medium text-gray-900">WhatsApp</p>
                  <p className="text-xs text-gray-500">Partager sur WhatsApp</p>
                </div>
              </a>

              {/* Facebook */}
              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl">
                  f
                </div>
                <div>
                  <p className="font-medium text-gray-900">Facebook</p>
                  <p className="text-xs text-gray-500">Partager sur Facebook</p>
                </div>
              </a>

              {/* Twitter */}
              <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-sky-50 hover:bg-sky-100 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center text-white text-xl">
                  🐦
                </div>
                <div>
                  <p className="font-medium text-gray-900">Twitter</p>
                  <p className="text-xs text-gray-500">Partager sur Twitter</p>
                </div>
              </a>

              {/* Telegram */}
              <a
                href={shareLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white text-xl">
                  ✈️
                </div>
                <div>
                  <p className="font-medium text-gray-900">Telegram</p>
                  <p className="text-xs text-gray-500">Partager sur Telegram</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
