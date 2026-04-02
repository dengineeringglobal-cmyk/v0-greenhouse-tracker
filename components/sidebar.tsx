'use client';

import { Leaf, LayoutDashboard, Warehouse, Activity, Sprout, FileText, Settings, LogOut, DollarSign, CloudRain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/lib/app-context';

export type Page = 'dashboard' | 'farms' | 'crops' | 'activities' | 'harvest' | 'expenses' | 'reports' | 'weather' | 'tips' | 'users' | 'settings';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout?: () => void;
}

const navItems = [
  { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard, group: 'main' },
  { id: 'farms' as Page, label: 'Farms', icon: Warehouse, group: 'main' },
  { id: 'crops' as Page, label: 'Crops', icon: Sprout, group: 'main' },
  { id: 'activities' as Page, label: 'Activities', icon: Activity, group: 'operations' },
  { id: 'harvest' as Page, label: 'Harvest', icon: Leaf, group: 'operations' },
  { id: 'expenses' as Page, label: 'Expenses', icon: DollarSign, group: 'operations' },
  { id: 'weather' as Page, label: 'Weather', icon: CloudRain, group: 'tools' },
  { id: 'tips' as Page, label: 'Tips', icon: FileText, group: 'tools' },
  { id: 'reports' as Page, label: 'Reports', icon: FileText, group: 'tools' },
  { id: 'users' as Page, label: 'Users', icon: Settings, group: 'admin' },
  { id: 'settings' as Page, label: 'Settings', icon: Settings, group: 'admin' },
];

const groupLabels = {
  main: 'Main',
  operations: 'Operations',
  tools: 'Tools',
  admin: 'Admin',
};

export function Sidebar({ currentPage, onNavigate, onLogout }: SidebarProps) {
  const { currentUser, currentFarm } = useAppContext();

  const groupedItems = navItems.reduce(
    (acc, item) => {
      if (!acc[item.group]) {
        acc[item.group] = [];
      }
      acc[item.group].push(item);
      return acc;
    },
    {} as Record<string, typeof navItems>
  );

  return (
    <aside className="w-64 bg-green-900 text-white flex flex-col min-h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-green-800">
        <div className="flex items-center gap-3">
          <div className="bg-green-700 p-2 rounded-lg">
            <Leaf className="w-6 h-6 text-green-100" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Farm Tracker</h1>
            <p className="text-xs text-green-300">Management System</p>
          </div>
        </div>
      </div>

      {/* Current Farm */}
      {currentFarm && (
        <div className="px-4 py-3 bg-green-800">
          <p className="text-xs text-green-300">Current Farm</p>
          <p className="text-sm font-semibold text-white truncate">{currentFarm.name}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        {Object.entries(groupedItems).map(([group, items]) => (
          <div key={group} className="mb-6">
            <p className="text-xs font-semibold text-green-300 uppercase px-2 mb-2">
              {groupLabels[group as keyof typeof groupLabels] || group}
            </p>
            <ul className="space-y-1">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => onNavigate(item.id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-all text-sm',
                        isActive
                          ? 'bg-green-700 text-white shadow-lg'
                          : 'text-green-200 hover:bg-green-800 hover:text-white'
                      )}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-green-800 space-y-3">
        {currentUser && (
          <div className="text-xs">
            <p className="text-green-300">Logged in as</p>
            <p className="font-semibold text-white truncate">{currentUser.name}</p>
          </div>
        )}
        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-green-200 hover:text-white hover:bg-green-800 rounded-lg transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        )}
        <p className="text-xs text-green-400 text-center">
          Farm Tracker v2.0
        </p>
      </div>
    </aside>
  );
}
