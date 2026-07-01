import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Trophy, ArrowLeft } from 'lucide-react';
import { fetchBBItems, buildQuestionSet, BBCategory, BBItem, BBQuestion } from '@/lib/blackBookQuiz';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export default function BlackBookPractice() {
  const { category } = useParams<{ category: BBCategory }>();
  const nav = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState<BBItem[]>([]);
  const [qs, setQs] = useState<BBQuestion[]>([]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await fetchBBItems(category);
      setItems(data);
      setQs(buildQuestionSet(data, 20));
      setLoading(false);
    })();
  }, [category]);

  const q = qs[i];

  async function logProgress(correct: boolean) {
    if (!user || !category) return;
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

  function choose(idx: number) {
    if (picked !== null) return;
    setPicked(idx);
    const ok = idx === q.correct;
    if (ok) setScore((s) => s + 1);
    logProgress(ok);
  }

  function next() {
    if (i + 1 >= qs.length) { setDone(true); return; }
    setI(i + 1); setPicked(null);
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  if (done) return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <Card className="bg-slate-900 border-blue-900/40 max-w-md w-full">
        <CardContent className="p-8 text-center space-y-4">
          <Trophy className="w-14 h-14 mx-auto text-yellow-400" />
          <h2 className="text-2xl font-bold">Session complete!</h2>
          <div className="text-5xl font-bold">{score} / {qs.length}</div>
          <div className="text-slate-400">{Math.round((score / qs.length) * 100)}% correct</div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => nav('/ssc/blackbook')}>Back</Button>
            <Button className="flex-1" onClick={() => { setQs(buildQuestionSet(items, 20)); setI(0); setPicked(null); setScore(0); setDone(false); }}>Play again</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/40 to-slate-950 text-slate-100 p-6">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => nav('/ssc/blackbook')}><ArrowLeft className="w-4 h-4 mr-1" />Back</Button>
          <div className="text-sm text-slate-400">Q {i + 1} / {qs.length} · Score {score}</div>
        </div>
        <Card className="bg-slate-900/70 border-blue-900/40">
          <CardContent className="p-6 space-y-4">
            <div className="text-lg font-medium">{q.question}</div>
            <div className="space-y-2">
              {q.options.map((opt, idx) => {
                const isCorrect = q.correct === idx;
                const isPicked = picked === idx;
                const show = picked !== null;
                return (
                  <button key={idx} disabled={show} onClick={() => choose(idx)}
                    className={`w-full text-left p-3 rounded-md border transition-all ${
                      show && isCorrect ? 'border-emerald-500 bg-emerald-500/10' :
                      show && isPicked ? 'border-red-500 bg-red-500/10' :
                      'border-slate-700 hover:border-blue-400 hover:bg-blue-500/5'
                    }`}>
                    <span className="font-semibold mr-2">{String.fromCharCode(65 + idx)}.</span>{opt}
                  </button>
                );
              })}
            </div>
            {picked !== null && q.explanation && (
              <div className="text-sm text-slate-300 border-l-2 border-blue-500 pl-3 italic">{q.explanation}</div>
            )}
            {picked !== null && (
              <Button className="w-full" onClick={next}>{i + 1 >= qs.length ? 'Finish' : 'Next'}</Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
