'use client';

import { useState } from 'react';
import { AppProvider, useAppContext } from '@/lib/app-context';
import { Sidebar, type Page } from '@/components/sidebar';
import { Dashboard } from '@/components/dashboard';
import { FarmsPage } from '@/components/farms';
import { CropsPage } from '@/components/crops';
import { ActivitiesPage } from '@/components/activities';
import { HarvestPage } from '@/components/harvest';
import { ExpensesPage } from '@/components/expenses';
import { ReportsPage } from '@/components/reports';
import { WeatherTipsPage } from '@/components/weather-tips';
import { UsersPage, SettingsPage } from '@/components/users-settings';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const { currentUser } = useAppContext();

  const handleLogout = () => {
    localStorage.removeItem('farm_current_user');
    window.location.reload();
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'farms':
        return <FarmsPage />;
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
        return <ReportsPage />;
      case 'users':
        return <UsersPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-2 text-green-700">Farm Tracker</h1>
          <p className="text-center text-muted-foreground mb-6">Farm Management System v2.0</p>
          <button
            onClick={() => {
              const user = {
                id: 'admin_001',
                email: 'admin@farm.com',
                name: 'Farm Administrator',
                role: 'admin' as const,
                farmId: 'farm_001',
                createdAt: new Date().toISOString(),
              };
              localStorage.setItem('farm_current_user', JSON.stringify(user));
              window.location.reload();
            }}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Login as Demo User
          </button>
          <p className="text-xs text-center text-muted-foreground mt-4">
            Demo mode: Click above to access the system
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} onLogout={handleLogout} />
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">{renderPage()}</div>
      </main>
    </div>
  );
}

export default function Page() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
