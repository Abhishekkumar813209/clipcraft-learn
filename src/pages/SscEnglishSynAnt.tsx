import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, BookOpen, Sparkles, Target, Shuffle, Plus, Minus } from 'lucide-react';

interface Progress { attempted: number; correct: number; }

type GroupKey = string;

interface Group {
  key: GroupKey;
  section: 'mixed' | 'synonym' | 'antonym';
  label: string;
  tagline: string;
  color: string;
  total: number;
  defaultQuiz: number;
  href: (n: number) => string;
}

const GROUPS: Group[] = [
  { key: 'mixed_top', section: 'mixed', label: 'Top 100 Mixed', tagline: 'Curated syn+ant pool from Black Book', color: 'from-emerald-100 to-teal-100', total: 107, defaultQuiz: 20,
    href: (n) => `/ssc/blackbook/practice/syn_ant?n=${n}` },
  { key: 'mixed_all', section: 'mixed', label: 'All Repeated Mixed', tagline: 'Random syn+ant pull from full pool (2400+)', color: 'from-teal-100 to-cyan-100', total: 2464, defaultQuiz: 50,
    href: (n) => `/ssc/english/synant/practice?mode=mixed&sub=all_repeated&n=${n}` },
  { key: 'syn_top', section: 'synonym', label: 'Top 100 Synonyms', tagline: 'Most-repeated synonyms in SSC PYQs', color: 'from-emerald-100 to-teal-100', total: 100, defaultQuiz: 20,
    href: (n) => `/ssc/english/synant/practice?mode=synonym&sub=top_100&n=${n}` },
  { key: 'syn_all', section: 'synonym', label: 'All Repeated Synonyms', tagline: 'Grand Master synonyms pool (1300+)', color: 'from-teal-100 to-cyan-100', total: 1322, defaultQuiz: 50,
    href: (n) => `/ssc/english/synant/practice?mode=synonym&sub=all_repeated&n=${n}` },
  { key: 'ant_top', section: 'antonym', label: 'Top 100 Antonyms', tagline: 'Most-repeated antonyms in SSC PYQs', color: 'from-emerald-100 to-teal-100', total: 100, defaultQuiz: 20,
    href: (n) => `/ssc/english/synant/practice?mode=antonym&sub=top_100&n=${n}` },
  { key: 'ant_all', section: 'antonym', label: 'All Repeated Antonyms', tagline: 'Grand Master antonyms pool (1100+)', color: 'from-teal-100 to-cyan-100', total: 1142, defaultQuiz: 50,
    href: (n) => `/ssc/english/synant/practice?mode=antonym&sub=all_repeated&n=${n}` },
];

const SECTIONS: { key: 'mixed'|'synonym'|'antonym'; title: string; icon: React.ReactNode }[] = [
  { key: 'mixed', title: 'Mixed (Synonyms + Antonyms)', icon: <Shuffle className="w-5 h-5 text-emerald-600" /> },
  { key: 'synonym', title: 'Synonyms', icon: <Plus className="w-5 h-5 text-emerald-600" /> },
  { key: 'antonym', title: 'Antonyms', icon: <Minus className="w-5 h-5 text-emerald-600" /> },
];

export default function SscEnglishSynAnt() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [prog, setProg] = useState<Progress>({ attempted: 0, correct: 0 });
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
    supabase.from('ssc_syn_ant_items' as never).select('kind,subcategory')
      .then(({ data }) => {
        const c: Record<string, number> = {};
        ((data as any[]) || []).forEach((r) => {
          const k = `${r.kind}_${r.subcategory}`;
          c[k] = (c[k] || 0) + 1;
        });
        setCounts(c);
      });
    supabase.from('ssc_black_book_items' as never).select('id', { count: 'exact', head: true }).eq('category', 'syn_ant')
      .then(({ count }) => setCounts((c) => ({ ...c, mixed_top_count: count || 0 })));
  }, []);

  useEffect(() => {
    if (!user) return;
    const today = new Date().toISOString().slice(0, 10);
    supabase.from('black_book_daily_progress' as never)
      .select('attempted,correct').eq('user_id', user.id).eq('date', today).eq('category', 'syn_ant')
      .then(({ data }) => {
        const rows = (data as Progress[]) || [];
        setProg({
          attempted: rows.reduce((s, r) => s + (r.attempted || 0), 0),
          correct: rows.reduce((s, r) => s + (r.correct || 0), 0),
        });
      });
  }, [user]);

  function countFor(g: Group): number {
    if (g.key === 'mixed_top') return counts.mixed_top_count ?? g.total;
    if (g.key === 'mixed_all') return (counts.synonym_all_repeated || 0) + (counts.antonym_all_repeated || 0) || g.total;
    if (g.key === 'syn_top') return counts.synonym_top_100 ?? g.total;
    if (g.key === 'syn_all') return counts.synonym_all_repeated ?? g.total;
    if (g.key === 'ant_top') return counts.antonym_top_100 ?? g.total;
    if (g.key === 'ant_all') return counts.antonym_all_repeated ?? g.total;
    return g.total;
  }

  const totalTarget = 100;

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
            <h1 className="text-3xl font-bold">Synonyms & Antonyms</h1>
            <p className="text-sm text-slate-500">Pick mixed sets or focus on synonyms / antonyms — Top 100 curated or Grand Master pool</p>
          </div>
        </div>

        <Card className="bg-white/80 border-emerald-100 backdrop-blur shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-emerald-600" />
              <div>
                <div className="text-sm text-slate-500">Aaj ka target</div>
                <div className="text-xl font-semibold">{prog.attempted} / {totalTarget}</div>
              </div>
            </div>
            <div className="w-48 h-3 bg-emerald-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all" style={{ width: `${Math.min(100, (prog.attempted / totalTarget) * 100)}%` }} />
            </div>
          </CardContent>
        </Card>

        {SECTIONS.map((sec) => (
          <div key={sec.key} className="space-y-3">
            <div className="flex items-center gap-2 text-slate-800">
              {sec.icon}
              <h2 className="font-semibold">{sec.title}</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {GROUPS.filter((g) => g.section === sec.key).map((g) => {
                const rawN = nMap[g.key] ?? '';
                const parsedN = parseInt(rawN, 10);
                const validN = Number.isFinite(parsedN) && parsedN > 0 ? parsedN : g.defaultQuiz;
                return (
                  <Card key={g.key} className={`bg-gradient-to-br ${g.color} border-emerald-100 shadow-sm`}>
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{g.label}</h3>
                          <p className="text-xs text-slate-600 mt-0.5">{g.tagline}</p>
                        </div>
                        <Badge className="bg-white/70 text-emerald-700 border border-emerald-200">{countFor(g)}</Badge>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-700">
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
                        <span className="text-slate-500">(default {g.defaultQuiz})</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700">
                        <span className="font-medium">Order:</span>
                        {(['random', 'serial'] as const).map((o) => (
                          <button key={o} onClick={() => setOrderMap((m) => ({ ...m, [g.key]: o }))}
                            className={`px-2 py-1 rounded border ${orderMap[g.key] === o ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white/70 border-emerald-200 text-emerald-700'}`}>
                            {o}
                          </button>
                        ))}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700">
                        <span className="font-medium">Difficulty:</span>
                        {(['easy', 'medium', 'hard'] as const).map((d) => (
                          <button key={d} onClick={() => setDiffMap((m) => ({ ...m, [g.key]: d }))}
                            className={`px-2 py-1 rounded border ${diffMap[g.key] === d ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white/70 border-emerald-200 text-emerald-700'}`}>
                            {d}
                          </button>
                        ))}
                        {diffMap[g.key] === 'hard' && <span className="text-[10px] text-rose-600">Hints hidden</span>}
                      </div>

                      <div className="pt-1">
                        <Link to={`${g.href(validN)}&order=${orderMap[g.key]}&diff=${diffMap[g.key]}`}>
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
        ))}
      </div>
    </div>
  );
}
