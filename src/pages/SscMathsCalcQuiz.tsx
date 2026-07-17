import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Timer, RefreshCw, CheckCircle2, XCircle, Play } from 'lucide-react';
import { CHAPTER_META, generateQuiz, type CalcQ } from '@/lib/calcQuiz';
import { cn } from '@/lib/utils';

export default function SscMathsCalcQuiz() {
  const nav = useNavigate();
  const { chapter = 'squares' } = useParams();
  const meta = CHAPTER_META[chapter];

  const [pool, setPool] = useState<CalcQ[]>([]);
  const [n, setN] = useState(20);
  const [started, setStarted] = useState(false);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [qElapsed, setQElapsed] = useState(0);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [done, setDone] = useState(false);
  const qStartRef = useRef<number>(Date.now());
  const totalStartRef = useRef<number>(Date.now());

  useEffect(() => { setPool(generateQuiz(chapter)); }, [chapter]);

  const active = useMemo(() => pool.slice(0, n), [pool, n]);
  const q = active[i];

  // per-question timer
  useEffect(() => {
    if (!started || done) return;
    qStartRef.current = Date.now();
    setQElapsed(0);
    const t = setInterval(() => setQElapsed(Math.floor((Date.now() - qStartRef.current) / 1000)), 250);
    return () => clearInterval(t);
  }, [i, started, done]);

  // total timer
  useEffect(() => {
    if (!started || done) return;
    const t = setInterval(() => setTotalElapsed(Math.floor((Date.now() - totalStartRef.current) / 1000)), 500);
    return () => clearInterval(t);
  }, [started, done]);

  const start = () => {
    setStarted(true);
    setDone(false);
    setI(0);
    setPicked(null);
    setCorrectCount(0);
    setWrongCount(0);
    setQElapsed(0);
    setTotalElapsed(0);
    totalStartRef.current = Date.now();
    qStartRef.current = Date.now();
  };

  const pick = (idx: number) => {
    if (picked !== null) return;
    setPicked(idx);
    if (idx === q.correct) setCorrectCount((c) => c + 1);
    else setWrongCount((c) => c + 1);
  };

  const next = () => {
    if (i + 1 >= active.length) {
      setDone(true);
      return;
    }
    setI(i + 1);
    setPicked(null);
  };

  const reshuffle = () => {
    setPool(generateQuiz(chapter));
    start();
  };

  if (!meta) return <div className="p-6">Unknown chapter.</div>;

  // ---------- START SCREEN ----------
  if (!started) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <Button variant="ghost" size="sm" onClick={() => nav('/ssc/maths/calculation')} className="text-slate-700">
          <ArrowLeft className="w-4 h-4 mr-1" />Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-3xl">{meta.icon}</span> {meta.title}
          </h1>
          <p className="text-muted-foreground mt-1">Timed MCQ drill · pool of {pool.length} questions.</p>
        </div>
        <Card className="border-primary/20">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <label className="text-sm text-slate-600">Number of questions</label>
              <input
                type="number" min={5} max={pool.length || 200}
                value={n}
                onChange={(e) => setN(Math.max(5, Math.min(Number(e.target.value) || 5, pool.length || 200)))}
                className="w-24 px-3 py-1.5 rounded-md border border-input bg-background text-sm"
              />
              <span className="text-xs text-slate-500">max {pool.length}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[10, 20, 30, 50, 100].filter((x) => x <= pool.length).map((x) => (
                <button
                  key={x}
                  onClick={() => setN(x)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs border transition',
                    n === x ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-accent',
                  )}
                >{x}</button>
              ))}
            </div>
            <Button className="w-full" onClick={start} disabled={!pool.length}>
              <Play className="w-4 h-4 mr-2" />Start Timed Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ---------- RESULT SCREEN ----------
  if (done) {
    const total = correctCount + wrongCount;
    const acc = total ? Math.round((correctCount / total) * 100) : 0;
    const avg = total ? (totalElapsed / total).toFixed(1) : '0';
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-3xl">{meta.icon}</span> Results
          </h1>
        </div>
        <Card className="border-primary/20">
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-lg bg-emerald-50">
                <div className="text-2xl font-bold text-emerald-700">{correctCount}</div>
                <div className="text-xs text-slate-600">Correct</div>
              </div>
              <div className="p-3 rounded-lg bg-red-50">
                <div className="text-2xl font-bold text-red-700">{wrongCount}</div>
                <div className="text-xs text-slate-600">Wrong</div>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <div className="text-2xl font-bold text-blue-700">{acc}%</div>
                <div className="text-xs text-slate-600">Accuracy</div>
              </div>
              <div className="p-3 rounded-lg bg-amber-50">
                <div className="text-2xl font-bold text-amber-700">{avg}s</div>
                <div className="text-xs text-slate-600">Avg / Q</div>
              </div>
            </div>
            <div className="text-center text-sm text-slate-600">Total time: <span className="font-semibold">{totalElapsed}s</span></div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={reshuffle}><RefreshCw className="w-4 h-4 mr-2" />New Set</Button>
              <Button variant="outline" className="flex-1" onClick={() => nav('/ssc/maths/calculation')}>Back to chapters</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ---------- QUIZ SCREEN ----------
  if (!q) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-4">
      {/* Header / timer strip */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => setStarted(false)} className="text-slate-700">
          <ArrowLeft className="w-4 h-4 mr-1" />Exit
        </Button>
        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1 text-slate-700"><Timer className="w-4 h-4" /> {qElapsed}s</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-600">Total {totalElapsed}s</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Q {i + 1} / {active.length}</span>
        <span>✅ {correctCount} · ❌ {wrongCount}</span>
      </div>

      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-primary transition-all" style={{ width: `${((i + (picked !== null ? 1 : 0)) / active.length) * 100}%` }} />
      </div>

      <Card className="border-primary/20">
        <CardContent className="p-6">
          <div className="text-2xl sm:text-3xl font-bold text-center py-6 text-slate-800">{q.q}</div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            {q.options.map((opt, idx) => {
              const isCorrect = idx === q.correct;
              const isPicked = picked === idx;
              return (
                <button
                  key={idx}
                  onClick={() => pick(idx)}
                  disabled={picked !== null}
                  className={cn(
                    'p-4 rounded-lg border-2 text-lg font-semibold transition-all text-center',
                    picked === null && 'border-slate-200 hover:border-primary hover:bg-primary/5',
                    picked !== null && isCorrect && 'border-emerald-500 bg-emerald-50 text-emerald-700',
                    picked !== null && isPicked && !isCorrect && 'border-red-500 bg-red-50 text-red-700',
                    picked !== null && !isCorrect && !isPicked && 'border-slate-200 opacity-60',
                  )}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {picked !== null && (
            <div className="mt-5 space-y-3">
              <div className={cn(
                'p-3 rounded-lg flex items-start gap-2 text-sm',
                picked === q.correct ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800',
              )}>
                {picked === q.correct
                  ? <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
                  : <XCircle className="w-5 h-5 mt-0.5 shrink-0" />}
                <div>
                  <div className="font-semibold">
                    {picked === q.correct ? 'Correct!' : `Correct answer: ${q.options[q.correct]}`}
                  </div>
                  {q.explain && <div className="text-slate-600 mt-0.5">{q.explain}</div>}
                </div>
              </div>
              <Button className="w-full" onClick={next}>
                {i + 1 >= active.length ? 'Finish' : 'Next question'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
