import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Layers, BookOpenText } from 'lucide-react';
import { fetchUpscChapters, UpscChapterInfo } from '@/lib/upscQuiz';
import { getUpscSubject } from '@/lib/upscSubjects';
import { supabase } from '@/integrations/supabase/client';

const numeric = (v: string) => v.replace(/[^0-9]/g, '');

export default function UpscSubjectPage() {
  const nav = useNavigate();
  const { subject: slug } = useParams();
  const cfg = getUpscSubject(slug);

  const [chapters, setChapters] = useState<UpscChapterInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState<string>('all');

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [count, setCount] = useState('');
  const [order, setOrder] = useState<'serial' | 'random'>('serial');

  const [theoryChapters, setTheoryChapters] = useState<Set<number>>(new Set());

  useEffect(() => {
    supabase
      .from('upsc_chapter_theory' as never)
      .select('chapter_no')
      .eq('subject', cfg.subject)
      .then(({ data }) => setTheoryChapters(new Set(((data as unknown as { chapter_no: number }[]) || []).map((r) => r.chapter_no))));
  }, [cfg.subject]);

  useEffect(() => {
    setLoading(true);
    setSection('all');
    fetchUpscChapters(cfg.subject).then((c) => { setChapters(c); setLoading(false); });
  }, [cfg.subject]);

  const activeSection = cfg.sections?.find((s) => s.key === section);
  const visible = useMemo(
    () => (activeSection
      ? chapters.filter((c) => c.chapter_no >= activeSection.fromChapter && c.chapter_no <= activeSection.toChapter)
      : chapters),
    [chapters, activeSection]
  );

  const total = visible.reduce((s, c) => s + c.count, 0);
  const minSerial = visible.reduce((m, c) => Math.min(m, c.minSerial), Number.MAX_SAFE_INTEGER);
  const maxSerial = visible.reduce((m, c) => Math.max(m, c.maxSerial), 0);

  const base = `/upsc/${cfg.slug}/practice`;

  const startAll = () => {
    const p = new URLSearchParams({ order });
    const f = from || (activeSection ? String(minSerial) : '');
    const t = to || (activeSection ? String(maxSerial) : '');
    if (f) p.set('from', f);
    if (t) p.set('to', t);
    if (count) p.set('n', count);
    nav(`${base}?${p.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 p-6 text-slate-900">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{cfg.emoji}</span>
          <div>
            <h1 className="text-3xl font-bold">{cfg.label}</h1>
            <p className="text-sm text-slate-500">
              NCERT-based MCQs · {loading ? '…' : `${total} questions`} · serial {maxSerial ? `${minSerial}–${maxSerial}` : '…'}
            </p>
          </div>
        </div>

        {cfg.sections && (
          <div className="flex flex-wrap gap-2">
            {[{ key: 'all', label: 'All' }, ...cfg.sections].map((s) => (
              <button
                key={s.key}
                onClick={() => { setSection(s.key); setFrom(''); setTo(''); }}
                className={`px-3 py-1.5 rounded-full text-sm border ${section === s.key ? 'bg-amber-600 border-amber-600 text-white' : 'bg-white/70 border-amber-200 text-amber-700'}`}
              >{s.label}</button>
            ))}
          </div>
        )}

        <Card className="bg-gradient-to-br from-amber-100 to-orange-100 border-amber-200 shadow-sm">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-700" />
                <div>
                  <h3 className="font-semibold">{activeSection ? activeSection.label : 'All chapters'} (serial-wise)</h3>
                  <p className="text-xs text-slate-600">Ek hi continuous serial — {maxSerial ? `${minSerial} se ${maxSerial}` : '…'} tak, chapters mile-jule</p>
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
              <span className="text-slate-500">optional (poora set = khaali chhodo)</span>
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

        <div className="grid md:grid-cols-2 gap-4">
          {visible.map((c) => (
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
                    onClick={() => nav(`${base}?chapter=${c.chapter_no}&order=serial`)}
                  >Serial-wise</Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-white/70 border-amber-200 text-amber-700 hover:bg-white"
                    onClick={() => nav(`${base}?chapter=${c.chapter_no}&order=random`)}
                  >Random</Button>
                </div>
                {theoryChapters.has(c.chapter_no) && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100"
                    onClick={() => nav(`/upsc/${cfg.slug}/theory/${c.chapter_no}`)}
                  ><BookOpenText className="w-4 h-4 mr-1" /> Theory padho</Button>
                )}
              </CardContent>
            </Card>
          ))}
          {!loading && visible.length === 0 && (
            <p className="text-sm text-slate-500">Abhi koi chapter load nahi hua.</p>
          )}
        </div>
      </div>
    </div>
  );
}
