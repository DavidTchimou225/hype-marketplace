const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Vérifier si un admin existe déjà
    const existingAdmin = await prisma.user.findFirst({
      where: {
        role: { in: ['ADMIN', 'SUPER_ADMIN'] }
      }
    });

    if (existingAdmin) {
      console.log('Un utilisateur admin existe déjà:', existingAdmin.email);
      return;
    }

    // Créer un utilisateur admin par défaut
    const hashedPassword = await bcrypt.hash('HypeAdmin2024!', 10);
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@hypemarket.ci',
        firstName: 'Admin',
        lastName: 'Hype Market',
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        phone: '+225 07 XX XX XX XX'
      }
    });

    console.log('✅ Utilisateur admin créé avec succès!');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Mot de passe: HypeAdmin2024!');
    console.log('🎯 Rôle:', admin.role);
    console.log('\n🚀 Vous pouvez maintenant vous connecter sur /admin/login');

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
