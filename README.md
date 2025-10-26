# Hype Market (PWA)

Structure initiale générée. Étapes suivantes recommandées :

1) Installer Next.js + TypeScript :
   npx create-next-app@latest . --ts

2) Ajouter Tailwind CSS :
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   (pointer ./src/**/*.{ts,tsx} dans tailwind.config.js)
   (importer ./src/styles/globals.css dans src/app/layout.tsx)

3) Activer PWA (facultatif maintenant) :
   npm install next-pwa
   # configurer next.config.js avec next-pwa

4) Lancer le dev server :
   npm run dev
