# 🚀 Lancement Rapide - Hype Market sur Hostinger

## ✅ Étapes Essentielles (30 minutes)

### 1️⃣ Créer Base de Données (5 min)
👉 **hPanel → Bases de données → Créer**
- Nom: `u123456789_hypemarket`
- User: `u123456789_hype`
- **Notez le mot de passe !**

### 2️⃣ Activer SSH (2 min)
👉 **hPanel → Avancé → SSH Access → Activer**
- **Notez les identifiants !**

### 3️⃣ Se Connecter SSH (1 min)
```bash
ssh u123456789@votre-domaine.com -p 65002
```

### 4️⃣ Installer Node.js (3 min)
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

### 5️⃣ Cloner le Projet (2 min)
```bash
cd ~/public_html
git clone https://github.com/DavidTchimou225/hype-market.git
cd hype-market
```

### 6️⃣ Installer Dépendances (3 min)
```bash
npm install
```

### 7️⃣ Configurer .env (3 min)
```bash
nano .env
```
Coller:
```env
DATABASE_URL="mysql://[USER]:[PASS]@localhost:3306/[DB]"
BREVO_API_KEY="votre-cle"
FROM_EMAIL="noreply@domaine.com"
JWT_SECRET="changez-moi-secret-123"
NEXT_PUBLIC_BASE_URL="https://domaine.com"
NODE_ENV="production"
```
`Ctrl+X`, `Y`, `Enter`

### 8️⃣ Configurer MySQL (2 min)
```bash
nano prisma/schema.prisma
```
Changer `provider = "sqlite"` → `provider = "mysql"`
`Ctrl+X`, `Y`, `Enter`

### 9️⃣ Build (5 min)
```bash
npx prisma generate
npx prisma migrate deploy
npm run build
```

### 🔟 Lancer (2 min)
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

### ✅ Vérifier
```bash
pm2 status
```
👉 Si "online" → **C'EST BON ! 🎉**

### 🌐 Tester
Ouvrez: `https://votre-domaine.com`

---

## 🆘 Problème ?

### App ne démarre pas
```bash
pm2 logs hype-market
```

### Base de données erreur
```bash
cat .env | grep DATABASE_URL
npx prisma db push
```

### Site ne charge pas
1. Vérifier PM2: `pm2 status`
2. Vérifier SSL dans hPanel
3. Attendre 10-15 min pour SSL

---

## 📚 Guides Complets

- **GUIDE_COMPLET_HOSTINGER.md** - Guide détaillé pas à pas
- **COMMANDES_HOSTINGER.md** - Toutes les commandes
- **DATABASE_HOSTINGER_SETUP.md** - Configuration MySQL
- **DEPLOIEMENT_HOSTINGER.md** - Guide technique

---

## ⚡ Commandes Quotidiennes

### Voir l'état
```bash
ssh u123456789@domaine.com -p 65002
cd ~/public_html/hype-market
pm2 status
```

### Mettre à jour
```bash
./deploy.sh
```

### Voir les logs
```bash
pm2 logs hype-market
```

---

## 🎯 C'est Simple !

1. **Créer DB** → 5 min
2. **SSH** → 2 min
3. **Installer** → 15 min
4. **Lancer** → 5 min
5. **✅ EN LIGNE !**

**Total: ~30 minutes** 🚀

---

## 📞 Support

- **Chat Hostinger:** Dans hPanel (24/7)
- **Guides:** Tous les fichiers .md
- **Logs:** `pm2 logs hype-market`

Vous êtes prêt ! 🎉
