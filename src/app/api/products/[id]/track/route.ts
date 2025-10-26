import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST - Tracker une action sur un produit
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { action } = await request.json();
    const productId = params.id;

    if (!action || !['view', 'cart_add', 'purchase'].includes(action)) {
      return NextResponse.json(
        { error: 'Action invalide' },
        { status: 400 }
      );
    }

    // Vérifier que le produit existe
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    // Mettre à jour le compteur correspondant
    const updateData: any = {};

    switch (action) {
      case 'view':
        updateData.viewCount = { increment: 1 };
        break;
      case 'cart_add':
        updateData.cartAddCount = { increment: 1 };
        break;
      case 'purchase':
        updateData.purchaseCount = { increment: 1 };
        break;
    }

    await prisma.product.update({
      where: { id: productId },
      data: updateData
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erreur tracking:', error);
    return NextResponse.json(
      { error: 'Erreur lors du tracking' },
      { status: 500 }
    );
  }
}
