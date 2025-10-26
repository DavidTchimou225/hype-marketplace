# 🔐 Guide : Récupérer le mot de passe email Hostinger

## Étape par étape pour `no-reply@hype-marketplace.shop`

---

## 📍 Étape 1 : Connexion au panel Hostinger

1. Ouvrez votre navigateur
2. Allez sur : **https://hpanel.hostinger.com**
3. Connectez-vous avec vos identifiants Hostinger

```
┌─────────────────────────────────────┐
│         HOSTINGER LOGIN             │
│                                     │
│  Email: _____________________       │
│  Mot de passe: ______________       │
│                                     │
│         [ Se connecter ]            │
└─────────────────────────────────────┘
```

---

## 📍 Étape 2 : Accéder à la section Emails

Une fois connecté au hPanel :

1. **Dans le menu latéral gauche**, cherchez et cliquez sur **"Emails"**
   
   Ou parfois appelé :
   - "Email"
   - "Email Accounts"
   - "Comptes Email"

```
Menu Hostinger:
├── 🏠 Dashboard
├── 🌐 Sites Web
├── 📧 Emails           ← CLIQUEZ ICI
├── 📊 Statistiques
├── ⚙️ Paramètres
└── ...
```

---

## 📍 Étape 3 : Trouver votre email

Dans la section Emails, vous verrez la liste de vos emails :

1. **Cherchez** : `no-reply@hype-marketplace.shop`
2. **Si vous ne le voyez pas**, vérifiez :
   - Que vous êtes bien sur le domaine `hype-marketplace.shop`
   - Menu déroulant "Sélectionner un domaine" en haut

```
┌───────────────────────────────────────────────────────┐
│  Comptes Email                                        │
│                                                       │
│  Domaine: [hype-marketplace.shop ▼]                  │
│                                                       │
│  ┌─────────────────────────────────────────────┐    │
│  │ no-reply@hype-marketplace.shop              │    │
│  │ Créé le: 24/10/2024                         │    │
│  │ Quota: 1 GB                    [ Gérer ] ●  │    │
│  └─────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────┘
```

---

## 📍 Étape 4 : Accéder aux paramètres de l'email

1. **Cliquez sur** le bouton **"Gérer"** (ou **"Manage"**)
   
   OU
   
2. **Cliquez sur les 3 points** (⋮) à droite de l'email
3. **Sélectionnez** "Gérer" dans le menu

```
┌─────────────────────────────────┐
│ no-reply@hype-marketplace.shop  │
│                                 │
│  Actions:                       │
│  ● Gérer                        │
│  ● Modifier le mot de passe     │
│  ● Supprimer                    │
│  ● Forwarder                    │
└─────────────────────────────────┘
```

---

## 📍 Étape 5 : Modifier le mot de passe

Dans la page de gestion de l'email :

1. **Cherchez** la section **"Modifier le mot de passe"** ou **"Change Password"**
2. **Cliquez dessus**

Vous verrez un formulaire comme ceci :

```
┌────────────────────────────────────────┐
│  Modifier le mot de passe              │
│                                        │
│  Nouveau mot de passe:                 │
│  [____________________________]        │
│                                        │
│  Confirmer le mot de passe:            │
│  [____________________________]        │
│                                        │
│  [ Générer un mot de passe ]           │
│                                        │
│  [ Annuler ]  [ Enregistrer ]          │
└────────────────────────────────────────┘
```

---

## 📍 Étape 6 : Créer un mot de passe

### Option A : Générer automatiquement (RECOMMANDÉ ✅)

1. **Cliquez sur** "Générer un mot de passe"
2. Hostinger créera un mot de passe sécurisé
3. **⚠️ COPIEZ-LE IMMÉDIATEMENT** et sauvegardez-le quelque part
4. Cliquez sur "Enregistrer"

### Option B : Créer manuellement

1. Entrez votre propre mot de passe (minimum 8 caractères)
2. Confirmez-le dans le second champ
3. **⚠️ NOTEZ-LE BIEN** 
4. Cliquez sur "Enregistrer"

**💡 Conseil :** Utilisez un mot de passe fort avec :
- Au moins 12 caractères
- Lettres majuscules et minuscules
- Chiffres
- Caractères spéciaux (!, @, #, $, etc.)

---

## 📍 Étape 7 : Copier le mot de passe dans .env

Une fois le mot de passe créé/récupéré :

1. **Ouvrez** le fichier `.env` dans votre projet Hype Market
2. **Trouvez** la ligne : `SMTP_PASS=VOTRE_MOT_DE_PASSE_ICI`
3. **Remplacez** `VOTRE_MOT_DE_PASSE_ICI` par votre mot de passe
4. **Sauvegardez** le fichier

**Exemple :**
```bash
# AVANT :
SMTP_PASS=VOTRE_MOT_DE_PASSE_ICI

# APRÈS :
SMTP_PASS=MonMotD3P@sse2024!
```

**⚠️ ATTENTION :**
- Pas d'espaces avant ou après le mot de passe
- Si votre mot de passe contient des guillemets ou $, échappez-les avec \

---

## 📍 Étape 8 : Tester la configuration

Maintenant que tout est configuré, testez :

```bash
node test-email.js votre-email-perso@gmail.com
```

**Remplacez** `votre-email-perso@gmail.com` par VOTRE vraie adresse email.

---

## ✅ Résultat attendu :

Si tout fonctionne, vous verrez :

```
🔍 Vérification de la configuration SMTP...

📧 Configuration détectée:
   SMTP_HOST: smtp.hostinger.com
   SMTP_PORT: 587
   SMTP_USER: no-reply@hype-marketplace.shop
   SMTP_PASS: ✅ Configuré
   SMTP_FROM: Hype Market <no-reply@hype-marketplace.shop>

✅ Connexion SMTP réussie !

📤 Envoi de l'email de test...

✅ Email envoyé avec succès !

📬 Détails:
   Message ID: <xxxxxxxxxxxxx>
   Destinataire: votre-email@exemple.com
   Code OTP de test: 456789

🎉 Votre configuration SMTP est opérationnelle !
```

Et vous recevrez un email comme celui-ci :

```
De: Hype Market <no-reply@hype-marketplace.shop>
À: votre-email@exemple.com
Objet: 🧪 Test de Configuration SMTP - Hype Market

┌─────────────────────────────┐
│      HYPE MARKET            │
└─────────────────────────────┘

🧪 Test de Configuration Email

Si vous recevez cet email, votre 
configuration SMTP fonctionne 
parfaitement !

Votre code OTP de test :

        456789

ℹ️ Informations techniques :
• Serveur SMTP: smtp.hostinger.com
• Port: 587
• De: no-reply@hype-marketplace.shop
```

---

## 🚨 Problèmes courants

### ❌ "Je ne trouve pas mon email dans Hostinger"

**Solutions :**
1. Vérifiez que vous avez bien sélectionné le domaine `hype-marketplace.shop`
2. L'email n'existe peut-être pas encore → Créez-le !

**Pour créer l'email :**
1. Section "Emails" → Cliquez sur "Créer un compte email"
2. Nom : `no-reply`
3. Domaine : `hype-marketplace.shop`
4. Mot de passe : [Créez-en un]
5. Enregistrer

---

### ❌ "Authentication failed" lors du test

**Vérifiez :**
- Pas d'espace avant/après le mot de passe dans `.env`
- Mot de passe correctement copié (sans caractères invisibles)
- Email exact : `no-reply@hype-marketplace.shop`

**Testez :**
```bash
# Si ça ne marche pas avec smtp.hostinger.com
# Essayez :
SMTP_HOST=mail.hype-marketplace.shop
```

---

### ❌ "Connection timeout"

**Solutions :**
1. Essayez le port 465 : `SMTP_PORT=465`
2. Vérifiez votre pare-feu/antivirus
3. Essayez avec votre smartphone en partage de connexion (pour tester si c'est votre réseau)

---

## 📞 Besoin d'aide supplémentaire ?

**Support Hostinger (24/7) :**
- Live Chat dans le hPanel (en bas à droite)
- Ou : https://www.hostinger.fr/contact

**Question à leur poser si bloqué :**
> "Bonjour, j'ai besoin des paramètres SMTP pour envoyer des emails 
> depuis mon application avec l'adresse no-reply@hype-marketplace.shop. 
> Pouvez-vous me confirmer le serveur SMTP et le port à utiliser ?"

---

## 🎯 Récapitulatif

1. ✅ Connexion : https://hpanel.hostinger.com
2. ✅ Menu "Emails"
3. ✅ Trouver `no-reply@hype-marketplace.shop`
4. ✅ "Gérer" → "Modifier le mot de passe"
5. ✅ Générer/créer un mot de passe
6. ✅ Copier dans `.env` à la place de `VOTRE_MOT_DE_PASSE_ICI`
7. ✅ Tester : `node test-email.js votre-email@exemple.com`
8. ✅ Vérifier la réception de l'email

**Temps estimé : 5 minutes** ⏱️

---

Bonne configuration ! 🚀📧
