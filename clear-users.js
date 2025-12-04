// Charger les variables d'environnement
require('dotenv').config({ path: '.env.production' })

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function clearUsers() {
  console.log('🗑️  Suppression de tous les utilisateurs...\n')
  
  try {
    // Supprimer les OTP tokens d'abord
    const otpDeleted = await prisma.otpToken.deleteMany()
    console.log(`✅ ${otpDeleted.count} OTP tokens supprimés`)
    
    // Supprimer les utilisateurs
    const usersDeleted = await prisma.user.deleteMany()
    console.log(`✅ ${usersDeleted.count} utilisateurs supprimés`)
    
    console.log('\n🎉 Table User vidée avec succès!')
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await prisma.$disconnect()
  }
}

clearUsers()
