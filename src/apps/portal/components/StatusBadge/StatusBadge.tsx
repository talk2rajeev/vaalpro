import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type StatusBadgeTone = 'active' | 'valid' | 'expired' | 'neutral' | 'review';

const toneClassName: Record<StatusBadgeTone, string> = {
  active: 'bg-emerald-50 text-emerald-700',
  valid: 'bg-emerald-50 text-emerald-700',
  expired: 'bg-red-50 text-red-700',
  neutral: 'bg-slate-100 text-slate-600',
  review: 'bg-amber-50 text-amber-700',
};

interface StatusBadgeProps {
  children: ReactNode;
  tone?: StatusBadgeTone;
  className?: string;
}

const StatusBadge = ({ children, tone = 'neutral', className }: StatusBadgeProps) => (
  <span className={cn('inline-flex rounded px-2 py-0.5 text-[10px] font-bold', toneClassName[tone], className)}>
    {children}
  </span>
);

export default StatusBadge;
