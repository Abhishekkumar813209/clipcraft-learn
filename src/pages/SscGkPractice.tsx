import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QuestionNavigator, type QStatus } from '@/components/QuestionNavigator';
import { fetchSscChapterQuestions, fetchSscSubjectRange, shuffle, type ChapterQuestion } from '@/lib/sscChapters';
import { gkSubject } from '@/lib/sscGkSubjects';
import { ArrowLeft, ArrowRight, BookOpenText, Loader2, Shuffle, ListOrdered } from 'lucide-react';

export default function SscGkPractice() {
  const nav = useNavigate();
  const loc = useLocation();
  const { subject: subjectParam } = useParams();
  const meta = gkSubject(subjectParam);
  const SUBJECT = meta.key;
  const base = `/ssc/gk/${SUBJECT}`;

  const [params] = useSearchParams();
  const chapter = params.get('chapter') || '';
  const subtopic = params.get('subtopic') || '';
  const pFrom = params.get('from') || '';
  const pTo = params.get('to') || '';
  const pCount = params.get('n') || '';
  const pOrder = params.get('order') === 'random' ? 'random' : 'serial';
  const at = Number(params.get('at')) || 0;
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
      if (globalMode || at) {
        let list = rows;
        if (!at && pOrder === 'random') list = shuffle(list);
        const n = Number(pCount);
        if (!at && n > 0) list = list.slice(0, n);
        setQueue(list);
        setPicked(new Array(list.length).fill(null));
        const jump = at ? list.findIndex((r) => r.serial_no === at) : -1;
        setIdx(jump >= 0 ? jump : 0);
        setStarted(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SUBJECT, chapter, subtopic, pFrom, pTo, pCount, pOrder, at]);

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

  const setupTheoryHref = `${base}/theory?chapter=${encodeURIComponent(chapter)}${subtopic ? `&subtopic=${encodeURIComponent(subtopic)}` : ''}`;

  /** current question ke liye theory link — wapas isi question par aane ka ret bhi le jata hai */
  function theoryForCurrent(item: ChapterQuestion) {
    const p = new URLSearchParams();
    p.set('chapter', item.chapter);
    if (subtopic) p.set('subtopic', subtopic);
    p.set('q', String(item.serial_no));
    const retParams = new URLSearchParams(loc.search);
    retParams.set('at', String(item.serial_no));
    if (!retParams.get('chapter') && !globalMode) retParams.set('chapter', chapter);
    p.set('ret', `${loc.pathname}?${retParams.toString()}`);
    return `${base}/theory?${p.toString()}`;
  }

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
        <Button variant="ghost" size="sm" onClick={() => nav(base)}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <Card>
          <CardContent className="p-5 space-y-4">
            <div>
              <h1 className="text-lg font-bold">{chapter || `${meta.label} — full serial`}</h1>
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
              {chapter && (
                <Button variant="outline" onClick={() => nav(setupTheoryHref)}>
                  <BookOpenText className="w-4 h-4 mr-1" /> Theory
                </Button>
              )}
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
            title={`${meta.label} Questions`}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div className="text-xs text-muted-foreground">
              Q{idx + 1} / {queue.length} · serial {q.serial_no}{q.subtopic ? ` · ${q.subtopic}` : ''}
              {globalMode && q.chapter ? ` · ${q.chapter}` : ''}
            </div>
            <Button
              size="sm"
              variant="outline"
              className="shrink-0 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              onClick={() => nav(theoryForCurrent(q))}
            >
              <BookOpenText className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">Theory padho</span>
            </Button>
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
              const why = whyFor(q, o.key);
              const isOpen = !!openWhy[`${idx}-${o.key}`];
              return (
                <div key={o.key}>
                  <button
                    onClick={() => {
                      if (!answer) {
                        setPicked((p) => p.map((v, i) => (i === idx ? o.key : v)));
                      } else {
                        toggleWhy(q, o.key);
                      }
                    }}
                    className={`w-full text-left border rounded-md px-3 py-2 text-sm transition ${cls}`}
                  >
                    <span className="font-semibold uppercase mr-2">{o.key}.</span>
                    {o.text}
                  </button>
                  {answer && isOpen && (
                    <div
                      className={`mt-1 ml-4 text-xs leading-relaxed rounded-md p-2.5 border ${
                        isCorrect
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      {why || (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Loader2 className="w-3 h-3 animate-spin" /> Reason ban raha hai…
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {answer && (
            <p className="text-[11px] text-muted-foreground">
              Kisi bhi option pe tap karo → us option ka reason (sahi kyu / galat kyu).
            </p>
          )}

          {answer && (
            <div className="rounded-md bg-slate-50 border p-3 text-sm space-y-2">
              <div className="font-semibold text-emerald-700">
                Correct: {correct.toUpperCase()} · {opts.find((o) => o.key === correct)?.text}
              </div>
              {q.explanation_hinglish && <p className="text-slate-700 leading-relaxed">{q.explanation_hinglish}</p>}
              {q.exam_name && <p className="text-[11px] text-muted-foreground">{q.exam_name}</p>}
              <Button size="sm" variant="ghost" className="text-emerald-700 px-0" onClick={() => nav(theoryForCurrent(q))}>
                <BookOpenText className="w-4 h-4 mr-1" /> Is question ki theory dekho →
              </Button>
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
    </div>
  );
}
