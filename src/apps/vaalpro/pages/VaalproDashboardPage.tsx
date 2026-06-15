import React from 'react';
import { LayoutDashboard, ClipboardList, Building2, Settings, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '@/features/auth/authSlice';
import DashboardHeader from '@/apps/shared/components/DashboardHeader';

const VaalproDashboardPage: React.FC = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden w-full">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <img src="/images/vaalpro-logo.png" alt="Vaalpro" className="h-auto w-36" />
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-blue-600 font-semibold transition-all">
            <LayoutDashboard size={20} />
            <span>Overview</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-all">
            <ClipboardList size={20} />
            <span>Workflows</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-all">
            <Building2 size={20} />
            <span>Hierarchy</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-all">
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-medium"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Vaalpro Workspace
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Vaalpro Dashboard</h1>
            <p className="mt-3 text-slate-600">
              Welcome back, here's what's happening across your Vaalpro workspace today.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VaalproDashboardPage;
