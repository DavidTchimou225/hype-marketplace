// Vérification de la cohérence des données entre admin et site public
import { prisma } from '@/lib/prisma';


export async function validateDataConsistency() {
  try {
    const issues = [];

    // 1. Vérifier que tous les produits affichés publiquement existent et sont actifs
    const publicProducts = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        store: true,
        categories: true
      }
    });

    for (const product of publicProducts) {
      if (!product.store) {
        issues.push(`Produit ${product.id} sans boutique associée`);
      }
      if (product.categories.length === 0) {
        issues.push(`Produit ${product.id} sans catégorie associée`);
      }
      if (product.price <= 0) {
        issues.push(`Produit ${product.id} avec prix invalide: ${product.price}`);
      }
      if (product.stock < 0) {
        issues.push(`Produit ${product.id} avec stock négatif: ${product.stock}`);
      }
    }

    // 2. Vérifier que toutes les boutiques "en live" ont des produits
    const liveStores = await prisma.store.findMany({
      where: { isLive: true },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    for (const store of liveStores) {
      if (store._count.products === 0) {
        issues.push(`Boutique en live ${store.name} sans produits`);
      }
    }

    // 3. Vérifier la cohérence des commandes
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    for (const order of orders) {
      let calculatedTotal = 0;
      for (const item of order.items) {
        if (!item.product) {
          issues.push(`Article de commande ${order.orderNumber} référence un produit supprimé`);
        }
        calculatedTotal += item.price * item.quantity;
      }
      
      if (Math.abs(calculatedTotal - order.totalAmount) > 1) {
        issues.push(`Commande ${order.orderNumber} total incohérent: calculé ${calculatedTotal}, enregistré ${order.totalAmount}`);
      }
    }

    // 4. Vérifier les catégories orphelines
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    for (const category of categories) {
      if (category._count.products === 0) {
        issues.push(`Catégorie ${category.name} sans produits`);
      }
    }

    return {
      isConsistent: issues.length === 0,
      issues,
      checkedProducts: publicProducts.length,
      checkedStores: liveStores.length,
      checkedOrders: orders.length,
      checkedCategories: categories.length
    };

  } catch (error) {
    console.error('Erreur lors de la vérification de cohérence:', error);
    throw error;
  }
}

export async function fixDataInconsistencies() {
  try {
    const fixes = [];

    // 1. Désactiver les produits sans boutique ou catégorie
    const orphanedProducts = await prisma.product.updateMany({
      where: {
        categories: {
          none: {}
        }
      },
      data: { isActive: false }
    });
    if (orphanedProducts.count > 0) {
      fixes.push(`${orphanedProducts.count} produits orphelins désactivés`);
    }

    // 2. Mettre hors ligne les boutiques sans produits
    const emptyStores = await prisma.store.updateMany({
      where: {
        isLive: true,
        products: {
          none: {
            isActive: true
          }
        }
      },
      data: { isLive: false }
    });
    if (emptyStores.count > 0) {
      fixes.push(`${emptyStores.count} boutiques vides mises hors ligne`);
    }

    // 3. Corriger les stocks négatifs
    const negativeStocks = await prisma.product.updateMany({
      where: { stock: { lt: 0 } },
      data: { stock: 0 }
    });
    if (negativeStocks.count > 0) {
      fixes.push(`${negativeStocks.count} stocks négatifs corrigés`);
    }

    return {
      applied: fixes.length > 0,
      fixes
    };

  } catch (error) {
    console.error('Erreur lors de la correction des incohérences:', error);
    throw error;
  }
}
