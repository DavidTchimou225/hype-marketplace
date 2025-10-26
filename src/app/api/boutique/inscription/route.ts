import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { verifyOTP } from '../../auth/send-otp/route';


export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    // Validate required fields (nouveaux champs simplifiés)
    const required = [
      'ownerFullName', 'email', 'phone', 'address', 'storeName'
    ];
    for (const key of required) {
      if (!formData[key]) {
        return NextResponse.json({ error: `Champ requis manquant: ${key}` }, { status: 400 });
      }
    }

    // Password validation
    if (!formData.password || typeof formData.password !== 'string' || formData.password.length < 6) {
      return NextResponse.json({ error: 'Mot de passe requis (min. 6 caractères)' }, { status: 400 });
    }
    if (formData.password !== formData.confirmPassword) {
      return NextResponse.json({ error: 'Les mots de passe ne correspondent pas' }, { status: 400 });
    }

    // Vérification OTP
    if (!formData.otp) {
      return NextResponse.json({ error: 'Code OTP requis' }, { status: 400 });
    }
    const otpValid = verifyOTP(formData.email, formData.phone, formData.otp);
    if (!otpValid) {
      return NextResponse.json({ error: 'Code OTP invalide ou expiré' }, { status: 400 });
    }

    // Vérification acceptation des CGU
    if (!formData.acceptedTerms) {
      return NextResponse.json({ error: 'Vous devez accepter les conditions d\'utilisation' }, { status: 400 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(formData.password, 10);

    // Vérifier unicité email boutique
    const existingByEmail = await prisma.store.findUnique({ where: { email: formData.email } });
    if (existingByEmail) {
      return NextResponse.json({ error: 'Email déjà utilisé' }, { status: 409 });
    }

    // Générer un slug unique basé sur le nom de la boutique
    const baseSlug = String(formData.storeName)
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    let slug = baseSlug || 'boutique';
    let attempt = 1;
    // Boucle jusqu'à trouver un slug unique
    while (await prisma.store.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${attempt++}`;
    }

    // Créer directement la boutique
    const store = await prisma.store.create({
      data: {
        name: formData.storeName,
        slug,
        description: `Boutique ${formData.storeName} - ${formData.productCategories?.join(', ') || 'Mode et Accessoires'}`,
        avatar: formData.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.storeName)}&background=3B82F6&color=fff`,
        isLive: false,
        rating: 0.0,
        totalSales: 0,
        satisfaction: 95,
        email: formData.email,
        password: passwordHash,
        phone: formData.phone,
        address: formData.address,
        city: formData.address.split(',').pop()?.trim() || 'Abidjan'
      }
    });

    // Log de création pour audit
    console.log('✅ Boutique créée:', {
      id: store.id,
      name: store.name,
      email: store.email,
      owner: formData.ownerFullName,
      mobileMoneyProvider: formData.mobileMoneyProvider,
      categories: formData.productCategories,
      otpVerified: true,
      termsAccepted: true
    });

    // Auto-login: créer le JWT et définir le cookie 'store-token'
    const token = jwt.sign(
      { storeId: store.id, email: store.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({
      success: true,
      storeId: store.id,
      slug: store.slug,
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        slug: store.slug,
        description: store.description,
        avatar: store.avatar,
        isLive: store.isLive,
      },
      message: 'Boutique créée avec succès'
    });

    response.cookies.set('store-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 jours
    });

    return response;

  } catch (error) {
    console.error('Erreur lors de la soumission:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la soumission de la demande' },
      { status: 500 }
    );
  }
}
