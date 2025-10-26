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

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || 'month';
    
    const storeId = store.id;
    const now = new Date();
    let startDate: Date;

    // Définir la période selon le range
    switch (range) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'quarter':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default: // month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const [
      totalRevenue,
      monthlyRevenue,
      weeklyRevenue,
      dailyRevenue,
      totalOrders,
      monthlyOrders,
      weeklyOrders,
      dailyOrders,
      topProducts,
      revenueByMonth,
      ordersByStatus
    ] = await Promise.all([
      // CA total
      prisma.orderItem.aggregate({
        where: { 
          storeId,
          order: { paymentStatus: 'PAID' }
        },
        _sum: { price: true }
      }),
      
      // CA mensuel
      prisma.orderItem.aggregate({
        where: { 
          storeId,
          order: { 
            paymentStatus: 'PAID',
            createdAt: { gte: new Date(now.getFullYear(), now.getMonth(), 1) }
          }
        },
        _sum: { price: true }
      }),
      
      // CA hebdomadaire
      prisma.orderItem.aggregate({
        where: { 
          storeId,
          order: { 
            paymentStatus: 'PAID',
            createdAt: { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) }
          }
        },
        _sum: { price: true }
      }),
      
      // CA journalier
      prisma.orderItem.aggregate({
        where: { 
          storeId,
          order: { 
            paymentStatus: 'PAID',
            createdAt: { gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()) }
          }
        },
        _sum: { price: true }
      }),
      
      // Commandes total
      prisma.orderItem.count({
        where: { storeId }
      }),
      
      // Commandes mensuelles
      prisma.orderItem.count({
        where: { 
          storeId,
          order: { createdAt: { gte: new Date(now.getFullYear(), now.getMonth(), 1) } }
        }
      }),
      
      // Commandes hebdomadaires
      prisma.orderItem.count({
        where: { 
          storeId,
          order: { createdAt: { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } }
        }
      }),
      
      // Commandes journalières
      prisma.orderItem.count({
        where: { 
          storeId,
          order: { createdAt: { gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()) } }
        }
      }),
      
      // Top produits
      prisma.orderItem.groupBy({
        by: ['productId'],
        where: { 
          storeId,
          order: { paymentStatus: 'PAID' }
        },
        _sum: {
          quantity: true,
          price: true
        },
        orderBy: {
          _sum: {
            price: 'desc'
          }
        },
        take: 10
      }),
      
      // CA par mois (6 derniers mois)
      prisma.$queryRaw`
        SELECT 
          DATE_FORMAT(o.createdAt, '%Y-%m') as month,
          SUM(oi.price * oi.quantity) as revenue,
          COUNT(DISTINCT o.id) as orders
        FROM OrderItem oi
        JOIN \`Order\` o ON oi.orderId = o.id
        WHERE oi.storeId = ${storeId}
          AND o.paymentStatus = 'PAID'
          AND o.createdAt >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(o.createdAt, '%Y-%m')
        ORDER BY month DESC
      `,
      
      // Commandes par statut
      prisma.order.groupBy({
        by: ['status'],
        where: {
          items: {
            some: { storeId }
          }
        },
        _count: {
          status: true
        }
      })
    ]);

    // Enrichir les top produits avec les noms
    const productIds = topProducts.map(p => p.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true }
    });

    const enrichedTopProducts = topProducts.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        id: item.productId,
        name: product?.name || 'Produit supprimé',
        totalSold: item._sum.quantity || 0,
        revenue: item._sum.price || 0
      };
    });

    // Formater les données par mois
    const formattedRevenueByMonth = (revenueByMonth as any[]).map(item => ({
      month: item.month,
      revenue: Number(item.revenue) || 0,
      orders: Number(item.orders) || 0
    }));

    // Formater les commandes par statut
    const formattedOrdersByStatus = ordersByStatus.reduce((acc, item) => {
      acc[item.status] = item._count.status;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      totalRevenue: totalRevenue._sum.price || 0,
      monthlyRevenue: monthlyRevenue._sum.price || 0,
      weeklyRevenue: weeklyRevenue._sum.price || 0,
      dailyRevenue: dailyRevenue._sum.price || 0,
      totalOrders,
      monthlyOrders,
      weeklyOrders,
      dailyOrders,
      topProducts: enrichedTopProducts,
      revenueByMonth: formattedRevenueByMonth,
      ordersByStatus: formattedOrdersByStatus
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des analytics:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
