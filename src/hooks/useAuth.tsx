import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: { user: User; accessToken: string; refreshToken: string }) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      api
        .get('/auth/profile')
        .then((res: any) => {
          if (res.data?.user) {
            const u = res.data.user;
            const updatedUser: User = {
              id: u.userId || u.id || user?.id || '',
              email: u.email || user?.email || '',
              fullName: user?.fullName || u.email || '',
              phone: user?.phone,
              avatarUrl: user?.avatarUrl,
              roles: u.roles || user?.roles || [],
              merchantId: u.merchantId || user?.merchantId,
            };
            setUser((prev) => ({ ...prev, ...updatedUser }));
            localStorage.setItem('user', JSON.stringify({ ...user, ...updatedUser }));
          }
        })
        .catch((err: any) => {
          console.error('Session sync error:', err);
        });
    }
  }, [token]);

  const login = (data: { user: User; accessToken: string; refreshToken: string }) => {
    setUser(data.user);
    setToken(data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
