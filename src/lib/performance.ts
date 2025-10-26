// Optimisations de performance pour production
import { prisma } from '@/lib/prisma';

// Configuration optimisée de Prisma
export const prismaConfig = {
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  // Pool de connexions optimisé
  connectionLimit: 20,
  // Cache des requêtes
  resultCacheMaxAge: 60000, // 1 minute
};

// Cache en mémoire pour les données fréquemment consultées
class MemoryCache {
  private cache = new Map<string, { data: any; expiry: number }>();

  set(key: string, data: any, ttlMs: number = 300000) { // 5 minutes par défaut
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttlMs
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  clear() {
    this.cache.clear();
  }

  // Nettoyage automatique des entrées expirées
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

export const cache = new MemoryCache();

// Nettoyage automatique du cache toutes les 10 minutes
setInterval(() => cache.cleanup(), 600000);

// Requêtes optimisées pour le dashboard admin
export async function getOptimizedAdminStats() {
  const cacheKey = 'admin-stats';
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const stats = await prisma.$transaction(async (tx) => {
    const [
      totalUsers,
      totalStores,
      totalProducts,
      totalOrders,
      recentOrders,
      monthlyRevenue
    ] = await Promise.all([
      tx.user.count({ where: { role: 'USER' } }),
      tx.store.count(),
      tx.product.count({ where: { isActive: true } }),
      tx.order.count(),
      tx.order.count({
        where: {
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      }),
      tx.order.aggregate({
        where: {
          createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
          paymentStatus: 'PAID'
        },
        _sum: { totalAmount: true }
      })
    ]);

    return {
      totalUsers,
      totalStores,
      totalProducts,
      totalOrders,
      recentOrders,
      monthlyRevenue: monthlyRevenue._sum.totalAmount || 0
    };
  });

  cache.set(cacheKey, stats, 300000); // Cache 5 minutes
  return stats;
}

// Requêtes optimisées pour le site public
export async function getOptimizedPublicData() {
  const cacheKey = 'public-data';
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const data = await prisma.$transaction(async (tx) => {
    const [categories, featuredStores, trendingProducts] = await Promise.all([
      tx.category.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          image: true,
          _count: { select: { products: true } }
        },
        orderBy: { name: 'asc' }
      }),
      tx.store.findMany({
        where: { isLive: true },
        select: {
          id: true,
          name: true,
          slug: true,
          rating: true,
          _count: { select: { products: true } }
        },
        orderBy: { totalSales: 'desc' },
        take: 5
      }),
      tx.product.findMany({
        where: { isActive: true, stock: { gt: 0 } },
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          images: true,
          rating: true,
          store: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
    ]);

    return { categories, featuredStores, trendingProducts };
  });

  cache.set(cacheKey, data, 600000); // Cache 10 minutes
  return data;
}

// Pagination optimisée
export function createPaginationQuery(page: number, limit: number) {
  const skip = (page - 1) * limit;
  return { skip, take: limit };
}

// Monitoring des performances
export class PerformanceMonitor {
  private static metrics = new Map<string, number[]>();

  static startTimer(operation: string): () => void {
    const start = Date.now();
    return () => {
      const duration = Date.now() - start;
      this.recordMetric(operation, duration);
    };
  }

  private static recordMetric(operation: string, duration: number) {
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, []);
    }
    
    const metrics = this.metrics.get(operation)!;
    metrics.push(duration);
    
    // Garder seulement les 100 dernières mesures
    if (metrics.length > 100) {
      metrics.shift();
    }
  }

  static getMetrics() {
    const result: Record<string, any> = {};
    
    for (const [operation, durations] of this.metrics.entries()) {
      const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
      const max = Math.max(...durations);
      const min = Math.min(...durations);
      
      result[operation] = { avg, max, min, count: durations.length };
    }
    
    return result;
  }
}

// Middleware de monitoring
export function withPerformanceMonitoring<T extends (...args: any[]) => any>(
  fn: T,
  operationName: string
): T {
  return ((...args: any[]) => {
    const endTimer = PerformanceMonitor.startTimer(operationName);
    try {
      const result = fn(...args);
      if (result instanceof Promise) {
        return result.finally(endTimer);
      }
      endTimer();
      return result;
    } catch (error) {
      endTimer();
      throw error;
    }
  }) as T;
}
