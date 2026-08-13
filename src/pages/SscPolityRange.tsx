import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Shuffle, ListOrdered } from 'lucide-react';
import data from '@/data/polityRangeMcq.json';

interface RangeQ {
  no: number;
  q: string;
  options: string[];
  correct: number;
  answer: string;
  solution: string;
  why: string[];
}

const SETS: Record<string, RangeQ[]> = data as unknown as Record<string, RangeQ[]>;

const MODES = [
  {
    key: 'random',
    icon: '🎲',
    title: 'Randomly mixed',
    desc: 'Parts aur article ranges bilkul shuffled order me — recall test.',
  },
  {
    key: 'serial',
    icon: '🔢',
    title: 'Partially random (serial)',
    desc: 'Part I se aage serial chain me — order yaad karne ke liye.',
  },
];

export function SscPolityRangeHub() {
  const nav = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 sm:p-6 text-slate-900">
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="ghost" size="sm" className="text-emerald-700 -ml-2" onClick={() => nav('/ssc/gk/polity/facts')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Polity Practice
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><span className="text-3xl">📐</span> Article Range → Part Mapping</h1>
          <p className="text-sm text-slate-500 mt-1">Kaun sa Part kis article range ko cover karta hai — 200 MCQs, har option ka reason.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MODES.map((m) => (
            <Card key={m.key} className="cursor-pointer border-emerald-100 hover:border-emerald-300 hover:shadow-md transition-all bg-white/80"
              onClick={() => nav(`/ssc/gk/polity/range/${m.key}`)}>
              <CardContent className="p-5">
                <div className="text-3xl mb-2">{m.icon}</div>
                <h3 className="font-semibold">{m.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{m.desc}</p>
                <p className="text-xs text-emerald-700 mt-2 font-medium">{SETS[m.key].length} MCQs</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SscPolityRangeQuiz() {
  const nav = useNavigate();
  const { mode } = useParams();
  const key = mode === 'serial' ? 'serial' : 'random';
  const all = SETS[key];
  const meta = MODES.find((m) => m.key === key)!;

  const [started, setStarted] = useState(false);
  const [from, setFrom] = useState('1');
  const [to, setTo] = useState(String(all.length));
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<(number | null)[]>([]);
  const [openWhy, setOpenWhy] = useState<Record<string, boolean>>({});

  const queue = useMemo(() => {
    const f = Math.max(1, Number(from) || 1);
    const t = Math.min(all.length, Number(to) || all.length);
    return all.slice(f - 1, t);
  }, [from, to, all]);

  function start() {
    setPicked(new Array(queue.length).fill(null));
    setIdx(0);
    setOpenWhy({});
    setStarted(true);
  }

  const q = queue[idx];
  const answer = picked[idx];
  const score = picked.filter((p, i) => p !== null && p === queue[i]?.correct).length;

  if (!started) {
    return (
      <div className="p-4 sm:p-6 max-w-xl mx-auto space-y-4">
        <Button variant="ghost" size="sm" onClick={() => nav('/ssc/gk/polity/range')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <Card>
          <CardContent className="p-5 space-y-4">
            <div>
              <h1 className="text-lg font-bold flex items-center gap-2">
                {key === 'random' ? <Shuffle className="w-4 h-4" /> : <ListOrdered className="w-4 h-4" />} {meta.title}
              </h1>
              <p className="text-xs text-muted-foreground mt-1">{all.length} questions available · serial wise fetch</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm">From
                <input value={from} onChange={(e) => setFrom(e.target.value)} inputMode="numeric" className="mt-1 w-full border rounded-md px-3 py-2 text-sm" />
              </label>
              <label className="text-sm">To
                <input value={to} onChange={(e) => setTo(e.target.value)} inputMode="numeric" className="mt-1 w-full border rounded-md px-3 py-2 text-sm" />
              </label>
            </div>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-500" disabled={!queue.length} onClick={start}>
              Start Quiz ({queue.length})
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!q) return <div className="p-6 text-sm">Koi question nahi mila.</div>;

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => nav('/ssc/gk/polity/range')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Modes
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setStarted(false)}>Setup</Button>
        </div>
        <span className="text-sm text-muted-foreground">Score {score}/{queue.length}</span>
      </div>

      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="text-xs text-muted-foreground">Q{idx + 1} / {queue.length} · serial {q.no} · {meta.title}</div>
          <p className="font-medium leading-relaxed">{q.q}</p>

          <div className="space-y-2">
            {q.options.map((text, i) => {
              const isCorrect = i === q.correct;
              const isPicked = answer === i;
              let cls = 'border-border hover:border-emerald-300';
              if (answer !== null && answer !== undefined) {
                if (isCorrect) cls = 'border-emerald-400 bg-emerald-50';
                else if (isPicked) cls = 'border-rose-400 bg-rose-50';
              }
              const isOpen = !!openWhy[`${idx}-${i}`];
              return (
                <div key={i}>
                  <button
                    onClick={() => {
                      if (answer === null || answer === undefined) {
                        setPicked((p) => p.map((v, j) => (j === idx ? i : v)));
                      } else {
                        setOpenWhy((m) => ({ ...m, [`${idx}-${i}`]: !m[`${idx}-${i}`] }));
                      }
                    }}
                    className={`w-full text-left border rounded-md px-3 py-2 text-sm transition ${cls}`}
                  >
                    <span className="font-semibold uppercase mr-2">{'abcd'[i]}.</span>{text}
                  </button>
                  {answer !== null && answer !== undefined && isOpen && (
                    <div className={`mt-1 ml-4 text-xs leading-relaxed rounded-md p-2.5 border ${
                      isCorrect ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}>
                      {q.why[i] || 'Reason available nahi hai.'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {answer !== null && answer !== undefined && (
            <>
              <p className="text-[11px] text-muted-foreground">Kisi bhi option pe tap karo → wo option kyu sahi / galat tha.</p>
              <div className="rounded-md bg-slate-50 border p-3 text-sm space-y-1">
                <div className="font-semibold text-emerald-700">Correct: {'ABCD'[q.correct]} · {q.answer}</div>
                <p className="text-slate-700 leading-relaxed">{q.solution}</p>
              </div>
            </>
          )}

          <div className="flex justify-between pt-1">
            <Button variant="outline" size="sm" disabled={idx === 0} onClick={() => setIdx((i) => i - 1)}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Prev
            </Button>
            <Button size="sm" disabled={idx >= queue.length - 1} onClick={() => setIdx((i) => i + 1)}>
              Next <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
