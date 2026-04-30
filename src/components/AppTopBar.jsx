const topBarStyles = {
  messages: 'bg-white/78 text-slate-950 border-white/60 backdrop-blur-2xl',
  email: 'bg-white/78 text-slate-950 border-white/60 backdrop-blur-2xl',
  facebook: 'bg-[#1877f2]/88 text-white border-white/10 backdrop-blur-2xl',
  browser: 'bg-white/66 text-slate-950 border-white/60 backdrop-blur-2xl',
  phone: 'bg-slate-950/88 text-white border-white/10 backdrop-blur-2xl',
};

const backLabels = {
  messages: 'Messages',
  email: 'Inbox',
  facebook: 'Feed',
  browser: 'Done',
  phone: 'Home',
};

const subtitles = {
  messages: 'iMessage',
  email: 'Mail',
  facebook: 'Facebook',
  browser: 'Safari',
  phone: 'Phone',
};

export default function AppTopBar({ channel, title, subtitle, progressLabel, onBack }) {
  const isDark = channel === 'facebook' || channel === 'phone';
  const centerTitle = channel === 'messages' || channel === 'phone' ? subtitle : title;
  const centerSubtitle = channel === 'messages' || channel === 'phone' ? subtitles[channel] : subtitle;
  const showAvatar = channel === 'messages' || channel === 'phone';

  return (
    <header className={`border-b px-4 py-3 ${topBarStyles[channel] ?? topBarStyles.messages}`}>
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className={`rounded-full px-3 py-2 text-base font-medium focus:outline-none focus:ring-4 ${
            isDark ? 'text-white focus:ring-white/30' : 'text-blue-600 focus:ring-blue-200'
          }`}
        >
          {backLabels[channel] ?? 'Home'}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center justify-center gap-2">
            {showAvatar && (
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  isDark ? 'bg-white/18 text-white' : 'bg-slate-950/8 text-slate-700'
                }`}
              >
                {centerTitle?.charAt(0)}
              </span>
            )}
            <span className="min-w-0 text-center">
              <span className="block truncate text-lg font-semibold">{centerTitle}</span>
              {centerSubtitle && <span className="block truncate text-xs font-medium opacity-70">{centerSubtitle}</span>}
            </span>
          </div>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isDark ? 'bg-white/18 text-white' : 'bg-slate-950/8 text-slate-700'
          }`}
        >
          {progressLabel}
        </span>
      </div>
    </header>
  );
}
