import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, otpEmailTemplate } from '@/lib/mail'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, phone, email, password, acceptedTerms } = body

    // Validation des données
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      )
    }

    // Vérifier que les conditions d'utilisation ont été acceptées
    if (!acceptedTerms) {
      return NextResponse.json(
        { error: 'Vous devez accepter les conditions d\'utilisation pour créer un compte' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      )
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          ...(phone ? [{ phone: phone }] : [])
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un compte existe déjà avec cet email ou ce numéro de téléphone' },
        { status: 409 }
      )
    }

    // Créer le nouvel utilisateur (non vérifié) dans la base de données
    const hashed = await bcrypt.hash(password, 10)
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        password: hashed,
        isVerified: false,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        avatar: true,
        createdAt: true,
        updatedAt: true
      }
    })
    
    // Générer et stocker un OTP de vérification (6 chiffres, expire dans 10 min)
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
    await prisma.otpToken.create({
      data: {
        email: newUser.email,
        code,
        type: 'REGISTER',
        expiresAt,
      },
    })

    // Envoyer l'email OTP
    await sendEmail(newUser.email, 'Hype Market • Vérifiez votre email', otpEmailTemplate(code, 'REGISTER'))
    
    return NextResponse.json({
      success: true,
      message: 'Inscription réussie. Un code de vérification a été envoyé à votre email.',
      user: newUser
    })

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error)
    
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'inscription' },
      { status: 500 }
    )
  }
}
