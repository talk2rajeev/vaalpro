import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';

interface ManagementCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  linkLabel: string;
  to: string;
}

const ManagementCard = ({ icon, title, description, linkLabel, to }: ManagementCardProps) => (
  <div className="flex items-start gap-6 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
    <div className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-blue-100">{icon}</div>
    <div>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">{description}</p>
      <Link
        to={to}
        className="group mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-800 transition-colors hover:text-blue-600 hover:underline"
      >
        {linkLabel}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  </div>
);

export default ManagementCard;
