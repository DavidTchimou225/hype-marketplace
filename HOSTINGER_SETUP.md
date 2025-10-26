# 📧 Configuration Email Hostinger pour Hype Market

Votre email professionnel : **no-reply@hype-marketplace.shop**

## ✅ Configuration déjà effectuée

Le fichier `.env` est déjà pré-configuré avec les paramètres Hostinger :

```bash
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=no-reply@hype-marketplace.shop
SMTP_FROM=Hype Market <no-reply@hype-marketplace.shop>
```

---

## 🔐 Étape 1 : Récupérer votre mot de passe email

Vous devez maintenant remplir `SMTP_PASS` dans le fichier `.env`.

### Option A : Vous connaissez déjà le mot de passe
1. Ouvrez le fichier `.env`
2. Remplacez `VOTRE_MOT_DE_PASSE_ICI` par votre mot de passe
3. Sauvegardez le fichier

### Option B : Vous devez le récupérer depuis Hostinger

1. **Connectez-vous à votre panel Hostinger** : https://hpanel.hostinger.com
2. **Allez dans "Emails"** dans le menu latéral
3. **Trouvez l'email** `no-reply@hype-marketplace.shop`
4. **Cliquez sur "Gérer"** ou les trois points (⋮)
5. **Sélectionnez "Modifier le mot de passe"**
6. **Créez un nouveau mot de passe** (notez-le bien !)
7. **Copiez ce mot de passe** et collez-le dans `.env` à la place de `VOTRE_MOT_DE_PASSE_ICI`

---

## 🧪 Étape 2 : Tester la configuration

Une fois le mot de passe configuré, testez immédiatement :

```bash
node test-email.js votre-email-perso@gmail.com
```

Remplacez `votre-email-perso@gmail.com` par votre email personnel pour recevoir l'email de test.

### ✅ Résultat attendu :

```
✅ Connexion SMTP réussie !
📤 Envoi de l'email de test...
✅ Email envoyé avec succès !
📬 Détails:
   Message ID: <xxxxx>
   Destinataire: votre-email@exemple.com
   Code OTP de test: 123456
🎉 Votre configuration SMTP est opérationnelle !
```

---

## 🔧 Configuration alternative (si smtp.hostinger.com ne fonctionne pas)

Certains comptes Hostinger utilisent le nom de domaine comme serveur SMTP :

```bash
SMTP_HOST=mail.hype-marketplace.shop
SMTP_PORT=587
SMTP_USER=no-reply@hype-marketplace.shop
SMTP_PASS=votre-mot-de-passe
SMTP_FROM=Hype Market <no-reply@hype-marketplace.shop>
```

---

## ⚙️ Ports disponibles pour Hostinger

| Port | Type | Chiffrement | Recommandé |
|------|------|-------------|------------|
| **587** | **SMTP** | **TLS/STARTTLS** | **✅ OUI** |
| 465 | SMTP | SSL | ✅ Oui |
| 25 | SMTP | Non sécurisé | ❌ Non |

**📌 Nous utilisons le port 587** qui est le plus recommandé et compatible.

---

## 🚨 Dépannage

### ❌ "Authentication failed"
- Vérifiez que le mot de passe est correct (sans espaces)
- Assurez-vous que l'email `no-reply@hype-marketplace.shop` existe bien dans Hostinger
- Vérifiez qu'il n'y a pas de caractères spéciaux mal échappés dans le mot de passe

### ❌ "Connection timeout"
- Essayez `SMTP_HOST=mail.hype-marketplace.shop` au lieu de `smtp.hostinger.com`
- Vérifiez que votre pare-feu n'bloque pas le port 587
- Essayez le port 465 avec `SMTP_PORT=465`

### ❌ "Sender address rejected"
- Vérifiez que le domaine `hype-marketplace.shop` est bien vérifié dans Hostinger
- Assurez-vous que l'email `no-reply@hype-marketplace.shop` est actif

---

## 📊 Limites d'envoi Hostinger

Selon votre plan Hostinger :
- **Email Hosting** : ~300 emails/heure
- **Business Email** : Jusqu'à 500 emails/heure
- **Pour dépasser ces limites** : Contactez le support Hostinger

---

## 🎯 Utilisation dans l'application

Une fois configuré, vos utilisateurs recevront automatiquement des emails OTP lors :

### 1. Inscription (`/register`)
```
Objet : Hype Market — Vérification de votre email
Code : 6 chiffres
Expiration : 10 minutes
```

### 2. Mot de passe oublié (`/forgot-password`)
```
Objet : Hype Market — Réinitialisation de mot de passe
Code : 6 chiffres
Expiration : 10 minutes
```

---

## ✉️ Template d'email personnalisé

Les emails envoyés auront ce format :

```
De: Hype Market <no-reply@hype-marketplace.shop>
À: utilisateur@exemple.com
Objet: Hype Market — Vérification de votre email

┌─────────────────────────────────┐
│     HYPE MARKET                 │
└─────────────────────────────────┘

Utilisez le code ci-dessous pour 
vérifier votre adresse email :

        ┌─────────────┐
        │   123456    │
        └─────────────┘

Ce code expire dans 10 minutes.
```

---

## 🔒 Sécurité

✅ **Bonnes pratiques déjà appliquées :**
- ✅ Port 587 avec TLS (chiffré)
- ✅ Email `no-reply@` (pas de réponses)
- ✅ Expiration des codes OTP (10 min)
- ✅ Mot de passe stocké dans `.env` (non versionné)

---

## 📞 Support

**Support Hostinger :**
- Live Chat : Disponible 24/7 dans le panel
- Email : support@hostinger.com
- Documentation : https://support.hostinger.com

**Support Hype Market :**
- Configuration email : `src/lib/mail.ts`
- Template OTP : fonction `otpEmailTemplate()`

---

## 🚀 Prochaines étapes

1. ✅ Remplacer `VOTRE_MOT_DE_PASSE_ICI` dans `.env`
2. ✅ Lancer `node test-email.js votre-email@exemple.com`
3. ✅ Vérifier la réception de l'email de test
4. ✅ Démarrer le serveur : `npm run dev`
5. ✅ Tester l'inscription d'un utilisateur

Tout est prêt ! Il ne manque plus que votre mot de passe email. 🎉
