export default function AppHeader({ title, onBack, emoji }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-100 sticky top-0 z-10">
      <button
        onClick={onBack}
        className="text-indigo-600 font-semibold text-sm hover:text-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded-lg px-2 py-1 -ml-2 transition-colors"
        aria-label="Go back to home screen"
      >
        ← Back
      </button>
      <div className="flex items-center gap-2 flex-1 justify-center">
        {emoji && <span className="text-xl">{emoji}</span>}
        <h2 className="font-bold text-slate-800 text-base">{title}</h2>
      </div>
      <div className="w-14" />
    </div>
  );
}
