import AppHeader from '../../components/AppHeader';

const conversations = [
  {
    id: 1,
    sender: 'BANK ALERT',
    avatar: '🏦',
    preview: 'Your account has been locked. Tap here to verify immediately.',
    time: '09:42',
    unread: true,
    suspicious: true,
  },
  {
    id: 2,
    sender: 'Daughter Sarah',
    avatar: '👩',
    preview: "Mum, are you free for a call later? 😊",
    time: '08:15',
    unread: false,
    suspicious: false,
  },
  {
    id: 3,
    sender: 'GP Surgery',
    avatar: '🏥',
    preview: 'Reminder: Your appointment is tomorrow at 2pm.',
    time: 'Yesterday',
    unread: false,
    suspicious: false,
  },
  {
    id: 4,
    sender: 'Royal Mail',
    avatar: '📦',
    preview: 'Your parcel needs a £2.99 customs fee. Pay now to avoid return.',
    time: 'Yesterday',
    unread: true,
    suspicious: true,
  },
];

export default function MessagesApp({ onBack, onEventComplete }) {
  return (
    <div className="flex flex-col h-full bg-white">
      <AppHeader title="Messages" emoji="💬" onBack={onBack} />

      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {conversations.map((c) => (
          <button
            key={c.id}
            className="w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 text-left focus:outline-none focus:bg-slate-50 transition-colors"
            onClick={() => onEventComplete && onEventComplete(c.id)}
            aria-label={`Open message from ${c.sender}`}
          >
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-2xl shrink-0 mt-0.5">
              {c.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <span
                  className={`text-sm font-semibold truncate ${
                    c.suspicious ? 'text-red-600' : 'text-slate-800'
                  }`}
                >
                  {c.sender}
                  {c.suspicious && (
                    <span className="ml-1.5 text-xs bg-red-100 text-red-600 rounded px-1">
                      ⚠️ Suspicious
                    </span>
                  )}
                </span>
                <span className="text-xs text-slate-400 shrink-0 ml-2">{c.time}</span>
              </div>
              <p className="text-sm text-slate-500 truncate">{c.preview}</p>
            </div>
            {c.unread && (
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0 mt-2" />
            )}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-slate-100 bg-green-50">
        <p className="text-xs text-green-700 font-medium text-center">
          💡 Tip: Legitimate organisations never ask you to tap a link to unlock your account.
        </p>
      </div>
    </div>
  );
}
