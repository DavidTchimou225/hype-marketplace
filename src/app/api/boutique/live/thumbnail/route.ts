import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyStoreToken } from '@/middleware/storeAuth';


export async function POST(request: NextRequest) {
  try {
    const store = await verifyStoreToken(request);
    if (!store) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 401 });
    }

    const { dataUrl } = await request.json();
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
      return NextResponse.json({ error: 'Image invalide' }, { status: 400 });
    }

    const currentLive = await prisma.liveSession.findFirst({
      where: { storeId: store.id, isLive: true },
      orderBy: { startedAt: 'desc' }
    });

    if (!currentLive) {
      return NextResponse.json({ error: 'Aucune session live active' }, { status: 404 });
    }

    await prisma.liveSession.update({
      where: { id: currentLive.id },
      data: { thumbnail: dataUrl }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur MAJ miniature live:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
