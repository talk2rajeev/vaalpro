import { AlertCircle, Loader2 } from 'lucide-react';

export const LoadingState = ({ label }: { label: string }) => (
  <div className="mt-8 flex min-h-[300px] items-center justify-center rounded-xl border border-slate-200 bg-white p-12 shadow-sm">
    <Loader2 className="mr-3 size-8 animate-spin text-blue-600" />
    <span className="text-lg font-medium text-slate-600">{label}</span>
  </div>
);

export const ErrorState = ({ title, message }: { title: string; message: string }) => (
  <div className="mt-8 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
    <AlertCircle className="size-5 shrink-0" />
    <div>
      <p className="font-semibold">{title}</p>
      <p className="text-sm opacity-90">{message}</p>
    </div>
  </div>
);
