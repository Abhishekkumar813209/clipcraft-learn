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
    key: 'top_200',
    label: 'Top 200 Idioms',
    tagline: 'Most-repeated SSC idioms with curated hints',
    color: 'from-emerald-100 to-teal-100',
    total: 200,
    defaultQuiz: 20,
    target: 50,
  },
  {
    key: 'all_repeated',
    label: 'All Repeated Idioms',
    tagline: 'Grand Master list — 800+ SSC PYQ pool with hints',
    color: 'from-teal-100 to-cyan-100',
    total: 813,
    defaultQuiz: 50,
    target: 50,
  },
] as const;

export default function SscEnglishIdioms() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [prog, setProg] = useState<Record<string, Progress>>({});
  const [nMap, setNMap] = useState<Record<string, string>>(() =>
    Object.fromEntries(GROUPS.map((g) => [g.key, '']))
  );
  const [fromMap, setFromMap] = useState<Record<string, string>>(() =>
    Object.fromEntries(GROUPS.map((g) => [g.key, '']))
  );
  const [toMap, setToMap] = useState<Record<string, string>>(() =>
    Object.fromEntries(GROUPS.map((g) => [g.key, '']))
  );
  const [orderMap, setOrderMap] = useState<Record<string, 'random' | 'serial'>>(() =>
    Object.fromEntries(GROUPS.map((g) => [g.key, 'random' as const]))
  );
  const [diffMap, setDiffMap] = useState<Record<string, 'easy' | 'medium' | 'hard'>>(() =>
    Object.fromEntries(GROUPS.map((g) => [g.key, 'easy' as const]))
  );

  useEffect(() => {
    supabase.from('ssc_black_book_items' as never)
      .select('subcategory')
      .eq('category', 'idiom')
      .then(({ data }) => {
        const c: Record<string, number> = {};
        ((data as any[]) || []).forEach((r) => {
          const k = r.subcategory || 'top_200';
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
          m[(p as any).subcategory || 'top_200'] = p;
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
            <p className="text-sm text-slate-500">Do sets: Top 200 (curated hints) or the Grand Master pool (500+)</p>
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
            const rawN = nMap[g.key] ?? '';
            const parsedN = parseInt(rawN, 10);
            const validN = Number.isFinite(parsedN) && parsedN > 0 ? parsedN : g.defaultQuiz;
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

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700">
                    <label htmlFor={`n-${g.key}`}>Questions:</label>
                    <input
                      id={`n-${g.key}`}
                      type="text"
                      inputMode="numeric"
                      value={rawN}
                      onChange={(e) => setNMap((m) => ({ ...m, [g.key]: e.target.value.replace(/[^0-9]/g, '') }))}
                      className="w-20 px-2 py-1 rounded border border-emerald-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder={String(g.defaultQuiz)}
                    />
                    <span className="text-slate-500">default {g.defaultQuiz}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700">
                    <span className="font-medium">Range:</span>
                    <input
                      type="text" inputMode="numeric"
                      value={fromMap[g.key] ?? ''}
                      onChange={(e) => setFromMap((m) => ({ ...m, [g.key]: e.target.value.replace(/[^0-9]/g, '') }))}
                      className="w-16 px-2 py-1 rounded border border-emerald-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="from"
                    />
                    <span>→</span>
                    <input
                      type="text" inputMode="numeric"
                      value={toMap[g.key] ?? ''}
                      onChange={(e) => setToMap((m) => ({ ...m, [g.key]: e.target.value.replace(/[^0-9]/g, '') }))}
                      className="w-16 px-2 py-1 rounded border border-emerald-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="to"
                    />
                    <span className="text-slate-500">optional (serial no)</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700">
                    <span className="font-medium">Order:</span>
                    {(['random', 'serial'] as const).map((o) => (
                      <button
                        key={o}
                        onClick={() => setOrderMap((m) => ({ ...m, [g.key]: o }))}
                        className={`px-2 py-1 rounded border ${orderMap[g.key] === o ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white/70 border-emerald-200 text-emerald-700'}`}
                      >{o}</button>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700">
                    <span className="font-medium">Difficulty:</span>
                    {(['easy', 'medium', 'hard'] as const).map((d) => (
                      <button
                        key={d}
                        onClick={() => setDiffMap((m) => ({ ...m, [g.key]: d }))}
                        className={`px-2 py-1 rounded border ${diffMap[g.key] === d ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white/70 border-emerald-200 text-emerald-700'}`}
                      >{d}</button>
                    ))}
                    {diffMap[g.key] === 'hard' && <span className="text-[10px] text-rose-600">Hints hidden</span>}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Link to={`/ssc/blackbook/browse/idiom?sub=${g.key}`} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full bg-white/70 border-emerald-200 text-emerald-700 hover:bg-white">
                        <BookOpen className="w-4 h-4 mr-1" /> Browse
                      </Button>
                    </Link>
                    <Link to={`/ssc/blackbook/practice/idiom?sub=${g.key}&n=${validN}&order=${orderMap[g.key]}&diff=${diffMap[g.key]}`} className="flex-1">
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
