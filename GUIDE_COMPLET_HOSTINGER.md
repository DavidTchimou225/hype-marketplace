# 🎯 Guide Complet - Déployer Hype Market sur Hostinger

## 📋 Vue d'Ensemble

Ce guide vous accompagne **étape par étape** pour mettre Hype Market en ligne sur Hostinger.

**Temps estimé:** 1-2 heures  
**Niveau:** Intermédiaire  
**Prérequis:** Plan Hostinger Business ou supérieur

---

## 🚀 PHASE 1: Préparation (Sur Votre PC)

### ✅ Déjà Fait
- [x] Code sur GitHub
- [x] Tous les fichiers de configuration créés

### 📦 Fichiers Créés pour Vous

1. **ecosystem.config.js** - Configuration PM2
2. **.htaccess** - Reverse proxy et sécurité
3. **.env.production** - Template variables environnement
4. **deploy.sh** - Script de déploiement automatique
5. **COMMANDES_HOSTINGER.md** - Toutes les commandes utiles
6. **DATABASE_HOSTINGER_SETUP.md** - Configuration MySQL

### 🔄 Commiter ces Nouveaux Fichiers

```bash
# Dans le terminal VS Code (Ctrl + `)
cd c:\hype-market
git add .
git commit -m "Configuration Hostinger ajoutee"
git push origin main
```

---

## 🗄️ PHASE 2: Créer la Base de Données

### Étape 1: Accéder à hPanel
1. Allez sur https://hpanel.hostinger.com
2. Connectez-vous
3. Sélectionnez votre site web

### Étape 2: Créer la Base MySQL
1. Cliquez sur **"Bases de données"** dans le menu
2. Cliquez **"Créer une nouvelle base de données"**
3. Remplissez:
   ```
   Nom de la base: u123456789_hypemarket
   Nom d'utilisateur: u123456789_hype
   Mot de passe: [Générer un mot de passe fort]
   ```
4. Cliquez **"Créer"**

### Étape 3: Noter les Informations ⚠️ IMPORTANT
Ouvrez un fichier texte et notez:
```
Database: u123456789_hypemarket
Username: u123456789_hype
Password: LeMotDePasseGenere
Host: localhost
Port: 3306
```

**👉 Vous en aurez besoin à l'étape suivante !**

---

## 🔐 PHASE 3: Activer SSH

### Étape 1: Activer SSH dans hPanel
1. Dans hPanel, allez dans **"Avancé"**
2. Cherchez **"SSH Access"**
3. Activez SSH
4. Notez vos identifiants:
   ```
   Host: votre-domaine.com
   Port: 65002
   Username: u123456789
   Password: [Votre mot de passe hPanel]
   ```

### Étape 2: Se Connecter
**Windows PowerShell:**
```powershell
ssh u123456789@votre-domaine.com -p 65002
```

Tapez `yes` puis entrez votre mot de passe.

**✅ Vous êtes maintenant sur le serveur !**

---

## 📥 PHASE 4: Installation sur le Serveur

### Étape 1: Installer Node.js

```bash
# Vérifier si Node est installé
node --version

# Si pas installé ou version < 18:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# Vérifier
node --version  # Devrait afficher v18.x.x
npm --version
```

### Étape 2: Aller dans le Dossier Web

```bash
cd ~/public_html
```

### Étape 3: Cloner le Projet depuis GitHub

```bash
git clone https://github.com/DavidTchimou225/hype-market.git
cd hype-market
```

### Étape 4: Installer les Dépendances

```bash
npm install
```

**⏳ Attendez 2-3 minutes...**

---

## ⚙️ PHASE 5: Configuration

### Étape 1: Créer le Fichier .env

```bash
nano .env
```

### Étape 2: Coller cette Configuration

**Remplacez les valeurs entre crochets par vos vraies infos !**

```env
# Base de données (Infos de l'Étape 2)
DATABASE_URL="mysql://[USERNAME]:[PASSWORD]@localhost:3306/[DATABASE]"

# Exemple:
# DATABASE_URL="mysql://u123456789_hype:VotreMotDePasse@localhost:3306/u123456789_hypemarket"

# Email Brevo (Créez un compte gratuit sur brevo.com)
BREVO_API_KEY="votre-cle-brevo"
FROM_EMAIL="noreply@votre-domaine.com"

# JWT Secret (Changez-moi!)
JWT_SECRET="changez-moi-avec-un-secret-ultra-securise-123456789"

# URL de votre site
NEXT_PUBLIC_BASE_URL="https://votre-domaine.com"

# Environment
NODE_ENV="production"
```

**Sauvegarder:**
- Appuyez sur `Ctrl+X`
- Tapez `Y`
- Appuyez sur `Enter`

### Étape 3: Modifier Prisma pour MySQL

```bash
nano prisma/schema.prisma
```

**Cherchez cette ligne:**
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

**Remplacez par:**
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

**Sauvegarder:** `Ctrl+X`, `Y`, `Enter`

---

## 🏗️ PHASE 6: Build et Migration

### Étape 1: Générer Prisma Client

```bash
npx prisma generate
```

### Étape 2: Créer les Tables

```bash
npx prisma migrate deploy
```

Ou si erreur:
```bash
npx prisma db push
```

**✅ Les tables sont créées dans MySQL !**

### Étape 3: Build l'Application

```bash
npm run build
```

**⏳ Attendez 3-5 minutes...**

---

## 🚀 PHASE 7: Lancer l'Application

### Étape 1: Installer PM2

```bash
npm install -g pm2
```

### Étape 2: Démarrer l'App

```bash
pm2 start ecosystem.config.js
```

### Étape 3: Configurer Démarrage Auto

```bash
pm2 startup
pm2 save
```

### Étape 4: Vérifier que ça Fonctionne

```bash
pm2 status
```

Vous devriez voir:
```
┌─────┬──────────────┬─────────┬─────────┬─────────┐
│ id  │ name         │ status  │ restart │ uptime  │
├─────┼──────────────┼─────────┼─────────┼─────────┤
│ 0   │ hype-market  │ online  │ 0       │ 2s      │
└─────┴──────────────┴─────────┴─────────┴─────────┘
```

**✅ Si status = "online", c'est bon !**

### Étape 5: Voir les Logs

```bash
pm2 logs hype-market
```

Appuyez sur `Ctrl+C` pour sortir.

---

## 🌐 PHASE 8: Configurer Apache (Reverse Proxy)

### Étape 1: Créer .htaccess

Le fichier existe déjà dans votre repo, vérifiez:

```bash
ls -la | grep .htaccess
```

Si pas présent, créez-le:

```bash
nano .htaccess
```

Copiez le contenu du fichier `.htaccess` que j'ai créé.

### Étape 2: Tester

```bash
curl http://localhost:3000
```

Vous devriez voir du HTML.

---

## 🔒 PHASE 9: Activer HTTPS

### Dans hPanel

1. Allez dans **"Sécurité"**
2. Cliquez sur **"SSL"**
3. Sélectionnez **"Let's Encrypt SSL"** (gratuit)
4. Cliquez **"Installer"**

**⏳ Attendez 10-15 minutes pour activation**

---

## 🎉 PHASE 10: Test Final

### Ouvrez votre navigateur

Allez sur: `https://votre-domaine.com`

**✅ Vous devriez voir Hype Market !**

### Tester l'Admin

1. Allez sur: `https://votre-domaine.com/admin/login`
2. Connectez-vous avec:
   ```
   Email: admin@hypemarket.ci
   Mot de passe: HypeAdmin2024!
   ```

**✅ Si ça fonctionne, FÉLICITATIONS ! 🎉**

---

## 🔄 Mise à Jour Future

Quand vous faites des changements:

### Sur Votre PC
```bash
git add .
git commit -m "Description des changements"
git push origin main
```

### Sur le Serveur (SSH)
```bash
cd ~/public_html/hype-market
./deploy.sh
```

**C'est tout ! 🚀**

---

## 📞 Besoin d'Aide ?

### Guides Détaillés
- **DEPLOIEMENT_HOSTINGER.md** - Guide technique complet
- **COMMANDES_HOSTINGER.md** - Toutes les commandes
- **DATABASE_HOSTINGER_SETUP.md** - Configuration MySQL

### Commandes Utiles
```bash
# Voir le statut
pm2 status

# Voir les logs
pm2 logs hype-market

# Redémarrer
pm2 restart hype-market

# Se déconnecter de SSH
exit
```

### Support Hostinger
- Chat 24/7 dans hPanel
- Support: https://support.hostinger.com
- Email: success@hostinger.com

---

## ✅ Checklist Finale

- [ ] Base de données MySQL créée
- [ ] SSH activé et fonctionnel
- [ ] Node.js 18 installé
- [ ] Projet cloné depuis GitHub
- [ ] npm install terminé
- [ ] .env configuré correctement
- [ ] prisma/schema.prisma modifié pour MySQL
- [ ] Tables créées (npx prisma migrate deploy)
- [ ] npm run build réussi
- [ ] PM2 installé et app démarrée
- [ ] pm2 startup et pm2 save exécutés
- [ ] .htaccess configuré
- [ ] Site accessible en HTTP
- [ ] SSL activé (HTTPS)
- [ ] Page admin accessible
- [ ] Test de connexion admin réussi

---

## 🎯 Résumé Ultra-Rapide

```bash
# 1. Connexion SSH
ssh u123456789@domaine.com -p 65002

# 2. Installation
cd ~/public_html
git clone https://github.com/DavidTchimou225/hype-market.git
cd hype-market
npm install

# 3. Configuration
nano .env  # Coller la config
nano prisma/schema.prisma  # Changer vers mysql

# 4. Build
npx prisma generate
npx prisma migrate deploy
npm run build

# 5. Lancer
npm install -g pm2
pm2 start ecosystem.config.js
pm2 startup
pm2 save

# 6. Vérifier
pm2 status
```

**Votre site est en ligne ! 🚀**

---

## 🎊 Félicitations !

Vous avez déployé **Hype Market** sur Hostinger avec succès !

Maintenant vous pouvez:
- ✅ Gérer les produits depuis l'admin
- ✅ Inviter des vendeurs
- ✅ Recevoir des commandes
- ✅ Développer votre marketplace !

**Bon succès avec Hype Market ! 🛍️🇨🇮**
