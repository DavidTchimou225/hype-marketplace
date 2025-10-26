import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const categorySlug = searchParams.get('category')
    const storeSlug = searchParams.get('store')
    const slug = searchParams.get('slug')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Essayer d'utiliser la base de données d'abord
    try {
      const where: any = {
        isActive: true,
      }
      
      if (id) {
        where.id = id
      }
      if (categorySlug) {
        where.categories = {
          some: { slug: categorySlug },
        }
      }
      
      if (storeSlug) {
        where.store = {
          slug: storeSlug,
        }
      }
      
      if (slug) {
        where.slug = slug
      }

      const products = await prisma.product.findMany({
        where,
        include: {
          store: true,
          // @ts-ignore - after running Prisma migrate/generate, 'categories' will exist on Product include
          categories: true,
          _count: {
            select: {
              reviews: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: id ? 1 : limit,
        skip: id ? 0 : offset,
      })

      const total = await prisma.product.count({ where })

      return NextResponse.json({
        products,
        total,
        hasMore: id ? false : offset + limit < total,
      })
    } catch (prismaError) {
      console.log('Erreur Prisma:', prismaError)
      return NextResponse.json(
        { error: 'Erreur de base de données' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des produits' },
      { status: 500 }
    )
  }
}
