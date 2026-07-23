import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Bookmark, Trash2, HelpCircle, ListChecks, ChevronDown, ChevronRight, Play } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useBookmarks, BookmarkRow, CHAPTER_LABELS, SUBJECT_LABELS, BookmarkSubject } from '@/lib/bookmarks';

export default function SscBookmarks() {
  const nav = useNavigate();
  const { user } = useAuth();
  const { rows, loading, reload } = useBookmarks(user?.id);
  const [openSubject, setOpenSubject] = useState<Record<string, boolean>>({ english: true, maths: true });
  const [openChapter, setOpenChapter] = useState<Record<string, boolean>>({});

  const bySubject = useMemo(() => {
    const map: Record<string, BookmarkRow[]> = {};
    for (const r of rows) {
      (map[r.subject] ||= []).push(r);
    }
    return map;
  }, [rows]);

  const subjectCounts = useMemo(() => {
    const c: Record<string, { total: number; q: number; o: number }> = {};
    for (const r of rows) {
      const s = (c[r.subject] ||= { total: 0, q: 0, o: 0 });
      s.total++;
      if (r.kind === 'question') s.q++; else s.o++;
    }
    return c;
  }, [rows]);

  async function remove(id: string) {
    await supabase.from('ssc_bookmarks' as never).delete().eq('id', id);
    reload();
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-emerald-50 via-white to-teal-50 text-slate-900">
      <div className="max-w-5xl mx-auto space-y-5">
        <Button variant="ghost" size="sm" className="text-slate-700 hover:bg-white" onClick={() => nav('/ssc')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>

        <div className="flex items-center gap-3">
          <Bookmark className="w-8 h-8 text-emerald-600" />
          <div>
            <h1 className="text-3xl font-bold">Bookmarks</h1>
            <p className="text-sm text-slate-500">Swipe questions or options horizontally in practice to save them here</p>
          </div>
        </div>

        {/* Subject count strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(Object.keys(SUBJECT_LABELS) as BookmarkSubject[]).map((s) => {
            const c = subjectCounts[s] || { total: 0, q: 0, o: 0 };
            return (
              <Card key={s} className="border-emerald-100">
                <CardContent className="p-3">
                  <div className="text-xs text-slate-500">{SUBJECT_LABELS[s]}</div>
                  <div className="text-2xl font-bold text-emerald-700">{c.total}</div>
                  <div className="text-[11px] text-slate-500">{c.q} Q · {c.o} options</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {loading && <div className="text-slate-500 text-sm">Loading…</div>}
        {!loading && rows.length === 0 && (
          <Card className="border-emerald-100"><CardContent className="p-8 text-center text-slate-500">
            No bookmarks yet. In any practice, swipe the question card ← or → to bookmark the question, or swipe an option to bookmark that option.
          </CardContent></Card>
        )}

        {(Object.keys(SUBJECT_LABELS) as BookmarkSubject[]).map((subj) => {
          const list = bySubject[subj];
          if (!list?.length) return null;
          const byChapter: Record<string, BookmarkRow[]> = {};
          for (const r of list) (byChapter[r.chapter] ||= []).push(r);
          const isOpen = openSubject[subj] !== false;
          return (
            <div key={subj} className="space-y-2">
              <button
                className="flex items-center gap-2 text-lg font-semibold text-slate-800"
                onClick={() => setOpenSubject((m) => ({ ...m, [subj]: !isOpen }))}
              >
                {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                {SUBJECT_LABELS[subj]} <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200">{list.length}</Badge>
              </button>
              {isOpen && Object.entries(byChapter).map(([chapter, items]) => {
                const key = `${subj}:${chapter}`;
                const chOpen = openChapter[key] !== false;
                const questions = items.filter((r) => r.kind === 'question');
                const options = items.filter((r) => r.kind === 'option');
                return (
                  <div key={key} className="border border-emerald-100 rounded-lg bg-white/70">
                    <button
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-slate-800"
                      onClick={() => setOpenChapter((m) => ({ ...m, [key]: !chOpen }))}
                    >
                      <span className="flex items-center gap-2">
                        {chOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        {CHAPTER_LABELS[chapter] || chapter}
                      </span>
                      <span className="text-xs text-slate-500">{questions.length} Q · {options.length} options</span>
                    </button>
                    {chOpen && (
                      <div className="px-4 pb-4 space-y-4">
                        {questions.length > 0 && (
                          <div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 uppercase tracking-wider mb-2">
                              <HelpCircle className="w-3 h-3" /> Questions
                            </div>
                            <div className="grid sm:grid-cols-2 gap-2">
                              {questions.map((r) => (
                                <Card key={r.id} className="border-emerald-200 bg-white">
                                  <CardContent className="p-3 space-y-1.5">
                                    <div className="text-sm text-slate-800">{r.question_text}</div>
                                    {r.correct_text && (
                                      <div className="text-xs text-emerald-700">✓ {r.correct_text}</div>
                                    )}
                                    <div className="flex justify-end">
                                      <Button size="sm" variant="ghost" className="h-7 text-rose-600 hover:bg-rose-50" onClick={() => remove(r.id)}>
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        )}
                        {options.length > 0 && (
                          <div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 uppercase tracking-wider mb-2">
                              <ListChecks className="w-3 h-3" /> Options
                            </div>
                            <div className="grid sm:grid-cols-2 gap-2">
                              {options.map((r) => (
                                <Card key={r.id} className="border-teal-200 bg-white">
                                  <CardContent className="p-3 space-y-1.5">
                                    <div className="text-xs text-slate-500">{r.question_text}</div>
                                    <div className="text-sm font-medium text-teal-800">→ {r.option_text}</div>
                                    <div className="flex justify-end">
                                      <Button size="sm" variant="ghost" className="h-7 text-rose-600 hover:bg-rose-50" onClick={() => remove(r.id)}>
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
