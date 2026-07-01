import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Sparkles, Loader2 } from 'lucide-react';
import { fetchBBItems, BBCategory, BBItem } from '@/lib/blackBookQuiz';
import { BlackBookExplanation } from '@/components/BlackBookExplanation';

const TABS: { key: BBCategory | 'mixed'; label: string }[] = [
  { key: 'syn_ant', label: 'Syn / Ant' },
  { key: 'idiom', label: 'Idioms' },
  { key: 'ows', label: 'One-Word' },
  { key: 'mixed', label: 'All' },
];

export default function BlackBookBrowse() {
  const { category } = useParams<{ category: BBCategory | 'mixed' }>();
  const nav = useNavigate();
  const [items, setItems] = useState<BBItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchBBItems(category).then((d) => {
      setItems(d);
      setLoading(false);
    });
  }, [category]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((it) =>
      [it.prompt, it.answer, it.hindi_meaning, it.english_meaning, it.hinglish_meaning, it.example]
        .filter(Boolean)
        .some((v) => (v as string).toLowerCase().includes(s)) ||
      (it.synonyms || []).some((x) => x.toLowerCase().includes(s)) ||
      (it.antonyms || []).some((x) => x.toLowerCase().includes(s))
    );
  }, [items, q]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/40 to-slate-950 text-slate-100 p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <Button variant="ghost" size="sm" onClick={() => nav('/ssc/blackbook')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          {category && category !== 'mixed' && (
            <Link to={`/ssc/blackbook/practice/${category}`}>
              <Button size="sm"><Sparkles className="w-4 h-4 mr-1" /> Practice these</Button>
            </Link>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          {TABS.map((t) => (
            <Link key={t.key} to={`/ssc/blackbook/browse/${t.key}`}>
              <Badge variant={category === t.key ? 'default' : 'outline'} className="cursor-pointer">
                {t.label}
              </Badge>
            </Link>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <Input
            placeholder="Search word / meaning / synonym…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9 bg-slate-900/60 border-blue-900/40"
          />
        </div>

        <div className="text-xs text-slate-400">{filtered.length} items</div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin" /></div>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {filtered.map((it) => (
              <BlackBookExplanation key={it.id} item={it} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
