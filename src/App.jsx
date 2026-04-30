import PhoneShell from './components/PhoneShell.jsx';
import WelcomeScreen from './screens/WelcomeScreen.jsx';
import PersonaScreen from './screens/PersonaScreen.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import MessagesScreen from './screens/MessagesScreen.jsx';
import EmailScreen from './screens/EmailScreen.jsx';
import FacebookScreen from './screens/FacebookScreen.jsx';
import BrowserScreen from './screens/BrowserScreen.jsx';
import PhoneScreen from './screens/PhoneScreen.jsx';
import ResultsScreen from './screens/ResultsScreen.jsx';
import { useGameState } from './hooks/useGameState.js';

const screens = {
  welcome: WelcomeScreen,
  persona: PersonaScreen,
  home: HomeScreen,
  messages: MessagesScreen,
  email: EmailScreen,
  facebook: FacebookScreen,
  browser: BrowserScreen,
  phone: PhoneScreen,
  results: ResultsScreen,
};

export default function App() {
  const gameState = useGameState();
  const ActiveScreen = screens[gameState.currentScreen] ?? WelcomeScreen;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-3 py-6">
      <PhoneShell>
        <ActiveScreen {...gameState} />
      </PhoneShell>
    </main>
  );
}
