import AppTopBar from '../components/AppTopBar.jsx';
import ScenarioCard from '../components/ScenarioCard.jsx';
import { events, getEventNumber, getEventsByChannel, getNextUnansweredEventAfter } from '../data/events.js';
import { getSelectedOptionId, isCorrectAnswer, isEventAnswered } from '../utils/scoring.js';

const screenStyles = {
  messages: 'bg-[#f2f2f7] text-slate-950',
  email: 'bg-white text-slate-950',
  facebook: 'bg-[#f0f2f5] text-slate-950',
  browser: 'bg-slate-200 text-slate-950',
  phone: 'bg-slate-950 text-white',
};

const completeStyles = {
  messages: 'bg-emerald-50 text-emerald-950 border-emerald-100',
  email: 'bg-emerald-50 text-emerald-950 border-emerald-100',
  facebook: 'bg-white text-slate-950 border-slate-200',
  browser: 'bg-white text-slate-950 border-slate-200',
  phone: 'bg-white/10 text-white border-white/10',
};

const completeCopy = {
  messages: {
    title: 'No new scam texts',
    detail: 'All message scenarios have been checked.',
    primary: 'Messages checked',
  },
  email: {
    title: 'Inbox checked',
    detail: 'All email scenarios have been reviewed.',
    primary: 'Mail checked',
  },
  facebook: {
    title: 'No pending requests',
    detail: 'All Facebook scenarios have been handled.',
    primary: 'Requests checked',
  },
  browser: {
    title: 'Tabs checked',
    detail: 'All browser scenarios have been reviewed.',
    primary: 'Browser checked',
  },
  phone: {
    title: 'No suspicious calls',
    detail: 'All phone call scenarios have been handled.',
    primary: 'Calls checked',
  },
};

function ChannelCompleteView({ channel, title, answeredCount, totalCount, onReview, onResults }) {
  const copy = completeCopy[channel] ?? completeCopy.messages;
  const dark = channel === 'phone';

  return (
    <div className={`flex min-h-0 flex-1 flex-col items-center justify-center px-5 py-6 text-center ${dark ? 'text-white' : 'text-slate-950'}`}>
      <div
        className={`flex h-20 w-20 items-center justify-center rounded-[1.5rem] text-2xl font-semibold shadow-lg ${
          dark ? 'bg-white/12 text-white' : 'bg-blue-100 text-blue-800'
        }`}
      >
        Done
      </div>
      <p className={`mt-5 text-sm font-semibold uppercase tracking-wide ${dark ? 'text-white/55' : 'text-slate-500'}`}>
        {copy.primary}
      </p>
      <h2 className="mt-2 text-3xl font-semibold leading-tight">{copy.title}</h2>
      <p className={`mt-3 max-w-[18rem] text-lg font-semibold leading-7 ${dark ? 'text-white/70' : 'text-slate-600'}`}>
        {copy.detail}
      </p>
      <div className={`mt-5 rounded-2xl px-4 py-3 text-base font-semibold ${dark ? 'bg-white/10' : 'bg-white shadow-sm'}`}>
        {answeredCount}/{totalCount} {title} scenarios complete
      </div>
      <div className="mt-6 grid w-full grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onReview}
          className={`shrink-0 rounded-full px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-4 ${
            channel === 'phone'
              ? 'bg-white/12 text-white focus:ring-white/30'
              : 'bg-white text-blue-700 shadow-sm focus:ring-blue-200'
          }`}
        >
          Review Last
        </button>
        <button
          type="button"
          onClick={onResults}
          className={`rounded-full px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-4 ${
            channel === 'phone' ? 'bg-white text-slate-950 focus:ring-white/30' : 'bg-blue-700 text-white focus:ring-blue-200'
          }`}
        >
          Safety Report
        </button>
      </div>
    </div>
  );
}

function ReviewModeNotice({ channel, correct, title, onResults }) {
  return (
    <div className={`border-b px-4 py-3 ${completeStyles[channel] ?? completeStyles.messages}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-wide opacity-70">Review mode</p>
          <p className="mt-1 truncate text-base font-semibold">
            {correct ? 'Protected answer saved.' : `Review warning signs: ${title}`}
          </p>
        </div>
        <button
          type="button"
          onClick={onResults}
          className={`shrink-0 rounded-full px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-4 ${
            channel === 'phone'
              ? 'bg-white text-slate-950 focus:ring-white/30'
              : 'bg-blue-700 text-white focus:ring-blue-200'
          }`}
        >
          Report
        </button>
      </div>
    </div>
  );
}

export default function ChannelScreen({
  title,
  channel,
  navigate,
  answers,
  answerEvent,
  markEventHesitated,
  nextScenario,
  reviewScenario,
  reviewEventId,
  safetySupportId,
  scenarioIndexes,
}) {
  const channelEvents = getEventsByChannel(channel);
  const currentIndex = scenarioIndexes[channel] ?? 0;
  const event = channelEvents[currentIndex];
  const answeredCount = channelEvents.filter((channelEvent) => isEventAnswered(answers, channelEvent.id)).length;
  const isChannelComplete = answeredCount === channelEvents.length && channelEvents.length > 0;
  const selectedOptionId = event ? getSelectedOptionId(answers, event.id) : null;
  const isReviewMode = Boolean(event && reviewEventId === event.id);
  const reviewCorrect = Boolean(event && selectedOptionId && isCorrectAnswer(event, selectedOptionId));
  const scenarioNumber = event ? getEventNumber(event.id) : 0;
  const nextUnansweredEvent = event ? getNextUnansweredEventAfter(answers, event.id) : null;
  const progressLabel = event ? `Scenario ${scenarioNumber} of ${events.length}` : `${answeredCount}/${channelEvents.length}`;
  const topBarSubtitle = isChannelComplete && !isReviewMode ? (channel === 'messages' || channel === 'phone' ? title : 'Complete') : event?.sender;

  return (
    <section className={`flex h-full flex-col overflow-hidden ${screenStyles[channel] ?? screenStyles.messages}`}>
      {event ? (
        <>
          <AppTopBar
            channel={channel}
            title={title}
            subtitle={topBarSubtitle}
            progressLabel={progressLabel}
            onBack={() => navigate('home')}
          />
          {isReviewMode ? (
            <ReviewModeNotice
              channel={channel}
              correct={reviewCorrect}
              title={event.title}
              onResults={() => navigate('results')}
            />
          ) : isChannelComplete && !selectedOptionId ? (
            <ChannelCompleteView
              channel={channel}
              title={title}
              answeredCount={answeredCount}
              totalCount={channelEvents.length}
              onReview={() => reviewScenario(channel, Math.min(currentIndex, channelEvents.length - 1))}
              onResults={() => navigate('results')}
            />
          ) : (
            <ScenarioCard
              event={event}
              selectedOptionId={selectedOptionId}
              onAnswer={answerEvent}
              onDelay={() => navigate('home')}
              onHesitate={markEventHesitated}
              onNext={() => nextScenario(channel, channelEvents.length)}
              nextLabel={nextUnansweredEvent ? 'Next Scenario' : 'View Safety Report'}
              safetySupportId={safetySupportId}
            />
          )}
          {isReviewMode && (
            <ScenarioCard
              event={event}
              selectedOptionId={selectedOptionId}
              onAnswer={answerEvent}
              onDelay={() => navigate('home')}
              onHesitate={markEventHesitated}
              onNext={() => navigate('results')}
              nextLabel="Back to Report"
              safetySupportId={safetySupportId}
            />
          )}
        </>
      ) : (
        <p className="p-5 text-lg leading-7 text-slate-700">No scenario is available yet.</p>
      )}
    </section>
  );
}
