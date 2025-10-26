#!/bin/bash

echo "🚀 Déploiement Hype Market sur Hostinger"
echo "=========================================="

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Arrêter en cas d'erreur
set -e

echo ""
echo -e "${BLUE}1. Récupération des dernières modifications depuis GitHub...${NC}"
git pull origin main

echo ""
echo -e "${BLUE}2. Installation des dépendances...${NC}"
npm install --production

echo ""
echo -e "${BLUE}3. Génération du client Prisma...${NC}"
npx prisma generate

echo ""
echo -e "${BLUE}4. Migration de la base de données...${NC}"
npx prisma migrate deploy

echo ""
echo -e "${BLUE}5. Build de l'application...${NC}"
npm run build

echo ""
echo -e "${BLUE}6. Redémarrage de l'application avec PM2...${NC}"
pm2 restart hype-market || pm2 start ecosystem.config.js

echo ""
echo -e "${BLUE}7. Sauvegarde de la configuration PM2...${NC}"
pm2 save

echo ""
echo -e "${GREEN}✅ Déploiement terminé avec succès!${NC}"
echo ""
echo "📊 Statut de l'application:"
pm2 status

echo ""
echo "📝 Logs en direct:"
echo "   pm2 logs hype-market"
echo ""
echo "🌐 Votre site est en ligne!"
