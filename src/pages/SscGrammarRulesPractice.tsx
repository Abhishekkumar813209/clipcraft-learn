import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check, X, Lightbulb, RotateCcw } from 'lucide-react';
import { QuestionNavigator, type QStatus } from '@/components/QuestionNavigator';

interface Row {
  question_id: number;
  rule_id: number;
  question_text: string;
  correct_option: string;
  correct_answer_word: string | null;
  explanation_hinglish: string | null;
  source: string | null;
}

interface Parsed extends Row {
  parts: { letter: string; text: string }[];
}

function parseParts(text: string) {
  const out: { letter: string; text: string }[] = [];
  const re = /([^()]*?)\(([a-d])\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const seg = m[1].replace(/^\s*\/\s*/, '').trim();
    out.push({ letter: m[2], text: seg || '—' });
  }
  return out;
}

export default function SscGrammarRulesPractice() {
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const from = Number(sp.get('from') || 1);
  const to = Number(sp.get('to') || 153);
  const n = Number(sp.get('n') || 20);

  const [qs, setQs] = useState<Parsed[]>([]);
  const [ruleTitles, setRuleTitles] = useState<Record<number, string>>({});
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<(string | null)[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const rows: Row[] = [];
      for (let page = 0; page < 10; page++) {
        const { data } = await supabase.from('ssc_grammar_rule_questions' as never)
          .select('question_id,rule_id,question_text,correct_option,correct_answer_word,explanation_hinglish,source')
          .gte('rule_id', from).lte('rule_id', to)
          .order('rule_id').order('q_order')
          .range(page * 1000, page * 1000 + 999);
        const chunk = (data as unknown as Row[]) || [];
        rows.push(...chunk);
        if (chunk.length < 1000) break;
      }
      const picked = rows.length > n
        ? [...rows].sort(() => Math.random() - 0.5).slice(0, n).sort((a, b) => a.question_id - b.question_id)
        : rows;
      setQs(picked.map(r => ({ ...r, parts: parseParts(r.question_text) })));
      setPicked([]);
      setIdx(0);

      const { data: rl } = await supabase.from('ssc_grammar_rules' as never)
        .select('rule_id,rule_title').gte('rule_id', from).lte('rule_id', to);
      const t: Record<number, string> = {};
      ((rl as unknown as { rule_id: number; rule_title: string }[]) || []).forEach(r => { t[r.rule_id] = r.rule_title; });
      setRuleTitles(t);
      setLoading(false);
    })();
  }, [from, to, n]);

  const cur = qs[idx];
  const answer = picked[idx] ?? null;
  const statuses: QStatus[] = useMemo(
    () => qs.map((q, i) => picked[i] == null ? 'unattempted' : (picked[i] === q.correct_option ? 'correct' : 'wrong')),
    [qs, picked],
  );
  const score = statuses.filter(s => s === 'correct').length;
  const attempted = statuses.filter(s => s !== 'unattempted').length;

  const pick = (letter: string) => {
    if (answer) return;
    setPicked(p => { const c = [...p]; c[idx] = letter; return c; });
  };

  if (loading) return <div className="p-6 text-muted-foreground">Loading questions...</div>;
  if (!qs.length) return (
    <div className="p-6 space-y-4">
      <Button variant="ghost" size="sm" onClick={() => nav('/ssc/english/rules')}><ArrowLeft className="w-4 h-4 mr-1" />Back</Button>
      <p className="text-muted-foreground">Is range me koi question nahi mila.</p>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-4 pb-24">
      <QuestionNavigator total={qs.length} current={idx} statuses={statuses} onSelect={setIdx} title="Grammar Rules Practice" />

      <div className="flex items-center justify-between gap-2">
        <Button variant="ghost" size="sm" onClick={() => nav('/ssc/english/rules')} className="text-slate-700">
          <ArrowLeft className="w-4 h-4 mr-1" />Rules
        </Button>
        <div className="text-sm text-slate-600 mr-12">
          Q {idx + 1}/{qs.length} · <span className="text-emerald-600 font-semibold">{score}</span>/{attempted} correct
        </div>
      </div>

      <Card className="border-emerald-100">
        <CardContent className="p-5 space-y-4">
          <div className="text-[11px] uppercase font-semibold tracking-wide text-emerald-700 bg-emerald-50 inline-block px-2 py-0.5 rounded">
            Rule {cur.rule_id} · {ruleTitles[cur.rule_id] || ''}
          </div>
          <p className="text-sm text-slate-500">Galat part chuno (spot the error):</p>

          <div className="space-y-2">
            {cur.parts.map(p => {
              const isCorrect = p.letter === cur.correct_option;
              const isPicked = answer === p.letter;
              const cls = !answer
                ? 'border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50'
                : isCorrect ? 'border-emerald-400 bg-emerald-50'
                  : isPicked ? 'border-rose-400 bg-rose-50' : 'border-slate-200 opacity-70';
              return (
                <button key={p.letter} onClick={() => pick(p.letter)}
                  className={`w-full text-left rounded-lg border px-3 py-2.5 flex items-start gap-3 transition ${cls}`}>
                  <span className="shrink-0 w-6 h-6 rounded-md bg-slate-100 grid place-items-center text-xs font-bold uppercase">{p.letter}</span>
                  <span className="text-sm flex-1">{p.text}</span>
                  {answer && isCorrect && <Check className="w-4 h-4 text-emerald-600 mt-0.5" />}
                  {answer && isPicked && !isCorrect && <X className="w-4 h-4 text-rose-600 mt-0.5" />}
                </button>
              );
            })}
          </div>

          {answer && (
            <div className="space-y-2 pt-1">
              <div className="rounded-md bg-emerald-50 border border-emerald-200 p-3 text-sm">
                <span className="font-semibold text-emerald-800">Correction: </span>
                {cur.correct_answer_word || '—'}
              </div>
              {cur.explanation_hinglish && (
                <div className="rounded-md bg-slate-50 border border-slate-200 p-3 text-sm flex gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{cur.explanation_hinglish}</span>
                </div>
              )}
              {cur.source && <p className="text-[11px] text-slate-400">{cur.source}</p>}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-2">
        <Button variant="outline" size="sm" disabled={idx === 0} onClick={() => setIdx(i => i - 1)}>
          <ArrowLeft className="w-4 h-4 mr-1" />Prev
        </Button>
        {idx < qs.length - 1 ? (
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white" onClick={() => setIdx(i => i + 1)}>
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
