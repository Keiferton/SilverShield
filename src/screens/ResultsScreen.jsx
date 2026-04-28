import Button from '../components/Button';

function getRating(riskScore) {
  if (riskScore === 0) return { label: 'Perfect!', emoji: '🏆', color: 'text-emerald-600', bg: 'from-emerald-400 to-teal-500', message: "You didn't fall for any scams. Outstanding awareness!" };
  if (riskScore <= 20) return { label: 'Excellent', emoji: '🥇', color: 'text-emerald-600', bg: 'from-emerald-400 to-green-500', message: 'You showed great caution and spotted most scams.' };
  if (riskScore <= 40) return { label: 'Good', emoji: '🥈', color: 'text-blue-600', bg: 'from-blue-400 to-indigo-500', message: "Good effort! A couple of scams slipped through — keep practising." };
  if (riskScore <= 70) return { label: 'Be Careful', emoji: '⚠️', color: 'text-amber-600', bg: 'from-amber-400 to-orange-500', message: 'You were caught by several scam tactics. Review the tips below.' };
  return { label: 'At Risk', emoji: '🚨', color: 'text-red-600', bg: 'from-red-400 to-rose-600', message: "Many scams fooled you this time, but now you know what to look for!" };
}

const tips = [
  { emoji: '📱', tip: 'Banks and HMRC will never text or call you asking to click a link or pay immediately.' },
  { emoji: '📧', tip: "Check sender email addresses carefully — scammers use lookalike addresses (e.g. paypa1 instead of paypal)." },
  { emoji: '🏆', tip: '"Share to win" competitions on social media are almost always scams.' },
  { emoji: '🌐', tip: 'Browser pop-ups warning of viruses are fake. Close the tab — never call the number.' },
  { emoji: '📞', tip: "If in doubt, hang up and call the organisation back using a number from their official website." },
];

export default function ResultsScreen({ persona, riskScore, completedEvents, onRestart }) {
  const rating = getRating(riskScore);

  return (
    <div className="flex flex-col min-h-full bg-gradient-to-b from-slate-50 to-indigo-50">
      {/* Header */}
      <div className={`bg-gradient-to-br ${rating.bg} px-5 pt-8 pb-8 text-center text-white`}>
        <div className="text-6xl mb-3">{rating.emoji}</div>
        <h1 className="text-2xl font-extrabold mb-1">Simulation Complete!</h1>
        <p className="text-white/80 text-base mb-4">
          Well done, {persona.photo} {persona.name}!
        </p>

        {/* Score card */}
        <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-5 mx-2">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-3xl font-extrabold">{riskScore}</div>
              <div className="text-white/70 text-xs mt-0.5">Risk Score</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold">{completedEvents}</div>
              <div className="text-white/70 text-xs mt-0.5">Events Explored</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold">{rating.label}</div>
              <div className="text-white/70 text-xs mt-0.5">Rating</div>
            </div>
          </div>
          <p className="text-white/90 text-sm mt-4 leading-relaxed">{rating.message}</p>
        </div>
      </div>

      {/* Tips */}
      <div className="px-4 py-5">
        <h2 className="text-slate-700 font-bold text-lg mb-3">Key Reminders</h2>
        <div className="space-y-2.5">
          {tips.map((t, i) => (
            <div
              key={i}
              className="flex items-start gap-3 bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
            >
              <span className="text-2xl shrink-0">{t.emoji}</span>
              <p className="text-slate-600 text-sm leading-relaxed">{t.tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pb-8 pt-2 space-y-3">
        <Button onClick={onRestart} variant="primary" className="w-full">
          🔄 Play Again
        </Button>
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-center">
          <p className="text-indigo-700 text-sm font-medium">
            📢 Share this tool with someone who might find it helpful!
          </p>
        </div>
      </div>
    </div>
  );
}
