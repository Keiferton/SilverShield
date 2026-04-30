export const safetySupportLevels = [
  {
    id: 'independent',
    label: 'Independent',
    description: 'No proactive prompts. Feedback stays brief and the final report carries most of the coaching.',
  },
  {
    id: 'balanced',
    label: 'Balanced',
    description: 'Occasional hints, coaching after risky actions, and moderate interruptions.',
  },
  {
    id: 'guided',
    label: 'Guided',
    description: 'Proactive prompts, visible explanations, and frequent assistance while practicing.',
  },
];

export function getSafetySupportLevel(levelId) {
  return safetySupportLevels.find((level) => level.id === levelId) ?? safetySupportLevels[1];
}
