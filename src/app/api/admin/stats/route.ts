import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/middleware/adminAuth';


export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    try {
      // On récupère l'admin pour connaître son rôle
      const admin = requireAdmin(request);
      
      // Statistiques générales (compatibilité existante)
      const [
        totalUsers,
        totalStores,
        totalProducts,
        totalOrders,
        totalCategories,
        recentOrders,
        monthlyRevenueAgg,
        topStores
      ] = await Promise.all([
        // Nombre total d'utilisateurs
        prisma.user.count({ where: { role: 'USER' } }),
        
        // Nombre total de boutiques
        prisma.store.count(),
        
        // Nombre total de produits
        prisma.product.count(),
        
        // Nombre total de commandes
        prisma.order.count(),
        
        // Nombre total de catégories
        prisma.category.count(),
        
        // Commandes récentes (7 derniers jours)
        prisma.order.count({
          where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }
        }),
        
        // Revenus du mois en cours
        prisma.order.aggregate({
          where: {
            createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
            paymentStatus: 'PAID'
          },
          _sum: { totalAmount: true }
        }),
        
        // Top 5 boutiques par ventes
        prisma.store.findMany({
          take: 5,
          orderBy: { totalSales: 'desc' },
          select: {
            id: true,
            name: true,
            totalSales: true,
            rating: true,
            _count: { select: { products: true } }
          }
        })
      ]);

      // Statistiques par statut de commande (compatibilité existante)
      const ordersByStatusAgg = await prisma.order.groupBy({
        by: ['status'],
        _count: { status: true }
      });

      // Évolution des inscriptions (30 derniers jours) (compatibilité existante)
      const userGrowthAgg = await prisma.user.groupBy({
        by: ['createdAt'],
        where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, role: 'USER' },
        _count: { id: true }
      });

      // Métriques Super Admin supplémentaires
      const [
        adminCount,
        pendingApplications,
        paidOrdersCount,
        revenueTodayAgg,
        revenue7dAgg,
        lifetimeRevenueAgg,
        itemsSoldAgg,
        ordersLast30Agg,
        revenueLast30Agg
      ] = await Promise.all([
        prisma.user.count({ where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } } }),
        prisma.storeApplication.count({ where: { status: 'PENDING' } }),
        prisma.order.count({ where: { paymentStatus: 'PAID' } }),
        prisma.order.aggregate({
          where: {
            createdAt: { gte: new Date(new Date().setHours(0,0,0,0)) },
            paymentStatus: 'PAID'
          },
          _sum: { totalAmount: true }
        }),
        prisma.order.aggregate({
          where: {
            createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            paymentStatus: 'PAID'
          },
          _sum: { totalAmount: true }
        }),
        prisma.order.aggregate({ where: { paymentStatus: 'PAID' }, _sum: { totalAmount: true } }),
        prisma.orderItem.aggregate({ _sum: { quantity: true } }),
        // Commandes par jour - 30 derniers jours
        prisma.order.groupBy({
          by: ['createdAt'],
          where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
          _count: { id: true }
        }),
        // Revenus par jour - 30 derniers jours (uniquement PAID)
        prisma.order.groupBy({
          by: ['createdAt'],
          where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, paymentStatus: 'PAID' },
          _sum: { totalAmount: true }
        })
      ]);

      const ordersByStatus = ordersByStatusAgg.reduce((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      }, {} as Record<string, number>);

      // AOV
      const revenueMonth = monthlyRevenueAgg._sum.totalAmount || 0;
      const lifetimeRevenue = lifetimeRevenueAgg._sum.totalAmount || 0;
      const itemsSold = itemsSoldAgg._sum.quantity || 0;
      const averageOrderValue = totalOrders > 0 ? Math.round(lifetimeRevenue / totalOrders) : 0;

      // Séries temporelles compactes (regroupées par date ISO yyyy-mm-dd)
      function groupDaily<T extends { createdAt: Date }>(rows: any[], valueKey: string) {
        const map: Record<string, number> = {};
        for (const r of rows) {
          const d = new Date(r.createdAt);
          const key = d.toISOString().slice(0,10);
          const val = (r as any)[valueKey]?._sum?.totalAmount || (r as any)._count?.id || 0;
          map[key] = (map[key] || 0) + val;
        }
        return map;
      }

      const dailyOrders = groupDaily(ordersLast30Agg as any[], '_count');
      const dailyRevenue = groupDaily(revenueLast30Agg as any[], '_sum');

      // Réponse complète pour Super Admin, compatible avec l'existant
      return NextResponse.json({
        role: admin.role,
        overview: {
          totalUsers,
          totalStores,
          totalProducts,
          totalOrders,
          totalCategories,
          recentOrders,
          monthlyRevenue: revenueMonth
        },
        ordersByStatus,
        topStores,
        userGrowth: userGrowthAgg.length,
        superAdmin: {
          adminCount,
          pendingApplications,
          paidOrdersCount,
          revenue: {
            today: revenueTodayAgg._sum.totalAmount || 0,
            last7d: revenue7dAgg._sum.totalAmount || 0,
            lifetime: lifetimeRevenue
          },
          itemsSold,
          averageOrderValue,
          dailyOrders,
          dailyRevenue
        }
      });
    } catch (error) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
