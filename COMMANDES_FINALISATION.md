# 🚀 Commandes pour Finaliser le Système

## 1. Régénérer Prisma Client

```bash
npx prisma generate
```

## 2. Créer la Migration

```bash
npx prisma migrate dev --name add_engagement_tracking_and_settings
```

Ou si problème:

```bash
npx prisma db push
```

## 3. Initialiser le Message Admin

Créez un message par défaut:

```bash
# Via l'API (PowerShell)
$body = @{
    key = "header_message"
    value = "🎉 Bienvenue sur Hype Market !"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/admin/settings" -Method POST -Body $body -ContentType "application/json"
```

Ou directement en SQL:

```sql
INSERT INTO settings (id, key, value, createdAt, updatedAt) 
VALUES ('setting1', 'header_message', '🎉 Bienvenue sur Hype Market !', datetime('now'), datetime('now'));
```

## 4. Initialiser les Compteurs (Optionnel)

Si vous voulez mettre des valeurs initiales pour tester:

```sql
-- Mettre des vues aléatoires pour tester
UPDATE products SET 
  viewCount = ABS(RANDOM() % 100) + 10,
  cartAddCount = ABS(RANDOM() % 20) + 1,
  purchaseCount = ABS(RANDOM() % 10)
WHERE isActive = 1;
```

## 5. Vérifier que tout fonctionne

```bash
# Démarrer le serveur
npm run dev
```

### Tests à effectuer:

1. **Message Admin**
   - http://localhost:3000/admin/settings
   - Modifier le message
   - Vérifier sur http://localhost:3000

2. **Tendances**
   - http://localhost:3000
   - Voir section "Tendances"
   - Rafraîchir plusieurs fois
   - L'ordre doit varier

3. **Tracking**
   - Visiter un produit
   - Vérifier dans Prisma Studio: `npx prisma studio`
   - `viewCount` doit augmenter

---

## 🎯 Résumé Rapide

**Vous avez maintenant:**

✅ **Message admin** gérable via `/admin/settings`
✅ **Tendances intelligentes** basées sur:
  - Vues produit (trackées auto)
  - Ajouts panier (trackés auto)
  - Achats (trackés auto)
  - Notes et avis
  - Nouveauté
  - Disponibilité

✅ **Algorithme automatique** qui:
  - Calcule les scores en temps réel
  - Mélange 70% meilleurs + 30% aléatoire
  - Privilégie produits performants
  - Donne chance aux nouveaux
  - Assure variété

**Aucune gestion manuelle nécessaire!** 🎉
