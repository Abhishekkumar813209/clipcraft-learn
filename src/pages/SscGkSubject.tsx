import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fetchSscChapters, type ChapterInfo } from '@/lib/sscChapters';
import { gkSubject } from '@/lib/sscGkSubjects';
import { supabase } from '@/integrations/supabase/client';
import { ChevronDown, ChevronRight, BookOpenText, Play, Loader2, Sparkles, Layers, ArrowLeft } from 'lucide-react';

const numeric = (v: string) => v.replace(/[^0-9]/g, '');

export default function SscGkSubject() {
  const nav = useNavigate();
  const { subject: subjectParam } = useParams();
  const meta = gkSubject(subjectParam);
  const SUBJECT = meta.key;

  const [chapters, setChapters] = useState<ChapterInfo[]>([]);
  const [theoryKeys, setTheoryKeys] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [count, setCount] = useState('');
  const [order, setOrder] = useState<'serial' | 'random'>('serial');

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [ch, th] = await Promise.all([
        fetchSscChapters(SUBJECT),
        supabase.from('ssc_chapter_theory' as never).select('chapter,subtopic').eq('subject', SUBJECT),
      ]);
      setChapters(ch);
      const rows = (th.data as unknown as { chapter: string; subtopic: string }[]) || [];
      setTheoryKeys(new Set(rows.map((r) => `${r.chapter}||${r.subtopic || ''}`)));
      setLoading(false);
    })();
  }, [SUBJECT]);

  const base = `/ssc/gk/${SUBJECT}`;
  const q = (chapter: string, subtopic?: string) =>
    `${base}/practice?chapter=${encodeURIComponent(chapter)}${subtopic ? `&subtopic=${encodeURIComponent(subtopic)}` : ''}`;
  const t = (chapter: string, subtopic?: string) =>
    `${base}/theory?chapter=${encodeURIComponent(chapter)}${subtopic ? `&subtopic=${encodeURIComponent(subtopic)}` : ''}`;

  const total = chapters.reduce((s, c) => s + c.count, 0);
  const minSerial = chapters.length ? Math.min(...chapters.map((c) => c.minSerial)) : 0;
  const maxSerial = chapters.length ? Math.max(...chapters.map((c) => c.maxSerial)) : 0;

  const startAll = () => {
    const p = new URLSearchParams({ order });
    if (from) p.set('from', from);
    if (to) p.set('to', to);
    if (count) p.set('n', count);
    nav(`${base}/practice?${p.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 sm:p-6 text-slate-900">
      <div className="max-w-5xl mx-auto space-y-6">
        <Button variant="ghost" size="sm" className="text-emerald-700 -ml-2" onClick={() => nav('/ssc/gk')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> GK / GS
        </Button>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{meta.emoji}</span>
          <div>
            <h1 className="text-3xl font-bold">{meta.label}</h1>
            <p className="text-sm text-slate-500">
              {loading ? 'Loading…' : `${chapters.length} chapters · ${total} questions`}
              {maxSerial ? ` · serial ${minSerial}–${maxSerial}` : ''}
            </p>
          </div>
        </div>


        {SUBJECT === 'polity' && (
          <Card
            className="cursor-pointer bg-white/80 border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all"
            onClick={() => nav('/ssc/gk/polity/facts')}
          >
            <CardContent className="p-5 flex items-start gap-3">
              <span className="text-3xl">🗂️</span>
              <div className="flex-1">
                <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200 mb-1.5">New</Badge>
                <h3 className="font-semibold">Practice — Polity Master Data</h3>
                <p className="text-sm text-slate-600 mt-0.5">
                  Parts & Articles · Schedules · Sources · Important Articles · Duties · Amendments · Landmark Cases · RS & LS Seats
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-gradient-to-br from-emerald-100 to-teal-100 border-emerald-200 shadow-sm">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-700" />
                <div>
                  <h3 className="font-semibold">Poora {meta.label} (serial-wise)</h3>
                  <p className="text-xs text-slate-600">
                    Ek continuous serial — {maxSerial ? `${minSerial} se ${maxSerial}` : '…'} tak, chapters mile-jule
                  </p>
                </div>
              </div>
              <Badge className="bg-white/70 text-emerald-700 border border-emerald-200">{total}</Badge>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700">
              <span className="font-medium">Serial range:</span>
              <input
                type="text" inputMode="numeric" value={from}
                onChange={(e) => setFrom(numeric(e.target.value))}
                placeholder="from"
                className="w-20 px-2 py-1 rounded border border-emerald-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <span>→</span>
              <input
                type="text" inputMode="numeric" value={to}
                onChange={(e) => setTo(numeric(e.target.value))}
                placeholder={maxSerial ? String(maxSerial) : 'to'}
                className="w-20 px-2 py-1 rounded border border-emerald-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <span className="text-slate-500">optional (poora set = khaali chhodo)</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700">
              <span className="font-medium">Questions:</span>
              <input
                type="text" inputMode="numeric" value={count}
                onChange={(e) => setCount(numeric(e.target.value))}
                placeholder="all"
                className="w-20 px-2 py-1 rounded border border-emerald-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <span className="font-medium ml-3">Order:</span>
              {(['serial', 'random'] as const).map((o) => (
                <button
                  key={o}
                  onClick={() => setOrder(o)}
                  className={`px-2 py-1 rounded border ${order === o ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white/70 border-emerald-200 text-emerald-700'}`}
                >{o}</button>
              ))}
            </div>

            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white" disabled={loading} onClick={startAll}>
              <Sparkles className="w-4 h-4 mr-1" /> Start practice
            </Button>
          </CardContent>
        </Card>

        {loading && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin" /> Chapters load ho rahe hain…
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {chapters.map((c) => {
            const subs = c.subtopics.filter((s) => s.name !== '—');
            const expandable = subs.length >= 2;
            const isOpen = expandable && open === c.chapter;
            const hasTheory = theoryKeys.has(`${c.chapter}||`);
            return (
              <Card key={c.chapter} className="bg-white/80 border-emerald-100 backdrop-blur shadow-sm">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <button
                      className="flex items-start gap-2 text-left min-w-0 flex-1"
                      disabled={!expandable}
                      onClick={() => setOpen(isOpen ? null : c.chapter)}
                    >
                      {expandable ? (
                        isOpen ? <ChevronDown className="w-4 h-4 mt-1 text-emerald-600" /> : <ChevronRight className="w-4 h-4 mt-1 text-emerald-600" />
                      ) : (
                        <span className="w-4 h-4 mt-1 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <h3 className="font-semibold text-slate-900 truncate">{c.chapter}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Serial {c.minSerial}–{c.maxSerial}
                          {expandable ? ` · ${subs.length} subtopics` : ' · single topic'}
                        </p>
                      </div>
                    </button>
                    <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">{c.count}</Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white"
                      onClick={() => nav(q(c.chapter))}
                    ><Play className="w-4 h-4 mr-1" /> Quiz</Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-white/70 border-emerald-200 text-emerald-700 hover:bg-white"
                      onClick={() => nav(t(c.chapter))}
                    ><BookOpenText className="w-4 h-4 mr-1" /> {hasTheory ? 'Theory padho' : 'Theory'}</Button>
                  </div>

                  {isOpen && (
                    <div className="space-y-2 pt-1">
                      {subs.map((s) => {
                        const subTheory = theoryKeys.has(`${c.chapter}||${s.name}`);
                        return (
                          <div key={s.name} className="border border-emerald-100 rounded-lg p-3 flex items-center justify-between gap-2 bg-emerald-50/50">
                            <div className="min-w-0">
                              <div className="text-sm font-medium truncate">{s.name}</div>
                              <div className="text-[11px] text-slate-500">{s.count} questions</div>
                            </div>
                            <div className="flex gap-1.5 shrink-0">
                              {subTheory && (
                                <Button size="sm" variant="ghost" className="text-emerald-700" onClick={() => nav(t(c.chapter, s.name))}>
                                  <BookOpenText className="w-4 h-4" />
                                </Button>
                              )}
                              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500" onClick={() => nav(q(c.chapter, s.name))}>
                                <Play className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
          {!loading && chapters.length === 0 && <p className="text-sm text-slate-500">Abhi koi chapter load nahi hua.</p>}
        </div>
      </div>
    </div>
  );
}
