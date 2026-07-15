import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function SscPosVerbBasic() {
  const nav = useNavigate();
  const [total, setTotal] = useState(0);
  const [n, setN] = useState(20);

  useEffect(() => {
    supabase.from('ssc_pos_spot_error' as never)
      .select('id', { count: 'exact', head: true })
      .eq('pos', 'verb').eq('level', 'basic')
      .then(({ count }) => setTotal(count || 0));
  }, []);

  const capped = Math.max(1, Math.min(n || 1, total || 1));

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" onClick={() => nav(-1)} className="text-slate-700">
        <ArrowLeft className="w-4 h-4 mr-1" />Back
      </Button>
      <div>
        <h1 className="text-2xl font-bold">Verb · Basic</h1>
        <p className="text-muted-foreground">Spot the error in each sentence.</p>
      </div>
      <Card className="border-emerald-100">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Spot the Error</h3>
              <p className="text-sm text-muted-foreground">{total} questions in pool · each with hint, solution & 3 similar drills</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-600">Number of questions</label>
            <Input
              type="number" min={1} max={total || 1} value={n}
              onChange={(e) => setN(Number(e.target.value))}
              className="w-24"
            />
            <span className="text-xs text-slate-500">max {total}</span>
          </div>
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
            onClick={() => nav(`/ssc/english/parts-of-speech/verb/basic/practice?n=${capped}`)}
            disabled={!total}
          >
            <Play className="w-4 h-4 mr-2" />Start Practice
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
