import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Récupérer tous les produits tendances configurés
export async function GET(request: NextRequest) {
  try {
    const trending = await prisma.trendingProduct.findMany({
      include: {
        product: {
          include: {
            store: {
              select: {
                id: true,
                name: true,
                slug: true,
                avatar: true
              }
            },
            categories: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json({ trending });
  } catch (error: any) {
    console.error('Erreur GET trending:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des produits tendances' },
      { status: 500 }
    );
  }
}

// POST - Ajouter un produit aux tendances
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, order } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'ID produit requis' },
        { status: 400 }
      );
    }

    // Vérifier que le produit existe
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si déjà dans les tendances
    const existing = await prisma.trendingProduct.findFirst({
      where: { productId }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Ce produit est déjà dans les tendances' },
        { status: 400 }
      );
    }

    // Créer l'entrée trending
    const trending = await prisma.trendingProduct.create({
      data: {
        productId,
        order: order || 0,
        isActive: true
      },
      include: {
        product: {
          include: {
            store: { select: { name: true, slug: true } },
            categories: { select: { name: true } }
          }
        }
      }
    });

    return NextResponse.json({ trending });
  } catch (error: any) {
    console.error('Erreur POST trending:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout du produit tendance' },
      { status: 500 }
    );
  }
}

// DELETE - Retirer un produit des tendances
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID requis' },
        { status: 400 }
      );
    }

    await prisma.trendingProduct.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Produit retiré des tendances' });
  } catch (error: any) {
    console.error('Erreur DELETE trending:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    );
  }
}
