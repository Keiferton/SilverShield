import { useState } from 'react';
import AppHeader from '../../components/AppHeader';

const bookmarks = [
  { id: 1, title: 'BBC News', url: 'bbc.co.uk/news', emoji: '📰' },
  { id: 2, title: 'NHS — Health A-Z', url: 'nhs.uk', emoji: '🏥' },
  { id: 3, title: 'HMRC — Tax Returns', url: 'gov.uk/self-assessment', emoji: '🏛️' },
  { id: 4, title: 'Marks & Spencer', url: 'marksandspencer.com', emoji: '🛍️' },
];

const scamPopup = {
  title: '⚠️ VIRUS DETECTED!',
  body: 'Your device has been infected with 3 viruses!\nCall our helpline immediately: 0800 123 4567\nDo NOT close this window.',
};

export default function BrowserApp({ onBack, onEventComplete }) {
  const [showPopup, setShowPopup] = useState(false);
  const [visitedId, setVisitedId] = useState(null);

  const handleVisit = (b) => {
    setVisitedId(b.id);
    if (b.id === 3) {
      setShowPopup(true);
      onEventComplete && onEventComplete(b.id);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      <AppHeader title="Browser" emoji="🌐" onBack={onBack} />

      {/* Address bar */}
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-sm">
          <span className="text-slate-400 text-sm">🔍</span>
          <span className="text-slate-500 text-sm flex-1 truncate">
            {visitedId
              ? bookmarks.find((b) => b.id === visitedId)?.url
              : 'Search or enter address'}
          </span>
          <span className="text-emerald-500 text-xs font-medium shrink-0">🔒</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Bookmarks */}
        <div className="px-4 pt-4 pb-2">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Bookmarks
          </h3>
          <div className="space-y-2">
            {bookmarks.map((b) => (
              <button
                key={b.id}
                onClick={() => handleVisit(b)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-left focus:outline-none transition-colors"
                aria-label={`Visit ${b.title}`}
              >
                <span className="text-xl w-8 text-center">{b.emoji}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{b.title}</p>
                  <p className="text-xs text-slate-400 truncate">{b.url}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recently visited placeholder */}
        <div className="px-4 pt-2 pb-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Recently Visited
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-1">
            {['📰', '🏥', '🛍️', '📺'].map((e, i) => (
              <div key={i} className="flex flex-col items-center gap-1 shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl">
                  {e}
                </div>
                <span className="text-xs text-slate-500">Site {i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-100 bg-orange-50">
        <p className="text-xs text-orange-700 font-medium text-center">
          💡 Tip: Real antivirus software never shows pop-ups in your browser. Close them immediately.
        </p>
      </div>

      {/* Scam pop-up overlay */}
      {showPopup && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-2xl border-4 border-red-500 text-center">
            <div className="text-5xl mb-3">⚠️</div>
            <h2 className="text-red-600 font-extrabold text-xl mb-3">{scamPopup.title}</h2>
            <p className="text-slate-700 text-sm whitespace-pre-line leading-relaxed mb-4">
              {scamPopup.body}
            </p>
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
              <p className="text-red-700 text-xs font-semibold">
                🛡️ This is a FAKE scam warning used in this simulation. In real life — close the tab and do NOT call the number.
              </p>
            </div>
            <button
              onClick={() => setShowPopup(false)}
              className="w-full bg-slate-800 text-white rounded-xl py-3 font-semibold text-sm hover:bg-slate-700 transition-colors focus:outline-none"
            >
              Close Pop-up (Correct Action) ✓
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
