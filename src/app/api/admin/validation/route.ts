import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/middleware/adminAuth';


export async function GET(request: NextRequest) {
  try {
    try {
      requireAdmin(request);
    } catch (error) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 401 }
      );
    }

    // Validation complète du système
    const validationResults = await Promise.all([
      // 1. Vérifier l'intégrité des données
      validateDataIntegrity(),
      // 2. Vérifier les performances
      validatePerformance(),
      // 3. Vérifier la sécurité
      validateSecurity()
    ]);

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      status: validationResults.every(r => r.status === 'ok') ? 'healthy' : 'warning',
      checks: {
        dataIntegrity: validationResults[0],
        performance: validationResults[1],
        security: validationResults[2]
      }
    });

  } catch (error) {
    console.error('Erreur lors de la validation système:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

async function validateDataIntegrity() {
  try {
    const checks = await Promise.all([
      // Produits sans boutique
      prisma.product.count({ where: { storeId: { not: { in: await prisma.store.findMany().then(stores => stores.map(s => s.id)) } } } }),
      // Commandes sans utilisateur valide
      prisma.order.count({ where: { userId: { not: { in: await prisma.user.findMany().then(users => users.map(u => u.id)) } } } }),
      // Prix négatifs
      prisma.product.count({ where: { price: { lt: 0 } } }),
      // Stocks négatifs
      prisma.product.count({ where: { stock: { lt: 0 } } })
    ]);

    const issues = checks.reduce((sum, count) => sum + count, 0);

    return {
      status: issues === 0 ? 'ok' : 'warning',
      issues,
      details: {
        orphanedProducts: checks[0],
        orphanedOrders: checks[1],
        negativePrice: checks[2],
        negativeStock: checks[3]
      }
    };
  } catch (error) {
    return { status: 'error', error: (error as Error).message };
  }
}

async function validatePerformance() {
  try {
    const start = Date.now();
    
    // Test de performance simple
    await prisma.product.count();
    await prisma.user.count();
    await prisma.order.count();
    
    const responseTime = Date.now() - start;
    
    return {
      status: responseTime < 1000 ? 'ok' : responseTime < 3000 ? 'warning' : 'critical',
      responseTime,
      threshold: { good: 1000, warning: 3000 }
    };
  } catch (error) {
    return { status: 'error', error: (error as Error).message };
  }
}

async function validateSecurity() {
  try {
    // Vérifier les utilisateurs admin
    const adminCount = await prisma.user.count({
      where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } }
    });

    // Vérifier les commandes récentes suspectes
    const suspiciousOrders = await prisma.order.count({
      where: {
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        totalAmount: { gt: 100000000 } // Plus de 1M FCFA
      }
    });

    return {
      status: adminCount > 0 && suspiciousOrders === 0 ? 'ok' : 'warning',
      adminCount,
      suspiciousOrders
    };
  } catch (error) {
    return { status: 'error', error: (error as Error).message };
  }
}
