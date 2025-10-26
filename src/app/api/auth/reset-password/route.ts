import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


export async function POST(request: NextRequest) {
  try {
    const { email, code, newPassword } = await request.json()
    if (!email || !code || !newPassword) {
      return NextResponse.json({ error: 'Email, code et nouveau mot de passe requis' }, { status: 400 })
    }

    if (String(newPassword).length < 6) {
      return NextResponse.json({ error: 'Le mot de passe doit contenir au moins 6 caractères' }, { status: 400 })
    }

    const token = await prisma.otpToken.findFirst({
      where: {
        email,
        code,
        type: 'RESET_PASSWORD',
        consumedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!token) {
      return NextResponse.json({ error: 'Code invalide ou expiré' }, { status: 400 })
    }

    await prisma.$transaction([
      prisma.user.update({ where: { email }, data: { password: newPassword } }), // TODO: hash in production
      prisma.otpToken.update({ where: { id: token.id }, data: { consumedAt: new Date() } }),
    ])

    return NextResponse.json({ success: true, message: 'Mot de passe réinitialisé' })
  } catch (error) {
    console.error('reset-password error', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
