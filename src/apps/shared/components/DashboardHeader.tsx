import React from 'react';
import { Bell, ChevronDown, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui';
import type { RootState } from '@/store/store';
import { logout } from '@/features/auth/authSlice';

const DashboardHeader: React.FC<{ showLogo?: boolean }> = ({ showLogo }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, moduleData } = useSelector((state: RootState) => state.auth);
  const displayName = user ?? 'Rajeev Kumar';
  const roleLabel = moduleData?.userType?.replace('_', ' ') ?? 'System Admin';

  const navigateToVaalpro = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
      <div className="flex items-center gap-8">
        {showLogo && (
          <button type="button" onClick={navigateToVaalpro} className="shrink-0">
            <img src="/images/vaalpro-logo.png" alt="Vaalpro Logo" className="h-10" />
          </button>
        )}
        {/* <div className="relative w-96">navigateToVaalpro
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search assets, workflows, or rooms..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div> */}
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="h-8 w-px bg-slate-200 mx-2"></div>
        <DropdownMenuPrimitive.Root>
          <DropdownMenuPrimitive.Trigger asChild>
            <button
              type="button"
              className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              aria-label="Open user menu"
            >
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">{displayName}</p>
                <p className="text-xs text-slate-500">{roleLabel}</p>
              </div>
              <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`} alt="Avatar" />
              </div>
              <ChevronDown size={16} className="text-slate-400" />
            </button>
          </DropdownMenuPrimitive.Trigger>
          <DropdownMenuPrimitive.Portal>
            <DropdownMenuPrimitive.Content
              align="end"
              sideOffset={8}
              className="z-50 min-w-48 rounded-lg border border-slate-200 bg-white p-1 shadow-lg outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
            >
              <DropdownMenuPrimitive.Item
                onSelect={handleLogout}
                className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-red-600 outline-none transition-colors hover:bg-red-50 focus:bg-red-50"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </DropdownMenuPrimitive.Item>
            </DropdownMenuPrimitive.Content>
          </DropdownMenuPrimitive.Portal>
        </DropdownMenuPrimitive.Root>
      </div>
    </header>
  );
};

export default DashboardHeader;
