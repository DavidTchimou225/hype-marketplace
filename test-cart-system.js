// Test script pour vérifier le système de panier complet
// À exécuter dans la console du navigateur

console.log('🛒 Test du système de panier Hype Market');
console.log('=====================================');

// Test 1: Vérifier que le localStorage est vide au début
console.log('\n1. Test localStorage initial:');
const initialCart = localStorage.getItem('hype-market-cart');
console.log('Panier initial:', initialCart ? JSON.parse(initialCart) : 'Vide');

// Test 2: Simuler l'ajout d'un produit au panier
console.log('\n2. Test ajout produit au panier:');
const testProduct = {
  id: 'test-cart-item-1',
  productId: '1',
  quantity: 2,
  color: 'rouge',
  size: 'M',
  product: {
    id: '1',
    name: 'Robe Wax Ankara Élégante',
    price: 45000,
    images: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1',
    slug: 'robe-wax-elegante',
    store: {
      name: 'Afrique Style'
    }
  }
};

// Simuler l'ajout au localStorage
const currentCart = JSON.parse(localStorage.getItem('hype-market-cart') || '[]');
currentCart.push(testProduct);
localStorage.setItem('hype-market-cart', JSON.stringify(currentCart));
console.log('Produit ajouté:', testProduct.product.name);

// Test 3: Vérifier la persistance
console.log('\n3. Test persistance localStorage:');
const savedCart = JSON.parse(localStorage.getItem('hype-market-cart') || '[]');
console.log('Panier sauvegardé:', savedCart.length, 'article(s)');
console.log('Total estimé:', savedCart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0), 'FCFA');

// Test 4: Tester les fonctions de mise à jour
console.log('\n4. Test mise à jour quantité:');
if (savedCart.length > 0) {
  savedCart[0].quantity = 3;
  localStorage.setItem('hype-market-cart', JSON.stringify(savedCart));
  console.log('Quantité mise à jour:', savedCart[0].quantity);
}

// Test 5: Vérifier les URLs des pages
console.log('\n5. Test navigation:');
const testUrls = [
  '/cart',
  '/product/robe-wax-elegante',
  '/api/products?id=1'
];
console.log('URLs à tester:', testUrls);

// Test 6: Nettoyer le localStorage
console.log('\n6. Nettoyage:');
localStorage.removeItem('hype-market-cart');
console.log('localStorage nettoyé');

console.log('\n✅ Tests terminés! Vérifiez maintenant manuellement:');
console.log('1. Naviguez vers une page produit');
console.log('2. Cliquez sur "Ajouter au Panier"');
console.log('3. Vérifiez que le compteur du panier augmente');
console.log('4. Allez sur /cart pour voir les articles');
console.log('5. Modifiez les quantités et supprimez des articles');
console.log('6. Rechargez la page pour vérifier la persistance');
