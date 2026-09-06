'use client';

import { createContext, useContext, useSyncExternalStore, type ReactNode } from 'react';

type AuthContextType = {
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('auth-change', callback);

  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('auth-change', callback);
  };
}

function getSnapshot() {
  return Boolean(localStorage.getItem('access_token'));
}

function getServerSnapshot() {
  return false;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const isLoggedIn = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const login = (token: string) => {
    localStorage.setItem('access_token', token);

    window.dispatchEvent(new Event('auth-change'));
  };

  const logout = () => {
    localStorage.removeItem('access_token');

    window.dispatchEvent(new Event('auth-change'));
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
