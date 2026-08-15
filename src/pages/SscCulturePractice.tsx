import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import data from '@/data/sscCultureMcq.json';

interface CultureQ {
  no: number;
  exam?: string;
  q: string;
  options: string[];
  correct: number;
  answer: string;
  solution: string;
  why: string[];
}

const SETS = data as unknown as Record<string, CultureQ[]>;

const META: Record<string, { emoji: string; label: string; blurb: string }> = {
  dance: { emoji: '💃', label: 'Indian Dance', blurb: 'Classical & folk dances — gharana, state, exponents' },
  festivals: { emoji: '🎉', label: 'Indian Festivals', blurb: 'Festivals, state & significance — PYQ based' },
};

export default function SscCulturePractice() {
  const nav = useNavigate();
  const { topic } = useParams();
  const key = topic === 'festivals' ? 'festivals' : 'dance';
  const meta = META[key];
  const all = SETS[key] || [];

  const [started, setStarted] = useState(false);
  const [from, setFrom] = useState('1');
  const [to, setTo] = useState(String(all.length));
  const [order, setOrder] = useState<'serial' | 'random'>('serial');
  const [seed, setSeed] = useState(0);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<(number | null)[]>([]);
  const [openWhy, setOpenWhy] = useState<Record<string, boolean>>({});

  const queue = useMemo(() => {
    const f = Math.max(1, Number(from) || 1);
    const t = Math.min(all.length, Number(to) || all.length);
    const slice = all.slice(f - 1, t);
    if (order === 'random') {
      const arr = [...slice];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }
    return slice;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, all, order, seed]);

  function start() {
    setSeed((s) => s + 1);
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 sm:p-6 text-slate-900">
        <div className="max-w-xl mx-auto space-y-4">
          <Button variant="ghost" size="sm" className="text-emerald-700 -ml-2" onClick={() => nav('/ssc/gk')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> GK / GS
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{meta.emoji}</span>
            <div>
              <h1 className="text-2xl font-bold">{meta.label}</h1>
              <p className="text-sm text-slate-500">{meta.blurb} · {all.length} MCQs</p>
            </div>
          </div>
          <Card className="bg-white/80 border-emerald-100">
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <label className="text-sm">From
                  <input value={from} onChange={(e) => setFrom(e.target.value.replace(/[^0-9]/g, ''))} inputMode="numeric" className="mt-1 w-full border rounded-md px-3 py-2 text-sm" />
                </label>
                <label className="text-sm">To
                  <input value={to} onChange={(e) => setTo(e.target.value.replace(/[^0-9]/g, ''))} inputMode="numeric" className="mt-1 w-full border rounded-md px-3 py-2 text-sm" />
                </label>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-medium">Order:</span>
                {(['serial', 'random'] as const).map((o) => (
                  <button key={o} onClick={() => setOrder(o)}
                    className={`px-2 py-1 rounded border ${order === o ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-emerald-200 text-emerald-700'}`}>{o}</button>
                ))}
              </div>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-500" disabled={!queue.length} onClick={start}>
                Start Quiz ({queue.length})
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!q) return <div className="p-6 text-sm">Koi question nahi mila.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 sm:p-6 text-slate-900">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => nav('/ssc/gk')}>
              <ArrowLeft className="w-4 h-4 mr-1" /> GK
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setStarted(false)}>Setup</Button>
          </div>
          <span className="text-sm text-muted-foreground">Score {score}/{queue.length}</span>
        </div>

        <Card className="bg-white/85 border-emerald-100">
          <CardContent className="p-5 space-y-4">
            <div className="text-xs text-muted-foreground">
              Q{idx + 1} / {queue.length} · serial {q.no}{q.exam ? ` · ${q.exam}` : ''}
            </div>
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
                        {q.why?.[i] || 'Reason available nahi hai.'}
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
    </div>
  );
}
