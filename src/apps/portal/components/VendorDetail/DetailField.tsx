interface DetailFieldProps {
  label: string;
  value?: string;
}

const DetailField = ({ label, value }: DetailFieldProps) => (
  <div>
    <p className="text-xs font-bold text-slate-500">{label}</p>
    <p className={`mt-2 text-base font-semibold ${value ? 'text-slate-900' : 'italic text-slate-300'}`}>
      {value || 'Not provided'}
    </p>
  </div>
);

export default DetailField;
