@echo off
echo Configuration Git...

git config --global user.name "DavidTchimou225"
git config --global user.email "davidtchimou225@gmail.com"

echo.
echo Git configuré avec succès!
echo Nom: DavidTchimou225
echo Email: davidtchimou225@gmail.com
echo.
echo Création du commit...

git commit -m "Initial commit: Hype Market - Marketplace complete"

echo.
echo Commit créé avec succès!
echo.
echo Prochaines étapes:
echo 1. Créez un repo sur GitHub: https://github.com/new
echo 2. Nom du repo: hype-market
echo 3. Ne cochez pas "Initialize with README"
echo 4. Puis exécutez: push-to-github.bat
echo.
pause
