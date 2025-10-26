import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const liveOnly = searchParams.get('live') === 'true'
    const slug = searchParams.get('slug') || undefined
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = { }
    if (slug) where.slug = slug

    // If liveOnly, join with LiveSession to check isLive
    let stores
    let total
    if (liveOnly) {
      const [rows, count] = await Promise.all([
        prisma.store.findMany({
          where: {
            ...where,
            liveSessions: { some: { isLive: true } }
          },
          include: { _count: { select: { products: true } }, liveSessions: { where: { isLive: true }, select: { id: true } } },
          orderBy: { createdAt: 'desc' },
          skip: offset,
          take: limit
        }),
        prisma.store.count({ where: { ...where, liveSessions: { some: { isLive: true } } } })
      ])
      stores = rows
      total = count
    } else {
      const [rows, count] = await Promise.all([
        prisma.store.findMany({
          where,
          include: { _count: { select: { products: true } }, liveSessions: { where: { isLive: true }, select: { id: true } } },
          orderBy: { createdAt: 'desc' },
          skip: offset,
          take: limit
        }),
        prisma.store.count({ where })
      ])
      stores = rows
      total = count
    }

    return NextResponse.json({
      stores,
      total,
      hasMore: offset + limit < total
    })
  } catch (error) {
    console.error('Error fetching stores:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des boutiques' },
      { status: 500 }
    )
  }
}
