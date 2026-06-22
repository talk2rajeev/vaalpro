import React from 'react';
import { Outlet } from 'react-router';
import DashboardHeader from '@/apps/shared/components/DashboardHeader';
import Sidebar from '../../components/Sidebar';

export const CaaldocLayout: React.FC = () => {

  return (
    <div className="flex h-screen min-h-0 flex-col overflow-hidden">
      <DashboardHeader showLogo/>
      <div className="flex min-h-0 flex-1 bg-slate-50 overflow-hidden w-full">
        
        {/* Sidebar - Stays rendered even on Unauthorized content */}
        <Sidebar />

        {/* Main Container */}
        <main className="min-h-0 flex-1 flex flex-col">
          
          
          {/* Scrollable Content Viewport Container */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="min-h-full max-w-7xl mx-auto">
              {/* The individual sub-page or the Unauthorized Alert will mount precisely here */}
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
