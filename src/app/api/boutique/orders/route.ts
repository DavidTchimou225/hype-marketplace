import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyStoreToken } from '@/middleware/storeAuth';


export async function GET(request: NextRequest) {
  try {
    // Authentifier la boutique via le cookie JWT 'store-token'
    const store = await verifyStoreToken(request);
    const storeId = store.id;
    const { searchParams } = new URL(request.url);
    const status = (searchParams.get('status') || '').toUpperCase();
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    const where: any = {
      items: { some: { storeId } }
    };

    if (status) {
      where.status = status;
    }
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to);
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        items: {
          where: { storeId },
          include: {
            product: {
              select: {
                name: true,
                images: true
              }
            }
          }
        },
        address: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ orders });

  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

