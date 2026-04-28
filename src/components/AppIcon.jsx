export default function AppIcon({ app, onClick, badge }) {
  return (
    <button
      onClick={() => onClick(app.id)}
      className="flex flex-col items-center gap-1.5 group focus:outline-none"
      aria-label={`Open ${app.label}`}
    >
      <div className="relative">
        <div
          className={`
            w-16 h-16 rounded-2xl bg-gradient-to-br ${app.color}
            flex items-center justify-center text-3xl
            shadow-md group-hover:shadow-lg group-hover:scale-105
            group-active:scale-95
            transition-all duration-150
          `}
        >
          {app.emoji}
        </div>
        {badge > 0 && (
          <span
            className="absolute -top-1.5 -right-1.5 min-w-[1.25rem] h-5 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow"
            aria-label={`${badge} new notifications`}
          >
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </div>
      <span className="text-xs font-medium text-slate-700 leading-tight text-center">
        {app.label}
      </span>
    </button>
  );
}
