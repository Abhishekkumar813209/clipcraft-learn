import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Bookmark, Trash2, HelpCircle, ListChecks, Play, ChevronRight, Layers } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useBookmarks, BookmarkRow, CHAPTER_LABELS, SUBJECT_LABELS, BookmarkSubject } from '@/lib/bookmarks';
import { toast } from '@/hooks/use-toast';

const SUBJECT_ICON: Record<string, string> = { english: '📘', maths: '🧮', reasoning: '🧠', gk: '🌍' };

const prettyChapter = (c: string) =>
  CHAPTER_LABELS[c] ||
  c.replace(/^gk_/, '').replace(/^eng_/, '').replace(/^topic_/, '').replace(/_/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase());

interface Counts { total: number; q: number; o: number }
const emptyCounts = (): Counts => ({ total: 0, q: 0, o: 0 });
const addCount = (c: Counts, r: BookmarkRow) => {
  c.total++;
  if (r.kind === 'question') c.q++; else c.o++;
  return c;
};

export default function SscBookmarks() {
  const nav = useNavigate();
  const { user } = useAuth();
  const { rows, loading, reload } = useBookmarks(user?.id);
  const [subject, setSubject] = useState<string | null>(null);
  const [chapter, setChapter] = useState<string | null>(null);
  const [group, setGroup] = useState<string | null>(null);
  const [tab, setTab] = useState<'questions' | 'options'>('questions');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);

  const toggleSel = (id: string) => setSelected((s) => {
    const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n;
  });
  const selectAll = (ids: string[]) => setSelected((s) => {
    const n = new Set(s); ids.forEach((id) => n.add(id)); return n;
  });
  const clearSelIn = (ids: string[]) => setSelected((s) => {
    const n = new Set(s); ids.forEach((id) => n.delete(id)); return n;
  });

  async function removeSelected() {
    if (!selected.size) return;
    setBusy(true);
    const ids = Array.from(selected);
    const { error } = await supabase.from('ssc_bookmarks' as never).delete().in('id', ids);
    setBusy(false);
    if (error) { toast({ title: 'Delete failed', description: error.message, variant: 'destructive' }); return; }
    toast({ title: `Removed ${ids.length} bookmark${ids.length > 1 ? 's' : ''}` });
    setSelected(new Set());
    reload();
  }

  async function remove(id: string) {
    await supabase.from('ssc_bookmarks' as never).delete().eq('id', id);
    reload();
  }

  const subjectCounts = useMemo(() => {
    const c: Record<string, Counts> = {};
    for (const r of rows) addCount((c[r.subject] ||= emptyCounts()), r);
    return c;
  }, [rows]);

  const subjectRows = useMemo(() => rows.filter((r) => r.subject === subject), [rows, subject]);

  const chapterCounts = useMemo(() => {
    const c: Record<string, Counts> = {};
    for (const r of subjectRows) addCount((c[r.chapter] ||= emptyCounts()), r);
    return c;
  }, [subjectRows]);

  const chapterRows = useMemo(() => subjectRows.filter((r) => r.chapter === chapter), [subjectRows, chapter]);

  const groupCounts = useMemo(() => {
    const c: Record<string, Counts> = {};
    for (const r of chapterRows) addCount((c[r.subcategory || '—'] ||= emptyCounts()), r);
    return c;
  }, [chapterRows]);

  const needGroups = Object.keys(groupCounts).length > 1;
  const items = useMemo(
    () => (needGroups && group ? chapterRows.filter((r) => (r.subcategory || '—') === group) : chapterRows),
    [chapterRows, group, needGroups],
  );

  const questions = items.filter((r) => r.kind === 'question');
  const options = items.filter((r) => r.kind === 'option');

  const practiceUrl = chapter === 'idiom' ? `/ssc/blackbook/practice/idiom?bookmarks=1&n=${Math.max(questions.length, 1)}`
    : chapter === 'ows' ? `/ssc/blackbook/practice/ows?bookmarks=1&n=${Math.max(questions.length, 1)}`
    : chapter === 'syn_ant' ? `/ssc/english/synant/practice?bookmarks=1&n=${Math.max(questions.length, 1)}`
    : null;

  const back = () => {
    if (needGroups && group) setGroup(null);
    else if (chapter) { setChapter(null); setGroup(null); }
    else if (subject) setSubject(null);
    else nav('/ssc');
  };

  const CountCard = ({ title, sub, icon, counts, onClick }: { title: string; sub?: string; icon?: string; counts: Counts; onClick: () => void }) => (
    <Card className="cursor-pointer border-emerald-100 hover:border-emerald-300 hover:shadow-md transition-all bg-white/80" onClick={onClick}>
      <CardContent className="p-4 flex items-center gap-3">
        <span className="text-2xl">{icon || '🔖'}</span>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-slate-800 truncate">{title}</div>
          {sub && <div className="text-xs text-slate-500 truncate">{sub}</div>}
          <div className="mt-1 flex gap-1.5 flex-wrap">
            <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200">{counts.q} Q</Badge>
            <Badge className="bg-teal-50 text-teal-700 border border-teal-200">{counts.o} options</Badge>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </CardContent>
    </Card>
  );

  const crumb = [subject && SUBJECT_LABELS[subject as BookmarkSubject], chapter && prettyChapter(chapter), needGroups && group ? group : null]
    .filter(Boolean).join(' › ');

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-br from-emerald-50 via-white to-teal-50 text-slate-900">
      <div className="max-w-5xl mx-auto space-y-5">
        <Button variant="ghost" size="sm" className="text-slate-700 hover:bg-white -ml-2" onClick={back}>
          <ArrowLeft className="w-4 h-4 mr-1" /> {subject ? 'Back' : 'SSC'}
        </Button>

        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <Bookmark className="w-8 h-8 text-emerald-600" />
            <div>
              <h1 className="text-3xl font-bold">Bookmarks</h1>
              <p className="text-sm text-slate-500">{crumb || 'Subject → chapter → topic. Har card pe count dikh raha hai.'}</p>
            </div>
          </div>
          {selected.size > 0 && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-slate-200" onClick={() => setSelected(new Set())}>Clear</Button>
              <Button size="sm" variant="destructive" onClick={removeSelected} disabled={busy}>
                <Trash2 className="w-4 h-4 mr-1" /> Unbookmark ({selected.size})
              </Button>
            </div>
          )}
        </div>

        {loading && <div className="text-slate-500 text-sm">Loading…</div>}
        {!loading && rows.length === 0 && (
          <Card className="border-emerald-100"><CardContent className="p-8 text-center text-slate-500">
            No bookmarks yet. Practice me question card ya kisi option ko bookmark karo — yaha hierarchy me dikhega.
          </CardContent></Card>
        )}

        {/* Level 1 — subjects */}
        {!subject && rows.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-3">
            {(Object.keys(SUBJECT_LABELS) as BookmarkSubject[]).filter((s) => subjectCounts[s]).map((s) => (
              <CountCard
                key={s}
                title={SUBJECT_LABELS[s]}
                icon={SUBJECT_ICON[s]}
                sub={`${Object.keys(rows.filter((r) => r.subject === s).reduce((a, r) => ({ ...a, [r.chapter]: 1 }), {})).length} chapters`}
                counts={subjectCounts[s]}
                onClick={() => { setSubject(s); setChapter(null); setGroup(null); }}
              />
            ))}
          </div>
        )}

        {/* Level 2 — chapters */}
        {subject && !chapter && (
          <div className="grid sm:grid-cols-2 gap-3">
            {Object.entries(chapterCounts).sort((a, b) => b[1].total - a[1].total).map(([ch, c]) => (
              <CountCard key={ch} title={prettyChapter(ch)} icon="📂" counts={c} onClick={() => { setChapter(ch); setGroup(null); }} />
            ))}
          </div>
        )}

        {/* Level 3 — subcategory groups */}
        {subject && chapter && needGroups && !group && (
          <div className="grid sm:grid-cols-2 gap-3">
            {Object.entries(groupCounts).sort((a, b) => b[1].total - a[1].total).map(([g, c]) => (
              <CountCard key={g} title={g === '—' ? 'Others' : g} icon="🏷️" counts={c} onClick={() => setGroup(g)} />
            ))}
          </div>
        )}

        {/* Level 4 — items */}
        {subject && chapter && (!needGroups || group) && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Button size="sm" variant={tab === 'questions' ? 'default' : 'outline'} className={tab === 'questions' ? 'bg-emerald-600 hover:bg-emerald-500' : 'border-emerald-200 text-emerald-700'} onClick={() => setTab('questions')}>
                <HelpCircle className="w-4 h-4 mr-1" /> Questions ({questions.length})
              </Button>
              <Button size="sm" variant={tab === 'options' ? 'default' : 'outline'} className={tab === 'options' ? 'bg-teal-600 hover:bg-teal-500' : 'border-teal-200 text-teal-700'} onClick={() => setTab('options')}>
                <ListChecks className="w-4 h-4 mr-1" /> Options ({options.length})
              </Button>
              <div className="flex-1" />
              <Button size="sm" variant="ghost" className="text-xs text-emerald-700" onClick={() => selectAll((tab === 'questions' ? questions : options).map((x) => x.id))}>Select all</Button>
              <Button size="sm" variant="ghost" className="text-xs text-slate-500" onClick={() => clearSelIn(items.map((x) => x.id))}>Deselect</Button>
              {practiceUrl && questions.length > 0 && (
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white" onClick={() => nav(practiceUrl)}>
                  <Play className="w-3.5 h-3.5 mr-1" /> Practice
                </Button>
              )}
            </div>

            {tab === 'questions' && (
              <div className="grid sm:grid-cols-2 gap-3">
                {questions.map((r) => {
                  const opts = ((r.meta as { options?: string[] } | null)?.options) || [];
                  return (
                    <Card key={r.id} className={`border-emerald-200 bg-white ${selected.has(r.id) ? 'ring-2 ring-rose-300' : ''}`}>
                      <CardContent className="p-3 space-y-2">
                        <div className="flex items-start gap-2">
                          <Checkbox checked={selected.has(r.id)} onCheckedChange={() => toggleSel(r.id)} className="mt-0.5" />
                          <div className="flex-1 text-sm text-slate-800" dangerouslySetInnerHTML={{ __html: r.question_text }} />
                        </div>
                        {opts.length > 0 && (
                          <ul className="pl-6 space-y-1">
                            {opts.map((o, i) => {
                              const isCorrect = r.correct_text && o.trim() === r.correct_text.trim();
                              return (
                                <li key={i} className={`text-xs rounded px-2 py-1 border ${isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-medium' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                                  <span className="font-semibold mr-1">{String.fromCharCode(65 + i)}.</span>
                                  <span dangerouslySetInnerHTML={{ __html: o }} />
                                </li>
                              );
                            })}
                          </ul>
                        )}
                        {opts.length === 0 && r.correct_text && (
                          <div className="text-xs text-emerald-700 pl-6">✓ {r.correct_text}</div>
                        )}
                        <div className="flex justify-end">
                          <Button size="sm" variant="ghost" className="h-7 text-rose-600 hover:bg-rose-50" onClick={() => remove(r.id)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                {questions.length === 0 && <div className="text-sm text-slate-500">Is chapter me koi question bookmark nahi hai.</div>}
              </div>
            )}

            {tab === 'options' && (
              <div className="grid sm:grid-cols-2 gap-3">
                {options.map((r) => (
                  <Card key={r.id} className={`border-teal-200 bg-white ${selected.has(r.id) ? 'ring-2 ring-rose-300' : ''}`}>
                    <CardContent className="p-3 space-y-1.5">
                      <div className="flex items-start gap-2">
                        <Checkbox checked={selected.has(r.id)} onCheckedChange={() => toggleSel(r.id)} className="mt-0.5" />
                        <div className="flex-1 text-xs text-slate-500" dangerouslySetInnerHTML={{ __html: r.question_text }} />
                      </div>
                      <div className="text-sm font-medium text-teal-800 pl-6">→ {r.option_text}</div>
                      {r.correct_text && <div className="text-[11px] text-emerald-700 pl-6">✓ {r.correct_text}</div>}
                      <div className="flex justify-end">
                        <Button size="sm" variant="ghost" className="h-7 text-rose-600 hover:bg-rose-50" onClick={() => remove(r.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {options.length === 0 && <div className="text-sm text-slate-500">Koi option bookmark nahi hai.</div>}
              </div>
            )}

            <div className="flex items-center gap-1.5 text-xs text-slate-400"><Layers className="w-3 h-3" /> {crumb}</div>
          </div>
        )}
      </div>
    </div>
  );
}
