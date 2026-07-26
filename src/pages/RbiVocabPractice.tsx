import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Trophy, ArrowLeft, ChevronLeft, ChevronRight, Check, X, Lightbulb, Bookmark, RotateCcw } from 'lucide-react';
import { fetchRbiVocab, buildRbiVocabQuestions, type RbiVocabItem, type RbiVocabQuestion } from '@/lib/rbiVocabQuiz';
import { useAuth } from '@/contexts/AuthContext';
import { toggleBookmark, fetchChapterBookmarks } from '@/lib/bookmarks';
import { toast } from '@/hooks/use-toast';
import { QuestionNavigator, type QStatus } from '@/components/QuestionNavigator';

type Diff = 'easy' | 'medium' | 'hard';

export default function RbiVocabPractice() {
  const [sp] = useSearchParams();
  const nav = useNavigate();
  const { user } = useAuth();

  const targetCount = Number(sp.get('n')) || 20;
  const order = (sp.get('order') === 'serial' ? 'serial' : 'random') as 'serial' | 'random';
  const diff = (['easy', 'medium', 'hard'].includes(sp.get('diff') || '') ? sp.get('diff') : 'easy') as Diff;
  const fromSerial = sp.get('from') ? Number(sp.get('from')) : null;
  const toSerial = sp.get('to') ? Number(sp.get('to')) : null;
  const bookmarksOnly = sp.get('bookmarks') === '1';

  const [all, setAll] = useState<RbiVocabItem[]>([]);
  const [qs, setQs] = useState<RbiVocabQuestion[]>([]);
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<(number | null)[]>([]);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const [hintShown, setHintShown] = useState<Record<number, boolean>>({});
  const [flipAll, setFlipAll] = useState<Record<number, boolean>>({});
  const [revealed, setRevealed] = useState<Record<number, Set<number>>>({});
  const [qRefs, setQRefs] = useState<Set<string>>(new Set());
  const [oKeys, setOKeys] = useState<Set<string>>(new Set());

  const hindiByMeaning = useMemo(() => {
    const m = new Map<string, string>();
    for (const it of all) {
      if (it.hinglish_meaning) {
        m.set(it.meaning.trim().toLowerCase(), it.hinglish_meaning);
        m.set(it.word.trim().toLowerCase(), it.hinglish_meaning);
      }
    }
    return m;
  }, [all]);

  function hinglishFor(text: string) {
    return hindiByMeaning.get(text.trim().toLowerCase()) || '—';
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      const raw = await fetchRbiVocab();
      setAll(raw);
      let bmRefs = new Set<string>();
      if (user) {
        const bm = await fetchChapterBookmarks(user.id, 'rbi_vocab');
        bmRefs = bm.qRefs;
        setQRefs(bm.qRefs);
        setOKeys(bm.oKeys);
      }
      let pool = raw;
      if (bookmarksOnly) {
        pool = raw.filter((it) => bmRefs.has(it.id));
      } else if (fromSerial != null || toSerial != null) {
        pool = raw.filter((it) => {
          if (fromSerial != null && it.serial_no < fromSerial) return false;
          if (toSerial != null && it.serial_no > toSerial) return false;
          return true;
        });
      }
      const built = buildRbiVocabQuestions(pool, bookmarksOnly ? Math.max(targetCount, pool.length) : targetCount, order, raw);
      setQs(built);
      setPicks(new Array(built.length).fill(null));
      setI(0);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetCount, order, fromSerial, toSerial, bookmarksOnly, user?.id]);

  const q = qs[i];
  const picked = picks[i];
  const score = picks.reduce((acc, p, idx) => acc + (p !== null && p === qs[idx]?.correct ? 1 : 0), 0);

  function choose(idx: number) {
    if (picked !== null) return;
    const next = [...picks];
    next[i] = idx;
    setPicks(next);
  }

  async function bookmarkQuestion() {
    if (!user || !q) return;
    const res = await toggleBookmark(user.id, {
      kind: 'question', subject: 'english', chapter: 'rbi_vocab',
      subcategory: q.item.root_word, item_ref: q.item.id,
      question_text: q.question, correct_text: q.options[q.correct],
    });
    setQRefs((s) => { const n = new Set(s); if (res === 'added') n.add(q.item.id); else n.delete(q.item.id); return n; });
    toast({ title: res === 'added' ? '🔖 Question bookmarked' : 'Bookmark removed', duration: 1200 });
  }

  async function bookmarkOption(opt: string) {
    if (!user || !q) return;
    const res = await toggleBookmark(user.id, {
      kind: 'option', subject: 'english', chapter: 'rbi_vocab',
      subcategory: q.item.root_word, item_ref: q.item.id,
      question_text: q.question, option_text: opt, correct_text: q.options[q.correct],
    });
    const k = `${q.item.id}||${opt}`;
    setOKeys((s) => { const n = new Set(s); if (res === 'added') n.add(k); else n.delete(k); return n; });
    toast({ title: res === 'added' ? '🔖 Option bookmarked' : 'Bookmark removed', duration: 1200 });
  }

  function next() { if (i + 1 >= qs.length) { setDone(true); return; } setI(i + 1); }
  function prev() { if (i > 0) setI(i - 1); }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-sky-50 text-slate-700"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  if (!qs.length || !q) return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 text-slate-900 flex items-center justify-center p-6">
      <Card className="bg-white border-blue-100 shadow-sm max-w-md w-full">
        <CardContent className="p-8 text-center space-y-4">
          <h2 className="text-xl font-bold">No questions available</h2>
          <p className="text-slate-600 text-sm">Try a different range or clear the bookmarks filter.</p>
          <Button className="bg-blue-600 hover:bg-blue-500 text-white" onClick={() => nav('/rbi/english/vocab')}>Back to setup</Button>
        </CardContent>
      </Card>
    </div>
  );

  if (done) return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 text-slate-900 p-6">
      <div className="max-w-3xl mx-auto space-y-4">
        <Card className="bg-white border-blue-100 shadow-sm">
          <CardContent className="p-8 text-center space-y-3">
            <Trophy className="w-14 h-14 mx-auto text-amber-500" />
            <h2 className="text-2xl font-bold">Session complete!</h2>
            <div className="text-5xl font-bold text-blue-600">{score} / {qs.length}</div>
            <div className="text-slate-500">{Math.round((score / qs.length) * 100)}% correct</div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50" onClick={() => nav('/rbi/english/vocab')}>Back</Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white" onClick={() => { setDone(false); setI(0); setPicks(new Array(qs.length).fill(null)); setHintShown({}); setFlipAll({}); setRevealed({}); }}>Play again</Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Review</h3>
          {qs.map((question, idx) => {
            const p = picks[idx];
            const ok = p === question.correct;
            return (
              <Card key={idx} className="bg-white border-blue-100 shadow-sm">
                <CardContent className="p-4 space-y-1.5">
                  <div className="flex items-start gap-2">
                    <span className={`mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${ok ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'}`}>
                      {ok ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    </span>
                    <div className="flex-1">
                      <div className="text-sm text-slate-500">Q{idx + 1} · {question.item.root_word} — {question.item.root_meaning}</div>
                      <div className="font-medium text-slate-900">{question.item.word}</div>
                      <div className="text-sm text-slate-600">{question.item.meaning}</div>
                      {question.item.hinglish_meaning && <div className="text-sm italic text-amber-700">{question.item.hinglish_meaning}</div>}
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

  const hintText = q.item.hinglish_meaning;
  const hintAvailable = diff !== 'hard' && !!hintText;
  const qBookmarked = qRefs.has(q.item.id);
  const navStatuses: QStatus[] = qs.map((qq, idx) => {
    const p = picks[idx];
    if (p == null) return 'unattempted';
    return p === qq.correct ? 'correct' : 'wrong';
  });
  const navBookmarks = qs.map((qq) => qRefs.has(qq.item.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 text-slate-900 p-6">
      <QuestionNavigator total={qs.length} current={i} statuses={navStatuses} bookmarked={navBookmarks} onSelect={setI} />
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" className="text-slate-700 hover:bg-white" onClick={() => nav('/rbi/english/vocab')}>
            <ArrowLeft className="w-4 h-4 mr-1" />Back
          </Button>
          <div className="text-sm text-slate-500">
            Q {i + 1} / {qs.length} · Score <span className="text-blue-700 font-semibold">{score}</span>
            <span className="ml-2 px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] uppercase">{diff}</span>
          </div>
        </div>

        <Card
          className={`bg-white border-blue-100 shadow-sm select-none ${flipAll[i] ? 'ring-2 ring-amber-200' : ''}`}
          onDoubleClick={() => { if (picked !== null) setFlipAll({ ...flipAll, [i]: !flipAll[i] }); }}
        >
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <div className="text-lg font-medium text-slate-900">{q.question}</div>
                {flipAll[i] && (
                  <div className="mt-1 text-sm italic text-amber-700">{hinglishFor(q.item.word)}</div>
                )}
                <div className="mt-1 text-[11px] uppercase tracking-wide text-blue-700 font-semibold">
                  Root: {q.item.root_word} — {q.item.root_meaning}
                </div>
              </div>
              <Button
                variant="ghost" size="sm"
                className={`shrink-0 ${qBookmarked ? 'text-amber-600 hover:text-amber-700' : 'text-slate-400 hover:text-amber-600'}`}
                onClick={bookmarkQuestion}
                title="Bookmark question"
              >
                <Bookmark className={`w-4 h-4 ${qBookmarked ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {hintAvailable && picked === null && (
              <div>
                {hintShown[i] ? (
                  <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm italic text-amber-800 flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
                    <span><span className="font-semibold not-italic mr-1">{q.item.word}:</span>{hintText}</span>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" className="border-amber-200 text-amber-700 hover:bg-amber-50" onClick={() => setHintShown({ ...hintShown, [i]: true })}>
                    <Lightbulb className="w-4 h-4 mr-1" />Show hint
                  </Button>
                )}
              </div>
            )}

            <div className="space-y-2">
              {q.options.map((opt, idx) => {
                const show = picked !== null;
                const isCorrect = q.correct === idx;
                const isPicked = picked === idx;
                const isFlipped = show && (flipAll[i] || !!revealed[i]?.has(idx));
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
                        show && isCorrect ? 'border-blue-500 bg-blue-50 text-blue-800' :
                        show && isPicked ? 'border-rose-400 bg-rose-50 text-rose-800' :
                        'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/60 text-slate-800'
                      } ${isFlipped ? 'italic' : ''}`}
                    >
                      <span className="font-semibold mr-2">{String.fromCharCode(65 + idx)}.</span>
                      {isFlipped ? hinglishFor(opt) : opt}
                    </button>
                    <button
                      onClick={() => bookmarkOption(opt)}
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
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <RotateCcw className="w-3 h-3" />Tap an option for Hinglish · double-click card to flip all
                </div>
                <div className="rounded-md border border-blue-100 bg-blue-50/60 p-3 space-y-1 text-sm">
                  <div><span className="font-semibold">{q.item.word}</span> — {q.item.meaning}</div>
                  {q.item.hinglish_meaning && <div className="italic text-amber-700">{q.item.hinglish_meaning}</div>}
                  {q.item.example && <div className="text-slate-600">e.g. {q.item.example}</div>}
                  <div className="text-[11px] uppercase tracking-wide text-blue-700 font-semibold">
                    Root: {q.item.root_word} — {q.item.root_meaning}
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-2 pt-1">
              <Button variant="outline" className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50 disabled:opacity-40" onClick={prev} disabled={i === 0}>
                <ChevronLeft className="w-4 h-4 mr-1" />Previous
              </Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white" onClick={next}>
                {i + 1 >= qs.length ? 'Finish' : (<>Next<ChevronRight className="w-4 h-4 ml-1" /></>)}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
