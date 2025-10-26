import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { emailOrPhone, password } = body

    // Validation des données
    if (!emailOrPhone || !password) {
      return NextResponse.json(
        { error: 'Email/téléphone et mot de passe requis' },
        { status: 400 }
      )
    }

    // Chercher l'utilisateur dans la base de données
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrPhone },
          { phone: emailOrPhone }
        ]
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Email/téléphone ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    // Vérifier le mot de passe avec bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password)
    
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Email/téléphone ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    // Vérifier si le compte est vérifié
    if (!user.isVerified) {
      return NextResponse.json(
        { 
          error: 'Votre compte n\'est pas vérifié. Veuillez vérifier votre email avec le code OTP.',
          needsVerification: true,
          email: user.email
        },
        { status: 403 }
      )
    }

    // Retourner l'utilisateur connecté (sans le mot de passe)
    const { password: _, ...userWithoutPassword } = user
    
    return NextResponse.json({
      success: true,
      message: 'Connexion réussie',
      user: userWithoutPassword
    })

  } catch (error) {
    console.error('Erreur lors de la connexion:', error)
    
    return NextResponse.json(
      { error: 'Erreur serveur lors de la connexion' },
      { status: 500 }
    )
  }
}
