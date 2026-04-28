export default function Button({ children, onClick, variant = 'primary', className = '' }) {
  const base =
    'inline-flex items-center justify-center rounded-2xl font-semibold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 active:scale-95 cursor-pointer select-none';

  const variants = {
    primary:
      'bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:brightness-110 focus:ring-indigo-400 px-8 py-4 text-lg',
    secondary:
      'bg-white text-indigo-700 border-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 focus:ring-indigo-300 px-8 py-4 text-lg',
    white:
      'bg-white text-indigo-700 shadow-xl hover:bg-indigo-50 focus:ring-white/50 px-8 py-4 text-lg font-bold',
    ghost:
      'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:ring-slate-300 px-6 py-3 text-base',
    danger:
      'bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg shadow-red-200 hover:brightness-110 focus:ring-red-400 px-8 py-4 text-lg',
    success:
      'bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-green-200 hover:brightness-110 focus:ring-green-400 px-8 py-4 text-lg',
  };

  return (
    <button
      onClick={onClick}
      className={`${base} ${variants[variant] ?? variants.primary} ${className}`}
    >
      {children}
    </button>
  );
}
