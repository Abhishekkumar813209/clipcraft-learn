import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Trophy, ArrowLeft, ChevronLeft, ChevronRight, Check, X, Lightbulb, RotateCcw, Bookmark } from 'lucide-react';
import { fetchSAItems, buildSAQuestionSet, SAMode, SASub, SAQuestion, SAItem } from '@/lib/synAntQuiz';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useWordHindi, lookupHindi } from '@/lib/wordHindi';
import { toggleBookmark, fetchChapterBookmarks } from '@/lib/bookmarks';
import { toast } from '@/hooks/use-toast';

type Diff = 'easy' | 'medium' | 'hard';

export default function SscSynAntPractice() {
  const [sp] = useSearchParams();
  const mode = (sp.get('mode') || 'mixed') as SAMode;
  const sub = (sp.get('sub') || 'top_100') as SASub;
  const n = Number(sp.get('n')) || 20;
  const diff = (['easy', 'medium', 'hard'].includes(sp.get('diff') || '') ? sp.get('diff') : 'easy') as Diff;
  const fromSerial = sp.get('from') ? Number(sp.get('from')) : null;
  const toSerial = sp.get('to') ? Number(sp.get('to')) : null;
  const bookmarksOnly = sp.get('bookmarks') === '1';
  const nav = useNavigate();
  const { user } = useAuth();
  const wordHindi = useWordHindi();

  const [qs, setQs] = useState<SAQuestion[]>([]);
  const [items, setItems] = useState<SAItem[]>([]);
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<(number | null)[]>([]);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hint, setHint] = useState<Record<number, boolean>>({});
  const [flipAll, setFlipAll] = useState<Record<number, boolean>>({});
  const [revealed, setRevealed] = useState<Record<number, Set<number>>>({});
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [qRefs, setQRefs] = useState<Set<string>>(new Set());
  const [oKeys, setOKeys] = useState<Set<string>>(new Set());

  // Hinglish lookup: index every item's word AND its syn/ant tokens so any option can flip to Hindi.
  const itemHindiMap = useMemo(() => {
    const m = new Map<string, string>();
    const put = (k: string | null | undefined, v: string | null | undefined) => {
      if (!k || !v) return;
      const key = k.trim().toLowerCase();
      if (!key || m.has(key)) return;
      m.set(key, v);
    };
    const split = (s: string | null) =>
      s ? s.split(/[,;/|]/).map((x) => x.trim()).filter(Boolean) : [];
    for (const it of items) {
      const synMean = it.hinglish_meaning || it.meaning;
      const antMean = it.antonym_hinglish_meaning || it.hinglish_meaning || it.meaning;
      // The item's own word carries the synonym-side meaning.
      put(it.word, synMean);
      // Every synonym token shares the synonym-side meaning.
      for (const t of split(it.synonyms)) put(t, synMean);
      // Every antonym token shares the antonym-side meaning.
      for (const t of split(it.antonyms)) put(t, antMean);
    }
    return m;
  }, [items]);

  function hindiForOption(opt: string): string {
    const k = opt.trim().toLowerCase();
    return itemHindiMap.get(k) || lookupHindi(wordHindi, opt) || '—';
  }

  useEffect(() => {
    (async () => {
      // In bookmarks-only mode we want ALL syn/ant items (any sub) intersected with bookmarks.
      const raw = bookmarksOnly
        ? await fetchSAItems('mixed', 'top_100').then(async (a) => {
            const b = await fetchSAItems('mixed', 'all_repeated');
            return [...a, ...b];
          })
        : await fetchSAItems(mode, sub);
      let bmRefs = new Set<string>();
      let bmOKeys = new Set<string>();
      if (user) {
        const bm = await fetchChapterBookmarks(user.id, 'syn_ant');
        bmRefs = bm.qRefs; bmOKeys = bm.oKeys;
        setQRefs(bmRefs); setOKeys(bmOKeys);
      }
      let data = raw;
      if (bookmarksOnly) {
        data = raw.filter((it) => bmRefs.has(it.id));
      } else if (fromSerial != null || toSerial != null) {
        data = raw.filter((it) => {
          const s = it.serial_no;
          if (s == null) return false;
          if (fromSerial != null && s < fromSerial) return false;
          if (toSerial != null && s > toSerial) return false;
          return true;
        });
      }
      setItems(data);
      const built = buildSAQuestionSet(data, bookmarksOnly ? Math.max(n, data.length) : n);
      setQs(built);
      setPicks(new Array(built.length).fill(null));
      setLoading(false);
      if (user && built.length) {
        const { data: s } = await supabase.from('bb_practice_sessions' as never).insert({
          user_id: user.id, category: 'syn_ant', total: built.length, correct: 0,
        } as never).select('id').single();
        if (s) setSessionId((s as any).id);
      }
    })();
  }, [mode, sub, n, user, fromSerial, toSerial, bookmarksOnly]);

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

  async function choose(idx: number) {
    if (picked !== null) return;
    const ok = idx === q.correct;
    const next = [...picks]; next[i] = idx; setPicks(next);
    logProgress(ok);
    if (user && sessionId) {
      await supabase.from('bb_practice_attempts' as never).insert({
        session_id: sessionId, user_id: user.id, item_id: q.item.id,
        category: 'syn_ant', question: q.question, options: q.options,
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

  function nextQ() {
    if (i + 1 >= qs.length) { finish(); return; }
    setI(i + 1);
  }

  function restart() {
    const built = buildSAQuestionSet(items, n);
    setQs(built); setPicks(new Array(built.length).fill(null));
    setI(0); setDone(false); setHint({}); setFlipAll({}); setRevealed({});
    if (user && built.length) {
      supabase.from('bb_practice_sessions' as never).insert({
        user_id: user.id, category: 'syn_ant', total: built.length, correct: 0,
      } as never).select('id').single().then(({ data: s }) => { if (s) setSessionId((s as any).id); });
    }
  }

  async function bookmarkQuestion() {
    if (!user || !q) return;
    const res = await toggleBookmark(user.id, {
      kind: 'question', subject: 'english', chapter: 'syn_ant',
      subcategory: sub, item_ref: q.item.id, question_text: q.question,
      correct_text: q.options[q.correct],
    });
    setQRefs((s) => { const nn = new Set(s); if (res === 'added') nn.add(q.item.id); else nn.delete(q.item.id); return nn; });
    toast({ title: res === 'added' ? '🔖 Question bookmarked' : 'Bookmark removed', duration: 1200 });
  }

  async function bookmarkOption(idx: number, opt: string) {
    if (!user || !q) return;
    const res = await toggleBookmark(user.id, {
      kind: 'option', subject: 'english', chapter: 'syn_ant',
      subcategory: sub, item_ref: q.item.id, question_text: q.question,
      option_text: opt, correct_text: q.options[q.correct],
    });
    const k = `${q.item.id}||${opt}`;
    setOKeys((s) => { const nn = new Set(s); if (res === 'added') nn.add(k); else nn.delete(k); return nn; });
    toast({ title: res === 'added' ? '🔖 Option bookmarked' : 'Bookmark removed', duration: 1200 });
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-emerald-50"><Loader2 className="w-6 h-6 animate-spin text-emerald-600" /></div>;

  if (!q) return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-6">
      <Card className="max-w-md w-full border-emerald-100">
        <CardContent className="p-8 text-center space-y-4">
          <h2 className="text-xl font-bold">No questions available</h2>
          <Button className="bg-emerald-600 hover:bg-emerald-500 text-white" onClick={() => nav(-1)}>Back</Button>
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
              <Button variant="outline" className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50" onClick={() => nav(-1)}>Back</Button>
              <Button variant="outline" className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50" onClick={() => nav('/ssc/blackbook/history')}>View History</Button>
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

  const hintText = q.item.hinglish_meaning || q.item.meaning;
  const correctOption = q.options[q.correct];
  const correctHindi = hindiForOption(correctOption);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" className="text-slate-700 hover:bg-white" onClick={() => nav(-1)}>
            <ArrowLeft className="w-4 h-4 mr-1" />Back
          </Button>
          <div className="text-sm text-slate-500">Q {i + 1} / {qs.length} · Score <span className="text-emerald-700 font-semibold">{score}</span></div>
        </div>
        <Card
          className={`border-emerald-100 shadow-sm select-none ${flipAll[i] ? 'ring-2 ring-amber-200' : ''}`}
          onDoubleClick={() => { if (picked !== null) setFlipAll({ ...flipAll, [i]: !flipAll[i] }); }}
        >
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-2">
              <div className="text-lg font-medium flex-1">
                {q.question}
                {flipAll[i] && <span className="ml-2 text-xs text-amber-700 font-semibold">Hindi view</span>}
              </div>
              <Button
                variant="ghost" size="sm"
                className={`shrink-0 ${qRefs.has(q.item.id) ? 'text-amber-600' : 'text-slate-400 hover:text-amber-600'}`}
                onClick={bookmarkQuestion}
                title="Bookmark question"
              >
                <Bookmark className={`w-4 h-4 ${qRefs.has(q.item.id) ? 'fill-current' : ''}`} />
              </Button>
            </div>
            {picked === null && hintText && diff !== 'hard' && (
              hint[i] ? (
                <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm italic text-amber-800 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 mt-0.5 text-amber-600" />
                  <span><span className="font-semibold not-italic mr-1">{q.item.word}:</span>{hintText}</span>
                </div>
              ) : (
                <Button variant="outline" size="sm" className="border-amber-200 text-amber-700 hover:bg-amber-50" onClick={() => setHint({ ...hint, [i]: true })}>
                  <Lightbulb className="w-4 h-4 mr-1" />Show hint (Hinglish meaning)
                </Button>
              )
            )}
            <div className="space-y-2">
              {q.options.map((opt, idx) => {
                const show = picked !== null;
                const isCorrect = q.correct === idx;
                const isPicked = picked === idx;
                const isFlipped = show && (flipAll[i] || revealed[i]?.has(idx));
                const optHindi = show ? hindiForOption(opt) : '';
                const optKey = `${q.item.id}||${opt}`;
                const optBook = oKeys.has(optKey);
                return (
                  <div key={idx} className="flex items-stretch gap-2">
                    <button
                      onClick={() => {
                        if (picked === null) { choose(idx); return; }
                        const cur = new Set(revealed[i] || []);
                        if (cur.has(idx)) cur.delete(idx); else cur.add(idx);
                        setRevealed({ ...revealed, [i]: cur });
                      }}
                      className={`flex-1 text-left p-3 rounded-md border transition-all ${
                        show && isCorrect ? 'border-emerald-500 bg-emerald-50 text-emerald-800' :
                        show && isPicked ? 'border-rose-400 bg-rose-50 text-rose-800' :
                        'border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/60'
                      }`}>
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold">{String.fromCharCode(65 + idx)}.</span>
                        <span className={isFlipped ? 'italic' : ''}>{isFlipped ? optHindi : opt}</span>
                      </div>
                      {show && isCorrect && optHindi && optHindi !== '—' && !isFlipped && (
                        <div className="text-xs italic text-emerald-700 mt-1 pl-6">→ {optHindi}</div>
                      )}
                    </button>
                    <button
                      onClick={() => bookmarkOption(idx, opt)}
                      title="Bookmark option"
                      className={`px-2 rounded-md border transition ${
                        optBook ? 'bg-amber-50 border-amber-300 text-amber-600'
                                 : 'bg-white border-slate-200 text-slate-400 hover:text-amber-600 hover:border-amber-300'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${optBook ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                );
              })}
            </div>
            {picked !== null && (
              <>
                <div className="text-xs text-slate-500 flex items-center gap-1"><RotateCcw className="w-3 h-3" />Tap any option to reveal Hinglish · double-click card to flip all</div>
                <div className="rounded-md border border-emerald-100 bg-emerald-50/50 p-3 text-sm space-y-2">
                  <div>
                    <div className="font-semibold text-slate-800">{q.item.word}</div>
                    {(q.item.hinglish_meaning || q.item.meaning) && (
                      <div className="text-slate-700">{q.item.hinglish_meaning || q.item.meaning}</div>
                    )}
                    {q.item.example_sentence && <div className="italic text-slate-600 mt-1">"{q.item.example_sentence}"</div>}
                  </div>
                  <div className="border-t border-emerald-100 pt-2">
                    <div className="font-semibold text-emerald-800">
                      {q.kind === 'antonym' ? 'Antonym' : 'Synonym'}: {correctOption}
                    </div>
                    {correctHindi && correctHindi !== '—' && (
                      <div className="text-slate-700">{correctHindi}</div>
                    )}
                    {q.kind === 'antonym' && q.item.antonym_example_sentence && (
                      <div className="italic text-slate-600 mt-1">"{q.item.antonym_example_sentence}"</div>
                    )}
                  </div>
                </div>
              </>
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
