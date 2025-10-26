import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/middleware/adminAuth';
import bcrypt from 'bcryptjs';


export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    let admin;
    try {
      admin = requireAdmin(request);
    } catch (e) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 401 });
    }

    const { action, rejectionReason } = await request.json();
    const applicationId = params.id;

    if (action === 'approve') {
      // Récupérer la demande
      const application = await prisma.storeApplication.findUnique({
        where: { id: applicationId }
      });

      if (!application) {
        return NextResponse.json({ error: 'Demande non trouvée' }, { status: 404 });
      }

      // Utiliser le hash du mot de passe défini lors de l'inscription, sinon générer un mdp temporaire
      // Cast en any pour éviter les erreurs TS si le client Prisma n'est pas régénéré
      let hashedPassword = (application as any)?.passwordHash || '';
      if (!hashedPassword) {
        const tempPassword = Math.random().toString(36).slice(-8);
        hashedPassword = await bcrypt.hash(tempPassword, 10);
      }

      // Slug unique basé sur le nom de la boutique
      const baseSlug = application.storeName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      let slug = baseSlug;
      let attempt = 1;
      while (await prisma.store.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${attempt++}`;
      }

      // Vérifier que l'email boutique n'est pas déjà pris
      const existingByEmail = await prisma.store.findUnique({ where: { email: application.storeEmail } });
      if (existingByEmail) {
        return NextResponse.json({ error: "Email de boutique déjà utilisé" }, { status: 409 });
      }

      // Créer la boutique
      const store = await prisma.store.create({
        data: {
          name: application.storeName,
          slug,
          description: application.storeDescription || '',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(application.storeName)}&background=3B82F6&color=fff`,
          isLive: false,
          rating: 0.0,
          totalSales: 0,
          satisfaction: 95,
          email: application.storeEmail,
          password: hashedPassword,
          phone: application.storePhone,
          address: application.storeAddress,
          city: application.storeCity
        }
      });

      // Mettre à jour la demande
      await prisma.storeApplication.update({
        where: { id: applicationId },
        data: {
          status: 'APPROVED',
          reviewedAt: new Date(),
          reviewedBy: admin.email,
          createdStoreId: store.id
        }
      });

      return NextResponse.json({ success: true, storeId: store.id, slug: store.slug });

    } else if (action === 'reject') {
      await prisma.storeApplication.update({
        where: { id: applicationId },
        data: {
          status: 'REJECTED',
          reviewedAt: new Date(),
          reviewedBy: admin.email,
          rejectionReason
        }
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Action invalide' }, { status: 400 });

  } catch (error: any) {
    console.error('Erreur lors du traitement de la demande:', error);
    if (error?.code === 'P2002') {
      // Contrainte d'unicité (email ou slug)
      return NextResponse.json(
        { error: 'Conflit d\'unicité: email ou slug déjà utilisé' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error?.message || 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
