import React from 'react';
import { Outlet } from 'react-router';
import { LayoutDashboard, ClipboardList, Settings, Building2 } from 'lucide-react';
import DashboardHeader from '@/apps/shared/components/DashboardHeader';

export const CaaldocLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden w-full">
      {/* Sidebar - Stays rendered even on Unauthorized content */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        {/* <div className="p-6">
          <img src="/images/vaalpro-logo.png" alt="Vaalpro" className="h-auto w-36" />
        </div> */}
        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-blue-600 font-semibold">
            <LayoutDashboard size={20} />
            <span>Overview</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50">
            <ClipboardList size={20} />
            <span>Workflows</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50">
            <Building2 size={20} />
            <span>Hierarchy</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50">
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </nav>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        {/* Scrollable Content Viewport Container */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* The individual sub-page or the Unauthorized Alert will mount precisely here */}
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};
