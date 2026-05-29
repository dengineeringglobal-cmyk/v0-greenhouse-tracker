'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Farm, initializeData, initializeTips, getCurrentUser, getFarms, logoutUser, canUserAccessFarm } from './data';

interface AppContextType {
  currentUser: User | null;
  currentFarm: Farm | null;
  farms: Farm[];
  isInitialized: boolean;
  isAuthenticated: boolean;
  setCurrentFarm: (farm: Farm) => void;
  refreshFarms: () => void;
  logout: () => void;
  canAccessFarm: (farmId: string) => boolean;
  isAdmin: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentFarm, setCurrentFarm] = useState<Farm | null>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Initialize data on mount
    initializeData();
    initializeTips();

    const user = getCurrentUser();
    setCurrentUser(user);

    const allFarms = getFarms();
    setFarms(allFarms);

    // Set current farm based on user's farmId
    if (user && allFarms.length > 0) {
      const userFarm = allFarms.find((f) => f.id === user.farmId);
      if (userFarm) {
        setCurrentFarm(userFarm);
      }
    }

    setIsInitialized(true);
  }, []);

  const refreshFarms = () => {
    const allFarms = getFarms();
    setFarms(allFarms);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setCurrentFarm(null);
    router.push('/auth/login');
  };

  const handleCanAccessFarm = (farmId: string) => {
    if (!currentUser) return false;
    return canUserAccessFarm(currentUser, farmId);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentFarm,
        farms,
        isInitialized,
        isAuthenticated: currentUser !== null,
        setCurrentFarm,
        refreshFarms,
        logout: handleLogout,
        canAccessFarm: handleCanAccessFarm,
        isAdmin: currentUser?.role === 'admin' || false,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
