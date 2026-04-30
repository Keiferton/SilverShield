import NotificationBanner from '../components/NotificationBanner.jsx';
import { channels } from '../data/channels.js';
import { getNextEventForPersona } from '../data/events.js';
import { useCurrentTime } from '../hooks/useCurrentTime.js';
import { formatClockTime, formatLongDate } from '../utils/dateTime.js';

export default function WelcomeScreen({ navigate, hasProgress, continuePractice, answers = {}, selectedPersona }) {
  const now = useCurrentTime();
  const nextEvent = getNextEventForPersona(answers, selectedPersona?.focusChannel);
  const nextChannel = channels.find((channel) => channel.id === nextEvent?.channel);
  const openNextStep = nextEvent ? (hasProgress ? continuePractice : () => navigate('persona')) : () => navigate('results');

  return (
    <section className="ios-wallpaper relative flex h-full flex-col justify-between overflow-hidden px-6 pb-8 pt-10 text-white">
      <div className="pointer-events-none absolute inset-0 ios-wallpaper-soft" />
      <div className="relative z-10 text-center">
        <p className="text-lg font-medium text-white/78">{formatLongDate(now)}</p>
        <p className="mt-2 text-6xl font-semibold tracking-tight">{formatClockTime(now)}</p>
      </div>

      <div className="relative z-10 space-y-3">
        <p className="px-2 text-sm font-semibold uppercase tracking-wide text-white/70">Notification Center</p>
        <NotificationBanner
          appName={nextChannel?.label ?? 'SilverShield'}
          icon={nextChannel?.icon}
          title={nextEvent?.title ?? 'Training complete'}
          message={nextEvent?.body ?? 'You have reviewed every practice scenario.'}
          accentClass={nextChannel?.iconClass ?? 'bg-blue-700 text-white'}
          onClick={openNextStep}
        />
        <NotificationBanner
          appName="SilverShield"
          title="Scam practice phone"
          message="Practice common warning signs in messages, email, Facebook, browser pages, and phone calls."
          time={formatClockTime(now)}
          icon="practice"
          accentClass="bg-[#0a84ff] text-white"
        />
      </div>

      <div className="relative z-10 flex flex-col gap-3 pb-3">
        {hasProgress && (
          <button
            type="button"
            onClick={continuePractice}
            className="ios-control rounded-full px-6 py-4 text-lg font-semibold text-slate-950 focus:outline-none focus:ring-4 focus:ring-white/40"
          >
            Swipe up to continue
          </button>
        )}
        <button
          type="button"
          onClick={() => navigate('persona')}
          className={`rounded-full px-6 py-4 text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-white/40 ${
            hasProgress ? 'ios-glass text-white' : 'ios-control text-slate-950'
          }`}
        >
          {hasProgress ? 'Safety Support' : 'Swipe up to start'}
        </button>
      </div>
    </section>
  );
}
