import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyStoreToken } from '@/middleware/storeAuth';


export async function GET(request: NextRequest) {
  try {
    const store = await verifyStoreToken(request);
    if (!store) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 401 }
      );
    }

    const storeId = store.id;

    const [
      totalProducts,
      activeProducts,
      totalOrders,
      totalRevenue
    ] = await Promise.all([
      prisma.product.count({
        where: { storeId }
      }),
      prisma.product.count({
        where: { storeId, isActive: true }
      }),
      prisma.orderItem.count({
        where: { storeId }
      }),
      prisma.orderItem.aggregate({
        where: { storeId },
        _sum: {
          price: true
        }
      })
    ]);

    return NextResponse.json({
      totalProducts,
      activeProducts,
      totalOrders,
      totalRevenue: totalRevenue._sum.price || 0
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
