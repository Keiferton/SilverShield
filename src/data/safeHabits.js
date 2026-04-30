export const safeHabits = [
  {
    id: 'pause',
    label: 'Pause first',
    description: 'Slow down before replying, clicking, paying, or sharing information.',
  },
  {
    id: 'verify',
    label: 'Verify directly',
    description: 'Use a trusted phone number, official app, or typed website address.',
  },
  {
    id: 'protect-info',
    label: 'Protect private information',
    description: 'Do not share codes, passwords, ID numbers, card PINs, or Medicare numbers.',
  },
  {
    id: 'ask-help',
    label: 'Ask for help',
    description: 'Check with a trusted person when a message or call feels urgent or scary.',
  },
];

export function getHabitById(habitId) {
  return safeHabits.find((habit) => habit.id === habitId);
}
