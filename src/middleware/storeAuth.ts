import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';


export async function verifyStoreToken(request: NextRequest) {
  try {
    const token = request.cookies.get('store-token')?.value;

    if (!token) {
      throw new Error('Token manquant');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'hype-market-secret-key') as any;
    
    const store = await prisma.store.findUnique({
      where: { id: decoded.storeId },
      select: {
        id: true,
        name: true,
        email: true,
        slug: true,
        isLive: true
      }
    });

    if (!store) {
      throw new Error('Boutique non trouvée');
    }

    return store;

  } catch (error) {
    throw new Error('Token invalide');
  }
}

export function requireStoreAuth(request: NextRequest) {
  return verifyStoreToken(request);
}
