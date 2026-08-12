import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Bookmark, Check, X, RotateCcw, BookOpen } from 'lucide-react';
import { drillByKey, type DrillQ } from '@/lib/drills';
import { useAuth } from '@/contexts/AuthContext';
import { useQuizBookmarks } from '@/lib/bookmarks';
import { toast } from '@/hooks/use-toast';
import { QuestionNavigator, type QStatus } from '@/components/QuestionNavigator';

export default function SscEnglishDrill() {
  const nav = useNavigate();
  const { drill } = useParams<{ drill: string }>();
  const meta = drillByKey(drill);
  const { user } = useAuth();
  const bm = useQuizBookmarks(user?.id, 'english', `drill_${drill}`);

  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(Math.min(20, meta?.total ?? 20));
  const [started, setStarted] = useState(false);
  const [showTheory, setShowTheory] = useState(false);
  const [qs, setQs] = useState<DrillQ[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<Record<number, number>>({});
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    setStarted(false); setQs([]); setIdx(0); setPicked({}); setOpen(null);
    setFrom(1); setTo(Math.min(20, meta?.total ?? 20));
  }, [drill, meta?.total]);
  useEffect(() => { setOpen(null); }, [idx]);

  if (!meta) {
    return (
      <div className="p-6">
        <Button variant="ghost" onClick={() => nav('/ssc/english')}><ArrowLeft className="w-4 h-4 mr-1" /> SSC English</Button>
        <p className="mt-4 text-muted-foreground">Ye practice module nahi mila.</p>
      </div>
    );
  }

  const start = () => {
    const lo = Math.max(1, Math.min(from, meta.total));
    const hi = Math.max(lo, Math.min(to, meta.total));
    setQs(meta.build(hi - lo + 1, lo, hi));
    setIdx(0); setPicked({}); setStarted(true); setShowTheory(false);
  };

  const q = qs[idx];
  const chosen = picked[idx];
  const answered = chosen !== undefined;
  const correctCount = qs.reduce((s, item, i) => s + (picked[i] === item.correctIndex ? 1 : 0), 0);
  const statuses: QStatus[] = qs.map((item, i) => {
    const p = picked[i];
    if (p === undefined) return 'unattempted';
    return p === item.correctIndex ? 'correct' : 'wrong';
  });

  async function bookmarkQuestion() {
    if (!q) return;
    const res = await bm.toggleQuestion({
      item_ref: q.id,
      subcategory: meta!.label,
      question_text: `${q.context ? q.context + '\n' : ''}${q.question}`,
      correct_text: q.options[q.correctIndex],
      meta: { options: q.options },
    });
    if (res) toast({ title: res === 'added' ? '🔖 Question bookmarked' : 'Bookmark removed', duration: 1200 });
  }

  async function bookmarkOption(text: string) {
    if (!q) return;
    const res = await bm.toggleOption({
      item_ref: q.id,
      subcategory: meta!.label,
      question_text: `${q.context ? q.context + '\n' : ''}${q.question}`,
      option_text: text,
      correct_text: q.options[q.correctIndex],
    });
    if (res) toast({ title: res === 'added' ? '🔖 Option bookmarked' : 'Bookmark removed', duration: 1200 });
  }

  const theory = (
    <div className="space-y-4">
      {meta.tables?.map((t, ti) => (
        <div key={ti} className="rounded-lg border border-emerald-100 overflow-hidden bg-white">
          {t.caption && <div className="px-3 py-2 text-sm font-semibold bg-emerald-50 text-emerald-900">{t.caption}</div>}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>{t.head.map((h) => <th key={h} className="text-left px-3 py-2 font-semibold text-slate-700 border-b">{h}</th>)}</tr>
              </thead>
              <tbody>
                {t.rows.map((r, ri) => (
                  <tr key={ri} className="odd:bg-white even:bg-slate-50/60">
                    {r.map((c, ci) => <td key={ci} className="px-3 py-2 border-b border-slate-100 align-top">{c}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      {meta.notes && (
        <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
          {meta.notes.map((n, i) => <li key={i}>{n}</li>)}
        </ul>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 sm:p-6 text-slate-900">
      <div className="max-w-5xl mx-auto space-y-5">
        <Button variant="ghost" size="sm" className="text-emerald-700 -ml-2" onClick={() => nav('/ssc/english')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> SSC English
        </Button>

        <div className="flex items-center gap-3">
          <span className="text-3xl">{meta.emoji}</span>
          <div>
            <h1 className="text-2xl font-bold">{meta.label}</h1>
            <p className="text-sm text-slate-500">{meta.blurb}</p>
          </div>
        </div>

        {!started && (
          <Card className="border-emerald-100 bg-white/80">
            <CardContent className="p-5 space-y-4">
              <div className="text-sm font-medium">Range chuno (kul {meta.total} questions)</div>
              <div className="flex items-end gap-3 flex-wrap">
                <div>
                  <div className="text-xs text-slate-500 mb-1">From</div>
                  <Input type="number" min={1} max={meta.total} value={from} className="w-24"
                    onChange={(e) => setFrom(Number(e.target.value))} />
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">To</div>
                  <Input type="number" min={1} max={meta.total} value={to} className="w-24"
                    onChange={(e) => setTo(Number(e.target.value))} />
                </div>
                <div className="flex gap-2">
                  {[20, 50, 100].filter((n) => n <= meta.total).map((n) => (
                    <Button key={n} size="sm" variant="outline" className="border-emerald-200 text-emerald-700"
                      onClick={() => { setFrom(1); setTo(n); }}>1–{n}</Button>
                  ))}
                  <Button size="sm" variant="outline" className="border-emerald-200 text-emerald-700"
                    onClick={() => { setFrom(1); setTo(meta.total); }}>All</Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="bg-emerald-600 hover:bg-emerald-500" onClick={start}>Start practice</Button>
                {(meta.tables || meta.notes) && (
                  <Button variant="outline" className="border-emerald-200 text-emerald-700" onClick={() => setShowTheory((v) => !v)}>
                    <BookOpen className="w-4 h-4 mr-1" /> {showTheory ? 'Theory chhupao' : 'Theory padho'}
                  </Button>
                )}
              </div>
              {showTheory && theory}
            </CardContent>
          </Card>
        )}

        {started && q && (
          <div className="grid lg:grid-cols-[1fr_220px] gap-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Q {idx + 1} / {qs.length}</span>
                <div className="flex items-center gap-3">
                  <Button size="sm" variant="ghost" className="text-emerald-700 h-7" onClick={() => setShowTheory((v) => !v)}>
                    <BookOpen className="w-4 h-4 mr-1" /> Theory
                  </Button>
                  <span>Score: <span className="text-emerald-700 font-semibold">{correctCount}</span></span>
                </div>
              </div>

              {showTheory && <Card className="border-emerald-100 bg-white"><CardContent className="p-4">{theory}</CardContent></Card>}

              <Card className="border-emerald-200 bg-white">
                <CardContent className="p-5 space-y-4">
                  {q.context && (
                    <div className="rounded-md bg-slate-50 border border-slate-200 p-3 text-[15px] whitespace-pre-line">{q.context}</div>
                  )}
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-lg font-semibold leading-snug">{q.question}</h2>
                    <Button size="sm" variant="ghost" className={bm.isQ(q.id) ? 'text-amber-500' : 'text-slate-400'} onClick={bookmarkQuestion}>
                      <Bookmark className="w-4 h-4" fill={bm.isQ(q.id) ? 'currentColor' : 'none'} />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {q.options.map((o, i) => {
                      const isCorrect = i === q.correctIndex;
                      const isPicked = chosen === i;
                      const isOpen = open === i;
                      const cls = !answered
                        ? 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                        : isCorrect ? 'border-emerald-400 bg-emerald-50'
                          : isPicked ? 'border-rose-300 bg-rose-50' : 'border-slate-200';
                      return (
                        <div key={i} className={`rounded-lg border transition-colors ${cls}`}>
                          <div className="flex items-center gap-2 px-3 py-2.5">
                            <button className="flex-1 text-left text-sm"
                              onClick={() => (answered ? setOpen(isOpen ? null : i) : setPicked((p) => ({ ...p, [idx]: i })))}>
                              <span className="font-semibold mr-2">{String.fromCharCode(65 + i)}.</span>{o}
                              {answered && <span className="ml-2 text-[11px] text-slate-500">{isOpen ? '▲ chhupao' : '▼ kyu?'}</span>}
                            </button>
                            {answered && isCorrect && <Check className="w-4 h-4 text-emerald-600" />}
                            {answered && isPicked && !isCorrect && <X className="w-4 h-4 text-rose-500" />}
                            <button className={bm.isO(q.id, o) ? 'text-amber-500' : 'text-slate-300 hover:text-amber-500'} onClick={() => bookmarkOption(o)}>
                              <Bookmark className="w-3.5 h-3.5" fill={bm.isO(q.id, o) ? 'currentColor' : 'none'} />
                            </button>
                          </div>
                          {answered && isOpen && (
                            <div className="px-3 pb-3 -mt-1 border-t border-slate-100 pt-2 text-sm text-slate-700 leading-relaxed">
                              {q.why[i]}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {answered && (
                    <div className="rounded-lg bg-emerald-50/70 border border-emerald-100 p-3 space-y-1.5">
                      {q.tag && <Badge className="bg-teal-100 text-teal-800 border border-teal-200">{q.tag}</Badge>}
                      <p className="text-sm text-slate-700 leading-relaxed">{q.solution}</p>
                    </div>
                  )}

                  <div className="flex justify-between pt-1">
                    <Button variant="outline" size="sm" className="border-slate-200" disabled={idx === 0} onClick={() => setIdx((i) => i - 1)}>Prev</Button>
                    {idx < qs.length - 1
                      ? <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500" onClick={() => setIdx((i) => i + 1)}>Next</Button>
                      : <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500" onClick={start}><RotateCcw className="w-4 h-4 mr-1" /> New set</Button>}
                  </div>
                </CardContent>
              </Card>
            </div>

            <QuestionNavigator
              total={qs.length}
              statuses={statuses}
              current={idx}
              bookmarked={qs.map((item) => bm.isQ(item.id))}
              onSelect={setIdx}
            />
          </div>
        )}
      </div>
    </div>
  );
}
