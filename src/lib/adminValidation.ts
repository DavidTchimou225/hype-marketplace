// Validation et sécurité pour l'administration
import { prisma } from '@/lib/prisma';


// Validation des données critiques
export async function validateDatabaseIntegrity() {
  try {
    // Vérifier la cohérence des données
    const checks = await Promise.all([
      // Vérifier les prix négatifs
      prisma.product.count({
        where: {
          price: {
            lt: 0
          }
        }
      }),
      
      // Vérifier les stocks négatifs
      prisma.product.count({
        where: {
          stock: {
            lt: 0
          }
        }
      })
    ]);

    return {
      negativePrice: checks[0],
      negativeStock: checks[1],
      isValid: checks.every(count => count === 0)
    };
  } catch (error) {
    console.error('Erreur lors de la validation de la base de données:', error);
    throw error;
  }
}

// Synchronisation des statistiques
export async function syncStoreStatistics() {
  try {
    const stores = await prisma.store.findMany({
      include: {
        products: true
      }
    });

    for (const store of stores) {
      const productCount = store.products.length;
      
      await prisma.store.update({
        where: { id: store.id },
        data: {
          // Mise à jour des statistiques si nécessaire
        }
      });
    }

    return { updated: stores.length };
  } catch (error) {
    console.error('Erreur lors de la synchronisation des statistiques:', error);
    throw error;
  }
}

// Nettoyage des données obsolètes
export async function cleanupObsoleteData() {
  try {
    // Supprimer les paniers abandonnés (plus de 30 jours)
    const oldCarts = await prisma.cartItem.deleteMany({
      where: {
        createdAt: {
          lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    });

    // Supprimer les commandes annulées anciennes (plus de 90 jours)
    const oldCancelledOrders = await prisma.order.deleteMany({
      where: {
        status: 'CANCELLED',
        createdAt: {
          lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
        }
      }
    });

    return {
      deletedCartItems: oldCarts.count,
      deletedOrders: oldCancelledOrders.count
    };
  } catch (error) {
    console.error('Erreur lors du nettoyage:', error);
    throw error;
  }
}
