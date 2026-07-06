import React from 'react';
import { Outlet } from 'react-router';
import DashboardHeader from '@/apps/shared/components/DashboardHeader';
import SideMenu from '../SideMenu';

export const VaalProLayout: React.FC = () => {
  return (
    <div className="flex h-screen min-h-0 flex-col overflow-hidden">
      <DashboardHeader showLogo />
      <div className="flex min-h-0 flex-1 bg-slate-50 overflow-hidden w-full">

        {/* Sidebar */}
        <SideMenu />

        {/* Main Container */}
        <main className="min-h-0 flex-1 flex flex-col">

          {/* Scrollable Content Viewport Container */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="min-h-full max-w-7xl mx-auto">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
