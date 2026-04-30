import { getOptionOutcome } from '../data/outcomes.js';
import { safeHabits } from '../data/safeHabits.js';

const difficultyPoints = {
  easy: 10,
  medium: 15,
  hard: 20,
  practice: 15,
  challenge: 20,
};

function resolveOptionId(answer) {
  if (!answer) {
    return null;
  }

  if (typeof answer === 'string') {
    return answer;
  }

  return answer.optionId ?? null;
}

function readAnswerRecord(answers = {}, eventId) {
  const answer = answers[eventId];
  const optionId = resolveOptionId(answer);

  if (!optionId) {
    return null;
  }

  if (typeof answer === 'string') {
    return {
      eventId,
      optionId,
      attempts: 1,
      firstAnsweredAt: null,
      answeredAt: null,
      legacy: true,
    };
  }

  return {
    attempts: 1,
    ...answer,
    eventId,
    optionId,
  };
}

export function getEventChoices(event) {
  return event?.choices ?? event?.options ?? [];
}

export function getCorrectChoiceId(event) {
  return event?.correctChoiceId ?? getEventChoices(event).find((option) => option.isCorrect)?.id ?? null;
}

function getAnswerTimeline(events = [], answers = {}) {
  return events
    .map((event, eventIndex) => {
      const record = readAnswerRecord(answers, event.id);

      if (!record) {
        return null;
      }

      return {
        event,
        eventIndex,
        record,
        correct: isCorrectAnswer(event, record),
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      const aTime = a.record.answeredAt ? Date.parse(a.record.answeredAt) : Number.NaN;
      const bTime = b.record.answeredAt ? Date.parse(b.record.answeredAt) : Number.NaN;

      if (Number.isFinite(aTime) && Number.isFinite(bTime) && aTime !== bTime) {
        return aTime - bTime;
      }

      return a.eventIndex - b.eventIndex;
    });
}

function getStreakStats(events = [], answers = {}) {
  const timeline = getAnswerTimeline(events, answers);
  let currentStreak = 0;
  let bestStreak = 0;
  let runningStreak = 0;

  timeline.forEach((item) => {
    if (item.correct) {
      runningStreak += 1;
      bestStreak = Math.max(bestStreak, runningStreak);
      return;
    }

    runningStreak = 0;
  });

  for (let index = timeline.length - 1; index >= 0; index -= 1) {
    if (!timeline[index].correct) {
      break;
    }

    currentStreak += 1;
  }

  return {
    bestStreak,
    currentStreak,
    latestAnsweredAt: timeline.length > 0 ? timeline[timeline.length - 1].record.answeredAt : null,
  };
}

export function getEventPoints(event) {
  return difficultyPoints[event?.difficulty] ?? difficultyPoints.easy;
}

export function getSelectedOptionId(answers = {}, eventId) {
  return readAnswerRecord(answers, eventId)?.optionId ?? null;
}

export function getAnswerRecord(answers = {}, eventId) {
  return readAnswerRecord(answers, eventId);
}

export function isEventAnswered(answers = {}, eventId) {
  return Boolean(getSelectedOptionId(answers, eventId));
}

export function getSelectedOption(event, answer) {
  const optionId = resolveOptionId(answer);

  return getEventChoices(event).find((option) => option.id === optionId) ?? null;
}

export function getMistakeRisk(event, option) {
  if (!event || option?.id === getCorrectChoiceId(event) || option?.isCorrect) {
    return 0;
  }

  if (Number.isFinite(option?.riskWeight)) {
    return option.riskWeight;
  }

  if (Number.isFinite(event.riskEffect)) {
    return event.riskEffect;
  }

  const outcome = getOptionOutcome(event.id, option?.id);

  if (Number.isFinite(outcome?.riskWeight)) {
    return outcome.riskWeight;
  }

  const privateInfoRisk = event.habitIds?.includes('protect-info') ? 2 : 0;
  const difficultyRisk = event.difficulty === 'hard' ? 2 : event.difficulty === 'medium' || event.difficulty === 'practice' ? 1 : 0;

  return 1 + privateInfoRisk + difficultyRisk;
}

export function createAnswerRecord(event, optionId, previousAnswer, now = new Date()) {
  const previousOptionId = resolveOptionId(previousAnswer);
  const previousRecord = previousOptionId
    ? {
        attempts: 1,
        ...(typeof previousAnswer === 'string' ? {} : previousAnswer),
      }
    : null;
  const selectedOption = getEventChoices(event).find((option) => option.id === optionId);
  const outcome = getOptionOutcome(event.id, optionId);
  const answeredAt = now.toISOString();
  const correct = optionId === getCorrectChoiceId(event) || Boolean(selectedOption?.isCorrect);

  return {
    eventId: event.id,
    app: event.app ?? event.channel,
    channel: event.channel ?? event.app,
    category: event.category,
    difficulty: event.difficulty,
    optionId,
    correct,
    pointsAwarded: correct ? getEventPoints(event) : 0,
    pointsPossible: getEventPoints(event),
    riskWeight: getMistakeRisk(event, selectedOption),
    protectedWeight: correct ? (event.protectedEffect ?? 1) : 0,
    warningSignsMissed: correct ? [] : event.warningSigns ?? [],
    outcomeTone: selectedOption?.outcome?.tone ?? outcome?.tone ?? (correct ? 'safe' : 'warning'),
    outcomeTitle: selectedOption?.outcome?.title ?? outcome?.title ?? null,
    attempts: (previousRecord?.attempts ?? 0) + 1,
    firstAnsweredAt: previousRecord?.firstAnsweredAt ?? previousRecord?.answeredAt ?? answeredAt,
    answeredAt,
  };
}

export function calculateScore(events = [], answers = {}) {
  const answeredEvents = events.filter((event) => isEventAnswered(answers, event.id));
  const correct = answeredEvents.filter((event) => isCorrectAnswer(event, getAnswerRecord(answers, event.id))).length;
  const riskyChoices = answeredEvents.length - correct;
  const possiblePoints = events.reduce((total, event) => total + getEventPoints(event), 0);
  const answeredPossiblePoints = answeredEvents.reduce((total, event) => total + getEventPoints(event), 0);
  const points = answeredEvents.reduce((total, event) => {
    return isCorrectAnswer(event, getAnswerRecord(answers, event.id)) ? total + getEventPoints(event) : total;
  }, 0);
  const riskScore = answeredEvents.reduce((total, event) => {
    const selectedOption = getSelectedOption(event, getAnswerRecord(answers, event.id));
    return total + getMistakeRisk(event, selectedOption);
  }, 0);
  const missedWarningSigns = [
    ...new Set(
      answeredEvents
        .filter((event) => !isCorrectAnswer(event, getAnswerRecord(answers, event.id)))
        .flatMap((event) => event.warningSigns ?? []),
    ),
  ];
  const streakStats = getStreakStats(events, answers);
  const reviewCount = riskyChoices;

  return {
    correct,
    protectedChoices: correct,
    riskyChoices,
    total: events.length,
    answered: answeredEvents.length,
    reviewCount,
    points,
    possiblePoints,
    answeredPossiblePoints,
    completionPercent: events.length > 0 ? Math.round((answeredEvents.length / events.length) * 100) : 0,
    percent: answeredEvents.length > 0 ? Math.round((correct / answeredEvents.length) * 100) : 0,
    pointsPercent: answeredPossiblePoints > 0 ? Math.round((points / answeredPossiblePoints) * 100) : 0,
    riskScore,
    riskLevel: riskScore === 0 ? 'Low' : riskScore >= 7 ? 'High' : 'Medium',
    warningSignsMissed: missedWarningSigns,
    warningSignsMissedCount: missedWarningSigns.length,
    ...streakStats,
  };
}

export function isCorrectAnswer(event, optionId) {
  const resolvedOptionId = resolveOptionId(optionId);

  return Boolean(resolvedOptionId) && resolvedOptionId === getCorrectChoiceId(event);
}

export function getChannelSummaries(events = [], answers = {}) {
  const channelIds = [...new Set(events.map((event) => event.channel))];

  return channelIds.map((channel) => {
    const channelEvents = events.filter((event) => event.channel === channel);
    const answered = channelEvents.filter((event) => isEventAnswered(answers, event.id));
    const correct = answered.filter((event) => isCorrectAnswer(event, getAnswerRecord(answers, event.id)));
    const points = answered.reduce((total, event) => {
      return isCorrectAnswer(event, getAnswerRecord(answers, event.id)) ? total + getEventPoints(event) : total;
    }, 0);
    const possiblePoints = channelEvents.reduce((total, event) => total + getEventPoints(event), 0);
    const riskScore = answered.reduce((total, event) => {
      const selectedOption = getSelectedOption(event, getAnswerRecord(answers, event.id));
      return total + getMistakeRisk(event, selectedOption);
    }, 0);

    return {
      channel,
      answered: answered.length,
      correct: correct.length,
      reviewCount: answered.length - correct.length,
      points,
      possiblePoints,
      riskScore,
      total: channelEvents.length,
      percent: answered.length > 0 ? Math.round((correct.length / answered.length) * 100) : 0,
    };
  });
}

export function getPracticeRecommendation(events = [], answers = {}) {
  const unanswered = events.find((event) => !isEventAnswered(answers, event.id));

  if (unanswered) {
    return {
      channel: unanswered.channel,
      title: 'Continue practice',
      detail: unanswered.learningGoal,
    };
  }

  const missed = getReviewEvents(events, answers)[0];

  if (missed) {
    return {
      channel: missed.channel,
      title: 'Review warning signs',
      detail: missed.learningGoal,
    };
  }

  return {
    channel: events[0]?.channel,
    title: 'Keep skills fresh',
    detail: 'Review the full set again later to keep scam warning signs familiar.',
  };
}

export function getMissedCategories(events = [], answers = {}) {
  return [...new Set(getReviewEvents(events, answers).map((event) => event.category))];
}

export function getHabitSummaries(events = [], answers = {}) {
  return safeHabits.map((habit) => {
    const habitEvents = events.filter((event) => event.habitIds?.includes(habit.id));
    const answered = habitEvents.filter((event) => isEventAnswered(answers, event.id));
    const correct = answered.filter((event) => isCorrectAnswer(event, getAnswerRecord(answers, event.id)));

    return {
      ...habit,
      answered: answered.length,
      correct: correct.length,
      reviewCount: answered.length - correct.length,
      total: habitEvents.length,
      percent: answered.length > 0 ? Math.round((correct.length / answered.length) * 100) : 0,
    };
  });
}

export function getReviewEvents(events = [], answers = {}) {
  return events.filter((event) => isEventAnswered(answers, event.id) && !isCorrectAnswer(event, getAnswerRecord(answers, event.id)));
}

export function getAnswerOutcome(event, answer) {
  const selectedOption = getSelectedOption(event, answer);

  return selectedOption?.outcome ?? getOptionOutcome(event?.id, selectedOption?.id);
}
