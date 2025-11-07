import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, otpEmailTemplate } from '@/lib/mail'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, type = 'REGISTER' } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      )
    }

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Aucun compte trouvé avec cet email' },
        { status: 404 }
      )
    }

    // Si déjà vérifié, pas besoin de renvoyer
    if (user.isVerified) {
      return NextResponse.json(
        { error: 'Ce compte est déjà vérifié' },
        { status: 400 }
      )
    }

    // Générer un nouveau code OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Invalider les anciens tokens et créer un nouveau
    await prisma.$transaction([
      // Marquer les anciens tokens comme consommés
      prisma.otpToken.updateMany({
        where: {
          email,
          type,
          consumedAt: null
        },
        data: {
          consumedAt: new Date()
        }
      }),
      // Créer le nouveau token
      prisma.otpToken.create({
        data: {
          email,
          code,
          type,
          expiresAt,
        },
      })
    ])

    // Envoyer l'email OTP (ne pas bloquer si l'email échoue)
    let emailSent = false
    try {
      await sendEmail(email, 'Hype Market • Nouveau code de vérification', otpEmailTemplate(code, type as 'REGISTER' | 'RESET_PASSWORD'))
      emailSent = true
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email OTP:', emailError)
    }

    // En développement, inclure le code OTP dans la réponse
    const response: any = {
      success: true,
      message: emailSent 
        ? 'Un nouveau code de vérification a été envoyé à votre email.'
        : 'Code généré. Vérifiez la console pour le code OTP.',
    }

    if (process.env.NODE_ENV === 'development') {
      response.debug = { otpCode: code }
      console.log('🔑 NOUVEAU CODE OTP:', code)
    }

    return NextResponse.json(response)

  } catch (error: any) {
    console.error('Erreur lors du renvoi de l\'OTP:', error)
    
    return NextResponse.json(
      { error: 'Erreur serveur lors du renvoi du code' },
      { status: 500 }
    )
  }
}
