import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Bookmark, Check, X, RotateCcw, BookOpen } from 'lucide-react';
import {
  buildPolityQuiz, buildPolityMatch, politySheet, polityCounts, polityTarget,
  type PolityQ, type PolityMatchQ, type PolityOptionInfo,
} from '@/lib/polityQuiz';
import { useAuth } from '@/contexts/AuthContext';
import { useQuizBookmarks } from '@/lib/bookmarks';
import { toast } from '@/hooks/use-toast';
import { QuestionNavigator, type QStatus } from '@/components/QuestionNavigator';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function SscPolityFactsQuiz() {
  const nav = useNavigate();
  const { sheet } = useParams<{ sheet: string }>();
  const meta = politySheet(sheet);
  const total = polityCounts[meta.key] || 0;
  const target = polityTarget(meta.key);
  const { user } = useAuth();
  const bm = useQuizBookmarks(user?.id, 'gk', `polity_${meta.key}`);

  const [mode, setMode] = useState<'mcq' | 'match'>('mcq');
  const [from, setFrom] = useState('1');
  const [to, setTo] = useState(String(total));
  const [started, setStarted] = useState(false);
  const [qs, setQs] = useState<PolityQ[]>([]);
  const [matches, setMatches] = useState<PolityMatchQ[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<Record<number, number>>({});
  const [open, setOpen] = useState<string | null>(null);
  // match state
  const [assign, setAssign] = useState<Record<number, number[]>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setStarted(false); setQs([]); setMatches([]); setIdx(0); setPicked({});
    setAssign({}); setChecked({}); setFrom('1'); setTo(String(total));
  }, [sheet, total]);
  useEffect(() => { setOpen(null); }, [idx]);

  const lo = Math.max(1, Math.min(Number(from) || 1, total));
  const hi = Math.max(lo, Math.min(Number(to) || total, total));
  const rangeCount = hi - lo + 1;
  const mcqCount = rangeCount > 4 ? rangeCount * 2 : rangeCount;
  const matchCount = Math.min(100, Math.floor(rangeCount / 5));

  const start = () => {
    setIdx(0); setPicked({}); setAssign({}); setChecked({}); setOpen(null);
    if (mode === 'mcq') {
      setMatches([]);
      setQs(buildPolityQuiz(meta.key, mcqCount, lo, hi));
    } else {
      setQs([]);
      setMatches(buildPolityMatch(meta.key, matchCount, lo, hi));
    }
    setStarted(true);
  };

  const q = qs[idx];
  const m = matches[idx];
  const chosen = picked[idx];
  const answered = chosen !== undefined;

  const correctCount = useMemo(() => {
    if (mode === 'mcq') return qs.reduce((s, item, i) => s + (picked[i] === item.correctIndex ? 1 : 0), 0);
    return matches.reduce((s, item, i) => {
      if (!checked[i]) return s;
      const a = assign[i] || [];
      return s + item.correct.reduce((c, r, li) => c + (a[li] === r ? 1 : 0), 0);
    }, 0);
  }, [mode, qs, picked, matches, assign, checked]);

  const statuses: QStatus[] = mode === 'mcq'
    ? qs.map((item, i) => {
        const p = picked[i];
        if (p === undefined) return 'unattempted';
        return p === item.correctIndex ? 'correct' : 'wrong';
      })
    : matches.map((item, i) => {
        if (!checked[i]) return 'unattempted';
        const a = assign[i] || [];
        return item.correct.every((r, li) => a[li] === r) ? 'correct' : 'wrong';
      });

  async function bookmarkQuestion() {
    if (!q) return;
    const res = await bm.toggleQuestion({
      item_ref: q.id,
      subcategory: meta.label,
      question_text: q.question,
      correct_text: q.options[q.correctIndex],
      meta: { options: q.options },
    });
    if (res) toast({ title: res === 'added' ? '🔖 Question bookmarked' : 'Bookmark removed', duration: 1200 });
  }

  async function bookmarkOption(text: string) {
    if (!q) return;
    const res = await bm.toggleOption({
      item_ref: q.id,
      subcategory: meta.label,
      question_text: q.question,
      option_text: text,
      correct_text: q.options[q.correctIndex],
    });
    if (res) toast({ title: res === 'added' ? '🔖 Option bookmarked' : 'Bookmark removed', duration: 1200 });
  }

  const InfoBlock = ({ info }: { info: PolityOptionInfo }) => (
    <div className="px-3 pb-3 -mt-1 space-y-1.5 border-t border-slate-100 pt-2">
      <div className="text-sm font-semibold text-slate-800">{info.title}</div>
      {info.detail && <p className="text-sm text-slate-600 leading-relaxed">{info.detail}</p>}
      {info.extra && <Badge className="bg-amber-100 text-amber-800 border border-amber-200">{info.extra}</Badge>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 sm:p-6 text-slate-900">
      <div className="max-w-5xl mx-auto space-y-5">
        <Button variant="ghost" size="sm" className="text-emerald-700 -ml-2" onClick={() => nav('/ssc/gk/polity/facts')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Polity Practice
        </Button>

        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{meta.emoji}</span>
            <div>
              <h1 className="text-2xl font-bold">{meta.label}</h1>
              <p className="text-sm text-slate-500">{target} MCQs · {total} facts</p>
            </div>
          </div>
          <Button variant="outline" className="border-emerald-200 text-emerald-700" onClick={() => nav(`/ssc/gk/polity/theory/${meta.key}`)}>
            <BookOpen className="w-4 h-4 mr-1" /> Theory (table)
          </Button>
        </div>

        {!started && (
          <Card className="border-emerald-100 bg-white/80">
            <CardContent className="p-5 space-y-4">
              <div>
                <div className="text-sm font-medium mb-2">Question type</div>
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" variant={mode === 'mcq' ? 'default' : 'outline'}
                    className={mode === 'mcq' ? 'bg-emerald-600 hover:bg-emerald-500' : 'border-emerald-200 text-emerald-700'}
                    onClick={() => setMode('mcq')}>MCQ</Button>
                  <Button size="sm" variant={mode === 'match' ? 'default' : 'outline'}
                    className={mode === 'match' ? 'bg-emerald-600 hover:bg-emerald-500' : 'border-emerald-200 text-emerald-700'}
                    onClick={() => setMode('match')} disabled={total < 5}>Match the column (5×5)</Button>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Range chuno (fact {1}–{total})</div>
                <div className="flex items-end gap-3 flex-wrap">
                  <div>
                    <label className="text-xs text-slate-500">From</label>
                    <Input type="text" inputMode="numeric" value={from}
                      onChange={(e) => setFrom(e.target.value.replace(/\D/g, ''))} className="w-28 bg-white" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">To</label>
                    <Input type="text" inputMode="numeric" value={to}
                      onChange={(e) => setTo(e.target.value.replace(/\D/g, ''))} className="w-28 bg-white" />
                  </div>
                  <div className="text-sm text-slate-500 pb-2">
                    {rangeCount} facts → {mode === 'mcq' ? `${mcqCount} MCQs` : `${matchCount} match sets`}
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap mt-2">
                  {[[1, 50], [51, 100], [101, 150], [1, total]].filter(([a]) => a <= total).map(([a, b]) => (
                    <Button key={`${a}-${b}`} size="sm" variant="outline" className="border-emerald-200 text-emerald-700"
                      onClick={() => { setFrom(String(a)); setTo(String(Math.min(b, total))); }}>{a}–{Math.min(b, total)}</Button>
                  ))}
                </div>
              </div>

              <Button className="bg-emerald-600 hover:bg-emerald-500" onClick={start}
                disabled={!total || (mode === 'match' && matchCount < 1)}>Start practice</Button>
            </CardContent>
          </Card>
        )}

        {started && (mode === 'mcq' ? q : m) && (
          <div className="grid lg:grid-cols-[1fr_220px] gap-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Q {idx + 1} / {mode === 'mcq' ? qs.length : matches.length}</span>
                <span>Score: <span className="text-emerald-700 font-semibold">{correctCount}</span></span>
              </div>

              {mode === 'mcq' && q && (
                <Card className="border-emerald-200 bg-white">
                  <CardContent className="p-5 space-y-4">
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
                        const info = q.optionInfo?.[i];
                        const isOpen = open === `o${i}`;
                        const cls = !answered
                          ? 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                          : isCorrect
                            ? 'border-emerald-400 bg-emerald-50'
                            : isPicked ? 'border-rose-300 bg-rose-50' : 'border-slate-200';
                        return (
                          <div key={i} className={`rounded-lg border transition-colors ${cls}`}>
                            <div className="flex items-center gap-2 px-3 py-2.5">
                              <button
                                className="flex-1 text-left text-sm"
                                onClick={() => (answered ? setOpen(isOpen ? null : `o${i}`) : setPicked((p) => ({ ...p, [idx]: i })))}
                              >
                                <span className="font-semibold mr-2">{LETTERS[i]}.</span>{o}
                                {answered && <span className="ml-2 text-[11px] text-slate-500">{isOpen ? '▲ chhupao' : '▼ ye kya hai?'}</span>}
                              </button>
                              {answered && isCorrect && <Check className="w-4 h-4 text-emerald-600" />}
                              {answered && isPicked && !isCorrect && <X className="w-4 h-4 text-rose-500" />}
                              <button className={bm.isO(q.id, o) ? 'text-amber-500' : 'text-slate-300 hover:text-amber-500'} onClick={() => bookmarkOption(o)}>
                                <Bookmark className="w-3.5 h-3.5" fill={bm.isO(q.id, o) ? 'currentColor' : 'none'} />
                              </button>
                            </div>
                            {answered && isOpen && info && <InfoBlock info={info} />}
                          </div>
                        );
                      })}
                    </div>

                    {answered && (
                      <div className="rounded-lg bg-emerald-50/70 border border-emerald-100 p-3 space-y-1.5">
                        <div className="text-sm font-medium text-emerald-900">{q.reference}</div>
                        {q.detail && <p className="text-sm text-slate-700 leading-relaxed">{q.detail}</p>}
                        {q.extra && <Badge className="bg-teal-100 text-teal-800 border border-teal-200">{q.extra}</Badge>}
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
              )}

              {mode === 'match' && m && (
                <Card className="border-emerald-200 bg-white">
                  <CardContent className="p-5 space-y-4">
                    <h2 className="text-lg font-semibold leading-snug">Match the column — sahi jodi banao</h2>

                    <div className="grid grid-cols-2 gap-2 sm:gap-4 items-start">
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-emerald-800 uppercase">Column A</div>
                        {m.left.map((l, li) => {
                          const a = assign[idx]?.[li];
                          const isRight = checked[idx] && a === m.correct[li];
                          const isOpen = open === `l${li}`;
                          return (
                            <div key={li} className={`rounded-lg border ${checked[idx] ? (isRight ? 'border-emerald-400 bg-emerald-50' : 'border-rose-300 bg-rose-50') : 'border-slate-200'}`}>
                              <div className="px-2 sm:px-3 py-2 sm:py-2.5 space-y-2">
                                <button className="text-xs sm:text-sm text-left w-full break-words" onClick={() => checked[idx] && setOpen(isOpen ? null : `l${li}`)}>
                                  <span className="font-semibold mr-2">{li + 1}.</span>{l.text}
                                  {checked[idx] && <span className="ml-2 text-[11px] text-slate-500">{isOpen ? '▲' : '▼ detail'}</span>}
                                </button>
                                <div className="flex gap-1 sm:gap-1.5 flex-wrap">
                                  {m.right.map((_, ri) => (
                                    <button
                                      key={ri}
                                      disabled={checked[idx]}
                                      onClick={() => setAssign((prev) => {
                                        const cur = [...(prev[idx] || [])];
                                        cur[li] = ri;
                                        return { ...prev, [idx]: cur };
                                      })}
                                      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md text-[11px] sm:text-xs font-semibold border transition-colors ${
                                        a === ri ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-200 text-slate-600 hover:border-emerald-300'
                                      }`}
                                    >{LETTERS[ri]}</button>
                                  ))}
                                </div>
                                {checked[idx] && !isRight && (
                                  <div className="text-[11px] sm:text-xs text-emerald-700 break-words">Sahi: {LETTERS[m.correct[li]]} — {m.right[m.correct[li]].text}</div>
                                )}
                              </div>
                              {checked[idx] && isOpen && <InfoBlock info={l} />}
                            </div>
                          );
                        })}
                      </div>

                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-emerald-800 uppercase">Column B</div>
                        {m.right.map((r, ri) => {
                          const isOpen = open === `r${ri}`;
                          return (
                            <div key={ri} className="rounded-lg border border-slate-200">
                              <button className="w-full text-left text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-2.5 break-words"
                                onClick={() => checked[idx] && setOpen(isOpen ? null : `r${ri}`)}>
                                <span className="font-semibold mr-2">{LETTERS[ri]}.</span>{r.text}
                                {checked[idx] && <span className="ml-2 text-[11px] text-slate-500">{isOpen ? '▲ chhupao' : '▼ ye kya hai?'}</span>}
                              </button>
                              {checked[idx] && isOpen && <InfoBlock info={r} />}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-1 gap-2">
                      <Button variant="outline" size="sm" className="border-slate-200" disabled={idx === 0} onClick={() => setIdx((i) => i - 1)}>Prev</Button>
                      {!checked[idx] ? (
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500"
                          disabled={(assign[idx]?.filter((x) => x !== undefined).length || 0) < m.left.length}
                          onClick={() => setChecked((c) => ({ ...c, [idx]: true }))}>Check</Button>
                      ) : idx < matches.length - 1 ? (
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500" onClick={() => setIdx((i) => i + 1)}>Next</Button>
                      ) : (
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500" onClick={start}><RotateCcw className="w-4 h-4 mr-1" /> New set</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <QuestionNavigator
              total={mode === 'mcq' ? qs.length : matches.length}
              statuses={statuses}
              current={idx}
              bookmarked={mode === 'mcq' ? qs.map((item) => bm.isQ(item.id)) : matches.map(() => false)}
              onSelect={setIdx}
            />
          </div>
        )}
      </div>
    </div>
  );
}
