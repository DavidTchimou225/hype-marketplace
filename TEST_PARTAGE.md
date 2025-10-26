# 🧪 Guide de Test - Système de Partage

## 🎯 Comment Tester

### Test 1: Partage de Produit

1. **Ouvrir un produit:**
   ```
   http://localhost:3000/product/[slug-produit]
   ```

2. **Scrollez vers le bas** jusqu'au bouton "📤 Partager"

3. **Cliquez sur "Partager"**
   - ✅ Un modal doit apparaître avec animation
   - ✅ Le lien du produit s'affiche
   - ✅ 4 options de partage visibles

4. **Test Copie de Lien:**
   - Cliquez sur "Copier"
   - ✅ Le bouton devient vert "✓ Copié"
   - ✅ Message de confirmation affiché
   - Ouvrez un éditeur et collez (Ctrl+V)
   - ✅ Le lien complet doit être collé

5. **Test WhatsApp:**
   - Cliquez sur "💬 WhatsApp"
   - ✅ WhatsApp Web/App s'ouvre
   - ✅ Message pré-rempli avec le lien
   - Envoyez à un contact de test

6. **Test Facebook:**
   - Cliquez sur "f Facebook"
   - ✅ Dialogue de partage Facebook s'ouvre
   - ✅ Preview du lien visible

7. **Test Fermeture:**
   - Cliquez en dehors du modal
   - ✅ Le modal se ferme
   - Rouvrez et cliquez sur "×"
   - ✅ Le modal se ferme

---

### Test 2: Partage de Boutique

1. **Ouvrir une boutique:**
   ```
   http://localhost:3000/store/[slug-boutique]
   ```

2. **Trouvez le bouton "📤 Partager"**
   - Sous les boutons "Voir le Live" et "Contacter"

3. **Cliquez sur "Partager"**
   - ✅ Modal s'ouvre
   - ✅ Titre: "Partager cette boutique"
   - ✅ Lien de la boutique affiché

4. **Copiez le lien et visitez-le**
   - Copiez le lien
   - Ouvrez un nouvel onglet
   - Collez et visitez
   - ✅ Vous devez arriver sur la page de la boutique

---

### Test 3: Partage Mobile (Si disponible)

1. **Ouvrir sur mobile** (ou simuler avec DevTools)

2. **Cliquez sur "Partager"**

3. **Si Web Share API disponible:**
   - ✅ Menu natif s'ouvre directement
   - ✅ Liste de toutes vos apps
   - Choisissez une app (ex: Messages, Gmail)
   - ✅ Contenu pré-rempli

4. **Si pas disponible:**
   - ✅ Modal standard s'affiche
   - ✅ Options manuelles disponibles

---

### Test 4: Partage Réseaux Sociaux

#### WhatsApp
```
Résultat attendu:
─────────────────
💬 WhatsApp
Nom du Produit
http://localhost:3000/product/slug
─────────────────
```

#### Facebook
```
Résultat attendu:
─────────────────
Preview card avec:
- Image du produit
- Titre
- Description
- Lien cliquable
─────────────────
```

#### Twitter
```
Résultat attendu:
─────────────────
Nom du Produit
http://localhost:3000/product/slug
[Tweeter]
─────────────────
```

#### Telegram
```
Résultat attendu:
─────────────────
Nom du Produit
http://localhost:3000/product/slug
[Envoyer]
─────────────────
```

---

## ✅ Checklist de Test

### Fonctionnel
- [ ] Modal s'ouvre au clic
- [ ] Lien affiché correctement
- [ ] Bouton "Copier" fonctionne
- [ ] Message "Copié" s'affiche
- [ ] Lien copié dans presse-papier
- [ ] WhatsApp s'ouvre avec bon lien
- [ ] Facebook s'ouvre avec bon lien
- [ ] Twitter s'ouvre avec bon lien
- [ ] Telegram s'ouvre avec bon lien
- [ ] Modal se ferme (backdrop)
- [ ] Modal se ferme (bouton ×)

### Design
- [ ] Animation slide-up fluide
- [ ] Boutons bien alignés
- [ ] Icônes visibles
- [ ] Textes lisibles
- [ ] Couleurs cohérentes
- [ ] Hover effects présents
- [ ] Responsive mobile
- [ ] Pas de débordement

### Produit
- [ ] Lien produit correct
- [ ] Titre produit affiché
- [ ] Description avec prix
- [ ] Type "product" passé

### Boutique
- [ ] Lien boutique correct
- [ ] Nom boutique affiché
- [ ] Description boutique
- [ ] Type "store" passé

---

## 🐛 Problèmes Possibles

### Le modal ne s'ouvre pas
**Solution:** Vérifier la console pour erreurs JavaScript

### Le lien n'est pas copié
**Solution:** Vérifier permissions navigateur pour clipboard

### WhatsApp ne s'ouvre pas
**Solution:** Vérifier que WhatsApp est installé ou Web accessible

### Animation saccadée
**Solution:** Vérifier GPU acceleration du navigateur

---

## 📱 Test sur Différents Navigateurs

### Chrome/Edge ✅
- Web Share API: ✅ (mobile)
- Clipboard API: ✅
- Modal: ✅

### Firefox ✅
- Web Share API: ❌ (utilise modal)
- Clipboard API: ✅
- Modal: ✅

### Safari ✅
- Web Share API: ✅ (iOS)
- Clipboard API: ✅
- Modal: ✅

---

## 🎉 Test Réussi !

Si tous les tests passent:
- ✅ Le système de partage fonctionne
- ✅ Les liens sont corrects
- ✅ Les réseaux sociaux s'ouvrent
- ✅ L'UX est fluide

**Prêt pour la production!** 🚀
