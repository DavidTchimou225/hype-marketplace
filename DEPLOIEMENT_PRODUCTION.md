# 🚀 Guide de Déploiement Hype Market en Production

## Étape 1: Pousser sur GitHub

### 1.1 Configurer Git (Exécutez le fichier)
```bash
setup-git.bat
```

Ou manuellement:
```bash
git config --global user.name "DavidTchimou225"
git config --global user.email "votre-email@gmail.com"
git commit -m "Initial commit: Hype Market complete"
```

### 1.2 Créer le Repo GitHub
1. Allez sur https://github.com/new
2. **Nom du repo:** `hype-market`
3. **Description:** "Marketplace de mode africaine en Côte d'Ivoire"
4. **Visibilité:** Public ou Private
5. ⚠️ **Ne cochez PAS** "Initialize with README"
6. Cliquez **"Create repository"**

### 1.3 Pousser le Code
```bash
push-to-github.bat
```

Ou manuellement:
```bash
git remote add origin https://github.com/DavidTchimou225/hype-market.git
git branch -M main
git push -u origin main
```

---

## Étape 2: Déploiement sur Vercel (Recommandé)

### Pourquoi Vercel ?
- ✅ Gratuit pour projets Next.js
- ✅ Déploiement automatique à chaque push
- ✅ HTTPS gratuit
- ✅ CDN mondial ultra-rapide
- ✅ Support SQLite via Vercel Postgres (migration nécessaire)

### 2.1 Créer un Compte Vercel
1. Allez sur https://vercel.com/signup
2. Cliquez **"Continue with GitHub"**
3. Autorisez Vercel à accéder à votre GitHub

### 2.2 Importer le Projet
1. Dans Vercel Dashboard, cliquez **"Add New Project"**
2. Sélectionnez **"hype-market"** dans la liste
3. Cliquez **"Import"**

### 2.3 Configuration
```
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### 2.4 Variables d'Environnement
Ajoutez dans Vercel:

```env
# Base de données (Utiliser Vercel Postgres)
DATABASE_URL="postgres://..."

# Email (Brevo/Sendinblue)
BREVO_API_KEY="votre-clé-brevo"
FROM_EMAIL="noreply@hypemarket.ci"

# JWT Secret
JWT_SECRET="votre-secret-ultra-securise-changez-moi"

# URL Production
NEXT_PUBLIC_BASE_URL="https://hype-market.vercel.app"
```

### 2.5 Déployer
1. Cliquez **"Deploy"**
2. Attendez 2-3 minutes
3. ✅ Site en ligne sur `https://hype-market.vercel.app`

---

## Étape 3: Migration Base de Données (SQLite → PostgreSQL)

### 3.1 Créer Base Postgres sur Vercel
1. Dans projet Vercel → **Storage**
2. Cliquez **"Create Database"**
3. Sélectionnez **"Postgres"**
4. Région: **Washington, D.C.** (proche Afrique)
5. Copiez le `DATABASE_URL`

### 3.2 Modifier Prisma Schema
```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"  // Changé de sqlite
  url      = env("DATABASE_URL")
}
```

### 3.3 Générer & Migrer
```bash
# Générer client
npx prisma generate

# Créer migration
npx prisma migrate dev --name init_postgres

# Pousser sur Vercel
npx prisma db push
```

### 3.4 Importer les Données
```bash
# Script d'import (créer un fichier seed.ts)
npx prisma db seed
```

---

## Étape 4: Configuration Domaine Personnalisé

### 4.1 Acheter un Domaine
- **Recommandé:** Namecheap, GoDaddy, OVH
- **Prix:** ~10-15€/an pour .ci ou .com

### 4.2 Configurer DNS
Dans Vercel:
1. **Settings → Domains**
2. Ajouter: `hypemarket.ci`
3. Type: **CNAME**
4. Value: `cname.vercel-dns.com`

Chez votre registrar:
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

Attendez 24-48h pour propagation DNS.

---

## Étape 5: Configuration Email Production

### 5.1 Créer Compte Brevo
1. https://www.brevo.com/fr/ (gratuit 300 emails/jour)
2. Vérifiez votre email
3. Ajoutez domaine expéditeur
4. Copiez clé API

### 5.2 Configuration DNS Email
Ajoutez dans votre DNS:

```
Type: TXT
Name: @
Value: v=spf1 include:spf.brevo.com ~all

Type: TXT  
Name: mail._domainkey
Value: [fourni par Brevo]

Type: CNAME
Name: mail
Value: [fourni par Brevo]
```

---

## Étape 6: Optimisations Production

### 6.1 Images
```bash
# Optimiser toutes les images
npm install sharp
npm run optimize-images
```

### 6.2 Cache & Performance
Dans `next.config.js`:
```js
module.exports = {
  images: {
    domains: ['unsplash.com', 'images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
  },
  swcMinify: true,
  compress: true,
}
```

### 6.3 Analytics
```bash
# Ajouter Google Analytics
npm install @next/third-parties
```

---

## Étape 7: Configuration Paiement Mobile Money

### 7.1 Intégration Orange Money / MTN
- **Orange:** https://developer.orange.com/
- **MTN:** https://momodeveloper.mtn.com/

### 7.2 Wave (Alternative simple)
- https://www.wave.com/ci/developers
- Support FCFA natif
- API simple

---

## Étape 8: Monitoring & Sécurité

### 8.1 Monitoring
- **Vercel Analytics:** Inclus gratuit
- **Sentry:** Tracking erreurs
- **LogRocket:** Session replay

### 8.2 Sécurité
```bash
# Headers sécurité
npm install helmet
```

Dans `middleware.ts`:
```typescript
export default function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  return response
}
```

---

## Checklist Avant Production

### Fonctionnalités
- [ ] Tous les produits affichent correctement
- [ ] Panier fonctionne
- [ ] Checkout fonctionne
- [ ] Emails envoyés
- [ ] Admin peut gérer boutiques
- [ ] Vendeurs peuvent ajouter produits
- [ ] Recherche fonctionne
- [ ] Tendances affichées
- [ ] Partage fonctionne

### Performance
- [ ] Lighthouse Score > 90
- [ ] Images optimisées (WebP)
- [ ] Fonts préchargées
- [ ] CSS minifié
- [ ] JS minifié

### SEO
- [ ] Sitemap.xml accessible
- [ ] Robots.txt configuré
- [ ] Meta tags sur toutes pages
- [ ] Open Graph images
- [ ] Structured Data

### Sécurité
- [ ] HTTPS activé
- [ ] Variables d'environnement sécurisées
- [ ] Rate limiting activé
- [ ] CORS configuré
- [ ] Headers sécurité

### Legal
- [ ] Conditions d'utilisation
- [ ] Politique de confidentialité
- [ ] Mentions légales
- [ ] RGPD compliance (si EU)

---

## Commandes Utiles

### Déploiement
```bash
# Déployer sur Vercel
vercel

# Déployer en production
vercel --prod

# Voir les logs
vercel logs
```

### Base de Données
```bash
# Ouvrir Prisma Studio
npx prisma studio

# Reset DB
npx prisma migrate reset

# Seed data
npx prisma db seed
```

### Monitoring
```bash
# Voir analytics
vercel analytics

# Voir vitals
vercel vitals
```

---

## Support & Maintenance

### Mises à Jour
```bash
# Mettre à jour dépendances
npm update

# Vérifier sécurité
npm audit fix

# Mettre à jour Next.js
npm install next@latest react@latest react-dom@latest
```

### Backup
```bash
# Backup DB quotidien (Vercel Postgres)
# Automatique par Vercel

# Export manuel
npx prisma db pull
```

---

## 🎉 Félicitations !

Votre marketplace **Hype Market** est maintenant en production !

**URLs:**
- Site: https://hype-market.vercel.app (ou votre domaine)
- Admin: https://hype-market.vercel.app/admin
- API: https://hype-market.vercel.app/api

**Prochaines étapes:**
1. Ajouter produits réels via admin
2. Inviter premiers vendeurs
3. Configurer paiement mobile money
4. Lancer campagne marketing
5. Monitorer analytics

**Besoin d'aide?**
- Discord Vercel: https://vercel.com/discord
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs

---

## Coûts Estimés

### Gratuit
- ✅ Hébergement Vercel (projets hobby)
- ✅ GitHub (repos publics)
- ✅ Brevo (300 emails/jour)
- ✅ Vercel Postgres (256MB)

### Payant
- 💰 Domaine .ci: ~20,000 FCFA/an
- 💰 Vercel Pro (si > 1M vues): $20/mois
- 💰 Postgres Plus (si > 1GB): $10/mois
- 💰 Emails Brevo Pro: €19/mois

**Total:** Démarrage gratuit, ~$30-50/mois en croissance

---

Bon lancement ! 🚀🎉
