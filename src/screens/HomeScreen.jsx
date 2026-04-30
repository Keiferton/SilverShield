import { useEffect } from 'react';
import AppIcon from '../components/AppIcon.jsx';
import NotificationBanner from '../components/NotificationBanner.jsx';
import { channels } from '../data/channels.js';
import { events, getEventNumber, getEventsByChannel } from '../data/events.js';
import { isEventAnswered } from '../utils/scoring.js';

function MetaHud({ scenarioNumber, riskLevel, streak }) {
  return (
    <div className="mb-3 grid grid-cols-3 gap-2">
      <div className="rounded-2xl bg-white/18 px-3 py-2 text-center shadow-sm ring-1 ring-white/20 backdrop-blur-2xl">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-white/62">Scenario</p>
        <p className="mt-0.5 text-sm font-semibold text-white">
          {scenarioNumber} of {events.length}
        </p>
      </div>
      <div className="rounded-2xl bg-white/18 px-3 py-2 text-center shadow-sm ring-1 ring-white/20 backdrop-blur-2xl">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-white/62">Risk</p>
        <p className="mt-0.5 text-sm font-semibold text-white">{riskLevel}</p>
      </div>
      <div className="rounded-2xl bg-white/18 px-3 py-2 text-center shadow-sm ring-1 ring-white/20 backdrop-blur-2xl">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-white/62">Streak</p>
        <p className="mt-0.5 text-sm font-semibold text-white">{streak}</p>
      </div>
    </div>
  );
}

export default function HomeScreen({
  navigate,
  answers,
  selectedPersona,
  continuePractice,
  homeNotifications = [],
  openEvent,
  recordHomeView,
  riskLevel = 'Low',
  score,
  streak = 0,
}) {
  const notificationEvents = homeNotifications;
  const nextEvent = notificationEvents[0];
  const phoneChannel = channels.find((channel) => channel.id === 'phone');
  const scenarioNumber = nextEvent ? getEventNumber(nextEvent.id) : score?.answered ?? events.length;
  const notificationKey = notificationEvents.map((event) => event.id).join('|');

  useEffect(() => {
    recordHomeView?.(notificationEvents.map((event) => event.id));
  }, [notificationKey]);

  function getProgress(channel) {
    const channelEvents = getEventsByChannel(channel);
    const answered = channelEvents.filter((event) => isEventAnswered(answers, event.id)).length;

    return {
      answered,
      total: channelEvents.length,
      complete: answered === channelEvents.length,
    };
  }

  return (
    <section className="ios-wallpaper relative flex h-full flex-col overflow-hidden px-5 pt-8 text-white">
      <div className="pointer-events-none absolute inset-0 ios-wallpaper-soft" />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto pb-2">
        <MetaHud scenarioNumber={scenarioNumber} riskLevel={riskLevel} streak={streak} />

        {notificationEvents.length > 0 ? (
          <div className="space-y-[0.7rem]">
            {notificationEvents.map((event) => {
              const eventChannel = channels.find((channel) => channel.id === event.channel);

              return (
                <NotificationBanner
                  key={event.id}
                  icon={eventChannel?.icon}
                  title={event.notificationTitle ?? event.sender}
                  message={event.notificationBody ?? event.body}
                  time={event.notificationTime ?? 'now'}
                  accentClass={eventChannel?.iconClass ?? 'bg-blue-700 text-white'}
                  onClick={() => openEvent?.(event.id)}
                  className={event.id === nextEvent?.id ? '' : 'opacity-80'}
                />
              );
            })}
          </div>
        ) : (
          <div>
            <NotificationBanner
              icon="practice"
              title="Practice complete"
              message="Open your Safety Report to review protected choices and warning signs."
              accentClass="bg-[#0a84ff] text-white"
              onClick={() => navigate('results')}
            />
          </div>
        )}

        <div className="mt-8 grid grid-cols-3 gap-x-6 gap-y-[1.43rem] px-4">
          {channels.slice(0, 4).map((channel) => {
            const progress = getProgress(channel.id);

            return (
              <AppIcon
                key={channel.id}
                label={channel.label}
                meta={progress.complete ? undefined : progress.total - progress.answered}
                recommended={selectedPersona.focusChannel === channel.id && !progress.complete}
                icon={channel.icon}
                iconClass={channel.iconClass}
                onClick={() => navigate(channel.id)}
              />
            );
          })}
          <AppIcon
            label="Results"
            icon="report"
            iconClass="bg-[#af52de] text-white"
            onClick={() => navigate('results')}
          />
          <AppIcon
            label="Support"
            icon="profile"
            iconClass="bg-[#8e8e93] text-white"
            onClick={() => navigate('persona')}
          />
        </div>

        <div className="mt-auto flex justify-center gap-4 pb-5 pt-8" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-white" />
          <span className="h-2 w-2 rounded-full bg-white/88" />
          <span className="h-2 w-2 rounded-full bg-white/38" />
        </div>
      </div>

      <div className="relative z-10 mb-5 rounded-[2rem] p-3 ios-dock">
        <div className="grid grid-cols-3 gap-3">
          {phoneChannel && (
            <AppIcon
              label={phoneChannel.label}
              icon={phoneChannel.icon}
              iconClass={phoneChannel.iconClass}
              showLabel={false}
              onClick={() => navigate(phoneChannel.id)}
            />
          )}
          <AppIcon
            label="Practice"
            icon="practice"
            iconClass="bg-[#0a84ff] text-white"
            showLabel={false}
            onClick={continuePractice}
          />
          <AppIcon
            label="Safety Report"
            icon="report"
            iconClass="bg-[#af52de] text-white"
            showLabel={false}
            onClick={() => navigate('results')}
          />
        </div>
      </div>
    </section>
  );
}
