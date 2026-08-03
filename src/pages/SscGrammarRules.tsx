import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Play, BookOpen, ChevronDown, Search } from 'lucide-react';

export interface GrammarRule {
  rule_id: number;
  rule_title: string;
  rule_statement_hinglish: string | null;
  rule_details: string | null;
  exception_note: string | null;
  formula_short: string | null;
  examples: string | null;
  difficulty: string | null;
}

const lines = (s?: string | null) =>
  (s || '').split(/\n|(?=\d\))/g).map(x => x.trim()).filter(Boolean);

const diffColor = (d?: string | null) =>
  d === 'Hard' ? 'bg-rose-100 text-rose-700'
    : d === 'Medium' ? 'bg-amber-100 text-amber-700'
      : 'bg-emerald-100 text-emerald-700';

export default function SscGrammarRules() {
  const nav = useNavigate();
  const [rules, setRules] = useState<GrammarRule[]>([]);
  const [counts, setCounts] = useState<Record<number, number>>({});
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<number | null>(null);
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(153);
  const [n, setN] = useState(20);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('ssc_grammar_rules' as never)
        .select('*').order('rule_id');
      setRules((data as unknown as GrammarRule[]) || []);
      const c: Record<number, number> = {};
      for (let page = 0; page < 10; page++) {
        const { data: qs } = await supabase.from('ssc_grammar_rule_questions' as never)
          .select('rule_id').order('question_id').range(page * 1000, page * 1000 + 999);
        const rows = (qs as unknown as { rule_id: number }[]) || [];
        rows.forEach(r => { c[r.rule_id] = (c[r.rule_id] || 0) + 1; });
        if (rows.length < 1000) break;
      }
      setCounts(c);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rules;
    return rules.filter(r =>
      String(r.rule_id) === s ||
      r.rule_title.toLowerCase().includes(s) ||
      (r.rule_statement_hinglish || '').toLowerCase().includes(s) ||
      (r.rule_details || '').toLowerCase().includes(s));
  }, [rules, q]);

  const totalQ = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-5">
      <Button variant="ghost" size="sm" onClick={() => nav('/ssc/english')} className="text-slate-700">
        <ArrowLeft className="w-4 h-4 mr-1" />Back
      </Button>

      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><span className="text-3xl">🚀</span>153 Grammar Rules</h1>
        <p className="text-muted-foreground">{rules.length} rules · {totalQ} PYQ practice questions. Rule padho, phir usi rule ke questions solve karo.</p>
      </div>

      <Card className="border-emerald-100 bg-emerald-50/40">
        <CardContent className="p-4 sm:p-5 space-y-3">
          <h3 className="font-semibold flex items-center gap-2"><Play className="w-4 h-4 text-emerald-600" />Mixed Practice (rule range)</h3>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Rules</span>
              <Input type="number" min={1} max={153} value={from} onChange={e => setFrom(Number(e.target.value))} className="w-20 bg-white" />
              <span className="text-sm text-slate-600">to</span>
              <Input type="number" min={1} max={153} value={to} onChange={e => setTo(Number(e.target.value))} className="w-20 bg-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Questions</span>
              <Input type="number" min={1} max={500} value={n} onChange={e => setN(Number(e.target.value))} className="w-24 bg-white" />
            </div>
            <Button
              className="bg-emerald-600 hover:bg-emerald-500 text-white"
              onClick={() => nav(`/ssc/english/rules/practice?from=${Math.max(1, from)}&to=${Math.max(from, to)}&n=${Math.max(1, n)}`)}
            >
              <Play className="w-4 h-4 mr-2" />Start
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <Input placeholder="Search rule number, title ya keyword..." value={q} onChange={e => setQ(e.target.value)} className="pl-9" />
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading rules...</p>}

      <div className="space-y-3">
        {filtered.map(r => {
          const isOpen = open === r.rule_id;
          return (
            <Card key={r.rule_id} className="border-border">
              <CardContent className="p-0">
                <button
                  className="w-full text-left p-4 flex items-start gap-3"
                  onClick={() => setOpen(isOpen ? null : r.rule_id)}
                >
                  <span className="shrink-0 w-9 h-9 rounded-lg bg-emerald-600 text-white grid place-items-center text-sm font-bold">{r.rule_id}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{r.rule_title}</h3>
                      <span className={`text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded ${diffColor(r.difficulty)}`}>{r.difficulty}</span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">{counts[r.rule_id] || 0} Qs</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{r.rule_statement_hinglish}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 mt-1 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 space-y-4 border-t pt-4">
                    {r.formula_short && (
                      <div className="text-sm font-mono bg-slate-900 text-emerald-300 rounded-md px-3 py-2 overflow-x-auto">
                        {r.formula_short}
                      </div>
                    )}
                    {r.rule_details && (
                      <div>
                        <h4 className="text-xs uppercase font-semibold text-slate-500 mb-1.5">Details</h4>
                        <ul className="space-y-1.5">
                          {lines(r.rule_details).map((l, i) => (
                            <li key={i} className="text-sm flex gap-2"><span className="text-emerald-600">•</span><span>{l}</span></li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {r.exception_note && (
                      <div className="rounded-md bg-amber-50 border border-amber-200 p-3">
                        <h4 className="text-xs uppercase font-semibold text-amber-700 mb-1">Exception</h4>
                        <ul className="space-y-1">
                          {lines(r.exception_note).map((l, i) => (
                            <li key={i} className="text-sm text-amber-900">{l}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {r.examples && (
                      <div>
                        <h4 className="text-xs uppercase font-semibold text-slate-500 mb-1.5">Examples</h4>
                        <ul className="space-y-2">
                          {lines(r.examples).map((l, i) => (
                            <li key={i} className="text-sm bg-emerald-50/60 border border-emerald-100 rounded-md px-3 py-2 leading-relaxed">{l}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white"
                        disabled={!counts[r.rule_id]}
                        onClick={() => nav(`/ssc/english/rules/practice?from=${r.rule_id}&to=${r.rule_id}&n=${counts[r.rule_id] || 10}`)}
                      >
                        <Play className="w-4 h-4 mr-1.5" />Practice {counts[r.rule_id] || 0} questions
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setOpen(null)}>
                        <BookOpen className="w-4 h-4 mr-1.5" />Close
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
