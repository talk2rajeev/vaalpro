import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AdminTableShellProps {
  children: ReactNode;
  className?: string;
}

const AdminTableShell = ({ children, className }: AdminTableShellProps) => (
  <div className={cn('overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm', className)}>
    {children}
  </div>
);

export default AdminTableShell;
