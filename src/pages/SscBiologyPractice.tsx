import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QuestionNavigator, type QStatus } from '@/components/QuestionNavigator';
import { fetchSscChapterQuestions, fetchSscSubjectRange, shuffle, type ChapterQuestion } from '@/lib/sscChapters';
import { ArrowLeft, ArrowRight, BookOpenText, Loader2, Shuffle, ListOrdered } from 'lucide-react';

const SUBJECT = 'biology';
const LETTERS = ['a', 'b', 'c', 'd'] as const;

export default function SscBiologyPractice() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const chapter = params.get('chapter') || '';
  const subtopic = params.get('subtopic') || '';
  const pFrom = params.get('from') || '';
  const pTo = params.get('to') || '';
  const pCount = params.get('n') || '';
  const pOrder = params.get('order') === 'random' ? 'random' : 'serial';
  const globalMode = !chapter;

  const [all, setAll] = useState<ChapterQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [order, setOrder] = useState<'serial' | 'random'>(pOrder);
  const [from, setFrom] = useState('1');
  const [to, setTo] = useState('');

  const [queue, setQueue] = useState<ChapterQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<(string | null)[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const rows = globalMode
        ? await fetchSscSubjectRange(SUBJECT, Number(pFrom) || undefined, Number(pTo) || undefined)
        : await fetchSscChapterQuestions(SUBJECT, chapter, subtopic || undefined);
      setAll(rows);
      setTo(String(rows.length));
      setLoading(false);
      if (globalMode) {
        let list = rows;
        if (pOrder === 'random') list = shuffle(list);
        const n = Number(pCount);
        if (n > 0) list = list.slice(0, n);
        setQueue(list);
        setPicked(new Array(list.length).fill(null));
        setIdx(0);
        setStarted(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter, subtopic, pFrom, pTo, pCount, pOrder]);

  function start() {
    const f = Math.max(1, Number(from) || 1);
    const t = Math.min(all.length, Number(to) || all.length);
    let list = all.slice(f - 1, t);
    if (order === 'random') list = shuffle(list);
    setQueue(list);
    setPicked(new Array(list.length).fill(null));
    setIdx(0);
    setStarted(true);
  }

  const q = queue[idx];
  const answer = picked[idx];
  const statuses: QStatus[] = useMemo(
    () => queue.map((item, i) => {
      const p = picked[i];
      if (!p) return 'unattempted';
      return p === item.correct_option.toLowerCase() ? 'correct' : 'wrong';
    }),
    [queue, picked],
  );
  const score = statuses.filter((s) => s === 'correct').length;

  const theoryHref = `/ssc/gk/biology/theory?chapter=${encodeURIComponent(chapter)}${subtopic ? `&subtopic=${encodeURIComponent(subtopic)}` : ''}`;


  if (loading) {
    return (
      <div className="p-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" /> Questions load ho rahe hain…
      </div>
    );
  }

  if (!started) {
    return (
      <div className="p-4 sm:p-6 max-w-xl mx-auto space-y-4">
        <Button variant="ghost" size="sm" onClick={() => nav('/ssc/gk/biology')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <Card>
          <CardContent className="p-5 space-y-4">
            <div>
              <h1 className="text-lg font-bold">{chapter}</h1>
              {subtopic && <p className="text-sm text-muted-foreground">{subtopic}</p>}
              <p className="text-xs text-muted-foreground mt-1">{all.length} questions available</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm">
                From
                <input value={from} onChange={(e) => setFrom(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" inputMode="numeric" />
              </label>
              <label className="text-sm">
                To
                <input value={to} onChange={(e) => setTo(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" inputMode="numeric" />
              </label>
            </div>
            <div className="flex gap-2">
              <Button variant={order === 'serial' ? 'default' : 'outline'} size="sm" onClick={() => setOrder('serial')}>
                <ListOrdered className="w-4 h-4 mr-1" /> Serial
              </Button>
              <Button variant={order === 'random' ? 'default' : 'outline'} size="sm" onClick={() => setOrder('random')}>
                <Shuffle className="w-4 h-4 mr-1" /> Random
              </Button>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 bg-emerald-600 hover:bg-emerald-500" disabled={!all.length} onClick={start}>
                Start Quiz
              </Button>
              <Button variant="outline" onClick={() => nav(theoryHref)}>
                <BookOpenText className="w-4 h-4 mr-1" /> Theory
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!q) return <div className="p-6 text-sm">Koi question nahi mila.</div>;

  const opts: { key: string; text: string }[] = [
    { key: 'a', text: q.option_a },
    { key: 'b', text: q.option_b },
    { key: 'c', text: q.option_c },
    { key: 'd', text: q.option_d },
  ];
  const correct = q.correct_option.toLowerCase();

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Button variant="ghost" size="sm" onClick={() => setStarted(false)}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Setup
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Score {score}/{queue.length}</span>
          <QuestionNavigator
            total={queue.length}
            current={idx}
            statuses={statuses}
            onSelect={setIdx}
            title="Biology Questions"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="text-xs text-muted-foreground">
            Q{idx + 1} / {queue.length} · {q.subtopic}
          </div>
          <p className="font-medium leading-relaxed">{q.question_text}</p>
          <div className="space-y-2">
            {opts.map((o) => {
              const isCorrect = o.key === correct;
              const isPicked = answer === o.key;
              let cls = 'border-border hover:border-emerald-300';
              if (answer) {
                if (isCorrect) cls = 'border-emerald-400 bg-emerald-50';
                else if (isPicked) cls = 'border-rose-400 bg-rose-50';
              }
              return (
                <button
                  key={o.key}
                  disabled={!!answer}
                  onClick={() => setPicked((p) => p.map((v, i) => (i === idx ? o.key : v)))}
                  className={`w-full text-left border rounded-md px-3 py-2 text-sm transition ${cls}`}
                >
                  <span className="font-semibold uppercase mr-2">{o.key}.</span>
                  {o.text}
                </button>
              );
            })}
          </div>

          {answer && (
            <div className="rounded-md bg-slate-50 border p-3 text-sm space-y-1">
              <div className="font-semibold text-emerald-700">
                Correct: {correct.toUpperCase()} · {opts.find((o) => o.key === correct)?.text}
              </div>
              {q.explanation_hinglish && <p className="text-slate-700 leading-relaxed">{q.explanation_hinglish}</p>}
              {q.exam_name && <p className="text-[11px] text-muted-foreground">{q.exam_name}</p>}
            </div>
          )}

          <div className="flex justify-between pt-1">
            <Button variant="outline" size="sm" disabled={idx === 0} onClick={() => setIdx((i) => i - 1)}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Prev
            </Button>
            <Button size="sm" disabled={idx >= queue.length - 1} onClick={() => setIdx((i) => i + 1)}>
              Next <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Letters: {LETTERS.join(', ').toUpperCase()}
      </p>
    </div>
  );
}
