import { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { TIMELINE, buildTimelineQuiz, buildSubjectQuiz } from '@/lib/timelineQuiz';

export default function SscHistoryTimelineQuiz() {
  const nav = useNavigate();
  const { subject } = useParams();
  const [params] = useSearchParams();
  const chapterKey = params.get('chapter') || '';
  const key = subject || '';
  const sub = TIMELINE[key];
  const chapter = sub?.chapters.find((c) => c.key === chapterKey);

  const all = useMemo(
    () => (chapter ? buildTimelineQuiz(chapter, 120) : buildSubjectQuiz(key, 100)),
    [chapter, key],
  );

  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<(number | null)[]>(() => new Array(all.length).fill(null));
  const [openWhy, setOpenWhy] = useState<Record<string, boolean>>({});

  const backTo = `/ssc/gk/${key}/timeline`;
  const q = all[idx];
  const answer = picked[idx];
  const score = picked.filter((p, i) => p !== null && p === all[i]?.correct).length;

  if (!sub || !all.length) {
    return (
      <div className="p-6 space-y-3">
        <Button variant="ghost" size="sm" onClick={() => nav(backTo)}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
        <p className="text-sm text-slate-600">Is timeline se questions abhi generate nahi ho paaye.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 sm:p-6 text-slate-900">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between gap-2">
          <Button variant="ghost" size="sm" className="text-emerald-700" onClick={() => nav(backTo)}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Timeline
          </Button>
          <span className="text-sm text-muted-foreground">Score {score}/{all.length}</span>
        </div>

        <Card className="bg-white/85 border-emerald-100">
          <CardContent className="p-5 space-y-4">
            <div className="text-xs text-muted-foreground">
              Q{idx + 1} / {all.length} · {chapter ? chapter.title : `${sub.label} — mixed`}
            </div>
            <p className="font-medium leading-relaxed">{q.q}</p>

            <div className="space-y-2">
              {q.options.map((text, i) => {
                const isCorrect = i === q.correct;
                const isPicked = answer === i;
                let cls = 'border-border hover:border-emerald-300';
                if (answer !== null && answer !== undefined) {
                  if (isCorrect) cls = 'border-emerald-400 bg-emerald-50';
                  else if (isPicked) cls = 'border-rose-400 bg-rose-50';
                }
                const isOpen = !!openWhy[`${idx}-${i}`];
                return (
                  <div key={i}>
                    <button
                      onClick={() => {
                        if (answer === null || answer === undefined) {
                          setPicked((p) => p.map((v, j) => (j === idx ? i : v)));
                        } else {
                          setOpenWhy((m) => ({ ...m, [`${idx}-${i}`]: !m[`${idx}-${i}`] }));
                        }
                      }}
                      className={`w-full text-left border rounded-md px-3 py-2 text-sm transition ${cls}`}
                    >
                      <span className="font-semibold uppercase mr-2">{'abcd'[i]}.</span>{text}
                    </button>
                    {answer !== null && answer !== undefined && isOpen && (
                      <div className={`mt-1 ml-4 text-xs leading-relaxed rounded-md p-2.5 border ${
                        isCorrect ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}>
                        {q.why[i]}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {answer !== null && answer !== undefined && (
              <>
                <p className="text-[11px] text-muted-foreground">Har option pe tap karo → wo kis ghatna / ruler se juda hai.</p>
                <div className="rounded-md bg-slate-50 border p-3 text-sm space-y-1">
                  <div className="font-semibold text-emerald-700">Correct: {'ABCD'[q.correct]} · {q.answer}</div>
                  <p className="text-slate-700 leading-relaxed">{q.solution}</p>
                </div>
              </>
            )}

            <div className="flex justify-between pt-1">
              <Button variant="outline" size="sm" disabled={idx === 0} onClick={() => setIdx((i) => i - 1)}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Prev
              </Button>
              <Button size="sm" disabled={idx >= all.length - 1} onClick={() => setIdx((i) => i + 1)}>
                Next <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
