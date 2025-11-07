import { NextResponse } from 'next/server';
import { sendEmail as sendEmailLib, otpEmailTemplate } from '@/lib/mail';

// Stockage temporaire des OTPs en mémoire (en production, utiliser Redis ou une DB)
const otpStore = new Map<string, { code: string; expires: number }>();

// Fonction pour générer un code OTP à 6 chiffres
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Fonction pour envoyer un SMS (simulation - à remplacer par une vraie API SMS)
async function sendSMS(phone: string, code: string): Promise<boolean> {
  // TODO: Intégrer avec un service SMS réel (Twilio, SMS API, etc.)
  console.log(`📱 SMS envoyé à ${phone}: Votre code OTP Hype Marketplace est: ${code}`);
  
  // Simulation d'envoi réussi
  return true;
}

// Fonction pour envoyer un email réel via SMTP
async function sendOTPEmail(email: string, code: string, type: string): Promise<boolean> {
  try {
    const subject = type === 'boutique' 
      ? 'Code de vérification - Inscription Boutique' 
      : 'Code de vérification - Hype Marketplace';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Hype Marketplace</h1>
        </div>
        
        <div style="background: #ffffff; padding: 40px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Code de vérification</h2>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Bonjour,
          </p>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Votre code de vérification pour ${type === 'boutique' ? '<strong>l\'inscription de votre boutique</strong>' : '<strong>votre compte</strong>'} est :
          </p>
          
          <div style="background: #f7f7f7; border: 2px dashed #667eea; border-radius: 8px; padding: 25px; text-align: center; margin: 30px 0;">
            <div style="font-size: 42px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">
              ${code}
            </div>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            ⏱️ Ce code est valide pendant <strong>10 minutes</strong>.
          </p>
          
          <p style="color: #999; font-size: 13px; line-height: 1.6; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            Si vous n'avez pas demandé ce code, ignorez cet email.
          </p>
          
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            Cordialement,<br>
            <strong>L'équipe Hype Marketplace</strong>
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          © 2024 Hype Marketplace. Tous droits réservés.
        </div>
      </div>
    `;
    
    await sendEmailLib(email, subject, html);
    console.log(`✅ Email OTP envoyé à ${email}`);
    return true;
  } catch (error) {
    console.error(`❌ Erreur envoi email OTP à ${email}:`, error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, phone, type = 'general' } = body;

    // Validation des données
    if (!email || !phone) {
      return NextResponse.json(
        { error: 'Email et téléphone requis' },
        { status: 400 }
      );
    }

    // Générer un code OTP
    const otpCode = generateOTP();

    // Stocker l'OTP avec une expiration de 10 minutes
    const key = `${email}:${phone}`;
    otpStore.set(key, {
      code: otpCode,
      expires: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    // Envoyer l'OTP par SMS et Email
    const [smsSuccess, emailSuccess] = await Promise.all([
      sendSMS(phone, otpCode),
      sendOTPEmail(email, otpCode, type)
    ]);

    const response: any = {
      success: true,
      message: 'Code OTP envoyé par Email'
    }

    // Afficher le code UNIQUEMENT en développement
    if (process.env.NODE_ENV === 'development') {
      response.debug = { code: otpCode }
      console.log('🔑 CODE OTP BOUTIQUE (DEV ONLY):', otpCode)
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Erreur send-otp:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// Fonction utilitaire pour vérifier un OTP (utilisée par d'autres APIs)
export function verifyOTP(email: string, phone: string, code: string): boolean {
  const key = `${email}:${phone}`;
  const stored = otpStore.get(key);

  if (!stored) {
    return false;
  }

  // Vérifier l'expiration
  if (Date.now() > stored.expires) {
    otpStore.delete(key);
    return false;
  }

  // Vérifier le code
  if (stored.code !== code) {
    return false;
  }

  // OTP valide, le supprimer
  otpStore.delete(key);
  return true;
}
