import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AdminPageHeaderProps {
  eyebrow?: string;
  badge?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

const AdminPageHeader = ({
  eyebrow,
  badge,
  title,
  description,
  action,
  className,
}: AdminPageHeaderProps) => (
  <div className={cn('flex items-start justify-between gap-6', className)}>
    <div>
      {eyebrow && <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">{eyebrow}</p>}
      <h1 className="mt-2 text-3xl font-bold tracking-tight">{title}</h1>
      {badge}
      {description && <p className="mt-2 text-sm text-slate-700">{description}</p>}
    </div>
    {action}
  </div>
);

export default AdminPageHeader;
