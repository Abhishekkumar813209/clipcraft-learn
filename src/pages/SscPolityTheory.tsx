import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Play } from 'lucide-react';
import { politySheet, factsOf, POLITY_SHEETS } from '@/lib/polityQuiz';

export default function SscPolityTheory() {
  const nav = useNavigate();
  const { sheet } = useParams<{ sheet: string }>();
  const meta = politySheet(sheet);
  const rows = factsOf(meta.key);
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return rows.map((r, i) => ({ r, i }));
    return rows
      .map((r, i) => ({ r, i }))
      .filter(({ r }) =>
        [r.prompt, r.answer, r.detail, r.extra].join(' ').toLowerCase().includes(t),
      );
  }, [rows, q]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 sm:p-6 text-slate-900">
      <div className="max-w-6xl mx-auto space-y-5">
        <Button variant="ghost" size="sm" className="text-emerald-700 -ml-2" onClick={() => nav('/ssc/gk/polity/facts')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Polity Practice
        </Button>

        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{meta.emoji}</span>
            <div>
              <h1 className="text-2xl font-bold">{meta.label} — Theory</h1>
              <p className="text-sm text-slate-500">{rows.length} facts · table format · {meta.blurb}</p>
            </div>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-500" onClick={() => nav(`/ssc/gk/polity/facts/${meta.key}`)}>
            <Play className="w-4 h-4 mr-1" /> Practice karo
          </Button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {POLITY_SHEETS.map((s) => (
            <Button
              key={s.key}
              size="sm"
              variant={s.key === meta.key ? 'default' : 'outline'}
              className={s.key === meta.key ? 'bg-emerald-600 hover:bg-emerald-500' : 'border-emerald-200 text-emerald-700'}
              onClick={() => nav(`/ssc/gk/polity/theory/${s.key}`)}
            >
              {s.emoji} {s.label}
            </Button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input className="pl-9 bg-white" placeholder="Search karo (article, keyword, case…)" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        <Card className="border-emerald-100 bg-white/90 overflow-hidden">
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-emerald-50 text-emerald-900">
                <tr>
                  <th className="text-left px-3 py-2 w-12">#</th>
                  <th className="text-left px-3 py-2 w-44">{meta.label.split(' ')[0]}</th>
                  <th className="text-left px-3 py-2 w-64">Subject / Provision</th>
                  <th className="text-left px-3 py-2">Detail (Hinglish)</th>
                  <th className="text-left px-3 py-2 w-32">Exam point</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(({ r, i }) => (
                  <tr key={i} className="border-t border-slate-100 align-top hover:bg-emerald-50/40">
                    <td className="px-3 py-2 text-slate-400">{i + 1}</td>
                    <td className="px-3 py-2 font-semibold text-emerald-800">{r.prompt}</td>
                    <td className="px-3 py-2 font-medium">{r.answer}</td>
                    <td className="px-3 py-2 text-slate-600 leading-relaxed">{r.detail}</td>
                    <td className="px-3 py-2">
                      {r.extra && <Badge className="bg-amber-100 text-amber-800 border border-amber-200 whitespace-normal text-left">{r.extra}</Badge>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && <div className="p-6 text-center text-sm text-slate-500">Kuch nahi mila.</div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
