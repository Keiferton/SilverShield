import { getChannelLabel } from '../data/channels.js';
import { personas } from '../data/personas.js';
import { safetySupportLevels } from '../data/safetySupport.js';

function SettingRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-4">
      <span className="text-base font-semibold text-slate-950">{label}</span>
      <span className="min-w-0 truncate text-right text-base font-medium text-slate-500">{value}</span>
    </div>
  );
}

export default function PersonaScreen({
  navigate,
  safetySupport,
  safetySupportId,
  selectSafetySupport,
  selectedPersona,
  selectPersona,
}) {
  return (
    <section className="flex h-full flex-col overflow-hidden bg-[#f5f5f7] text-slate-950">
      <header className="border-b border-white/70 bg-white/72 px-4 py-3 backdrop-blur-2xl">
        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={() => navigate('welcome')} className="text-base font-medium text-blue-600">
            Back
          </button>
          <p className="text-lg font-semibold">Safety Support</p>
          <button type="button" onClick={() => navigate('home')} className="text-base font-medium text-blue-600">
            Done
          </button>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
        <div className="flex items-center gap-4 rounded-[1.75rem] bg-white/86 p-4 shadow-sm ring-1 ring-white/70 backdrop-blur-xl">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.35rem] bg-[#0a84ff] text-2xl font-semibold text-white shadow-sm">
            SS
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold tracking-tight">SilverShield</h1>
            <p className="mt-1 text-base font-medium leading-6 text-slate-600">Adjust how much help appears during practice.</p>
          </div>
        </div>

        <h2 className="mt-6 px-1 text-sm font-semibold uppercase tracking-wide text-slate-500">Current support</h2>
        <div className="mt-2 overflow-hidden rounded-2xl bg-white/86 shadow-sm ring-1 ring-white/70 backdrop-blur-xl">
          <SettingRow label="Safety Support" value={safetySupport?.label ?? 'Balanced'} />
          <div className="border-t border-slate-200">
            <SettingRow label="Training focus" value={selectedPersona.name} />
          </div>
          <div className="border-t border-slate-200 px-4 py-4">
            <p className="text-base font-semibold text-slate-950">How it changes practice</p>
            <p className="mt-1 text-sm font-medium leading-6 text-slate-600">{safetySupport?.description}</p>
          </div>
        </div>

        <h2 className="mt-6 px-1 text-sm font-semibold uppercase tracking-wide text-slate-500">Safety Support</h2>
        <div className="mt-2 overflow-hidden rounded-2xl bg-white/86 shadow-sm ring-1 ring-white/70 backdrop-blur-xl">
          {safetySupportLevels.map((level, index) => {
            const selected = safetySupportId === level.id;

            return (
              <button
                key={level.id}
                type="button"
                onClick={() => selectSafetySupport(level.id)}
                className={`flex w-full items-center gap-4 px-4 py-4 text-left focus:outline-none focus:ring-4 focus:ring-blue-200 ${
                  index > 0 ? 'border-t border-slate-200' : ''
                }`}
              >
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-base font-semibold ${
                    selected ? 'bg-[#0a84ff] text-white' : 'bg-slate-950/5 text-slate-500'
                  }`}
                >
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-semibold text-slate-950">{level.label}</span>
                  <span className="mt-1 block text-sm font-medium leading-6 text-slate-600">
                    {level.description}
                  </span>
                </span>
                <span
                  className={`flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full px-2 text-xs font-semibold uppercase tracking-wide ${
                    selected ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-300'
                  }`}
                  aria-label={selected ? 'Selected' : 'Not selected'}
                >
                  {selected ? 'On' : ''}
                </span>
              </button>
            );
          })}
        </div>

        <h2 className="mt-6 px-1 text-sm font-semibold uppercase tracking-wide text-slate-500">Training focus</h2>
        <div className="mt-2 overflow-hidden rounded-2xl bg-white/86 shadow-sm ring-1 ring-white/70 backdrop-blur-xl">
          {personas.map((persona, index) => {
            const selected = selectedPersona.id === persona.id;

            return (
              <button
                key={persona.id}
                type="button"
                onClick={() => selectPersona(persona.id)}
                className={`flex w-full items-center gap-4 px-4 py-4 text-left focus:outline-none focus:ring-4 focus:ring-blue-200 ${
                  index > 0 ? 'border-t border-slate-200' : ''
                }`}
              >
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-base font-semibold ${
                    selected ? 'bg-[#0a84ff] text-white' : 'bg-slate-950/5 text-slate-500'
                  }`}
                >
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-semibold text-slate-950">{persona.name}</span>
                  <span className="mt-1 block text-sm font-medium leading-6 text-slate-600">
                    {persona.description}
                  </span>
                  <span className="mt-2 block text-sm font-medium text-blue-600">
                    Focus app: {getChannelLabel(persona.focusChannel)}
                  </span>
                </span>
                <span
                  className={`flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full px-2 text-xs font-semibold uppercase tracking-wide ${
                    selected ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-300'
                  }`}
                  aria-label={selected ? 'Selected' : 'Not selected'}
                >
                  {selected ? 'On' : ''}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl bg-white/86 shadow-sm ring-1 ring-white/70 backdrop-blur-xl">
          <button
            type="button"
            onClick={() => navigate('home')}
            className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            <span className="min-w-0">
              <span className="block text-lg font-semibold text-slate-950">Open training phone</span>
              <span className="mt-1 block text-sm font-medium text-slate-600">Go to the Home Screen</span>
            </span>
            <span className="text-2xl font-bold text-slate-400">&gt;</span>
          </button>
        </div>
      </div>
    </section>
  );
}
