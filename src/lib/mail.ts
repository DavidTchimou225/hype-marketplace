import nodemailer from 'nodemailer';

export async function sendEmail(to: string, subject: string, html: string) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.FROM_EMAIL || process.env.SMTP_FROM || 'no-reply@hype-market.com';

  if (!host || !user || !pass) {
    console.warn('[mail] SMTP not configured. Email would be sent to:', to, subject);
    console.warn(html);
    return { mocked: true } as const;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({ from, to, subject, html });
  return { mocked: false } as const;
}

export function otpEmailTemplate(code: string, purpose: 'REGISTER' | 'RESET_PASSWORD') {
  const title = purpose === 'REGISTER' ? 'Vérification de votre email' : 'Réinitialisation de mot de passe';
  const intro = purpose === 'REGISTER'
    ? 'Utilisez le code ci-dessous pour vérifier votre adresse email et activer votre compte.'
    : 'Utilisez le code ci-dessous pour réinitialiser votre mot de passe.';

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#111">
    <h2>Hype Market — ${title}</h2>
    <p>${intro}</p>
    <div style="font-size:32px;font-weight:700;letter-spacing:6px;background:#111;color:#fff;padding:12px 16px;display:inline-block;border-radius:8px;">
      ${code}
    </div>
    <p style="margin-top:16px;color:#555">Ce code expire dans 10 minutes. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
  </div>`;
}
