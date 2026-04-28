import AppHeader from '../../components/AppHeader';

const emails = [
  {
    id: 1,
    from: 'prize-winner@claims-dept.net',
    subject: "🎉 You've Won £5,000! Claim Now",
    preview: 'Dear Winner, We are pleased to inform you...',
    time: '10:01',
    read: false,
    suspicious: true,
  },
  {
    id: 2,
    from: 'newsletter@ageuk.org.uk',
    subject: 'Age UK Monthly Newsletter — Spring Edition',
    preview: 'Upcoming events, health tips, and community news...',
    time: '08:30',
    read: true,
    suspicious: false,
  },
  {
    id: 3,
    from: 'noreply@amazon.co.uk',
    subject: 'Your order has been dispatched',
    preview: 'Your order #204-123456 is on its way...',
    time: 'Yesterday',
    read: true,
    suspicious: false,
  },
  {
    id: 4,
    from: 'support@paypa1-secure.com',
    subject: 'Action Required: Verify Your PayPal Account',
    preview: 'We detected unusual activity. Please verify...',
    time: 'Yesterday',
    read: false,
    suspicious: true,
  },
  {
    id: 5,
    from: 'granddaughter.emily@gmail.com',
    subject: 'Photos from the weekend! 📸',
    preview: 'Gran, here are the photos from Sunday lunch...',
    time: '2 days ago',
    read: true,
    suspicious: false,
  },
];

export default function EmailApp({ onBack, onEventComplete }) {
  return (
    <div className="flex flex-col h-full bg-white">
      <AppHeader title="Email" emoji="📧" onBack={onBack} />

      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {emails.map((e) => (
          <button
            key={e.id}
            className="w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 text-left focus:outline-none transition-colors"
            onClick={() => onEventComplete && onEventComplete(e.id)}
            aria-label={`Open email: ${e.subject}`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 mt-0.5 ${
                e.suspicious ? 'bg-red-100' : 'bg-blue-100'
              }`}
            >
              {e.suspicious ? '⚠️' : '✉️'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <span
                  className={`text-xs font-medium truncate ${
                    e.suspicious ? 'text-red-600' : 'text-slate-500'
                  }`}
                >
                  {e.from}
                </span>
                <span className="text-xs text-slate-400 shrink-0 ml-2">{e.time}</span>
              </div>
              <p
                className={`text-sm truncate ${
                  e.read ? 'text-slate-600' : 'font-semibold text-slate-900'
                }`}
              >
                {e.subject}
              </p>
              <p className="text-xs text-slate-400 truncate mt-0.5">{e.preview}</p>
            </div>
            {!e.read && (
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0 mt-2" />
            )}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-slate-100 bg-blue-50">
        <p className="text-xs text-blue-700 font-medium text-center">
          💡 Tip: Check the sender's email address carefully — scammers use lookalike addresses.
        </p>
      </div>
    </div>
  );
}
