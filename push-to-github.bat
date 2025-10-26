@echo off
echo Connexion à GitHub...

git remote add origin https://github.com/DavidTchimou225/hype-market.git
git branch -M main
git push -u origin main

echo.
echo Code poussé sur GitHub avec succès!
echo Voir votre repo: https://github.com/DavidTchimou225/hype-market
echo.
pause
