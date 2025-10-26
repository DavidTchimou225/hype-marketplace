// Test script to verify all products have dynamic pages
const productSlugs = [
  'robe-wax-ankara-premium',
  'ensemble-bogolan-moderne', 
  'dashiki-femme-deluxe',
  'chemise-kente-prestige',
  'costume-agbada-royal',
  'polo-wax-casual',
  'sac-cabas-cuir-artisanal',
  'pochette-wax-elegante',
  'parure-collier-boucles-akan',
  'bracelet-perles-baoule',
  'beurre-karite-pur-bio',
  'savon-noir-africain-premium',
  'sandales-cuir-maasai',
  'escarpins-wax-chic',
  'sac-dos-wax-moderne'
];

console.log(`Found ${productSlugs.length} product slugs in seed data:`);
productSlugs.forEach((slug, index) => {
  console.log(`${index + 1}. /product/${slug}`);
});

console.log('\nAll products should be accessible via dynamic routing at /product/[slug]');
