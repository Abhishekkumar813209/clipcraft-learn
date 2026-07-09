import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';

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
  const { category = 'mixed' } = useParams<{ category: BBCategory | 'mixed' }>();
  const [searchParams] = useSearchParams();
  const sub = searchParams.get('sub') || undefined;
  const nav = useNavigate();
  const [items, setItems] = useState<BBItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchBBItems(category, sub).then((d) => {
      setItems(d);
      setLoading(false);
    });
  }, [category, sub]);


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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 text-slate-900 p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <Button variant="ghost" size="sm" className="text-slate-700 hover:bg-white" onClick={() => nav('/ssc/blackbook')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          {category && category !== 'mixed' && (
            <Link to={`/ssc/blackbook/practice/${category}`}>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white"><Sparkles className="w-4 h-4 mr-1" /> Practice these</Button>
            </Link>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          {TABS.map((t) => (
            <Link key={t.key} to={`/ssc/blackbook/browse/${t.key}`}>
              <Badge
                className={`cursor-pointer border ${
                  category === t.key
                    ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-500'
                    : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                }`}
              >
                {t.label}
              </Badge>
            </Link>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search word / meaning / synonym…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9 bg-white border-emerald-200 text-slate-900 placeholder:text-slate-400"
          />
        </div>

        <div className="text-xs text-slate-500">{filtered.length} items</div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-emerald-600" /></div>
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
