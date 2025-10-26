import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyStoreToken } from '@/middleware/storeAuth';


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const store = await verifyStoreToken(request);
    if (!store) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 401 }
      );
    }

    const product = await prisma.product.findFirst({
      where: { 
        id: params.id,
        storeId: store.id
      },
      include: {
        categories: true,
        store: true
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);

  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const store = await verifyStoreToken(request);
    if (!store) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 401 }
      );
    }

    const productId = params.id;
    const data = await request.json();

    // Convertir le prix en centimes si fourni
    if (data.price) {
      data.price = Math.round(data.price * 100);
    }

    // Convertir les tableaux en chaînes si nécessaire
    if (data.images && Array.isArray(data.images)) {
      data.images = data.images.join(',');
    }
    if (data.colors && Array.isArray(data.colors)) {
      data.colors = data.colors.join(',');
    }
    if (data.sizes && Array.isArray(data.sizes)) {
      data.sizes = data.sizes.join(',');
    }

    const product = await prisma.product.update({
      where: { 
        id: productId,
        storeId: store.id
      },
      data,
      include: {
        categories: true,
        store: true
      }
    });

    return NextResponse.json({ product });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du produit' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const store = await verifyStoreToken(request);
    if (!store) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 401 }
      );
    }

    const productId = params.id;

    await prisma.product.delete({
      where: { 
        id: productId,
        storeId: store.id
      }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du produit' },
      { status: 500 }
    );
  }
}
