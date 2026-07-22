import { useNavigate } from 'react-router-dom';

const CARDS = [
  { path: '/kids/alphabet', emoji: '🔤', title: 'ABC Jumble', desc: 'Unscramble letters to spell the picture', bg: 'bg-pink-100', ring: 'ring-pink-300' },
  { path: '/kids/counting', emoji: '🔢', title: 'Count with Me', desc: 'Count the cute objects and tap the answer', bg: 'bg-yellow-100', ring: 'ring-yellow-300' },
  { path: '/kids/numberline', emoji: '🐸', title: 'Number Line Hop', desc: 'Hop the frog to solve addition', bg: 'bg-green-100', ring: 'ring-green-300' },
];

export default function KidsHub() {
  const nav = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-white to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 pt-6">
          <div className="text-6xl mb-3">🌈</div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-800" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", system-ui' }}>
            Kids Corner
          </h1>
          <p className="text-slate-600 mt-2 text-lg">Play. Learn. Giggle. 🎈</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {CARDS.map((c) => (
            <button
              key={c.path}
              onClick={() => nav(c.path)}
              className={`${c.bg} ring-4 ${c.ring} rounded-3xl p-6 text-left hover:scale-105 active:scale-95 transition-transform shadow-lg`}
            >
              <div className="text-6xl mb-3">{c.emoji}</div>
              <h2 className="text-xl font-bold text-slate-800">{c.title}</h2>
              <p className="text-sm text-slate-600 mt-1">{c.desc}</p>
            </button>
          ))}
        </div>
        <div className="text-center mt-10">
          <button onClick={() => nav('/')} className="text-slate-500 hover:text-slate-700 text-sm underline">
            ← Back to StudyBrain
          </button>
        </div>
      </div>
    </div>
  );
}
