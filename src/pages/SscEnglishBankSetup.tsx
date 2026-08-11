import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Play, Shuffle } from 'lucide-react';
import { bankMeta, type BankCategory } from '@/lib/sscEnglishBank';

const QUICK = [
  { label: '1 – 20', from: 1, to: 20 },
  { label: '1 – 50', from: 1, to: 50 },
  { label: '10 – 50', from: 10, to: 50 },
  { label: '51 – 100', from: 51, to: 100 },
];

export default function SscEnglishBankSetup() {
  const nav = useNavigate();
  const { category = 'parajumble' } = useParams();
  const meta = bankMeta(category);
  const [max, setMax] = useState(0);
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(20);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('ssc_english_items' as never)
        .select('serial_no')
        .eq('category', category)
        .order('serial_no', { ascending: false })
        .limit(1);
      const m = ((data as unknown as { serial_no: number }[]) || [])[0]?.serial_no || 0;
      setMax(m);
      setTo(Math.min(20, m || 20));
    })();
  }, [category]);

  const start = (order: 'serial' | 'random') =>
    nav(`/ssc/english/bank/${category as BankCategory}/practice?from=${from}&to=${to}&order=${order}`);

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-5">
      <Button variant="ghost" size="sm" onClick={() => nav('/ssc/english')}>
        <ArrowLeft className="w-4 h-4 mr-1" /> SSC English
      </Button>

      <div className="flex items-start gap-3">
        <span className="text-3xl">{meta.emoji}</span>
        <div>
          <h1 className="text-2xl font-bold">{meta.label}</h1>
          <p className="text-sm text-muted-foreground">{meta.blurb}</p>
        </div>
      </div>

      <Card className="border-emerald-100">
        <CardContent className="p-5 space-y-4">
          <div>
            <div className="text-sm font-medium mb-2">Question range chuno (Q1 – Q{max || '…'})</div>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="text-[11px] text-muted-foreground">From</label>
                <Input type="number" min={1} max={max || 1} value={from} onChange={(e) => setFrom(Number(e.target.value))} />
              </div>
              <div className="flex-1">
                <label className="text-[11px] text-muted-foreground">To</label>
                <Input type="number" min={1} max={max || 1} value={to} onChange={(e) => setTo(Number(e.target.value))} />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {QUICK.filter((q) => !max || q.from <= max).map((q) => (
                <Button key={q.label} size="sm" variant="outline" className="border-emerald-200 text-emerald-700"
                  onClick={() => { setFrom(q.from); setTo(Math.min(q.to, max || q.to)); }}>
                  {q.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white" disabled={!max} onClick={() => start('serial')}>
              <Play className="w-4 h-4 mr-1" /> Serial
            </Button>
            <Button variant="outline" className="flex-1" disabled={!max} onClick={() => start('random')}>
              <Shuffle className="w-4 h-4 mr-1" /> Random
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
