const sources = {
  ftc: {
    label: 'FTC consumer guidance',
    url: 'https://consumer.ftc.gov/articles/how-avoid-scam',
  },
  ic3: {
    label: 'FBI IC3 reporting',
    url: 'https://www.ic3.gov/',
  },
  usaGov: {
    label: 'USA.gov scam guidance',
    url: 'https://www.usa.gov/scams-and-fraud',
  },
  ssaOig: {
    label: 'Social Security OIG scam alerts',
    url: 'https://oig.ssa.gov/scam-awareness/scam-alert/',
  },
};

const scenarioData = [
  {
    id: 'msg-bank-freeze',
    app: 'messages',
    category: 'Bank impersonation',
    difficulty: 'easy',
    habitIds: ['pause', 'verify', 'protect-info'],
    isScam: true,
    learningGoal: 'Verify urgent account warnings through a trusted phone number or official app.',
    pausePhrase: 'I will not use a surprise link to check my account.',
    title: 'Text from your bank',
    sender: 'First Town Bank',
    senderDetail: 'Short code 37268',
    body: 'First Town Bank Alert: We noticed a sign-in from a new device. To avoid a temporary hold, review your account at ftb-alerts.example/secure within 30 minutes.',
    linkPreviewTitle: 'First Town Bank Secure Review',
    linkPreviewSubtitle: 'ftb-alerts.example',
    question: 'What is the safest next step?',
    choices: [
      {
        id: 'tap-link',
        nativeAction: 'open_link',
        label: 'Tap the link right away',
        appLabel: 'Open Link',
        outcome: {
          tone: 'danger',
          title: 'The link opens a fake bank page',
          detail: 'A look-alike page could ask for your password, card PIN, or one-time code.',
          nextStep: 'Close it and contact the bank through the number on your card or official app.',
        },
      },
      {
        id: 'call-bank',
        nativeAction: 'call_bank',
        nativeActionAliases: ['block_sender', 'report_junk'],
        label: 'Call the bank using the number on your card',
        appLabel: 'Call Bank',
        outcome: {
          tone: 'safe',
          title: 'You verify through a trusted channel',
          detail: 'Using a known number avoids the surprise link and lets the real bank confirm whether anything is wrong.',
          nextStep: 'Use trusted numbers, official apps, or typed web addresses for account questions.',
        },
      },
      {
        id: 'reply',
        nativeAction: 'reply',
        label: 'Reply asking if the alert is real',
        appLabel: 'Reply',
        outcome: {
          tone: 'warning',
          title: 'The sender learns you are engaged',
          detail: 'Replying can invite more pressure and follow-up requests for private information.',
          nextStep: 'Do not reply to unexpected account warnings. Verify directly instead.',
        },
      },
    ],
    correctChoiceId: 'call-bank',
    explanation: 'Urgent account warnings can be real, but surprise links are risky. Verify through a phone number or app you already trust.',
    warningSigns: ['Urgent deadline', 'Unexpected link', 'Account hold threat'],
    sourceLabel: sources.ftc.label,
    sourceUrl: sources.ftc.url,
    riskEffect: 4,
    protectedEffect: 1,
    trustedAction: 'Call the bank using the number on your card or open the official banking app.',
    escalation: {
      title: 'Second bank alert',
      body: 'Follow-up: The account hold is now marked urgent. The sender is still pushing the same surprise link instead of asking you to use the official app.',
    },
  },
  {
    id: 'msg-neighbor-ride',
    app: 'messages',
    category: 'Legitimate message',
    difficulty: 'easy',
    habitIds: ['pause'],
    isScam: false,
    learningGoal: 'Notice when a message has normal context and no pressure for money or private information.',
    pausePhrase: 'I will look for pressure, payment, links, and private information requests.',
    title: 'Text from a neighbor',
    sender: 'Mary Next Door',
    senderDetail: 'Saved contact',
    body: 'Hi, this is Mary. Are you still able to drive me to the clinic at 2:00 today? No rush, just confirming before I call for a ride.',
    question: 'What is the best response?',
    choices: [
      {
        id: 'reply-confirm',
        nativeAction: 'reply',
        label: 'Reply normally because this is a saved contact with no money or private info request',
        appLabel: 'Reply',
        outcome: {
          tone: 'safe',
          title: 'You recognize a low-risk message',
          detail: 'The message is from a saved contact, has normal context, and does not ask for payment, passwords, codes, or ID numbers.',
          nextStep: 'It is still fine to call if anything feels unusual.',
        },
      },
      {
        id: 'send-card',
        nativeAction: 'send_gift_cards',
        label: 'Offer to buy a gift card just in case',
        appLabel: 'Offer Gift Card',
        outcome: {
          tone: 'warning',
          title: 'That adds risk to a normal message',
          detail: 'Gift cards are not part of the request. Introducing payment can create confusion or exposure.',
          nextStep: 'Keep the reply limited to the actual appointment question.',
        },
      },
      {
        id: 'report-junk',
        nativeAction: 'report_junk',
        nativeActionAliases: ['block_sender'],
        label: 'Report the saved contact as junk immediately',
        appLabel: 'Report Junk',
        outcome: {
          tone: 'warning',
          title: 'This may block a legitimate helper',
          detail: 'Over-reporting can hide useful messages. The safer skill is checking for real warning signs.',
          nextStep: 'Use reporting when there is pressure, fraud, links, or private information requests.',
        },
      },
    ],
    correctChoiceId: 'reply-confirm',
    explanation: 'Not every unexpected message is a scam. This one has a saved contact, clear context, and no request for money or private information.',
    warningSigns: ['No urgency', 'No payment request', 'Saved contact'],
    sourceLabel: sources.usaGov.label,
    sourceUrl: sources.usaGov.url,
    riskEffect: 1,
    protectedEffect: 1,
    trustedAction: 'Reply normally or call Mary if you want to confirm by voice.',
  },
  {
    id: 'email-ssa-statement',
    app: 'email',
    category: 'Government impersonation',
    difficulty: 'medium',
    habitIds: ['pause', 'verify', 'protect-info'],
    isScam: true,
    learningGoal: 'Avoid fake government emails that push links or attachments for Social Security information.',
    pausePhrase: 'I will go to the official .gov site myself.',
    title: 'Social Security statement ready',
    sender: 'SSA Statement Center',
    fromAddress: 'statement-access@ssa-secure.example',
    body: 'Your annual Social Security statement is ready. Open the attached secure viewer and confirm your Social Security number to prevent a hold on future benefits.',
    assetLabel: 'SSA_Statement_Viewer.html',
    question: 'What should you do?',
    choices: [
      {
        id: 'open-viewer',
        nativeAction: 'open_attachment',
        label: 'Open the attached viewer',
        appLabel: 'Open Viewer',
        outcome: {
          tone: 'danger',
          title: 'The attachment could steal identity details',
          detail: 'A fake viewer can collect Social Security numbers, passwords, or other identity information.',
          nextStep: 'Delete the email and visit the official Social Security site yourself if you want to check.',
        },
      },
      {
        id: 'type-gov-site',
        nativeAction: 'type_gov_site',
        nativeActionAliases: ['delete_email'],
        label: 'Leave the email and type the official .gov address yourself',
        appLabel: 'Type .gov Site',
        outcome: {
          tone: 'safe',
          title: 'You avoid the fake path',
          detail: 'Typing the official address keeps you away from links and attachments controlled by the sender.',
          nextStep: 'Use official .gov websites or known phone numbers for benefit questions.',
        },
      },
      {
        id: 'reply-ssn',
        nativeAction: 'reply',
        label: 'Reply with your Social Security number',
        appLabel: 'Reply SSN',
        outcome: {
          tone: 'danger',
          title: 'Private identity information is exposed',
          detail: 'A Social Security number can be used for identity theft and account fraud.',
          nextStep: 'Never send SSNs in response to unexpected email.',
        },
      },
    ],
    correctChoiceId: 'type-gov-site',
    explanation: 'Government impersonation emails often look official. Avoid attachments and links; go to the official site yourself.',
    warningSigns: ['Non-.gov sender', 'Attachment', 'Social Security number request'],
    sourceLabel: sources.ssaOig.label,
    sourceUrl: sources.ssaOig.url,
    riskEffect: 5,
    protectedEffect: 1,
    trustedAction: 'Type the official .gov address yourself or use a known phone number.',
    escalation: {
      title: 'SSA statement reminder',
      body: 'Follow-up: The email says access will expire soon and again asks you to open the attachment. The sender is still not a .gov address.',
    },
  },
  {
    id: 'email-prize-fee',
    app: 'email',
    category: 'Fake prize',
    difficulty: 'easy',
    habitIds: ['pause', 'verify'],
    isScam: true,
    learningGoal: 'Recognize prize scams that ask for a fee before release.',
    pausePhrase: 'Real prizes do not need me to pay first.',
    title: 'Action needed: $500 customer reward',
    sender: 'Rewards Center',
    fromAddress: 'claim@reward-center.example',
    body: 'Hello, your loyalty reward is reserved under your email. A $3.95 processing payment is required today before the card can be released.',
    assetLabel: 'Claim_Reward_Form.html',
    question: 'What should you do?',
    choices: [
      {
        id: 'pay-fee',
        nativeAction: 'open_link',
        label: 'Pay the fee to receive the card',
        appLabel: 'Pay Fee',
        outcome: {
          tone: 'danger',
          title: 'The payment starts an advance-fee scam',
          detail: 'After the small fee, scammers may ask for more money or capture card details.',
          nextStep: 'Do not pay surprise fees to claim prizes or rewards.',
        },
      },
      {
        id: 'delete-email',
        nativeAction: 'delete_email',
        label: 'Delete the email and do not pay',
        appLabel: 'Delete',
        outcome: {
          tone: 'safe',
          title: 'You stop the scam before it starts',
          detail: 'Deleting the message avoids the fee and the fake claim form.',
          nextStep: 'If unsure, check the company account or official site directly.',
        },
      },
      {
        id: 'forward-friends',
        nativeAction: 'forward_email',
        label: 'Forward it to friends',
        appLabel: 'Forward',
        outcome: {
          tone: 'warning',
          title: 'The scam spreads to other people',
          detail: 'Forwarding the offer can make it look more trustworthy to friends and family.',
          nextStep: 'Do not forward suspicious offers. Delete them or report spam.',
        },
      },
    ],
    correctChoiceId: 'delete-email',
    explanation: 'Prize and reward scams often ask for small fees or payment details first. That is a warning sign.',
    warningSigns: ['Unexpected reward', 'Processing fee', 'Same-day pressure'],
    sourceLabel: sources.ftc.label,
    sourceUrl: sources.ftc.url,
    riskEffect: 3,
    protectedEffect: 1,
    trustedAction: 'Delete the email and do not pay any fee.',
    escalation: {
      title: 'Reward deadline',
      body: 'Follow-up: The reward center says the prize expires today unless you pay the fee. The pressure is increasing.',
    },
  },
  {
    id: 'facebook-grandchild-emergency',
    app: 'facebook',
    category: 'Family impersonation',
    difficulty: 'medium',
    habitIds: ['pause', 'verify', 'ask-help'],
    isScam: true,
    learningGoal: 'Slow down when a family message asks for secrecy, money, or gift cards.',
    pausePhrase: 'I will verify with family before sending money or gift cards.',
    title: 'Message from a family member',
    sender: 'New profile: Alex',
    senderDetail: 'Message request',
    body: 'Grandma it is Alex. I dropped my phone and this is my temporary account. I am embarrassed, please do not tell anyone. Can you send gift cards for the repair?',
    question: 'What is the safest response?',
    choices: [
      {
        id: 'send-gift-cards',
        nativeAction: 'send_gift_cards',
        label: 'Buy gift cards immediately',
        appLabel: 'Send Gift Cards',
        outcome: {
          tone: 'danger',
          title: 'Gift cards are hard to recover',
          detail: 'Once card numbers are sent, scammers can drain them quickly and ask for more.',
          nextStep: 'Stop and call a known family number before sending money or cards.',
        },
      },
      {
        id: 'call-family',
        nativeAction: 'call_family',
        nativeActionAliases: ['report_profile'],
        label: 'Call a known family number to verify',
        appLabel: 'Call Family',
        outcome: {
          tone: 'safe',
          title: 'You break the secrecy pressure',
          detail: 'Calling a known family number checks the story outside the new profile.',
          nextStep: 'Verify urgent family requests outside the message thread.',
        },
      },
      {
        id: 'keep-secret',
        nativeAction: 'message_profile',
        nativeActionAliases: ['view_profile'],
        label: 'Keep it secret and continue messaging',
        appLabel: 'Keep Secret',
        outcome: {
          tone: 'warning',
          title: 'Secrecy helps the scammer isolate you',
          detail: 'Scammers use secrecy so nobody else can question the story.',
          nextStep: 'Talk to a trusted family member before acting.',
        },
      },
    ],
    correctChoiceId: 'call-family',
    explanation: 'Family impersonators often use new profiles, secrecy, and gift cards. Verify with a known number before sending anything.',
    warningSigns: ['New profile', 'Gift card request', 'Secrecy pressure'],
    sourceLabel: sources.ftc.label,
    sourceUrl: sources.ftc.url,
    riskEffect: 4,
    protectedEffect: 1,
    trustedAction: 'Call a known family number before sending money or cards.',
    escalation: {
      title: 'Alex is asking again',
      body: 'Follow-up: The new profile says the repair shop is closing soon and asks you not to call anyone else.',
    },
  },
  {
    id: 'browser-virus-popup',
    app: 'browser',
    category: 'Fake tech support',
    difficulty: 'medium',
    habitIds: ['pause', 'ask-help'],
    isScam: true,
    learningGoal: 'Recognize scare popups that push support calls or downloads.',
    pausePhrase: 'I will close the page and ask someone I trust.',
    title: 'Browser security popup',
    sender: 'System Alert',
    url: 'security-warning.example',
    body: 'Threat scan found 12 serious issues. Call certified support within 5 minutes or your files may be deleted.',
    question: 'What should you do?',
    choices: [
      {
        id: 'call-popup-number',
        nativeAction: 'call_number',
        label: 'Call the number on the popup',
        appLabel: 'Call Number',
        outcome: {
          tone: 'danger',
          title: 'The fake support agent gains trust',
          detail: 'The caller may request payment, passwords, or remote access to your device.',
          nextStep: 'Close the tab and ask a trusted helper if the warning returns.',
        },
      },
      {
        id: 'close-tab',
        nativeAction: 'close_tab',
        label: 'Close the page and ask a trusted helper',
        appLabel: 'Close Tab',
        outcome: {
          tone: 'safe',
          title: 'You shut down the scare tactic',
          detail: 'Closing the page removes the pressure and avoids the fake support number.',
          nextStep: 'If popups continue, ask a trusted helper to check the browser.',
        },
      },
      {
        id: 'download-cleaner',
        nativeAction: 'download_cleaner',
        label: 'Download the recommended cleaner',
        appLabel: 'Download Cleaner',
        outcome: {
          tone: 'danger',
          title: 'The download could install malware',
          detail: 'Fake cleaner apps can steal information, show more alerts, or demand payment.',
          nextStep: 'Do not install software from popups. Close the page.',
        },
      },
    ],
    correctChoiceId: 'close-tab',
    explanation: 'Fake support popups use fear and countdowns to push calls or downloads. Close the page instead.',
    warningSigns: ['Scary countdown', 'Unknown support number', 'Download request'],
    sourceLabel: sources.ic3.label,
    sourceUrl: sources.ic3.url,
    riskEffect: 4,
    protectedEffect: 1,
    trustedAction: 'Close the page and ask a trusted helper if the warning returns.',
    escalation: {
      title: 'Security warning still open',
      body: 'Follow-up: The browser alert is still demanding a call and says files may be deleted if you wait.',
    },
  },
  {
    id: 'browser-official-report-page',
    app: 'browser',
    category: 'Legitimate safety resource',
    difficulty: 'medium',
    habitIds: ['pause', 'verify'],
    isScam: false,
    learningGoal: 'Recognize official reporting resources by checking the domain and purpose.',
    pausePhrase: 'I will check the address before trusting a page.',
    title: 'Official scam reporting page',
    sender: 'USA.gov',
    url: 'usa.gov/where-report-scams',
    siteTitle: 'USA.gov',
    body: 'You are reading an official page that helps people find where to report a scam. The address uses usa.gov and does not ask for bank logins or gift cards.',
    question: 'What is the best next step?',
    choices: [
      {
        id: 'continue-reading',
        nativeAction: 'continue_reading',
        nativeActionAliases: ['type_gov_site'],
        label: 'Continue only if the address is the official .gov page',
        appLabel: 'Continue',
        outcome: {
          tone: 'safe',
          title: 'You check the address before trusting it',
          detail: 'A .gov address and a clear reporting purpose are positive signs, especially when the page does not ask for payment.',
          nextStep: 'Use official reporting pages when you need help after a scam attempt.',
        },
      },
      {
        id: 'call-ad-number',
        nativeAction: 'call_number',
        label: 'Call a support number from a pop-up ad instead',
        appLabel: 'Call Ad',
        outcome: {
          tone: 'warning',
          title: 'The ad could lead away from the official resource',
          detail: 'Ads and popups can impersonate help pages or charge for free reporting guidance.',
          nextStep: 'Stay on the official .gov page or type the address yourself.',
        },
      },
      {
        id: 'enter-bank-login',
        nativeAction: 'enter_login',
        label: 'Enter your bank login to prove the scam happened',
        appLabel: 'Enter Login',
        outcome: {
          tone: 'danger',
          title: 'Bank credentials should not be entered here',
          detail: 'Reporting pages should not need your bank password or card PIN.',
          nextStep: 'Never enter financial passwords on a page that is not your bank.',
        },
      },
    ],
    correctChoiceId: 'continue-reading',
    explanation: 'Official reporting pages can be useful. Check the domain and avoid ads, popups, or requests for financial passwords.',
    warningSigns: ['Official .gov address', 'No payment request', 'No password request'],
    sourceLabel: sources.usaGov.label,
    sourceUrl: 'https://www.usa.gov/where-report-scams',
    riskEffect: 2,
    protectedEffect: 1,
    trustedAction: 'Stay on the official .gov page or type the address yourself.',
  },
  {
    id: 'phone-medicare-benefits',
    app: 'phone',
    category: 'Benefits impersonation',
    difficulty: 'hard',
    habitIds: ['pause', 'verify', 'protect-info'],
    isScam: true,
    learningGoal: 'Protect medical and identity numbers on unexpected calls.',
    pausePhrase: 'I will hang up and call the official number.',
    title: 'Unexpected Medicare call',
    sender: 'Caller ID: Health Office',
    callerDetail: 'Unknown number',
    body: 'This is the health office calling about your benefits. We need your Medicare number today to keep coverage active.',
    question: 'What is the safest next step?',
    choices: [
      {
        id: 'share-medicare-number',
        nativeAction: 'share_private_info',
        label: 'Share your Medicare number',
        appLabel: 'Share Number',
        outcome: {
          tone: 'danger',
          title: 'The caller gets a valuable identity number',
          detail: 'Medicare numbers can be used for medical identity theft or fraudulent benefits claims.',
          nextStep: 'Hang up and call the official number on your card or paperwork.',
        },
      },
      {
        id: 'hang-up-call-official',
        nativeAction: 'end_call',
        nativeActionAliases: ['call_official', 'call_back'],
        label: 'Hang up and call the official number',
        appLabel: 'End Call',
        outcome: {
          tone: 'safe',
          title: 'You end the pressure safely',
          detail: 'Hanging up stops the caller from pushing for private information.',
          nextStep: 'Call the official number if you want to confirm the benefit question.',
        },
      },
      {
        id: 'confirm-birthday',
        nativeAction: 'confirm_info',
        label: 'Confirm your birthday first',
        appLabel: 'Confirm Info',
        outcome: {
          tone: 'danger',
          title: 'The caller collects identity details',
          detail: 'Even partial information like a birthday can help scammers pass security checks.',
          nextStep: 'Do not confirm private details on unexpected calls.',
        },
      },
    ],
    correctChoiceId: 'hang-up-call-official',
    explanation: 'Do not share Medicare or identity numbers on an unexpected call. Hang up and verify through an official number.',
    warningSigns: ['Unexpected call', 'Benefits threat', 'Private number request'],
    sourceLabel: sources.ftc.label,
    sourceUrl: sources.ftc.url,
    riskEffect: 5,
    protectedEffect: 1,
    trustedAction: 'Hang up and call the official number on your card or paperwork.',
    escalation: {
      title: 'Missed call: Health Office',
      body: 'Follow-up: The caller left another message saying benefits may stop unless you provide your Medicare number today.',
    },
  },
].map((event) => ({
  ...event,
  channel: event.app,
  source: {
    label: event.sourceLabel,
    url: event.sourceUrl,
  },
  options: event.choices.map((choice) => ({
    ...choice,
    isCorrect: choice.id === event.correctChoiceId,
    riskWeight: choice.id === event.correctChoiceId ? 0 : event.riskEffect,
  })),
}));

export const events = scenarioData;

function resolveAnswerId(answer) {
  if (!answer) {
    return null;
  }

  return typeof answer === 'string' ? answer : answer.optionId;
}

export function getEventsByChannel(channel) {
  return events.filter((event) => event.app === channel || event.channel === channel);
}

export function getEventNumber(eventId) {
  const index = events.findIndex((event) => event.id === eventId);

  return index >= 0 ? index + 1 : 0;
}

export function getNextEventForPersona(answers = {}, focusChannel) {
  const focusEvent = getEventsByChannel(focusChannel).find((event) => !resolveAnswerId(answers[event.id]));

  return focusEvent ?? events.find((event) => !resolveAnswerId(answers[event.id])) ?? null;
}

export function getNextUnansweredEventAfter(answers = {}, eventId) {
  const startIndex = Math.max(events.findIndex((event) => event.id === eventId), 0);
  const orderedEvents = [...events.slice(startIndex + 1), ...events.slice(0, startIndex + 1)];

  return orderedEvents.find((event) => !resolveAnswerId(answers[event.id])) ?? null;
}

export function getUpcomingEventsForPersona(answers = {}, focusChannel, limit = 3) {
  const nextEvent = getNextEventForPersona(answers, focusChannel);
  const remainingEvents = events.filter((event) => !resolveAnswerId(answers[event.id]) && event.id !== nextEvent?.id);

  return [nextEvent, ...remainingEvents].filter(Boolean).slice(0, limit);
}
