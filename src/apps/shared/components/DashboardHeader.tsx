import React from 'react';
import { Search, Bell } from 'lucide-react';
import { useNavigate } from 'react-router';

const DashboardHeader: React.FC<{showLogo?: boolean}> = ({showLogo}) => {
  const navigate = useNavigate();

  const navigateToVaalpro = () => {
    navigate('/dashboard');
  }

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
      <div className="flex items-center gap-8">
        { showLogo && <img src="/images/vaalpro-logo.png" alt="Vaalpro Logo" className="h-10" onClick={navigateToVaalpro}/> }
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
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900">Rajeev Kumar</p>
            <p className="text-xs text-slate-500">System Admin</p>
          </div>
          <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rajeev" alt="Avatar" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
