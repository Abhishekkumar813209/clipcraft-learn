import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Sparkles, Sprout } from 'lucide-react';

export default function RbiEnglishVocab() {
  const nav = useNavigate();
  const [total, setTotal] = useState(0);
  const [roots, setRoots] = useState<{ root: string; meaning: string; count: number }[]>([]);
  const [n, setN] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [order, setOrder] = useState<'random' | 'serial'>('random');
  const [diff, setDiff] = useState<'easy' | 'medium' | 'hard'>('easy');

  useEffect(() => {
    supabase.from('rbi_vocab_words' as never)
      .select('root_word,root_meaning')
      .then(({ data }) => {
        const rows = (data as any[]) || [];
        setTotal(rows.length);
        const m = new Map<string, { root: string; meaning: string; count: number }>();
        rows.forEach((r) => {
          const e = m.get(r.root_word) || { root: r.root_word, meaning: r.root_meaning, count: 0 };
          e.count++;
          m.set(r.root_word, e);
        });
        setRoots([...m.values()]);
      });
  }, []);

  const fromN = parseInt(from, 10);
  const toN = parseInt(to, 10);
  const rangeSize = Number.isFinite(fromN) && Number.isFinite(toN) && toN >= fromN ? toN - fromN + 1 : null;
  const parsedN = parseInt(n, 10);
  const validN = Number.isFinite(parsedN) && parsedN > 0 ? parsedN : (rangeSize ?? 20);

  function start() {
    const params = new URLSearchParams({ n: String(validN), order, diff });
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    nav(`/rbi/english/vocab/practice?${params.toString()}`);
  }

  const inputCls = 'px-2 py-1 rounded border border-blue-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400';

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 p-6 text-slate-900">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" size="sm" className="text-slate-700 hover:bg-white" onClick={() => nav('/rbi/english')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>

        <div className="flex items-center gap-3">
          <Sprout className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">Root Word Vocabulary</h1>
            <p className="text-sm text-slate-500">{total} words · {roots.length} roots · Hinglish hints & root tags</p>
          </div>
        </div>

        <Card className="bg-gradient-to-br from-sky-100 to-blue-100 border-blue-100 shadow-sm">
          <CardContent className="p-5 space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700">
              <label htmlFor="n" className="font-medium">Questions:</label>
              <input id="n" type="text" inputMode="numeric" value={n} placeholder="20"
                onChange={(e) => setN(e.target.value.replace(/[^0-9]/g, ''))}
                className={`${inputCls} w-20`} />
              <span className="text-slate-500">default 20 (or full range)</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700">
              <span className="font-medium">Range:</span>
              <input type="text" inputMode="numeric" value={from} placeholder="from"
                onChange={(e) => setFrom(e.target.value.replace(/[^0-9]/g, ''))} className={`${inputCls} w-16`} />
              <span>→</span>
              <input type="text" inputMode="numeric" value={to} placeholder="to"
                onChange={(e) => setTo(e.target.value.replace(/[^0-9]/g, ''))} className={`${inputCls} w-16`} />
              <span className="text-slate-500">optional (serial no, 1–{total})</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700">
              <span className="font-medium">Order:</span>
              {(['random', 'serial'] as const).map((o) => (
                <button key={o} onClick={() => setOrder(o)}
                  className={`px-2 py-1 rounded border ${order === o ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white/70 border-blue-200 text-blue-700'}`}>{o}</button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700">
              <span className="font-medium">Difficulty:</span>
              {(['easy', 'medium', 'hard'] as const).map((d) => (
                <button key={d} onClick={() => setDiff(d)}
                  className={`px-2 py-1 rounded border ${diff === d ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white/70 border-blue-200 text-blue-700'}`}>{d}</button>
              ))}
              {diff === 'hard' && <span className="text-[10px] text-rose-600">Hints hidden</span>}
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white" onClick={start}>
              <Sparkles className="w-4 h-4 mr-1" /> Start practice ({validN} Qs)
            </Button>
          </CardContent>
        </Card>

        <div>
          <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">Roots covered</h3>
          <div className="flex flex-wrap gap-2">
            {roots.map((r) => (
              <Badge key={r.root} variant="outline" className="bg-white/70 border-blue-200 text-blue-800">
                {r.root} — {r.meaning} ({r.count})
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
