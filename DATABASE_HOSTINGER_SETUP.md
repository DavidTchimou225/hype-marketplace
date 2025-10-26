# 🗄️ Configuration Base de Données MySQL Hostinger

## Étape 1: Créer la Base de Données dans hPanel

### 1.1 Accéder à la Section Bases de Données
1. Connectez-vous à https://hpanel.hostinger.com
2. Sélectionnez votre site web
3. Allez dans **"Bases de données"** → **"MySQL Databases"**

### 1.2 Créer une Nouvelle Base
1. Cliquez sur **"Créer une nouvelle base de données"**
2. Remplissez:
   - **Nom de la base:** `u123456789_hypemarket`
   - **Nom d'utilisateur:** `u123456789_hype`
   - **Mot de passe:** Générez un mot de passe fort
   - **Host:** `localhost` (généralement)
   
3. Cliquez **"Créer"**

### 1.3 Notez les Informations
Gardez ces informations précieusement:
```
Database Name: u123456789_hypemarket
Username: u123456789_hype
Password: VotreMotDePasseGenere123!
Host: localhost
Port: 3306
```

---

## Étape 2: Modifier Prisma Schema

### 2.1 Éditer prisma/schema.prisma

**Remplacez:**
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

**Par:**
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

### 2.2 Ajustements pour MySQL

Certains types de données doivent être modifiés:

**Avant (SQLite):**
```prisma
model User {
  createdAt DateTime @default(now())
  // ...
}
```

**Après (MySQL) - Même chose, MySQL supporte ces types:**
```prisma
model User {
  createdAt DateTime @default(now())
  // ...
}
```

⚠️ **Note:** Si vous avez `@db.Text` ou des types spécifiques SQLite, vérifiez la compatibilité.

---

## Étape 3: Configurer la Chaîne de Connexion

### 3.1 Format de la DATABASE_URL

```env
DATABASE_URL="mysql://USERNAME:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

### 3.2 Exemple Concret

```env
DATABASE_URL="mysql://u123456789_hype:VotreMotDePasseGenere123!@localhost:3306/u123456789_hypemarket"
```

### 3.3 Caractères Spéciaux dans le Mot de Passe

Si votre mot de passe contient des caractères spéciaux (`@`, `#`, `&`, etc.), encodez-les:

| Caractère | Encodage |
|-----------|----------|
| @ | %40 |
| # | %23 |
| & | %26 |
| ! | %21 |
| $ | %24 |
| % | %25 |

**Exemple:**
```
Mot de passe: Pass@2024!
DATABASE_URL: "mysql://user:Pass%402024%21@localhost:3306/db"
```

---

## Étape 4: Créer le Fichier .env sur le Serveur

### 4.1 Se Connecter en SSH
```bash
ssh u123456789@votre-domaine.com -p 65002
cd ~/public_html/hype-market
```

### 4.2 Créer/Éditer .env
```bash
nano .env
```

### 4.3 Coller la Configuration
```env
# Base de données MySQL Hostinger
DATABASE_URL="mysql://u123456789_hype:VotreMotDePasseGenere123!@localhost:3306/u123456789_hypemarket"

# Email - Brevo
BREVO_API_KEY="votre-cle-brevo"
FROM_EMAIL="noreply@votre-domaine.com"

# JWT Secret (Générez un nouveau!)
JWT_SECRET="votre-secret-ultra-securise-changez-moi"

# URL Production
NEXT_PUBLIC_BASE_URL="https://votre-domaine.com"

# Environment
NODE_ENV="production"
```

**Sauvegarder:** `Ctrl+X`, puis `Y`, puis `Enter`

---

## Étape 5: Migrer la Base de Données

### 5.1 Générer le Client Prisma
```bash
npx prisma generate
```

### 5.2 Créer les Tables
```bash
npx prisma migrate deploy
```

Ou si vous n'avez pas de migrations:
```bash
npx prisma db push
```

### 5.3 Vérifier la Connexion
```bash
npx prisma db pull
```

Si ça fonctionne, la connexion est bonne ! ✅

---

## Étape 6: Importer des Données (Optionnel)

### 6.1 Exporter depuis SQLite Local

```bash
# Sur votre PC local
npx prisma db pull
npx prisma db push --force-reset
```

### 6.2 Via phpMyAdmin Hostinger

1. Dans hPanel, allez dans **"Bases de données"**
2. Cliquez sur **"Gérer"** à côté de votre base
3. Ouvre phpMyAdmin
4. Sélectionnez votre base de données
5. Onglet **"Import"**
6. Choisissez votre fichier SQL
7. Cliquez **"Go"**

### 6.3 Via SQL Direct

```bash
# Se connecter à MySQL
mysql -u u123456789_hype -p u123456789_hypemarket

# Importer un fichier
mysql -u u123456789_hype -p u123456789_hypemarket < backup.sql
```

---

## Étape 7: Seed Initial (Données de Test)

### 7.1 Créer un Fichier Seed

`prisma/seed.ts`:
```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hypemarket.ci' },
    update: {},
    create: {
      email: 'admin@hypemarket.ci',
      password: '$2a$10$hashpassword', // Hash bcrypt
      firstName: 'Admin',
      lastName: 'Hype Market',
      role: 'ADMIN',
      isVerified: true
    }
  });

  // Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Mode Femme',
        slug: 'femme',
        image: '/categories/femme.jpg'
      }
    }),
    // ... autres catégories
  ]);

  console.log('✅ Seed terminé!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### 7.2 Ajouter Script dans package.json
```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

### 7.3 Exécuter le Seed
```bash
npx prisma db seed
```

---

## 🔧 Maintenance Base de Données

### Backup Automatique

Créez `backup-db.sh`:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="$HOME/backups"
mkdir -p $BACKUP_DIR

mysqldump -u u123456789_hype -p'VotreMotDePasse' u123456789_hypemarket > $BACKUP_DIR/backup_$DATE.sql

# Garder seulement les 7 derniers backups
ls -t $BACKUP_DIR/backup_*.sql | tail -n +8 | xargs -r rm

echo "✅ Backup créé: backup_$DATE.sql"
```

### Restaurer un Backup
```bash
mysql -u u123456789_hype -p u123456789_hypemarket < backup.sql
```

### Optimiser les Tables
```bash
mysqlcheck -u u123456789_hype -p --optimize u123456789_hypemarket
```

---

## 🚨 Troubleshooting

### Erreur: "Can't connect to MySQL server"

**Solution 1:** Vérifier le host
```bash
# Tester la connexion
mysql -h localhost -u u123456789_hype -p
```

**Solution 2:** Vérifier les credentials
```bash
# Voir le .env
cat .env | grep DATABASE_URL
```

### Erreur: "Access denied for user"

- Vérifier username et password dans .env
- Vérifier que l'utilisateur a les permissions
- Dans hPanel → Bases de données → Vérifier les privilèges

### Erreur: "Unknown database"

- Vérifier que la base existe dans hPanel
- Nom exact (sensible à la casse sur Linux)

### Erreur: "Too many connections"

```sql
-- Se connecter à MySQL
mysql -u u123456789_hype -p

-- Voir les connexions
SHOW PROCESSLIST;

-- Tuer une connexion
KILL [process_id];
```

### Tables ne se créent pas

```bash
# Forcer la création
npx prisma db push --accept-data-loss

# Ou reset complet (⚠️ supprime les données)
npx prisma migrate reset
```

---

## 📊 Monitoring

### Voir les Tables Créées
```bash
mysql -u u123456789_hype -p u123456789_hypemarket -e "SHOW TABLES;"
```

### Compter les Enregistrements
```bash
mysql -u u123456789_hype -p u123456789_hypemarket -e "SELECT COUNT(*) FROM users;"
```

### Taille de la Base
```bash
mysql -u u123456789_hype -p u123456789_hypemarket -e "
SELECT 
  table_schema AS 'Database',
  ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'u123456789_hypemarket'
GROUP BY table_schema;
"
```

---

## ✅ Checklist Migration SQLite → MySQL

- [ ] Base de données créée dans hPanel
- [ ] Credentials notés (username, password, database)
- [ ] prisma/schema.prisma modifié (provider = "mysql")
- [ ] .env créé sur serveur avec DATABASE_URL
- [ ] npx prisma generate exécuté
- [ ] npx prisma migrate deploy réussi
- [ ] Tables créées (vérifier avec SHOW TABLES)
- [ ] Seed exécuté (données de test)
- [ ] Application redémarrée (pm2 restart)
- [ ] Test connexion depuis l'app (inscription, login)

---

## 🎉 C'est Fait !

Votre base de données MySQL est maintenant configurée et fonctionnelle sur Hostinger !

**Pour vérifier:**
```bash
# Tester la connexion
npx prisma db pull

# Voir les données
npx prisma studio
```

Si tout fonctionne, continuez avec le déploiement complet ! 🚀
