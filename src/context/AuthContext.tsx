'use client';

import { createContext, useContext, useEffect, useMemo, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  const user = useMemo<User | null>(() => {
    if (session?.user) {
      return {
        id: session.user.id,
        name: session.user.name || '',
        email: session.user.email || '',
      };
    }
    return null;
  }, [session]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('navir_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('navir_user');
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: status === 'loading',
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
