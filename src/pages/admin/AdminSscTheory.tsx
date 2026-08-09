import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { fetchSscChapters, type ChapterInfo } from '@/lib/sscChapters';
import { BookOpenText, Loader2, Eye, Link2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { GK_SUBJECTS } from '@/lib/sscGkSubjects';

const SUBJECTS = [
  ...GK_SUBJECTS.map((g) => ({ key: g.key, label: `${g.emoji} ${g.label}` })),
  { key: 'english_grammar', label: '📚 English Grammar' },
];

const GRAMMAR_LABELS: Record<string, string> = {
  narration_mcq: 'Narration — MCQs',
  narration_spot: 'Narration — Spot the Error',
  passive_voice: 'Passive Voice — Spot the Error',
  passive_voice_mcq: 'Passive Voice — MCQs',
  tense: 'Tense',
  verb: 'Verb',
};

const CHUNK = 100;

interface TheoryRow {
  chapter: string;
  subtopic: string;
  question_count: number;
  generated_at: string;
  theory_md: string;
}

const keyOf = (chapter: string, subtopic = '') => `${chapter}||${subtopic}`;
const hasCovers = (md: string) => /(^|\n)\s*>\s*covers\s*:/i.test(md || '');

export default function AdminSscTheory() {
  const [subject, setSubject] = useState(SUBJECTS[0].key);
  const [chapters, setChapters] = useState<ChapterInfo[]>([]);
  const [theories, setTheories] = useState<Record<string, TheoryRow>>({});
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState<string | null>(null);
  const [bulk, setBulk] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<string | null>(null);
  const [status, setStatus] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<TheoryRow | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  const isGrammar = subject === 'english_grammar';

  async function loadTheories(sub: string) {
    const { data } = await supabase
      .from('ssc_chapter_theory' as never)
      .select('chapter,subtopic,question_count,generated_at,theory_md')
      .eq('subject', sub);
    const map: Record<string, TheoryRow> = {};
    for (const r of ((data as unknown as TheoryRow[]) || [])) map[keyOf(r.chapter, r.subtopic)] = r;
    setTheories(map);
  }

  async function loadGrammarChapters(): Promise<ChapterInfo[]> {
    const rows: { pos: string }[] = [];
    const PAGE = 1000;
    for (let off = 0; ; off += PAGE) {
      const { data } = await supabase
        .from('ssc_pos_spot_error' as never)
        .select('pos')
        .range(off, off + PAGE - 1);
      const page = (data as unknown as { pos: string }[]) || [];
      rows.push(...page);
      if (page.length < PAGE) break;
    }
    const counts = new Map<string, number>();
    for (const r of rows) counts.set(r.pos, (counts.get(r.pos) || 0) + 1);
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([pos, count]) => ({ chapter: pos, count, minSerial: 1, maxSerial: count, subtopics: [] }));
  }

  async function load(sub: string) {
    setLoading(true);
    setPreview(null);
    const ch = sub === 'english_grammar' ? await loadGrammarChapters() : await fetchSscChapters(sub);
    setChapters(ch);
    await loadTheories(sub);
    setLoading(false);
  }

  useEffect(() => { load(subject); /* eslint-disable-next-line */ }, [subject]);

  async function refreshRow(chapter: string, subtopic: string, subj = subject) {
    const { data: row } = await supabase
      .from('ssc_chapter_theory' as never)
      .select('chapter,subtopic,question_count,generated_at,theory_md')
      .eq('subject', subj).eq('chapter', chapter).eq('subtopic', subtopic)
      .maybeSingle();
    if (row && subj === subject) setTheories((t) => ({ ...t, [keyOf(chapter, subtopic)]: row as unknown as TheoryRow }));
    return (row as unknown as TheoryRow) || null;
  }

  /** 100-question chunks me serial-wise theory banata hai (bade chapters timeout nahi honge). */
  async function generateChunked(chapter: string, subtopic: string, total: number) {
    const k = keyOf(chapter, subtopic);
    let offset = 0;
    let part = 0;
    const totalParts = Math.max(1, Math.ceil(total / CHUNK));
    for (;;) {
      part++;
      setStatus((s) => ({ ...s, [k]: `theory part ${part}/${totalParts}…` }));
      const fn = isGrammar ? 'ssc-grammar-theory' : 'ssc-theory-generate';
      const payload = isGrammar
        ? { pos: chapter, offset, limit: CHUNK, append: offset > 0, force: true }
        : { subject, chapter, subtopic, offset, limit: CHUNK, append: offset > 0, force: true };
      const { data, error } = await supabase.functions.invoke(fn, { body: payload });
      if (error) throw error;
      const d = data as { error?: string; hasMore?: boolean; nextOffset?: number };
      if (d?.error) throw new Error(d.error);
      offset = d?.nextOffset ?? offset + CHUNK;
      if (!d?.hasMore) break;
      await new Promise((r) => setTimeout(r, 800));
    }
  }

  /** Theory ke andar inline `> Covers: Q…` references daalta hai (100-question chunks me). */
  async function mapChunked(chapter: string, subtopic: string, total: number, subj = subject) {
    const k = keyOf(chapter, subtopic);
    let offset = 0;
    let part = 0;
    const totalParts = Math.max(1, Math.ceil(total / CHUNK));
    let totalMapped = 0;
    for (;;) {
      part++;
      setStatus((s) => ({ ...s, [k]: `linking chunk ${part}/${totalParts}…` }));
      let d: { error?: string; hasMore?: boolean; nextOffset?: number; mapped?: number } | null = null;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const { data, error } = await supabase.functions.invoke('ssc-theory-map', {
            body: { subject: subj, chapter, subtopic, offset, limit: CHUNK },
          });
          if (error) throw error;
          if ((data as { error?: string })?.error) throw new Error((data as { error?: string }).error);
          d = data as typeof d;
          break;
        } catch (err) {
          if (attempt === 2) throw err;
          await new Promise((r) => setTimeout(r, 1500));
        }
      }
      totalMapped += d?.mapped || 0;
      offset = d?.nextOffset ?? offset + CHUNK;
      if (!d?.hasMore) break;
      await new Promise((r) => setTimeout(r, 800));
    }
    return totalMapped;
  }

  /**
   * SINGLE ACTION — "Generate theory with inline question references & links".
   * Theory nahi hai to pehle banti hai, phir har question ka `> Covers: Q…` link theory me inline add hota hai.
   */
  async function runOne(chapter: string, subtopic: string, total: number) {
    const k = keyOf(chapter, subtopic);
    setRunning(k);
    try {
      if (!theories[k]) await generateChunked(chapter, subtopic, total);
      const mapped = await mapChunked(chapter, subtopic, total);
      const row = await refreshRow(chapter, subtopic);
      setStatus((s) => ({
        ...s,
        [k]: row && hasCovers(row.theory_md) ? `✅ linked · ${mapped || total} questions` : `⚠️ links nahi bane`,
      }));
      return true;
    } catch (e) {
      setStatus((s) => ({ ...s, [k]: `error: ${String(e).slice(0, 120)}` }));
      return false;
    } finally {
      setRunning(null);
    }
  }

  /** Poore subject ke saare chapters (+ subtopics) ke liye wahi single action. */
  async function runSubject() {
    setBulk(true);
    try {
      let i = 0;
      for (const c of chapters) {
        i++;
        setBulkProgress(`${i}/${chapters.length} · ${c.chapter}`);
        await runOne(c.chapter, '', c.count);
        const subs = isGrammar ? [] : c.subtopics.filter((s) => s.name !== '—');
        if (subs.length >= 2) {
          for (const s of subs) {
            setBulkProgress(`${i}/${chapters.length} · ${c.chapter} → ${s.name}`);
            await runOne(c.chapter, s.name, s.count);
          }
        }
        await new Promise((r) => setTimeout(r, 500));
      }
      setBulkProgress(null);
      toast({ title: 'Theory + inline question links ready 🎉' });
    } catch (e) {
      toast({ title: 'Ruk gaya', description: String(e).slice(0, 200), variant: 'destructive' });
    } finally {
      setBulk(false);
    }
  }

  const realSubs = (c: ChapterInfo) => c.subtopics.filter((s) => s.name !== '—');
  const linked = chapters.filter((c) => {
    const t = theories[keyOf(c.chapter)];
    return t && hasCovers(t.theory_md);
  }).length;
  const busy = !!running || bulk;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <BookOpenText className="w-5 h-5 text-primary" /> SSC Chapter Theory
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Ek hi button: theory banti hai aur usi ke andar har question ka inline reference (<code>Covers: Q…</code>) + link lag jaata hai.
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
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-base">
            {loading
              ? 'Loading…'
              : `${chapters.length} ${isGrammar ? 'topics' : 'chapters'} · ${linked} linked · ${chapters.length - linked} baaki`}
          </CardTitle>
          <Button
            className="bg-emerald-600 hover:bg-emerald-500 text-white"
            disabled={loading || busy}
            onClick={runSubject}
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Link2 className="w-4 h-4 mr-2" />}
            Generate theory with inline question references & links
          </Button>
        </CardHeader>

        {bulkProgress && (
          <div className="px-6 -mt-2 pb-2 text-xs text-emerald-700 flex items-center gap-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> {bulkProgress}
          </div>
        )}

        <CardContent className="space-y-2">
          {chapters.map((c) => {
            const t = theories[keyOf(c.chapter)];
            const subs = isGrammar ? [] : realSubs(c);
            const isOpen = !!subs.length && open === c.chapter;
            const label = isGrammar ? (GRAMMAR_LABELS[c.chapter] || c.chapter) : c.chapter;
            const isLinked = !!t && hasCovers(t.theory_md);
            return (
              <div key={c.chapter} className="border rounded-md p-3 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <button className="min-w-0 text-left flex-1" disabled={!subs.length} onClick={() => setOpen(isOpen ? null : c.chapter)}>
                    <div className="text-sm font-medium truncate">{label}</div>
                    <div className="text-xs text-muted-foreground">
                      {c.count} questions · {subs.length ? `${subs.length} subtopics` : 'single'} ·{' '}
                      {status[keyOf(c.chapter)] || (isLinked ? 'theory + links ready' : t ? 'theory hai, links pending' : 'not generated')}
                    </div>
                  </button>
                  <div className="flex items-center gap-2 shrink-0">
                    {isLinked ? <Badge variant="secondary">Linked</Badge> : t ? <Badge variant="outline">No links</Badge> : <Badge variant="outline">Pending</Badge>}
                    {t && <Button size="sm" variant="ghost" onClick={() => setPreview(t)}><Eye className="w-4 h-4" /></Button>}
                    <Button size="sm" variant={isLinked ? 'outline' : 'default'} disabled={busy} onClick={() => runOne(c.chapter, '', c.count)}>
                      {running === keyOf(c.chapter) ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate + link'}
                    </Button>
                  </div>
                </div>

                {isOpen && (
                  <div className="space-y-1.5 pt-1">
                    {subs.map((s) => {
                      const st = theories[keyOf(c.chapter, s.name)];
                      const k = keyOf(c.chapter, s.name);
                      const subLinked = !!st && hasCovers(st.theory_md);
                      return (
                        <div key={s.name} className="flex items-center justify-between gap-2 bg-muted/40 rounded px-3 py-2">
                          <div className="min-w-0">
                            <div className="text-xs font-medium truncate">{s.name}</div>
                            <div className="text-[11px] text-muted-foreground">
                              {s.count} Qs · {status[k] || (subLinked ? 'theory + links ready' : st ? 'theory hai, links pending' : 'not generated')}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {st && <Button size="sm" variant="ghost" onClick={() => setPreview(st)}><Eye className="w-4 h-4" /></Button>}
                            <Button size="sm" variant={subLinked ? 'outline' : 'default'} disabled={busy} onClick={() => runOne(c.chapter, s.name, s.count)}>
                              {running === k ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate + link'}
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
