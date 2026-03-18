'use client';

import { Leaf, LayoutDashboard, Warehouse, Activity, Sprout, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

type Page = 'dashboard' | 'greenhouses' | 'production' | 'harvest' | 'reports';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems = [
  { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'greenhouses' as Page, label: 'Greenhouses', icon: Warehouse },
  { id: 'production' as Page, label: 'Production Monitoring', icon: Activity },
  { id: 'harvest' as Page, label: 'Harvest Monitoring', icon: Sprout },
  { id: 'reports' as Page, label: 'Reports', icon: FileText },
];

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 bg-green-900 text-white flex flex-col min-h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-green-800">
        <div className="flex items-center gap-3">
          <div className="bg-green-700 p-2 rounded-lg">
            <Leaf className="w-6 h-6 text-green-100" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Bell Pepper</h1>
            <p className="text-xs text-green-300">Farm Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all',
                    isActive
                      ? 'bg-green-700 text-white shadow-lg'
                      : 'text-green-200 hover:bg-green-800 hover:text-white'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-green-800">
        <p className="text-xs text-green-400 text-center">
          Bell Pepper Farm System v1.0
        </p>
      </div>
    </aside>
  );
}
