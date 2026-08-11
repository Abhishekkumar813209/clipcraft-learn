import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Bookmark, Check, X, RotateCcw } from 'lucide-react';
import { buildPolityQuiz, politySheet, polityCounts, type PolityQ } from '@/lib/polityQuiz';
import { useAuth } from '@/contexts/AuthContext';
import { useQuizBookmarks } from '@/lib/bookmarks';
import { toast } from '@/hooks/use-toast';
import { QuestionNavigator, type QStatus } from '@/components/QuestionNavigator';

const SIZES = [10, 20, 30, 50];

export default function SscPolityFactsQuiz() {
  const nav = useNavigate();
  const { sheet } = useParams<{ sheet: string }>();
  const meta = politySheet(sheet);
  const total = polityCounts[meta.key] || 0;
  const { user } = useAuth();
  const bm = useQuizBookmarks(user?.id, 'gk', `polity_${meta.key}`);

  const [size, setSize] = useState(20);
  const [started, setStarted] = useState(false);
  const [qs, setQs] = useState<PolityQ[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<Record<number, number>>({});

  useEffect(() => { setStarted(false); setQs([]); setIdx(0); setPicked({}); }, [sheet]);

  const start = () => {
    setQs(buildPolityQuiz(meta.key, size));
    setIdx(0); setPicked({}); setStarted(true);
  };

  const q = qs[idx];
  const chosen = picked[idx];
  const answered = chosen !== undefined;
  const correctCount = useMemo(
    () => qs.reduce((s, item, i) => s + (picked[i] === item.correctIndex ? 1 : 0), 0),
    [qs, picked],
  );

  const statuses: QStatus[] = qs.map((item, i) => {
    const p = picked[i];
    if (p === undefined) return 'unattempted';
    return p === item.correctIndex ? 'correct' : 'wrong';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 sm:p-6 text-slate-900">
      <div className="max-w-5xl mx-auto space-y-5">
        <Button variant="ghost" size="sm" className="text-emerald-700 -ml-2" onClick={() => nav('/ssc/gk/polity/facts')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Polity Practice
        </Button>

        <div className="flex items-center gap-3">
          <span className="text-3xl">{meta.emoji}</span>
          <div>
            <h1 className="text-2xl font-bold">{meta.label}</h1>
            <p className="text-sm text-slate-500">{total} facts · fact-recall MCQs</p>
          </div>
        </div>

        {!started && (
          <Card className="border-emerald-100 bg-white/80">
            <CardContent className="p-5 space-y-4">
              <div>
                <div className="text-sm font-medium mb-2">Kitne questions?</div>
                <div className="flex gap-2 flex-wrap">
                  {SIZES.filter((s) => s <= Math.max(total, 10)).map((s) => (
                    <Button key={s} size="sm" variant={size === s ? 'default' : 'outline'}
                      className={size === s ? 'bg-emerald-600 hover:bg-emerald-500' : 'border-emerald-200 text-emerald-700'}
                      onClick={() => setSize(s)}>{s}</Button>
                  ))}
                </div>
              </div>
              <Button className="bg-emerald-600 hover:bg-emerald-500" onClick={start} disabled={!total}>Start practice</Button>
            </CardContent>
          </Card>
        )}

        {started && q && (
          <div className="grid lg:grid-cols-[1fr_220px] gap-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Q {idx + 1} / {qs.length}</span>
                <span>Score: <span className="text-emerald-700 font-semibold">{correctCount}</span></span>
              </div>

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
                      const cls = !answered
                        ? 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                        : isCorrect
                          ? 'border-emerald-400 bg-emerald-50'
                          : isPicked ? 'border-rose-300 bg-rose-50' : 'border-slate-200 opacity-70';
                      return (
                        <div key={i} className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 transition-colors ${cls}`}>
                          <button className="flex-1 text-left text-sm" onClick={() => !answered && setPicked((p) => ({ ...p, [idx]: i }))}>
                            <span className="font-semibold mr-2">{String.fromCharCode(65 + i)}.</span>{o}
                          </button>
                          {answered && isCorrect && <Check className="w-4 h-4 text-emerald-600" />}
                          {answered && isPicked && !isCorrect && <X className="w-4 h-4 text-rose-500" />}
                          <button className={bm.isO(q.id, o) ? 'text-amber-500' : 'text-slate-300 hover:text-amber-500'} onClick={() => bookmarkOption(o)}>
                            <Bookmark className="w-3.5 h-3.5" fill={bm.isO(q.id, o) ? 'currentColor' : 'none'} />
                          </button>
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
