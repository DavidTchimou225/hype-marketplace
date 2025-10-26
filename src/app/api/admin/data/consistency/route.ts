import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/middleware/adminAuth';
import { validateDataConsistency, fixDataInconsistencies } from '@/lib/dataConsistency';

export async function GET(request: NextRequest) {
  try {
    try {
      requireAdmin(request);
    } catch (error) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 401 }
      );
    }

    const validation = await validateDataConsistency();
    return NextResponse.json(validation);

  } catch (error) {
    console.error('Erreur lors de la vérification de cohérence:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    try {
      requireAdmin(request);
    } catch (error) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 401 }
      );
    }

    const { autoFix } = await request.json();
    
    if (autoFix) {
      const fixes = await fixDataInconsistencies();
      return NextResponse.json(fixes);
    }

    return NextResponse.json({ error: 'Action non spécifiée' }, { status: 400 });

  } catch (error) {
    console.error('Erreur lors de la vérification de cohérence:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
