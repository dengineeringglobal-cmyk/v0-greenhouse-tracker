'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from './supabase';
import { User, Farm, initializeData, initializeTips, getFarms, canUserAccessFarm } from './data';

interface AppContextType {
  currentUser: any | null; 
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
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [currentFarm, setCurrentFarm] = useState<Farm | null>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    initializeData();
    initializeTips();

    const loadSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Map Supabase user to your expected User structure
          const userData = {
            ...session.user,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
            role: session.user.user_metadata?.role || 'user'
          };
          
          setCurrentUser(userData);
          
          const allFarms = getFarms();
          setFarms(allFarms);

          // Force-select a farm so the dashboard doesn't stay empty
          const userFarmId = session.user.user_metadata?.farmId;
          const matchedFarm = allFarms.find(f => f.id === userFarmId);
          
          // If no specific farm is assigned to the user, pick the first one 
          // to match the "Main Greenhouse Farm" view in your screenshot
          setCurrentFarm(matchedFarm || allFarms[0] || null);
        }
      } catch (error) {
        console.error("Error loading session:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    loadSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setCurrentUser(session.user);
      } else {
        setCurrentUser(null);
        setCurrentFarm(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setCurrentFarm(null);
    router.push('/auth/login');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentFarm,
        farms,
        isInitialized,
        isAuthenticated: !!currentUser,
        setCurrentFarm,
        refreshFarms: () => setFarms(getFarms()),
        logout: handleLogout,
        canAccessFarm: (farmId) => !!currentUser,
        isAdmin: currentUser?.role === 'admin' || currentUser?.user_metadata?.role === 'admin',
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}