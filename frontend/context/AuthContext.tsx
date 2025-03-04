'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { isAuthenticated, setAuthToken, clearAuthToken } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  const login = (token: string) => {
    setAuthToken(token);
    setIsLoggedIn(true);
    router.push('/');
  };

  const logout = () => {
    clearAuthToken();
    setIsLoggedIn(false);
    router.push('/signin');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
