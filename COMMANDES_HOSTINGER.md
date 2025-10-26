# 📝 Commandes Hostinger - Guide Rapide

## 🔐 Se Connecter en SSH

### Windows PowerShell
```powershell
ssh u123456789@votre-domaine.com -p 65002
```

### Remplacez:
- `u123456789` par votre username Hostinger
- `votre-domaine.com` par votre domaine
- `65002` par le port SSH (vérifiez dans hPanel)

---

## 📥 Installation Initiale (Première Fois)

### 1. Aller dans le dossier web
```bash
cd ~/public_html
```

### 2. Cloner le projet depuis GitHub
```bash
git clone https://github.com/DavidTchimou225/hype-market.git
cd hype-market
```

### 3. Installer Node.js (si nécessaire)
```bash
# Vérifier si Node est installé
node --version

# Si pas installé, installer NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Recharger le shell
source ~/.bashrc

# Installer Node 18
nvm install 18
nvm use 18

# Vérifier
node --version
npm --version
```

### 4. Installer les dépendances
```bash
npm install
```

### 5. Configurer les variables d'environnement
```bash
nano .env
```

Copiez le contenu de `.env.production` et modifiez:
- DATABASE_URL avec vos infos MySQL
- BREVO_API_KEY avec votre clé
- JWT_SECRET avec un secret unique
- NEXT_PUBLIC_BASE_URL avec votre domaine

**Sauvegarder:** `Ctrl+X`, puis `Y`, puis `Enter`

### 6. Créer la base de données
```bash
# Générer le client Prisma
npx prisma generate

# Créer les tables
npx prisma migrate deploy
# ou
npx prisma db push
```

### 7. Build le projet
```bash
npm run build
```

### 8. Installer PM2
```bash
npm install -g pm2
```

### 9. Démarrer l'application
```bash
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

### 10. Vérifier que ça fonctionne
```bash
pm2 status
pm2 logs hype-market
curl http://localhost:3000
```

---

## 🔄 Mise à Jour (Après Modifications)

### Méthode Automatique (Recommandée)
```bash
cd ~/public_html/hype-market
chmod +x deploy.sh
./deploy.sh
```

### Méthode Manuelle
```bash
cd ~/public_html/hype-market

# 1. Récupérer les changements
git pull origin main

# 2. Réinstaller si package.json a changé
npm install

# 3. Rebuild
npm run build

# 4. Redémarrer
pm2 restart hype-market
```

---

## 🛠️ Gestion PM2

### Voir les applications
```bash
pm2 list
```

### Voir les logs
```bash
# Logs en temps réel
pm2 logs hype-market

# Dernières 100 lignes
pm2 logs hype-market --lines 100

# Logs d'erreur uniquement
pm2 logs hype-market --err
```

### Redémarrer
```bash
pm2 restart hype-market
```

### Arrêter
```bash
pm2 stop hype-market
```

### Supprimer
```bash
pm2 delete hype-market
```

### Voir les infos détaillées
```bash
pm2 show hype-market
```

### Monitorer en temps réel
```bash
pm2 monit
```

---

## 🗄️ Gestion Base de Données

### Ouvrir Prisma Studio
```bash
cd ~/public_html/hype-market
npx prisma studio
```
Puis ouvrez: http://localhost:5555 (tunneling SSH peut être nécessaire)

### Migrer la base
```bash
npx prisma migrate deploy
```

### Reset la base (⚠️ Supprime toutes les données)
```bash
npx prisma migrate reset
```

### Exporter les données
```bash
# Via mysqldump
mysqldump -u username -p dbname > backup.sql
```

### Importer les données
```bash
mysql -u username -p dbname < backup.sql
```

---

## 📊 Monitoring & Debug

### Voir les processus Node
```bash
ps aux | grep node
```

### Vérifier le port 3000
```bash
lsof -i :3000
```

### Tuer un processus
```bash
kill -9 [PID]
```

### Voir l'utilisation mémoire
```bash
free -h
```

### Voir l'espace disque
```bash
df -h
```

### Voir les logs Apache
```bash
tail -f ~/logs/error.log
tail -f ~/logs/access.log
```

---

## 📁 Gestion Fichiers

### Voir les fichiers
```bash
ls -la
```

### Éditer un fichier
```bash
nano fichier.txt
# ou
vim fichier.txt
```

### Copier un fichier
```bash
cp source.txt destination.txt
```

### Supprimer un fichier
```bash
rm fichier.txt
```

### Permissions
```bash
# Donner permissions lecture/écriture/exécution
chmod 755 fichier.sh

# Propriétaire
chown user:group fichier.txt

# Récursif pour un dossier
chmod -R 755 dossier/
```

---

## 🔧 Utilitaires

### Nettoyer le cache npm
```bash
npm cache clean --force
```

### Voir la version Node
```bash
node --version
npm --version
```

### Changer de version Node
```bash
nvm list
nvm use 18
```

### Variables d'environnement
```bash
# Voir toutes les variables
printenv

# Voir une variable spécifique
echo $DATABASE_URL
```

---

## 🚨 Troubleshooting

### "Port 3000 already in use"
```bash
# Trouver le processus
lsof -i :3000

# Tuer le processus
kill -9 [PID]

# Ou avec fuser
fuser -k 3000/tcp
```

### "Permission denied"
```bash
chmod -R 755 ~/public_html/hype-market
chown -R $USER:$USER ~/public_html/hype-market
```

### "npm command not found"
```bash
# Installer NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
```

### "Database connection failed"
```bash
# Vérifier le fichier .env
cat .env

# Tester la connexion
npx prisma db push
```

### Site ne charge pas
```bash
# 1. Vérifier PM2
pm2 status

# 2. Voir les logs
pm2 logs hype-market

# 3. Tester localhost
curl http://localhost:3000

# 4. Vérifier .htaccess
cat .htaccess

# 5. Redémarrer Apache (si nécessaire)
# Contacter support Hostinger pour cette commande
```

---

## 📞 Support

### Logs PM2
```bash
# Logs complets
pm2 logs hype-market --lines 500

# Exporter les logs
pm2 logs hype-market --lines 1000 > logs.txt
```

### Informations système
```bash
# Version Linux
uname -a

# Espace disque
df -h

# Mémoire
free -m

# Processus
top
```

---

## ⚡ Commandes Rapides (Mémo)

```bash
# Se connecter
ssh u123456789@domaine.com -p 65002

# Aller dans le projet
cd ~/public_html/hype-market

# Mettre à jour
./deploy.sh

# Voir les logs
pm2 logs

# Redémarrer
pm2 restart hype-market

# Statut
pm2 status
```

---

## 🎯 Checklist Déploiement

- [ ] SSH activé dans hPanel
- [ ] Node.js installé (v18+)
- [ ] Projet cloné depuis GitHub
- [ ] npm install terminé
- [ ] .env configuré avec bonnes valeurs
- [ ] Base de données créée dans hPanel
- [ ] Prisma migré (npx prisma migrate deploy)
- [ ] npm run build réussi
- [ ] PM2 installé globalement
- [ ] Application démarrée avec PM2
- [ ] pm2 startup et pm2 save exécutés
- [ ] .htaccess créé avec reverse proxy
- [ ] Site accessible depuis navigateur
- [ ] SSL activé (HTTPS)
- [ ] Emails configurés et testés

---

Gardez ce fichier ouvert pendant que vous travaillez sur Hostinger ! 📖
