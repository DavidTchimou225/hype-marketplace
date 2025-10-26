import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()
    if (!email || !code) {
      return NextResponse.json({ error: 'Email et code requis' }, { status: 400 })
    }

    const token = await prisma.otpToken.findFirst({
      where: {
        email,
        code,
        type: 'REGISTER',
        consumedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!token) {
      return NextResponse.json({ error: 'Code invalide ou expiré' }, { status: 400 })
    }

    // Mark token consumed and verify user
    await prisma.$transaction([
      prisma.otpToken.update({ where: { id: token.id }, data: { consumedAt: new Date() } }),
      prisma.user.update({ where: { email }, data: { isVerified: true } }),
    ])

    return NextResponse.json({ success: true, message: 'Email vérifié' })
  } catch (error) {
    console.error('verify-otp error', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
