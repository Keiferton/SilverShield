import { useState } from 'react';
import AppHeader from '../../components/AppHeader';

const calls = [
  {
    id: 1,
    name: 'HMRC — Tax Debt',
    number: '0300 200 3300',
    time: '09:55',
    type: 'missed',
    suspicious: true,
    icon: '🏛️',
  },
  {
    id: 2,
    name: 'Daughter — Sarah',
    number: '+44 7700 900123',
    time: '08:00',
    type: 'incoming',
    suspicious: false,
    icon: '👩',
  },
  {
    id: 3,
    name: 'GP Surgery',
    number: '01234 567890',
    time: 'Yesterday',
    type: 'outgoing',
    suspicious: false,
    icon: '🏥',
  },
  {
    id: 4,
    name: 'Microsoft Support',
    number: '0800 756 3478',
    time: 'Yesterday',
    type: 'missed',
    suspicious: true,
    icon: '💻',
  },
];

const typeIcons = {
  missed: { icon: '↙️', color: 'text-red-500', label: 'Missed call' },
  incoming: { icon: '↙️', color: 'text-green-500', label: 'Incoming call' },
  outgoing: { icon: '↗️', color: 'text-slate-400', label: 'Outgoing call' },
};

export default function PhoneApp({ onBack, onEventComplete }) {
  const [calling, setCalling] = useState(null);

  const handleCall = (c) => {
    setCalling(c);
    onEventComplete && onEventComplete(c.id);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <AppHeader title="Phone" emoji="📞" onBack={onBack} />

      {/* Dial pad stub */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2">
          <span className="text-slate-400 text-sm">🔍</span>
          <span className="text-slate-400 text-sm flex-1">Search or dial...</span>
          <button className="text-teal-600 font-semibold text-sm focus:outline-none">Keypad</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide px-4 pt-4 pb-2">
          Recent Calls
        </p>
        <div className="divide-y divide-slate-100">
          {calls.map((c) => {
            const meta = typeIcons[c.type];
            return (
              <div key={c.id} className={`flex items-center gap-3 px-4 py-3 ${c.suspicious ? 'bg-red-50' : ''}`}>
                <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-xl shrink-0">
                  {c.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-sm font-semibold truncate ${
                        c.suspicious ? 'text-red-700' : 'text-slate-800'
                      }`}
                    >
                      {c.name}
                    </span>
                    {c.suspicious && (
                      <span className="text-xs bg-red-100 text-red-600 rounded px-1 shrink-0">
                        ⚠️ Suspicious
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                    <span className={meta.color}>{meta.icon}</span>
                    <span>{c.number}</span>
                    <span>· {c.time}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleCall(c)}
                  className="w-9 h-9 bg-teal-500 rounded-full flex items-center justify-center text-white text-sm hover:bg-teal-600 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400"
                  aria-label={`Call back ${c.name}`}
                >
                  📞
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Incoming call modal */}
      {calling && (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col items-center justify-between py-12 z-50">
          <div className="text-center">
            <div className="text-6xl mb-4">{calling.icon}</div>
            <p className="text-slate-400 text-sm mb-1">Calling...</p>
            <h2 className="text-white text-2xl font-bold mb-1">{calling.name}</h2>
            <p className="text-slate-400 text-sm">{calling.number}</p>
            {calling.suspicious && (
              <div className="mt-4 bg-red-900/50 border border-red-500/40 rounded-2xl px-4 py-3 mx-8">
                <p className="text-red-300 text-xs font-medium">
                  ⚠️ Scam warning: {calling.name === 'HMRC — Tax Debt'
                    ? 'HMRC never calls unexpectedly demanding payment.'
                    : 'Microsoft never calls users unsolicited about computer problems.'}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() => setCalling(null)}
            className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg hover:bg-red-600 transition-colors focus:outline-none"
            aria-label="End call"
          >
            📵
          </button>
        </div>
      )}

      <div className="p-4 border-t border-slate-100 bg-teal-50">
        <p className="text-xs text-teal-700 font-medium text-center">
          💡 Tip: If an unexpected caller asks for money or personal details, hang up and call back on an official number.
        </p>
      </div>
    </div>
  );
}
