import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InfoCardProps {
  title?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

const InfoCard = ({ title, icon, action, children, className, contentClassName }: InfoCardProps) => (
  <section className={cn('rounded-xl border border-slate-200 bg-white p-7 shadow-sm', className)}>
    {(title || icon || action) && (
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          {icon}
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
        </div>
        {action}
      </div>
    )}
    <div className={cn(title || icon || action ? 'pt-7' : '', contentClassName)}>{children}</div>
  </section>
);

export default InfoCard;
