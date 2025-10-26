// Sécurité et optimisations pour production
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

// Configuration sécurisée
export const SECURITY_CONFIG = {
  JWT_SECRET: process.env.JWT_SECRET || 'hype-market-super-secret-key-2024',
  JWT_EXPIRES_IN: '24h',
  BCRYPT_ROUNDS: 12,
  RATE_LIMIT: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limite de 100 requêtes par fenêtre
  },
  ADMIN_RATE_LIMIT: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 50 // limite de 50 requêtes admin par fenêtre
  }
};

// Validation des entrées utilisateur
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>]/g, '');
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[0-9\s\-\(\)]{8,15}$/;
  return phoneRegex.test(phone);
}

export function validatePrice(price: number): boolean {
  return typeof price === 'number' && price >= 0 && price <= 10000000; // Max 100,000 FCFA
}

export function validateStock(stock: number): boolean {
  return typeof stock === 'number' && stock >= 0 && stock <= 10000;
}

// Protection CSRF
export function validateCSRFToken(request: NextRequest): boolean {
  const token = request.headers.get('x-csrf-token');
  const sessionToken = request.cookies.get('csrf-token')?.value;
  return token === sessionToken;
}

// Logging sécurisé
export function logSecurityEvent(event: string, details: any, request?: NextRequest) {
  const logData = {
    timestamp: new Date().toISOString(),
    event,
    details: sanitizeLogData(details),
    ip: request?.ip || 'unknown',
    userAgent: request?.headers.get('user-agent') || 'unknown'
  };
  
  console.log('[SECURITY]', JSON.stringify(logData));
}

function sanitizeLogData(data: any): any {
  if (typeof data !== 'object' || data === null) return data;
  
  const sanitized = { ...data };
  const sensitiveFields = ['password', 'token', 'secret', 'key'];
  
  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  }
  
  return sanitized;
}

// Validation des permissions admin
export function hasAdminPermission(userRole: string, action: string): boolean {
  const permissions: Record<string, string[]> = {
    'SUPER_ADMIN': ['*'],
    'ADMIN': [
      'read:users', 'read:stores', 'read:orders', 'read:categories',
      'update:stores', 'update:orders', 'create:categories'
    ],
    'USER': []
  };
  
  const userPermissions: string[] = permissions[userRole] || [];
  return userPermissions.includes('*') || userPermissions.includes(action);
}

// Rate limiting en mémoire (pour production, utiliser Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(identifier: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= limit) {
    return false;
  }
  
  record.count++;
  return true;
}

// Nettoyage périodique du rate limiting
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Nettoyage toutes les minutes
