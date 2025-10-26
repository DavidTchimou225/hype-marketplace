# 🎠 Guide Installation Carrousel de Bannières - Hype Market

## 📋 Ce qui a été créé

### **1. Modèle Base de Données** (`prisma/schema.prisma`)
```prisma
model Banner {
  id          String   @id @default(cuid())
  title       String
  description String?
  image       String
  link        String?
  order       Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("banners")
}
```

### **2. APIs Créées**

#### API Publique
- **GET `/api/banners`** - Récupère les bannières actives pour le carrousel

#### API Admin
- **GET `/api/admin/banners`** - Liste toutes les bannières
- **POST `/api/admin/banners`** - Créer une nouvelle bannière
- **PATCH `/api/admin/banners/[id]`** - Modifier une bannière
- **DELETE `/api/admin/banners/[id]`** - Supprimer une bannière

### **3. Composants Frontend**

#### **HeroCarousel** (`src/components/HeroCarousel.tsx`)
- Carrousel automatique (5 secondes)
- Swipe tactile sur mobile
- Navigation par flèches sur desktop
- Indicateurs de position (dots)
- Responsive design
- Gère jusqu'à 5 bannières actives

#### **Page Admin** (`src/app/admin/banners/page.tsx`)
- Interface complète de gestion
- Upload d'images
- Formulaire création/modification
- Activation/Désactivation
- Ordre d'affichage personnalisable
- Limite de 5 bannières actives

### **4. Intégration Page d'Accueil**
Le carrousel remplace la section "Mode Ivoirienne" hardcodée sur la page d'accueil.

---

## 🚀 Installation

### **Étape 1 : Mettre à jour la base de données**

```bash
# Générer le client Prisma avec le nouveau modèle Banner
npx prisma generate

# Pousser le schéma vers la base de données
npx prisma db push
```

### **Étape 2 : Redémarrer le serveur**

```bash
# Arrêter le serveur actuel (Ctrl+C)
# Puis relancer
npm run dev
```

### **Étape 3 : Accéder au dashboard admin**

1. Ouvrir : `http://localhost:3000/admin/login`
2. Se connecter avec les identifiants admin
3. Aller dans le menu ou visiter : `http://localhost:3000/admin/banners`

---

## 🎨 Utilisation - Dashboard Admin

### **Créer une bannière**

1. Cliquer sur **"+ Nouvelle Bannière"**
2. Remplir le formulaire :
   - **Titre** : Nom de la bannière (obligatoire)
   - **Description** : Texte optionnel affiché sur la bannière
   - **Image** : Upload d'image (1200x400 recommandé)
   - **Lien** : URL optionnelle (ex: `/category/promo`)
   - **Ordre** : Numéro de position (0, 1, 2...)
   - **Active** : Cocher pour activer la bannière
3. Cliquer sur **"Créer"**

### **Modifier une bannière**

1. Dans la liste, cliquer sur **"Modifier"**
2. Modifier les champs souhaités
3. Cliquer sur **"Mettre à jour"**

### **Supprimer une bannière**

1. Cliquer sur **"Supprimer"**
2. Confirmer la suppression

### **Activer/Désactiver**

- Modifier la bannière et cocher/décocher **"Bannière active"**
- Maximum 5 bannières actives simultanément

---

## 📐 Spécifications Techniques

### **Dimensions Images Recommandées**

- **Format** : 1200x400 pixels
- **Ratio** : 3:1 (paysage)
- **Poids** : Max 500 KB (optimisé)
- **Formats** : JPG, PNG, WebP

### **Comportement Carrousel**

- **Auto-play** : 5 secondes par bannière
- **Swipe mobile** : Gauche/Droite pour naviguer
- **Navigation desktop** : Flèches + Dots
- **Transition** : 500ms ease-out
- **Limite** : 5 bannières actives maximum

### **Ordre d'Affichage**

Les bannières s'affichent par ordre croissant du champ `order` :
- `order: 0` → Première bannière
- `order: 1` → Deuxième bannière
- etc.

---

## 🎯 Exemples de Bannières

### **Bannière Promo**
```
Titre: Collection Wax Exclusive
Description: Offre limitée jusqu'au 31 janvier
Image: /uploads/promo-wax.jpg
Lien: /category/wax
Ordre: 0
Active: ✓
```

### **Bannière Nouveautés**
```
Titre: Nouvelle Collection Printemps
Description: Découvrez les dernières tendances
Image: /uploads/printemps-2025.jpg
Lien: /categories?new=true
Ordre: 1
Active: ✓
```

### **Bannière Événement**
```
Titre: Soldes d'été -40%
Description: Jusqu'à épuisement des stocks
Image: /uploads/soldes-ete.jpg
Lien: /category/soldes
Ordre: 2
Active: ✓
```

---

## 🔒 Sécurité

### **Authentification Admin**

Toutes les routes `/api/admin/banners/*` sont protégées par :
- Vérification du token JWT admin
- Rôle ADMIN ou SUPER_ADMIN requis
- Protection contre les injections

### **Validation**

- Limite de 5 bannières actives (côté serveur)
- Validation des champs obligatoires
- Vérification de l'existence avant modification/suppression

---

## 🎨 Personnalisation

### **Modifier le Temps d'Auto-Play**

Dans `src/components/HeroCarousel.tsx`, ligne 42 :
```typescript
autoPlayRef.current = setInterval(() => {
  setCurrentIndex((prev) => (prev + 1) % banners.length);
}, 5000); // ← Changer ici (en millisecondes)
```

### **Modifier la Hauteur du Carrousel**

Dans `src/components/HeroCarousel.tsx`, ligne 97 :
```tsx
<div className="relative h-64 rounded-2xl overflow-hidden">
  {/* Changer h-64 en h-48, h-80, etc. */}
```

### **Changer les Couleurs des Dots**

Dans `src/components/HeroCarousel.tsx`, ligne 199 :
```typescript
className={`h-2 rounded-full transition-all ${
  index === currentIndex
    ? 'bg-blue-600 w-8'  // ← Couleur active
    : 'bg-gray-300 w-2'   // ← Couleur inactive
}`}
```

---

## 🐛 Dépannage

### **Erreur : "Property 'banner' does not exist"**

**Cause** : Le modèle Prisma n'a pas été généré

**Solution** :
```bash
npx prisma generate
npx prisma db push
```

### **Carrousel n'apparaît pas**

**Vérifications** :
1. Au moins une bannière active dans l'admin
2. Image URL valide et accessible
3. Pas d'erreur dans la console navigateur
4. API `/api/banners` retourne des données

### **Images ne s'affichent pas**

**Vérifications** :
1. Le dossier `/public/uploads/` existe
2. Les permissions d'écriture sont correctes
3. L'API upload fonctionne (`/api/admin/upload`)
4. Chemin d'image commence par `/uploads/`

### **Limite 5 bannières dépassée**

**Message** : "Vous ne pouvez pas avoir plus de 5 bannières actives"

**Solution** :
1. Désactiver une bannière existante
2. Ou supprimer une bannière
3. Puis réessayer

---

## 📊 Structure Base de Données

```sql
-- Table banners
CREATE TABLE banners (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image TEXT NOT NULL,
  link TEXT,
  "order" INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔄 Workflow Complet

1. **Admin se connecte** → Dashboard admin
2. **Accède aux bannières** → `/admin/banners`
3. **Crée une bannière** → Upload image + infos
4. **Active la bannière** → Cocher "Active"
5. **Visite page d'accueil** → Carrousel s'affiche
6. **Bannière défile automatiquement** → Toutes les 5s
7. **Mobile swipe** → Navigation tactile
8. **Clic sur bannière** → Redirige vers le lien configuré

---

## ✨ Fonctionnalités Avancées

### **Liens Internes**

Exemples de liens utiles :
- `/category/wax` - Catégorie spécifique
- `/store/afrique-style` - Boutique spécifique
- `/product/robe-wax-exclusive` - Produit spécifique
- `/boutiques?live=true` - Boutiques en live
- `/categories` - Toutes les catégories

### **Tracking Analytics**

Pour ajouter le tracking des clics sur bannières :

Dans `HeroCarousel.tsx`, ajouter :
```typescript
const handleBannerClick = (banner: Banner) => {
  // Google Analytics
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'banner_click', {
      banner_id: banner.id,
      banner_title: banner.title
    });
  }
};
```

---

## 📝 Checklist d'Installation

- [ ] `npx prisma generate` exécuté
- [ ] `npx prisma db push` exécuté
- [ ] Serveur redémarré
- [ ] Accès admin vérifié (`/admin/banners`)
- [ ] Dossier `/public/uploads/` existe
- [ ] Au moins 1 bannière créée
- [ ] Bannière active cochée
- [ ] Page d'accueil affiche le carrousel
- [ ] Swipe mobile fonctionne
- [ ] Auto-play fonctionne (5s)
- [ ] Liens de redirection testés

---

## 🎉 Prêt !

Le système de carrousel est maintenant complètement fonctionnel !

**Navigation rapide** :
- **Admin** : http://localhost:3000/admin/banners
- **Public** : http://localhost:3000 (carrousel visible)

**Besoin d'aide ?** Consultez la console du navigateur pour les erreurs éventuelles.
