export default function SmartphoneFrame({ children }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-violet-100 p-4">
      {/* Desktop: show phone frame; mobile: full screen */}
      <div
        className="
          relative
          w-full max-w-sm
          sm:rounded-[3rem] sm:border-8 sm:border-slate-800
          sm:shadow-2xl sm:shadow-slate-400/40
          overflow-hidden
          bg-white
          flex flex-col
          sm:min-h-0
          min-h-screen sm:min-h-[780px] sm:max-h-[860px]
        "
        style={{ aspectRatio: '9/19.5' }}
      >
        {/* Notch */}
        <div className="hidden sm:flex justify-center pt-2 pb-1 bg-slate-800">
          <div className="w-24 h-5 bg-slate-900 rounded-full" />
        </div>

        {/* Status bar */}
        <div className="flex justify-between items-center px-5 py-1 bg-white text-xs text-slate-500 font-medium select-none">
          <span>9:41</span>
          <span className="flex gap-1 items-center">
            <span>📶</span>
            <span>🔋</span>
          </span>
        </div>

        {/* Screen content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
          {children}
        </div>

        {/* Home indicator */}
        <div className="hidden sm:flex justify-center pb-3 pt-2 bg-white">
          <div className="w-28 h-1.5 bg-slate-300 rounded-full" />
        </div>
      </div>
    </div>
  );
}
