import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { UPSC_SUBJECTS } from '@/lib/upscSubjects';
import { fetchUpscChapters, UpscChapterInfo } from '@/lib/upscQuiz';
import { BookOpenText, Loader2, RefreshCw, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface TheoryRow {
  subject: string;
  chapter_no: number;
  question_count: number;
  generated_at: string;
  theory_md: string;
}

export default function AdminUpscTheory() {
  const [subject, setSubject] = useState(UPSC_SUBJECTS[0].subject);
  const [chapters, setChapters] = useState<UpscChapterInfo[]>([]);
  const [theories, setTheories] = useState<Record<number, TheoryRow>>({});
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState<number | null>(null);
  const [bulk, setBulk] = useState(false);
  const [status, setStatus] = useState<Record<number, string>>({});
  const [preview, setPreview] = useState<TheoryRow | null>(null);

  async function load(sub: string) {
    setLoading(true);
    setPreview(null);
    const [ch, th] = await Promise.all([
      fetchUpscChapters(sub),
      supabase
        .from('upsc_chapter_theory' as never)
        .select('subject,chapter_no,question_count,generated_at,theory_md')
        .eq('subject', sub),
    ]);
    setChapters(ch);
    const map: Record<number, TheoryRow> = {};
    for (const r of ((th.data as unknown as TheoryRow[]) || [])) map[r.chapter_no] = r;
    setTheories(map);
    setLoading(false);
  }

  useEffect(() => { load(subject); /* eslint-disable-next-line */ }, [subject]);

  async function generate(chapterNo: number, force: boolean) {
    setRunning(chapterNo);
    setStatus((s) => ({ ...s, [chapterNo]: 'generating…' }));
    try {
      const { data, error } = await supabase.functions.invoke('upsc-theory-generate', {
        body: { subject, chapter_no: chapterNo, force },
      });
      if (error) throw error;
      const d = data as { error?: string; skipped?: boolean; chars?: number; question_count?: number };
      if (d?.error) throw new Error(d.error);
      if (d?.skipped) {
        setStatus((s) => ({ ...s, [chapterNo]: 'already generated' }));
      } else {
        setStatus((s) => ({ ...s, [chapterNo]: `done · ${d.chars} chars from ${d.question_count} Qs` }));
      }
      const { data: row } = await supabase
        .from('upsc_chapter_theory' as never)
        .select('subject,chapter_no,question_count,generated_at,theory_md')
        .eq('subject', subject)
        .eq('chapter_no', chapterNo)
        .maybeSingle();
      if (row) setTheories((t) => ({ ...t, [chapterNo]: row as unknown as TheoryRow }));
      return true;
    } catch (e) {
      setStatus((s) => ({ ...s, [chapterNo]: `error: ${String(e).slice(0, 120)}` }));
      toast({ title: `Chapter ${chapterNo} failed`, description: String(e).slice(0, 200), variant: 'destructive' });
      return false;
    } finally {
      setRunning(null);
    }
  }

  async function generateAllPending() {
    setBulk(true);
    try {
      for (const c of chapters) {
        if (theories[c.chapter_no]) continue;
        const ok = await generate(c.chapter_no, false);
        if (!ok) break;
        await new Promise((r) => setTimeout(r, 800));
      }
      toast({ title: 'Bulk generation finished' });
    } finally {
      setBulk(false);
    }
  }

  const pending = chapters.filter((c) => !theories[c.chapter_no]).length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <BookOpenText className="w-5 h-5 text-primary" /> UPSC Theory Generator
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Har chapter ke saare questions, unke solutions aur NCERT extra points se book-jaisi Hinglish theory banti hai —
          serial/chronological order me, bold subheadings ke saath. Ek baar generate, phir users padh sakte hain.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {UPSC_SUBJECTS.map((s) => (
          <button
            key={s.slug}
            onClick={() => setSubject(s.subject)}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
              subject === s.subject
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-muted text-muted-foreground border-border'
            }`}
          >
            {s.emoji} {s.label}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">
            {loading ? 'Loading chapters…' : `${chapters.length} chapters · ${pending} pending`}
          </CardTitle>
          <Button size="sm" disabled={loading || bulk || !!running || !pending} onClick={generateAllPending}>
            {bulk ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <RefreshCw className="w-4 h-4 mr-1" />}
            Generate all pending
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {chapters.map((c) => {
            const t = theories[c.chapter_no];
            return (
              <div key={c.chapter_no} className="flex items-center justify-between gap-3 border rounded-md p-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">Ch {c.chapter_no} · {c.chapter_name}</div>
                  <div className="text-xs text-muted-foreground">
                    {c.count} questions · {status[c.chapter_no] || (t
                      ? `generated ${new Date(t.generated_at).toLocaleDateString()}`
                      : 'not generated')}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {t
                    ? <Badge variant="secondary">Ready</Badge>
                    : <Badge variant="outline">Pending</Badge>}
                  {t && (
                    <Button size="sm" variant="ghost" onClick={() => setPreview(t)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant={t ? 'outline' : 'default'}
                    disabled={!!running || bulk}
                    onClick={() => generate(c.chapter_no, !!t)}
                  >
                    {running === c.chapter_no ? <Loader2 className="w-4 h-4 animate-spin" /> : (t ? 'Regenerate' : 'Generate')}
                  </Button>
                </div>
              </div>
            );
          })}
          {!loading && !chapters.length && (
            <p className="text-sm text-muted-foreground">Is subject me abhi koi question nahi hai.</p>
          )}
        </CardContent>
      </Card>

      {preview && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Preview · Ch {preview.chapter_no}</CardTitle>
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
