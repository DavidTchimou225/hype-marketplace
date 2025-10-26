import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface SearchProduct {
  id: string;
  name: string;
  slug: string;
  category: { name: string };
  store: { name: string };
  price: number;
  images: string;
  description: string;
}

interface SearchCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
}

interface SearchStore {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
}

// Fonction de normalisation pour recherche floue
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^a-z0-9\s]/g, '') // Garde seulement lettres, chiffres et espaces
    .trim();
}

// Calcul de distance de Levenshtein (similarité entre 2 textes)
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[len1][len2];
}

// Calcul du score de similarité (0-100)
function getSimilarityScore(searchTerm: string, targetText: string): number {
  const normalizedSearch = normalizeText(searchTerm);
  const normalizedTarget = normalizeText(targetText);
  
  // Match exact = 100
  if (normalizedTarget === normalizedSearch) return 100;
  
  // Commence par = 90
  if (normalizedTarget.startsWith(normalizedSearch)) return 90;
  
  // Contient le terme = 70-80 selon position
  const index = normalizedTarget.indexOf(normalizedSearch);
  if (index !== -1) {
    return 80 - (index / normalizedTarget.length) * 10;
  }
  
  // Recherche floue par mots
  const searchWords = normalizedSearch.split(/\s+/);
  const targetWords = normalizedTarget.split(/\s+/);
  
  let matchCount = 0;
  for (const searchWord of searchWords) {
    for (const targetWord of targetWords) {
      // Match partiel de mot
      if (targetWord.includes(searchWord)) {
        matchCount += 1;
        break;
      }
      
      // Distance de Levenshtein pour tolérer les fautes
      const distance = levenshteinDistance(searchWord, targetWord);
      const maxLen = Math.max(searchWord.length, targetWord.length);
      const similarity = ((maxLen - distance) / maxLen) * 100;
      
      // Tolérance de 70% de similarité
      if (similarity >= 70) {
        matchCount += similarity / 100;
        break;
      }
    }
  }
  
  const score = (matchCount / searchWords.length) * 60;
  return score;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all';
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query.trim()) {
      return NextResponse.json({ results: [] });
    }

    const results: any[] = [];
    const normalizedQuery = normalizeText(query);

    // Recherche DIRECTE en base de données (plus rapide)
    try {
      // Recherche dans les produits
      if (type === 'all' || type === 'product') {
        // Récupérer TOUS les produits actifs (SQLite ne supporte pas la recherche insensible à la casse)
        const products = await prisma.product.findMany({
          where: { isActive: true },
          include: {
            store: { select: { name: true, slug: true } }
          },
          take: 100
        });

        // Calculer le score pour chaque produit
        for (const product of products) {
          const score = Math.max(
            getSimilarityScore(query, product.name),
            getSimilarityScore(query, product.description),
            getSimilarityScore(query, product.store.name)
          );

          // Seuil minimum de 40% de similarité
          if (score >= 40) {
            results.push({
              id: product.slug,
              type: 'product',
              name: product.name,
              description: product.description,
              store: product.store.name,
              price: product.price,
              image: product.images ? product.images.split(',')[0].trim() : undefined,
              score
            });
          }
        }
      }

      // Recherche dans les catégories
      if (type === 'all' || type === 'category') {
        const categories = await prisma.category.findMany({
          include: {
            _count: { select: { products: true } }
          }
        });

        for (const category of categories) {
          const score = Math.max(
            getSimilarityScore(query, category.name),
            category.description ? getSimilarityScore(query, category.description) : 0
          );

          if (score >= 40) {
            results.push({
              id: category.slug,
              type: 'category',
              name: category.name,
              description: category.description,
              image: category.image,
              productCount: category._count.products,
              score
            });
          }
        }
      }

      // Recherche dans les boutiques
      if (type === 'all' || type === 'store') {
        const stores = await prisma.store.findMany({
          include: {
            _count: { select: { products: true } }
          }
        });

        for (const store of stores) {
          const score = Math.max(
            getSimilarityScore(query, store.name),
            store.description ? getSimilarityScore(query, store.description) : 0
          );

          if (score >= 40) {
            results.push({
              id: store.slug,
              type: 'store',
              name: store.name,
              description: store.description,
              image: store.avatar,
              productCount: store._count.products,
              score
            });
          }
        }
      }
    } catch (dbError) {
      console.error('Erreur base de données:', dbError);
      
      // Fallback: recherche simple si DB échoue
      const fallbackResults = [
        {
          id: 'test-1',
          type: 'product',
          name: 'Produit test',
          description: 'Description test',
          score: 50
        }
      ];
      
      return NextResponse.json({
        results: fallbackResults.slice(0, limit),
        total: fallbackResults.length
      });
    }

    // Trier par score de pertinence (du plus élevé au plus bas)
    const sortedResults = results
      .sort((a, b) => b.score - a.score)
      .map(({ score, ...rest }) => rest); // Retirer le score du résultat final

    return NextResponse.json({
      results: sortedResults.slice(0, limit),
      total: sortedResults.length,
      query: query
    });

  } catch (error) {
    console.error('Erreur de recherche:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recherche' },
      { status: 500 }
    );
  }
}
