import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { fetchBBItems } from '@/lib/blackBookQuiz';
import { Swords, Loader2 } from 'lucide-react';

export default function BlackBookDuelNew() {
  const { user } = useAuth();
  const { toast } = useToast();
  const nav = useNavigate();
  const [category, setCategory] = useState<'mixed' | 'syn_ant' | 'idiom' | 'ows'>('mixed');
  const [loading, setLoading] = useState(false);

  async function create() {
    if (!user) return;
    setLoading(true);
    try {
      const items = await fetchBBItems(category);
      const shuffled = [...items].sort(() => Math.random() - 0.5).slice(0, 10);
      const ids = shuffled.map((i) => i.id);
      const { data, error } = await supabase.from('duel_matches' as never).insert({
        host_id: user.id,
        category,
        status: 'waiting',
        question_ids: ids,
        seconds_per_q: 30,
      } as never).select('id').single();
      if (error) throw error;
      nav(`/ssc/duel/${(data as any).id}`);
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 text-slate-900 p-6 flex items-center justify-center">
      <Card className="bg-white border-emerald-100 shadow-sm max-w-md w-full">
        <CardContent className="p-6 space-y-5">
          <div className="flex items-center gap-3">
            <Swords className="w-8 h-8 text-emerald-600" />
            <h1 className="text-2xl font-bold">Create Duel</h1>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-600">Category</label>
            <Select value={category} onValueChange={(v) => setCategory(v as any)}>
              <SelectTrigger className="bg-white border-emerald-200"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="mixed">Mixed (all 3)</SelectItem>
                <SelectItem value="syn_ant">Synonyms & Antonyms</SelectItem>
                <SelectItem value="idiom">Idioms</SelectItem>
                <SelectItem value="ows">One Word Substitutions</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-xs text-slate-500">10 questions · 30 seconds each · winner = highest score, tie broken by fastest total time</div>
          <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white" onClick={create} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Swords className="w-4 h-4 mr-2" />}
            Create & get invite link
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
