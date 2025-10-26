import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'ID utilisateur requis' },
        { status: 400 }
      )
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            store: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const total = cartItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity)
    }, 0)

    return NextResponse.json({ 
      items: cartItems,
      total,
      count: cartItems.length 
    })
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du panier' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, productId, quantity, color, size } = body

    // Vérifier si le produit existe et est disponible
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Produit introuvable' },
        { status: 404 }
      )
    }

    if (!product.isActive) {
      return NextResponse.json(
        { error: 'Produit non disponible' },
        { status: 400 }
      )
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: 'Stock insuffisant' },
        { status: 400 }
      )
    }

    // Vérifier si l'article existe déjà dans le panier
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId_color_size: {
          userId,
          productId,
          color: color || '',
          size: size || '',
        },
      },
    })

    let cartItem

    if (existingItem) {
      // Mettre à jour la quantité
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
        include: {
          product: {
            include: {
              store: true,
            },
          },
        },
      })
    } else {
      // Créer un nouvel article
      cartItem = await prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity,
          color,
          size,
        },
        include: {
          product: {
            include: {
              store: true,
            },
          },
        },
      })
    }

    return NextResponse.json({ cartItem })
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout au panier' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { cartItemId, quantity } = body

    if (quantity <= 0) {
      // Supprimer l'article si la quantité est 0
      await prisma.cartItem.delete({
        where: { id: cartItemId },
      })
      return NextResponse.json({ message: 'Article supprimé du panier' })
    }

    const cartItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: {
        product: {
          include: {
            store: true,
          },
        },
      },
    })

    return NextResponse.json({ cartItem })
  } catch (error) {
    console.error('Error updating cart item:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du panier' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cartItemId = searchParams.get('cartItemId')
    const userId = searchParams.get('userId')

    if (cartItemId) {
      await prisma.cartItem.delete({
        where: { id: cartItemId },
      })
      return NextResponse.json({ message: 'Article supprimé du panier' })
    }

    if (userId) {
      await prisma.cartItem.deleteMany({
        where: { userId },
      })
      return NextResponse.json({ message: 'Panier vidé' })
    }

    return NextResponse.json(
      { error: 'ID requis' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error deleting cart item:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
}
