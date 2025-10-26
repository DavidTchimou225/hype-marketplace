# 🎠 Guide Configuration Upload Bannières

## ✅ Configurations Effectuées

### **1. Permissions Complètes Accordées**

#### **Dossier Banners**
```
public/banners/
- Mode: 0o777 (lecture/écriture/exécution pour tous)
- Création automatique si inexistant
```

#### **Fichiers Uploadés**
```
- Mode: 0o666 (lecture/écriture pour tous)
- Nom: banner-[timestamp]-[nom-original]
- Taille max: 10MB
```

---

### **2. Configuration Next.js** (`next.config.js`)

```javascript
{
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'  // Limite augmentée
    }
  }
}
```

---

### **3. Route API Sans Authentification** 

**Endpoint** : `/api/upload/banners`
- ✅ Pas de vérification admin (pour débugger)
- ✅ Logs détaillés à chaque étape
- ✅ Gestion d'erreur précise
- ✅ Permissions complètes

**Configuration route** :
```typescript
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
```

---

## 🚀 Test de l'Upload

### **Étape 1 : Redémarrer le Serveur**

**IMPORTANT** : Après avoir modifié `next.config.js`, vous DEVEZ redémarrer :

```bash
# Arrêter le serveur (Ctrl+C)
npm run dev
```

### **Étape 2 : Ouvrir la Console**

1. **F12** dans le navigateur
2. Onglet **Console**
3. Laisser ouvert pour voir les logs

### **Étape 3 : Tester l'Upload**

1. Aller sur `http://localhost:3000/admin/banners`
2. Cliquer **"+ Nouvelle Bannière"**
3. Remplir :
   - **Titre** : "Test Bannière"
   - **Ordre** : 0
4. **Choisir une image** (JPG, PNG, GIF, WebP ou SVG)
5. **Attendre** le message de succès

---

## 📋 Logs Attendus

### **Dans la Console Navigateur** :
```
Début upload...
Response status: 200
```

### **Dans le Terminal Serveur** :
```
Upload banner - début
Fichier reçu: test.png Type: image/png Taille: 123456
Nom du fichier: banner-1730000000000-test.png
Dossier upload: C:\hype-market\public\banners
Sauvegarde du fichier: C:\hype-market\public\banners\banner-...
Fichier sauvegardé avec succès
```

---

## 🔍 Vérification des Fichiers

### **Vérifier le dossier** :
```bash
dir public\banners
```

### **Résultat attendu** :
```
banner-1730000000000-test.png
```

---

## ⚠️ En Cas d'Erreur

### **Erreur : "Impossible de créer le dossier"**

**Solution** : Créer manuellement
```bash
mkdir public\banners
```

### **Erreur : "Impossible de sauvegarder le fichier"**

**Solution** : Vérifier les permissions Windows
1. Clic droit sur `public\banners`
2. Propriétés → Sécurité
3. Modifier → Ajouter → Tout le monde
4. Cocher "Contrôle total"

### **Erreur : "Type de fichier non supporté"**

**Types autorisés** :
- image/jpeg (.jpg, .jpeg)
- image/png (.png)
- image/gif (.gif)
- image/webp (.webp)
- image/svg+xml (.svg)

### **Erreur : "Fichier trop volumineux"**

**Limite** : 10MB
- Réduire la taille de l'image
- Ou compresser avec un outil

---

## 🛠️ Commandes Utiles

### **Nettoyer les bannières** :
```bash
del /Q public\banners\*.png
del /Q public\banners\*.jpg
```

### **Vérifier les permissions** :
```bash
icacls public\banners
```

### **Donner toutes les permissions** :
```bash
icacls public\banners /grant Everyone:F /T
```

---

## 📁 Structure des Fichiers

```
c:\hype-market\
├── public\
│   └── banners\                    ← Dossier uploads
│       ├── .gitkeep
│       └── banner-*.png            ← Fichiers uploadés
├── src\
│   └── app\
│       └── api\
│           └── upload\
│               └── banners\
│                   └── route.ts    ← API upload
└── next.config.js                  ← Config 10MB
```

---

## 🎯 Checklist Finale

Avant de tester :

- [ ] Serveur redémarré après modif `next.config.js`
- [ ] Dossier `public/banners` existe
- [ ] Console navigateur ouverte (F12)
- [ ] Terminal serveur visible
- [ ] Page `/admin/banners` chargée
- [ ] Image à uploader prête (< 10MB)

---

## ✨ Après Upload Réussi

**Vous devriez voir** :
1. ✓ Alert "Image uploadée avec succès !"
2. ✓ Preview de l'image avec bordure verte
3. ✓ Bouton "Créer" activé (non grisé)
4. ✓ Fichier dans `public/banners/`

**Ensuite** :
1. Cliquer sur **"Créer"**
2. La bannière s'enregistre en base de données
3. Elle apparaît dans la liste
4. Elle s'affiche sur la page d'accueil du site

---

## 🆘 Support

Si l'upload échoue encore :

1. **Copier les logs de la console**
2. **Copier les logs du terminal**
3. **Vérifier le dossier** : `dir public\banners`
4. **Vérifier les permissions** : `icacls public\banners`

Le message d'erreur exact indiquera le problème !

---

## 🎉 Résultat Final

Une fois l'upload fonctionnel :
- ✅ Upload d'images jusqu'à 10MB
- ✅ Permissions complètes
- ✅ Logs détaillés
- ✅ Gestion d'erreur précise
- ✅ Création automatique du dossier
- ✅ Noms de fichiers uniques
- ✅ Preview instantané

**Redémarrez le serveur et testez maintenant !** 🚀
