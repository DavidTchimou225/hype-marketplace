'use client';

import { useEffect, useRef, useState } from 'react';

export default function BoutiqueLivePage() {
  const [currentLive, setCurrentLive] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', thumbnail: '' });
  const [submitting, setSubmitting] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const liveKitRoomRef = useRef<any>(null);
  const useLiveKitRef = useRef<boolean>(false);
  const [rtStats, setRtStats] = useState<{ likes: number; buys: number; comments: Array<{ from: string; text: string }> }>({ likes: 0, buys: 0, comments: [] });

  useEffect(() => {
    loadCurrentLive();
  }, []);

  const loadCurrentLive = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/boutique/live');
      if (res.ok) {
        const data = await res.json();
        setCurrentLive(data.live);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const startLive = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/boutique/live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        await loadCurrentLive();
        setForm({ title: '', thumbnail: '' });
        // Mettre à jour localStorage.store pour refléter l'état live
        try {
          const raw = localStorage.getItem('store');
          if (raw) {
            const parsed = JSON.parse(raw);
            parsed.isLive = true;
            localStorage.setItem('store', JSON.stringify(parsed));
          }
        } catch {}
        // Recharger l'application pour que le layout reflète l'état Live
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const stopLive = async () => {
    setSubmitting(true);
    try {
      // Stopper le flux local si actif
      try {
        const stream = localStreamRef.current;
        if (stream) {
          stream.getTracks().forEach((t) => t.stop());
          localStreamRef.current = null;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      } catch {}
      const res = await fetch('/api/boutique/live', { method: 'DELETE' });
      if (res.ok) {
        await loadCurrentLive();
        // Mettre à jour localStorage.store pour refléter l'état live OFF
        try {
          const raw = localStorage.getItem('store');
          if (raw) {
            const parsed = JSON.parse(raw);
            parsed.isLive = false;
            localStorage.setItem('store', JSON.stringify(parsed));
          }
        } catch {}
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Lorsque le live est interne, tenter LiveKit sinon fallback caméra locale
  useEffect(() => {
    const setupCamera = async () => {
      if (!(currentLive && currentLive.streamUrl === 'internal' && videoRef.current)) return;

      // Essayer d'utiliser LiveKit
      try {
        const raw = localStorage.getItem('store');
        const store = raw ? JSON.parse(raw) : null;
        const roomName = store?.id ? `room-store-${store.id}` : null;
        if (!roomName) throw new Error('Store non disponible');

        const tokenRes = await fetch('/api/livekit/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: 'publisher', room: roomName })
        });

        if (tokenRes.ok) {
          const { url, token } = await tokenRes.json();
          const livekit = await import('livekit-client');
          const room = new livekit.Room();
          await room.connect(url, token);
          liveKitRoomRef.current = room;
          useLiveKitRef.current = true;

          // créer et publier les pistes locales (vidéo + audio)
          const videoTrack = await livekit.createLocalVideoTrack();
          try {
            const audioTrack = await livekit.createLocalAudioTrack();
            await room.localParticipant.publishTrack(audioTrack);
          } catch {}
          await room.localParticipant.publishTrack(videoTrack);
          // Ecoute des interactions temps réel des viewers
          room.on('dataReceived', (payload: Uint8Array) => {
            try {
              const msg = JSON.parse(new TextDecoder().decode(payload));
              if (msg?.type === 'like') setRtStats((s) => ({ ...s, likes: s.likes + 1 }));
              if (msg?.type === 'buy_click') setRtStats((s) => ({ ...s, buys: s.buys + 1 }));
              if (msg?.type === 'comment' && msg.text) setRtStats((s) => ({ ...s, comments: [...s.comments.slice(-19), { from: msg.from || 'viewer', text: msg.text }] }));
            } catch {}
          });
          // Attacher la preview au videoRef
          if (videoRef.current) {
            const el = videoTrack.attach();
            // remplacer le contenu du conteneur vidéo
            videoRef.current.replaceWith(el);
            // réassigner la ref pour les snapshots (optionnel)
            // @ts-ignore
            videoRef.current = el as HTMLVideoElement;
          }
          return;
        }
      } catch (e) {
        // LiveKit non configuré ou indisponible -> fallback getUserMedia
      }

      // Fallback: caméra locale pour aperçu/snapshots
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        localStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Impossible d\'accéder à la caméra:', err);
      }
    };

    setupCamera();

    return () => {
      try {
        const stream = localStreamRef.current;
        if (stream) {
          stream.getTracks().forEach((t) => t.stop());
          localStreamRef.current = null;
        }
        if (liveKitRoomRef.current) {
          try { liveKitRoomRef.current.disconnect?.(); } catch {}
          liveKitRoomRef.current = null;
          useLiveKitRef.current = false;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      } catch {}
    };
  }, [currentLive]);

  // Capturer périodiquement des snapshots pour mettre à jour la miniature côté public
  useEffect(() => {
    let intervalId: any;
    const startSnapshots = () => {
      if (!videoRef.current) return;
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      const takeSnapshot = async () => {
        try {
          // Dimensionne le canvas selon la vidéo
          const width = video.videoWidth || 640;
          const height = video.videoHeight || 360;
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          ctx.drawImage(video, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          // Envoyer à l'API
          await fetch('/api/boutique/live/thumbnail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dataUrl })
          });
        } catch (e) {
          // silencieux pour ne pas spammer la console
        }
      };
      // Première capture rapide après démarrage, puis toutes les 5 sec
      takeSnapshot();
      intervalId = setInterval(takeSnapshot, 5000);
    };

    if (currentLive && currentLive.streamUrl === 'internal' && !useLiveKitRef.current) {
      startSnapshots();
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [currentLive]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Live Boutique</h1>
              <p className="text-gray-600">Lancez un live shopping pour vos clients</p>
            </div>

            {/* Panneau stats en direct */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Likes</div>
                <div className="text-2xl font-bold">{rtStats.likes}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Clics Acheter</div>
                <div className="text-2xl font-bold">{rtStats.buys}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 md:col-span-1 md:col-start-1 md:col-end-4">
                <div className="text-sm text-gray-600 mb-2">Commentaires</div>
                <div className="max-h-40 overflow-auto space-y-2">
                  {rtStats.comments.slice(-10).map((c, i) => (
                    <div key={i} className="text-sm"><span className="text-gray-800 font-medium">{c.from}:</span> <span className="text-gray-700">{c.text}</span></div>
                  ))}
                  {rtStats.comments.length === 0 && <div className="text-gray-400 text-sm">Aucun commentaire</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentLive ? (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{currentLive.title}</h2>
                <p className="text-gray-600 mb-4">Live en cours • démarré le {new Date(currentLive.startedAt).toLocaleString('fr-FR')}</p>
              </div>
              <button onClick={stopLive} disabled={submitting} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50">Arrêter le live</button>
            </div>

            <div className="aspect-video bg-black rounded-lg overflow-hidden mt-4">
              {currentLive.streamUrl === 'internal' ? (
                <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
              ) : currentLive.streamUrl?.endsWith?.('.m3u8') ? (
                <video controls autoPlay className="w-full h-full">
                  <source src={currentLive.streamUrl} type="application/x-mpegURL" />
                  Votre navigateur ne supporte pas la lecture HLS.
                </video>
              ) : (
                <iframe
                  src={currentLive.streamUrl}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={startLive} className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Démarrer un live</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Live nouveautés, promo, etc."
                  required
                />
              </div>



              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Miniature (optionnel)</label>
                <input
                  type="url"
                  value={form.thumbnail}
                  onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="https://exemple.com/thumbnail.jpg"
                />
              </div>

              <div className="flex justify-end">
                <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">Démarrer le live</button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
