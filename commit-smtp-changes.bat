@echo off
echo ========================================
echo   Commit Configuration SMTP Hostinger
echo ========================================
echo.

echo Modifications effectuees:
echo - Code mail.ts mis a jour pour SMTP
echo - Guide SMTP Hostinger cree
echo - Guide Vercel Rapide mis a jour
echo.

echo Ajout des fichiers...
git add .

echo.
echo Creation du commit...
git commit -m "Configuration SMTP Hostinger pour envoi emails"

echo.
echo Push vers GitHub...
git push origin main

echo.
echo ========================================
echo   Modifications poussees sur GitHub!
echo ========================================
echo.
echo Prochaines etapes:
echo 1. Vercel va detecter le push
echo 2. Redéploiement automatique (2-3 min)
echo 3. Ajoutez les variables SMTP dans Vercel
echo 4. Testez l'envoi d'email!
echo.
echo Guide: VERCEL_SMTP_HOSTINGER.md
echo.
pause
