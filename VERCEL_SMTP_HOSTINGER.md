# 📧 Configuration SMTP Hostinger pour Vercel

## ✅ Utiliser votre Email Pro Hostinger

Vous avez déjà un email professionnel chez Hostinger. Parfait ! Voici comment le configurer sur Vercel.

---

## 🔑 Variables d'Environnement à Ajouter dans Vercel

### Dans Vercel Dashboard → Settings → Environment Variables

Ajoutez ces 6 variables (une par une):

### 1. SMTP_HOST
```
Name: SMTP_HOST
Value: smtp.hostinger.com
Environment: ✅ Production ✅ Preview ✅ Development
```

### 2. SMTP_PORT
```
Name: SMTP_PORT
Value: 587
Environment: ✅ Production ✅ Preview ✅ Development
```
*Note: Utilisez 587 pour STARTTLS ou 465 pour SSL*

### 3. SMTP_SECURE
```
Name: SMTP_SECURE
Value: false
Environment: ✅ Production ✅ Preview ✅ Development
```
*Note: `false` pour port 587, `true` pour port 465*

### 4. SMTP_USER
```
Name: SMTP_USER
Value: votre-email@votre-domaine.com
Environment: ✅ Production ✅ Preview ✅ Development
```
*Remplacez par votre vrai email Hostinger*

### 5. SMTP_PASS
```
Name: SMTP_PASS
Value: votre-mot-de-passe-email
Environment: ✅ Production ✅ Preview ✅ Development
```
*Le mot de passe de votre email*

### 6. FROM_EMAIL
```
Name: FROM_EMAIL
Value: noreply@votre-domaine.com
Environment: ✅ Production ✅ Preview ✅ Development
```
*L'email qui apparaîtra comme expéditeur*

---

## 📋 Récapitulatif Configuration SMTP Hostinger

| Paramètre | Valeur |
|-----------|--------|
| **Serveur SMTP** | smtp.hostinger.com |
| **Port** | 587 (STARTTLS) ou 465 (SSL) |
| **Sécurité** | STARTTLS ou SSL |
| **Authentification** | Oui (requis) |
| **Username** | Votre adresse email complète |
| **Password** | Mot de passe de votre email |

---

## 🔍 Où Trouver vos Paramètres SMTP Hostinger

### Dans hPanel Hostinger:

1. **Connectez-vous:** https://hpanel.hostinger.com
2. **Emails** → Sélectionnez votre email
3. **Configuration** ou **Settings**
4. Vous verrez:
   ```
   Serveur sortant (SMTP)
   smtp.hostinger.com
   Port: 587 ou 465
   ```

---

## ✅ Exemple Concret

Supposons que votre email est: `contact@hypemarket.ci`

### Variables Vercel:
```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contact@hypemarket.ci
SMTP_PASS=VotreMotDePasse123!
FROM_EMAIL=noreply@hypemarket.ci
```

### Emails envoyés apparaîtront comme:
```
De: noreply@hypemarket.ci
Via: smtp.hostinger.com
```

---

## 🚀 Après Configuration

### 1. Déployer les Changements
Les modifications de code ont été faites. Commitez:
```bash
git add .
git commit -m "Configuration SMTP Hostinger"
git push origin main
```

### 2. Vercel Redéploiera Automatiquement
- Détecte le push GitHub
- Rebuild avec nouvelles variables
- ~2-3 minutes

### 3. Tester l'Envoi d'Email
- Inscrivez-vous sur votre site
- Vous devriez recevoir l'email de vérification
- Vérifiez les logs Vercel si problème

---

## 🐛 Troubleshooting

### Erreur: "Authentication failed"
```
Problème: Username ou password incorrect
Solution: 
- Vérifiez SMTP_USER (doit être l'email complet)
- Vérifiez SMTP_PASS
- Testez la connexion depuis un client email d'abord
```

### Erreur: "Connection timeout"
```
Problème: Port ou host incorrect
Solution:
- Vérifiez SMTP_HOST = smtp.hostinger.com
- Vérifiez SMTP_PORT = 587 ou 465
- Essayez l'autre port
```

### Erreur: "TLS/SSL error"
```
Problème: SMTP_SECURE incorrect
Solution:
- Port 587 → SMTP_SECURE=false
- Port 465 → SMTP_SECURE=true
```

### Emails ne partent pas
```
Solution:
1. Vérifiez les Runtime Logs dans Vercel
2. Cherchez "[mail]" dans les logs
3. Vérifiez que toutes les variables sont définies
```

---

## 📊 Limites Hostinger Email

### Plan Standard
```
✅ ~500 emails/jour
✅ Illimité si Business Hosting
⚠️ Peut avoir rate limiting
```

### Recommandations
- Utilisez un email dédié: `noreply@`
- Ne l'utilisez pas pour recevoir des réponses
- Surveillez les limites d'envoi

---

## 💡 Bonnes Pratiques

### 1. Email Expéditeur Dédié
```
Créez: noreply@votre-domaine.com
Au lieu de: contact@votre-domaine.com
```

### 2. SPF et DKIM
Vérifiez dans Hostinger que les enregistrements DNS sont configurés:
- **SPF:** Autorise Hostinger à envoyer pour votre domaine
- **DKIM:** Signature des emails

### 3. Tester Avant Production
```bash
# Test local avec .env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
# ... autres variables
npm run dev
```

---

## ✅ Checklist Configuration

- [ ] Variables SMTP ajoutées dans Vercel (6 variables)
- [ ] Code modifié et pusher sur GitHub
- [ ] Vercel a redéployé automatiquement
- [ ] Test inscription → email reçu
- [ ] Test reset password → email reçu
- [ ] Vérifier logs Vercel (pas d'erreurs)

---

## 🎯 Résumé Ultra-Rapide

**Dans Vercel, ajoutez ces 6 variables:**

```
SMTP_HOST = smtp.hostinger.com
SMTP_PORT = 587
SMTP_SECURE = false
SMTP_USER = votre-email@domaine.com
SMTP_PASS = votre-mot-de-passe
FROM_EMAIL = noreply@domaine.com
```

**Puis:**
1. Commit le code modifié
2. Push sur GitHub
3. Vercel redéploie automatiquement
4. Testez l'envoi d'email

**C'est tout ! 🎉**

---

## 📞 Support

- **Hostinger Email Support:** Chat 24/7 dans hPanel
- **Vercel Logs:** Dashboard → votre projet → Runtime Logs
- **Test SMTP:** Utilisez un outil comme https://www.smtper.net/

---

**Maintenant, ajoutez ces variables dans Vercel et déployez ! 🚀**
