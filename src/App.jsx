import { useState, useCallback } from 'react';
import SmartphoneFrame from './components/SmartphoneFrame';
import WelcomeScreen from './screens/WelcomeScreen';
import PersonaIntroScreen from './screens/PersonaIntroScreen';
import PhoneHomeScreen from './screens/PhoneHomeScreen';
import ResultsScreen from './screens/ResultsScreen';
import MessagesApp from './screens/apps/MessagesApp';
import EmailApp from './screens/apps/EmailApp';
import FacebookApp from './screens/apps/FacebookApp';
import BrowserApp from './screens/apps/BrowserApp';
import PhoneApp from './screens/apps/PhoneApp';

const SCREENS = {
  WELCOME: 'welcome',
  PERSONA: 'persona',
  HOME: 'home',
  APP: 'app',
  RESULTS: 'results',
};

const appComponents = {
  messages: MessagesApp,
  email: EmailApp,
  facebook: FacebookApp,
  browser: BrowserApp,
  phone: PhoneApp,
};

const appNotifications = {
  messages: { emoji: '💬', title: 'New Message', body: 'You have new unread messages' },
  email: { emoji: '📧', title: 'New Email', body: "You've received new emails" },
  facebook: { emoji: '👥', title: 'Facebook', body: 'You have new activity' },
  browser: { emoji: '🌐', title: 'Browser', body: 'A website needs your attention' },
  phone: { emoji: '📞', title: 'Missed Call', body: 'You missed a call' },
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.WELCOME);
  const [persona, setPersona] = useState(null);
  const [activeApp, setActiveApp] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: crypto.randomUUID(), emoji: '💬', title: 'BANK ALERT', body: 'Your account has been locked. Tap to verify.' },
  ]);
  const [riskScore, setRiskScore] = useState(0);
  const [completedEvents, setCompletedEvents] = useState(0);

  const dismissNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const handleOpenApp = useCallback((appId) => {
    setActiveApp(appId);
    setScreen(SCREENS.APP);
    const notif = appNotifications[appId];
    if (notif && Math.random() > 0.5) {
      setNotifications((prev) => [
        ...prev,
        { id: crypto.randomUUID(), ...notif },
      ]);
    }
  }, []);

  const handleEventComplete = useCallback(() => {
    setCompletedEvents((prev) => prev + 1);
  }, []);

  const handlePersonaSelect = useCallback((p) => {
    setPersona(p);
    setScreen(SCREENS.HOME);
    setNotifications([
      {
        id: crypto.randomUUID(),
        emoji: '🛡️',
        title: 'Welcome to your phone!',
        body: 'Explore the apps — can you spot any scams?',
      },
    ]);
  }, []);

  const handleRestart = useCallback(() => {
    setScreen(SCREENS.WELCOME);
    setPersona(null);
    setActiveApp(null);
    setNotifications([]);
    setRiskScore(0);
    setCompletedEvents(0);
  }, []);

  const renderScreen = () => {
    switch (screen) {
      case SCREENS.WELCOME:
        return <WelcomeScreen onStart={() => setScreen(SCREENS.PERSONA)} />;

      case SCREENS.PERSONA:
        return <PersonaIntroScreen onSelect={handlePersonaSelect} />;

      case SCREENS.HOME:
        return (
          <PhoneHomeScreen
            persona={persona}
            notifications={notifications}
            onDismissNotification={dismissNotification}
            onOpenApp={handleOpenApp}
            riskScore={riskScore}
            completedEvents={completedEvents}
            onFinish={() => setScreen(SCREENS.RESULTS)}
          />
        );

      case SCREENS.APP: {
        const AppComponent = appComponents[activeApp];
        return AppComponent ? (
          <AppComponent
            onBack={() => setScreen(SCREENS.HOME)}
            onEventComplete={handleEventComplete}
          />
        ) : null;
      }

      case SCREENS.RESULTS:
        return (
          <ResultsScreen
            persona={persona}
            riskScore={riskScore}
            completedEvents={completedEvents}
            onRestart={handleRestart}
          />
        );

      default:
        return null;
    }
  };

  return <SmartphoneFrame>{renderScreen()}</SmartphoneFrame>;
}
