import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation des données d'entrée
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Aucun article dans la commande' },
        { status: 400 }
      )
    }

    if (!body.shippingAddress) {
      return NextResponse.json(
        { error: 'Adresse de livraison manquante' },
        { status: 400 }
      )
    }

    const { items, paymentMethod = 'mobile_money', shippingAddress } = body

    console.log('Processing order with', items.length, 'items')

    // Vérifier que tous les produits existent et calculer le total
    let totalAmount = 0
    type ValidatedItem = {
      productId: string
      storeId: string
      quantity: number
      price: number
      color: string | null
      size: string | null
      product: any
    }
    const validatedItems: ValidatedItem[] = []

    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return NextResponse.json(
          { error: 'Données d\'article invalides' },
          { status: 400 }
        )
      }

      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { store: true },
      })

      if (!product) {
        return NextResponse.json(
          { error: `Produit ${item.productId} introuvable` },
          { status: 404 }
        )
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuffisant pour ${product.name}. Stock disponible: ${product.stock}` },
          { status: 400 }
        )
      }

      const itemTotal = product.price * item.quantity
      totalAmount += itemTotal

      validatedItems.push({
        productId: item.productId,
        storeId: product.storeId,
        quantity: item.quantity,
        price: product.price,
        color: item.color || null,
        size: item.size || null,
        product: product
      })
    }

    // Utiliser l'utilisateur fourni si présent ou créer un utilisateur temporaire
    let user = null as any
    if (body.userId) {
      user = await prisma.user.findUnique({ where: { id: body.userId } })
    }
    if (!user) {
      user = await prisma.user.findUnique({ where: { id: 'test-user-id' } })
    }

    if (!user) {
      // Essayer de trouver un utilisateur existant par email ou phone
      if (shippingAddress.email) {
        user = await prisma.user.findUnique({
          where: { email: shippingAddress.email },
        })
      }
      
      if (!user && shippingAddress.phone) {
        user = await prisma.user.findUnique({
          where: { phone: shippingAddress.phone },
        })
      }
      
      // Si aucun utilisateur trouvé, créer un utilisateur temporaire
      if (!user) {
        const timestamp = Date.now()
        const tempEmail = `temp-${timestamp}@hype-market.com`
        const tempPhone = shippingAddress.phone ? null : `temp-${timestamp}`
        
        try {
          user = await prisma.user.create({
            data: {
              email: tempEmail,
              firstName: shippingAddress.firstName || 'Client',
              lastName: shippingAddress.lastName || 'Temporaire',
              phone: tempPhone,
              password: 'TEMP_PASS',
            },
          })
        } catch (createError) {
          // Si la création échoue encore, utiliser un fallback sans phone
          user = await prisma.user.create({
            data: {
              email: `fallback-${timestamp}@hype-market.com`,
              firstName: shippingAddress.firstName || 'Client',
              lastName: shippingAddress.lastName || 'Temporaire',
              phone: null,
              password: 'TEMP_PASS',
            },
          })
        }
      }
    }

    // Créer l'adresse de livraison
    const address = await prisma.address.create({
      data: {
        userId: user.id,
        firstName: shippingAddress.firstName || 'Client',
        lastName: shippingAddress.lastName || 'Temporaire',
        address: shippingAddress.address || 'Adresse non spécifiée',
        city: shippingAddress.city || 'Abidjan',
        phone: shippingAddress.phone || '0000000000',
        isDefault: false,
      },
    })

    // Générer un numéro de commande unique
    const orderNumber = `HM${Date.now()}${Math.floor(Math.random() * 1000)}`

    // Créer la commande avec transaction
    const order = await prisma.$transaction(async (tx) => {
      // Créer la commande
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: user.id,
          addressId: address.id,
          totalAmount,
          shippingCost: 200000, // 2,000 FCFA
          paymentMethod,
          status: 'PENDING',
          paymentStatus: 'PENDING',
        },
      })

      // Créer les items de commande
      const orderItems = []
      for (const item of validatedItems) {
        const orderItem = await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            storeId: item.storeId,
            quantity: item.quantity,
            price: item.price,
            color: item.color,
            size: item.size,
          },
        })
        orderItems.push(orderItem)

        // Mettre à jour le stock
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })
      }

      // Récupérer la commande complète
      return await tx.order.findUnique({
        where: { id: newOrder.id },
        include: {
          items: {
            include: {
              product: true,
              store: true,
            },
          },
          address: true,
          user: true,
        },
      })
    })

    console.log('Order created successfully:', order?.orderNumber)
    return NextResponse.json({ 
      success: true,
      order: order,
      message: 'Commande créée avec succès'
    })
    
  } catch (error) {
    console.error('Error creating order:', error)
    
    // Log détaillé pour debug
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Erreur lors de la création de la commande',
        details: process.env.NODE_ENV === 'development' 
          ? (error instanceof Error ? error.message : 'Erreur inconnue')
          : 'Erreur serveur'
      },
      { status: 500 }
    )
  }
}

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

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
            store: true,
          },
        },
        address: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commandes' },
      { status: 500 }
    )
  }
}
