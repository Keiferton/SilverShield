import AppHeader from '../../components/AppHeader';

const posts = [
  {
    id: 1,
    author: 'Margaret Wilson',
    avatar: '👩‍🦳',
    time: '2 hours ago',
    content:
      "Lovely afternoon walk in the park today! 🌷 The daffodils are coming out beautifully.",
    image: '🌷🌿🌼',
    likes: 24,
    comments: 8,
    suspicious: false,
  },
  {
    id: 2,
    author: 'Win £1,000 Amazon Voucher!',
    avatar: '🎁',
    time: '3 hours ago',
    content:
      "SHARE THIS POST and TAG 3 FRIENDS to WIN a £1,000 Amazon gift card! Limited time only! Click here to enter ➡️",
    image: null,
    likes: 1204,
    comments: 432,
    suspicious: true,
  },
  {
    id: 3,
    author: 'Robert J.',
    avatar: '👴',
    time: '5 hours ago',
    content: 'Finally got the garden looking tidy after all that rain. Anyone else planting tomatoes this year? 🍅',
    image: '🍅🌱',
    likes: 15,
    comments: 11,
    suspicious: false,
  },
  {
    id: 4,
    author: 'Local Community Group',
    avatar: '🏘️',
    time: 'Yesterday',
    content: 'Community coffee morning this Thursday 10am–12pm at the village hall. All welcome! ☕',
    image: null,
    likes: 67,
    comments: 14,
    suspicious: false,
  },
];

export default function FacebookApp({ onBack, onEventComplete }) {
  return (
    <div className="flex flex-col h-full bg-slate-100">
      <AppHeader title="Facebook" emoji="👥" onBack={onBack} />

      <div className="flex-1 overflow-y-auto space-y-2 py-2">
        {posts.map((post) => (
          <div
            key={post.id}
            className={`bg-white mx-0 p-4 ${post.suspicious ? 'border-l-4 border-red-400' : ''}`}
          >
            {post.suspicious && (
              <div className="flex items-center gap-1.5 mb-2 text-red-600 text-xs font-semibold bg-red-50 rounded-lg px-2.5 py-1.5">
                <span>⚠️</span>
                <span>This post may be a scam — "share to win" giveaways are almost always fake</span>
              </div>
            )}
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-xl">
                {post.avatar}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{post.author}</p>
                <p className="text-xs text-slate-400">{post.time}</p>
              </div>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-2">{post.content}</p>
            {post.image && (
              <div className="text-center text-3xl py-3 bg-slate-50 rounded-xl mb-2">
                {post.image}
              </div>
            )}
            <div className="flex gap-4 text-xs text-slate-400 pt-2 border-t border-slate-100">
              <button
                className="flex items-center gap-1 hover:text-indigo-600 transition-colors focus:outline-none"
                onClick={() => onEventComplete && onEventComplete(post.id)}
              >
                👍 {post.likes}
              </button>
              <button className="flex items-center gap-1 hover:text-indigo-600 transition-colors focus:outline-none">
                💬 {post.comments}
              </button>
              <button className="flex items-center gap-1 hover:text-indigo-600 transition-colors focus:outline-none">
                ↗️ Share
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-200 bg-indigo-50">
        <p className="text-xs text-indigo-700 font-medium text-center">
          💡 Tip: "Share to win" competitions are almost always fake. Real giveaways don't work this way.
        </p>
      </div>
    </div>
  );
}
