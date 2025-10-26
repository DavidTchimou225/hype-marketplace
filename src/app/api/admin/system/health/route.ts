import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/middleware/adminAuth';
import { validateDatabaseIntegrity, syncStoreStatistics, cleanupObsoleteData } from '@/lib/adminValidation';

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

    const [integrity, syncResult, cleanupResult] = await Promise.all([
      validateDatabaseIntegrity(),
      syncStoreStatistics(),
      cleanupObsoleteData()
    ]);

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks: {
        databaseIntegrity: integrity,
        statisticsSync: syncResult,
        dataCleanup: cleanupResult
      }
    });

  } catch (error) {
    console.error('Erreur lors du check de santé système:', error);
    return NextResponse.json(
      { 
        status: 'error',
        error: 'Erreur système critique',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
