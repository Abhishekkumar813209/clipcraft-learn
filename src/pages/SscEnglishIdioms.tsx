import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, BookOpen, Sparkles, Target } from 'lucide-react';

interface Progress { category: string; subcategory?: string | null; attempted: number; correct: number; target: number; }

const GROUPS = [
  {
    key: 'top_100',
    label: 'Top 100 Idioms',
    tagline: 'Most-repeated SSC idioms with curated hints',
    color: 'from-emerald-100 to-teal-100',
    total: 200,
    quiz: 20,
    target: 20,
  },
  {
    key: 'all',
    label: 'All Idioms & Phrases',
    tagline: 'Grand Master list — 500+ full PYQ pool',
    color: 'from-teal-100 to-cyan-100',
    total: 539,
    quiz: 50,
    target: 50,
  },
] as const;

export default function SscEnglishIdioms() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [prog, setProg] = useState<Record<string, Progress>>({});

  useEffect(() => {
    supabase.from('ssc_black_book_items' as never)
      .select('subcategory')
      .eq('category', 'idiom')
      .then(({ data }) => {
        const c: Record<string, number> = {};
        ((data as any[]) || []).forEach((r) => {
          const k = r.subcategory || 'top_100';
          c[k] = (c[k] || 0) + 1;
        });
        setCounts(c);
      });
  }, []);

  useEffect(() => {
    if (!user) return;
    const today = new Date().toISOString().slice(0, 10);
    supabase.from('black_book_daily_progress' as never)
      .select('*').eq('user_id', user.id).eq('date', today).eq('category', 'idiom')
      .then(({ data }) => {
        const m: Record<string, Progress> = {};
        ((data as Progress[]) || []).forEach((p) => {
          m[(p as any).subcategory || 'top_100'] = p;
        });
        setProg(m);
      });
  }, [user]);

  const totalAttempted = Object.values(prog).reduce((s, p) => s + p.attempted, 0);
  const totalTarget = GROUPS.reduce((s, g) => s + g.target, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 text-slate-900">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" className="text-slate-700 hover:bg-white" onClick={() => nav('/ssc/english')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-emerald-600" />
          <div>
            <h1 className="text-3xl font-bold">Idioms & Phrases</h1>
            <p className="text-sm text-slate-500">Do sets: Top 100 (curated hints) or the Grand Master pool (500+)</p>
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

        <div className="grid md:grid-cols-2 gap-4">
          {GROUPS.map((g) => {
            const count = counts[g.key] ?? g.total;
            return (
              <Card key={g.key} className={`bg-gradient-to-br ${g.color} border-emerald-100 shadow-sm`}>
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">{g.label}</h3>
                      <p className="text-xs text-slate-600 mt-0.5">{g.tagline}</p>
                    </div>
                    <Badge className="bg-white/70 text-emerald-700 border border-emerald-200">{count}</Badge>
                  </div>
                  <div className="text-xs text-slate-600">Quiz size: {g.quiz} questions per session</div>

                  <div className="flex gap-2 pt-1">
                    <Link to={`/ssc/blackbook/browse/idiom?sub=${g.key}`} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full bg-white/70 border-emerald-200 text-emerald-700 hover:bg-white">
                        <BookOpen className="w-4 h-4 mr-1" /> Browse
                      </Button>
                    </Link>
                    <Link to={`/ssc/blackbook/practice/idiom?sub=${g.key}&n=${g.quiz}`} className="flex-1">
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
      </div>
    </div>
  );
}
