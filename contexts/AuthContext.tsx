'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextValue } from '@/types/auth';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'swipesmart_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const userData = JSON.parse(stored);
        setUser(userData);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Login failed:', error.error || 'Unknown error');
        return false;
      }

      const data = await response.json();
      
      // Extract user data from backend response
      const userData: User = {
        id: data.user_id || data.id || `user_${Date.now()}`,
        name: data.name || email.split('@')[0],
        email: data.email || email,
        createdAt: data.created_at || new Date().toISOString()
      };
      
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Signup failed:', error.error || 'Unknown error');
        return false;
      }

      const data = await response.json();
      
      // Extract user data from backend response
      const userData: User = {
        id: data.user_id || data.id || `user_${Date.now()}`,
        name: data.name || name,
        email: data.email || email,
        createdAt: data.created_at || new Date().toISOString()
      };
      
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    // Also clear chat storage on logout
    localStorage.removeItem('swipesmart_chats');
  };

  const value: AuthContextValue = {
    user,
    isLoading,
    login,
    signup,
    logout,
    isAuthenticated: user !== null
  };

  return (
    <AuthContext.Provider value={value}>
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
