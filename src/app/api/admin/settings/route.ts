import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Récupérer tous les paramètres
export async function GET(request: NextRequest) {
  try {
    const settings = await prisma.settings.findMany({
      orderBy: { key: 'asc' }
    });

    return NextResponse.json({ settings });
  } catch (error: any) {
    console.error('Erreur GET settings:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des paramètres' },
      { status: 500 }
    );
  }
}

// POST - Créer ou mettre à jour un paramètre
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: 'Clé et valeur requises' },
        { status: 400 }
      );
    }

    // Upsert (créer ou mettre à jour)
    const setting = await prisma.settings.upsert({
      where: { key },
      update: { value, updatedAt: new Date() },
      create: { key, value }
    });

    return NextResponse.json({ setting });
  } catch (error: any) {
    console.error('Erreur POST settings:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde du paramètre' },
      { status: 500 }
    );
  }
}

// PATCH - Mettre à jour un paramètre
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: 'Clé et valeur requises' },
        { status: 400 }
      );
    }

    const setting = await prisma.settings.update({
      where: { key },
      data: { value, updatedAt: new Date() }
    });

    return NextResponse.json({ setting });
  } catch (error: any) {
    console.error('Erreur PATCH settings:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du paramètre' },
      { status: 500 }
    );
  }
}
