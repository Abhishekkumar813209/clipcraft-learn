import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Swords, Target, Sparkles } from 'lucide-react';

const CATS = [
  { key: 'syn_ant', label: 'Synonyms & Antonyms', color: 'from-emerald-100 to-teal-100', total: 107 },
  { key: 'idiom', label: 'Idioms & Phrases', color: 'from-teal-100 to-cyan-100', total: 200 },
  { key: 'ows', label: 'One Word Substitutions', color: 'from-lime-100 to-emerald-100', total: 200 },
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 text-slate-900">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-emerald-600" />
          <div>
            <h1 className="text-3xl font-bold">Black Book Duel</h1>
            <p className="text-sm text-slate-500">507 curated items · Practice solo ya doston se live duel karo</p>
          </div>
        </div>

        <Card className="bg-white/80 border-emerald-100 backdrop-blur shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-emerald-600" />
              <div>
                <div className="text-sm text-slate-500">Aaj ka target</div>
                <div className="text-xl font-semibold text-slate-900">{totalAttempted} / {totalTarget}</div>
              </div>
            </div>
            <div className="w-48 h-3 bg-emerald-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all" style={{ width: `${Math.min(100, (totalAttempted / totalTarget) * 100)}%` }} />
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-4">
          {CATS.map((c) => {
            const p = progress[c.key];
            const target = p?.target ?? 20;
            const done = p?.attempted ?? 0;
            return (
              <Card key={c.key} className={`bg-gradient-to-br ${c.color} border-emerald-100 shadow-sm`}>
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">{c.label}</h3>
                    <Badge className="bg-white/70 text-emerald-700 border border-emerald-200">{c.total}</Badge>
                  </div>
                  <div className="text-xs text-slate-600">Today: {done} / {target} · {p?.correct ?? 0} correct</div>
                  <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, (done / target) * 100)}%` }} />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Link to={`/ssc/blackbook/browse/${c.key}`} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full bg-white/70 border-emerald-200 text-emerald-700 hover:bg-white">
                        <BookOpen className="w-4 h-4 mr-1" /> Browse
                      </Button>
                    </Link>
                    <Link to={`/ssc/blackbook/practice/${c.key}`} className="flex-1">
                      <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white">
                        <Sparkles className="w-4 h-4 mr-1" /> Practice
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-gradient-to-br from-teal-100 to-emerald-100 border-emerald-200 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Swords className="w-8 h-8 text-teal-700" />
              <div>
                <div className="text-lg font-bold text-slate-900">1v1 Live Duel</div>
                <div className="text-sm text-slate-600">Dost ko invite bhejo, ek saath khelo, real-time score dekho</div>
              </div>
            </div>
            <Link to="/ssc/duel/new"><Button className="bg-emerald-600 hover:bg-emerald-500 text-white">Create Duel</Button></Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
