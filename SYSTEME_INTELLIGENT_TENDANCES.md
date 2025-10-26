# 🤖 Système Intelligent de Tendances - Hype Market

## 🎯 Objectif

Afficher automatiquement les produits les plus pertinents dans la section "Tendances" basé sur:
- 📊 **Données d'engagement réelles** (vues, clics, achats)
- 🔄 **Variation aléatoire** pour éviter la monotonie
- ⭐ **Qualité** (notes, avis)
- 🆕 **Nouveauté** (boost produits récents)
- 📦 **Disponibilité** (privilégie produits en stock)

---

## ✅ Fonctionnalités Implémentées

### 1. **Algorithme de Scoring Intelligent**

#### Métriques Trackées
```typescript
// Dans le modèle Product
viewCount: Int       // Nombre de vues du produit
cartAddCount: Int    // Nombre d'ajouts au panier
purchaseCount: Int   // Nombre d'achats effectués
```

#### Pondérations
```typescript
const weights = {
  views: 1,        // 1 point par vue
  cartAdds: 10,    // 10 points par ajout panier
  purchases: 50,   // 50 points par achat
  rating: 20,      // 20 points max pour la note
  reviews: 5,      // 5 points par avis
  newness: 30,     // 30 points max pour la nouveauté
  stock: 10        // 10 points max si en stock
};
```

### 2. **Tracking Automatique**

#### Vues de Produit
- ✅ Trackées automatiquement à l'ouverture de la page produit
- ✅ API: `POST /api/products/{id}/track` avec `action: 'view'`
- ✅ Incrémente `viewCount` +1

#### Ajouts au Panier
- ✅ Trackés lors du clic "Ajouter au panier"
- ✅ API: `POST /api/products/{id}/track` avec `action: 'cart_add'`
- ✅ Incrémente `cartAddCount` +1

#### Achats
- ✅ Trackés lors de la confirmation de commande
- ✅ API: `POST /api/products/{id}/track` avec `action: 'purchase'`
- ✅ Incrémente `purchaseCount` +1

### 3. **Message Admin Personnalisable**

L'admin peut gérer le message affiché dans le header noir via `/admin/settings`:

```
Avant:  9:41 AM
Après:  🎉 Livraison gratuite ce week-end !
```

---

## 🧮 Formule de Calcul du Score

### Score de Base

```typescript
score = 0

// Vues (max 1000 pour éviter domination)
score += min(viewCount, 1000) × 1

// Ajouts panier (forte conversion)
score += cartAddCount × 10

// Achats (meilleure métrique)
score += purchaseCount × 50

// Note produit (0-5 étoiles)
score += rating × 20

// Nombre d'avis (preuve sociale)
score += reviewCount × 5

// Bonus nouveauté
if (ageInDays <= 7)
  score += 30  // Nouveau
else if (ageInDays <= 30)
  score += 15  // Récent

// Bonus stock
if (stock > 0)
  score += 10
else
  score ×= 0.5  // Pénalité si rupture

// Facteur aléatoire (10% pour variation)
score += score × 0.1 × random()
```

### Sélection Finale

```
1. Trier tous les produits par score
2. Prendre top N produits (ex: 20)
3. Garantir 70% des meilleurs (ex: 7)
4. Sélectionner 30% aléatoire parmi le reste (ex: 3)
5. Mélanger l'ordre final
```

**Résultat:** Tendances basées sur données réelles + variation aléatoire

---

## 📊 Exemples de Scores

### Produit A: Best-seller
```
Views: 500         → 500 × 1    = 500
Cart Adds: 50      → 50 × 10    = 500
Purchases: 20      → 20 × 50    = 1000
Rating: 4.5        → 4.5 × 20   = 90
Reviews: 30        → 30 × 5     = 150
Age: 15 jours      → 0          = 0
Stock: 10          → 1          = 10
Random (10%)       → ~225       = 225
────────────────────────────────────
TOTAL                          = 2475 ⭐⭐⭐
```

### Produit B: Nouveau et prometteur
```
Views: 100         → 100 × 1    = 100
Cart Adds: 15      → 15 × 10    = 150
Purchases: 5       → 5 × 50     = 250
Rating: 5.0        → 5.0 × 20   = 100
Reviews: 8         → 8 × 5      = 40
Age: 3 jours       → Nouveau    = 30
Stock: 20          → 1          = 10
Random (10%)       → ~68        = 68
────────────────────────────────────
TOTAL                          = 748 ⭐⭐
```

### Produit C: Ancien sans engagement
```
Views: 20          → 20 × 1     = 20
Cart Adds: 2       → 2 × 10     = 20
Purchases: 0       → 0 × 50     = 0
Rating: 3.0        → 3.0 × 20   = 60
Reviews: 2         → 2 × 5      = 10
Age: 90 jours      → 0          = 0
Stock: 5           → 1          = 10
Random (10%)       → ~12        = 12
────────────────────────────────────
TOTAL                          = 132 ❌
```

**→ Produit A et B seront dans les tendances, pas C**

---

## 🔧 APIs Créées

### 1. `/api/trending` (GET)
**Récupère les produits tendances calculés intelligemment**

```typescript
GET /api/trending?limit=10

Response:
{
  "products": [
    {
      "id": "...",
      "name": "Nike Air Max",
      "price": 5000000,
      "rating": 4.5,
      "viewCount": 500,
      "cartAddCount": 50,
      "purchaseCount": 20,
      // ... autres champs
    }
  ]
}
```

### 2. `/api/products/[id]/track` (POST)
**Track une action utilisateur sur un produit**

```typescript
POST /api/products/{id}/track
Body: {
  "action": "view" | "cart_add" | "purchase"
}

Response:
{
  "success": true
}
```

### 3. `/api/settings` (GET)
**Récupère un paramètre public (ex: message header)**

```typescript
GET /api/settings?key=header_message

Response:
{
  "key": "header_message",
  "value": "🎉 Livraison gratuite !"
}
```

### 4. `/api/admin/settings` (GET/POST)
**Gestion admin des paramètres**

```typescript
// Lire tous
GET /api/admin/settings

// Créer/Modifier
POST /api/admin/settings
Body: {
  "key": "header_message",
  "value": "🎉 Livraison gratuite !"
}
```

---

## 📱 Intégrations Frontend

### 1. Page Produit (`ProductClient.tsx`)

```typescript
// Tracking automatique de la vue
useEffect(() => {
  fetch(`/api/products/${product.id}/track`, {
    method: 'POST',
    body: JSON.stringify({ action: 'view' })
  });
}, [product.id]);

// Tracking ajout panier
const handleAddToCart = async () => {
  await addToCart(...);
  await fetch(`/api/products/${product.id}/track`, {
    method: 'POST',
    body: JSON.stringify({ action: 'cart_add' })
  });
};
```

### 2. Composant Tendances (`TrendingProducts.tsx`)

```typescript
// Récupère les tendances intelligentes
const fetchTrendingProducts = async () => {
  const response = await fetch('/api/trending?limit=10');
  const data = await response.json();
  setProducts(data.products || []);
};
```

### 3. Page d'Accueil (`page.tsx`)

```typescript
// Récupère le message admin
const msgRes = await fetch('/api/settings?key=header_message');
const msgData = await msgRes.json();
setHeaderMessage(msgData.value || '');

// Affiche dans le header
<header className="bg-black text-white px-4 py-3">
  <div>{headerMessage || '9:41 AM'}</div>
</header>
```

### 4. Page Admin Settings (`/admin/settings/page.tsx`)

Interface pour modifier le message header:
- Champ texte (max 100 caractères)
- Aperçu en temps réel
- Exemples pré-définis
- Bouton "Enregistrer"

---

## 🎯 Avantages du Système

### Pour les Utilisateurs
- ✅ **Produits pertinents** basés sur vraies données
- ✅ **Variété** grâce au facteur aléatoire
- ✅ **Découverte** de nouveaux produits populaires
- ✅ **Qualité** (produits bien notés prioritaires)

### Pour les Vendeurs
- ✅ **Équité** - Nouveaux vendeurs ont leur chance
- ✅ **Mérite** - Produits performants récompensés
- ✅ **Boost nouveautés** - Produits récents mis en avant
- ✅ **Visibilité** - Basée sur engagement réel

### Pour l'Entreprise
- ✅ **Conversion** - Met en avant ce qui vend
- ✅ **Engagement** - Produits qui intéressent vraiment
- ✅ **Automatique** - Pas de gestion manuelle
- ✅ **Adaptatif** - S'ajuste aux tendances réelles

---

## 📈 Évolution des Tendances

### Comment un produit devient tendance ?

**Jour 1-7: Boost nouveauté**
```
Score = Faible engagement + Bonus nouveauté (30 points)
→ Chance d'apparaître dans les tendances
```

**Jour 8-30: Engagement réel**
```
Score = Vues + Ajouts panier + Achats + Bonus récent (15 points)
→ Si bon engagement, reste dans tendances
```

**Jour 31+: Performance pure**
```
Score = Vues + Ajouts panier + Achats + Notes
→ Seuls les meilleurs restent
```

### Exemple Réel

**T-shirt Nike - Parcours vers tendance**

| Jour | Vues | Panier | Achats | Score | Tendance? |
|------|------|--------|--------|-------|-----------|
| 1    | 10   | 0      | 0      | 40    | ✅ (nouveau) |
| 7    | 100  | 5      | 2      | 260   | ✅ (nouveau + engagement) |
| 15   | 300  | 20     | 8      | 815   | ✅ (engagement fort) |
| 30   | 800  | 60     | 25     | 2550  | ✅⭐ (top tendance) |
| 60   | 1200 | 100    | 40     | 3110  | ✅⭐⭐ (best-seller) |

---

## 🔄 Rafraîchissement des Tendances

### À chaque requête
- ✅ Calcul en temps réel
- ✅ Données toujours à jour
- ✅ Pas de cache figé

### Variation aléatoire
- 70% meilleurs produits garantis
- 30% sélection aléatoire dans le top
- Ordre mélangé aléatoirement

**Résultat:** Même à 1 minute d'intervalle, l'ordre peut changer légèrement

---

## 🧪 Tests & Validation

### Test 1: Nouveau Produit
1. Créer un produit neuf
2. ✅ Devrait apparaître dans tendances (bonus nouveauté)
3. Vérifier: présent dans `/api/trending`

### Test 2: Produit Populaire
1. Produit avec beaucoup de vues
2. ✅ Score élevé → toujours dans tendances
3. Vérifier: en haut de liste

### Test 3: Tracking Vues
1. Visiter page produit
2. ✅ `viewCount` +1 dans la DB
3. Vérifier: SELECT viewCount FROM products

### Test 4: Tracking Panier
1. Ajouter au panier
2. ✅ `cartAddCount` +1 dans la DB
3. Vérifier: SELECT cartAddCount FROM products

### Test 5: Message Admin
1. Aller sur `/admin/settings`
2. Changer le message
3. ✅ Visible sur page d'accueil
4. Rafraîchir: message persiste

---

## 📊 Métriques à Surveiller

### Tableau de Bord (Future)

```
Tendances Performance:
━━━━━━━━━━━━━━━━━━━━━━━━━
Top 10 Produits:
1. Nike Air Max        Score: 2475 📈
2. Robe Ankara         Score: 1820 📈
3. Sac à Main Cuir     Score: 1650 📊
...

Engagement Global:
━━━━━━━━━━━━━━━━━━━━━━━━━
Total Vues:           45,230
Total Paniers:         3,150
Total Achats:            892
Taux Conversion:        2.8%
```

---

## 🚀 Prochaines Améliorations

### Phase 2
- [ ] Tendances par catégorie
- [ ] Tendances personnalisées (historique user)
- [ ] Dashboard analytics admin
- [ ] Export données tendances

### Phase 3
- [ ] Machine Learning pour prédiction
- [ ] A/B testing positions
- [ ] Tendances par région/ville
- [ ] Tendances saisonnières

---

## ✅ Résumé

Le système de tendances de Hype Market est maintenant:

✅ **Intelligent** - Basé sur données réelles d'engagement
✅ **Automatique** - Pas de gestion manuelle
✅ **Dynamique** - S'adapte en temps réel
✅ **Équitable** - Donne sa chance aux nouveaux
✅ **Performant** - Met en avant ce qui convertit
✅ **Varié** - Facteur aléatoire pour découverte

**Le message admin** est géré via `/admin/settings` pour des communications flexibles avec les utilisateurs.

**Les produits tendances** sont sélectionnés intelligemment selon un algorithme qui prend en compte l'engagement réel et assure une rotation naturelle.

🎉 **Prêt pour production!**
