import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function randInt(a: number, b: number) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

type Problem = { a: number; b: number };

// 50 problems: mix of 1-digit + 1-digit and 1-digit + 2-digit
function buildProblems(): Problem[] {
  const list: Problem[] = [];
  for (let i = 0; i < 25; i++) list.push({ a: randInt(1, 9), b: randInt(1, 9) });
  for (let i = 0; i < 25; i++) {
    // 1-digit + 2-digit (keep answers <= 99 for the number line)
    const a = randInt(1, 9);
    const b = randInt(10, 90 - a);
    list.push({ a, b });
  }
  return list.sort(() => Math.random() - 0.5);
}

export default function KidsNumberLine() {
  const nav = useNavigate();
  const [problems] = useState<Problem[]>(buildProblems);
  const [idx, setIdx] = useState(0);
  const [pos, setPos] = useState(problems[0].a);
  const [hops, setHops] = useState(0);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const cur = problems[idx];
  const target = cur.a + cur.b;
  const max = Math.max(20, target + 3);
  const cells = useMemo(() => Array.from({ length: max + 1 }, (_, i) => i), [max]);

  useEffect(() => {
    // scroll frog into view
    const el = scrollRef.current?.querySelector<HTMLDivElement>(`[data-cell="${pos}"]`);
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [pos]);

  const hop = () => {
    if (done) return;
    if (hops >= cur.b) return;
    setPos((p) => p + 1);
    setHops((h) => {
      const nh = h + 1;
      if (nh === cur.b) {
        setDone(true);
        setScore((s) => s + 1);
      }
      return nh;
    });
  };

  const hopBack = () => {
    if (done || hops === 0) return;
    setPos((p) => p - 1);
    setHops((h) => h - 1);
  };

  const next = () => {
    const n = (idx + 1) % problems.length;
    setIdx(n);
    setPos(problems[n].a);
    setHops(0);
    setDone(false);
  };

  const reset = () => {
    setPos(cur.a);
    setHops(0);
    setDone(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 via-white to-sky-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => nav('/kids')} className="text-slate-500 text-sm hover:underline">← Back</button>
          <div className="text-slate-500 text-sm">Problem {idx + 1} / {problems.length}</div>
          <div className="bg-white rounded-full px-4 py-2 shadow font-bold text-green-500">⭐ {score}</div>
        </div>

        <div className="text-center mb-4">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800">
            <span className="text-sky-500">{cur.a}</span> + <span className="text-pink-500">{cur.b}</span> = ?
          </h1>
          <p className="text-slate-500 mt-1">
            Froggy is at <b>{cur.a}</b>. Hop <b>{cur.b}</b> steps forward! 🐸
          </p>
          <p className="text-slate-400 text-sm">Hops taken: {hops} / {cur.b}</p>
        </div>

        {/* Number line */}
        <div
          ref={scrollRef}
          className="bg-white rounded-3xl p-4 shadow-lg ring-4 ring-green-200 overflow-x-auto"
        >
          <div className="flex items-end gap-1 min-w-max px-2 pb-2">
            {cells.map((n) => {
              const isFrog = n === pos;
              const isStart = n === cur.a;
              const isTarget = done && n === target;
              return (
                <div key={n} data-cell={n} className="flex flex-col items-center w-12 shrink-0">
                  <div className="h-16 flex items-end justify-center">
                    {isFrog && (
                      <span className="text-4xl transition-all animate-scale-in">🐸</span>
                    )}
                    {!isFrog && isStart && <span className="text-2xl opacity-40">📍</span>}
                    {!isFrog && isTarget && <span className="text-2xl">🎯</span>}
                  </div>
                  <div
                    className={`w-full h-3 rounded-sm ${
                      n === 0 ? 'bg-slate-400' : n % 5 === 0 ? 'bg-slate-300' : 'bg-slate-200'
                    }`}
                  />
                  <div
                    className={`text-xs font-bold mt-1 ${
                      isFrog ? 'text-green-600' : n % 5 === 0 ? 'text-slate-700' : 'text-slate-400'
                    }`}
                  >
                    {n}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3 mt-6 flex-wrap">
          <button
            onClick={hopBack}
            disabled={hops === 0 || done}
            className="px-5 py-4 rounded-2xl bg-white border-2 border-slate-200 font-bold text-slate-600 disabled:opacity-40"
          >
            ← Undo
          </button>
          <button
            onClick={hop}
            disabled={done}
            className="px-8 py-4 rounded-2xl bg-green-400 text-white text-xl font-black shadow-lg active:scale-95 disabled:opacity-40"
          >
            🐸 Hop +1
          </button>
          <button
            onClick={reset}
            className="px-5 py-4 rounded-2xl bg-white border-2 border-slate-200 font-bold text-slate-600"
          >
            🔄 Reset
          </button>
        </div>

        {done && (
          <div className="text-center mt-6 animate-fade-in">
            <div className="text-3xl font-black text-green-600 mb-3">
              🎉 {cur.a} + {cur.b} = {target}!
            </div>
            <button
              onClick={next}
              className="px-8 py-3 rounded-2xl bg-sky-400 text-white font-black shadow-lg"
            >
              Next problem →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
