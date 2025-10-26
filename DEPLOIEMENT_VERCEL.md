# 🚀 Guide Déploiement Vercel - Hype Market

## ✅ Modifications Effectuées

- [x] Prisma Schema changé: SQLite → PostgreSQL
- [x] Configuration prête pour Vercel

---

## 📋 ÉTAPE 1: Créer un Compte Vercel (2 minutes)

### 1. Allez sur Vercel
👉 **https://vercel.com/signup**

### 2. Connectez-vous avec GitHub
- Cliquez **"Continue with GitHub"**
- Autorisez Vercel à accéder à votre GitHub
- Vous serez redirigé vers le Dashboard Vercel

✅ **Compte créé !**

---

## 📦 ÉTAPE 2: Importer le Projet (1 minute)

### 1. Dans Vercel Dashboard
- Cliquez **"Add New..."** (bouton en haut à droite)
- Sélectionnez **"Project"**

### 2. Importer depuis GitHub
- Vous verrez vos repos GitHub
- Cherchez **"hype-market"**
- Cliquez **"Import"**

### 3. Configuration Auto-Détectée
Vercel détecte automatiquement:
```
✅ Framework: Next.js
✅ Root Directory: ./
✅ Build Command: npm run build
✅ Output Directory: .next
✅ Install Command: npm install
```

**Ne touchez à rien !** ✅

---

## 🗄️ ÉTAPE 3: Créer Base de Données PostgreSQL (3 minutes)

### 1. Dans votre Projet Vercel
- Allez dans l'onglet **"Storage"** (en haut)
- Cliquez **"Create Database"**

### 2. Sélectionnez PostgreSQL
- Choisissez **"Postgres"**
- Nom: `hype-market-db` (ou au choix)
- Région: **Washington, D.C., USA** (proche Europe/Afrique)
- Cliquez **"Create"**

### 3. Connecter à votre Projet
- Vercel vous demande: "Connect to project?"
- Sélectionnez **"hype-market"**
- Cliquez **"Connect"**

✅ **Base de données créée et connectée !**

**Important:** Vercel ajoute automatiquement `DATABASE_URL` dans vos variables d'environnement !

---

## ⚙️ ÉTAPE 4: Ajouter Variables d'Environnement (2 minutes)

### 1. Allez dans Settings
- Dans votre projet → **"Settings"**
- Puis **"Environment Variables"**

### 2. Ajoutez ces Variables

Cliquez **"Add"** pour chaque variable:

#### EMAIL (Brevo - Créez compte gratuit sur brevo.com)
```
Name: BREVO_API_KEY
Value: votre-cle-brevo-ici
Environment: Production, Preview, Development
```

```
Name: FROM_EMAIL
Value: noreply@votre-domaine.com
Environment: Production, Preview, Development
```

#### JWT SECRET (Générez un secret fort)
```
Name: JWT_SECRET
Value: changez-moi-secret-ultra-securise-123456789
Environment: Production, Preview, Development
```

#### URL DU SITE (Sera fournie après déploiement)
```
Name: NEXT_PUBLIC_BASE_URL
Value: https://hype-market.vercel.app
Environment: Production, Preview, Development
```

**Note:** DATABASE_URL est déjà ajoutée automatiquement par Vercel Postgres !

---

## 🚀 ÉTAPE 5: Déployer ! (3 minutes)

### 1. Retournez dans "Deployments"
- Cliquez sur l'onglet **"Deployments"**
- Cliquez **"Deploy"** (bouton en haut à droite)

### 2. Attendez le Build
Vercel va:
1. ✅ Installer les dépendances (1 min)
2. ✅ Générer Prisma Client (30 sec)
3. ✅ Build Next.js (2 min)
4. ✅ Déployer sur CDN (30 sec)

**Durée totale: ~4 minutes**

### 3. C'est En Ligne ! 🎉
- Vercel affiche: **"Deployment Ready"**
- URL: `https://hype-market.vercel.app` (ou similaire)
- Cliquez sur l'URL pour voir votre site !

---

## 🗄️ ÉTAPE 6: Initialiser la Base de Données (2 minutes)

### Important: Les tables ne sont pas encore créées !

### Option 1: Via Terminal Local (Recommandé)

Dans VS Code, terminal (`Ctrl + \``):

```bash
# 1. Installer dotenv-cli
npm install -g dotenv-cli

# 2. Créer fichier .env.production
# Copiez DATABASE_URL depuis Vercel (Settings → Environment Variables)
```

Créez `.env.production`:
```env
DATABASE_URL="postgres://default:xxx@xxx.postgres.vercel-storage.com/verceldb"
```

Puis:
```bash
# 3. Migrer la base
npx dotenv -e .env.production -- npx prisma migrate deploy

# Ou simplement:
npx dotenv -e .env.production -- npx prisma db push
```

### Option 2: Via Vercel CLI

```bash
# 1. Installer Vercel CLI
npm install -g vercel

# 2. Se connecter
vercel login

# 3. Lier au projet
vercel link

# 4. Pull les variables d'environnement
vercel env pull

# 5. Migrer
npx prisma migrate deploy
```

✅ **Tables créées dans PostgreSQL !**

---

## 🎯 ÉTAPE 7: Créer l'Admin Initial (1 minute)

### Via Prisma Studio

```bash
# Ouvrir Prisma Studio avec la DB de production
npx dotenv -e .env.production -- npx prisma studio
```

Puis dans le navigateur:
1. Ouvrez le modèle **"User"**
2. Cliquez **"Add record"**
3. Remplissez:
   ```
   email: admin@hypemarket.ci
   password: [hash bcrypt - voir ci-dessous]
   firstName: Admin
   lastName: Hype Market
   role: ADMIN
   isVerified: true
   ```

**Pour générer le hash du mot de passe:**

```bash
node -e "console.log(require('bcryptjs').hashSync('HypeAdmin2024!', 10))"
```

Copiez le résultat dans le champ `password`.

---

## ✅ ÉTAPE 8: Tester Votre Site ! (2 minutes)

### 1. Site Principal
```
https://hype-market.vercel.app
```
✅ Devrait afficher la page d'accueil

### 2. Admin
```
https://hype-market.vercel.app/admin/login
```
Connectez-vous avec:
- Email: `admin@hypemarket.ci`
- Mot de passe: `HypeAdmin2024!`

### 3. API
```
https://hype-market.vercel.app/api/products
```
✅ Devrait retourner `{"products": []}`

---

## 🔄 ÉTAPE 9: Mises à Jour Futures (automatique !)

### Workflow Automatique

1. **Sur votre PC:** Modifiez le code
2. **Commitez:**
   ```bash
   git add .
   git commit -m "Description des changements"
   git push origin main
   ```
3. **Vercel détecte automatiquement** le push
4. **Déploiement auto** en 2-3 minutes
5. **Site mis à jour !** ✅

**C'est tout !** Plus besoin de rien faire manuellement ! 🎉

---

## 🎨 ÉTAPE 10: Personnaliser le Domaine (Optionnel)

### Si vous avez un domaine personnalisé

1. **Dans Vercel:** Settings → Domains
2. **Ajoutez:** `hypemarket.ci` (ou votre domaine)
3. **Configurez DNS** chez votre registrar:
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```
4. **Attendez** 24-48h pour propagation DNS
5. **HTTPS automatique** par Vercel !

---

## 📊 Monitoring & Analytics

### Vercel Analytics (Gratuit)

1. **Dans votre projet:** Analytics
2. **Activez** Vercel Analytics
3. Vous verrez:
   - Visiteurs en temps réel
   - Pages vues
   - Pays des visiteurs
   - Performance

### Vercel Logs

- **Deployments** → Cliquez sur un déploiement
- **Runtime Logs** → Voir les logs en temps réel
- **Build Logs** → Voir les logs de build

---

## 🆘 Troubleshooting

### Erreur: "Build failed"
```
Solution:
1. Vérifiez les logs de build
2. Souvent: variables d'environnement manquantes
3. Vérifiez que DATABASE_URL est bien définie
```

### Erreur: "Database connection failed"
```
Solution:
1. Vérifiez que la DB Postgres est connectée
2. Storage → Postgres → Status: Connected
3. Vérifiez DATABASE_URL dans Environment Variables
```

### Erreur: "Tables not found"
```
Solution:
1. Vous devez migrer la base (Étape 6)
2. npx dotenv -e .env.production -- npx prisma db push
```

### Site affiche erreur 500
```
Solution:
1. Vérifiez les Runtime Logs
2. Souvent: problème de connexion DB
3. Ou variables d'environnement manquantes
```

---

## 💰 Coûts

### Plan Gratuit (Hobby)
```
✅ 100 GB bandwidth/mois
✅ 100 GB-Hrs compute/mois
✅ 6,000 build minutes/mois
✅ Postgres 256 MB (60h compute)
Coût: 0€
```

**Suffisant pour:**
- ~5,000 visiteurs/mois
- ~1M requêtes API/mois
- 500 produits, 5,000 utilisateurs

### Upgrade vers Pro ($20/mois) si:
- Plus de 100 GB bandwidth
- Plus de 256 MB database
- Besoin analytics avancées
- Support prioritaire

---

## ✅ Checklist Finale

- [ ] Compte Vercel créé avec GitHub
- [ ] Projet "hype-market" importé
- [ ] Base de données Postgres créée et connectée
- [ ] Variables d'environnement ajoutées
- [ ] Premier déploiement réussi
- [ ] Tables migrées (npx prisma db push)
- [ ] Admin créé dans la base
- [ ] Site accessible et fonctionne
- [ ] Admin peut se connecter
- [ ] API fonctionnent

---

## 🎉 Félicitations !

Votre **Hype Market** est maintenant en ligne sur Vercel !

### URLs:
```
🌐 Site: https://hype-market.vercel.app
👨‍💼 Admin: https://hype-market.vercel.app/admin
📊 Dashboard Vercel: https://vercel.com/dashboard
```

### Prochaines Étapes:
1. ✅ Ajouter produits via admin
2. ✅ Inviter vendeurs
3. ✅ Tester toutes les fonctionnalités
4. ✅ Partager le lien !
5. ✅ Monitorer analytics

---

## 📞 Support

- **Vercel Docs:** https://vercel.com/docs
- **Vercel Discord:** https://vercel.com/discord
- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs

---

**Bon lancement ! 🚀🇨🇮**
