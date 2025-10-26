const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function resetAndSeed() {
  try {
    console.log('🗑️ Suppression des données existantes...');
    
    // Supprimer dans l'ordre inverse des dépendances
    await prisma.review.deleteMany();
    await prisma.favorite.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.address.deleteMany();
    await prisma.product.deleteMany();
    await prisma.store.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    console.log('✅ Données supprimées avec succès');
    
    console.log('🌱 Création des catégories...');
    
    // Créer les catégories
    const categories = await Promise.all([
      prisma.category.create({
        data: {
          name: 'Mode Femme',
          slug: 'femme',
          description: 'Vêtements et accessoires pour femmes',
          emoji: '👗',
        },
      }),
      prisma.category.create({
        data: {
          name: 'Mode Homme',
          slug: 'homme',
          description: 'Vêtements et accessoires pour hommes',
          emoji: '👔',
        },
      }),
      prisma.category.create({
        data: {
          name: 'Accessoires',
          slug: 'accessoires',
          description: 'Sacs, ceintures et accessoires de mode',
          emoji: '👜',
        },
      }),
      prisma.category.create({
        data: {
          name: 'Bijoux',
          slug: 'bijoux',
          description: 'Bijoux et ornements précieux',
          emoji: '💎',
        },
      }),
      prisma.category.create({
        data: {
          name: 'Cosmétiques',
          slug: 'cosmetiques',
          description: 'Produits de beauté et cosmétiques',
          emoji: '💄',
        },
      }),
    ]);

    console.log('✅ Catégories créées');
    console.log('🏪 Création des boutiques...');

    // Créer les boutiques
    const stores = await Promise.all([
      prisma.store.create({
        data: {
          name: 'Afrique Style',
          slug: 'afrique-style',
          description: 'Spécialiste de la mode féminine traditionnelle africaine.',
          avatar: 'AS',
          isLive: true,
          rating: 4.8,
          totalSales: 15678,
          satisfaction: 98,
        },
      }),
      prisma.store.create({
        data: {
          name: 'Mode Masculine CI',
          slug: 'mode-masculine-ci',
          description: 'Vêtements homme moderne et traditionnel.',
          avatar: 'MM',
          isLive: false,
          rating: 4.9,
          totalSales: 12345,
          satisfaction: 96,
        },
      }),
      prisma.store.create({
        data: {
          name: 'Bijoux d\'Afrique',
          slug: 'bijoux-afrique',
          description: 'Créations artisanales et bijoux précieux.',
          avatar: 'BA',
          isLive: true,
          rating: 4.7,
          totalSales: 8234,
          satisfaction: 94,
        },
      }),
    ]);

    console.log('✅ Boutiques créées');
    console.log('📦 Création des produits...');

    // Créer les produits
    const products = await Promise.all([
      // Produits Mode Femme
      prisma.product.create({
        data: {
          name: 'Robe Wax Ankara Premium',
          slug: 'robe-wax-ankara-premium',
          description: 'Robe élégante en tissu wax ankara authentique importé du Ghana.',
          price: 4500000, // 45,000 FCFA
          images: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500',
          colors: 'Rouge,Bleu,Vert,Violet',
          sizes: 'XS,S,M,L,XL',
          stock: 15,
          rating: 4.9,
          reviewCount: 47,
          storeId: stores[0].id,
          categoryId: categories[0].id,
        },
      }),
      prisma.product.create({
        data: {
          name: 'Ensemble Bogolan Moderne',
          slug: 'ensemble-bogolan-moderne',
          description: 'Ensemble deux pièces en bogolan traditionnel malien.',
          price: 3800000, // 38,000 FCFA
          images: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500',
          colors: 'Marron,Noir,Ocre',
          sizes: 'S,M,L,XL',
          stock: 12,
          rating: 4.8,
          reviewCount: 32,
          storeId: stores[0].id,
          categoryId: categories[0].id,
        },
      }),
      // Produits Mode Homme
      prisma.product.create({
        data: {
          name: 'Chemise Kente Prestige',
          slug: 'chemise-kente-prestige',
          description: 'Chemise homme en tissu kente authentique du Ghana.',
          price: 4200000, // 42,000 FCFA
          images: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500',
          colors: 'Or,Bleu,Vert,Multicolore',
          sizes: 'S,M,L,XL,XXL',
          stock: 18,
          rating: 4.9,
          reviewCount: 41,
          storeId: stores[1].id,
          categoryId: categories[1].id,
        },
      }),
      prisma.product.create({
        data: {
          name: 'Costume Agbada Royal',
          slug: 'costume-agbada-royal',
          description: 'Agbada traditionnel nigérian en brocart de luxe.',
          price: 12500000, // 125,000 FCFA
          images: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
          colors: 'Blanc,Bleu,Noir,Bordeaux',
          sizes: 'M,L,XL,XXL,XXXL',
          stock: 8,
          rating: 4.9,
          reviewCount: 23,
          storeId: stores[1].id,
          categoryId: categories[1].id,
        },
      }),
      // Produits Accessoires
      prisma.product.create({
        data: {
          name: 'Sac Cabas Cuir Artisanal',
          slug: 'sac-cabas-cuir-artisanal',
          description: 'Grand sac cabas en cuir véritable tanné artisanalement.',
          price: 3500000, // 35,000 FCFA
          images: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
          colors: 'Marron,Noir,Camel',
          sizes: 'Unique',
          stock: 25,
          rating: 4.6,
          reviewCount: 89,
          storeId: stores[0].id,
          categoryId: categories[2].id,
        },
      }),
      // Produits Bijoux
      prisma.product.create({
        data: {
          name: 'Parure Collier Boucles Akan',
          slug: 'parure-collier-boucles-akan',
          description: 'Parure complète inspirée des symboles Akan du Ghana.',
          price: 2800000, // 28,000 FCFA
          images: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500',
          colors: 'Or,Argent,Bronze',
          sizes: 'Unique',
          stock: 30,
          rating: 4.8,
          reviewCount: 156,
          storeId: stores[2].id,
          categoryId: categories[3].id,
        },
      }),
      // Produits Cosmétiques
      prisma.product.create({
        data: {
          name: 'Beurre de Karité Pur Bio',
          slug: 'beurre-karite-pur-bio',
          description: 'Beurre de karité 100% pur et bio du Burkina Faso.',
          price: 1500000, // 15,000 FCFA
          images: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
          colors: 'Naturel',
          sizes: '100ml,250ml,500ml',
          stock: 50,
          rating: 4.7,
          reviewCount: 234,
          storeId: stores[0].id,
          categoryId: categories[4].id,
        },
      }),
    ]);

    console.log('✅ Produits créés');
    console.log('👤 Création de l\'utilisateur test...');

    // Créer un utilisateur test
    const testUser = await prisma.user.create({
      data: {
        email: 'test@hypemarket.ci',
        firstName: 'Test',
        lastName: 'User',
        phone: '+225 01 02 03 04 05',
        password: 'test123',
      },
    });

    console.log('✅ Base de données initialisée avec succès !');
    console.log(`📊 Résumé:`);
    console.log(`   - ${categories.length} catégories`);
    console.log(`   - ${stores.length} boutiques`);
    console.log(`   - ${products.length} produits`);
    console.log(`   - 1 utilisateur test`);

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAndSeed();
