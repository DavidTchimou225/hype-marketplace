// Test script pour vérifier le système de commande complet
// À exécuter dans la console du navigateur sur la page checkout

console.log('🛍️ Test du système de commande Hype Market');
console.log('==========================================');

// Test 1: Vérifier les données du panier
console.log('\n1. Test données panier:');
const cartData = localStorage.getItem('hype-market-cart');
if (cartData) {
  const cart = JSON.parse(cartData);
  console.log('Articles dans le panier:', cart.length);
  cart.forEach((item, index) => {
    console.log(`  ${index + 1}. ${item.product.name} - ${item.quantity}x - ${item.product.price} FCFA`);
  });
} else {
  console.log('Panier vide - ajoutez des produits d\'abord');
}

// Test 2: Vérifier l'utilisateur connecté
console.log('\n2. Test utilisateur:');
const userData = localStorage.getItem('hype-market-user');
if (userData) {
  const user = JSON.parse(userData);
  console.log('Utilisateur connecté:', user.firstName, user.lastName);
  console.log('Email:', user.email);
} else {
  console.log('Aucun utilisateur connecté');
}

// Test 3: Simuler une commande
console.log('\n3. Test simulation commande:');
if (cartData && userData) {
  const cart = JSON.parse(cartData);
  const user = JSON.parse(userData);
  
  const orderData = {
    userId: user.id,
    items: cart.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price,
      color: item.color,
      size: item.size
    })),
    paymentMethod: 'mobile_money',
    shippingAddress: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '0123456789',
      address: '123 Rue Test, Cocody',
      city: 'Abidjan'
    }
  };
  
  console.log('Données de commande préparées:');
  console.log('- Utilisateur:', orderData.userId);
  console.log('- Articles:', orderData.items.length);
  console.log('- Mode paiement:', orderData.paymentMethod);
  console.log('- Adresse:', orderData.shippingAddress.city);
  
  // Calculer le total
  const total = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 200000; // 2,000 FCFA
  console.log('- Total produits:', total, 'FCFA');
  console.log('- Frais livraison:', shipping, 'FCFA');
  console.log('- Total commande:', total + shipping, 'FCFA');
} else {
  console.log('Impossible de simuler - panier vide ou utilisateur non connecté');
}

console.log('\n✅ Tests terminés! Pour tester la commande complète:');
console.log('1. Assurez-vous d\'avoir des articles dans le panier');
console.log('2. Connectez-vous avec un utilisateur');
console.log('3. Allez sur /checkout');
console.log('4. Remplissez le formulaire et validez');
console.log('5. Vérifiez la confirmation de commande');
