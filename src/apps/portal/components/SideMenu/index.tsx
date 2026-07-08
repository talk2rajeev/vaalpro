import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  Users,
  Store,
  ShieldCheck,
  KeyRound,
  Shield,
  LogOut,
  CreditCard,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '@/features/auth/authSlice';
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
    label: 'Users',
    path: '/system-admin/users',
    icon: <Users size={20} />,
  },
  {
    label: 'Vendors',
    path: '/system-admin/vendors',
    icon: <Store size={20} />,
  },
  {
    label: 'Roles',
    path: '/system-admin/roles',
    icon: <ShieldCheck size={20} />,
  },
  {
    label: 'Permissions',
    path: '/system-admin/permissions',
    icon: <KeyRound size={20} />,
  },
  {
    label: 'Permission Groups',
    path: '/system-admin/permission-groups',
    icon: <Shield size={20} />,
  },
  {
    label: 'Subscriptions',
    path: '/system-admin/subscriptions',
    icon: <CreditCard size={20} />,
  },
];

const SideMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <TooltipProvider>
      <aside
        className={`bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-72'
          }`}
      >
        {/* Sidebar Header with Collapse Toggle */}
        <div
          className={`p-3 px-4 flex items-center ${isCollapsed ? 'justify-center' : 'justify-end'
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
                className={`flex items-center rounded-xl font-semibold transition-all ${isCollapsed
                  ? 'justify-center size-12 mx-auto'
                  : 'w-full gap-3 px-4 py-3'
                  } ${isActive
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

        {/* Bottom Footer Actions */}
        <div className="p-4 border-t border-slate-100">
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => dispatch(logout())}
                  className="flex items-center justify-center size-12 mx-auto rounded-xl text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                >
                  <LogOut size={20} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Logout</TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={() => dispatch(logout())}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-medium cursor-pointer"
            >
              <LogOut size={20} />
              <span className="whitespace-nowrap overflow-hidden text-ellipsis">Logout</span>
            </button>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
};

export default SideMenu;
