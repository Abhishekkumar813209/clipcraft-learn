import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2, Search, Sparkles, ChevronDown, ChevronRight } from 'lucide-react';
import { fetchAllRootWords, RootWord } from '@/lib/rootWordsQuiz';

export default function SscRoots() {
  const nav = useNavigate();
  const [words, setWords] = useState<RootWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [openRoots, setOpenRoots] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchAllRootWords().then(w => { setWords(w); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const grouped = useMemo(() => {
    const s = q.trim().toLowerCase();
    const filtered = s
      ? words.filter(w =>
          w.root.toLowerCase().includes(s) ||
          w.word.toLowerCase().includes(s) ||
          (w.root_meaning || '').toLowerCase().includes(s) ||
          (w.definition || '').toLowerCase().includes(s))
      : words;
    const map = new Map<string, { meaning: string | null; items: RootWord[] }>();
    for (const w of filtered) {
      if (!map.has(w.root)) map.set(w.root, { meaning: w.root_meaning, items: [] });
      map.get(w.root)!.items.push(w);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [words, q]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-emerald-50 text-slate-700"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 text-slate-900 p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <Button variant="ghost" size="sm" className="text-slate-700 hover:bg-white" onClick={() => nav('/ssc')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white" onClick={() => nav('/ssc/roots/practice')}>
            <Sparkles className="w-4 h-4 mr-1" /> Practice 30 Roots
          </Button>
        </div>

        <div>
          <h1 className="text-2xl font-bold">English Vocabulary — Root Words</h1>
          <p className="text-sm text-slate-600">{words.length} words across {grouped.length} roots</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search root, word, or meaning…"
            className="pl-9 bg-white border-emerald-100"
          />
        </div>

        <div className="space-y-3">
          {grouped.map(([root, { meaning, items }]) => {
            const open = openRoots[root] ?? q.trim().length > 0;
            return (
              <Card key={root} className="bg-white border-emerald-100 shadow-sm">
                <CardContent className="p-0">
                  <button
                    onClick={() => setOpenRoots(o => ({ ...o, [root]: !open }))}
                    className="w-full flex items-center gap-3 p-4 text-left hover:bg-emerald-50/60 rounded-lg"
                  >
                    {open ? <ChevronDown className="w-4 h-4 text-emerald-600" /> : <ChevronRight className="w-4 h-4 text-emerald-600" />}
                    <div className="flex-1">
                      <div className="text-lg font-bold text-emerald-800">{root}</div>
                      {meaning && <div className="text-xs text-slate-500">{meaning}</div>}
                    </div>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">{items.length}</Badge>
                  </button>
                  {open && (
                    <div className="grid gap-2 sm:grid-cols-2 p-4 pt-0">
                      {items.map(w => (
                        <div key={w.id} className="border border-emerald-100 rounded-md p-3 bg-emerald-50/40">
                          <div className="flex items-baseline justify-between gap-2">
                            <div className="font-semibold text-slate-900">{w.word}</div>
                            {w.root_plus_word && <div className="text-[10px] text-emerald-700 font-mono">{w.root_plus_word}</div>}
                          </div>
                          {w.definition && <div className="text-sm text-slate-700 mt-1">{w.definition}</div>}
                          {(w.hindi_meaning || w.hinglish_meaning) && <div className="text-xs text-amber-700 mt-1">{w.hindi_meaning || w.hinglish_meaning}</div>}
                          {w.example && <div className="text-xs text-slate-600 mt-2 border-l-2 border-emerald-300 pl-2">{w.example}</div>}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {w.synonym && <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">syn: {w.synonym}</Badge>}
                            {w.antonym && <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-100">ant: {w.antonym}</Badge>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
          {!grouped.length && <div className="text-center text-slate-500 py-10">No matches.</div>}
        </div>
      </div>
    </div>
  );
}
