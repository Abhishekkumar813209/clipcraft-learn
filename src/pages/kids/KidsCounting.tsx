import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EMOJIS = ['🍎', '🐥', '🎈', '⭐', '🌸', '🐟', '🍓', '🦋', '🍭', '🌈'];

function randInt(a: number, b: number) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

function makeQuestion() {
  const count = randInt(1, 10);
  const emoji = EMOJIS[randInt(0, EMOJIS.length - 1)];
  const options = new Set<number>([count]);
  while (options.size < 4) options.add(randInt(1, 10));
  return { count, emoji, options: [...options].sort(() => Math.random() - 0.5) };
}

export default function KidsCounting() {
  const nav = useNavigate();
  const [q, setQ] = useState(() => makeQuestion());
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const items = useMemo(() => Array.from({ length: q.count }), [q]);
  const correct = picked === q.count;

  const choose = (n: number) => {
    if (picked !== null) return;
    setPicked(n);
    if (n === q.count) setScore((s) => s + 1);
  };

  const next = () => {
    setQ(makeQuestion());
    setPicked(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 via-white to-orange-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => nav('/kids')} className="text-slate-500 text-sm hover:underline">← Back</button>
          <div className="bg-white rounded-full px-4 py-2 shadow font-bold text-orange-500">⭐ {score}</div>
        </div>

        <div className="text-center mb-4">
          <h1 className="text-3xl font-black text-slate-800">How many do you see?</h1>
          <p className="text-slate-500">Count them out loud! 👉👈</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-lg ring-4 ring-yellow-200 mb-6">
          <div className="flex flex-wrap justify-center gap-3">
            {items.map((_, i) => (
              <span key={i} className="text-6xl animate-scale-in inline-block">
                {q.emoji}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {q.options.map((n) => {
            const isPicked = picked === n;
            const isRight = picked !== null && n === q.count;
            const isWrong = isPicked && n !== q.count;
            return (
              <button
                key={n}
                onClick={() => choose(n)}
                disabled={picked !== null}
                className={`h-20 rounded-3xl text-4xl font-black shadow-md transition-transform active:scale-90 ${
                  isRight
                    ? 'bg-green-400 text-white'
                    : isWrong
                    ? 'bg-red-300 text-white'
                    : 'bg-white text-slate-800 hover:scale-105'
                }`}
              >
                {n}
              </button>
            );
          })}
        </div>

        {picked !== null && (
          <div className="text-center mt-6 animate-fade-in">
            <div className="text-2xl font-black mb-3">
              {correct ? '🎉 Perfect!' : `Oops! It was ${q.count}`}
            </div>
            <button onClick={next} className="px-6 py-3 rounded-2xl bg-orange-400 text-white font-black shadow-lg">
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
