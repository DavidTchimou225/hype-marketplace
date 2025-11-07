# Configuration SMTP pour la Production

## 📧 Configuration Email

Pour que les emails OTP fonctionnent en production, vous devez configurer vos paramètres SMTP.

### Option 1: SMTP Hostinger (Recommandé si vous hébergez chez Hostinger)

Décommentez et configurez ces lignes dans votre `.env.production` ou `.env` :

```env
SMTP_HOST="smtp.hostinger.com"
SMTP_PORT="587"
SMTP_USER="noreply@votre-domaine.com"
SMTP_PASS="votre-mot-de-passe-email"
FROM_EMAIL="noreply@votre-domaine.com"
```

### Option 2: Gmail (Pour les tests)

```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="votre-email@gmail.com"
SMTP_PASS="votre-mot-de-passe-application"  # Créer un mot de passe d'application
FROM_EMAIL="votre-email@gmail.com"
```

> ⚠️ **Note Gmail**: Vous devez créer un "Mot de passe d'application" dans les paramètres de sécurité de votre compte Google.

### Option 3: Brevo (ex-Sendinblue) - Gratuit jusqu'à 300 emails/jour

```env
BREVO_API_KEY="votre-cle-api-brevo"
FROM_EMAIL="noreply@votre-domaine.com"
```

## 🔧 Fonctionnement

### 🚨 **IMPORTANT : Configuration SMTP OBLIGATOIRE en Production**

En **production** (`NODE_ENV=production`), le code OTP n'est **JAMAIS** affiché dans l'interface ou la réponse API. Il est **uniquement envoyé par email**.

### ✅ **En Développement** (`NODE_ENV=development`)
- Le code OTP s'affiche dans l'interface pour faciliter les tests ✅
- Le code OTP s'affiche dans la console serveur ✅
- L'email est envoyé si SMTP est configuré ✅
- **Parfait pour les tests**

### ✅ **En Production** (`NODE_ENV=production`)
- **SMTP DOIT être configuré** ⚠️
- Le code OTP est **uniquement** envoyé par email ✅
- Le code OTP n'est **jamais** affiché dans l'interface ✅
- **Sécurisé pour la production**

## 🚀 Comment Tester

### Test en Développement (NODE_ENV=development)
1. S'inscrire normalement
2. Le code OTP apparaît dans une alerte : `🔑 CODE OTP: 123456`
3. Copier le code et le coller dans la page de vérification
4. ✅ Compte vérifié !

### Test en Production (NODE_ENV=production)
1. Configurer les variables SMTP ci-dessus
2. Redémarrer le serveur
3. S'inscrire
4. Recevoir l'email avec le code OTP
5. Entrer le code
6. ✅ Compte vérifié !

## 📝 Variables d'Environnement Complètes

Voici un exemple complet de `.env.production` ou `.env.local` :

```env
# Base de données
DATABASE_URL="postgres://votre-connexion-db"

# SMTP (Choisir une option)
SMTP_HOST="smtp.hostinger.com"
SMTP_PORT="587"
SMTP_USER="noreply@votre-domaine.com"
SMTP_PASS="votre-mot-de-passe"
FROM_EMAIL="noreply@votre-domaine.com"

# JWT Secret (IMPORTANT: Changez-le !)
JWT_SECRET="votre-secret-unique-tres-securise-123456789"

# URLs
NEXT_PUBLIC_BASE_URL="https://votre-domaine.com"

# Environment
NODE_ENV="production"
PORT=3000
```

## 🔐 Sécurité

- ⚠️ **Ne commitez JAMAIS vos fichiers .env**
- ✅ Utilisez des mots de passe forts
- ✅ Changez le JWT_SECRET en production
- ✅ Utilisez HTTPS en production

## 💡 Conseils

1. **Hostinger** : Si vous hébergez chez Hostinger, utilisez leur SMTP (Option 1)
2. **Gmail** : Bon pour les tests, mais limité à 500 emails/jour
3. **Brevo** : Gratuit jusqu'à 300 emails/jour, parfait pour démarrer
4. **SendGrid** : 100 emails/jour gratuits, bonne alternative

## 🆘 Support

Si vous avez des problèmes :
1. Vérifiez les logs serveur (`console.log`)
2. Le code OTP s'affichera même si l'email échoue
3. Vérifiez que les paramètres SMTP sont corrects
4. Testez d'abord avec Gmail pour valider que tout fonctionne
