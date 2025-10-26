import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/middleware/adminAuth';

// PATCH - Modifier une bannière
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    requireAdmin(request);

    const body = await request.json();
    const { title, description, image, link, order, isActive } = body;

    // Si on active une bannière, vérifier la limite
    if (isActive) {
      const activeBannersCount = await prisma.banner.count({
        where: { 
          isActive: true,
          id: { not: params.id }
        }
      });

      if (activeBannersCount >= 5) {
        return NextResponse.json(
          { error: 'Vous ne pouvez pas avoir plus de 5 bannières actives' },
          { status: 400 }
        );
      }
    }

    const banner = await prisma.banner.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(image && { image }),
        ...(link !== undefined && { link }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive })
      }
    });

    return NextResponse.json({ banner });
  } catch (error) {
    console.error('Erreur lors de la modification de la bannière:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la modification de la bannière' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une bannière
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    requireAdmin(request);

    await prisma.banner.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression de la bannière:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la bannière' },
      { status: 500 }
    );
  }
}
