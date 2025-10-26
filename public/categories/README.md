# Images de Catégories

Ce dossier contient les images des catégories affichées sur Hype Market.

## Structure

- Placez vos images de catégories ici
- Format recommandé: SVG, PNG, JPG, WebP
- Dimensions recommandées: 400x400px minimum
- Nommage: utilisez le slug de la catégorie (ex: `femme.svg`, `homme.svg`)

## Images incluses

Les fichiers SVG placeholder sont fournis par défaut:
- `femme.svg` - Mode Femme
- `homme.svg` - Mode Homme
- `accessoires.svg` - Accessoires
- `bijoux.svg` - Bijoux
- `cosmetiques.svg` - Cosmétiques
- `chaussures.svg` - Chaussures

## Utilisation

Dans l'admin dashboard, créez ou modifiez une catégorie avec le chemin:
```
/categories/votre-image.svg
```

Les images sont automatiquement servies par Next.js depuis le dossier `/public`.

## Remplacement

Pour remplacer les images placeholder par vos propres images:
1. Ajoutez votre image dans ce dossier
2. Utilisez le même nom ou créez un nouveau fichier
3. Mettez à jour la catégorie dans l'admin avec le nouveau chemin
4. L'aperçu s'affichera automatiquement dans le formulaire

## Formats supportés

- SVG (recommandé, léger et scalable)
- PNG (pour photos avec transparence)
- JPG/JPEG (pour photos)
- WebP (format moderne, bonne compression)
