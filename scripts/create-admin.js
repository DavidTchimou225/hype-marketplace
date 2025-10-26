const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Vérifier si l'admin existe déjà
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@hypemarket.ci' }
    });

    if (existingAdmin) {
      console.log('✅ Admin déjà existant avec email: admin@hypemarket.ci');
      return;
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash('HypeAdmin2024!', 12);

    // Créer l'utilisateur admin
    const admin = await prisma.user.create({
      data: {
        email: 'admin@hypemarket.ci',
        phone: '+22507000000',
        firstName: 'Admin',
        lastName: 'Hype Market',
        password: hashedPassword,
        role: 'SUPER_ADMIN'
      }
    });

    console.log('✅ Utilisateur admin créé avec succès!');
    console.log('📧 Email: admin@hypemarket.ci');
    console.log('🔑 Mot de passe: HypeAdmin2024!');
    console.log('👤 ID:', admin.id);

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
