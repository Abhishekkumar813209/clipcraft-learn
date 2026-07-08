import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Trophy, ArrowLeft, ChevronLeft, ChevronRight, Check, X, RotateCcw, Lightbulb } from 'lucide-react';
import { fetchBBItems, buildQuestionSet, BBCategory, BBItem, BBQuestion } from '@/lib/blackBookQuiz';
import { BlackBookExplanation } from '@/components/BlackBookExplanation';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useWordHindi, lookupHindi } from '@/lib/wordHindi';

export default function BlackBookPractice() {
  const { category = 'mixed' } = useParams<{ category: BBCategory }>();
  const nav = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState<BBItem[]>([]);
  const [qs, setQs] = useState<BBQuestion[]>([]);
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<(number | null)[]>([]);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [flipAll, setFlipAll] = useState<Record<number, boolean>>({});
  const [revealed, setRevealed] = useState<Record<number, Set<number>>>({});
  const [hintShown, setHintShown] = useState<Record<number, boolean>>({});
  const wordHindi = useWordHindi();

  // Build item->meaning map. Prefer hinglish_meaning (already stored in DB) then hindi_meaning.
  const itemHindiMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const it of items) {
      const meaning = it.hinglish_meaning || it.hindi_meaning;
      if (!meaning) continue;
      if (it.prompt) m.set(it.prompt.trim().toLowerCase(), meaning);
      if (it.answer) m.set(it.answer.trim().toLowerCase(), meaning);
    }
    return m;
  }, [items]);

  function hindiForOption(opt: string): string {
    const k = opt.trim().toLowerCase();
    return itemHindiMap.get(k) || lookupHindi(wordHindi, opt) || '—';
  }

  useEffect(() => {
    (async () => {
      const data = await fetchBBItems(category as BBCategory | 'mixed');
      setItems(data);
      const built = buildQuestionSet(data, 20);
      setQs(built);
      setPicks(new Array(built.length).fill(null));
      setLoading(false);
      // create session
      if (user && built.length) {
        const { data: s } = await supabase.from('bb_practice_sessions' as never).insert({
          user_id: user.id, category, total: built.length, correct: 0,
        } as never).select('id').single();
        if (s) setSessionId((s as any).id);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const q = qs[i];
  const picked = picks[i];
  const score = picks.reduce((acc, p, idx) => acc + (p !== null && p === qs[idx]?.correct ? 1 : 0), 0);

  async function logProgress(correct: boolean) {
    if (!user || !category || category === 'mixed') return;
    const today = new Date().toISOString().slice(0, 10);
    const { data: existing } = await supabase.from('black_book_daily_progress' as never)
      .select('*').eq('user_id', user.id).eq('date', today).eq('category', category).maybeSingle();
    if (existing) {
      await supabase.from('black_book_daily_progress' as never).update({
        attempted: (existing as any).attempted + 1,
        correct: (existing as any).correct + (correct ? 1 : 0),
        updated_at: new Date().toISOString(),
      } as never).eq('id', (existing as any).id);
    } else {
      await supabase.from('black_book_daily_progress' as never).insert({
        user_id: user.id, date: today, category, target: 20, attempted: 1, correct: correct ? 1 : 0,
      } as never);
    }
  }

  async function choose(idx: number) {
    if (picked !== null) return;
    const ok = idx === q.correct;
    const nextPicks = [...picks];
    nextPicks[i] = idx;
    setPicks(nextPicks);
    logProgress(ok);
    if (user && sessionId) {
      await supabase.from('bb_practice_attempts' as never).insert({
        session_id: sessionId, user_id: user.id, item_id: q.item.id,
        category: q.category, question: q.question, options: q.options,
        correct_index: q.correct, picked_index: idx, is_correct: ok,
      } as never);
    }
  }

  async function finish() {
    if (user && sessionId) {
      const correct = picks.reduce((a, p, idx) => a + (p === qs[idx]?.correct ? 1 : 0), 0);
      await supabase.from('bb_practice_sessions' as never).update({ correct } as never).eq('id', sessionId);
    }
    setDone(true);
  }

  function next() {
    if (i + 1 >= qs.length) { finish(); return; }
    setI(i + 1);
  }
  function prev() { if (i > 0) setI(i - 1); }

  function restart() {
    const built = buildQuestionSet(items, 20);
    setQs(built);
    setPicks(new Array(built.length).fill(null));
    setI(0);
    setDone(false);
    setSessionId(null);
    if (user && built.length) {
      supabase.from('bb_practice_sessions' as never).insert({
        user_id: user.id, category, total: built.length, correct: 0,
      } as never).select('id').single().then(({ data: s }) => { if (s) setSessionId((s as any).id); });
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-emerald-50 text-slate-700"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  if (!qs.length || !q) return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 text-slate-900 flex items-center justify-center p-6">
      <Card className="bg-white border-emerald-100 shadow-sm max-w-md w-full">
        <CardContent className="p-8 text-center space-y-4">
          <h2 className="text-xl font-bold">No questions available</h2>
          <p className="text-slate-600 text-sm">Not enough items in this category to build a quiz yet.</p>
          <Button className="bg-emerald-600 hover:bg-emerald-500 text-white" onClick={() => nav('/ssc/blackbook')}>Back to hub</Button>
        </CardContent>
      </Card>
    </div>
  );

  if (done) return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 text-slate-900 p-6">
      <div className="max-w-3xl mx-auto space-y-4">
        <Card className="bg-white border-emerald-100 shadow-sm">
          <CardContent className="p-8 text-center space-y-3">
            <Trophy className="w-14 h-14 mx-auto text-amber-500" />
            <h2 className="text-2xl font-bold">Session complete!</h2>
            <div className="text-5xl font-bold text-emerald-600">{score} / {qs.length}</div>
            <div className="text-slate-500">{Math.round((score / qs.length) * 100)}% correct</div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50" onClick={() => nav('/ssc/blackbook')}>Back</Button>
              <Button variant="outline" className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50" onClick={() => nav('/ssc/blackbook/history')}>View History</Button>
              <Button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white" onClick={restart}>Play again</Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Review</h3>
          {qs.map((question, idx) => {
            const p = picks[idx];
            const ok = p === question.correct;
            return (
              <Card key={idx} className="bg-white border-emerald-100 shadow-sm">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className={`mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${ok ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {ok ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    </span>
                    <div className="flex-1">
                      <div className="text-sm text-slate-500">Q{idx + 1}</div>
                      <div className="font-medium text-slate-900">{question.question}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-8">
                    {question.options.map((opt, oi) => {
                      const isCorrect = oi === question.correct;
                      const isPicked = oi === p;
                      return (
                        <div key={oi} className={`text-sm px-2.5 py-1.5 rounded border ${
                          isCorrect ? 'border-emerald-400 bg-emerald-50 text-emerald-800' :
                          isPicked ? 'border-rose-300 bg-rose-50 text-rose-800' :
                          'border-slate-200 bg-white text-slate-600'
                        }`}>
                          <span className="font-semibold mr-1">{String.fromCharCode(65 + oi)}.</span>{opt}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 text-slate-900 p-6">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" className="text-slate-700 hover:bg-white" onClick={() => nav('/ssc/blackbook')}><ArrowLeft className="w-4 h-4 mr-1" />Back</Button>
          <div className="text-sm text-slate-500">Q {i + 1} / {qs.length} · Score <span className="text-emerald-700 font-semibold">{score}</span></div>
        </div>
        <Card
          className={`bg-white border-emerald-100 shadow-sm select-none ${flipAll[i] ? 'ring-2 ring-amber-200' : ''}`}
          onDoubleClick={() => { if (picked !== null) setFlipAll({ ...flipAll, [i]: !flipAll[i] }); }}
        >
          <CardContent className="p-6 space-y-4">
            <div className="text-lg font-medium text-slate-900 flex items-center gap-2">
              {q.question}
              {flipAll[i] && <span className="text-xs text-amber-700 font-semibold">Hindi view</span>}
            </div>
            {picked === null && q.item.category === 'idiom' && q.item.hint && (
              <div>
                {hintShown[i] ? (
                  <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm italic text-amber-800 flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
                    <span>{q.item.hint}</span>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-amber-200 text-amber-700 hover:bg-amber-50"
                    onClick={() => setHintShown({ ...hintShown, [i]: true })}
                  >
                    <Lightbulb className="w-4 h-4 mr-1" />Show hint
                  </Button>
                )}
              </div>
            )}
            <div className="space-y-2">
              {q.options.map((opt, idx) => {
                const isCorrect = q.correct === idx;
                const isPicked = picked === idx;
                const show = picked !== null;
                const isFlipped = show && (flipAll[i] || revealed[i]?.has(idx));
                const label = isFlipped ? hindiForOption(opt) : opt;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (picked === null) { choose(idx); return; }
                      const cur = new Set(revealed[i] || []);
                      if (cur.has(idx)) cur.delete(idx); else cur.add(idx);
                      setRevealed({ ...revealed, [i]: cur });
                    }}
                    className={`w-full text-left p-3 rounded-md border transition-all ${
                      show && isCorrect ? 'border-emerald-500 bg-emerald-50 text-emerald-800' :
                      show && isPicked ? 'border-rose-400 bg-rose-50 text-rose-800' :
                      'border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/60 text-slate-800'
                    } ${isFlipped ? 'italic' : ''}`}>
                    <span className="font-semibold mr-2">{String.fromCharCode(65 + idx)}.</span>{label}
                  </button>
                );
              })}
            </div>
            {picked !== null && (
              <>
                <div className="text-xs text-slate-500 flex items-center gap-1"><RotateCcw className="w-3 h-3" />Tap an option for Hindi · double-click card to flip all</div>
                <BlackBookExplanation item={q.item} />
              </>
            )}
            {picked !== null && (
              <>
                <div className="text-xs text-slate-500 flex items-center gap-1"><RotateCcw className="w-3 h-3" />Tap an option for Hindi · double-click card to flip all</div>
                <BlackBookExplanation item={q.item} />
              </>
            )}

            <div className="flex gap-2 pt-1">
              <Button variant="outline" className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50 disabled:opacity-40" onClick={prev} disabled={i === 0}>
                <ChevronLeft className="w-4 h-4 mr-1" />Previous
              </Button>
              <Button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white" onClick={next}>
                {i + 1 >= qs.length ? 'Finish' : (<>Next<ChevronRight className="w-4 h-4 ml-1" /></>)}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
