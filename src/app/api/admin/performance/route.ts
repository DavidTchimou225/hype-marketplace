import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/middleware/adminAuth';
import { PerformanceMonitor } from '@/lib/performance';

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

    const metrics = PerformanceMonitor.getMetrics();
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      metrics,
      summary: {
        totalOperations: Object.keys(metrics).length,
        avgResponseTime: Object.values(metrics).reduce((acc: number, metric: any) => acc + metric.avg, 0) / Object.keys(metrics).length || 0
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des métriques:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
