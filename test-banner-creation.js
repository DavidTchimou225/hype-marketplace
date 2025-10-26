// Script de test pour créer une bannière
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testBannerCreation() {
  try {
    console.log('Test de création de bannière...');
    
    // Test 1: Vérifier que la table existe
    const banners = await prisma.banner.findMany();
    console.log(`✓ Table Banner accessible. ${banners.length} bannières existantes.`);
    
    // Test 2: Créer une bannière de test
    const testBanner = await prisma.banner.create({
      data: {
        title: 'Bannière Test',
        description: 'Description de test',
        image: '/test-image.jpg',
        link: '/test',
        order: 0,
        isActive: true
      }
    });
    
    console.log('✓ Bannière créée avec succès:', testBanner);
    
    // Test 3: Supprimer la bannière de test
    await prisma.banner.delete({
      where: { id: testBanner.id }
    });
    
    console.log('✓ Bannière supprimée avec succès');
    console.log('\n✅ Tous les tests sont passés. Le système de bannières fonctionne correctement.');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    console.error('Stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testBannerCreation();
