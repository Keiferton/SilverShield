import { useCurrentTime } from '../hooks/useCurrentTime.js';
import { formatClockTime } from '../utils/dateTime.js';

export default function StatusBar() {
  const now = useCurrentTime();

  return (
    <header className="flex h-11 items-center justify-between bg-[#0b0d12]/92 px-7 text-[13px] font-semibold text-white/95 backdrop-blur-xl">
      <span className="tracking-normal">{formatClockTime(now)}</span>
      <div className="flex items-center gap-1.5" aria-label="Phone status">
        <span className="flex items-end gap-0.5">
          <span className="h-1.5 w-0.5 rounded-full bg-white/70" />
          <span className="h-2 w-0.5 rounded-full bg-white/80" />
          <span className="h-2.5 w-0.5 rounded-full bg-white/90" />
          <span className="h-3 w-0.5 rounded-full bg-white" />
        </span>
        <span className="h-2.5 w-6 rounded-[0.35rem] border border-white/80 p-0.5">
          <span className="block h-full w-4 rounded-[0.2rem] bg-white/90" />
        </span>
      </div>
    </header>
  );
}
