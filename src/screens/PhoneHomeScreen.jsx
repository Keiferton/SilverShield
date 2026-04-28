import { appIcons } from '../data/appIcons';
import AppIcon from '../components/AppIcon';
import NotificationBanner from '../components/NotificationBanner';
import Button from '../components/Button';

export default function PhoneHomeScreen({
  persona,
  notifications,
  onDismissNotification,
  onOpenApp,
  riskScore,
  completedEvents,
  onFinish,
}) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const badgeCounts = {
    messages: 2,
    email: 3,
    facebook: 1,
    browser: 0,
    phone: 1,
  };

  const progress = Math.min(completedEvents / 5, 1);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-indigo-900 via-violet-900 to-purple-900 relative">
      {/* Notification banner */}
      <NotificationBanner
        notifications={notifications}
        onDismiss={onDismissNotification}
      />

      {/* Wallpaper time/date */}
      <div className="flex flex-col items-center pt-10 pb-4 text-white select-none">
        <p className="text-6xl font-thin tracking-tight">{timeStr}</p>
        <p className="text-indigo-200 text-base mt-1">{dateStr}</p>
        <div className="mt-3 flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5">
          <span className="text-sm">{persona.photo}</span>
          <span className="text-white text-sm font-medium">Playing as {persona.name}</span>
        </div>
      </div>

      {/* App grid */}
      <div className="flex-1 px-4 pt-2">
        <div className="grid grid-cols-3 gap-6 justify-items-center">
          {appIcons.map((app) => (
            <AppIcon
              key={app.id}
              app={app}
              onClick={onOpenApp}
              badge={badgeCounts[app.id] ?? 0}
            />
          ))}
        </div>
      </div>

      {/* Progress & risk score dock */}
      <div className="mx-3 mb-3 bg-white/10 backdrop-blur-sm rounded-3xl p-4 border border-white/20">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white text-sm font-semibold">Progress</span>
          <span className="text-indigo-200 text-xs">{completedEvents} / 5 events</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2 mb-3">
          <div
            className="bg-gradient-to-r from-emerald-400 to-teal-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-white/70 text-xs">Risk Score</span>
            <div
              className={`text-xl font-bold ${
                riskScore >= 50
                  ? 'text-red-400'
                  : riskScore >= 25
                  ? 'text-yellow-400'
                  : 'text-emerald-400'
              }`}
            >
              {riskScore}
            </div>
          </div>
          {completedEvents >= 3 && (
            <Button onClick={onFinish} variant="success" className="!py-2 !px-5 !text-sm">
              See Results →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
