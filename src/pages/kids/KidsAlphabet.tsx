import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WORDS: { letter: string; word: string; emoji: string }[] = [
  { letter: 'A', word: 'APPLE', emoji: '🍎' },
  { letter: 'B', word: 'BALL', emoji: '⚽' },
  { letter: 'C', word: 'CAT', emoji: '🐱' },
  { letter: 'D', word: 'DOG', emoji: '🐶' },
  { letter: 'E', word: 'ELEPHANT', emoji: '🐘' },
  { letter: 'F', word: 'FISH', emoji: '🐟' },
  { letter: 'G', word: 'GRAPE', emoji: '🍇' },
  { letter: 'H', word: 'HAT', emoji: '🎩' },
  { letter: 'I', word: 'IGLOO', emoji: '🛖' },
  { letter: 'J', word: 'JUICE', emoji: '🧃' },
  { letter: 'K', word: 'KITE', emoji: '🪁' },
  { letter: 'L', word: 'LION', emoji: '🦁' },
  { letter: 'M', word: 'MANGO', emoji: '🥭' },
  { letter: 'N', word: 'NEST', emoji: '🪺' },
  { letter: 'O', word: 'ORANGE', emoji: '🍊' },
  { letter: 'P', word: 'PIG', emoji: '🐷' },
  { letter: 'Q', word: 'QUEEN', emoji: '👸' },
  { letter: 'R', word: 'RABBIT', emoji: '🐰' },
  { letter: 'S', word: 'SUN', emoji: '☀️' },
  { letter: 'T', word: 'TIGER', emoji: '🐯' },
  { letter: 'U', word: 'UMBRELLA', emoji: '☂️' },
  { letter: 'V', word: 'VAN', emoji: '🚐' },
  { letter: 'W', word: 'WHALE', emoji: '🐳' },
  { letter: 'X', word: 'XRAY', emoji: '🩻' },
  { letter: 'Y', word: 'YAK', emoji: '🐃' },
  { letter: 'Z', word: 'ZEBRA', emoji: '🦓' },
];

function shuffle(s: string): string {
  const arr = s.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const out = arr.join('');
  return out === s ? shuffle(s) : out;
}

export default function KidsAlphabet() {
  const nav = useNavigate();
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number[]>([]);
  const [won, setWon] = useState(false);

  const current = WORDS[idx];
  const jumbled = useMemo(() => shuffle(current.word).split(''), [idx]);
  const built = picked.map((i) => jumbled[i]).join('');

  const pick = (i: number) => {
    if (picked.includes(i) || won) return;
    const next = [...picked, i];
    setPicked(next);
    const attempt = next.map((k) => jumbled[k]).join('');
    if (attempt.length === current.word.length) {
      if (attempt === current.word) setWon(true);
      else setTimeout(() => setPicked([]), 700);
    }
  };

  const undoSlot = (slotIndex: number) => {
    if (won) return;
    const letter = built[slotIndex];
    if (!letter) return;
    // Find which picked index produced this slot letter
    const pickedIndex = picked[slotIndex];
    const next = picked.filter((_, i) => i !== slotIndex);
    setPicked(next);
  };

  const nextWord = () => {
    setPicked([]);
    setWon(false);
    setIdx((idx + 1) % WORDS.length);
  };

  const reset = () => setPicked([]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 via-white to-yellow-50 p-6">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => nav('/kids')} className="text-slate-500 mb-4 text-sm hover:underline">← Back</button>

        <div className="text-center mb-6">
          <div className="text-9xl mb-2">{current.emoji}</div>
          <p className="text-slate-500 text-lg">Letter <span className="font-black text-3xl text-pink-500">{current.letter}</span> is for…</p>
          <p className="text-slate-400 text-sm">Tap the letters in the right order!</p>
        </div>

        {/* Slots */}
        <div className="flex justify-center gap-2 flex-wrap mb-6">
          {current.word.split('').map((_, i) => (
            <div
              key={i}
              className={`w-14 h-14 rounded-2xl border-4 flex items-center justify-center text-2xl font-black ${
                built[i]
                  ? won
                    ? 'bg-green-200 border-green-400 text-green-800'
                    : 'bg-pink-200 border-pink-400 text-pink-800'
                  : 'bg-white border-dashed border-slate-300'
              }`}
            >
              {built[i] || ''}
            </div>
          ))}
        </div>

        {/* Letter bank */}
        <div className="flex justify-center gap-3 flex-wrap mb-8">
          {jumbled.map((l, i) => {
            const used = picked.includes(i);
            return (
              <button
                key={i}
                onClick={() => pick(i)}
                disabled={used}
                className={`w-14 h-14 rounded-2xl text-2xl font-black shadow-md transition-transform active:scale-90 ${
                  used ? 'bg-slate-100 text-slate-300' : 'bg-yellow-300 text-slate-800 hover:scale-110'
                }`}
              >
                {l}
              </button>
            );
          })}
        </div>

        <div className="flex justify-center gap-3">
          <button onClick={reset} className="px-5 py-3 rounded-2xl bg-white border-2 border-slate-200 font-bold text-slate-600">
            🔄 Try again
          </button>
          {won && (
            <button onClick={nextWord} className="px-6 py-3 rounded-2xl bg-green-400 font-black text-white shadow-lg animate-scale-in">
              🎉 Next word →
            </button>
          )}
        </div>

        {won && (
          <div className="text-center mt-6 text-2xl font-black text-green-600 animate-fade-in">
            Yay! You spelled {current.word}! ⭐
          </div>
        )}
      </div>
    </div>
  );
}
