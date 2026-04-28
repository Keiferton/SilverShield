import { useState } from 'react';
import { personas } from '../data/personas';
import Button from '../components/Button';

export default function PersonaIntroScreen({ onSelect }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="flex flex-col min-h-full bg-gradient-to-b from-slate-50 to-indigo-50">
      <div className="px-5 pt-8 pb-4 text-center">
        <h1 className="text-2xl font-extrabold text-slate-800 mb-1">
          Choose Your Character
        </h1>
        <p className="text-slate-500 text-base">
          Pick someone to play as in the simulation
        </p>
      </div>

      <div className="flex-1 px-4 py-2 space-y-3 overflow-y-auto">
        {personas.map((p) => {
          const isSelected = selected?.id === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className={`
                w-full text-left rounded-3xl p-4 border-2 transition-all duration-150 focus:outline-none
                ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-100'
                    : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm'
                }
              `}
              aria-pressed={isSelected}
              aria-label={`Select persona ${p.name}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{p.photo}</span>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg leading-tight">
                    {p.name}, {p.age}
                  </h3>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {p.traits.map((t) => (
                      <span
                        key={t}
                        className="text-xs bg-indigo-100 text-indigo-700 rounded-full px-2 py-0.5 font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">{p.description}</p>
              {isSelected && (
                <div className="mt-2 flex items-center gap-1.5 text-indigo-600 font-semibold text-sm">
                  <span>✓</span> Selected
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="px-5 py-4 bg-white border-t border-slate-100">
        <Button
          onClick={() => selected && onSelect(selected)}
          variant={selected ? 'primary' : 'secondary'}
          className="w-full"
        >
          {selected ? `Play as ${selected.name} →` : 'Choose a character above'}
        </Button>
      </div>
    </div>
  );
}
