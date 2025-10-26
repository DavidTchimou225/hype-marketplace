// Middleware de sécurité pour production
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, logSecurityEvent, SECURITY_CONFIG } from '@/lib/security';

export function withSecurity(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    try {
      // 1. Rate limiting
      const clientIP = request.ip || 'unknown';
      const isAdminRoute = request.nextUrl.pathname.startsWith('/api/admin');
      
      const rateLimitConfig = isAdminRoute 
        ? SECURITY_CONFIG.ADMIN_RATE_LIMIT 
        : SECURITY_CONFIG.RATE_LIMIT;

      if (!checkRateLimit(clientIP, rateLimitConfig.max, rateLimitConfig.windowMs)) {
        logSecurityEvent('RATE_LIMIT_EXCEEDED', { ip: clientIP, path: request.nextUrl.pathname }, request);
        return NextResponse.json(
          { error: 'Trop de requêtes. Veuillez réessayer plus tard.' },
          { status: 429 }
        );
      }

      // 2. Validation des headers de sécurité
      const userAgent = request.headers.get('user-agent');
      if (!userAgent || userAgent.length < 10) {
        logSecurityEvent('SUSPICIOUS_USER_AGENT', { userAgent }, request);
        return NextResponse.json(
          { error: 'Requête invalide' },
          { status: 400 }
        );
      }

      // 3. Protection contre les attaques par injection
      const suspiciousPatterns = [
        /(<script|javascript:|data:)/i,
        /(union|select|insert|delete|drop|create|alter)\s+/i,
        /(\.\.|\.\.\\)/,
        /(exec|eval|system|shell)/i
      ];

      const url = request.nextUrl.toString();
      const body = request.method !== 'GET' ? await request.clone().text() : '';
      
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(url) || pattern.test(body)) {
          logSecurityEvent('INJECTION_ATTEMPT', { url, method: request.method }, request);
          return NextResponse.json(
            { error: 'Requête bloquée pour des raisons de sécurité' },
            { status: 403 }
          );
        }
      }

      // 4. Exécuter le handler original
      const response = await handler(request, ...args);

      // 5. Ajouter les headers de sécurité à la réponse
      if (response instanceof NextResponse) {
        response.headers.set('X-Content-Type-Options', 'nosniff');
        response.headers.set('X-Frame-Options', 'DENY');
        response.headers.set('X-XSS-Protection', '1; mode=block');
        response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
        
        if (isAdminRoute) {
          response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
        }
      }

      return response;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logSecurityEvent('HANDLER_ERROR', { error: errorMessage }, request);
      return NextResponse.json(
        { error: 'Erreur interne du serveur' },
        { status: 500 }
      );
    }
  };
}
