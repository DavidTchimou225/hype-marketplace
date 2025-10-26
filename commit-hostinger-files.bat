@echo off
echo ========================================
echo   Commit Fichiers Hostinger sur GitHub
echo ========================================
echo.

echo Ajout des nouveaux fichiers...
git add .

echo.
echo Creation du commit...
git commit -m "Ajout configuration complete pour deploiement Hostinger"

echo.
echo Push vers GitHub...
git push origin main

echo.
echo ========================================
echo   Fichiers pousses avec succes!
echo ========================================
echo.
echo Fichiers ajoutes:
echo - ecosystem.config.js
echo - .htaccess
echo - .env.production
echo - deploy.sh
echo - DEPLOIEMENT_HOSTINGER.md
echo - COMMANDES_HOSTINGER.md
echo - DATABASE_HOSTINGER_SETUP.md
echo - GUIDE_COMPLET_HOSTINGER.md
echo - LANCEMENT_RAPIDE.md
echo.
echo Votre repo est a jour!
echo https://github.com/DavidTchimou225/hype-market
echo.
pause
