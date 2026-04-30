import { useState } from 'react';
import AppGlyph from '../components/AppGlyph.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import { channels, getChannelLabel } from '../data/channels.js';
import { events, getNextEventForPersona } from '../data/events.js';
import {
  calculateScore,
  getAnswerOutcome,
  getChannelSummaries,
  getHabitSummaries,
  getMissedCategories,
  getPracticeRecommendation,
  getSelectedOptionId,
  isCorrectAnswer,
} from '../utils/scoring.js';

function getReportStatus(score, allComplete) {
  if (score.answered === 0) {
    return {
      title: 'Ready to practice',
      detail: 'Start with the recommended app and take your time with each prompt.',
      tone: 'bg-slate-100 text-slate-700',
    };
  }

  if (allComplete && score.reviewCount === 0) {
    return {
      title: 'Strong protection',
      detail: 'All scenarios are complete with no review items.',
      tone: 'bg-emerald-100 text-emerald-900',
    };
  }

  if (score.riskLevel === 'High') {
    return {
      title: 'Review high-risk choices',
      detail: 'Practice the items that involved private information, payments, or account access.',
      tone: 'bg-amber-100 text-amber-900',
    };
  }

  if (score.percent >= 80) {
    return {
      title: 'Good scam sense',
      detail: allComplete ? 'Review the few missed warning signs.' : 'Keep going to finish the remaining scenarios.',
      tone: 'bg-blue-100 text-blue-900',
    };
  }

  return {
    title: 'Practice recommended',
    detail: 'Focus on pausing, verifying directly, and protecting private information.',
    tone: 'bg-amber-100 text-amber-900',
  };
}

function ReportRing({ percent }) {
  return (
    <div
      className="mx-auto flex h-32 w-32 items-center justify-center rounded-full p-2"
      style={{
        background: `conic-gradient(#0a84ff ${percent * 3.6}deg, rgba(10,132,255,0.12) 0deg)`,
      }}
    >
      <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white/92 shadow-sm">
        <span className="text-4xl font-semibold tracking-tight text-slate-950">{percent}%</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Score</span>
      </div>
    </div>
  );
}

function MetricTile({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-950/[0.04] p-3 text-center">
      <p className="text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
    </div>
  );
}

function SectionTitle({ children }) {
  return <h2 className="mt-6 px-1 text-sm font-semibold uppercase tracking-wide text-slate-500">{children}</h2>;
}

function buildRecommendations({ allComplete, score, practiceRecommendation, improvementSkill }) {
  const recommendations = [];

  if (!allComplete) {
    recommendations.push(`Finish the remaining scenarios, starting with ${practiceRecommendation.title.toLowerCase()}.`);
  }

  if (score.warningSignsMissedCount > 0) {
    recommendations.push('Review the missed warning signs before responding to urgent calls, texts, or emails.');
  }

  if (improvementSkill) {
    recommendations.push(`Practice "${improvementSkill.label}" by using trusted numbers, official apps, or typed web addresses.`);
  }

  recommendations.push('Report suspected online scams through the appropriate official reporting channel.');

  return recommendations;
}

function buildPersonalizedReadout({ missedCategories, score, selectedPersona, strongestSkill, improvementSkill }) {
  if (score.answered === 0) {
    return {
      strength: `${selectedPersona.name} has not completed enough scenarios for a personal strength yet.`,
      weakness: 'Start with the recommended scenario to build a baseline.',
    };
  }

  const strength = strongestSkill
    ? `Your strongest pattern is "${strongestSkill.label}" with ${strongestSkill.correct} protected choices out of ${strongestSkill.answered}.`
    : 'Your strongest pattern will appear after more scenarios are completed.';
  const weakness = improvementSkill?.reviewCount > 0
    ? `Your main weak spot is "${improvementSkill.label}", especially when ${missedCategories[0]?.toLowerCase() ?? 'a request feels urgent'}.`
    : 'No clear weak spot yet. Keep practicing to confirm the pattern.';

  return { strength, weakness };
}

function getSupportRecommendation({ safetySupportId, score }) {
  if (score.answered === 0 || score.percent < 70 || score.riskLevel === 'High') {
    return {
      title: 'Try more support for learning',
      detail: 'More visible coaching can help reinforce warning signs before you practice independently.',
      tone: 'bg-amber-100 text-amber-900',
    };
  }

  if (safetySupportId === 'independent' && score.percent >= 80) {
    return {
      title: 'Strong independent awareness',
      detail: 'You handled the practice with low support and showed strong scam recognition.',
      tone: 'bg-emerald-100 text-emerald-900',
    };
  }

  if ((safetySupportId === 'guided' || safetySupportId === 'balanced') && score.percent >= 85 && score.warningSignsMissedCount <= 1) {
    return {
      title: 'Ready for lower support',
      detail: 'Your choices suggest you can reduce assistance on the next round.',
      tone: 'bg-blue-100 text-blue-900',
    };
  }

  return {
    title: 'Keep this support level',
    detail: 'This level is still useful while you build consistency across scam types.',
    tone: 'bg-slate-100 text-slate-700',
  };
}

export default function ResultsScreen({
  navigate,
  answers,
  continuePractice,
  resetGame,
  safetySupport,
  safetySupportId,
  selectedPersona,
  reviewScenario,
}) {
  const [resetArmed, setResetArmed] = useState(false);
  const score = calculateScore(events, answers);
  const channelSummaries = getChannelSummaries(events, answers);
  const habitSummaries = getHabitSummaries(events, answers);
  const nextPersonaEvent = getNextEventForPersona(answers, selectedPersona.focusChannel);
  const practiceRecommendation = nextPersonaEvent
    ? {
        channel: nextPersonaEvent.channel,
        title: 'Continue practice',
        detail: nextPersonaEvent.learningGoal,
      }
    : getPracticeRecommendation(events, answers);
  const missedCategories = getMissedCategories(events, answers);
  const allComplete = score.answered === score.total;
  const unansweredCount = score.total - score.answered;
  const reportStatus = getReportStatus(score, allComplete);
  const protectedScams = events.filter((event) => {
    const selectedOptionId = getSelectedOptionId(answers, event.id);

    return event.isScam && isCorrectAnswer(event, selectedOptionId);
  }).length;
  const strongestSkill = habitSummaries
    .filter((habit) => habit.answered > 0)
    .sort((a, b) => b.percent - a.percent || b.correct - a.correct || b.answered - a.answered)[0];
  const improvementSkill = habitSummaries
    .filter((habit) => habit.answered > 0)
    .sort((a, b) => b.reviewCount - a.reviewCount || a.percent - b.percent || b.total - a.total)[0];
  const personalizedReadout = buildPersonalizedReadout({
    missedCategories,
    score,
    selectedPersona,
    strongestSkill,
    improvementSkill,
  });
  const supportRecommendation = getSupportRecommendation({ safetySupportId, score });
  const recommendations = buildRecommendations({
    allComplete,
    score,
    practiceRecommendation,
    improvementSkill,
  });

  function requestReset() {
    setResetArmed(true);
  }

  return (
    <section className="relative flex h-full flex-col overflow-hidden bg-[#f5f5f7] text-slate-950">
      <header className="border-b border-white/70 bg-white/72 px-4 py-3 backdrop-blur-2xl">
        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={() => navigate('home')} className="text-base font-medium text-blue-600">
            Done
          </button>
          <p className="text-lg font-semibold">Safety Report</p>
          <button type="button" onClick={requestReset} className="text-base font-medium text-blue-600">
            Reset
          </button>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
        <div className="rounded-[1.75rem] bg-white/86 p-5 text-center shadow-[0_8px_24px_rgba(15,23,42,0.08)] ring-1 ring-white/70 backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">SilverShield</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Safety Report</h1>
          <p className="mt-1 text-base font-medium text-slate-500">{selectedPersona.name}</p>
          <p className="mx-auto mt-4 max-w-[18rem] text-lg font-semibold leading-7 text-slate-800">
            You protected yourself from {protectedScams} scams, but missed {score.warningSignsMissedCount} warning signs.
          </p>

          <div className="mt-5">
            <ReportRing percent={score.percent} />
          </div>

          <div className={`mx-auto mt-5 w-fit rounded-full px-4 py-2 text-sm font-semibold ${reportStatus.tone}`}>
            {reportStatus.title}
          </div>
          <p className="mx-auto mt-3 max-w-[18rem] text-base font-medium leading-7 text-slate-600">
            {reportStatus.detail}
          </p>
          <div className="mt-4 rounded-2xl bg-slate-950/[0.04] p-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Personalized readout</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">{personalizedReadout.strength}</p>
            <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{personalizedReadout.weakness}</p>
          </div>
          <div className="mt-3 rounded-2xl bg-slate-950/[0.04] p-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Safety Support: {safetySupport?.label ?? 'Balanced'}
            </p>
            <p className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${supportRecommendation.tone}`}>
              {supportRecommendation.title}
            </p>
            <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{supportRecommendation.detail}</p>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            <MetricTile label="Points" value={score.points} />
            <MetricTile label="Streak" value={score.currentStreak} />
            <MetricTile label="Left" value={unansweredCount} />
          </div>

          <div className="mt-2 grid grid-cols-3 gap-2">
            <MetricTile label="Protected" value={score.protectedChoices} />
            <MetricTile label="Missed Signs" value={score.warningSignsMissedCount} />
            <MetricTile label="Risk" value={score.riskLevel} />
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl bg-white/86 shadow-sm ring-1 ring-white/70 backdrop-blur-xl">
          <button
            type="button"
            onClick={continuePractice}
            className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            <span className="min-w-0">
              <span className="block text-sm font-semibold uppercase tracking-wide text-slate-500">Next step</span>
              <span className="mt-1 block text-lg font-semibold text-slate-950">{practiceRecommendation.title}</span>
              <span className="mt-1 block text-sm font-medium leading-6 text-slate-600">
                {getChannelLabel(practiceRecommendation.channel)}: {practiceRecommendation.detail}
              </span>
            </span>
            <span className="text-2xl font-bold text-slate-400">&gt;</span>
          </button>
        </div>

        {(strongestSkill || improvementSkill || score.warningSignsMissed.length > 0) && (
          <div className="mt-5 overflow-hidden rounded-2xl bg-white/86 shadow-sm ring-1 ring-white/70 backdrop-blur-xl">
            {strongestSkill && (
              <div className="border-b border-slate-200 px-4 py-4">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Strongest skill</p>
                <p className="mt-1 text-lg font-semibold text-slate-950">{strongestSkill.label}</p>
                <p className="mt-1 text-sm font-medium leading-6 text-slate-600">
                  {strongestSkill.correct} protected choices out of {strongestSkill.answered} practiced.
                </p>
              </div>
            )}
            {improvementSkill && (
              <div className="border-b border-slate-200 px-4 py-4">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Area to improve</p>
                <p className="mt-1 text-lg font-semibold text-slate-950">{improvementSkill.label}</p>
                <p className="mt-1 text-sm font-medium leading-6 text-slate-600">
                  {improvementSkill.reviewCount > 0
                    ? `${improvementSkill.reviewCount} risky choice needs review in this habit.`
                    : 'Keep this habit fresh with another practice round.'}
                </p>
              </div>
            )}
            <div className="px-4 py-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Missed warning signs</p>
              {score.warningSignsMissed.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {score.warningSignsMissed.map((warningSign) => (
                    <span key={warningSign} className="rounded-full bg-amber-100 px-3 py-1.5 text-sm font-semibold text-amber-950">
                      {warningSign}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-1 text-sm font-medium leading-6 text-slate-600">No warning signs missed yet.</p>
              )}
              {missedCategories.length > 0 && (
                <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                  Review focus: {missedCategories.join(', ')}.
                </p>
              )}
            </div>
          </div>
        )}

        <SectionTitle>Recommendations</SectionTitle>
        <div className="mt-2 overflow-hidden rounded-2xl bg-white/86 shadow-sm ring-1 ring-white/70 backdrop-blur-xl">
          {recommendations.map((recommendation, index) => (
            <div key={recommendation} className={`px-4 py-4 ${index > 0 ? 'border-t border-slate-200' : ''}`}>
              <p className="text-base font-semibold leading-7 text-slate-800">{recommendation}</p>
            </div>
          ))}
        </div>

        <SectionTitle>Apps</SectionTitle>
        <div className="mt-2 overflow-hidden rounded-2xl bg-white/86 shadow-sm ring-1 ring-white/70 backdrop-blur-xl">
          {channels.map((channel, index) => {
            const summary = channelSummaries.find((item) => item.channel === channel.id);
            const answered = summary?.answered ?? 0;
            const total = summary?.total ?? 0;
            const complete = answered === total;
            const needsReview = (summary?.reviewCount ?? 0) > 0;
            const statusLabel = needsReview ? 'Review' : complete ? 'Done' : 'Open';
            const statusClass = needsReview
              ? 'bg-amber-100 text-amber-900'
              : complete
                ? 'bg-emerald-100 text-emerald-900'
                : 'bg-slate-100 text-slate-600';

            return (
              <div key={channel.id} className={`px-4 py-4 ${index > 0 ? 'border-t border-slate-200' : ''}`}>
                <div className="flex items-center gap-3">
                  <span
                    className={`relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-sm ${channel.iconClass}`}
                  >
                    <span className="relative z-10 flex h-full w-full items-center justify-center">
                      <AppGlyph name={channel.icon} compact />
                    </span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-base font-semibold text-slate-950">{channel.label}</p>
                      <p className="shrink-0 text-sm font-medium text-slate-500">
                        {answered}/{total}
                      </p>
                    </div>
                    <div className="mt-2">
                      <ProgressBar value={answered} max={total} />
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass}`}
                  >
                    {statusLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <SectionTitle>Safe habits</SectionTitle>
        <div className="mt-2 overflow-hidden rounded-2xl bg-white/86 shadow-sm ring-1 ring-white/70 backdrop-blur-xl">
          {habitSummaries.map((habit, index) => {
            const label = habit.answered === 0 ? 'Not practiced' : `${habit.correct}/${habit.answered}`;

            return (
              <div key={habit.id} className={`px-4 py-4 ${index > 0 ? 'border-t border-slate-200' : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-slate-950">{habit.label}</p>
                    <p className="mt-1 text-sm font-medium leading-6 text-slate-600">{habit.description}</p>
                  </div>
                  <p className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">{label}</p>
                </div>
              </div>
            );
          })}
        </div>

        <SectionTitle>Review</SectionTitle>
        <div className="mt-2 overflow-hidden rounded-2xl bg-white/86 shadow-sm ring-1 ring-white/70 backdrop-blur-xl">
          {events.map((event, eventIndex) => {
            const selectedOptionId = getSelectedOptionId(answers, event.id);
            const answered = Boolean(selectedOptionId);
            const correct = answered && isCorrectAnswer(event, selectedOptionId);
            const outcome = answered ? getAnswerOutcome(event, selectedOptionId) : null;
            const channelEvents = events.filter((item) => item.channel === event.channel);
            const index = channelEvents.findIndex((item) => item.id === event.id);

            return (
              <button
                key={event.id}
                type="button"
                onClick={() => reviewScenario(event.channel, index)}
                className={`flex w-full items-center justify-between gap-3 px-4 py-4 text-left focus:outline-none focus:ring-4 focus:ring-blue-200 ${
                  eventIndex > 0 ? 'border-t border-slate-200' : ''
                }`}
              >
                <span className="min-w-0">
                  <span className="block text-sm font-medium uppercase tracking-wide text-slate-500">
                    {getChannelLabel(event.channel)}
                  </span>
                  <span className="mt-1 block truncate text-base font-semibold text-slate-950">{event.title}</span>
                  {outcome && (
                    <span className="mt-1 block text-sm font-medium leading-5 text-slate-600">
                      <span className="block font-semibold text-slate-700">{outcome.title}</span>
                      <span className="mt-1 block line-clamp-2">{outcome.detail}</span>
                      <span className="mt-1 block font-semibold text-blue-700">{outcome.nextStep}</span>
                    </span>
                  )}
                  {event.sourceLabel && (
                    <span className="mt-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Source: {event.sourceLabel}
                    </span>
                  )}
                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      !answered
                        ? 'bg-slate-100 text-slate-700'
                        : correct
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {!answered ? 'Open' : correct ? 'Protected' : 'Review'}
                  </span>
                </span>
                <span className="text-2xl font-bold text-slate-400">&gt;</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={requestReset}
          className={`mt-5 w-full rounded-2xl px-6 py-4 text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-blue-300 ${
            allComplete ? 'bg-blue-600 text-white' : 'bg-white/86 text-blue-600 shadow-sm ring-1 ring-white/70 backdrop-blur-xl'
          }`}
        >
          Start Over
        </button>
      </div>

      {resetArmed && (
        <div className="absolute inset-x-0 bottom-0 z-10 rounded-t-[1.75rem] bg-white/92 p-4 text-slate-950 shadow-[0_-10px_35px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-300" />
          <p className="text-xl font-semibold">Reset progress?</p>
          <p className="mt-2 text-base font-medium leading-6 text-slate-600">
            This clears saved answers and starts SilverShield from the beginning.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setResetArmed(false)}
              className="rounded-2xl bg-slate-100 px-4 py-4 text-base font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={resetGame}
              className="rounded-2xl bg-red-500 px-4 py-4 text-base font-semibold text-white focus:outline-none focus:ring-4 focus:ring-red-200"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
