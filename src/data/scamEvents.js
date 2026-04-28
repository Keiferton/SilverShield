export const scamEvents = [
  {
    id: 'evt_01',
    app: 'messages',
    type: 'smishing',
    title: 'Suspicious Text',
    preview: 'ALERT: Your bank account has been locked...',
    isScam: true,
    riskPoints: 20,
    explanation:
      'Legitimate banks never ask you to click a link in a text message to unlock your account.',
  },
  {
    id: 'evt_02',
    app: 'email',
    type: 'phishing',
    title: 'Prize Winner Email',
    preview: "Congratulations! You've won £5,000...",
    isScam: true,
    riskPoints: 25,
    explanation:
      'If something sounds too good to be true, it usually is. This is a classic prize scam.',
  },
  {
    id: 'evt_03',
    app: 'phone',
    type: 'vishing',
    title: 'HMRC Call',
    preview: 'Caller: 0300 200 3300 — Urgent tax debt notice',
    isScam: true,
    riskPoints: 30,
    explanation:
      'HMRC will never call you unexpectedly demanding immediate payment.',
  },
  {
    id: 'evt_04',
    app: 'facebook',
    type: 'social',
    title: 'Friend Request',
    preview: 'John Smith wants to be your friend',
    isScam: false,
    riskPoints: 0,
    explanation: 'This is a genuine friend request from someone you know.',
  },
  {
    id: 'evt_05',
    app: 'browser',
    type: 'popup',
    title: 'Virus Warning',
    preview: '⚠️ Your device has a virus! Call 0800 123...',
    isScam: true,
    riskPoints: 20,
    explanation:
      'Browser pop-ups warning about viruses are almost always fake. Close the tab.',
  },
];
