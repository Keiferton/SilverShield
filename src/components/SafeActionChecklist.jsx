import { safeHabits } from '../data/safeHabits.js';

export default function SafeActionChecklist({ activeHabitIds = [] }) {
  return (
    <div className="rounded-2xl bg-slate-950/[0.04] p-3">
      <p className="px-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Safety habits</p>
      <ul className="mt-2 overflow-hidden rounded-2xl bg-white/82 ring-1 ring-slate-950/5">
        {safeHabits.map((habit, index) => {
          const isActive = activeHabitIds.includes(habit.id);

          return (
            <li
              key={habit.id}
              className={`flex gap-3 p-3 ${index > 0 ? 'border-t border-slate-200' : ''} ${
                isActive ? 'bg-emerald-50' : ''
              }`}
            >
              <span
                className={`mt-1 h-3 w-3 shrink-0 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-base font-semibold leading-5 text-slate-950">{habit.label}</span>
                <span className="mt-1 block text-sm font-medium leading-6 text-slate-600">{habit.description}</span>
              </span>
              {isActive && (
                <span className="h-fit rounded-full bg-white px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-800 shadow-sm">
                  Matched
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
