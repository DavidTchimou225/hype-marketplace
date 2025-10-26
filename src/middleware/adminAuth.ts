import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export interface AdminUser {
  userId: string;
  email: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
}

export function verifyAdminToken(request: NextRequest): AdminUser | null {
  try {
    const token = request.cookies.get('admin-token')?.value;
    
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'hype-market-secret-key'
    ) as any;

    // Vérifier que l'utilisateur est admin
    if (decoded.role !== 'ADMIN' && decoded.role !== 'SUPER_ADMIN') {
      return null;
    }

    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
  } catch (error) {
    return null;
  }
}

export function requireAdmin(request: NextRequest): AdminUser {
  const admin = verifyAdminToken(request);
  if (!admin) {
    throw new Error('Accès non autorisé');
  }
  return admin;
}
