// Test script pour tester l'API de commandes corrigée
// À exécuter dans la console du navigateur

console.log('🔧 Test de l\'API Orders corrigée');
console.log('================================');

// Test 1: Préparer des données de test
const testOrderData = {
  userId: 'test-user-id',
  items: [
    {
      productId: '1', // Robe Wax Ankara
      quantity: 1,
      price: 4500000, // 45,000 FCFA en centimes
      color: 'rouge',
      size: 'M'
    }
  ],
  paymentMethod: 'mobile_money',
  shippingAddress: {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@hype-market.com',
    phone: '0123456789',
    address: '123 Rue Test, Cocody',
    city: 'Abidjan'
  }
};

console.log('Données de test préparées:', testOrderData);

// Test 2: Fonction pour tester l'API
async function testOrderAPI() {
  try {
    console.log('\n📡 Test de l\'API /api/orders...');
    
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOrderData),
    });

    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));

    const result = await response.json();
    console.log('Réponse API:', result);

    if (response.ok && result.success) {
      console.log('✅ Commande créée avec succès!');
      console.log('Numéro de commande:', result.order.orderNumber);
      console.log('Total:', result.order.totalAmount, 'centimes');
      console.log('Articles:', result.order.items.length);
    } else {
      console.log('❌ Erreur API:', result.error);
      console.log('Détails:', result.details);
    }

  } catch (error) {
    console.error('❌ Erreur réseau:', error);
  }
}

// Test 3: Vérifier les données du panier avant test
console.log('\n🛒 Vérification du panier:');
const cartData = localStorage.getItem('hype-market-cart');
if (cartData) {
  const cart = JSON.parse(cartData);
  console.log('Articles dans le panier:', cart.length);
  
  if (cart.length > 0) {
    console.log('Premier article:', {
      productId: cart[0].productId,
      name: cart[0].product.name,
      quantity: cart[0].quantity,
      price: cart[0].product.price
    });
    
    // Utiliser les vraies données du panier pour le test
    testOrderData.items = cart.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price,
      color: item.color,
      size: item.size
    }));
    
    console.log('Données mises à jour avec le panier réel');
  }
} else {
  console.log('Panier vide - utilisation des données de test');
}

console.log('\n🚀 Lancement du test API...');
testOrderAPI();

console.log('\n📋 Instructions:');
console.log('1. Vérifiez les logs de la console pour les erreurs');
console.log('2. Si succès: la commande est créée en base');
console.log('3. Si erreur: vérifiez les détails dans la réponse');
console.log('4. Testez ensuite via l\'interface /checkout');
