@echo off
echo ========================================
echo   Preparer pour Deploiement Vercel
echo ========================================
echo.

echo Modifications effectuees:
echo - Prisma Schema: SQLite -^> PostgreSQL
echo - Guide de deploiement Vercel cree
echo.

echo Ajout des fichiers...
git add .

echo.
echo Creation du commit...
git commit -m "Configuration pour deploiement Vercel (PostgreSQL + guide complet)"

echo.
echo Push vers GitHub...
git push origin main

echo.
echo ========================================
echo   Code pousse sur GitHub avec succes!
echo ========================================
echo.
echo Prochaine etape:
echo 1. Ouvrez DEPLOIEMENT_VERCEL.md
echo 2. Suivez les etapes
echo 3. Votre site sera en ligne!
echo.
pause
