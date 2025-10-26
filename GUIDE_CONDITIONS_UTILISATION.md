# 📄 Guide : Personnaliser les Conditions d'Utilisation

## ✅ Ce qui est déjà configuré

Votre système de conditions d'utilisation est **entièrement fonctionnel** avec :

### 1. Formulaire d'inscription
- ✅ Checkbox obligatoire pour accepter les conditions
- ✅ Liens cliquables vers `/terms` et `/privacy`
- ✅ Ouverture dans un nouvel onglet
- ✅ Bouton d'inscription désactivé si non coché
- ✅ Validation front-end et back-end

### 2. API d'inscription
- ✅ Vérification que `acceptedTerms` est `true`
- ✅ Message d'erreur si non accepté
- ✅ Impossible de s'inscrire sans cocher la case

### 3. Page Terms
- ✅ Route `/terms` accessible
- ✅ Design professionnel et responsive
- ✅ Footer et navigation intégrés
- ✅ Prête à recevoir votre contenu

---

## 📝 Comment personnaliser le contenu

### Fichier à éditer :
```
src/app/terms/page.tsx
```

### Localisation du contenu :
Lignes **29 à 73** - Cherchez la section :
```tsx
{/* 
  ========================================
  ZONE DE CONTENU À PERSONNALISER
  ========================================
*/}
```

### Remplacer par votre contenu :

**Option 1 : Texte simple**
```tsx
<div className="bg-white rounded-lg p-8 shadow-sm prose prose-lg max-w-none">
  <h2>1. Acceptation des conditions</h2>
  <p>Votre texte ici...</p>

  <h2>2. Description du service</h2>
  <p>Votre texte ici...</p>

  <h2>3. Inscription et compte utilisateur</h2>
  <p>Votre texte ici...</p>

  {/* Continuez avec vos sections... */}

  <p className="text-sm text-gray-500 mt-8 text-center border-t pt-4">
    Dernière mise à jour : Janvier 2025
  </p>
</div>
```

**Option 2 : Contenu riche avec listes**
```tsx
<h2>4. Obligations des utilisateurs</h2>
<ul>
  <li>Respecter les lois en vigueur en Côte d'Ivoire</li>
  <li>Ne pas porter atteinte aux droits d'autrui</li>
  <li>Maintenir la confidentialité de vos identifiants</li>
  <li>Ne pas utiliser le service à des fins illégales</li>
</ul>
```

---

## 📋 Sections recommandées à inclure

### 1. **Acceptation des conditions**
- Qui est concerné ?
- Comment accepter ?
- Quand les conditions s'appliquent ?

### 2. **Description du service**
- Nature de Hype Market
- Services proposés
- Zone géographique

### 3. **Inscription et compte**
- Conditions d'inscription
- Informations requises
- Responsabilité du compte

### 4. **Obligations des utilisateurs**
- Comportement attendu
- Interdictions
- Sanctions possibles

### 5. **Obligations des vendeurs** (spécifique marketplace)
- Qualité des produits
- Délais de livraison
- Service client
- Prix et descriptions

### 6. **Paiements et commissions**
- Modes de paiement acceptés
- Commissions sur les ventes
- Politique de remboursement
- Devise (FCFA)

### 7. **Livraison et retours**
- Zones de livraison
- Délais
- Frais de port
- Politique de retour

### 8. **Propriété intellectuelle**
- Droits sur le contenu
- Utilisation autorisée
- Contenu utilisateur

### 9. **Protection des données** (lien vers Privacy Policy)
- Collecte de données
- Utilisation
- Droits des utilisateurs (RGPD si applicable)

### 10. **Limitation de responsabilité**
- Rôle d'intermédiaire
- Litiges entre utilisateurs
- Garanties

### 11. **Résolution des litiges**
- Médiation
- Procédure de réclamation
- Contact support

### 12. **Loi applicable**
- Juridiction (Côte d'Ivoire)
- Tribunaux compétents

### 13. **Modification des conditions**
- Droit de modifier
- Notification des changements
- Date d'effet

### 14. **Contact**
- Email support
- Adresse physique (si applicable)
- Numéro de téléphone

---

## 🎨 Classes CSS disponibles

La classe `prose` de Tailwind CSS est appliquée, ce qui style automatiquement :

```tsx
<h1>Titre H1</h1>         {/* Grand titre */}
<h2>Titre H2</h2>         {/* Section */}
<h3>Titre H3</h3>         {/* Sous-section */}
<p>Paragraphe</p>         {/* Texte normal */}
<ul><li>Item</li></ul>    {/* Liste à puces */}
<ol><li>Item</li></ol>    {/* Liste numérotée */}
<strong>Gras</strong>     {/* Texte en gras */}
<em>Italique</em>         {/* Texte en italique */}
<a href="#">Lien</a>      {/* Lien hypertexte */}
<code>Code</code>         {/* Code inline */}
```

---

## 🔗 Exemple complet

```tsx
<div className="bg-white rounded-lg p-8 shadow-sm prose prose-lg max-w-none">
  <h2>1. Acceptation des conditions</h2>
  <p>
    En créant un compte sur Hype Market ou en utilisant nos services, 
    vous acceptez d'être lié par ces Conditions d'utilisation. 
    Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre plateforme.
  </p>

  <h2>2. Description du service</h2>
  <p>
    Hype Market est une marketplace en ligne basée en Côte d'Ivoire, 
    spécialisée dans la mode africaine, les produits artisanaux et les créations locales. 
    Nous mettons en relation vendeurs et acheteurs sur notre plateforme.
  </p>

  <h2>3. Inscription</h2>
  <p>Pour créer un compte, vous devez :</p>
  <ul>
    <li>Avoir au moins 18 ans ou l'autorisation parentale</li>
    <li>Fournir des informations exactes et à jour</li>
    <li>Maintenir la sécurité de votre mot de passe</li>
    <li>Accepter ces conditions d'utilisation</li>
  </ul>

  <h2>4. Paiements</h2>
  <p>
    Les transactions sont effectuées en Francs CFA (FCFA). 
    Nous acceptons les paiements par carte bancaire, mobile money et virement bancaire.
  </p>

  <h2>5. Contact</h2>
  <p>
    Pour toute question concernant ces conditions, contactez-nous à :<br />
    📧 Email : <a href="mailto:legal@hypemarket.ci">legal@hypemarket.ci</a><br />
    📱 WhatsApp : +225 XX XX XX XX XX
  </p>

  <p className="text-sm text-gray-500 mt-8 text-center border-t pt-4">
    Dernière mise à jour : 24 Octobre 2025
  </p>
</div>
```

---

## 🧪 Test du système

### 1. Tester l'inscription avec conditions :
1. Allez sur `/register`
2. Remplissez le formulaire
3. **Ne cochez PAS** la case → Bouton désactivé ✅
4. **Cochez la case** → Bouton actif ✅
5. Essayez de soumettre sans cocher → Message d'erreur ✅

### 2. Tester les liens :
1. Cliquez sur "Conditions d'utilisation" → Ouvre `/terms` dans un nouvel onglet ✅
2. Cliquez sur "Politique de confidentialité" → Ouvre `/privacy` dans un nouvel onglet ✅

### 3. Tester la validation API :
Si quelqu'un contourne le front-end, l'API bloquera l'inscription ✅

---

## 📱 Page responsive

La page des conditions est automatiquement responsive :
- ✅ Mobile : Lecture confortable sur petit écran
- ✅ Tablette : Adaptation automatique
- ✅ Desktop : Largeur maximale de 4xl (896px)

---

## ⚖️ Conseils juridiques

**⚠️ Important :**
- Consultez un avocat pour rédiger vos conditions d'utilisation
- Adaptez-les aux lois ivoiriennes
- Mentionnez le droit applicable (Côte d'Ivoire)
- Mettez à jour la date de dernière modification
- Archivez les versions précédentes

**Éléments spécifiques à la Côte d'Ivoire :**
- Conformité ARTCI (Autorité de Régulation des Télécommunications)
- Loi sur les transactions électroniques
- Protection du consommateur ivoirien
- Traitement des données personnelles

---

## ✅ Checklist avant mise en production

- [ ] Contenu des conditions rédigé et vérifié
- [ ] Date de dernière mise à jour correcte
- [ ] Adresse email de contact fonctionnelle
- [ ] Page `/privacy` également personnalisée
- [ ] Test complet du parcours d'inscription
- [ ] Vérification juridique par un avocat
- [ ] Sauvegarde de la version actuelle

---

Votre système est prêt ! Il ne vous reste plus qu'à personnaliser le contenu. 🚀

Bon travail ! 📄✨
