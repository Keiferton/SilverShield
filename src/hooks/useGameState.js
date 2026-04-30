import { useState } from 'react';
import { events, getEventsByChannel, getNextEventForPersona, getNextUnansweredEventAfter } from '../data/events.js';
import { personas } from '../data/personas.js';
import { getSafetySupportLevel } from '../data/safetySupport.js';
import { calculateScore, createAnswerRecord, getAnswerRecord, isCorrectAnswer, isEventAnswered } from '../utils/scoring.js';
import { usePersistentState } from './usePersistentState.js';

export function useGameState() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [reviewEventId, setReviewEventId] = useState(null);
  const [answers, setAnswers] = usePersistentState('silvershield:answers', {});
  const [personaId, setPersonaId] = usePersistentState('silvershield:persona-id', personas[0].id);
  const [safetySupportId, setSafetySupportId] = usePersistentState('silvershield:safety-support-id', 'balanced');
  const [scenarioIndexes, setScenarioIndexes] = usePersistentState('silvershield:scenario-indexes', {});
  const [activeEventIds, setActiveEventIds] = usePersistentState('silvershield:active-event-ids', []);
  const [notificationViews, setNotificationViews] = usePersistentState('silvershield:notification-views', {});
  const selectedPersona = personas.find((persona) => persona.id === personaId) ?? personas[0];
  const safetySupport = getSafetySupportLevel(safetySupportId);
  const hasProgress = Object.keys(answers).length > 0;
  const score = calculateScore(events, answers);
  const currentChannelEvents = getEventsByChannel(currentScreen);
  const currentEvent = reviewEventId
    ? events.find((event) => event.id === reviewEventId) ?? null
    : currentChannelEvents[scenarioIndexes[currentScreen] ?? 0] ?? null;
  const completedEvents = events.filter((event) => isEventAnswered(answers, event.id));
  const protectedChoices = completedEvents.filter((event) => isCorrectAnswer(event, getAnswerRecord(answers, event.id)));
  const riskyChoices = completedEvents.filter((event) => !isCorrectAnswer(event, getAnswerRecord(answers, event.id)));
  const warningSignsMissed = score.warningSignsMissed;
  const isReviewMode = Boolean(reviewEventId);
  const nextEventForPersona = getNextEventForPersona(answers, selectedPersona.focusChannel);
  const homeNotificationIds = [
    ...new Set([
      ...activeEventIds.filter((eventId) => !isEventAnswered(answers, eventId)),
      ...(nextEventForPersona ? [nextEventForPersona.id] : []),
      ...events.filter((event) => !isEventAnswered(answers, event.id)).map((event) => event.id),
    ]),
  ].slice(0, 3);
  const homeNotifications = homeNotificationIds
    .map((eventId) => {
      const event = events.find((item) => item.id === eventId);

      if (!event) {
        return null;
      }

      const views = notificationViews[event.id] ?? 0;
      const escalated = Boolean(event.isScam && event.escalation && views >= 2);

      return {
        ...event,
        notificationTitle: escalated ? event.escalation.title : event.sender,
        notificationBody: escalated ? event.escalation.body : event.body,
        notificationTime: escalated ? 'follow-up' : views > 0 ? 'active' : 'now',
        escalated,
      };
    })
    .filter(Boolean);

  function answerEvent(eventId, optionId) {
    const event = events.find((item) => item.id === eventId);

    if (!event) {
      return;
    }

    setReviewEventId(null);
    setActiveEventIds((currentIds) => currentIds.filter((activeEventId) => activeEventId !== eventId));
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [eventId]: createAnswerRecord(event, optionId, currentAnswers[eventId]),
    }));
  }

  function selectPersona(nextPersonaId) {
    setReviewEventId(null);
    setPersonaId(nextPersonaId);
  }

  function selectSafetySupport(nextSupportId) {
    setSafetySupportId(nextSupportId);
  }

  function navigate(nextScreen) {
    setReviewEventId(null);
    setCurrentScreen(nextScreen);
  }

  function goToScenario(event, { review = false } = {}) {
    const channel = event.app ?? event.channel;
    const channelEvents = getEventsByChannel(channel);
    const eventIndex = channelEvents.findIndex((channelEvent) => channelEvent.id === event.id);

    setReviewEventId(review ? event.id : null);
    if (!review) {
      setActiveEventIds((currentIds) => [...new Set([...currentIds, event.id])]);
    }
    setScenarioIndexes((currentIndexes) => ({
      ...currentIndexes,
      [channel]: eventIndex >= 0 ? eventIndex : 0,
    }));
    setCurrentScreen(channel);
  }

  function continuePractice() {
    const activeUnresolvedEvent = activeEventIds
      .map((eventId) => events.find((event) => event.id === eventId))
      .find((event) => event && !isEventAnswered(answers, event.id));
    const nextEvent = activeUnresolvedEvent ?? getNextEventForPersona(answers, selectedPersona.focusChannel);
    const missedEvent = events.find((event) => isEventAnswered(answers, event.id) && !isCorrectAnswer(event, answers[event.id]));

    if (!nextEvent && !missedEvent) {
      setCurrentScreen('results');
      return;
    }

    goToScenario(nextEvent ?? missedEvent, { review: !nextEvent && Boolean(missedEvent) });
  }

  function openEvent(eventId) {
    const event = events.find((item) => item.id === eventId);

    if (!event) {
      continuePractice();
      return;
    }

    goToScenario(event);
  }

  function markEventHesitated(eventId) {
    if (!eventId || isEventAnswered(answers, eventId)) {
      return;
    }

    setActiveEventIds((currentIds) => [...new Set([...currentIds, eventId])]);
    setNotificationViews((currentViews) => ({
      ...currentViews,
      [eventId]: Math.max((currentViews[eventId] ?? 0) + 1, 2),
    }));
  }

  function nextScenario(channel, eventCount) {
    const currentIndex = scenarioIndexes[channel] ?? 0;
    const currentEventForChannel = getEventsByChannel(channel)[currentIndex];
    const nextEvent = getNextUnansweredEventAfter(answers, currentEventForChannel?.id);

    setReviewEventId(null);

    if (!nextEvent) {
      setCurrentScreen('results');
      return;
    }

    goToScenario(nextEvent);
  }

  function resetGame() {
    setReviewEventId(null);
    setAnswers({});
    setScenarioIndexes({});
    setActiveEventIds([]);
    setNotificationViews({});
    setCurrentScreen('home');
  }

  function recordHomeView(eventIds = []) {
    const unresolvedIds = eventIds.filter((eventId) => eventId && !isEventAnswered(answers, eventId));

    if (unresolvedIds.length === 0) {
      return;
    }

    setActiveEventIds((currentIds) => [...new Set([...currentIds, ...unresolvedIds])]);
    setNotificationViews((currentViews) => {
      const nextViews = { ...currentViews };

      unresolvedIds.forEach((eventId) => {
        nextViews[eventId] = (nextViews[eventId] ?? 0) + 1;
      });

      return nextViews;
    });
  }

  function reviewScenario(channel, index) {
    const event = getEventsByChannel(channel)[index];

    setReviewEventId(event?.id && isEventAnswered(answers, event.id) ? event.id : null);
    setScenarioIndexes((currentIndexes) => ({
      ...currentIndexes,
      [channel]: index,
    }));
    setCurrentScreen(channel);
  }

  return {
    answers,
    answerEvent,
    activeEventIds: homeNotificationIds,
    continuePractice,
    completedEvents,
    currentScreen,
    currentEvent,
    hasProgress,
    homeNotifications,
    isReviewMode,
    markEventHesitated,
    navigate,
    nextScenario,
    notificationViews,
    openEvent,
    protectedChoices,
    recordHomeView,
    riskLevel: score.riskLevel,
    riskyChoices,
    resetGame,
    reviewEventId,
    reviewScenario,
    score,
    selectPersona,
    selectSafetySupport,
    selectedPersona,
    safetySupport,
    safetySupportId,
    scenarioIndexes,
    streak: score.currentStreak,
    warningSignsMissed,
  };
}
