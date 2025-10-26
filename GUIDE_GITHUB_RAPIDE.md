# 🚀 Guide Rapide - Mise sur GitHub

## Étape 1: Configurer Git et Commiter

Exécutez ce fichier:
```
setup-git.bat
```

Ou tapez manuellement dans le terminal:
```bash
git config --global user.name "DavidTchimou225"
git config --global user.email "votre-email@gmail.com"
git commit -m "Initial commit: Hype Market complete"
```

---

## Étape 2: Créer le Repo sur GitHub

1. **Allez sur:** https://github.com/new

2. **Remplissez:**
   - Repository name: `hype-market`
   - Description: "Marketplace de mode africaine - Côte d'Ivoire"
   - Visibilité: **Public** (ou Private si vous préférez)
   - ⚠️ **Ne cochez PAS** "Initialize this repository with a README"

3. **Cliquez:** "Create repository"

---

## Étape 3: Pousser le Code

Exécutez ce fichier:
```
push-to-github.bat
```

Ou tapez manuellement:
```bash
git remote add origin https://github.com/DavidTchimou225/hype-market.git
git branch -M main
git push -u origin main
```

**Vous devrez peut-être vous authentifier:**
- Utilisez votre token GitHub (pas votre mot de passe)
- Créer un token: https://github.com/settings/tokens
- Permissions: `repo` (accès complet)

---

## Étape 4: Vérifier

Allez sur: https://github.com/DavidTchimou225/hype-market

Vous devriez voir tout votre code ! ✅

---

## Prochaines Étapes

### Pour Déployer en Production

Voir le guide complet: **DEPLOIEMENT_PRODUCTION.md**

**Option Recommandée: Vercel (Gratuit)**
1. Créer compte: https://vercel.com/signup
2. Connecter avec GitHub
3. Importer "hype-market"
4. Déployer (1 clic)
5. Site en ligne en 2 minutes !

---

## Besoin d'Aide ?

### Erreur: "Permission denied"
→ Créez un token GitHub: https://github.com/settings/tokens

### Erreur: "Repository already exists"
→ Le repo existe déjà, utilisez:
```bash
git remote set-url origin https://github.com/DavidTchimou225/hype-market.git
git push -u origin main
```

### Erreur: "Git not found"
→ Installez Git: https://git-scm.com/download/win

---

## Commandes Git Utiles

```bash
# Voir le statut
git status

# Voir l'historique
git log --oneline

# Créer nouvelle branche
git checkout -b feature/nouvelle-fonctionnalite

# Pousser les changements
git add .
git commit -m "Description du changement"
git push

# Mettre à jour depuis GitHub
git pull
```

---

## 🎉 C'est Tout !

Votre code est maintenant sur GitHub et prêt pour le déploiement !

**URLs Importantes:**
- Votre repo: https://github.com/DavidTchimou225/hype-market
- Guide déploiement: DEPLOIEMENT_PRODUCTION.md
- Documentation: Tous les fichiers .md à la racine

Bon courage ! 🚀
