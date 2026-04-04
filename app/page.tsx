'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/lib/app-context';
import { Sidebar, type Page } from '@/components/sidebar';
import { Dashboard } from '@/components/dashboard';
import { FarmsPage } from '@/components/farms';
import { FieldsPage } from '@/components/fields';
import { CropsPage } from '@/components/crops';
import { ActivitiesPage } from '@/components/activities';
import { HarvestPage } from '@/components/harvest';
import { ExpensesPage } from '@/components/expenses';
import { AdvancedReportsPage } from '@/components/advanced-reports';
import { WeatherTipsPage } from '@/components/weather-tips';
import { UsersPage, SettingsPage } from '@/components/users-settings';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const { currentUser, logout, isInitialized } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !currentUser) {
      router.push('/auth/login');
    }
  }, [isInitialized, currentUser, router]);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'farms':
        return <FarmsPage />;
      case 'fields':
        return <FieldsPage />;
      case 'crops':
        return <CropsPage />;
      case 'activities':
        return <ActivitiesPage />;
      case 'harvest':
        return <HarvestPage />;
      case 'expenses':
        return <ExpensesPage />;
      case 'weather':
        return <WeatherTipsPage />;
      case 'tips':
        return <WeatherTipsPage />;
      case 'reports':
        return <AdvancedReportsPage />;
      case 'users':
        return <UsersPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  if (!isInitialized || !currentUser) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} onLogout={logout} />
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">{renderPage()}</div>
      </main>
    </div>
  );
}

export default function Home() {
  return <AppContent />;
}
