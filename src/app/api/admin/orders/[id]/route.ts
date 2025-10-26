import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/middleware/adminAuth';


export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    try {
      requireAdmin(request);
    } catch (error) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 401 }
      );
    }

    const { status, paymentStatus, notes } = await request.json();
    const orderId = params.id;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (notes !== undefined) updateData.notes = notes;
    updateData.updatedAt = new Date();

    const order = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                stock: true
              }
            }
          }
        }
      }
    });

    // Si la commande est confirmée, décrémenter le stock
    if (status === 'CONFIRMED' && order.status !== 'CONFIRMED') {
      for (const item of order.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }
    }

    // Si la commande est annulée, remettre le stock
    if (status === 'CANCELLED' && order.status !== 'CANCELLED') {
      for (const item of order.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity
            }
          }
        });
      }
    }

    // Si la commande est livrée, mettre à jour les statistiques
    if (status === 'DELIVERED' && order.status !== 'DELIVERED') {
      // Récupérer tous les storeIds uniques de la commande
      const storeIds = [...new Set(order.items.map(item => item.storeId))];
      
      // Mettre à jour les stats de chaque boutique concernée
      for (const storeId of storeIds) {
        await prisma.store.update({
          where: { id: storeId },
          data: {
            totalSales: {
              increment: 1 // Incrémenter le nombre de ventes
            }
          }
        });
      }
      
      // Mettre à jour le statut de paiement si la commande est livrée
      if (!paymentStatus) {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: 'PAID'
          }
        });
      }
    }

    return NextResponse.json(order);

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la commande:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    try {
      requireAdmin(request);
    } catch (error) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 401 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        address: true,
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
                price: true
              }
            },
            store: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);

  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
