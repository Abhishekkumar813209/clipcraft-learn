import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Trophy, ArrowLeft, ChevronLeft, ChevronRight, Check, X, RotateCcw } from 'lucide-react';
import { fetchAllRootWords, buildRootSession, RootQuestion, RootWord } from '@/lib/rootWordsQuiz';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useWordHindi, lookupHindi } from '@/lib/wordHindi';

export default function SscRootsPractice() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [all, setAll] = useState<RootWord[]>([]);
  const [qs, setQs] = useState<RootQuestion[]>([]);
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<(number | null)[]>([]);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [flipAll, setFlipAll] = useState<Record<number, boolean>>({});
  const [revealed, setRevealed] = useState<Record<number, Set<number>>>({});
  const wordHindi = useWordHindi();

  // Build a map: word -> hindi (from ssc_root_words). Also lookup by definition and by synonym token.
  const rootMaps = useMemo(() => {
    const byWord = new Map<string, string>();
    const byDefinition = new Map<string, string>();
    for (const w of all) {
      const h = w.hindi_meaning || w.hinglish_meaning;
      if (!h) continue;
      byWord.set(w.word.trim().toLowerCase(), h);
      if (w.definition) byDefinition.set(w.definition.trim().toLowerCase(), h);
    }
    return { byWord, byDefinition };
  }, [all]);

  function hindiForOption(q: RootQuestion, opt: string): string {
    const k = opt.trim().toLowerCase();
    if (q.qtype === 'definition') {
      return rootMaps.byDefinition.get(k) || '—';
    }
    // root_match & synonym: option is a word
    return rootMaps.byWord.get(k) || lookupHindi(wordHindi, opt) || '—';
  }

  async function start(allWords: RootWord[]) {
    const { questions } = buildRootSession(allWords, 30, 20);
    setQs(questions);
    setPicks(new Array(questions.length).fill(null));
    setI(0);
    setDone(false);
    setSessionId(null);
    if (user && questions.length) {
      const { data: s } = await supabase.from('root_practice_sessions' as never).insert({
        user_id: user.id, total: questions.length, correct: 0,
      } as never).select('id').single();
      if (s) setSessionId((s as any).id);
    }
  }

  useEffect(() => {
    fetchAllRootWords().then(w => { setAll(w); start(w); setLoading(false); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const q = qs[i];
  const picked = picks[i];
  const score = picks.reduce((acc, p, idx) => acc + (p !== null && p === qs[idx]?.correct ? 1 : 0), 0);

  async function choose(idx: number) {
    if (picked !== null) return;
    const ok = idx === q.correct;
    const next = [...picks];
    next[i] = idx;
    setPicks(next);
    if (user && sessionId) {
      await supabase.from('root_practice_attempts' as never).insert({
        session_id: sessionId, user_id: user.id, word_id: q.word.id,
        question: q.question, options: q.options, correct_index: q.correct,
        picked_index: idx, is_correct: ok, qtype: q.qtype,
      } as never);
    }
  }

  async function finish() {
    if (user && sessionId) {
      const correct = picks.reduce((a, p, idx) => a + (p === qs[idx]?.correct ? 1 : 0), 0);
      await supabase.from('root_practice_sessions' as never).update({ correct } as never).eq('id', sessionId);
    }
    setDone(true);
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-emerald-50 text-slate-700"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  if (!qs.length || !q) return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-6">
      <Card className="bg-white border-emerald-100 max-w-md w-full">
        <CardContent className="p-8 text-center space-y-3">
          <h2 className="text-xl font-bold">No questions available</h2>
          <Button className="bg-emerald-600 hover:bg-emerald-500 text-white" onClick={() => nav('/ssc/roots')}>Back</Button>
        </CardContent>
      </Card>
    </div>
  );

  if (done) return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 text-slate-900">
      <div className="max-w-3xl mx-auto space-y-4">
        <Card className="bg-white border-emerald-100">
          <CardContent className="p-8 text-center space-y-3">
            <Trophy className="w-14 h-14 mx-auto text-amber-500" />
            <h2 className="text-2xl font-bold">Session complete!</h2>
            <div className="text-5xl font-bold text-emerald-600">{score} / {qs.length}</div>
            <div className="text-slate-500">{Math.round((score / qs.length) * 100)}% correct</div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50" onClick={() => nav('/ssc/roots')}>Back</Button>
              <Button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white" onClick={() => start(all)}>Play again</Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Review</h3>
          {qs.map((question, idx) => {
            const p = picks[idx];
            const ok = p === question.correct;
            return (
              <Card key={idx} className="bg-white border-emerald-100">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className={`mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${ok ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {ok ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    </span>
                    <div className="flex-1">
                      <div className="text-xs text-slate-500">Q{idx + 1} · {question.qtype}</div>
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
                  {question.explanation && <div className="pl-8 text-xs text-slate-600 italic">{question.explanation}</div>}
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
          <Button variant="ghost" size="sm" className="text-slate-700 hover:bg-white" onClick={() => nav('/ssc/roots')}><ArrowLeft className="w-4 h-4 mr-1" />Back</Button>
          <div className="text-sm text-slate-500">Q {i + 1} / {qs.length} · Score <span className="text-emerald-700 font-semibold">{score}</span></div>
        </div>
        <Card
          className={`bg-white border-emerald-100 select-none ${flipAll[i] ? 'ring-2 ring-amber-200' : ''}`}
          onDoubleClick={() => { if (picked !== null) setFlipAll({ ...flipAll, [i]: !flipAll[i] }); }}
        >
          <CardContent className="p-6 space-y-4">
            <div className="text-xs uppercase tracking-wide text-emerald-600 font-semibold flex items-center gap-2">
              {q.qtype.replace('_', ' ')}
              {flipAll[i] && <span className="text-amber-700">· Hindi view</span>}
            </div>
            <div className="text-lg font-medium text-slate-900">{q.question}</div>
            <div className="space-y-2">
              {q.options.map((opt, idx) => {
                const isCorrect = q.correct === idx;
                const isPicked = picked === idx;
                const show = picked !== null;
                const isFlipped = show && (flipAll[i] || revealed[i]?.has(idx));
                const label = isFlipped ? hindiForOption(q, opt) : opt;
                return (
                  <button
                    key={idx}
                    disabled={!show && picked !== null}
                    onClick={() => {
                      if (picked === null) { choose(idx); return; }
                      // toggle per-option hindi reveal
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
                <div className="text-xs text-slate-500 flex items-center gap-1"><RotateCcw className="w-3 h-3" />Tap an option for its Hindi meaning · double-click card to flip all</div>
                <div className="rounded-md border border-emerald-200 bg-emerald-50/60 p-3 text-sm space-y-1">
                  <div><span className="font-semibold text-emerald-800">{q.word.word}</span> <span className="text-xs text-slate-500">· root {q.word.root}{q.word.root_meaning ? ` (${q.word.root_meaning})` : ''}</span></div>
                  {q.word.definition && <div className="text-slate-700">{q.word.definition}</div>}
                  {(q.word.hindi_meaning || q.word.hinglish_meaning) && <div className="text-amber-700">{q.word.hindi_meaning || q.word.hinglish_meaning}</div>}
                  {q.word.example && <div className="text-slate-600 border-l-2 border-emerald-300 pl-2">{q.word.example}</div>}
                </div>
              </>
            )}

            <div className="flex gap-2 pt-1">
              <Button variant="outline" className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50 disabled:opacity-40" onClick={() => setI(i - 1)} disabled={i === 0}>
                <ChevronLeft className="w-4 h-4 mr-1" />Previous
              </Button>
              <Button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white" onClick={() => { if (i + 1 >= qs.length) finish(); else setI(i + 1); }}>
                {i + 1 >= qs.length ? 'Finish' : (<>Next<ChevronRight className="w-4 h-4 ml-1" /></>)}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
