export default function ProgressBar({ value, max, label }) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div>
      {label && (
        <div className="mb-2 flex items-center justify-between gap-3 text-sm font-bold text-slate-600">
          <span>{label}</span>
          <span>{percent}%</span>
        </div>
      )}
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-950/10">
        <div className="h-full rounded-full bg-blue-500" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
