export const optionOutcomes = {};

export function getOptionOutcome(eventId, optionId) {
  return optionOutcomes[eventId]?.[optionId] ?? null;
}
