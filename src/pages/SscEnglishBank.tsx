import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Play, Shuffle } from 'lucide-react';
import { BANK_CATEGORIES, type BankCategory } from '@/lib/sscEnglishBank';

export default function SscEnglishBank() {
  const nav = useNavigate();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [maxSerial, setMaxSerial] = useState<Record<string, number>>({});
  const [open, setOpen] = useState<BankCategory | null>(null);
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(50);

  useEffect(() => {
    (async () => {
      const c: Record<string, number> = {};
      const m: Record<string, number> = {};
      await Promise.all(
        BANK_CATEGORIES.map(async (cat) => {
          const { count } = await supabase
            .from('ssc_english_items' as never)
            .select('id', { count: 'exact', head: true })
            .eq('category', cat.key);
          c[cat.key] = count || 0;
          const { data } = await supabase
            .from('ssc_english_items' as never)
            .select('serial_no')
            .eq('category', cat.key)
            .order('serial_no', { ascending: false })
            .limit(1);
          m[cat.key] = ((data as unknown as { serial_no: number }[]) || [])[0]?.serial_no || 0;
        }),
      );
      setCounts(c);
      setMaxSerial(m);
    })();
  }, []);

  const start = (cat: BankCategory, order: 'serial' | 'random') =>
    nav(`/ssc/english/bank/${cat}/practice?from=${from}&to=${to}&order=${order}`);

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-5">
      <Button variant="ghost" size="sm" onClick={() => nav('/ssc/english')}>
        <ArrowLeft className="w-4 h-4 mr-1" /> SSC English
      </Button>

      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">📝 PYQ Question Bank</h1>
        <p className="text-muted-foreground text-sm">
          Error Detection · Sentence Improvement · Fill in the Blanks · Cloze Test — sab PYQ, Hinglish solution ke saath.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {BANK_CATEGORIES.map((c) => {
          const isOpen = open === c.key;
          const max = maxSerial[c.key] || 1;
          return (
            <Card key={c.key} className="border-border hover:border-emerald-300 transition-colors">
              <CardContent className="p-5 space-y-3">
                <button
                  className="w-full text-left flex items-start gap-3"
                  onClick={() => {
                    setOpen(isOpen ? null : c.key);
                    setFrom(1);
                    setTo(Math.min(50, max));
                  }}
                >
                  <span className="text-3xl">{c.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">{c.label}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{c.blurb}</p>
                    <p className="text-xs text-emerald-700 mt-1 font-medium">{counts[c.key] ?? '…'} questions</p>
                  </div>
                </button>

                {isOpen && (
                  <div className="space-y-3 pt-1 border-t">
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <label className="text-[11px] text-muted-foreground">From</label>
                        <Input type="number" min={1} max={max} value={from} onChange={(e) => setFrom(Number(e.target.value))} />
                      </div>
                      <div className="flex-1">
                        <label className="text-[11px] text-muted-foreground">To (max {max})</label>
                        <Input type="number" min={1} max={max} value={to} onChange={(e) => setTo(Number(e.target.value))} />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white flex-1" onClick={() => start(c.key, 'serial')}>
                        <Play className="w-4 h-4 mr-1" /> Serial
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => start(c.key, 'random')}>
                        <Shuffle className="w-4 h-4 mr-1" /> Random
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
