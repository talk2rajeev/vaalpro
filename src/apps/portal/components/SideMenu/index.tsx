import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Users, Store, ShieldCheck, KeyRound, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '@/features/auth/authSlice';

interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  {
    label: 'Users Management',
    path: '/system-admin/users',
    icon: <Users size={20} />,
  },
  {
    label: 'Vendor Management',
    path: '/system-admin/vendor-management',
    icon: <Store size={20} />,
  },
  {
    label: 'Role Management',
    path: '/system-admin/roles',
    icon: <ShieldCheck size={20} />,
  },
  {
    label: 'Permission Management',
    path: '/system-admin/permissions',
    icon: <KeyRound size={20} />,
  },
];

const SideMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col">
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={() => dispatch(logout())}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-medium"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default SideMenu;
