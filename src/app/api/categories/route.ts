import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const total = await prisma.category.count()

    const cats = await prisma.category.findMany({
      take: limit,
      skip: offset,
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { products: true } },
        products: { select: { storeId: true } },
      },
    })

    const categories = cats.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description || '',
      icon: c.image, // map to expected field name (image URL)
      _count: { products: c._count.products },
      storesCount: new Set(c.products.map((p) => p.storeId)).size,
    }))

    return NextResponse.json({
      categories,
      total,
      hasMore: offset + limit < total,
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des catégories' },
      { status: 500 }
    )
  }
}
