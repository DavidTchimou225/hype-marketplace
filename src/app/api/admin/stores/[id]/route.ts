import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/middleware/adminAuth';


export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    try {
      requireAdmin(request);
    } catch (error) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 401 }
      );
    }

    const { isLive, name, description, avatar } = await request.json();
    const storeId = params.id;

    const updateData: any = {};
    if (typeof isLive === 'boolean') updateData.isLive = isLive;
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (avatar !== undefined) updateData.avatar = avatar;

    const store = await prisma.store.update({
      where: { id: storeId },
      data: updateData
    });

    return NextResponse.json(store);

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la boutique:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    try {
      requireAdmin(request);
    } catch (error) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 401 }
      );
    }

    const storeId = params.id;

    await prisma.store.delete({
      where: { id: storeId }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Erreur lors de la suppression de la boutique:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
