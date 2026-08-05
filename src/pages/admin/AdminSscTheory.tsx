import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { fetchSscChapters, allowsSubtopicTheory, type ChapterInfo } from '@/lib/sscChapters';
import { BookOpenText, Loader2, RefreshCw, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const SUBJECTS = [{ key: 'biology', label: '🧬 Biology' }];

interface TheoryRow {
  chapter: string;
  subtopic: string;
  question_count: number;
  generated_at: string;
  theory_md: string;
}

const keyOf = (chapter: string, subtopic = '') => `${chapter}||${subtopic}`;

export default function AdminSscTheory() {
  const [subject, setSubject] = useState(SUBJECTS[0].key);
  const [chapters, setChapters] = useState<ChapterInfo[]>([]);
  const [theories, setTheories] = useState<Record<string, TheoryRow>>({});
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState<string | null>(null);
  const [bulk, setBulk] = useState(false);
  const [status, setStatus] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<TheoryRow | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  async function load(sub: string) {
    setLoading(true);
    setPreview(null);
    const [ch, th] = await Promise.all([
      fetchSscChapters(sub),
      supabase
        .from('ssc_chapter_theory' as never)
        .select('chapter,subtopic,question_count,generated_at,theory_md')
        .eq('subject', sub),
    ]);
    setChapters(ch);
    const map: Record<string, TheoryRow> = {};
    for (const r of ((th.data as unknown as TheoryRow[]) || [])) map[keyOf(r.chapter, r.subtopic)] = r;
    setTheories(map);
    setLoading(false);
  }

  useEffect(() => { load(subject); /* eslint-disable-next-line */ }, [subject]);

  async function generate(chapter: string, subtopic: string, force: boolean) {
    const k = keyOf(chapter, subtopic);
    setRunning(k);
    setStatus((s) => ({ ...s, [k]: 'generating…' }));
    try {
      const { data, error } = await supabase.functions.invoke('ssc-theory-generate', {
        body: { subject, chapter, subtopic, force },
      });
      if (error) throw error;
      const d = data as { error?: string; skipped?: boolean; chars?: number; question_count?: number };
      if (d?.error) throw new Error(d.error);
      setStatus((s) => ({
        ...s,
        [k]: d?.skipped ? 'already generated' : `done · ${d.chars} chars from ${d.question_count} Qs`,
      }));
      const { data: row } = await supabase
        .from('ssc_chapter_theory' as never)
        .select('chapter,subtopic,question_count,generated_at,theory_md')
        .eq('subject', subject).eq('chapter', chapter).eq('subtopic', subtopic)
        .maybeSingle();
      if (row) setTheories((t) => ({ ...t, [k]: row as unknown as TheoryRow }));
      return true;
    } catch (e) {
      setStatus((s) => ({ ...s, [k]: `error: ${String(e).slice(0, 120)}` }));
      toast({ title: `${chapter} ${subtopic} failed`, description: String(e).slice(0, 200), variant: 'destructive' });
      return false;
    } finally {
      setRunning(null);
    }
  }

  async function runQueue(jobs: { chapter: string; subtopic: string }[]) {
    setBulk(true);
    try {
      let fails = 0;
      for (const j of jobs) {
        const ok = await generate(j.chapter, j.subtopic, false);
        if (!ok && ++fails >= 3) break;
        await new Promise((r) => setTimeout(r, 800));
      }
      toast({ title: 'Bulk generation finished' });
    } finally {
      setBulk(false);
    }
  }

  // Sirf real subtopics (placeholder '—' nahi) aur sirf eligible chapters
  const eligibleSubs = (c: ChapterInfo) =>
    allowsSubtopicTheory(subject, c.chapter)
      ? c.subtopics.filter((s) => s.name !== '—' && c.subtopics.length >= 2)
      : [];

  const generateAllPending = () =>
    runQueue(chapters.filter((c) => !theories[keyOf(c.chapter)]).map((c) => ({ chapter: c.chapter, subtopic: '' })));

  const generateAllPendingSubtopics = () =>
    runQueue(
      chapters.flatMap((c) =>
        eligibleSubs(c)
          .filter((s) => !theories[keyOf(c.chapter, s.name)])
          .map((s) => ({ chapter: c.chapter, subtopic: s.name })),
      ),
    );

  const generateChapterSubtopics = (c: ChapterInfo) =>
    runQueue(
      eligibleSubs(c)
        .filter((s) => !theories[keyOf(c.chapter, s.name)])
        .map((s) => ({ chapter: c.chapter, subtopic: s.name })),
    );

  const pending = chapters.filter((c) => !theories[keyOf(c.chapter)]).length;
  const pendingSubs = chapters.reduce(
    (n, c) => n + eligibleSubs(c).filter((s) => !theories[keyOf(c.chapter, s.name)]).length,
    0,
  );



  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <BookOpenText className="w-5 h-5 text-primary" /> SSC Chapter Theory
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Chapter ya subtopic ke saare MCQs + unke Hinglish explanations se book-jaisi theory generate hoti hai.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {SUBJECTS.map((s) => (
          <button
            key={s.key}
            onClick={() => setSubject(s.key)}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
              subject === s.key ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-border'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className="text-base">
            {loading ? 'Loading chapters…' : `${chapters.length} chapters · ${pending} chapter pending · ${pendingSubs} subtopic pending`}
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" disabled={loading || bulk || !!running || !pending} onClick={generateAllPending}>
              {bulk ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <RefreshCw className="w-4 h-4 mr-1" />}
              All pending chapters
            </Button>
            <Button size="sm" variant="outline" disabled={loading || bulk || !!running || !pendingSubs} onClick={generateAllPendingSubtopics}>
              {bulk ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <RefreshCw className="w-4 h-4 mr-1" />}
              All pending subtopics
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-2">
          {chapters.map((c) => {
            const t = theories[keyOf(c.chapter)];
            const isOpen = open === c.chapter;
            return (
              <div key={c.chapter} className="border rounded-md p-3 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <button className="min-w-0 text-left flex-1" onClick={() => setOpen(isOpen ? null : c.chapter)}>
                    <div className="text-sm font-medium truncate">{c.chapter}</div>
                    <div className="text-xs text-muted-foreground">
                      {c.count} questions · {c.subtopics.length} subtopics · {status[keyOf(c.chapter)] || (t ? `generated ${new Date(t.generated_at).toLocaleDateString()}` : 'not generated')}
                    </div>
                  </button>
                  <div className="flex items-center gap-2 shrink-0">
                    {t ? <Badge variant="secondary">Ready</Badge> : <Badge variant="outline">Pending</Badge>}
                    {t && <Button size="sm" variant="ghost" onClick={() => setPreview(t)}><Eye className="w-4 h-4" /></Button>}
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={!!running || bulk || !c.subtopics.some((s) => !theories[keyOf(c.chapter, s.name)])}
                      onClick={() => generateChapterSubtopics(c)}
                    >
                      All subtopics
                    </Button>
                    <Button size="sm" variant={t ? 'outline' : 'default'} disabled={!!running || bulk} onClick={() => generate(c.chapter, '', !!t)}>

                      {running === keyOf(c.chapter) ? <Loader2 className="w-4 h-4 animate-spin" /> : (t ? 'Regenerate' : 'Generate')}
                    </Button>
                  </div>
                </div>

                {isOpen && (
                  <div className="space-y-1.5 pt-1">
                    {c.subtopics.map((s) => {
                      const st = theories[keyOf(c.chapter, s.name)];
                      const k = keyOf(c.chapter, s.name);
                      return (
                        <div key={s.name} className="flex items-center justify-between gap-2 bg-muted/40 rounded px-3 py-2">
                          <div className="min-w-0">
                            <div className="text-xs font-medium truncate">{s.name}</div>
                            <div className="text-[11px] text-muted-foreground">
                              {s.count} Qs · {status[k] || (st ? 'generated' : 'not generated')}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {st && <Button size="sm" variant="ghost" onClick={() => setPreview(st)}><Eye className="w-4 h-4" /></Button>}
                            <Button size="sm" variant={st ? 'outline' : 'default'} disabled={!!running || bulk} onClick={() => generate(c.chapter, s.name, !!st)}>
                              {running === k ? <Loader2 className="w-4 h-4 animate-spin" /> : (st ? 'Regenerate' : 'Generate')}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          {!loading && !chapters.length && <p className="text-sm text-muted-foreground">Is subject me abhi koi question nahi hai.</p>}
        </CardContent>
      </Card>

      {preview && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Preview · {preview.subtopic || preview.chapter}</CardTitle>
            <Button size="sm" variant="ghost" onClick={() => setPreview(null)}>Close</Button>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{preview.theory_md}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
