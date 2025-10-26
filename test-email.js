/**
 * Script de test pour vérifier la configuration SMTP
 * 
 * Usage: node test-email.js votre-email@exemple.com
 */

require('dotenv').config();
const nodemailer = require('nodemailer');

// Récupérer l'email de destination depuis les arguments
const toEmail = process.argv[2];

if (!toEmail) {
  console.error('\n❌ Erreur: Veuillez fournir une adresse email de test');
  console.log('\nUsage: node test-email.js votre-email@exemple.com\n');
  process.exit(1);
}

console.log('\n🔍 Vérification de la configuration SMTP...\n');

// Vérifier les variables d'environnement
const config = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
  from: process.env.SMTP_FROM || 'no-reply@hype-market.com'
};

console.log('📧 Configuration détectée:');
console.log(`   SMTP_HOST: ${config.host || '❌ Non configuré'}`);
console.log(`   SMTP_PORT: ${config.port}`);
console.log(`   SMTP_USER: ${config.user || '❌ Non configuré'}`);
console.log(`   SMTP_PASS: ${config.pass ? '✅ Configuré' : '❌ Non configuré'}`);
console.log(`   SMTP_FROM: ${config.from}\n`);

// Vérifier que tous les paramètres sont présents
if (!config.host || !config.user || !config.pass) {
  console.error('❌ Configuration incomplète !');
  console.error('\nVeuillez configurer toutes les variables SMTP dans le fichier .env:\n');
  console.error('   SMTP_HOST=smtp.example.com');
  console.error('   SMTP_PORT=587');
  console.error('   SMTP_USER=votre-email@exemple.com');
  console.error('   SMTP_PASS=votre-mot-de-passe');
  console.error('   SMTP_FROM=noreply@hypemarket.ci\n');
  process.exit(1);
}

// Créer le template OTP de test
const testCode = Math.floor(100000 + Math.random() * 900000).toString();

const htmlTemplate = `
  <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#111;max-width:600px;margin:0 auto;">
    <div style="background:#111;color:#fff;padding:20px;text-align:center;">
      <h1 style="margin:0;">Hype Market</h1>
    </div>
    
    <div style="padding:40px 20px;background:#f9f9f9;">
      <h2 style="color:#111;margin-top:0;">🧪 Test de Configuration Email</h2>
      <p>Si vous recevez cet email, votre configuration SMTP fonctionne parfaitement !</p>
      
      <div style="background:#fff;padding:20px;border-radius:8px;margin:20px 0;border:2px solid #111;">
        <p style="margin:0 0 10px 0;color:#666;">Votre code OTP de test :</p>
        <div style="font-size:40px;font-weight:700;letter-spacing:8px;color:#111;text-align:center;">
          ${testCode}
        </div>
      </div>
      
      <p style="color:#666;font-size:14px;margin-top:20px;">
        ℹ️ <strong>Informations techniques :</strong><br>
        • Serveur SMTP: ${config.host}<br>
        • Port: ${config.port}<br>
        • De: ${config.from}<br>
        • À: ${toEmail}
      </p>
      
      <p style="margin-top:30px;padding-top:20px;border-top:1px solid #ddd;color:#999;font-size:12px;">
        Ceci est un email de test automatique du système Hype Market.<br>
        Si vous n'avez pas demandé ce test, vous pouvez ignorer cet email.
      </p>
    </div>
    
    <div style="background:#111;color:#fff;padding:15px;text-align:center;font-size:12px;">
      <p style="margin:0;">© 2025 Hype Market - Marketplace Ivoirienne</p>
    </div>
  </div>
`;

// Créer le transporteur
console.log('🚀 Tentative d\'envoi de l\'email de test...\n');

const transporter = nodemailer.createTransport({
  host: config.host,
  port: config.port,
  secure: config.port === 465,
  auth: {
    user: config.user,
    pass: config.pass
  },
  // Ajout de debug
  debug: true,
  logger: false
});

// Vérifier la connexion
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Échec de la connexion SMTP:\n');
    console.error(error.message);
    console.error('\n💡 Conseils:');
    console.error('   1. Vérifiez que SMTP_HOST et SMTP_PORT sont corrects');
    console.error('   2. Vérifiez vos identifiants SMTP_USER et SMTP_PASS');
    console.error('   3. Pour Gmail, utilisez un "Mot de passe d\'application"');
    console.error('   4. Vérifiez que votre pare-feu autorise la connexion SMTP\n');
    process.exit(1);
  } else {
    console.log('✅ Connexion SMTP réussie !\n');
    console.log('📤 Envoi de l\'email de test...\n');
    
    // Envoyer l'email
    transporter.sendMail({
      from: config.from,
      to: toEmail,
      subject: '🧪 Test de Configuration SMTP - Hype Market',
      html: htmlTemplate
    }, (error, info) => {
      if (error) {
        console.error('❌ Échec de l\'envoi:\n');
        console.error(error.message);
        console.error('\n💡 Vérifiez que SMTP_FROM utilise un domaine autorisé\n');
        process.exit(1);
      } else {
        console.log('✅ Email envoyé avec succès !\n');
        console.log('📬 Détails:');
        console.log(`   Message ID: ${info.messageId}`);
        console.log(`   Destinataire: ${toEmail}`);
        console.log(`   Code OTP de test: ${testCode}\n`);
        console.log('🎉 Votre configuration SMTP est opérationnelle !\n');
        console.log('Vous pouvez maintenant utiliser l\'envoi d\'OTP dans votre application.\n');
      }
    });
  }
});
