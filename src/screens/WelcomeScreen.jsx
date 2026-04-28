import Button from '../components/Button';

export default function WelcomeScreen({ onStart }) {
  return (
    <div className="flex flex-col min-h-full bg-gradient-to-b from-indigo-600 via-violet-600 to-purple-700">
      {/* Hero */}
      <div className="flex flex-col items-center justify-center flex-1 px-6 pt-10 pb-6 text-center">
        <div className="text-7xl mb-4 drop-shadow-lg select-none">🛡️</div>

        <h1 className="text-4xl font-extrabold text-white leading-tight tracking-tight mb-2">
          SilverShield
        </h1>
        <p className="text-indigo-200 text-lg font-medium mb-8">
          Stay Smart. Stay Safe.
        </p>

        <div className="bg-white/15 backdrop-blur-sm rounded-3xl p-6 mb-8 text-left max-w-xs w-full border border-white/20">
          <h2 className="text-white font-bold text-xl mb-3">What is this?</h2>
          <ul className="space-y-2.5 text-indigo-100 text-base">
            <li className="flex items-start gap-2">
              <span className="text-xl shrink-0 mt-0.5">📱</span>
              <span>A realistic phone simulation to practise spotting scams</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-xl shrink-0 mt-0.5">🎓</span>
              <span>Learn at your own pace — no wrong answers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-xl shrink-0 mt-0.5">🔒</span>
              <span>100% safe — nothing is real</span>
            </li>
          </ul>
        </div>

        <Button onClick={onStart} variant="white" className="w-full max-w-xs">
          Let's Get Started →
        </Button>

        <p className="text-indigo-300 text-sm mt-4">
          Takes about 5–10 minutes
        </p>
      </div>

      {/* Footer */}
      <div className="pb-6 px-6 text-center">
        <p className="text-indigo-400 text-xs">
          Designed for seniors · Free · No data collected
        </p>
      </div>
    </div>
  );
}
