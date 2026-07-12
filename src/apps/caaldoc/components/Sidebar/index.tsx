import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  LayoutDashboard,
  ClipboardList,
  Settings,
  Building2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/core-components/tooltip';

interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  {
    label: 'Overview',
    path: '/caaldoc/dashboard',
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: 'Workflows',
    path: '/caaldoc/workflows',
    icon: <ClipboardList size={20} />,
  },
  {
    label: 'Hierarchy',
    path: '/caaldoc/hierarchy',
    icon: <Building2 size={20} />,
  },
  {
    label: 'Settings',
    path: '/caaldoc/settings',
    icon: <Settings size={20} />,
  },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <TooltipProvider>
      <aside
        className={`bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Sidebar Header with Collapse Toggle */}
        <div
          className={`p-3 px-4 flex items-center ${
            isCollapsed ? 'justify-center' : 'justify-end'
          } border-b border-slate-100 min-h-[53px]`}
        >
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            const buttonEl = (
              <button
                onClick={() => navigate(item.path)}
                className={`flex items-center rounded-xl font-semibold transition-all ${
                  isCollapsed
                    ? 'justify-center size-12 mx-auto'
                    : 'w-full gap-3 px-4 py-3'
                } ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {item.icon}
                {!isCollapsed && <span className="whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>}
              </button>
            );

            if (isCollapsed) {
              return (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>{buttonEl}</TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              );
            }

            return <React.Fragment key={item.path}>{buttonEl}</React.Fragment>;
          })}
        </nav>
      </aside>
    </TooltipProvider>
  );
};

export default Sidebar;
