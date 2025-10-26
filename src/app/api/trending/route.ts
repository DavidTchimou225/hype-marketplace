import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Algorithme intelligent de calcul du score de tendance
function calculateTrendingScore(product: any): number {
  // Pondérations pour chaque métrique
  const weights = {
    views: 1,        // 1 point par vue
    cartAdds: 10,    // 10 points par ajout panier
    purchases: 50,   // 50 points par achat
    rating: 20,      // 20 points max pour la note
    reviews: 5,      // 5 points par avis
    newness: 30,     // 30 points max pour la nouveauté
    stock: 10        // 10 points max si en stock
  };

  // Score de base
  let score = 0;

  // Vues (limité à 1000 pour éviter domination)
  score += Math.min(product.viewCount || 0, 1000) * weights.views;

  // Ajouts au panier
  score += (product.cartAddCount || 0) * weights.cartAdds;

  // Achats (meilleure métrique de conversion)
  score += (product.purchaseCount || 0) * weights.purchases;

  // Note produit (0-5 étoiles)
  score += (product.rating || 0) * weights.rating;

  // Nombre d'avis (preuve sociale)
  score += (product.reviewCount || 0) * weights.reviews;

  // Nouveauté (produits récents = boost)
  const ageInDays = (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24);
  if (ageInDays <= 7) {
    score += weights.newness; // Nouveau produit (dernière semaine)
  } else if (ageInDays <= 30) {
    score += weights.newness * 0.5; // Produit récent (dernier mois)
  }

  // Stock disponible (pénalité si rupture)
  if (product.stock > 0) {
    score += weights.stock;
  } else {
    score *= 0.5; // Réduction 50% si rupture de stock
  }

  // Facteur aléatoire (10% du score pour varier)
  score += score * 0.1 * Math.random();

  return score;
}

// GET - Récupérer les produits tendances calculés intelligemment
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    // Récupérer tous les produits actifs
    const allProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        stock: { gt: 0 } // Au moins en stock
      },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            slug: true,
            avatar: true,
            rating: true
          }
        },
        categories: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    });

    // Calculer le score pour chaque produit
    const productsWithScores = allProducts.map(product => ({
      ...product,
      trendingScore: calculateTrendingScore(product)
    }));

    // Trier par score décroissant
    productsWithScores.sort((a, b) => b.trendingScore - a.trendingScore);

    // Prendre le top N
    const topProducts = productsWithScores.slice(0, limit);

    // Mélanger légèrement le top (70% meilleurs + 30% aléatoire pour variété)
    const topCount = Math.ceil(limit * 0.7);
    const randomCount = limit - topCount;

    const guaranteed = topProducts.slice(0, topCount);
    const candidates = topProducts.slice(topCount, Math.min(limit * 2, topProducts.length));
    const random = candidates
      .sort(() => Math.random() - 0.5)
      .slice(0, randomCount);

    const finalProducts = [...guaranteed, ...random]
      .sort(() => Math.random() - 0.5); // Mélanger l'ordre final

    // Retirer le score (interne seulement)
    const products = finalProducts.map(({ trendingScore, ...product }) => product);

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error('Erreur GET trending:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des produits tendances' },
      { status: 500 }
    );
  }
}
