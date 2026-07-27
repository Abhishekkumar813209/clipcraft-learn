import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Landmark, Sparkles, Layers } from 'lucide-react';
import { fetchUpscChapters, UpscChapterInfo } from '@/lib/upscQuiz';

const numeric = (v: string) => v.replace(/[^0-9]/g, '');

export default function UpscHistory() {
  const nav = useNavigate();
  const [chapters, setChapters] = useState<UpscChapterInfo[]>([]);
  const [loading, setLoading] = useState(true);

  // "All chapters" controls
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [count, setCount] = useState('');
  const [order, setOrder] = useState<'serial' | 'random'>('serial');

  useEffect(() => {
    fetchUpscChapters().then((c) => { setChapters(c); setLoading(false); });
  }, []);

  const total = chapters.reduce((s, c) => s + c.count, 0);
  const maxSerial = chapters.reduce((m, c) => Math.max(m, c.maxSerial), 0);

  const startAll = () => {
    const p = new URLSearchParams({ order });
    if (from) p.set('from', from);
    if (to) p.set('to', to);
    if (count) p.set('n', count);
    nav(`/upsc/history/practice?${p.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 p-6 text-slate-900">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Landmark className="w-8 h-8 text-amber-600" />
          <div>
            <h1 className="text-3xl font-bold">Ancient History</h1>
            <p className="text-sm text-slate-500">
              NCERT-based MCQs · {loading ? '…' : `${total} questions`} · serial 1–{maxSerial || '…'}
            </p>
          </div>
        </div>

        {/* All chapters practice */}
        <Card className="bg-gradient-to-br from-amber-100 to-orange-100 border-amber-200 shadow-sm">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-700" />
                <div>
                  <h3 className="font-semibold">All chapters (serial-wise)</h3>
                  <p className="text-xs text-slate-600">Ek hi continuous serial — 1 se {maxSerial || '…'} tak, chapters mile-jule</p>
                </div>
              </div>
              <Badge className="bg-white/70 text-amber-700 border border-amber-200">{total}</Badge>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700">
              <span className="font-medium">Serial range:</span>
              <input
                type="text" inputMode="numeric" value={from}
                onChange={(e) => setFrom(numeric(e.target.value))}
                placeholder="from"
                className="w-20 px-2 py-1 rounded border border-amber-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <span>→</span>
              <input
                type="text" inputMode="numeric" value={to}
                onChange={(e) => setTo(numeric(e.target.value))}
                placeholder="to"
                className="w-20 px-2 py-1 rounded border border-amber-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <span className="text-slate-500">optional (poora bank = khaali chhodo)</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700">
              <span className="font-medium">Questions:</span>
              <input
                type="text" inputMode="numeric" value={count}
                onChange={(e) => setCount(numeric(e.target.value))}
                placeholder="all"
                className="w-20 px-2 py-1 rounded border border-amber-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <span className="font-medium ml-3">Order:</span>
              {(['serial', 'random'] as const).map((o) => (
                <button
                  key={o}
                  onClick={() => setOrder(o)}
                  className={`px-2 py-1 rounded border ${order === o ? 'bg-amber-600 border-amber-600 text-white' : 'bg-white/70 border-amber-200 text-amber-700'}`}
                >{o}</button>
              ))}
            </div>

            <Button size="sm" className="bg-amber-600 hover:bg-amber-500 text-white" onClick={startAll}>
              <Sparkles className="w-4 h-4 mr-1" /> Start practice
            </Button>
          </CardContent>
        </Card>

        {/* Chapter cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {chapters.map((c) => (
            <Card key={c.chapter_no} className="bg-white/80 border-amber-100 backdrop-blur shadow-sm">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">Ch {c.chapter_no} · {c.chapter_name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Global serial {c.minSerial}–{c.maxSerial}</p>
                  </div>
                  <Badge className="bg-amber-50 text-amber-700 border border-amber-200">{c.count}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-amber-600 hover:bg-amber-500 text-white"
                    onClick={() => nav(`/upsc/history/practice?chapter=${c.chapter_no}&order=serial`)}
                  >Serial-wise</Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-white/70 border-amber-200 text-amber-700 hover:bg-white"
                    onClick={() => nav(`/upsc/history/practice?chapter=${c.chapter_no}&order=random`)}
                  >Random</Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {!loading && chapters.length === 0 && (
            <p className="text-sm text-slate-500">Abhi koi chapter load nahi hua.</p>
          )}
        </div>
      </div>
    </div>
  );
}
