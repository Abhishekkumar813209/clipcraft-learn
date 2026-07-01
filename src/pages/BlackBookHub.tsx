import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Swords, Target, Sparkles } from 'lucide-react';

const CATS = [
  { key: 'syn_ant', label: 'Synonyms & Antonyms', color: 'from-blue-500/20 to-cyan-500/20', total: 107 },
  { key: 'idiom', label: 'Idioms & Phrases', color: 'from-indigo-500/20 to-purple-500/20', total: 200 },
  { key: 'ows', label: 'One Word Substitutions', color: 'from-sky-500/20 to-blue-500/20', total: 200 },
] as const;

interface Progress { category: string; attempted: number; correct: number; target: number; }

export default function BlackBookHub() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Record<string, Progress>>({});

  useEffect(() => {
    if (!user) return;
    const today = new Date().toISOString().slice(0, 10);
    supabase.from('black_book_daily_progress' as never).select('*').eq('user_id', user.id).eq('date', today)
      .then(({ data }) => {
        const map: Record<string, Progress> = {};
        ((data as Progress[]) || []).forEach((p) => { map[p.category] = p; });
        setProgress(map);
      });
  }, [user]);

  const totalAttempted = Object.values(progress).reduce((s, p) => s + p.attempted, 0);
  const totalTarget = 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/40 to-slate-950 p-6 text-slate-100">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-blue-400" />
          <div>
            <h1 className="text-3xl font-bold">Black Book Duel</h1>
            <p className="text-sm text-slate-400">507 curated items · Practice solo ya doston se live duel karo</p>
          </div>
        </div>

        <Card className="bg-slate-900/60 border-blue-900/40 backdrop-blur">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-emerald-400" />
              <div>
                <div className="text-sm text-slate-400">Aaj ka target</div>
                <div className="text-xl font-semibold">{totalAttempted} / {totalTarget}</div>
              </div>
            </div>
            <div className="w-48 h-3 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all" style={{ width: `${Math.min(100, (totalAttempted / totalTarget) * 100)}%` }} />
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-4">
          {CATS.map((c) => {
            const p = progress[c.key];
            const target = p?.target ?? 20;
            const done = p?.attempted ?? 0;
            return (
              <Card key={c.key} className={`bg-gradient-to-br ${c.color} border-blue-900/40 backdrop-blur`}>
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{c.label}</h3>
                    <Badge variant="secondary">{c.total}</Badge>
                  </div>
                  <div className="text-xs text-slate-300">Today: {done} / {target} · {p?.correct ?? 0} correct</div>
                  <div className="h-1.5 bg-slate-900/60 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400" style={{ width: `${Math.min(100, (done / target) * 100)}%` }} />
                  </div>
                  <Link to={`/ssc/blackbook/practice/${c.key}`}>
                    <Button size="sm" className="w-full mt-2">
                      <Sparkles className="w-4 h-4 mr-1" /> Practice
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-purple-800/40">
          <CardContent className="p-5 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Swords className="w-8 h-8 text-pink-400" />
              <div>
                <div className="text-lg font-bold">1v1 Live Duel</div>
                <div className="text-sm text-slate-300">Dost ko invite bhejo, ek saath khelo, real-time score dekho</div>
              </div>
            </div>
            <Link to="/ssc/duel/new"><Button className="bg-pink-600 hover:bg-pink-500">Create Duel</Button></Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
