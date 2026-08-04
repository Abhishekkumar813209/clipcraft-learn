import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchSscChapters, type ChapterInfo } from '@/lib/sscChapters';
import { supabase } from '@/integrations/supabase/client';
import { ChevronDown, ChevronRight, BookOpenText, Play, Loader2 } from 'lucide-react';

const SUBJECT = 'biology';

export default function SscBiology() {
  const nav = useNavigate();
  const [chapters, setChapters] = useState<ChapterInfo[]>([]);
  const [theoryKeys, setTheoryKeys] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [ch, th] = await Promise.all([
        fetchSscChapters(SUBJECT),
        supabase.from('ssc_chapter_theory' as never).select('chapter,subtopic').eq('subject', SUBJECT),
      ]);
      setChapters(ch);
      const rows = (th.data as unknown as { chapter: string; subtopic: string }[]) || [];
      setTheoryKeys(new Set(rows.map((r) => `${r.chapter}||${r.subtopic || ''}`)));
      setLoading(false);
    })();
  }, []);

  const q = (chapter: string, subtopic?: string) =>
    `/ssc/gk/biology/practice?chapter=${encodeURIComponent(chapter)}${subtopic ? `&subtopic=${encodeURIComponent(subtopic)}` : ''}`;
  const t = (chapter: string, subtopic?: string) =>
    `/ssc/gk/biology/theory?chapter=${encodeURIComponent(chapter)}${subtopic ? `&subtopic=${encodeURIComponent(subtopic)}` : ''}`;

  const total = chapters.reduce((s, c) => s + c.count, 0);

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">🧬 Biology</h1>
        <p className="text-sm text-muted-foreground">
          {loading ? 'Loading…' : `${chapters.length} chapters · ${total} questions`} — chapter kholo, subtopic-wise quiz ya theory chuno.
        </p>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" /> Chapters load ho rahe hain…
        </div>
      )}

      <div className="space-y-3">
        {chapters.map((c) => {
          const isOpen = open === c.chapter;
          const hasTheory = theoryKeys.has(`${c.chapter}||`);
          return (
            <Card key={c.chapter} className="border-emerald-100">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <button
                    className="flex items-start gap-2 text-left min-w-0 flex-1"
                    onClick={() => setOpen(isOpen ? null : c.chapter)}
                  >
                    {isOpen ? <ChevronDown className="w-4 h-4 mt-1 text-emerald-600" /> : <ChevronRight className="w-4 h-4 mt-1 text-emerald-600" />}
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{c.chapter}</div>
                      <div className="text-xs text-muted-foreground">
                        {c.count} questions · {c.subtopics.length} subtopics
                      </div>
                    </div>
                  </button>
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="outline" onClick={() => nav(t(c.chapter))}>
                      <BookOpenText className="w-4 h-4 sm:mr-1" />
                      <span className="hidden sm:inline">{hasTheory ? 'Theory' : 'Theory'}</span>
                    </Button>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500" onClick={() => nav(q(c.chapter))}>
                      <Play className="w-4 h-4 sm:mr-1" />
                      <span className="hidden sm:inline">Quiz</span>
                    </Button>
                  </div>
                </div>

                {isOpen && (
                  <div className="grid sm:grid-cols-2 gap-2 pt-1">
                    {c.subtopics.map((s) => (
                      <div key={s.name} className="border rounded-md p-3 flex items-center justify-between gap-2 bg-emerald-50/40">
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{s.name}</div>
                          <div className="text-[11px] text-muted-foreground">{s.count} questions</div>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <Button size="sm" variant="ghost" onClick={() => nav(t(c.chapter, s.name))}>
                            <BookOpenText className="w-4 h-4" />
                          </Button>
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500" onClick={() => nav(q(c.chapter, s.name))}>
                            <Play className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
