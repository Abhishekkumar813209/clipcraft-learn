import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Timer, RefreshCw, CheckCircle2, XCircle, Play } from 'lucide-react';
import { CHAPTER_META, generateQuiz, type CalcQ, type Mode, type Difficulty } from '@/lib/calcQuiz';
import { cn } from '@/lib/utils';
import { QuestionNavigator, type QStatus } from '@/components/QuestionNavigator';

export default function SscMathsCalcQuiz() {
  const nav = useNavigate();
  const { chapter = 'squares' } = useParams();
  const meta = CHAPTER_META[chapter];

  // ranged config
  const [start, setStart] = useState<string>(String(meta?.defaultStart ?? 2));
  const [end,   setEnd]   = useState<string>(String(meta?.defaultEnd   ?? 20));
  const [mode, setMode] = useState<Mode>('serial');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');

  const [pool, setPool] = useState<CalcQ[]>([]);
  const [n, setN] = useState<string>('20');
  const [started, setStarted] = useState(false);
  const [i, setI] = useState(0);
  const [picksArr, setPicksArr] = useState<(number | null)[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [qElapsed, setQElapsed] = useState(0);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [done, setDone] = useState(false);
  const qStartRef = useRef<number>(Date.now());
  const totalStartRef = useRef<number>(Date.now());
  const picked = picksArr[i] ?? null;

  // regenerate pool on chapter or config change (before start)
  useEffect(() => {
    if (!meta) return;
    if (meta.kind === 'ranged') {
      const s = Math.max(meta.minAllowed ?? 1, Math.min(meta.maxAllowed ?? 100, Number(start) || (meta.defaultStart ?? 2)));
      const e = Math.max(meta.minAllowed ?? 1, Math.min(meta.maxAllowed ?? 100, Number(end) || (meta.defaultEnd ?? 20)));
      setPool(generateQuiz(chapter, { start: s, end: e, mode, difficulty }));
    } else if (chapter === 'pct-frac' || (meta.kind === 'trig' || meta.kind === 'algebra')) {
      setPool(generateQuiz(chapter, { mode }));
    } else {
      setPool(generateQuiz(chapter));
    }
  }, [chapter, start, end, mode, difficulty, meta]);

  const nNum = Math.max(1, Math.min(Number(n) || 1, pool.length || 1));
  const active = useMemo(() => pool.slice(0, nNum), [pool, nNum]);
  const q = active[i];

  useEffect(() => {
    if (!started || done) return;
    qStartRef.current = Date.now();
    setQElapsed(0);
    const t = setInterval(() => setQElapsed(Math.floor((Date.now() - qStartRef.current) / 1000)), 250);
    return () => clearInterval(t);
  }, [i, started, done]);

  useEffect(() => {
    if (!started || done) return;
    const t = setInterval(() => setTotalElapsed(Math.floor((Date.now() - totalStartRef.current) / 1000)), 500);
    return () => clearInterval(t);
  }, [started, done]);

  const start_ = () => {
    setStarted(true);
    setDone(false);
    setI(0);
    setPicksArr(new Array(nNum).fill(null));
    setCorrectCount(0);
    setWrongCount(0);
    setQElapsed(0);
    setTotalElapsed(0);
    totalStartRef.current = Date.now();
    qStartRef.current = Date.now();
  };

  const pick = (idx: number) => {
    if (picked !== null) return;
    const next = [...picksArr];
    while (next.length < active.length) next.push(null);
    next[i] = idx;
    setPicksArr(next);
    if (idx === q.correct) setCorrectCount((c) => c + 1);
    else setWrongCount((c) => c + 1);
  };

  const next = () => {
    if (i + 1 >= active.length) { setDone(true); return; }
    setI(i + 1);
  };

  const reshuffle = () => {
    if (meta?.kind === 'ranged') {
      const s = Number(start) || (meta.defaultStart ?? 2);
      const e = Number(end)   || (meta.defaultEnd   ?? 20);
      setPool(generateQuiz(chapter, { start: s, end: e, mode, difficulty }));
    } else if (chapter === 'pct-frac' || (meta?.kind === 'trig' || meta?.kind === 'algebra')) {
      setPool(generateQuiz(chapter, { mode }));
    } else {
      setPool(generateQuiz(chapter));
    }
    start_();
  };

  if (!meta) return <div className="p-6">Unknown chapter.</div>;

  const numInputCls = 'w-24 px-3 py-1.5 rounded-md border border-input bg-background text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';

  // ---------- START SCREEN ----------
  if (!started) {
    const isRanged = meta.kind === 'ranged';
    const showOrderOnly = chapter === 'pct-frac' || (meta.kind === 'trig' || meta.kind === 'algebra');
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
          <CardContent className="p-6 space-y-5">
            {isRanged && (
              <>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-slate-700">Range ({meta.minAllowed} → {meta.maxAllowed})</div>
                  <div className="flex items-center gap-3">
                    <label className="text-xs text-slate-500">Start</label>
                    <input
                      type="text" inputMode="numeric" pattern="[0-9]*"
                      value={start}
                      onChange={(e) => setStart(e.target.value.replace(/[^0-9]/g, ''))}
                      className={numInputCls}
                      placeholder={String(meta.defaultStart ?? 2)}
                    />
                    <label className="text-xs text-slate-500">End</label>
                    <input
                      type="text" inputMode="numeric" pattern="[0-9]*"
                      value={end}
                      onChange={(e) => setEnd(e.target.value.replace(/[^0-9]/g, ''))}
                      className={numInputCls}
                      placeholder={String(meta.defaultEnd ?? 20)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-slate-700">Order</div>
                  <div className="flex gap-2">
                    {(['serial', 'random'] as Mode[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => setMode(m)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-xs border transition capitalize',
                          mode === m ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-accent',
                        )}
                      >{m}</button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-slate-700">Difficulty</div>
                  <div className="flex gap-2">
                    {(['easy', 'medium'] as Difficulty[]).map((d) => (
                      <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-xs border transition capitalize',
                          difficulty === d ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-accent',
                        )}
                      >{d}</button>
                    ))}
                  </div>
                  {difficulty === 'medium' && (
                    <p className="text-xs text-amber-700 bg-amber-50 rounded-md p-2">
                      Medium: distractors share the unit-digit of the correct answer, so quick unit-digit prediction won't work.
                    </p>
            )}
                </div>
              </>
            )}

            {showOrderOnly && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-slate-700">Order</div>
                <div className="flex gap-2">
                  {(['serial', 'random'] as Mode[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-xs border transition capitalize',
                        mode === m ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-accent',
                      )}
                    >{m}</button>
                  ))}
                </div>
                <p className="text-xs text-slate-500">
                  {(meta.kind === 'trig' || meta.kind === 'algebra')
                    ? 'Serial: formula sheet ke order me. Random: shuffled.'
                    : 'Serial: 1/2 → 1/3 → 1/4 … (grouped by fraction). Random: shuffled.'}
                </p>
              </div>
            )}


            <div className="space-y-2">
              <div className="text-sm font-medium text-slate-700">Number of questions</div>
              <div className="flex items-center gap-3">
                <input
                  type="text" inputMode="numeric" pattern="[0-9]*"
                  value={n}
                  onChange={(e) => setN(e.target.value.replace(/[^0-9]/g, ''))}
                  className={numInputCls}
                />
                <span className="text-xs text-slate-500">max {pool.length}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[10, 20, 30, 50, 100].filter((x) => x <= pool.length).map((x) => (
                  <button
                    key={x}
                    onClick={() => setN(String(x))}
                    className={cn(
                      'px-3 py-1 rounded-full text-xs border transition',
                      nNum === x ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-accent',
                    )}
                  >{x}</button>
                ))}
              </div>
            </div>

            <Button className="w-full" onClick={start_} disabled={!pool.length}>
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

  const navStatuses: QStatus[] = active.map((qq, idx) => {
    const p = picksArr[idx];
    if (p == null) return 'unattempted';
    return p === qq.correct ? 'correct' : 'wrong';
  });

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-4">
      <QuestionNavigator total={active.length} current={i} statuses={navStatuses} onSelect={setI} />
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
