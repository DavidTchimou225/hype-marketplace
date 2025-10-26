import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


// Public endpoint: list ongoing lives with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '8'), 24);
    const skip = (page - 1) * limit;

    const [lives, total] = await Promise.all([
      prisma.liveSession.findMany({
        where: { isLive: true },
        include: {
          store: { select: { id: true, name: true, slug: true, avatar: true } }
        },
        orderBy: { startedAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.liveSession.count({ where: { isLive: true } })
    ]);

    return NextResponse.json({
      lives,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erreur lors de la liste des lives:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
