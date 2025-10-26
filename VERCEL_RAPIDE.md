# ⚡ Déploiement Vercel - Guide Ultra-Rapide

## 🎯 En 10 Minutes Chrono

### 1️⃣ Pousser sur GitHub (1 min)
```
Double-clic sur: commit-vercel.bat
```

### 2️⃣ Créer Compte Vercel (1 min)
- https://vercel.com/signup
- "Continue with GitHub"

### 3️⃣ Importer Projet (30 sec)
- "Add New Project"
- Sélectionnez "hype-market"
- "Import"

### 4️⃣ Créer Base de Données (1 min)
- Storage → Create Database → Postgres
- Région: Washington D.C.
- Connect to project: hype-market

### 5️⃣ Ajouter Variables (2 min)
Settings → Environment Variables:
```
BREVO_API_KEY = votre-cle
FROM_EMAIL = noreply@domaine.com
JWT_SECRET = secret-ultra-securise-123
NEXT_PUBLIC_BASE_URL = https://hype-market.vercel.app
```

### 6️⃣ Déployer (4 min - automatique)
- Deployments → Deploy
- Attendez le build...
- ✅ Site en ligne !

### 7️⃣ Migrer Base (1 min)
Sur votre PC:
```bash
# Créez .env.production avec DATABASE_URL de Vercel
npx dotenv -e .env.production -- npx prisma db push
```

### 8️⃣ Créer Admin (1 min)
```bash
npx dotenv -e .env.production -- npx prisma studio
```
Créez user admin avec role ADMIN

### ✅ TERMINÉ !
Votre site: https://hype-market.vercel.app

---

## 📚 Guide Complet

Pour plus de détails: **DEPLOIEMENT_VERCEL.md**

---

## 🆘 Problème ?

### Build échoue
→ Vérifiez variables d'environnement

### Site erreur 500
→ Vérifiez Runtime Logs dans Vercel

### Tables not found
→ Exécutez: `npx prisma db push`

---

**C'est simple ! Suivez les 8 étapes et c'est bon ! 🚀**
