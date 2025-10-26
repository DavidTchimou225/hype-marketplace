'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type LiveItem = {
  id: string;
  title: string;
  streamUrl: string;
  thumbnail?: string | null;
  startedAt: string;
  store: { id: string; name: string; slug: string; avatar?: string | null };
};

export default function LiveWatchPage() {
  const params = useSearchParams();
  const router = useRouter();
  const initialRoom = params.get('room') || '';

  const containerRef = useRef<HTMLDivElement | null>(null);
  const roomRef = useRef<any>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [lives, setLives] = useState<LiveItem[]>([]);
  const [index, setIndex] = useState(0);
  const [meta, setMeta] = useState<{ storeName?: string; storeSlug?: string; storeAvatar?: string | null; tagline?: string; highlight?: { title: string; price: number; image?: string } | null; }>({});
  const [audioOn, setAudioOn] = useState(false);
  const [connected, setConnected] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState<Array<{ from: string; text: string }>>([]);

  // connect to a given live by index
  const connectToIndex = async (i: number) => {
    const live = lives[i];
    if (!live) {
      setLoading(false);
      setError('Aucun live disponible');
      return;
    }
    setLoading(true);
    setError('');
    // cleanup previous
    try {
      if (roomRef.current) {
        roomRef.current.disconnect?.();
        roomRef.current = null;
      }
      if (containerRef.current) containerRef.current.innerHTML = '';
    } catch {}
    setMeta({ storeName: live.store.name, storeSlug: live.store.slug, storeAvatar: live.store.avatar, tagline: 'En direct maintenant', highlight: null });
    setLikes(0);
    setComments([]);

    let lkRoom: any = null;
    try {
      const roomName = `room-store-${live.store.id}`;
      const res = await fetch('/api/livekit/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'subscriber', room: roomName })
      });
      if (res.ok) {
        const { url, token } = await res.json();
        const livekit = await import('livekit-client');
        lkRoom = new livekit.Room({ adaptiveStream: true, dynacast: true });
        await lkRoom.connect(url, token);
        roomRef.current = lkRoom;
        setConnected(true);
        setHasVideo(false);

        const attachTrack = (track: any) => {
          try {
            if (track.kind === 'video') {
              const el = track.attach();
              if (containerRef.current) {
                containerRef.current.innerHTML = '';
                containerRef.current.appendChild(el);
                Object.assign(el.style, { width: '100%', height: '100%', objectFit: 'cover' });
                // @ts-ignore
                el.muted = true;
                // @ts-ignore
                el.playsInline = true;
                // @ts-ignore
                el.autoplay = true;
              }
              setHasVideo(true);
            }
          } catch {}
        };
        const onSub = (track: any) => attachTrack(track);
        lkRoom.on('trackSubscribed', onSub);
        // Receive real-time interactions
        lkRoom.on('dataReceived', (payload: Uint8Array) => {
          try {
            const msg = JSON.parse(new TextDecoder().decode(payload));
            if (msg?.type === 'like') setLikes((v) => v + 1);
            if (msg?.type === 'comment' && msg.text) setComments((arr) => [...arr.slice(-19), { from: msg.from || 'viewer', text: msg.text }]);
          } catch {}
        });
        for (const p of lkRoom.participants.values()) {
          for (const pub of p.tracks.values()) {
            if (pub.track) attachTrack(pub.track);
          }
        }

        const t = setTimeout(() => {
          if (!hasVideo && containerRef.current) {
            containerRef.current.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.8);">En attente du diffuseur…</div>`;
          }
          setLoading(false);
        }, 6000);
        lkRoom.once('disconnected', () => {
          try { clearTimeout(t); } catch {}
          try { lkRoom.off('trackSubscribed', onSub); } catch {}
        });
      } else {
        // Fallback rendering if token not available
        if (containerRef.current) {
          if (live.thumbnail) {
            containerRef.current.innerHTML = `<img src="${live.thumbnail}" style="width:100%;height:100%;object-fit:cover;" />`;
          } else {
            containerRef.current.innerHTML = `<div style=\"width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.8);\">Live en cours</div>`;
          }
        }
        setLoading(false);
      }
    } catch (e: any) {
      setError(e?.message || 'Erreur de lecture du live');
      setLoading(false);
    }
  };
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/lives?limit=100');
        const data = res.ok ? await res.json() : { lives: [] };
        if (!mounted) return;
        setLives(data.lives || []);
        if (!data.lives || data.lives.length === 0) {
          setLoading(false);
          setError('Aucun live disponible');
          return;
        }
        let start = 0;
        if (initialRoom) {
          const idx = (data.lives || []).findIndex((l: any) => `room-store-${l.store.id}` === initialRoom);
          start = idx >= 0 ? idx : 0;
        }
        setIndex(start);
        // connect to first
        setTimeout(() => connectToIndex(start), 0);
      } catch (e: any) {
        setError('Aucun live disponible');
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [initialRoom]);

  // Swipe/scroll/keyboard handlers
  useEffect(() => {
    let touchStartY = 0;
    let touchEndY = 0;
    const threshold = 50;

    const onTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
    const onTouchMove = (e: TouchEvent) => { touchEndY = e.touches[0].clientY; };
    const onTouchEnd = () => {
      const delta = touchEndY - touchStartY;
      if (Math.abs(delta) > threshold) {
        if (delta < 0 && index < lives.length - 1) {
          const next = index + 1; setIndex(next); connectToIndex(next);
        } else if (delta > 0 && index > 0) {
          const prev = index - 1; setIndex(prev); connectToIndex(prev);
        }
      }
      touchStartY = 0; touchEndY = 0;
    };

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 30 && index < lives.length - 1) { const next = index + 1; setIndex(next); connectToIndex(next); }
      else if (e.deltaY < -30 && index > 0) { const prev = index - 1; setIndex(prev); connectToIndex(prev); }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && index > 0) { const prev = index - 1; setIndex(prev); connectToIndex(prev); }
      if (e.key === 'ArrowDown' && index < lives.length - 1) { const next = index + 1; setIndex(next); connectToIndex(next); }
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
    };
  }, [index, lives.length]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      try { if (roomRef.current) roomRef.current.disconnect?.(); } catch {}
      try { if (containerRef.current) containerRef.current.innerHTML = ''; } catch {}
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Fullscreen video container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden" />

      {/* Gradient overlay for readability */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

      {/* Store info */}
      <div className="absolute left-4 bottom-32 md:bottom-40 flex flex-col items-start gap-2">
        <div className="flex items-center gap-3">
          {meta.storeAvatar ? (
            <img src={meta.storeAvatar} alt={meta.storeName || 'Boutique'} className="w-12 h-12 rounded-full object-cover border border-white/20" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-white/20" />
          )}
          <div>
            <div className="text-lg font-bold drop-shadow">{meta.storeName || 'Boutique'}</div>
            <div className="text-sm text-white/80 drop-shadow">{meta.tagline || 'En direct maintenant'}</div>
          </div>

      {/* Comment input */}
      <div className="absolute left-4 right-4 bottom-24 flex items-center gap-2">
        <input
          id="commentInput"
          type="text"
          placeholder="Votre commentaire…"
          className="flex-1 bg-white/15 backdrop-blur text-white placeholder-white/70 rounded-full px-4 py-2 outline-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const text = (e.target as HTMLInputElement).value.trim();
              if (!text) return;
              try {
                if (roomRef.current) {
                  const payload = new TextEncoder().encode(JSON.stringify({ type: 'comment', text }));
                  roomRef.current.localParticipant?.publishData?.(payload);
                }
              } catch {}
              (e.target as HTMLInputElement).value = '';
            }
          }}
        />
      </div>
        </div>
      </div>

      {/* Side actions */}
      <div className="absolute right-4 bottom-32 md:bottom-40 flex flex-col items-center gap-4">
        <button
          onClick={() => {
            try {
              if (roomRef.current) {
                const payload = new TextEncoder().encode(JSON.stringify({ type: 'like' }));
                roomRef.current.localParticipant?.publishData?.(payload);
                setLikes((v) => v + 1);
              }
            } catch {}
          }}
          className="w-12 h-12 rounded-full bg-white/15 backdrop-blur flex items-center justify-center shadow hover:bg-white/25"
          aria-label="Like"
        >❤️</button>
        <button className="w-12 h-12 rounded-full bg-white/15 backdrop-blur flex items-center justify-center shadow hover:bg-white/25" aria-label="Comment">💬</button>
        <button className="w-12 h-12 rounded-full bg-white/15 backdrop-blur flex items-center justify-center shadow hover:bg-white/25" aria-label="Profil">👤</button>
        <button
          onClick={async () => {
            try {
              if (roomRef.current) {
                await roomRef.current.startAudio?.();
                // Unmute remote audio tracks
                for (const p of roomRef.current.participants.values()) {
                  for (const pub of p.tracks.values()) {
                    if (pub.kind === 'audio' && pub.audioTrack) {
                      try { pub.audioTrack.attach().muted = false; } catch {}
                    }
                  }
                }
                setAudioOn(true);
              }
            } catch {}
          }}
          className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center shadow hover:bg-white/30"
          aria-label="Unmute"
        >{audioOn ? '🔊' : '🔈'}</button>
      </div>

      {/* Bottom product highlight card */}
      <div className="absolute left-0 right-0 bottom-16 px-4">
        <div className="max-w-sm">
          <div className="bg-black/60 backdrop-blur rounded-xl p-3 flex items-center gap-3 shadow-lg">
            <div className="w-10 h-10 rounded-lg bg-white/10 overflow-hidden" />
            <div className="flex-1">
              <div className="text-sm font-semibold">Produit en vedette</div>
              <div className="text-xs text-white/80">Découvrir maintenant</div>
            </div>
            <button
              onClick={() => {
                try {
                  if (roomRef.current) {
                    const payload = new TextEncoder().encode(JSON.stringify({ type: 'buy_click' }));
                    roomRef.current.localParticipant?.publishData?.(payload);
                  }
                } catch {}
                if (meta.storeSlug) {
                  window.location.href = `/store/${meta.storeSlug}`;
                }
              }}
              className="text-sm font-semibold bg-white text-black rounded-lg px-3 py-1.5 hover:bg-gray-100"
            >Acheter</button>
          </div>
        </div>
      </div>

      {/* Floating counters & comments */}
      <div className="absolute right-4 top-20 bg-black/40 backdrop-blur rounded-lg px-3 py-2 text-sm">
        ❤️ {likes}
      </div>
      <div className="absolute left-4 top-20 space-y-1 max-w-[70%]">
        {comments.slice(-4).map((c, i) => (
          <div key={i} className="bg-black/40 backdrop-blur rounded-full px-3 py-1 text-sm">
            <span className="text-white/90">{c.from}:</span> <span className="text-white">{c.text}</span>
          </div>
        ))}
      </div>

      {/* BottomNav spacer */}
      <div className="absolute left-0 right-0 bottom-0 h-16" />

      {/* Status */}
      {loading && <div className="absolute inset-0 flex items-center justify-center text-white/80">Chargement…</div>}
      {!loading && error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur rounded-lg px-4 py-3">{error}</div>
        </div>
      )}

      {/* Back button on desktop */}
      <div className="hidden md:block absolute top-4 left-4 z-10">
        <Link href="/" className="text-white/90 hover:text-white">← Retour</Link>
      </div>
    </div>
  );
}
