import { useEffect, useState } from 'react';
import { ShieldQuestion } from 'lucide-react';
import { events, getEventNumber } from '../data/events.js';
import { getAnswerOutcome, getEventPoints, getMistakeRisk, getSelectedOption, isCorrectAnswer } from '../utils/scoring.js';
import SafeActionChecklist from './SafeActionChecklist.jsx';
import ScenarioPreview from './ScenarioPreview.jsx';

const actionMeta = {
  'tap-link': { token: 'link', detail: 'Open the message link' },
  'call-bank': { token: 'call', detail: 'Use the number on your card' },
  reply: { token: 'msg', detail: 'Send a text response' },
  'reply-confirm': { token: 'msg', detail: 'Respond to the saved contact' },
  'send-card': { token: 'card', detail: 'Introduce gift cards' },
  'report-junk': { token: 'junk', detail: 'Report this saved contact' },
  'open-viewer': { token: 'doc', detail: 'Open the attached file' },
  'type-gov-site': { token: 'gov', detail: 'Use the official .gov path' },
  'reply-ssn': { token: 'ssn', detail: 'Send private identity information' },
  'pay-fee': { token: 'pay', detail: 'Open the payment request' },
  'delete-email': { token: 'trash', detail: 'Move the email to trash' },
  'forward-friends': { token: 'fwd', detail: 'Share this email with others' },
  'send-gift-cards': { token: 'card', detail: 'Buy and send gift cards' },
  'call-family': { token: 'call', detail: 'Call family from Contacts' },
  'keep-secret': { token: 'lock', detail: 'Keep the request private' },
  'call-popup-number': { token: 'call', detail: 'Call the number on screen' },
  'close-tab': { token: 'tab', detail: 'Close the current browser tab' },
  'download-cleaner': { token: 'app', detail: 'Install the suggested app' },
  'continue-reading': { token: 'gov', detail: 'Use the official reporting page' },
  'call-ad-number': { token: 'ad', detail: 'Call a number from an ad' },
  'enter-bank-login': { token: 'key', detail: 'Enter financial login details' },
  'share-medicare-number': { token: 'id', detail: 'Give Medicare information' },
  'hang-up-call-official': { token: 'end', detail: 'End the call now' },
  'confirm-birthday': { token: 'dob', detail: 'Confirm identity details' },
};

function ActionResultBadge({ showCorrect, showIncorrect }) {
  if (showCorrect) {
    return <span className="mt-2 block text-xs font-semibold uppercase tracking-wide opacity-80">Protected</span>;
  }

  if (showIncorrect) {
    return <span className="mt-2 block text-xs font-semibold uppercase tracking-wide opacity-80">Risk increased</span>;
  }

  return null;
}

function getActionMeta(option) {
  return actionMeta[option.id] ?? { token: 'act', detail: option.label };
}

function getStatusClasses(showCorrect, showIncorrect, idle, correct, incorrect) {
  if (showCorrect) {
    return correct;
  }

  if (showIncorrect) {
    return incorrect;
  }

  return idle;
}

function ActionHeader({ dark = false, event, guided, label, onDelay }) {
  if (guided) {
    return <h3 className={`text-center text-lg font-semibold ${dark ? 'text-white' : 'text-slate-950'}`}>{event.question}</h3>;
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <p className={`text-xs font-semibold uppercase tracking-wide ${dark ? 'text-white/55' : 'text-slate-500'}`}>
        {label}
      </p>
      {onDelay && (
        <button
          type="button"
          onClick={onDelay}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-4 ${
            dark ? 'bg-white/12 text-white focus:ring-white/30' : 'bg-slate-950/[0.06] text-slate-600 focus:ring-blue-200'
          }`}
        >
          Later
        </button>
      )}
    </div>
  );
}

function ActionRow({
  option,
  selectedOptionId,
  hasAnswered,
  onAnswer,
  className = '',
  idleClass = 'bg-white/82 text-blue-600 disabled:text-slate-400',
  correctClass = 'bg-emerald-50 text-emerald-900',
  incorrectClass = 'bg-amber-50 text-amber-900',
  iconClass = 'bg-slate-950/5 text-slate-600',
  selectedIconClass = 'bg-blue-500 text-white',
}) {
  const selected = selectedOptionId === option.id;
  const showCorrect = hasAnswered && option.isCorrect;
  const showIncorrect = hasAnswered && selected && !option.isCorrect;
  const meta = getActionMeta(option);
  const statusClasses = getStatusClasses(showCorrect, showIncorrect, idleClass, correctClass, incorrectClass);
  const resolvedIconClass = selected || showCorrect || showIncorrect ? selectedIconClass : iconClass;

  return (
    <button
      key={option.id}
      type="button"
      disabled={hasAnswered}
      onClick={() => onAnswer(option.eventId, option.id)}
      className={`flex w-full items-center gap-3 break-words text-left focus:outline-none focus:ring-4 focus:ring-blue-200 ${statusClasses} ${className}`}
    >
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[11px] font-semibold uppercase ${resolvedIconClass}`}>
        {meta.token}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-semibold leading-5">{option.appLabel ?? option.label}</span>
        <span className="mt-1 block text-sm font-medium leading-5 opacity-70">{meta.detail}</span>
        <ActionResultBadge showCorrect={showCorrect} showIncorrect={showIncorrect} />
      </span>
    </button>
  );
}

function withEventId(event) {
  return event.options.map((option) => ({ ...option, eventId: event.id }));
}

function MessageActions({ event, selectedOptionId, hasAnswered, guided, onAnswer, onDelay }) {
  return (
    <div className="rounded-t-[1.75rem] bg-white/82 p-3 text-slate-950 shadow-[0_-10px_30px_rgba(15,23,42,0.12)] ring-1 ring-white/60 backdrop-blur-2xl">
      <ActionHeader event={event} guided={guided} label="Message actions" onDelay={hasAnswered ? undefined : onDelay} />
      <div className="mt-3 overflow-hidden rounded-2xl bg-white/82 shadow-sm ring-1 ring-slate-950/5">
        {withEventId(event).map((option, index) => (
          <ActionRow
            key={option.id}
            option={option}
            selectedOptionId={selectedOptionId}
            hasAnswered={hasAnswered}
            onAnswer={onAnswer}
            className={`px-4 py-3.5 ${index > 0 ? 'border-t border-slate-200' : ''}`}
            selectedIconClass="bg-blue-500 text-white"
          />
        ))}
      </div>
    </div>
  );
}

function EmailActions({ event, selectedOptionId, hasAnswered, guided, onAnswer, onDelay }) {
  return (
    <div className="rounded-t-[1.75rem] bg-white/86 p-3 text-slate-950 shadow-[0_-10px_30px_rgba(15,23,42,0.12)] ring-1 ring-white/60 backdrop-blur-2xl">
      <ActionHeader event={event} guided={guided} label="Mail actions" onDelay={hasAnswered ? undefined : onDelay} />
      <div className="mt-3 overflow-hidden rounded-2xl bg-white/82 ring-1 ring-slate-950/5">
        {withEventId(event).map((option, index) => (
          <ActionRow
            key={option.id}
            option={option}
            selectedOptionId={selectedOptionId}
            hasAnswered={hasAnswered}
            onAnswer={onAnswer}
            className={`px-4 py-3.5 ${index > 0 ? 'border-t border-slate-200' : ''}`}
            idleClass="bg-white/82 text-blue-600 disabled:text-slate-400"
            correctClass="bg-emerald-50 text-emerald-900"
            incorrectClass="bg-amber-50 text-amber-900"
            selectedIconClass="bg-blue-500 text-white"
          />
        ))}
      </div>
    </div>
  );
}

function FacebookActions({ event, selectedOptionId, hasAnswered, guided, onAnswer, onDelay }) {
  return (
    <div className="rounded-t-[1.75rem] bg-white/82 p-3 text-slate-950 shadow-[0_-10px_30px_rgba(15,23,42,0.12)] ring-1 ring-white/60 backdrop-blur-2xl">
      <ActionHeader event={event} guided={guided} label="Facebook actions" onDelay={hasAnswered ? undefined : onDelay} />
      <div className="mt-3 flex flex-col gap-2">
        {withEventId(event).map((option) => (
          <ActionRow
            key={option.id}
            option={option}
            selectedOptionId={selectedOptionId}
            hasAnswered={hasAnswered}
            onAnswer={onAnswer}
            className="rounded-2xl px-4 py-3 ring-1 ring-slate-950/5"
            idleClass="bg-white/82 text-[#1877f2] disabled:text-slate-400"
            selectedIconClass="bg-[#1877f2] text-white"
          />
        ))}
      </div>
    </div>
  );
}

function BrowserActions({ event, selectedOptionId, hasAnswered, guided, onAnswer, onDelay }) {
  return (
    <div className="rounded-t-[1.75rem] bg-white/82 p-3 text-slate-950 shadow-[0_-10px_30px_rgba(15,23,42,0.12)] ring-1 ring-white/60 backdrop-blur-2xl">
      <ActionHeader event={event} guided={guided} label="Browser actions" onDelay={hasAnswered ? undefined : onDelay} />
      <div className="mt-3 overflow-hidden rounded-2xl bg-white/82 shadow-sm ring-1 ring-slate-950/5">
        {withEventId(event).map((option, index) => (
          <ActionRow
            key={option.id}
            option={option}
            selectedOptionId={selectedOptionId}
            hasAnswered={hasAnswered}
            onAnswer={onAnswer}
            className={`px-4 py-3.5 ${index > 0 ? 'border-t border-slate-200' : ''}`}
            idleClass="bg-white/82 text-blue-600 disabled:text-slate-400"
            selectedIconClass="bg-sky-500 text-white"
          />
        ))}
      </div>
    </div>
  );
}

function PhoneActions({ event, selectedOptionId, hasAnswered, guided, onAnswer, onDelay }) {
  return (
    <div className="rounded-t-[1.75rem] bg-slate-950/88 p-3 text-white shadow-[0_-10px_30px_rgba(15,23,42,0.24)] ring-1 ring-white/10 backdrop-blur-2xl">
      <ActionHeader dark event={event} guided={guided} label="Call controls" onDelay={hasAnswered ? undefined : onDelay} />
      <div className="mt-3 grid grid-cols-3 gap-2">
        {withEventId(event).map((option) => {
          const showCorrect = hasAnswered && option.isCorrect;
          const showIncorrect = hasAnswered && selectedOptionId === option.id && !option.isCorrect;
          const statusClasses = showCorrect
            ? 'bg-emerald-500 text-white ring-emerald-300'
            : showIncorrect
              ? 'bg-amber-500 text-slate-950 ring-amber-300'
              : option.id === 'hang-up-call-official'
                ? 'bg-red-600 text-white ring-red-400 disabled:bg-red-900'
                : 'bg-white/12 text-white ring-white/15 disabled:text-slate-500';

          return (
            <button
              key={option.id}
              type="button"
              disabled={hasAnswered}
              onClick={() => onAnswer(option.eventId, option.id)}
              className={`min-h-24 break-words rounded-2xl p-3 text-center text-sm font-semibold leading-5 ring-1 focus:outline-none focus:ring-4 focus:ring-white/30 ${statusClasses}`}
            >
              <span className="block text-xs uppercase tracking-wide opacity-70">{getActionMeta(option).token}</span>
              <span className="mt-1 block">{option.appLabel ?? option.label}</span>
              <ActionResultBadge showCorrect={showCorrect} showIncorrect={showIncorrect} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DefaultActions({ event, selectedOptionId, hasAnswered, guided, onAnswer, onDelay }) {
  return (
    <div className="rounded-t-[1.75rem] bg-white/86 p-4 text-slate-950 shadow-[0_-10px_30px_rgba(15,23,42,0.12)] ring-1 ring-white/60 backdrop-blur-2xl">
      <ActionHeader event={event} guided={guided} label="Available actions" onDelay={hasAnswered ? undefined : onDelay} />
      <div className="mt-3 flex flex-col gap-3">
        {withEventId(event).map((option) => {
          const selected = selectedOptionId === option.id;
          const showCorrect = hasAnswered && option.isCorrect;
          const showIncorrect = hasAnswered && selected && !option.isCorrect;
          const optionClasses = showCorrect
            ? 'border-emerald-600 bg-emerald-50 text-emerald-950'
            : showIncorrect
              ? 'border-amber-500 bg-amber-50 text-amber-950'
              : selected
                ? 'border-blue-700 bg-blue-50 text-blue-950'
                : 'border-slate-200 bg-white text-slate-800 disabled:bg-slate-50';

          return (
            <button
              key={option.id}
              type="button"
              disabled={hasAnswered}
              onClick={() => onAnswer(option.eventId, option.id)}
              className={`break-words rounded-2xl border p-4 text-left text-lg font-semibold leading-7 focus:outline-none focus:ring-4 focus:ring-blue-200 ${optionClasses}`}
            >
              {option.label}
              <ActionResultBadge showCorrect={showCorrect} showIncorrect={showIncorrect} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

const outcomeToneClasses = {
  safe: 'bg-emerald-50 text-emerald-950 ring-emerald-100',
  warning: 'bg-amber-50 text-amber-950 ring-amber-100',
  danger: 'bg-red-50 text-red-950 ring-red-100',
};

const difficultyClasses = {
  easy: 'bg-emerald-100 text-emerald-900',
  medium: 'bg-blue-100 text-blue-900',
  hard: 'bg-amber-100 text-amber-900',
};

function getSupportConfig(event, safetySupportId) {
  if (safetySupportId === 'independent') {
    return {
      autoEscalateMs: null,
      feedback: 'minimal',
      showHint: false,
      showPrompt: false,
    };
  }

  if (safetySupportId === 'guided') {
    return {
      autoEscalateMs: 5000,
      feedback: 'all',
      showHint: true,
      showPrompt: true,
    };
  }

  return {
    autoEscalateMs: 7000,
    feedback: 'risky',
    showHint: event.difficulty === 'hard',
    showPrompt: event.difficulty === 'easy',
  };
}

function ScenarioMetaStrip({ event }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-950/5 bg-white/58 px-4 py-2 backdrop-blur-2xl">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Scenario {getEventNumber(event.id)} of {events.length}
      </span>
      <span
        className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
          difficultyClasses[event.difficulty] ?? difficultyClasses.easy
        }`}
      >
        {event.difficulty}
      </span>
    </div>
  );
}

function SupportHint({ event, safetySupportId }) {
  const supportCopy =
    safetySupportId === 'guided'
      ? 'Pause before acting. Check who is asking, what they want, and whether they are pushing urgency, payment, links, or private information.'
      : 'Hint: urgent requests for money, links, or private information deserve extra verification.';

  return (
    <div className="border-b border-slate-950/5 bg-blue-50 px-4 py-3 text-slate-950">
      <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Safety Support</p>
      <p className="mt-1 text-sm font-semibold leading-6 text-slate-700">{supportCopy}</p>
      {safetySupportId === 'guided' && (
        <p className="mt-1 text-sm font-medium leading-6 text-slate-600">Recommended habit: {event.pausePhrase}</p>
      )}
    </div>
  );
}

function ExplorationControls({ dark = false, showHelp, helpOpen, onHelp, onDelay }) {
  return (
    <div className="pointer-events-none absolute inset-x-4 bottom-4 z-20 flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={onDelay}
        className={`pointer-events-auto rounded-full px-3 py-2 text-xs font-semibold shadow-lg backdrop-blur-2xl transition duration-150 active:scale-[0.98] focus:outline-none focus:ring-4 ${
          dark
            ? 'bg-white/12 text-white ring-1 ring-white/15 focus:ring-white/30'
            : 'bg-white/82 text-slate-700 ring-1 ring-white/70 focus:ring-blue-200'
        }`}
      >
        Later
      </button>

      {showHelp && (
        <button
          type="button"
          onClick={onHelp}
          className={`pointer-events-auto flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold shadow-lg backdrop-blur-2xl transition duration-150 active:scale-[0.98] focus:outline-none focus:ring-4 ${
            helpOpen
              ? 'bg-blue-600 text-white ring-1 ring-blue-300 focus:ring-blue-200'
              : dark
                ? 'bg-white/12 text-white ring-1 ring-white/15 focus:ring-white/30'
                : 'bg-white/86 text-blue-700 ring-1 ring-white/70 focus:ring-blue-200'
          }`}
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-current/10">
            <ShieldQuestion size={14} strokeWidth={2.3} />
          </span>
          Need help?
        </button>
      )}
    </div>
  );
}

function CompactResultSheet({ event, selectedOptionId, selectedCorrect, onNext, nextLabel, safetySupportId }) {
  const selectedOption = getSelectedOption(event, selectedOptionId);
  const riskAdded = getMistakeRisk(event, selectedOption);

  if (safetySupportId === 'independent') {
    return (
      <div className="rounded-t-[1.75rem] bg-white/92 p-4 text-slate-950 shadow-[0_-12px_36px_rgba(15,23,42,0.16)] ring-1 ring-white/70 backdrop-blur-2xl">
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-300" />
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Action saved</p>
        <h3 className="mt-1 text-xl font-semibold text-slate-950">Continue when ready</h3>
        <p className="mt-2 text-base font-medium leading-7 text-slate-600">
          Feedback is saved for your final Safety Report.
        </p>
        <button
          type="button"
          onClick={onNext}
          className="mt-4 w-full rounded-2xl bg-blue-600 px-5 py-4 text-lg font-semibold text-white focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          {nextLabel}
        </button>
      </div>
    );
  }

  const title = selectedCorrect ? 'Protected' : 'Risk increased';
  const detail = selectedCorrect
    ? 'Good choice. You used a safer path.'
    : `Risk +${riskAdded}. Safety Coach can explain this pattern in the final report.`;

  return (
    <div className="rounded-t-[1.75rem] bg-white/92 p-4 text-slate-950 shadow-[0_-12px_36px_rgba(15,23,42,0.16)] ring-1 ring-white/70 backdrop-blur-2xl">
      <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-300" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Action saved</p>
          <h3 className="mt-1 text-xl font-semibold text-slate-950">{title}</h3>
          <p className="mt-2 text-base font-medium leading-7 text-slate-600">{detail}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
            selectedCorrect ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
          }`}
        >
          {selectedCorrect ? 'Safe' : `+${riskAdded}`}
        </span>
      </div>
      <button
        type="button"
        onClick={onNext}
        className="mt-4 w-full rounded-2xl bg-blue-600 px-5 py-4 text-lg font-semibold text-white focus:outline-none focus:ring-4 focus:ring-blue-300"
      >
        {nextLabel}
      </button>
    </div>
  );
}

function SafetyCoachSheet({ event, selectedOptionId, selectedCorrect, onNext, nextLabel }) {
  const eventPoints = getEventPoints(event);
  const outcome = getAnswerOutcome(event, selectedOptionId);
  const selectedOption = getSelectedOption(event, selectedOptionId);
  const riskAdded = getMistakeRisk(event, selectedOption);

  return (
    <div className="max-h-[48%] overflow-y-auto rounded-t-[1.75rem] bg-white/92 p-4 text-slate-950 shadow-[0_-12px_36px_rgba(15,23,42,0.16)] ring-1 ring-white/70 backdrop-blur-2xl">
      <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-300" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Safety Coach</p>
          <h3 className="mt-1 text-xl font-semibold text-slate-950">
            {selectedCorrect ? 'Protected' : 'Risk increased'}
          </h3>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
            selectedCorrect ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
          }`}
        >
          {selectedCorrect ? 'Protected' : `Risk +${riskAdded}`}
        </span>
      </div>

      <p className="mt-3 text-base font-medium leading-7 text-slate-700">{event.explanation}</p>

      {outcome && (
        <div className="mt-3 rounded-2xl bg-slate-100 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Immediate coaching</p>
          <p className="mt-1 text-base font-semibold leading-6 text-slate-950">{outcome.title}</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-blue-700">{outcome.nextStep}</p>
        </div>
      )}

      <div
        className={`mt-3 rounded-2xl p-3 ${
          selectedCorrect ? 'bg-emerald-50 text-emerald-950' : 'bg-amber-50 text-amber-950'
        }`}
      >
        <p className="text-xs font-semibold uppercase tracking-wide opacity-70">Game result</p>
        <p className="mt-1 text-base font-semibold leading-7">
          {selectedCorrect ? `+${eventPoints} safety points` : 'Saved for final report'}
        </p>
      </div>

      <div className="mt-3 rounded-2xl bg-slate-100 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Recommended action</p>
        <p className="mt-1 text-base font-semibold leading-7 text-slate-950">{event.trustedAction}</p>
      </div>

      {event.sourceLabel && (
        <a
          href={event.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 block rounded-2xl bg-white p-3 text-sm font-semibold leading-6 text-blue-700 ring-1 ring-slate-200"
        >
          Source: {event.sourceLabel}
        </a>
      )}

      <div className="mt-3 rounded-2xl bg-blue-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Practice phrase</p>
        <p className="mt-1 text-base font-semibold leading-7 text-slate-950">{event.pausePhrase}</p>
      </div>

      <div className="mt-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Warning signs</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {event.warningSigns.map((sign) => (
            <span key={sign} className="rounded-full bg-amber-100 px-3 py-1.5 text-sm font-bold text-amber-950">
              {sign}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <SafeActionChecklist activeHabitIds={event.habitIds} />
      </div>

      <button
        type="button"
        onClick={onNext}
        className="mt-4 w-full rounded-2xl bg-blue-600 px-5 py-4 text-lg font-semibold text-white focus:outline-none focus:ring-4 focus:ring-blue-300"
      >
        {nextLabel}
      </button>
    </div>
  );
}

export default function ScenarioCard({
  event,
  selectedOptionId,
  onAnswer,
  onDelay,
  onHesitate,
  onNext,
  nextLabel,
  safetySupportId = 'balanced',
}) {
  const [helpOpen, setHelpOpen] = useState(false);
  const [guidedReady, setGuidedReady] = useState(false);
  const hasAnswered = Boolean(selectedOptionId);
  const selectedCorrect = hasAnswered && isCorrectAnswer(event, selectedOptionId);
  const supportConfig = getSupportConfig(event, safetySupportId);
  const independent = safetySupportId === 'independent';
  const guidedSupport = safetySupportId === 'guided';
  const guided = supportConfig.showPrompt;
  const showHelpButton = !independent && (!guidedSupport || guidedReady || helpOpen);
  const showActionTray = helpOpen && !hasAnswered && guidedSupport;
  const showSupportHint = helpOpen && !hasAnswered && !independent;
  const showDetailedCoach = hasAnswered && guidedSupport;

  useEffect(() => {
    setHelpOpen(false);
    setGuidedReady(!guidedSupport);
  }, [event.id, guidedSupport]);

  useEffect(() => {
    if (!guidedSupport || guidedReady) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      setGuidedReady(true);
    }, 1200);

    return () => window.clearTimeout(timerId);
  }, [guidedReady, guidedSupport]);

  useEffect(() => {
    if (!supportConfig.autoEscalateMs || hasAnswered || !onHesitate) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      onHesitate(event.id);
    }, supportConfig.autoEscalateMs);

    return () => window.clearTimeout(timerId);
  }, [event.id, hasAnswered, onHesitate, supportConfig.autoEscalateMs]);

  function handleDelay() {
    onHesitate?.(event.id);
    onDelay?.();
  }

  function handleNativeAnswer(choiceId) {
    onAnswer(event.id, choiceId);
  }

  return (
    <article key={event.id} className="scenario-transition relative flex min-h-0 flex-1 flex-col">
      <ScenarioMetaStrip event={event} />
      {showSupportHint && <SupportHint event={event} safetySupportId={safetySupportId} />}
      <ScenarioPreview event={event} disabled={hasAnswered} onAnswer={handleNativeAnswer} />
      {!hasAnswered && (
        <ExplorationControls
          dark={event.channel === 'phone'}
          showHelp={showHelpButton}
          helpOpen={helpOpen}
          onHelp={() => setHelpOpen((current) => !current)}
          onDelay={handleDelay}
        />
      )}

      {showActionTray && (
        event.channel === 'messages' ? (
          <MessageActions
            event={event}
            selectedOptionId={selectedOptionId}
            hasAnswered={hasAnswered}
            guided={guided}
            onAnswer={onAnswer}
            onDelay={handleDelay}
          />
        ) : event.channel === 'email' ? (
          <EmailActions
            event={event}
            selectedOptionId={selectedOptionId}
            hasAnswered={hasAnswered}
            guided={guided}
            onAnswer={onAnswer}
            onDelay={handleDelay}
          />
        ) : event.channel === 'facebook' ? (
          <FacebookActions
            event={event}
            selectedOptionId={selectedOptionId}
            hasAnswered={hasAnswered}
            guided={guided}
            onAnswer={onAnswer}
            onDelay={handleDelay}
          />
        ) : event.channel === 'browser' ? (
          <BrowserActions
            event={event}
            selectedOptionId={selectedOptionId}
            hasAnswered={hasAnswered}
            guided={guided}
            onAnswer={onAnswer}
            onDelay={handleDelay}
          />
        ) : event.channel === 'phone' ? (
          <PhoneActions
            event={event}
            selectedOptionId={selectedOptionId}
            hasAnswered={hasAnswered}
            guided={guided}
            onAnswer={onAnswer}
            onDelay={handleDelay}
          />
        ) : (
          <DefaultActions
            event={event}
            selectedOptionId={selectedOptionId}
            hasAnswered={hasAnswered}
            guided={guided}
            onAnswer={onAnswer}
            onDelay={handleDelay}
          />
        )
      )}

      {showDetailedCoach && (
        <SafetyCoachSheet
          event={event}
          selectedOptionId={selectedOptionId}
          selectedCorrect={selectedCorrect}
          onNext={onNext}
          nextLabel={nextLabel}
        />
      )}
      {hasAnswered && !showDetailedCoach && (
        <CompactResultSheet
          event={event}
          selectedOptionId={selectedOptionId}
          selectedCorrect={selectedCorrect}
          onNext={onNext}
          nextLabel={nextLabel}
          safetySupportId={safetySupportId}
        />
      )}
    </article>
  );
}
