import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check, X, Lightbulb, RotateCcw, Brain } from 'lucide-react';
import { QuestionNavigator, type QStatus } from '@/components/QuestionNavigator';
import { ruleDrills, buildDrillQuestions, type DrillQuestion } from '@/data/grammarRuleDrills';

export default function SscGrammarRuleDrill() {
  const nav = useNavigate();
  const [sp, setSp] = useSearchParams();
  const ruleId = Number(sp.get('rule') || 1);
  const drillIdx = Number(sp.get('d') || 0);
  const drills = ruleDrills[ruleId] || [];
  const drill = drills[drillIdx];

  const [title, setTitle] = useState('');
  const [qs, setQs] = useState<DrillQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<(number | null)[]>([]);

  useEffect(() => {
    supabase.from('ssc_grammar_rules' as never)
      .select('rule_title').eq('rule_id', ruleId).maybeSingle()
      .then(({ data }) => setTitle((data as unknown as { rule_title?: string })?.rule_title || ''));
  }, [ruleId]);

  useEffect(() => {
    if (!drill) return;
    setQs(buildDrillQuestions(drill, 30));
    setPicked([]);
    setIdx(0);
  }, [drill]);

  const statuses: QStatus[] = useMemo(
    () => qs.map((q, i) => picked[i] == null ? 'unattempted' : (picked[i] === q.answer ? 'correct' : 'wrong')),
    [qs, picked],
  );
  const score = statuses.filter(s => s === 'correct').length;
  const attempted = statuses.filter(s => s !== 'unattempted').length;

  if (!drill) return (
    <div className="p-6 space-y-4">
      <Button variant="ghost" size="sm" onClick={() => nav('/ssc/english/rules')}><ArrowLeft className="w-4 h-4 mr-1" />Back</Button>
      <p className="text-muted-foreground">Is rule ke liye abhi memory drills available nahi hain (rules 1–20 tak hain).</p>
    </div>
  );

  const cur = qs[idx];
  const answer = picked[idx] ?? null;
  const pick = (i: number) => {
    if (answer != null) return;
    setPicked(p => { const c = [...p]; c[idx] = i; return c; });
  };

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-4 pb-24">
      <QuestionNavigator total={qs.length} current={idx} statuses={statuses} onSelect={setIdx} title="Rule Memory Drill" />

      <div className="flex items-center justify-between gap-2">
        <Button variant="ghost" size="sm" onClick={() => nav('/ssc/english/rules')} className="text-slate-700">
          <ArrowLeft className="w-4 h-4 mr-1" />Rules
        </Button>
        <div className="text-sm text-slate-600 mr-12">
          Q {idx + 1}/{qs.length} · <span className="text-emerald-600 font-semibold">{score}</span>/{attempted} correct
        </div>
      </div>

      <div>
        <h1 className="text-lg font-bold flex items-center gap-2">
          <Brain className="w-5 h-5 text-indigo-600" />Rule {ruleId} · {title}
        </h1>
        {drills.length > 1 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {drills.map((d, i) => (
              <button key={i}
                onClick={() => setSp({ rule: String(ruleId), d: String(i) })}
                className={`text-xs px-2.5 py-1 rounded-full border ${i === drillIdx ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-card border-border text-slate-600'}`}>
                {d.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {cur && (
        <Card className="border-indigo-100">
          <CardContent className="p-5 space-y-4">
            <div className="text-[11px] uppercase font-semibold tracking-wide text-indigo-700 bg-indigo-50 inline-block px-2 py-0.5 rounded">
              {drill.title}
            </div>
            <p className="text-base font-medium text-slate-800 leading-relaxed">{cur.question}</p>

            <div className="space-y-2">
              {cur.options.map((opt, i) => {
                const isCorrect = i === cur.answer;
                const isPicked = answer === i;
                const cls = answer == null
                  ? 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50'
                  : isCorrect ? 'border-emerald-400 bg-emerald-50'
                    : isPicked ? 'border-rose-400 bg-rose-50' : 'border-slate-200 opacity-70';
                return (
                  <button key={i} onClick={() => pick(i)}
                    className={`w-full text-left rounded-lg border px-3 py-2.5 flex items-start gap-3 transition ${cls}`}>
                    <span className="shrink-0 w-6 h-6 rounded-md bg-slate-100 grid place-items-center text-xs font-bold uppercase">
                      {String.fromCharCode(97 + i)}
                    </span>
                    <span className="text-sm flex-1">{opt}</span>
                    {answer != null && isCorrect && <Check className="w-4 h-4 text-emerald-600 mt-0.5" />}
                    {answer != null && isPicked && !isCorrect && <X className="w-4 h-4 text-rose-600 mt-0.5" />}
                  </button>
                );
              })}
            </div>

            {answer != null && (cur.why || drill.note) && (
              <div className="rounded-md bg-slate-50 border border-slate-200 p-3 text-sm space-y-1">
                {cur.why && <div className="flex gap-2"><Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" /><span>{cur.why}</span></div>}
                {'note' in drill && drill.note && <p className="text-xs text-slate-500">{drill.note}</p>}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between gap-2">
        <Button variant="outline" size="sm" disabled={idx === 0} onClick={() => setIdx(i => i - 1)}>
          <ArrowLeft className="w-4 h-4 mr-1" />Prev
        </Button>
        {idx < qs.length - 1 ? (
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white" onClick={() => setIdx(i => i + 1)}>
            Next<ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button size="sm" variant="outline" onClick={() => { setQs(buildDrillQuestions(drill, 30)); setPicked([]); setIdx(0); }}>
            <RotateCcw className="w-4 h-4 mr-1" />New set
          </Button>
        )}
      </div>
    </div>
  );
}
