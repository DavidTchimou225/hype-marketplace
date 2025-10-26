import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyStoreToken } from '@/middleware/storeAuth';


// Get current live session for the authenticated store
export async function GET(request: NextRequest) {
  try {
    const store = await verifyStoreToken(request);
    if (!store) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 401 });
    }

    const currentLive = await prisma.liveSession.findFirst({
      where: { storeId: store.id, isLive: true },
      orderBy: { startedAt: 'desc' }
    });

    return NextResponse.json({ live: currentLive });
  } catch (error) {
    console.error('Erreur GET live boutique:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}

// Start a live session
export async function POST(request: NextRequest) {
  try {
    const store = await verifyStoreToken(request);
    if (!store) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 401 });
    }

    const { title, streamUrl, thumbnail } = await request.json();
    if (!title) {
      return NextResponse.json({ error: 'Titre requis' }, { status: 400 });
    }

    // End any existing live (safety)
    await prisma.liveSession.updateMany({
      where: { storeId: store.id, isLive: true },
      data: { isLive: false, endedAt: new Date() }
    });

    const live = await prisma.liveSession.create({
      data: {
        storeId: store.id,
        title,
        // Si aucun streamUrl fourni, on considère un live interne Hype
        streamUrl: streamUrl || 'internal',
        thumbnail,
        isLive: true,
        startedAt: new Date()
      }
    });

    // Flag store as live
    await prisma.store.update({ where: { id: store.id }, data: { isLive: true } });

    return NextResponse.json({ live }, { status: 201 });
  } catch (error) {
    console.error('Erreur démarrage live boutique:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}

// Stop current live session
export async function DELETE(request: NextRequest) {
  try {
    const store = await verifyStoreToken(request);
    if (!store) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 401 });
    }

    const currentLive = await prisma.liveSession.findFirst({
      where: { storeId: store.id, isLive: true },
      orderBy: { startedAt: 'desc' }
    });

    if (!currentLive) {
      return NextResponse.json({ success: true });
    }

    await prisma.liveSession.update({
      where: { id: currentLive.id },
      data: { isLive: false, endedAt: new Date() }
    });

    await prisma.store.update({ where: { id: store.id }, data: { isLive: false } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur arrêt live boutique:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
