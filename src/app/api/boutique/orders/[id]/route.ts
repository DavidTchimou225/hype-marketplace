import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyStoreToken } from '@/middleware/storeAuth';


// Update order status (for orders that include items from this store)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const store = await verifyStoreToken(request);
    const storeId = store.id;

    const body = await request.json().catch(() => ({}));
    const nextStatus = String(body.status || '').toUpperCase();
    const allowed = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!allowed.includes(nextStatus)) {
      return NextResponse.json({ error: 'Statut invalide' }, { status: 400 });
    }

    // Ensure order exists and contains at least one item for this store
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: { select: { storeId: true } } }
    });

    if (!order) {
      return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 });
    }

    const hasStoreItems = order.items.some((i) => i.storeId === storeId);
    if (!hasStoreItems) {
      return NextResponse.json({ error: 'Accès non autorisé à cette commande' }, { status: 403 });
    }

    const updated = await prisma.order.update({
      where: { id: params.id },
      data: { status: nextStatus as any }
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut de commande:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
