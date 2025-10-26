# 🚀 Guide Déploiement Hostinger - Hype Market

## 📋 Prérequis

- ✅ Code sur GitHub (fait ✓)
- ✅ Compte Hostinger avec plan Business ou Cloud
- ⚠️ **Important:** Hostinger doit supporter Node.js (vérifier votre plan)

---

## Étape 1: Préparer le Projet pour Hostinger

### 1.1 Créer Script de Build
Créez `ecosystem.config.js` à la racine:

```javascript
module.exports = {
  apps: [{
    name: 'hype-market',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

### 1.2 Modifier package.json
Ajoutez ces scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start -p 3000",
    "postinstall": "prisma generate"
  }
}
```

### 1.3 Créer .htaccess
Pour rediriger vers Node.js:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
```

---

## Étape 2: Configuration Hostinger

### 2.1 Accéder au Panel Hostinger
1. Connectez-vous sur https://hpanel.hostinger.com
2. Allez dans **"Sites Web"**
3. Sélectionnez votre domaine
4. Cliquez **"Avancé"** → **"SSH Access"**

### 2.2 Activer SSH
1. Activez **"SSH Access"**
2. Notez vos identifiants SSH:
   - **Host:** votre-domaine.com
   - **Port:** 65002 (généralement)
   - **Username:** u123456789
   - **Password:** votre-mot-de-passe

### 2.3 Activer Node.js
1. Dans hPanel, allez dans **"Avancé"**
2. Cherchez **"Select PHP Version"** ou **"Node.js"**
3. Si disponible, activez **Node.js 18.x** ou supérieur
4. ⚠️ **Si Node.js n'est pas disponible:** Vous devez upgrader vers Business ou Cloud Hosting

---

## Étape 3: Connexion SSH et Déploiement

### 3.1 Se Connecter en SSH

**Option A: Utiliser PuTTY (Windows)**
1. Téléchargez PuTTY: https://www.putty.org/
2. Ouvrez PuTTY
3. Entrez:
   - **Host:** votre-domaine.com
   - **Port:** 65002
   - **Connection Type:** SSH
4. Cliquez **"Open"**
5. Connectez-vous avec username/password

**Option B: Windows Terminal/PowerShell**
```bash
ssh u123456789@votre-domaine.com -p 65002
```

### 3.2 Installer Node.js (si nécessaire)
```bash
# Vérifier Node.js
node --version

# Si pas installé, télécharger NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Recharger
source ~/.bashrc

# Installer Node 18
nvm install 18
nvm use 18
```

### 3.3 Cloner le Projet depuis GitHub
```bash
# Aller dans le dossier public_html
cd ~/public_html

# Cloner le repo
git clone https://github.com/DavidTchimou225/hype-market.git

# Entrer dans le dossier
cd hype-market

# Installer les dépendances
npm install

# Build le projet
npm run build
```

---

## Étape 4: Configuration Base de Données

### 4.1 Créer Base de Données MySQL/PostgreSQL
1. Dans hPanel, allez dans **"Bases de données"**
2. Cliquez **"Créer une nouvelle base de données"**
3. Notez:
   - Nom de la base
   - Nom d'utilisateur
   - Mot de passe
   - Host (généralement localhost)

### 4.2 Modifier Prisma Schema
Dans `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "mysql"  // ou "postgresql"
  url      = env("DATABASE_URL")
}
```

### 4.3 Créer Fichier .env
```bash
nano .env
```

Ajoutez:
```env
# Base de données
DATABASE_URL="mysql://username:password@localhost:3306/dbname"

# Email
BREVO_API_KEY="votre-cle-brevo"
FROM_EMAIL="noreply@votre-domaine.com"

# JWT
JWT_SECRET="votre-secret-ultra-securise-changez-moi-123456"

# URL
NEXT_PUBLIC_BASE_URL="https://votre-domaine.com"
```

Sauvegarder: **Ctrl+X**, puis **Y**, puis **Enter**

### 4.4 Migrer la Base de Données
```bash
npx prisma migrate deploy
npx prisma db push
```

---

## Étape 5: Lancer l'Application

### 5.1 Installer PM2 (Gestionnaire de Processus)
```bash
npm install -g pm2
```

### 5.2 Démarrer l'Application
```bash
# Démarrer avec PM2
pm2 start npm --name "hype-market" -- start

# Configurer redémarrage automatique
pm2 startup
pm2 save

# Voir les logs
pm2 logs hype-market

# Voir le statut
pm2 status
```

### 5.3 Configurer Reverse Proxy
Créez/Modifiez `.htaccess` dans `public_html`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  
  # Exclure les fichiers statiques
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # Rediriger vers Node.js
  RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
</IfModule>
```

---

## Étape 6: Configuration Domaine

### 6.1 Pointer le Domaine
Si votre domaine n'est pas chez Hostinger:
1. Allez chez votre registrar
2. Modifiez les DNS:
   ```
   Type: A
   Name: @
   Value: [IP Hostinger]
   
   Type: A
   Name: www
   Value: [IP Hostinger]
   ```

### 6.2 Configurer SSL (HTTPS)
1. Dans hPanel, allez dans **"Sécurité"**
2. Cliquez **"SSL"**
3. Activez **"Let's Encrypt SSL"** (gratuit)
4. Attendez 10-15 minutes pour activation

---

## Étape 7: Configuration Email

### 7.1 Créer Adresses Email
1. Dans hPanel, allez dans **"Emails"**
2. Créez: `noreply@votre-domaine.com`
3. Notez les paramètres SMTP:
   - Host: smtp.hostinger.com
   - Port: 587
   - Security: STARTTLS

### 7.2 Ou Utiliser Brevo (Recommandé)
1. Créez compte sur https://www.brevo.com
2. Vérifiez votre domaine
3. Ajoutez les DNS records Brevo
4. Utilisez la clé API dans .env

---

## Étape 8: Optimisations

### 8.1 Compression Gzip
Dans `.htaccess`:
```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>
```

### 8.2 Cache des Fichiers Statiques
```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

---

## Commandes Utiles

### Gestion PM2
```bash
# Voir les apps
pm2 list

# Redémarrer
pm2 restart hype-market

# Arrêter
pm2 stop hype-market

# Supprimer
pm2 delete hype-market

# Logs en temps réel
pm2 logs hype-market --lines 100
```

### Mise à Jour depuis GitHub
```bash
cd ~/public_html/hype-market

# Récupérer les changements
git pull origin main

# Réinstaller si nécessaire
npm install

# Rebuild
npm run build

# Redémarrer
pm2 restart hype-market
```

### Debug
```bash
# Voir les logs Next.js
pm2 logs hype-market

# Tester si Node répond
curl http://localhost:3000

# Voir les processus
pm2 status

# Tester la base de données
npx prisma studio
```

---

## Troubleshooting

### Erreur: "Node.js not found"
→ Installer NVM et Node.js (voir Étape 3.2)

### Erreur: "Port 3000 already in use"
```bash
# Trouver le processus
lsof -i :3000

# Tuer le processus
kill -9 [PID]
```

### Erreur: "Permission denied"
```bash
# Donner les permissions
chmod -R 755 ~/public_html/hype-market
chown -R $USER:$USER ~/public_html/hype-market
```

### Site ne charge pas
1. Vérifier PM2: `pm2 status`
2. Vérifier logs: `pm2 logs`
3. Vérifier .htaccess
4. Vérifier DNS et SSL

### Base de données ne connecte pas
1. Vérifier DATABASE_URL dans .env
2. Vérifier que la DB existe
3. Tester: `npx prisma db push`

---

## Alternative: Déployer Build Statique

Si Node.js pose problème, vous pouvez exporter en statique:

### 1. Modifier next.config.js
```javascript
module.exports = {
  output: 'export',
  images: {
    unoptimized: true
  }
}
```

### 2. Build
```bash
npm run build
```

### 3. Uploader
- Le dossier `out/` contient les fichiers statiques
- Uploadez via FTP dans `public_html`

⚠️ **Limitations:** Pas d'API routes, pas de SSR

---

## Checklist Finale

- [ ] Code cloné sur Hostinger
- [ ] Node.js installé et fonctionnel
- [ ] `npm install` et `npm run build` réussis
- [ ] Base de données créée et migrée
- [ ] Fichier .env configuré
- [ ] PM2 lance l'app avec succès
- [ ] Reverse proxy .htaccess configuré
- [ ] Domaine pointe vers Hostinger
- [ ] SSL activé (HTTPS)
- [ ] Site accessible depuis le navigateur
- [ ] Admin peut se connecter
- [ ] Produits s'affichent
- [ ] Emails fonctionnent

---

## 🎉 Félicitations !

Votre marketplace **Hype Market** est maintenant en ligne sur Hostinger !

**URLs:**
- Site: https://votre-domaine.com
- Admin: https://votre-domaine.com/admin

**Support:**
- Hostinger: https://support.hostinger.com
- Chat Hostinger: 24/7 dans hPanel

---

## Coûts Hostinger

- **Business:** ~8,000-12,000 FCFA/mois
- **Cloud:** ~15,000-25,000 FCFA/mois
- **VPS:** ~20,000-50,000 FCFA/mois

Le plan Business devrait suffire pour démarrer.

Bon lancement ! 🚀
