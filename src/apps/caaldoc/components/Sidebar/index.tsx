import React from 'react';
import { LayoutDashboard, ClipboardList, Settings, LogOut, Building2 } from 'lucide-react';
import { logout } from '@/features/auth/authSlice';
import { useDispatch } from 'react-redux';


const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  return <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
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
        <div className="p-4 border-t border-slate-100">
          <button onClick={() => dispatch(logout())} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-medium">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
    </aside>;
};

export default Sidebar;
