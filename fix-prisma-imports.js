/**
 * Script pour corriger automatiquement les imports PrismaClient
 * Remplace "new PrismaClient()" par l'import du singleton
 */

const fs = require('fs');
const path = require('path');

function fixPrismaImport(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Vérifier si le fichier contient "new PrismaClient"
  if (content.includes('new PrismaClient')) {
    console.log(`Correction de: ${filePath}`);

    // Remplacer l'import
    content = content.replace(
      /import { PrismaClient } from ['"]@prisma\/client['"]/g,
      "import { prisma } from '@/lib/prisma'"
    );

    // Supprimer la ligne "const prisma = new PrismaClient()"
    content = content.replace(
      /const prisma = new PrismaClient\(\);?\n/g,
      ''
    );

    fs.writeFileSync(filePath, content, 'utf8');
    modified = true;
    console.log(`✅ Corrigé: ${filePath}`);
  }

  return modified;
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  let fixedCount = 0;

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Ignorer node_modules et .next
      if (file !== 'node_modules' && file !== '.next') {
        fixedCount += walkDir(filePath);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      if (fixPrismaImport(filePath)) {
        fixedCount++;
      }
    }
  });

  return fixedCount;
}

console.log('🔍 Recherche et correction des imports PrismaClient...\n');

const apiDir = path.join(__dirname, 'src', 'app', 'api');
const middlewareDir = path.join(__dirname, 'src', 'middleware');
const libDir = path.join(__dirname, 'src', 'lib');

let totalFixed = 0;

if (fs.existsSync(apiDir)) {
  console.log('📂 Correction dans src/app/api/');
  totalFixed += walkDir(apiDir);
}

if (fs.existsSync(middlewareDir)) {
  console.log('\n📂 Correction dans src/middleware/');
  totalFixed += walkDir(middlewareDir);
}

if (fs.existsSync(libDir)) {
  console.log('\n📂 Correction dans src/lib/');
  totalFixed += walkDir(libDir);
}

console.log(`\n✅ Terminé! ${totalFixed} fichier(s) corrigé(s).`);
console.log('\n💡 Redémarrez votre serveur de développement: npm run dev');
