import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Bookmark, Lightbulb, Check, X, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { QuestionNavigator, QStatus } from '@/components/QuestionNavigator';
import { toggleBookmark, fetchChapterBookmarks } from '@/lib/bookmarks';
import {
  fetchUpscQuestions, UpscQuestion, OPTION_KEYS, OptionKey, optionText, optionWhy,
} from '@/lib/upscQuiz';

const CHAPTER_KEY = 'upsc_ancient_history';
const num = (v: string | null) => {
  const n = parseInt(v ?? '', 10);
  return Number.isFinite(n) && n > 0 ? n : null;
};

export default function UpscHistoryPractice() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [sp] = useSearchParams();

  const [rows, setRows] = useState<UpscQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<Record<number, OptionKey>>({});
  const [openWhy, setOpenWhy] = useState<Record<string, boolean>>({});
  const [showAll, setShowAll] = useState<Record<number, boolean>>({});
  const [showHint, setShowHint] = useState<Record<number, boolean>>({});
  const [marks, setMarks] = useState<Set<string>>(new Set());

  useEffect(() => {
    setLoading(true);
    fetchUpscQuestions({
      chapter: num(sp.get('chapter')),
      from: num(sp.get('from')),
      to: num(sp.get('to')),
      count: num(sp.get('n')),
      order: sp.get('order') === 'random' ? 'random' : 'serial',
    }).then((r) => { setRows(r); setIdx(0); setLoading(false); });
  }, [sp]);

  useEffect(() => {
    if (!user) return;
    fetchChapterBookmarks(user.id, CHAPTER_KEY).then(({ qRefs }) => setMarks(new Set(qRefs)));
  }, [user]);

  const q = rows[idx];
  const chosen = q ? picked[idx] : undefined;
  const answered = !!chosen;

  const statuses: QStatus[] = useMemo(
    () => rows.map((r, i) => {
      const p = picked[i];
      if (!p) return 'unattempted';
      return p === r.correct_option ? 'correct' : 'wrong';
    }),
    [rows, picked]
  );
  const bookmarkedFlags = useMemo(() => rows.map((r) => marks.has(r.id)), [rows, marks]);

  const pick = (k: OptionKey) => {
    if (answered) {
      const key = `${idx}-${k}`;
      setOpenWhy((m) => ({ ...m, [key]: !m[key] }));
      return;
    }
    setPicked((m) => ({ ...m, [idx]: k }));
    setOpenWhy((m) => ({ ...m, [`${idx}-${k}`]: true }));
  };

  const onCardDoubleClick = () => {
    if (!answered) return;
    setShowAll((m) => ({ ...m, [idx]: !m[idx] }));
  };

  const onToggleBookmark = async () => {
    if (!user || !q) { toast.error('Login required'); return; }
    const res = await toggleBookmark(user.id, {
      kind: 'question',
      subject: 'gk',
      chapter: CHAPTER_KEY,
      subcategory: `ch${q.chapter_no}`,
      item_ref: q.id,
      question_text: q.question_text,
      correct_text: optionText(q, q.correct_option as OptionKey),
      meta: { global_serial: q.global_serial, chapter_name: q.chapter_name },
    });
    setMarks((s) => {
      const n = new Set(s);
      if (res === 'added') n.add(q.id); else n.delete(q.id);
      return n;
    });
    toast.success(res === 'added' ? 'Bookmarked' : 'Bookmark removed');
  };

  if (loading) return <div className="p-8 text-slate-500">Loading…</div>;
  if (!q) {
    return (
      <div className="p-8 space-y-4">
        <p className="text-slate-600">Is range me koi question nahi mila.</p>
        <Button onClick={() => nav('/upsc/history')} variant="outline"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
      </div>
    );
  }

  const correctKey = q.correct_option as OptionKey;
  const attempted = Object.keys(picked).length;
  const correctCount = rows.filter((r, i) => picked[i] === r.correct_option).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 p-4 md:p-6 text-slate-900">
      <QuestionNavigator
        total={rows.length}
        current={idx}
        statuses={statuses}
        bookmarked={bookmarkedFlags}
        onSelect={setIdx}
        title="Ancient History"
      />
      <div className="max-w-3xl mx-auto space-y-4 pt-2">
        <div className="flex items-center justify-between gap-2 pr-12">
          <Button variant="ghost" size="sm" className="text-slate-700" onClick={() => nav('/upsc/history')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div className="text-xs text-slate-500">
            {attempted}/{rows.length} attempted · {correctCount} correct
          </div>
        </div>

        <Card className="bg-white/90 border-amber-100 shadow-sm" onDoubleClick={onCardDoubleClick}>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-amber-50 text-amber-700 border border-amber-200">#{q.global_serial}</Badge>
                <Badge variant="outline" className="border-amber-200 text-amber-700">Ch {q.chapter_no}</Badge>
                {q.topic_tag && <span className="text-[11px] text-slate-500">{q.topic_tag}</span>}
              </div>
              <button
                onClick={onToggleBookmark}
                className={`p-1.5 rounded-md border ${marks.has(q.id) ? 'bg-emerald-50 border-emerald-300 text-emerald-600' : 'bg-white border-slate-200 text-slate-400'}`}
                title="Bookmark"
              >
                <Bookmark className={`w-4 h-4 ${marks.has(q.id) ? 'fill-current' : ''}`} />
              </button>
            </div>

            <p className="text-base font-medium leading-relaxed whitespace-pre-line">{q.question_text}</p>

            {q.statements && (
              <div className="rounded-lg bg-amber-50/70 border border-amber-100 p-3 text-sm space-y-2">
                {q.statements
                  .split(/\|\||\n/)
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((s, i, arr) => (
                    <div key={i} className="flex gap-2">
                      {arr.length > 1 && (
                        <span className="font-semibold text-amber-800 shrink-0">Statement {i + 1}:</span>
                      )}
                      <span className="leading-relaxed">{s.replace(/^\s*\d+[.)]\s*/, '')}</span>
                    </div>
                  ))}
              </div>
            )}
            {(q.list_i || q.list_ii) && (
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                {q.list_i && <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 whitespace-pre-line">{q.list_i}</div>}
                {q.list_ii && <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 whitespace-pre-line">{q.list_ii}</div>}
              </div>
            )}

            {!answered && q.hint_hinglish && (
              <div>
                {showHint[idx] ? (
                  <div className="text-sm rounded-lg bg-yellow-50 border border-yellow-200 p-3 text-yellow-900">
                    💡 {q.hint_hinglish}
                  </div>
                ) : (
                  <Button size="sm" variant="outline" className="border-yellow-300 text-yellow-800 bg-yellow-50 hover:bg-yellow-100"
                    onClick={() => setShowHint((m) => ({ ...m, [idx]: true }))}>
                    <Lightbulb className="w-4 h-4 mr-1" /> Show hint
                  </Button>
                )}
              </div>
            )}

            <div className="space-y-2">
              {OPTION_KEYS.map((k) => {
                const isCorrect = k === correctKey;
                const isChosen = chosen === k;
                const why = optionWhy(q, k);
                const whyOpen = answered && (showAll[idx] || openWhy[`${idx}-${k}`]);
                return (
                  <div key={k}>
                    <button
                      onClick={() => pick(k)}
                      className={[
                        'w-full text-left px-3 py-2.5 rounded-lg border text-sm transition flex items-start gap-2',
                        !answered
                          ? 'bg-white border-slate-200 hover:bg-amber-50'
                          : isCorrect
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                          : isChosen
                          ? 'bg-rose-50 border-rose-300 text-rose-900'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      <span className="font-semibold uppercase">{k}.</span>
                      <span className="flex-1">{optionText(q, k)}</span>
                      {answered && isCorrect && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                      {answered && isChosen && !isCorrect && <X className="w-4 h-4 text-rose-600 shrink-0" />}
                    </button>
                    {whyOpen && why && (
                      <div className={`mt-1 ml-4 text-xs leading-relaxed rounded-md p-2.5 border ${isCorrect ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                        {why}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {answered && (
              <p className="text-[11px] text-slate-500">
                Kisi bhi option pe tap karo → us option ka reason. Card pe double-tap → saare reasons + full explanation.
              </p>
            )}

            {answered && showAll[idx] && (
              <div className="space-y-3 pt-1">
                {q.explanation_hinglish && (
                  <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm leading-relaxed whitespace-pre-line">
                    <div className="font-semibold text-amber-800 mb-1 flex items-center gap-1"><BookOpen className="w-4 h-4" /> Explanation (Hinglish)</div>
                    {q.explanation_hinglish}
                  </div>
                )}
                {q.ncert_extra && (
                  <div className="rounded-lg bg-sky-50 border border-sky-200 p-3 text-sm leading-relaxed whitespace-pre-line">
                    <div className="font-semibold text-sky-800 mb-1">NCERT extra</div>
                    {q.ncert_extra}
                  </div>
                )}
                {q.ncert_source && (
                  <div className="text-xs text-slate-500">Source: {q.ncert_source}</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between gap-2">
          <Button variant="outline" size="sm" disabled={idx === 0} onClick={() => setIdx((i) => Math.max(0, i - 1))}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Previous
          </Button>
          <span className="text-xs text-slate-500">{idx + 1} / {rows.length}</span>
          <Button size="sm" className="bg-amber-600 hover:bg-amber-500 text-white"
            disabled={idx >= rows.length - 1}
            onClick={() => setIdx((i) => Math.min(rows.length - 1, i + 1))}>
            Next <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
