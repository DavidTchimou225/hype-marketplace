import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Bannières actives pour le carrousel public
export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      take: 5
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
