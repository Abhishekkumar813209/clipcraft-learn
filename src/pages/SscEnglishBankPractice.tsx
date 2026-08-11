import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check, X, Lightbulb, RotateCcw, Languages, ChevronDown, BookOpen, Bookmark } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuizBookmarks } from '@/lib/bookmarks';
import { toast } from '@/hooks/use-toast';
import { QuestionNavigator, type QStatus } from '@/components/QuestionNavigator';
import {
  bankMeta,
  underlineHtml,
  optionLetters,
  optionText,
  optionWhy,
  optionUsage,
  type BankItem,
} from '@/lib/sscEnglishBank';

const SELECT =
  'id,category,serial_no,set_no,passage,question_text,question_hinglish,hint,option_a,option_b,option_c,option_d,correct_option,correct_answer,solution_hinglish,book_solution,word_meanings,why_a,why_b,why_c,why_d,usage_a,usage_b,usage_c,usage_d,error_word,correction,corrected_sentence,topic,exam';

export default function SscEnglishBankPractice() {
  const nav = useNavigate();
  const { category = 'spot_error' } = useParams();
  const [sp] = useSearchParams();
  const from = Number(sp.get('from') || 1);
  const to = Number(sp.get('to') || 50);
  const order = sp.get('order') === 'random' ? 'random' : 'serial';
  const meta = bankMeta(category);

  const [qs, setQs] = useState<BankItem[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<(string | null)[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [showMeaning, setShowMeaning] = useState(false);
  const [openOpt, setOpenOpt] = useState<string | null>(null);
  const [showPassage, setShowPassage] = useState(true);
  const { user } = useAuth();
  const bm = useQuizBookmarks(user?.id, 'english', `eng_${category}`);

  async function bookmarkQuestion(item: BankItem) {
    const res = await bm.toggleQuestion({
      item_ref: item.id,
      subcategory: item.topic || null,
      question_text: item.question_text,
      correct_text: item.correct_answer || optionText(item, item.correct_option) || null,
      meta: { options: optionLetters.map((l) => optionText(item, l)).filter(Boolean) },
    });
    if (res) toast({ title: res === 'added' ? '🔖 Question bookmarked' : 'Bookmark removed', duration: 1200 });
  }

  async function bookmarkOption(item: BankItem, text: string) {
    const res = await bm.toggleOption({
      item_ref: item.id,
      subcategory: item.topic || null,
      question_text: item.question_text,
      option_text: text,
      correct_text: item.correct_answer || optionText(item, item.correct_option) || null,
    });
    if (res) toast({ title: res === 'added' ? '🔖 Option bookmarked' : 'Bookmark removed', duration: 1200 });
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      const rows: BankItem[] = [];
      for (let page = 0; page < 10; page++) {
        const { data } = await supabase
          .from('ssc_english_items' as never)
          .select(SELECT)
          .eq('category', category)
          .gte('serial_no', from)
          .lte('serial_no', to)
          .order('serial_no')
          .range(page * 1000, page * 1000 + 999);
        const chunk = (data as unknown as BankItem[]) || [];
        rows.push(...chunk);
        if (chunk.length < 1000) break;
      }
      setQs(order === 'random' ? [...rows].sort(() => Math.random() - 0.5) : rows);
      setPicked([]);
      setIdx(0);
      setLoading(false);
    })();
  }, [category, from, to, order]);

  useEffect(() => {
    setShowHint(false);
    setShowMeaning(false);
    setOpenOpt(null);
  }, [idx]);

  const cur = qs[idx];
  const answer = picked[idx] ?? null;
  const statuses: QStatus[] = useMemo(
    () => qs.map((q, i) => (picked[i] == null ? 'unattempted' : picked[i] === q.correct_option ? 'correct' : 'wrong')),
    [qs, picked],
  );
  const score = statuses.filter((s) => s === 'correct').length;
  const attempted = statuses.filter((s) => s !== 'unattempted').length;

  const pick = (letter: string) => {
    if (answer) return;
    setPicked((p) => {
      const c = [...p];
      c[idx] = letter;
      return c;
    });
  };

  if (loading) return <div className="p-6 text-muted-foreground">Loading questions…</div>;
  if (!qs.length)
    return (
      <div className="p-6 space-y-4">
        <Button variant="ghost" size="sm" onClick={() => nav('/ssc/english/bank')}>
          <ArrowLeft className="w-4 h-4 mr-1" />Back
        </Button>
        <p className="text-muted-foreground">Is range me koi question nahi mila.</p>
      </div>
    );

  const perOption = category === 'cloze' || category === 'fill_blanks';
  const hasHinglish = !!cur.question_hinglish;

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-4 pb-24">
      <QuestionNavigator total={qs.length} current={idx} statuses={statuses} bookmarked={qs.map((x) => bm.isQ(x.id))} onSelect={setIdx} title={`${meta.emoji} ${meta.label}`} />

      <div className="flex items-center justify-between gap-2">
        <Button variant="ghost" size="sm" onClick={() => nav('/ssc/english/bank')} className="text-slate-700">
          <ArrowLeft className="w-4 h-4 mr-1" />Bank
        </Button>
        <div className="text-sm text-slate-600 mr-12">
          Q {idx + 1}/{qs.length} · <span className="text-emerald-600 font-semibold">{score}</span>/{attempted} correct
        </div>
      </div>

      {category === 'cloze' && cur.passage && (
        <Card className="border-sky-100 bg-sky-50/50">
          <CardContent className="p-4">
            <button className="flex items-center gap-2 text-xs font-semibold text-sky-800 uppercase tracking-wide" onClick={() => setShowPassage((v) => !v)}>
              <BookOpen className="w-3.5 h-3.5" /> Passage · Set {cur.set_no}
              <ChevronDown className={`w-3.5 h-3.5 transition ${showPassage ? 'rotate-180' : ''}`} />
            </button>
            {showPassage && <p className="text-sm text-slate-700 leading-relaxed mt-2">{cur.passage}</p>}
          </CardContent>
        </Card>
      )}

      <Card className="border-emerald-100">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-2 flex-wrap text-[11px]">
            <span className="uppercase font-semibold tracking-wide text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Q{cur.serial_no}</span>
            {cur.topic && <span className="text-slate-500">{cur.topic}</span>}
            {cur.exam && <span className="text-slate-400">{cur.exam}</span>}
            <Button
              size="icon"
              variant="ghost"
              className={`ml-auto ${bm.isQ(cur.id) ? 'text-amber-600' : 'text-slate-400 hover:text-amber-600'}`}
              title="Bookmark question"
              onClick={() => bookmarkQuestion(cur)}
            >
              <Bookmark className={`w-4 h-4 ${bm.isQ(cur.id) ? 'fill-current' : ''}`} />
            </Button>
          </div>


          <button
            className="w-full text-left"
            onClick={() => answer && hasHinglish && setShowMeaning((v) => !v)}
            title={hasHinglish ? 'Answer ke baad click karo Hinglish meaning ke liye' : undefined}
          >
            <p
              className="text-base font-medium text-slate-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: underlineHtml(cur.question_text) }}
            />
            {answer && hasHinglish && !showMeaning && (
              <span className="inline-flex items-center gap-1 text-[11px] text-sky-600 mt-1">
                <Languages className="w-3 h-3" /> Hinglish meaning ke liye question pe click karo
              </span>
            )}
          </button>

          {answer && showMeaning && hasHinglish && (
            <div className="rounded-md bg-sky-50 border border-sky-200 p-3 text-sm text-slate-700">
              <span className="font-semibold text-sky-800">Meaning: </span>
              {cur.question_hinglish}
            </div>
          )}

          <div className="space-y-2">
            {optionLetters.map((l) => {
              const text = optionText(cur, l);
              if (!text) return null;
              const isCorrect = l === cur.correct_option;
              const isPicked = answer === l;
              const cls = !answer
                ? 'border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50'
                : isCorrect
                  ? 'border-emerald-400 bg-emerald-50'
                  : isPicked
                    ? 'border-rose-400 bg-rose-50'
                    : 'border-slate-200 opacity-80';
              const why = optionWhy(cur, l);
              const usage = optionUsage(cur, l);
              const canExpand = !!answer && perOption && (!!why || !!usage);
              const optBooked = bm.isO(cur.id, text);
              return (
                <div key={l}>
                  <div className="flex items-start gap-1">
                    <button
                      onClick={() => (answer ? (canExpand ? setOpenOpt(openOpt === l ? null : l) : undefined) : pick(l))}
                      className={`flex-1 text-left rounded-lg border px-3 py-2.5 flex items-start gap-3 transition ${cls}`}
                    >
                      <span className="shrink-0 w-6 h-6 rounded-md bg-slate-100 grid place-items-center text-xs font-bold uppercase">{l}</span>
                      <span className="text-sm flex-1" dangerouslySetInnerHTML={{ __html: underlineHtml(text) }} />
                      {answer && isCorrect && <Check className="w-4 h-4 text-emerald-600 mt-0.5" />}
                      {answer && isPicked && !isCorrect && <X className="w-4 h-4 text-rose-600 mt-0.5" />}
                      {canExpand && <ChevronDown className={`w-4 h-4 text-slate-400 mt-0.5 transition ${openOpt === l ? 'rotate-180' : ''}`} />}
                    </button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className={`shrink-0 ${optBooked ? 'text-amber-600' : 'text-slate-300 hover:text-amber-600'}`}
                      title="Bookmark option"
                      onClick={() => bookmarkOption(cur, text)}
                    >
                      <Bookmark className={`w-4 h-4 ${optBooked ? 'fill-current' : ''}`} />
                    </Button>
                  </div>

                  {canExpand && openOpt === l && (
                    <div className={`mt-1 ml-9 rounded-md border p-3 text-sm space-y-1.5 ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50/60 border-rose-200'}`}>
                      {why && <p className="text-slate-700">{why}</p>}
                      {usage && (
                        <p className="text-[13px] text-slate-600 italic">
                          <span className="not-italic font-semibold">Use: </span>
                          {usage}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!answer && cur.hint && (
            <div>
              {showHint ? (
                <div className="rounded-md bg-amber-50 border border-amber-200 p-3 text-sm flex gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{cur.hint}</span>
                </div>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setShowHint(true)}>
                  <Lightbulb className="w-4 h-4 mr-1" /> Hint
                </Button>
              )}
            </div>
          )}

          {answer && (
            <div className="space-y-2 pt-1">
              {perOption && (
                <p className="text-[11px] text-slate-500">Har option pe click karke uska "kyu sahi / kyu galat" dekho.</p>
              )}
              <div className="rounded-md bg-emerald-50 border border-emerald-200 p-3 text-sm">
                <span className="font-semibold text-emerald-800">Correct: </span>
                <span dangerouslySetInnerHTML={{ __html: underlineHtml(cur.correct_answer || cur.correct_option.toUpperCase()) }} />
              </div>
              {cur.correction && (
                <div className="rounded-md bg-teal-50 border border-teal-200 p-3 text-sm">
                  <span className="font-semibold text-teal-800">{cur.error_word} → </span>
                  {cur.correction}
                  {cur.corrected_sentence && <p className="text-slate-600 mt-1">{cur.corrected_sentence}</p>}
                </div>
              )}
              {category === 'spot_error' && (cur.usage_a || cur.usage_b) && (
                <div className="rounded-md bg-indigo-50 border border-indigo-200 p-3 text-sm space-y-1.5">
                  <p className="font-semibold text-indigo-800 text-[12px] uppercase tracking-wide">Usage samjho</p>
                  {cur.usage_a && (
                    <p className="text-slate-700">
                      <span className="font-semibold">{cur.error_word || 'Error word'}: </span>
                      {cur.usage_a}
                    </p>
                  )}
                  {cur.usage_b && (
                    <p className="text-slate-700">
                      <span className="font-semibold">{cur.correction || 'Correction'}: </span>
                      {cur.usage_b}
                    </p>
                  )}
                </div>
              )}
              {cur.hint && (
                <div className="rounded-md bg-amber-50 border border-amber-200 p-3 text-sm flex gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{cur.hint}</span>
                </div>
              )}
              {cur.solution_hinglish && (
                <div className="rounded-md bg-slate-50 border border-slate-200 p-3 text-sm">
                  <span className="font-semibold text-slate-800">Solution: </span>
                  {cur.solution_hinglish}
                </div>
              )}
              {cur.word_meanings && (
                <div className="rounded-md bg-violet-50 border border-violet-200 p-3 text-sm">
                  <span className="font-semibold text-violet-800">Word meanings: </span>
                  {cur.word_meanings}
                </div>
              )}
              {cur.book_solution && !perOption && (
                <details className="rounded-md bg-slate-50 border border-slate-200 p-3 text-sm">
                  <summary className="cursor-pointer font-semibold text-slate-700">Book solution (English)</summary>
                  <p className="mt-1 text-slate-600">{cur.book_solution}</p>
                </details>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-2">
        <Button variant="outline" size="sm" disabled={idx === 0} onClick={() => setIdx((i) => i - 1)}>
          <ArrowLeft className="w-4 h-4 mr-1" />Prev
        </Button>
        {idx < qs.length - 1 ? (
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white" onClick={() => setIdx((i) => i + 1)}>
            Next<ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button size="sm" variant="outline" onClick={() => { setPicked([]); setIdx(0); }}>
            <RotateCcw className="w-4 h-4 mr-1" />Restart
          </Button>
        )}
      </div>
    </div>
  );
}
