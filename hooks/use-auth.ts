'use client';

import { useState, useCallback, useEffect } from 'react';
import { User, getCurrentUser, setCurrentUser, getAllUsers, createUser } from '@/lib/data';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  farmId: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth on mount
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simple validation - in production, this would be a real API call
      const users = getAllUsers();
      const foundUser = users.find((u) => u.email === credentials.email);

      if (!foundUser) {
        setError('User not found');
        setIsLoading(false);
        return false;
      }

      setCurrentUser(foundUser);
      setUser(foundUser);
      setIsLoading(false);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      setIsLoading(false);
      return false;
    }
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const users = getAllUsers();
      if (users.some((u) => u.email === credentials.email)) {
        setError('Email already registered');
        setIsLoading(false);
        return false;
      }

      const newUser = createUser({
        email: credentials.email,
        name: credentials.name,
        farmId: credentials.farmId,
        role: 'farm_staff',
      });

      setCurrentUser(newUser);
      setUser(newUser);
      setIsLoading(false);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      setIsLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setCurrentUser(null as any);
  }, []);

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
}
