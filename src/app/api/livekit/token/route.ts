import { NextRequest, NextResponse } from 'next/server';
import { verifyStoreToken } from '@/middleware/storeAuth';

export async function POST(request: NextRequest) {
  try {
    const { role, room } = await request.json();

    const url = process.env.LIVEKIT_URL;
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!url || !apiKey || !apiSecret) {
      return NextResponse.json({ error: 'LiveKit non configuré. Ajoutez LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET dans .env' }, { status: 500 });
    }

    if (!role || !room) {
      return NextResponse.json({ error: 'Paramètres invalides' }, { status: 400 });
    }

    // Dynamic import to avoid build-time dependency when package not yet installed
    const { AccessToken } = await import('livekit-server-sdk');

    let identity = '';

    if (role === 'publisher') {
      // Only stores can publish; verify store and room binding
      const store = await verifyStoreToken(request);
      if (!store) {
        return NextResponse.json({ error: 'Accès non autorisé' }, { status: 401 });
      }
      const expectedRoom = `room-store-${store.id}`;
      if (room !== expectedRoom) {
        return NextResponse.json({ error: 'Room invalide pour cette boutique' }, { status: 403 });
      }
      identity = `store-${store.id}`;
    } else {
      // subscriber identity can be anonymous
      identity = `viewer-${Math.random().toString(36).slice(2, 10)}`;
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity,
      ttl: 60 * 60, // 1h
    });

    at.addGrant({
      room,
      roomJoin: true,
      canPublish: role === 'publisher',
      canSubscribe: true,
      canPublishData: role === 'publisher',
    });

    const token = await at.toJwt();

    return NextResponse.json({ url, token });
  } catch (error) {
    console.error('LiveKit token error:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
