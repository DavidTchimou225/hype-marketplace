import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, otpEmailTemplate } from '@/lib/mail'


export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    if (!email) return NextResponse.json({ error: 'Email requis' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ success: true }) // do not leak

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    await prisma.otpToken.create({
      data: { email, code, type: 'RESET_PASSWORD', expiresAt },
    })

    await sendEmail(email, 'Hype Market • Réinitialisation de mot de passe', otpEmailTemplate(code, 'RESET_PASSWORD'))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('forgot-password error', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
