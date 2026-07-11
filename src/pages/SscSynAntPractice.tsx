import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Trophy, ArrowLeft, ChevronLeft, ChevronRight, Check, X, Lightbulb } from 'lucide-react';
import { fetchSAItems, buildSAQuestionSet, SAMode, SASub, SAQuestion, SAItem } from '@/lib/synAntQuiz';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export default function SscSynAntPractice() {
  const [sp] = useSearchParams();
  const mode = (sp.get('mode') || 'mixed') as SAMode;
  const sub = (sp.get('sub') || 'top_100') as SASub;
  const n = Number(sp.get('n')) || 20;
  const nav = useNavigate();
  const { user } = useAuth();

  const [qs, setQs] = useState<SAQuestion[]>([]);
  const [items, setItems] = useState<SAItem[]>([]);
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<(number | null)[]>([]);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hint, setHint] = useState<Record<number, boolean>>({});

  useEffect(() => {
    (async () => {
      const data = await fetchSAItems(mode, sub);
      setItems(data);
      const built = buildSAQuestionSet(data, n);
      setQs(built);
      setPicks(new Array(built.length).fill(null));
      setLoading(false);
    })();
  }, [mode, sub, n]);

  const q = qs[i];
  const picked = picks[i];
  const score = picks.reduce((a, p, idx) => a + (p !== null && p === qs[idx]?.correct ? 1 : 0), 0);

  async function logProgress(correct: boolean) {
    if (!user) return;
    const today = new Date().toISOString().slice(0, 10);
    const cat = 'syn_ant';
    const { data: existing } = await supabase.from('black_book_daily_progress' as never)
      .select('*').eq('user_id', user.id).eq('date', today).eq('category', cat).maybeSingle();
    if (existing) {
      await supabase.from('black_book_daily_progress' as never).update({
        attempted: (existing as any).attempted + 1,
        correct: (existing as any).correct + (correct ? 1 : 0),
        updated_at: new Date().toISOString(),
      } as never).eq('id', (existing as any).id);
    } else {
      await supabase.from('black_book_daily_progress' as never).insert({
        user_id: user.id, date: today, category: cat, target: 100, attempted: 1, correct: correct ? 1 : 0,
      } as never);
    }
  }

  function choose(idx: number) {
    if (picked !== null) return;
    const ok = idx === q.correct;
    const next = [...picks]; next[i] = idx; setPicks(next);
    logProgress(ok);
  }

  function nextQ() {
    if (i + 1 >= qs.length) { setDone(true); return; }
    setI(i + 1);
  }

  function restart() {
    const built = buildSAQuestionSet(items, n);
    setQs(built); setPicks(new Array(built.length).fill(null));
    setI(0); setDone(false); setHint({});
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-emerald-50"><Loader2 className="w-6 h-6 animate-spin text-emerald-600" /></div>;

  if (!q) return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-6">
      <Card className="max-w-md w-full border-emerald-100">
        <CardContent className="p-8 text-center space-y-4">
          <h2 className="text-xl font-bold">No questions available</h2>
          <Button className="bg-emerald-600 hover:bg-emerald-500 text-white" onClick={() => nav('/ssc/english/synant')}>Back</Button>
        </CardContent>
      </Card>
    </div>
  );

  if (done) return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6">
      <div className="max-w-3xl mx-auto space-y-4">
        <Card className="border-emerald-100">
          <CardContent className="p-8 text-center space-y-3">
            <Trophy className="w-14 h-14 mx-auto text-amber-500" />
            <h2 className="text-2xl font-bold">Session complete!</h2>
            <div className="text-5xl font-bold text-emerald-600">{score} / {qs.length}</div>
            <div className="text-slate-500">{Math.round((score / qs.length) * 100)}% correct</div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50" onClick={() => nav('/ssc/english/synant')}>Back</Button>
              <Button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white" onClick={restart}>Play again</Button>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-3">
          {qs.map((qu, idx) => {
            const p = picks[idx]; const ok = p === qu.correct;
            return (
              <Card key={idx} className="border-emerald-100">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className={`mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${ok ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {ok ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    </span>
                    <div className="flex-1">
                      <div className="text-xs text-slate-500">Q{idx + 1} · {qu.kind}</div>
                      <div className="font-medium">{qu.question}</div>
                      {qu.explanation && <div className="text-xs text-slate-600 italic mt-1">{qu.explanation}</div>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );

  const hintText = q.kind === 'antonym'
    ? (q.item.antonym_hinglish_meaning || q.item.hinglish_meaning)
    : q.item.hinglish_meaning;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" className="text-slate-700 hover:bg-white" onClick={() => nav('/ssc/english/synant')}>
            <ArrowLeft className="w-4 h-4 mr-1" />Back
          </Button>
          <div className="text-sm text-slate-500">Q {i + 1} / {qs.length} · Score <span className="text-emerald-700 font-semibold">{score}</span></div>
        </div>
        <Card className="border-emerald-100 shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="text-lg font-medium">{q.question}</div>
            {picked === null && hintText && (
              hint[i] ? (
                <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm italic text-amber-800 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 mt-0.5 text-amber-600" />
                  <span><span className="font-semibold not-italic mr-1">{q.item.word}:</span>{hintText}</span>
                </div>
              ) : (
                <Button variant="outline" size="sm" className="border-amber-200 text-amber-700 hover:bg-amber-50" onClick={() => setHint({ ...hint, [i]: true })}>
                  <Lightbulb className="w-4 h-4 mr-1" />Show hint
                </Button>
              )
            )}
            <div className="space-y-2">
              {q.options.map((opt, idx) => {
                const show = picked !== null;
                const isCorrect = q.correct === idx;
                const isPicked = picked === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => choose(idx)}
                    className={`w-full text-left p-3 rounded-md border transition-all ${
                      show && isCorrect ? 'border-emerald-500 bg-emerald-50 text-emerald-800' :
                      show && isPicked ? 'border-rose-400 bg-rose-50 text-rose-800' :
                      'border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/60'
                    }`}>
                    <span className="font-semibold mr-2">{String.fromCharCode(65 + idx)}.</span>{opt}
                  </button>
                );
              })}
            </div>
            {picked !== null && (q.item.meaning || q.item.example_sentence) && (
              <div className="rounded-md border border-emerald-100 bg-emerald-50/50 p-3 text-sm space-y-1">
                {q.item.meaning && <div><span className="font-semibold">Meaning:</span> {q.item.meaning}</div>}
                {q.item.example_sentence && <div className="italic text-slate-600">"{q.item.example_sentence}"</div>}
              </div>
            )}
            <div className="flex gap-2 pt-1">
              <Button variant="outline" className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50 disabled:opacity-40" onClick={() => i > 0 && setI(i - 1)} disabled={i === 0}>
                <ChevronLeft className="w-4 h-4 mr-1" />Previous
              </Button>
              <Button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white" onClick={nextQ}>
                {i + 1 >= qs.length ? 'Finish' : (<>Next<ChevronRight className="w-4 h-4 ml-1" /></>)}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
