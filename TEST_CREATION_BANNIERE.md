# 🧪 Test de Création de Bannière - Instructions Détaillées

## ✅ Prérequis Validés

- ✓ Base de données: Modèle Banner créé et synchronisé
- ✓ Prisma Client: Régénéré avec succès
- ✓ APIs: `/api/upload/banners` et `/api/admin/banners` fonctionnelles
- ✓ Test direct DB: Création/suppression réussie

## 📋 Procédure de Test

### Étape 1: Connexion Admin
1. Ouvrez http://localhost:3000/admin/login
2. Connectez-vous avec:
   ```
   Email: admin@hypemarket.ci
   Mot de passe: HypeAdmin2024!
   ```
3. ✅ Vous devez être redirigé vers `/admin/dashboard`

### Étape 2: Accès à la Gestion des Bannières
1. Allez sur http://localhost:3000/admin/banners
2. ✅ La page doit charger sans erreur 401/403
3. Ouvrez la Console (F12)
4. ✅ Vous devez voir: `🔐 Page bannières chargée - Vérification auth...`
5. ✅ Cookies doivent contenir `admin-token`

### Étape 3: Upload d'Image
1. Cliquez sur **"+ Nouvelle Bannière"**
2. Le formulaire apparaît
3. Cliquez sur le champ fichier sous "Image"
4. Sélectionnez une image:
   - Format: JPG, PNG, GIF, WebP ou SVG
   - Taille max: 10MB
   - Recommandé: 1200x400 pixels

#### Logs attendus dans la Console:
```
📤 Upload fichier: { nom: "...", type: "image/jpeg", taille: "0.5 MB" }
🚀 Envoi vers /api/upload/banners...
📥 Response status: 200
📥 Response body: {"success":true,"path":"/banners/banner-...jpg"}
✅ Upload réussi: {path: "/banners/..."}
```

5. ✅ Une alerte doit apparaître: "✓ Image uploadée avec succès !"
6. ✅ L'aperçu de l'image doit s'afficher avec "✓ Image uploadée avec succès" en vert

### Étape 4: Remplir le Formulaire
1. **Titre** (obligatoire): "Promo Black Friday"
2. **Lien** (optionnel): "/category/promo"
3. **Description** (optionnelle): "Profitez de -50% sur toute la boutique"
4. **Ordre**: 0
5. ✅ **Bannière active**: coché

### Étape 5: Créer la Bannière
1. Cliquez sur le bouton **"Créer"**

#### Logs attendus dans la Console:
```
🎯 handleSubmit - formData: {
  "title": "Promo Black Friday",
  "description": "...",
  "image": "/banners/banner-...jpg",
  "link": "/category/promo",
  "order": 0,
  "isActive": true
}
🚀 Envoi requête: { method: "POST", url: "/api/admin/banners", data: {...} }
📥 Response status: 201
📥 Response body: {"banner":{...}}
✅ Bannière enregistrée avec succès
```

2. ✅ Une alerte doit apparaître: "✓ Bannière créée avec succès"
3. ✅ Le formulaire doit se fermer
4. ✅ La nouvelle bannière doit apparaître dans la liste

### Étape 6: Vérification
1. La bannière apparaît dans la liste avec:
   - ✅ L'image affichée
   - ✅ Le titre "Promo Black Friday"
   - ✅ Badge "✓ Active" en vert
   - ✅ Ordre: 0
   - ✅ Lien: 🔗 /category/promo

2. Vérifiez sur la page d'accueil:
   - Allez sur http://localhost:3000
   - ✅ La bannière doit apparaître dans le carrousel

## ❌ Erreurs Possibles et Solutions

### Erreur 1: "Accès non autorisé"
**Symptôme**: Erreur 401 au chargement de la page ou lors de l'upload

**Solution**:
```bash
# Vérifier les cookies
# Dans Console: document.cookie
# Doit contenir: admin-token=...

# Si absent, reconnectez-vous:
# 1. Déconnexion
# 2. Reconnexion sur /admin/login
```

### Erreur 2: "Aucun fichier fourni"
**Symptôme**: L'upload échoue immédiatement

**Logs dans Console**:
```
📤 Upload fichier: {...}
🚀 Envoi vers /api/upload/banners...
❌ Erreur upload: 400 {"error":"Aucun fichier fourni"}
```

**Solution**:
- Vérifiez que vous avez bien sélectionné un fichier
- Essayez un autre fichier image
- Vérifiez le format (JPG, PNG, GIF, WebP, SVG)

### Erreur 3: "Le titre et l'image sont obligatoires"
**Symptôme**: Erreur 400 lors de la création

**Logs dans Console**:
```
🚀 Envoi requête: {...}
❌ Erreur API: 400 "Le titre et l'image sont obligatoires"
```

**Solution**:
- Assurez-vous que l'upload d'image est terminé (message vert visible)
- Remplissez le champ Titre
- Ne cliquez sur "Créer" que quand l'image est uploadée

### Erreur 4: Network Error / CORS
**Symptôme**: Erreur réseau, pas de réponse

**Solution**:
```bash
# Vérifier que le serveur tourne
Get-Process -Name node

# Si pas de processus, redémarrer:
npm run dev
```

## 🔍 Commandes de Diagnostic

### Vérifier l'état du serveur
```powershell
# Voir si le serveur tourne
Get-Process -Name node -ErrorAction SilentlyContinue

# Voir les ports ouverts
netstat -ano | findstr :3000
```

### Tester la base de données
```bash
node test-banner-creation.js
```

### Voir les bannières en DB
```bash
npx prisma studio
# Ouvrir http://localhost:5555
# Aller dans "Banner"
```

### Nettoyer et redémarrer
```powershell
# Arrêter le serveur (Ctrl+C)

# Régénérer Prisma
npx prisma generate
npx prisma db push

# Nettoyer le cache Next.js
Remove-Item -Path .next -Recurse -Force -ErrorAction SilentlyContinue

# Redémarrer
npm run dev
```

## 📸 Captures d'Écran Attendues

### 1. Formulaire Vide
- [ ] Bouton "+ Nouvelle Bannière" visible
- [ ] Compteur "0/5 bannières actives"

### 2. Après Upload Image
- [ ] Message vert "✓ Image uploadée avec succès"
- [ ] Aperçu de l'image visible
- [ ] Champ image rempli dans formData

### 3. Formulaire Rempli
- [ ] Tous les champs remplis
- [ ] Bouton "Créer" actif (pas grisé)
- [ ] Aperçu image présent

### 4. Liste des Bannières
- [ ] Bannière créée visible
- [ ] Badge "✓ Active" en vert
- [ ] Image 32x20 affichée
- [ ] Boutons "Modifier" et "Supprimer" présents

### 5. Page d'Accueil
- [ ] Carrousel visible
- [ ] Bannière affichée pleine largeur
- [ ] Navigation dots en bas
- [ ] Auto-défilement toutes les 5 secondes

## 📊 Checklist Complète

Avant de déclarer que "ça ne marche pas", vérifiez:

- [ ] Serveur Next.js tourne sur :3000
- [ ] Connecté en tant qu'admin (cookie admin-token présent)
- [ ] Console ouverte (F12) pour voir les logs
- [ ] Image sélectionnée < 10MB, format valide
- [ ] Upload terminé (message vert visible)
- [ ] Titre rempli
- [ ] Bouton "Créer" cliqué
- [ ] Pas d'erreur 401/403 dans les logs
- [ ] Dossier public/banners existe
- [ ] Prisma généré et DB synchronisée

## 🆘 Si Toujours Bloqué

Envoyez-moi:
1. Screenshot de la Console (F12 > Console)
2. Screenshot du Network tab (F12 > Network > filter: banners)
3. Copie des logs du terminal serveur
4. Résultat de: `node test-banner-creation.js`

## ✨ Test Réussi !

Si vous voyez:
- ✅ Alerte "Bannière créée avec succès"
- ✅ Bannière dans la liste
- ✅ Bannière sur la page d'accueil

**🎉 Félicitations ! Le système fonctionne parfaitement !**
