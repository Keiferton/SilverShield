import { useEffect, useRef, useState } from 'react';

export default function NotificationBanner({ notifications, onDismiss }) {
  const latest = notifications[notifications.length - 1];
  const [fadingOutId, setFadingOutId] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!latest) return;

    // Start auto-dismiss timer — setState only called inside async callback
    timerRef.current = setTimeout(() => {
      setFadingOutId(latest.id);
      setTimeout(() => onDismiss(latest.id), 300);
    }, 4000);

    return () => clearTimeout(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latest?.id, onDismiss]); // intentionally track by ID only to avoid stale closure issues

  if (!latest) return null;

  const visible = fadingOutId !== latest.id;

  const handleDismiss = () => {
    clearTimeout(timerRef.current);
    setFadingOutId(latest.id);
    setTimeout(() => onDismiss(latest.id), 300);
  };

  return (
    <div
      className={`
        absolute top-3 left-3 right-3 z-50
        bg-white/95 backdrop-blur-sm
        border border-slate-200
        rounded-2xl shadow-xl shadow-slate-200/60
        p-4
        transition-all duration-300
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}
      `}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl flex-shrink-0">{latest.emoji}</div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-800 text-sm leading-tight truncate">
            {latest.title}
          </p>
          <p className="text-slate-500 text-xs mt-0.5 line-clamp-2">{latest.body}</p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-slate-400 hover:text-slate-600 text-lg leading-none flex-shrink-0 focus:outline-none"
          aria-label="Dismiss notification"
        >
          ×
        </button>
      </div>
    </div>
  );
}
