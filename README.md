# 🛡️ SilverShield

> A mobile-first scam awareness simulation game designed to help seniors recognise and avoid scams through an interactive smartphone simulation.

## ✨ Features

- 📱 **Smartphone simulation** — a realistic phone UI rendered inside a centred phone frame on desktop
- 👩‍🦳 **Persona system** — choose one of three characters to play as
- 🔔 **Notification banner** — dismissible, auto-expiring alerts
- 📲 **Five app screens** — Messages, Email, Facebook, Browser, and Phone — each with realistic scam scenarios
- 🏆 **Results screen** — score, rating, and educational takeaways
- ♿ **Accessible design** — large text, high contrast, keyboard-navigable

## 🗂️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AppHeader.jsx    # Back button + title bar for app screens
│   ├── AppIcon.jsx      # Home screen app icon with badge
│   ├── Button.jsx       # Styled button with variants
│   ├── NotificationBanner.jsx  # Dismissible notification overlay
│   └── SmartphoneFrame.jsx     # Centred phone frame wrapper
├── data/                # Static game data
│   ├── appIcons.js      # App icon definitions
│   ├── personas.js      # Playable character definitions
│   └── scamEvents.js    # Scam scenario data
├── screens/             # Top-level screens
│   ├── apps/            # Individual app screens
│   │   ├── BrowserApp.jsx
│   │   ├── EmailApp.jsx
│   │   ├── FacebookApp.jsx
│   │   ├── MessagesApp.jsx
│   │   └── PhoneApp.jsx
│   ├── PersonaIntroScreen.jsx
│   ├── PhoneHomeScreen.jsx
│   ├── ResultsScreen.jsx
│   └── WelcomeScreen.jsx
├── App.jsx              # Root component — state & navigation
├── index.css            # Tailwind CSS entry point
└── main.jsx             # React DOM entry point
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm 9 or later

### Installation

```bash
# Clone the repository
git clone https://github.com/Keiferton/SilverShield.git
cd SilverShield

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview   # preview the production build locally
```

### Linting

```bash
npm run lint
```

## 🛠️ Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| [Vite](https://vite.dev/) | 8 | Build tool & dev server |
| [React](https://react.dev/) | 19 | UI framework |
| [Tailwind CSS](https://tailwindcss.com/) | 4 | Utility-first styling |

## 🧭 Navigation Flow

```
Welcome → Persona Selection → Phone Home → App Screens → Results
```

State is managed entirely with React's `useState` hook in `App.jsx` — no external state library required.

## 🔮 Roadmap (not yet implemented)

- [ ] Full scam event logic (risk score based on user choices)
- [ ] Animated scam reveal explanations
- [ ] Streak / achievements system
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] i18n / language support
- [ ] Backend for saving scores

## 📄 License

MIT — free to use, share, and adapt.
