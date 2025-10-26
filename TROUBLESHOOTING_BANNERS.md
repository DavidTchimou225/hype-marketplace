# 🔍 Guide Dépannage - Création de Bannières

## Problème Identifié
La bannière ne se crée pas via l'interface admin.

## ✅ Tests Effectués

### 1. Base de données
- ✅ Modèle Banner existe dans le schema
- ✅ Prisma Client régénéré
- ✅ Migration effectuée avec `prisma db push`
- ✅ Test de création/suppression réussi

### 2. Serveur
- ✅ Serveur Next.js démarré sur http://localhost:3000
- ✅ API `/api/admin/banners` accessible
- ✅ API `/api/upload/banners` accessible

## 🐛 Points de Vérification

### Étape 1: Vérifier la Connexion Admin
1. Ouvrez http://localhost:3000/admin/login
2. Connectez-vous avec:
   - Email: `admin@hypemarket.ci`
   - Mot de passe: `HypeAdmin2024!`
3. Vérifiez que vous êtes redirigé vers le dashboard

### Étape 2: Tester l'Upload d'Image
1. Allez sur http://localhost:3000/admin/banners
2. Cliquez sur "+ Nouvelle Bannière"
3. Ouvrez la Console du navigateur (F12)
4. Sélectionnez une image (max 10MB, formats: JPG, PNG, GIF, WebP, SVG)
5. Regardez les logs dans la console

**Logs attendus:**
```
Début upload...
Response status: 200
```

**Si erreur:**
- Vérifier que le dossier `public/banners` existe et a les permissions d'écriture
- Vérifier que l'image est < 10MB
- Vérifier le format (JPG, PNG, GIF, WebP, SVG)

### Étape 3: Tester la Création
1. Après upload réussi, remplissez:
   - Titre (requis)
   - Description (optionnel)
   - Lien (optionnel, ex: /category/promo)
   - Ordre (0 par défaut)
   - ✓ Bannière active
2. Cliquez sur "Créer"
3. Regardez les logs console

**Logs attendus:**
```
handleSubmit - formData: {...}
Envoi requête: POST /api/admin/banners {...}
Response status: 201
```

## 🔧 Solutions aux Problèmes Courants

### Problème 1: "Accès non autorisé"
**Cause:** Token admin expiré ou invalide  
**Solution:**
1. Déconnectez-vous
2. Reconnectez-vous sur `/admin/login`
3. Vérifiez que le cookie `admin-token` existe (F12 > Application > Cookies)

### Problème 2: "Aucun fichier fourni"
**Cause:** Upload d'image échoué  
**Solution:**
1. Vérifiez les permissions du dossier `public/banners`
2. Essayez avec une image plus petite (< 5MB)
3. Vérifiez le format de l'image

### Problème 3: "Le titre et l'image sont obligatoires"
**Cause:** Champs requis manquants  
**Solution:**
1. Assurez-vous d'avoir uploadé une image (message vert "✓ Image uploadée")
2. Remplissez le champ Titre
3. Ne soumettez pas tant que l'upload n'est pas terminé

### Problème 4: Image ne s'affiche pas
**Cause:** Chemin d'image incorrect  
**Solution:**
1. Vérifiez que l'image est dans `public/banners/`
2. Le chemin doit être `/banners/banner-[timestamp]-[nom].jpg`
3. Actualisez la page (Ctrl+F5)

### Problème 5: "Vous ne pouvez pas avoir plus de 5 bannières actives"
**Cause:** Limite de 5 bannières actives atteinte  
**Solution:**
1. Désactivez une bannière existante (modifier > décocher "Bannière active")
2. Ou créez la nouvelle bannière en mode inactif

## 🧪 Test Manuel Complet

### Test 1: Upload Simple
```bash
# Dans un autre terminal PowerShell
# Créer une image de test
$null = New-Item -ItemType Directory -Path "c:\hype-market\public\banners" -Force
```

### Test 2: Créer Bannière via Script
Créez un fichier `test-create-banner.html` et ouvrez-le dans le navigateur:

```html
<!DOCTYPE html>
<html>
<head><title>Test Bannière</title></head>
<body>
<h1>Test Création Bannière</h1>
<input type="file" id="fileInput" accept="image/*">
<button onclick="testUpload()">Test Upload</button>
<button onclick="testCreate()">Test Create</button>
<pre id="log"></pre>

<script>
let imagePath = '';

async function testUpload() {
  const file = document.getElementById('fileInput').files[0];
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch('http://localhost:3000/api/upload/banners', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });
    
    const data = await response.json();
    document.getElementById('log').textContent = JSON.stringify(data, null, 2);
    
    if (data.path) {
      imagePath = data.path;
      alert('Upload réussi: ' + imagePath);
    }
  } catch (error) {
    document.getElementById('log').textContent = error.message;
  }
}

async function testCreate() {
  if (!imagePath) {
    alert('Uploadez d\'abord une image');
    return;
  }
  
  try {
    const response = await fetch('http://localhost:3000/api/admin/banners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        title: 'Bannière Test',
        description: 'Test description',
        image: imagePath,
        link: '/test',
        order: 0,
        isActive: true
      })
    });
    
    const data = await response.json();
    document.getElementById('log').textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    document.getElementById('log').textContent = error.message;
  }
}
</script>
</body>
</html>
```

## 📋 Checklist de Vérification

Avant de créer une bannière, assurez-vous que:

- [ ] Le serveur Next.js est démarré (`npm run dev`)
- [ ] Vous êtes connecté en tant qu'admin
- [ ] Le dossier `public/banners` existe
- [ ] L'image est < 10MB
- [ ] L'image est dans un format supporté (JPG, PNG, GIF, WebP, SVG)
- [ ] La console du navigateur est ouverte (F12) pour voir les logs
- [ ] Il y a moins de 5 bannières actives

## 🆘 Si Rien ne Fonctionne

### Réinitialisation Complète

1. **Arrêter le serveur** (Ctrl+C)

2. **Régénérer Prisma**
```bash
npx prisma generate
npx prisma db push
```

3. **Nettoyer le cache Next.js**
```bash
Remove-Item -Path .next -Recurse -Force
```

4. **Redémarrer le serveur**
```bash
npm run dev
```

5. **Vider le cache du navigateur**
- Chrome: Ctrl+Shift+Delete
- Ou mode navigation privée

6. **Se reconnecter à l'admin**
- http://localhost:3000/admin/login

## 📞 Besoin d'Aide?

Si le problème persiste:

1. Envoyez-moi les logs de la console (F12)
2. Envoyez-moi les logs du serveur terminal
3. Vérifiez le fichier `.env` contient `JWT_SECRET`
4. Vérifiez les permissions du dossier `public/`

## 🎯 Test Rapide

Exécutez ce test pour vérifier l'état du système:

```bash
node test-banner-creation.js
```

Si ce test réussit mais l'interface échoue, le problème est dans l'authentification ou l'interface utilisateur.
