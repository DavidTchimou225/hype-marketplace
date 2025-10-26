import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Créer les catégories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Mode Femme',
        slug: 'femme',
        description: 'Vêtements et accessoires pour femmes',
        image: '/categories/femme.svg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Mode Homme',
        slug: 'homme',
        description: 'Vêtements et accessoires pour hommes',
        image: '/categories/homme.svg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Accessoires',
        slug: 'accessoires',
        description: 'Sacs, ceintures et accessoires de mode',
        image: '/categories/accessoires.svg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Bijoux',
        slug: 'bijoux',
        description: 'Bijoux et ornements précieux',
        image: '/categories/bijoux.svg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Cosmétiques',
        slug: 'cosmetiques',
        description: 'Produits de beauté et cosmétiques',
        image: '/categories/cosmetiques.svg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Chaussures',
        slug: 'chaussures',
        description: 'Chaussures pour tous styles',
        image: '/categories/chaussures.svg',
      },
    }),
  ])

  // Créer les boutiques
  const stores = await Promise.all([
    prisma.store.create({
      data: {
        name: 'Afrique Style',
        slug: 'afrique-style',
        description: 'Spécialiste de la mode féminine traditionnelle africaine avec des créations uniques en wax et bogolan.',
        avatar: 'AS',
        email: 'afrique@hypemarket.ci',
        password: await bcrypt.hash('password123', 10),
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
        description: 'Vêtements homme moderne et traditionnel, spécialisé dans les tenues professionnelles et décontractées.',
        avatar: 'MM',
        email: 'masculine@hypemarket.ci',
        password: await bcrypt.hash('password123', 10),
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
        description: 'Créations artisanales et bijoux précieux inspirés des traditions africaines.',
        avatar: 'BA',
        email: 'bijoux@hypemarket.ci',
        password: await bcrypt.hash('password123', 10),
        isLive: true,
        rating: 4.7,
        totalSales: 8234,
        satisfaction: 94,
      },
    }),
    prisma.store.create({
      data: {
        name: 'Cosmétiques Naturels',
        slug: 'cosmetiques-naturels',
        description: 'Produits de beauté 100% naturels à base d\'ingrédients africains.',
        avatar: 'CN',
        email: 'cosmetiques@hypemarket.ci',
        password: await bcrypt.hash('password123', 10),
        isLive: false,
        rating: 4.6,
        totalSales: 5678,
        satisfaction: 92,
      },
    }),
    prisma.store.create({
      data: {
        name: 'Chaussures Premium',
        slug: 'chaussures-premium',
        description: 'Chaussures de luxe et confort pour toutes occasions.',
        avatar: 'CP',
        email: 'chaussures@hypemarket.ci',
        password: await bcrypt.hash('password123', 10),
        isLive: false,
        rating: 4.5,
        totalSales: 3456,
        satisfaction: 90,
      },
    }),
  ])

  // Créer les produits avec de vraies images et descriptions professionnelles
  const products = await Promise.all([
    // Produits Afrique Style (Mode Femme)
    prisma.product.create({
      data: {
        name: 'Robe Wax Ankara Premium',
        slug: 'robe-wax-ankara-premium',
        description: 'Robe élégante en tissu wax ankara authentique importé du Ghana. Coupe ajustée avec manches 3/4, parfaite pour les événements professionnels et cérémonies. Tissu 100% coton de qualité supérieure avec motifs traditionnels colorés.',
        price: 4500000, // 45,000 FCFA
        images: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500',
        colors: 'Rouge/Or,Bleu/Blanc,Vert/Jaune,Violet/Rose',
        sizes: 'XS,S,M,L,XL',
        stock: 15,
        rating: 4.9,
        reviewCount: 47,
        storeId: stores[0].id,
        categories: { connect: { id: categories[0].id } },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Ensemble Bogolan Moderne',
        slug: 'ensemble-bogolan-moderne',
        description: 'Ensemble deux pièces en bogolan traditionnel malien. Haut crop et jupe midi assortie. Parfait mélange entre tradition africaine et style contemporain. Idéal pour les sorties chic.',
        price: 3800000, // 38,000 FCFA
        images: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500',
        colors: 'Marron/Beige,Noir/Blanc,Ocre/Marron',
        sizes: 'S,M,L,XL',
        stock: 12,
        rating: 4.8,
        reviewCount: 32,
        storeId: stores[0].id,
        categories: { connect: { id: categories[0].id } },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Dashiki Femme Deluxe',
        slug: 'dashiki-femme-deluxe',
        description: 'Dashiki féminin en coton brodé main avec motifs géométriques traditionnels. Coupe ample et confortable, col en V élégant. Pièce unique artisanale confectionnée par nos artisans locaux.',
        price: 2900000, // 29,000 FCFA
        images: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=500',
        colors: 'Multicolore,Rouge/Noir,Bleu/Blanc,Vert/Jaune',
        sizes: 'S,M,L,XL,XXL',
        stock: 20,
        rating: 4.7,
        reviewCount: 28,
        storeId: stores[0].id,
        categories: { connect: { id: categories[0].id } },
      },
    }),
    
    // Produits Mode Masculine CI (Mode Homme)
    prisma.product.create({
      data: {
        name: 'Chemise Kente Prestige',
        slug: 'chemise-kente-prestige',
        description: 'Chemise homme en tissu kente authentique du Ghana. Coupe slim fit moderne avec col français. Parfaite pour les événements formels et cérémonies traditionnelles. Finitions haut de gamme.',
        price: 4200000, // 42,000 FCFA
        images: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500',
        colors: 'Or/Rouge,Bleu/Blanc,Vert/Jaune,Multicolore',
        sizes: 'S,M,L,XL,XXL',
        stock: 18,
        rating: 4.9,
        reviewCount: 41,
        storeId: stores[1].id,
        categories: { connect: { id: categories[1].id } },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Costume Agbada Royal',
        slug: 'costume-agbada-royal',
        description: 'Agbada traditionnel nigérian en brocart de luxe avec broderies dorées. Ensemble 3 pièces : boubou, pantalon et calot assortis. Confection artisanale premium pour grandes occasions.',
        price: 12500000, // 125,000 FCFA
        images: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
        colors: 'Blanc/Or,Bleu/Argent,Noir/Or,Bordeaux/Or',
        sizes: 'M,L,XL,XXL,XXXL',
        stock: 8,
        rating: 5.0,
        reviewCount: 15,
        storeId: stores[1].id,
        categories: { connect: { id: categories[1].id } },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Polo Wax Casual',
        slug: 'polo-wax-casual',
        description: 'Polo décontracté en wax avec col et manches en coton uni. Style moderne et confortable pour le quotidien. Coupe regular fit, idéal pour le travail ou les sorties décontractées.',
        price: 2200000, // 22,000 FCFA
        images: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        colors: 'Bleu/Blanc,Rouge/Noir,Vert/Beige,Jaune/Marron',
        sizes: 'S,M,L,XL,XXL',
        stock: 25,
        rating: 4.6,
        reviewCount: 38,
        storeId: stores[1].id,
        categories: { connect: { id: categories[1].id } },
      },
    }),

    // Produits Accessoires
    prisma.product.create({
      data: {
        name: 'Sac Cabas Cuir Artisanal',
        slug: 'sac-cabas-cuir-artisanal',
        description: 'Grand sac cabas en cuir véritable tanné artisanalement. Spacieux avec compartiments multiples, parfait pour le travail ou les courses. Anses renforcées et fermeture éclair sécurisée.',
        price: 3500000, // 35,000 FCFA
        images: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
        colors: 'Marron Cognac,Noir,Camel,Rouge Bordeaux',
        sizes: 'Unique',
        stock: 15,
        rating: 4.8,
        reviewCount: 42,
        storeId: stores[0].id,
        categories: { connect: { id: categories[2].id } },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Pochette Wax Élégante',
        slug: 'pochette-wax-elegante',
        description: 'Pochette de soirée en tissu wax avec doublure satin. Fermeture à rabat magnétique et chaînette dorée amovible. Parfaite pour les événements chic et sorties nocturnes.',
        price: 1800000, // 18,000 FCFA
        images: 'https://images.unsplash.com/photo-1566150905458-1bf1fc92c01d?w=500',
        colors: 'Rouge/Or,Bleu/Argent,Vert/Bronze,Violet/Or',
        sizes: 'Unique',
        stock: 22,
        rating: 4.7,
        reviewCount: 29,
        storeId: stores[0].id,
        categories: { connect: { id: categories[2].id } },
      },
    }),

    // Produits Bijoux d'Afrique
    prisma.product.create({
      data: {
        name: 'Parure Collier Boucles Akan',
        slug: 'parure-collier-boucles-akan',
        description: 'Parure complète inspirée des symboles Akan du Ghana. Collier ras-de-cou et boucles d\'oreilles assorties en laiton doré 18k. Motifs Adinkra gravés à la main par nos artisans.',
        price: 2800000, // 28,000 FCFA
        images: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500',
        colors: 'Or,Argent,Bronze',
        sizes: 'Unique',
        stock: 12,
        rating: 4.9,
        reviewCount: 35,
        storeId: stores[2].id,
        categories: { connect: { id: categories[3].id } },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Bracelet Perles Baoulé',
        slug: 'bracelet-perles-baoule',
        description: 'Bracelet traditionnel en perles de verre Baoulé authentiques de Côte d\'Ivoire. Chaque perle est unique, fabriquée selon les techniques ancestrales. Élastique résistant pour un port confortable.',
        price: 1200000, // 12,000 FCFA
        images: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500',
        colors: 'Multicolore,Rouge/Blanc,Bleu/Jaune,Vert/Orange',
        sizes: 'S,M,L',
        stock: 30,
        rating: 4.6,
        reviewCount: 48,
        storeId: stores[2].id,
        categories: { connect: { id: categories[3].id } },
      },
    }),

    // Produits Cosmétiques
    prisma.product.create({
      data: {
        name: 'Beurre de Karité Pur Bio',
        slug: 'beurre-karite-pur-bio',
        description: 'Beurre de karité 100% pur et bio du Burkina Faso. Non raffiné, riche en vitamines A et E. Hydrate et nourrit en profondeur tous types de peaux. Texture fondante et parfum naturel délicat.',
        price: 1500000, // 15,000 FCFA
        images: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
        colors: 'Naturel',
        sizes: '100g,250g,500g',
        stock: 40,
        rating: 4.8,
        reviewCount: 67,
        storeId: stores[3].id,
        categories: { connect: { id: categories[4].id } },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Savon Noir Africain Premium',
        slug: 'savon-noir-africain-premium',
        description: 'Savon noir traditionnel du Ghana enrichi à l\'huile de coco et beurre de karité. Nettoie en douceur, exfolie naturellement. Idéal pour peaux sensibles et problématiques. Formule ancestrale authentique.',
        price: 800000, // 8,000 FCFA
        images: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500',
        colors: 'Naturel',
        sizes: '150g,300g',
        stock: 50,
        rating: 4.7,
        reviewCount: 89,
        storeId: stores[3].id,
        categories: { connect: { id: categories[4].id } },
      },
    }),

    // Produits Chaussures
    prisma.product.create({
      data: {
        name: 'Sandales Cuir Maasaï',
        slug: 'sandales-cuir-maasai',
        description: 'Sandales artisanales en cuir véritable inspirées du style Maasaï. Semelle en pneu recyclé pour une adhérence optimale. Lanières décorées de perles colorées. Confort et style authentique.',
        price: 2500000, // 25,000 FCFA
        images: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500',
        colors: 'Marron/Multicolore,Noir/Rouge,Camel/Bleu',
        sizes: '36,37,38,39,40,41,42,43',
        stock: 20,
        rating: 4.5,
        reviewCount: 33,
        storeId: stores[4].id,
        categories: { connect: { id: categories[5].id } },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Escarpins Wax Chic',
        slug: 'escarpins-wax-chic',
        description: 'Escarpins élégants recouverts de tissu wax authentique. Talon de 7cm stable et confortable. Semelle intérieure rembourrée. Parfaits pour sublimer vos tenues africaines lors d\'événements chic.',
        price: 3800000, // 38,000 FCFA
        images: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500',
        colors: 'Rouge/Or,Bleu/Blanc,Vert/Jaune,Violet/Rose',
        sizes: '36,37,38,39,40,41',
        stock: 16,
        rating: 4.6,
        reviewCount: 24,
        storeId: stores[4].id,
        categories: { connect: { id: categories[5].id } },
      },
    }),
  ])

  // Créer un utilisateur de test
  const user = await prisma.user.create({
    data: {
      id: 'test-user-id',
      email: 'test@hypemarket.ci',
      password: await bcrypt.hash('password123', 10),
      firstName: 'Kouame',
      lastName: 'Yao',
      phone: '+225 07 12 34 56 78',
    },
  })

  // Créer une adresse de test
  const address = await prisma.address.create({
    data: {
      firstName: 'Kouame',
      lastName: 'Yao',
      phone: '+225 07 12 34 56 78',
      address: '123 Rue des Palmiers, Cocody',
      city: 'Abidjan',
      postalCode: '00225',
      country: 'Côte d\'Ivoire',
      isDefault: true,
      userId: user.id,
    },
  })

  // Créer quelques avis
  await Promise.all([
    prisma.review.create({
      data: {
        rating: 5,
        comment: 'Excellente qualité, je recommande vivement !',
        userId: user.id,
        productId: products[0].id,
      },
    }),
    prisma.review.create({
      data: {
        rating: 4,
        comment: 'Très beau produit, livraison rapide.',
        userId: user.id,
        productId: products[2].id,
      },
    }),
  ])

  console.log('✅ Base de données peuplée avec succès!')
  console.log(`📊 Créé: ${categories.length} catégories, ${stores.length} boutiques, ${products.length} produits`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
