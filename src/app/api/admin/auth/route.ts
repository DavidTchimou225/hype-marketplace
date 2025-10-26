import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Bootstrap: s'il n'existe aucun admin, en créer un par défaut
    const adminCount = await prisma.user.count({ where: { OR: [{ role: 'ADMIN' }, { role: 'SUPER_ADMIN' }] } });
    if (adminCount === 0) {
      const bootstrapEmail = process.env.ADMIN_EMAIL || 'admin@hypemarket.ci';
      const bootstrapPassword = process.env.ADMIN_PASSWORD || 'HypeAdmin2024!';
      const hash = await bcrypt.hash(bootstrapPassword, 10);
      try {
        await prisma.user.create({
          data: {
            email: bootstrapEmail,
            firstName: 'Admin',
            lastName: 'Hype',
            password: hash,
            role: 'SUPER_ADMIN'
          }
        });
      } catch (e) {
        // ignore unique violations
      }
    }

    // Vérifier si l'utilisateur existe et est admin
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        password: true,
        role: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    // Vérifier si l'utilisateur est admin
    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    // Créer le token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'hype-market-secret-key',
      { expiresIn: '24h' }
    );

    // Créer la réponse avec le cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });

    // Définir le cookie avec le token
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 // 24 heures
    });

    return response;

  } catch (error) {
    console.error('Erreur d\'authentification admin:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  // Déconnexion - supprimer le cookie
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin-token');
  return response;
}
