import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const META: Record<string, { label: string; mode?: 'mcq'; mcqPrompt?: string }> = {
  verb: { label: 'Verb' },
  tense: { label: 'Tense' },
  passive_voice: { label: 'Passive Voice' },
  passive_voice_mcq: { label: 'Passive Voice · MCQs', mode: 'mcq', mcqPrompt: 'Choose the correct passive form for each sentence.' },
  narration_spot: { label: 'Narration · Spot the Error' },
  narration_mcq: { label: 'Narration · MCQs', mode: 'mcq', mcqPrompt: 'Choose the correct direct/indirect speech form.' },
};

export default function SscGrammarSetup() {
  const nav = useNavigate();
  const { pos = 'verb' } = useParams();
  const label = META[pos]?.label ?? pos;
  const isMcq = META[pos]?.mode === 'mcq';
  const [total, setTotal] = useState(0);
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(20);

  useEffect(() => {
    supabase.from('ssc_pos_spot_error' as never)
      .select('id', { count: 'exact', head: true })
      .eq('pos', pos).eq('level', 'basic')
      .then(({ count }) => { setTotal(count || 0); setTo(Math.min(20, count || 20)); });
  }, [pos]);

  const f = Math.max(1, Math.min(from || 1, total || 1));
  const t = Math.max(f, Math.min(to || f, total || f));

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" onClick={() => nav(-1)} className="text-slate-700">
        <ArrowLeft className="w-4 h-4 mr-1" />Back
      </Button>
      <div>
        <h1 className="text-2xl font-bold">{label} · Basic</h1>
        <p className="text-muted-foreground">{isMcq ? (META[pos]?.mcqPrompt || 'Choose the correct option.') : 'Spot the error in each sentence.'}</p>
      </div>
      <Card className="border-emerald-100">
        <CardContent className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold">{isMcq ? 'MCQs' : 'Spot the Error'}</h3>
            <p className="text-sm text-muted-foreground">Har question ke saath hint, solution & 3 similar drills</p>
          </div>
          <div>
            <div className="text-sm font-medium mb-2">Question range chuno (Q1 – Q{total || '…'})</div>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="text-[11px] text-muted-foreground">From</label>
                <Input type="number" min={1} max={total || 1} value={from} onChange={(e) => setFrom(Number(e.target.value))} />
              </div>
              <div className="flex-1">
                <label className="text-[11px] text-muted-foreground">To</label>
                <Input type="number" min={1} max={total || 1} value={to} onChange={(e) => setTo(Number(e.target.value))} />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {[[1, 20], [10, 50], [1, 50], [51, 100]].filter(([a]) => a <= (total || 0)).map(([a, b]) => (
                <Button key={`${a}-${b}`} size="sm" variant="outline" className="border-emerald-200 text-emerald-700"
                  onClick={() => { setFrom(a); setTo(Math.min(b, total || b)); }}>
                  {a} – {b}
                </Button>
              ))}
            </div>
          </div>
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
            onClick={() => nav(`/ssc/english/grammar/${pos}/basic/practice?from=${f}&to=${t}`)}
            disabled={!total}
          >
            <Play className="w-4 h-4 mr-2" />Start Practice ({t - f + 1} questions)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

