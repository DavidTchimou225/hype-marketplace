import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Récupérer un paramètre public par clé
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json(
        { error: 'Clé requise' },
        { status: 400 }
      );
    }

    const setting = await prisma.settings.findUnique({
      where: { key }
    });

    if (!setting) {
      return NextResponse.json(
        { error: 'Paramètre non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      key: setting.key, 
      value: setting.value 
    });
  } catch (error: any) {
    console.error('Erreur GET settings:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du paramètre' },
      { status: 500 }
    );
  }
}
