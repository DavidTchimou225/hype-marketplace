# Configuration de votre Boîte Mail Professionnelle pour les OTP

Votre système d'envoi d'emails est déjà configuré ! Il vous suffit de remplir les variables dans le fichier `.env`.

## 📧 Variables à configurer dans `.env`

```bash
SMTP_HOST=        # Serveur SMTP de votre fournisseur
SMTP_PORT=        # Port SMTP (587 pour TLS, 465 pour SSL)
SMTP_USER=        # Votre adresse email complète
SMTP_PASS=        # Mot de passe ou mot de passe d'application
SMTP_FROM=        # Adresse email d'expéditeur (ex: noreply@hypemarket.ci)
```

---

## 🔧 Configuration selon les fournisseurs

### 1️⃣ **Gmail / Google Workspace**

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=mot-de-passe-application
SMTP_FROM=noreply@hypemarket.ci
```

**⚠️ Important pour Gmail :**
1. Activez l'authentification à 2 facteurs
2. Générez un "Mot de passe d'application" :
   - Allez sur https://myaccount.google.com/security
   - Cliquez sur "Mots de passe des applications"
   - Sélectionnez "Mail" et générez
   - Utilisez ce mot de passe dans `SMTP_PASS`

---

### 2️⃣ **Office 365 / Outlook**

```bash
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=votre-email@votredomaine.com
SMTP_PASS=votre-mot-de-passe
SMTP_FROM=noreply@hypemarket.ci
```

---

### 3️⃣ **OVH Mail Pro**

```bash
SMTP_HOST=ssl0.ovh.net
SMTP_PORT=587
SMTP_USER=votre-email@votredomaine.com
SMTP_PASS=votre-mot-de-passe
SMTP_FROM=noreply@hypemarket.ci
```

---

### 4️⃣ **Hostinger / cPanel**

```bash
SMTP_HOST=smtp.hostinger.com  # ou smtp.votredomaine.com
SMTP_PORT=587
SMTP_USER=votre-email@votredomaine.com
SMTP_PASS=votre-mot-de-passe
SMTP_FROM=noreply@hypemarket.ci
```

---

### 5️⃣ **Infomaniak**

```bash
SMTP_HOST=mail.infomaniak.com
SMTP_PORT=587
SMTP_USER=votre-email@votredomaine.com
SMTP_PASS=votre-mot-de-passe
SMTP_FROM=noreply@hypemarket.ci
```

---

### 6️⃣ **Orange / Côte d'Ivoire Telecom**

```bash
SMTP_HOST=smtp.orange.ci  # ou votre serveur SMTP
SMTP_PORT=587
SMTP_USER=votre-email@votredomaine.com
SMTP_PASS=votre-mot-de-passe
SMTP_FROM=noreply@hypemarket.ci
```

---

## 🧪 Test de votre configuration

Après avoir configuré vos variables, redémarrez votre serveur de développement :

```bash
npm run dev
```

### Tester l'envoi d'un OTP :

1. **Inscription** : Allez sur `/register` et créez un compte
2. **Mot de passe oublié** : Allez sur `/forgot-password`

Vous devriez recevoir un email avec un code à 6 chiffres.

---

## 🔍 Dépannage

### ❌ "SMTP not configured"
- Vérifiez que toutes les variables `SMTP_*` sont bien renseignées dans `.env`
- Redémarrez le serveur après modification de `.env`

### ❌ "Authentication failed"
- Vérifiez votre nom d'utilisateur (souvent l'adresse email complète)
- Pour Gmail : utilisez un mot de passe d'application, pas votre mot de passe principal
- Vérifiez que votre mot de passe ne contient pas de caractères spéciaux non échappés

### ❌ "Connection timeout"
- Vérifiez le `SMTP_HOST` et le `SMTP_PORT`
- Port 587 = TLS (recommandé)
- Port 465 = SSL
- Port 25 = Non sécurisé (non recommandé)

### ❌ "Sender address rejected"
- Vérifiez que `SMTP_FROM` utilise un domaine autorisé par votre fournisseur
- Certains fournisseurs n'autorisent que les emails de leur domaine

---

## 📝 Format des emails OTP

Vos utilisateurs recevront des emails professionnels avec :
- **Titre** : "Hype Market — Vérification de votre email" ou "Réinitialisation de mot de passe"
- **Code** : Un code à 6 chiffres affiché en grand et en gras
- **Validité** : Le code expire après 10 minutes

Le template est dans `src/lib/mail.ts` - fonction `otpEmailTemplate()`.

---

## 🔐 Sécurité

⚠️ **IMPORTANT** :
- Ne commitez JAMAIS le fichier `.env` avec vos vrais identifiants
- Le fichier `.env` est déjà dans `.gitignore`
- En production, utilisez les variables d'environnement de votre hébergeur

---

## 💡 Recommandations

1. **Utilisez une adresse `noreply@`** pour `SMTP_FROM` (ex: noreply@hypemarket.ci)
2. **Vérifiez les limites d'envoi** de votre fournisseur :
   - Gmail : ~500 emails/jour
   - Office 365 : ~10 000 emails/jour
   - Fournisseurs pro : variable selon l'offre
3. **Pour un usage intensif**, envisagez un service spécialisé comme :
   - SendGrid
   - Mailgun
   - Amazon SES
   - Brevo (ex-Sendinblue)

---

## 📞 Support

Si vous avez des questions sur la configuration, vérifiez :
1. Les paramètres SMTP de votre fournisseur
2. Que le service SMTP est bien activé sur votre compte
3. Les logs du serveur pour voir les erreurs détaillées

Bon envoi d'emails ! 🚀📧
