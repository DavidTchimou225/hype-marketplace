'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (emailOrPhone: string, password: string) => Promise<{ success: boolean; error?: string; needsVerification?: boolean; email?: string }>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté (localStorage)
    const savedUser = localStorage.getItem('hype-market-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Erreur lors du chargement de l\'utilisateur:', error);
        localStorage.removeItem('hype-market-user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (emailOrPhone: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrPhone, password }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setUser(result.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('hype-market-user', JSON.stringify(result.user));
        }
        return { success: true };
      }
      
      // Gérer le cas des comptes non vérifiés
      if (result.needsVerification) {
        return { 
          success: false, 
          needsVerification: true, 
          email: result.email,
          error: result.error 
        };
      }
      
      return { success: false, error: result.error || 'Erreur de connexion' };
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return { success: false, error: 'Erreur serveur' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hype-market-user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
