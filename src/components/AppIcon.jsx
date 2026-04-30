import AppGlyph from './AppGlyph.jsx';

export default function AppIcon({
  label,
  meta,
  recommended = false,
  showLabel = true,
  icon,
  iconClass = 'bg-blue-500 text-white',
  onClick,
  children,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex flex-col items-center justify-start rounded-3xl text-center text-[13px] font-medium text-white transition focus:outline-none focus:ring-4 focus:ring-white/35 ${
        showLabel ? 'min-h-[6.75rem] gap-[0.44rem] p-2' : 'min-h-0 gap-0 p-1'
      }`}
    >
      <span
        className={`relative flex h-[4.35rem] w-[4.35rem] items-center justify-center overflow-hidden rounded-[1.4rem] text-lg font-semibold shadow-[0_8px_20px_rgba(2,6,23,0.24)] ring-1 ring-white/20 transition-transform active:scale-[0.96] ${iconClass}`}
      >
        <span className="relative z-10 flex h-full w-full items-center justify-center">
          {icon ? <AppGlyph name={icon} /> : children}
        </span>
      </span>
      {showLabel && (
        <span className="max-w-20 break-words text-[14px] font-medium leading-[1.05rem] text-white [text-shadow:0_1px_8px_rgba(2,6,23,0.65)]">
          {label}
        </span>
      )}
      {meta === 'dot' && (
        <span className="absolute right-4 top-2 h-2.5 w-2.5 rounded-full bg-sky-300 shadow-sm ring-2 ring-white/90" />
      )}
      {meta && meta !== 'dot' && (
        <span className="absolute right-3 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-semibold text-white shadow-sm ring-2 ring-white/90">
          {meta}
        </span>
      )}
      {recommended && (
        <span className="rounded-full bg-white/24 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm ring-1 ring-white/25 backdrop-blur-xl">
          Focus
        </span>
      )}
    </button>
  );
}
