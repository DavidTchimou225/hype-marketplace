import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/middleware/adminAuth';

// GET - Liste des bannières
export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    const banners = await prisma.banner.findMany({
      orderBy: { order: 'asc' }
    });

    return NextResponse.json({ banners });
  } catch (error) {
    console.error('Erreur lors du chargement des bannières:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des bannières' },
      { status: 500 }
    );
  }
}

// POST - Créer une bannière
export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/admin/banners - début');
    
    try {
      requireAdmin(request);
    } catch (authError) {
      console.error('Erreur auth:', authError);
      return NextResponse.json(
        { error: 'Non autorisé - Veuillez vous reconnecter' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('Body reçu:', body);
    const { title, description, image, link, order, isActive } = body;
    
    if (!title || !image) {
      console.log('Validation échouée - titre ou image manquant');
      return NextResponse.json(
        { error: 'Le titre et l\'image sont obligatoires' },
        { status: 400 }
      );
    }

    // Vérifier le nombre de bannières actives
    const activeBannersCount = await prisma.banner.count({
      where: { isActive: true }
    });

    if (activeBannersCount >= 5 && isActive) {
      return NextResponse.json(
        { error: 'Vous ne pouvez pas avoir plus de 5 bannières actives' },
        { status: 400 }
      );
    }

    const banner = await prisma.banner.create({
      data: {
        title,
        description: description || null,
        image,
        link: link || null,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    return NextResponse.json({ banner }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la bannière:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la bannière' },
      { status: 500 }
    );
  }
}
