import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { fetchSscChapters, type ChapterInfo } from '@/lib/sscChapters';
import { BookOpenText, Loader2, RefreshCw, Eye, Wand2, Split, Merge, Link2 } from 'lucide-react';
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
  }


  /** 100-question chunks me serial-wise theory banata hai (bade chapters timeout nahi honge). */
  async function generateChunked(chapter: string, subtopic: string, total: number) {
    const k = keyOf(chapter, subtopic);
    setRunning(k);
    try {
      let offset = 0;
      let part = 0;
      const totalParts = Math.max(1, Math.ceil(total / CHUNK));
      for (;;) {
        part++;
        setStatus((s) => ({ ...s, [k]: `part ${part}/${totalParts} generating…` }));
        const fn = isGrammar ? 'ssc-grammar-theory' : 'ssc-theory-generate';
        const payload = isGrammar
          ? { pos: chapter, offset, limit: CHUNK, append: offset > 0, force: true }
          : { subject, chapter, subtopic, offset, limit: CHUNK, append: offset > 0, force: true };
        const { data, error } = await supabase.functions.invoke(fn, { body: payload });
        if (error) throw error;
        const d = data as { error?: string; hasMore?: boolean; nextOffset?: number; fetched?: number; chars?: number };
        if (d?.error) throw new Error(d.error);
        offset = d?.nextOffset ?? offset + CHUNK;
        if (!d?.hasMore) {
          setStatus((s) => ({ ...s, [k]: `done · ${part} parts · ${d?.chars || 0} chars` }));
          break;
        }
        await new Promise((r) => setTimeout(r, 800));
      }
      await refreshRow(chapter, subtopic);
      return true;
    } catch (e) {
      setStatus((s) => ({ ...s, [k]: `error: ${String(e).slice(0, 120)}` }));
      toast({ title: `${chapter} ${subtopic} failed`, description: String(e).slice(0, 200), variant: 'destructive' });
      return false;
    } finally {
      setRunning(null);
    }
  }

  /**
   * Ek chapter ki theory ko uske questions se map karta hai:
   * theory na ho to UPSC theory ki copy base banti hai (UPSC row unchanged),
   * phir 100-question chunks me "Covers: Q…" + missing facts add hote hain.
   */
  async function mapChunked(chapter: string, subtopic: string, total: number, subj = subject) {
    const k = keyOf(chapter, subtopic);
    setRunning(k);
    try {
      let offset = 0;
      let part = 0;
      const totalParts = Math.max(1, Math.ceil(total / CHUNK));
      let totalMapped = 0;
      for (;;) {
        part++;
        setStatus((s) => ({ ...s, [k]: `mapping chunk ${part}/${totalParts}…` }));
        setBulkProgress((p) => (p ? `${p.split(' · ')[0]} · ${chapter}: chunk ${part}/${totalParts}` : p));
        let d: {
          error?: string; needsGenerate?: boolean; basis?: string;
          hasMore?: boolean; nextOffset?: number; mapped?: number; addons?: number; chars?: number;
        } | null = null;
        // ek chunk fail ho to poora chapter mat chhodo — 2 retry
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
        if (!d?.hasMore) {
          setStatus((s) => ({
            ...s,
            [k]: `mapped · ${part} chunks · ${totalMapped} questions · base: ${d?.basis} · +${d?.addons || 0} addons`,
          }));
          break;
        }
        await new Promise((r) => setTimeout(r, 800));
      }

      await refreshRow(chapter, subtopic, subj);
      return true;
    } catch (e) {
      setStatus((s) => ({ ...s, [k]: `error: ${String(e).slice(0, 120)}` }));
      toast({ title: `${chapter} mapping failed`, description: String(e).slice(0, 200), variant: 'destructive' });
      return false;
    } finally {
      setRunning(null);
    }
  }


  /** Ek hi button — saare chapters ka question→theory mapping serial-wise. */
  async function mapAllChapters() {
    setBulk(true);
    try {
      let i = 0;
      for (const c of chapters) {
        i++;
        setBulkProgress(`${i}/${chapters.length} chapters · ${c.chapter}`);
        await mapChunked(c.chapter, '', c.count);
        await new Promise((r) => setTimeout(r, 600));
      }
      setBulkProgress(null);
      toast({ title: 'Question → theory mapping complete' });
    } finally {
      setBulk(false);
    }
  }

  /**
   * Ek hi button — saare GK subjects (Biology → Modern History) queue me:
   * har chapter ka question→theory mapping, phir 2+ subtopics wale chapters ki
   * theory automatically subtopics me split (question numbers ke saath).
   */
  async function runAllSubjects() {
    setBulk(true);
    try {
      let si = 0;
      for (const s of GK_SUBJECTS) {
        si++;
        const chs = await fetchSscChapters(s.key);
        let ci = 0;
        for (const c of chs) {
          ci++;
          setBulkProgress(`${si}/${GK_SUBJECTS.length} ${s.label} · ${ci}/${chs.length} ${c.chapter}`);
          await mapChunked(c.chapter, '', c.count, s.key);
          const subs = c.subtopics.filter((x) => x.name !== '—');
          if (subs.length >= 2) {
            let xi = 0;
            for (const sub of subs) {
              xi++;
              setBulkProgress(`${si}/${GK_SUBJECTS.length} ${s.label} · ${c.chapter} · split ${xi}/${subs.length} ${sub.name}`);
              await refine('split', c.chapter, sub.name, s.key);
              await new Promise((r) => setTimeout(r, 500));
            }
          }
          await new Promise((r) => setTimeout(r, 500));
        }
        if (s.key === subject) await loadTheories(s.key);
      }
      setBulkProgress(null);
      toast({ title: 'Saare subjects ki theory ready 🎉' });
    } catch (e) {
      toast({ title: 'Queue rukk gayi', description: String(e).slice(0, 200), variant: 'destructive' });
    } finally {
      setBulk(false);
    }
  }





  async function refine(mode: 'dedupe' | 'split' | 'merge', chapter: string, subtopic = '', subj = subject) {
    const k = keyOf(chapter, subtopic);
    setRunning(k);
    setStatus((s) => ({ ...s, [k]: `${mode}…` }));
    try {
      // Bade chapters ek request me 150s limit cross kar jaate the — ab chunk-wise resume hota hai.
      let state: unknown = undefined;
      for (let pass = 0; pass < 40; pass++) {
        const { data, error } = await supabase.functions.invoke('ssc-theory-refine', {
          body: { mode, subject: subj, chapter, subtopic, state },
        });
        if (error) throw error;
        const d = data as {
          error?: string; chars?: number; skipped?: boolean; done?: boolean;
          progress?: string; state?: unknown;
        };
        if (d?.error) throw new Error(d.error);
        if (d?.done === false) {
          state = d.state;
          setStatus((s) => ({ ...s, [k]: `${mode}… ${d.progress ?? ''}` }));
          continue;
        }
        setStatus((s) => ({ ...s, [k]: d?.skipped ? `${mode}: no content` : `${mode} done · ${d?.chars} chars` }));
        break;
      }
      await refreshRow(chapter, subtopic, subj);
      return true;

    } catch (e) {
      setStatus((s) => ({ ...s, [k]: `error: ${String(e).slice(0, 120)}` }));
      toast({ title: `${mode} failed`, description: String(e).slice(0, 200), variant: 'destructive' });
      return false;
    } finally {
      setRunning(null);
    }
  }

  const realSubs = (c: ChapterInfo) => c.subtopics.filter((s) => s.name !== '—');

  /** Chapter theory ko uske sabhi subtopics me distribute karo. */
  async function splitToSubtopics(c: ChapterInfo) {
    setBulk(true);
    try {
      for (const s of realSubs(c)) {
        await refine('split', c.chapter, s.name);
        await new Promise((r) => setTimeout(r, 600));
      }
      toast({ title: `${c.chapter} → subtopics distribute ho gaya` });
    } finally {
      setBulk(false);
    }
  }

  async function runQueue(jobs: { chapter: string; subtopic: string; total: number }[]) {
    setBulk(true);
    try {
      let fails = 0;
      for (const j of jobs) {
        const ok = await generateChunked(j.chapter, j.subtopic, j.total);
        if (!ok && ++fails >= 3) break;
        await new Promise((r) => setTimeout(r, 800));
      }
      toast({ title: 'Bulk generation finished' });
    } finally {
      setBulk(false);
    }
  }

  const generateAllPending = () =>
    runQueue(
      chapters
        .filter((c) => !theories[keyOf(c.chapter)])
        .map((c) => ({ chapter: c.chapter, subtopic: '', total: c.count })),
    );

  const generateAllPendingSubtopics = () =>
    runQueue(
      chapters.flatMap((c) =>
        realSubs(c)
          .filter((s) => !theories[keyOf(c.chapter, s.name)])
          .map((s) => ({ chapter: c.chapter, subtopic: s.name, total: s.count })),
      ),
    );

  const generateChapterSubtopics = (c: ChapterInfo) =>
    runQueue(
      realSubs(c)
        .filter((s) => !theories[keyOf(c.chapter, s.name)])
        .map((s) => ({ chapter: c.chapter, subtopic: s.name, total: s.count })),
    );

  /** Har chapter ke liye: theory chapter me hai to subtopics me baanto, sirf subtopics me hai to merge karo. */
  async function autoBalanceAll() {
    setBulk(true);
    try {
      for (const c of chapters) {
        const subs = realSubs(c);
        if (subs.length < 2) continue;
        const hasChapter = !!theories[keyOf(c.chapter)];
        const withSub = subs.filter((s) => theories[keyOf(c.chapter, s.name)]);
        if (hasChapter && withSub.length === 0) {
          for (const s of subs) {
            await refine('split', c.chapter, s.name);
            await new Promise((r) => setTimeout(r, 600));
          }
        } else if (!hasChapter && withSub.length) {
          await refine('merge', c.chapter, '');
          await new Promise((r) => setTimeout(r, 600));
        }
      }
      toast({ title: 'Auto balance complete' });
    } finally {
      setBulk(false);
    }
  }

  const pending = chapters.filter((c) => !theories[keyOf(c.chapter)]).length;
  const pendingSubs = chapters.reduce(
    (n, c) => n + realSubs(c).filter((s) => !theories[keyOf(c.chapter, s.name)]).length,
    0,
  );
  const busy = !!running || bulk;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <BookOpenText className="w-5 h-5 text-primary" /> SSC Chapter Theory
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          MCQs + Hinglish explanations se book-jaisi theory. Bade chapters {CHUNK}-question chunks me serial-wise generate hote hain.
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
            {loading
              ? 'Loading…'
              : `${chapters.length} ${isGrammar ? 'topics' : 'chapters'} · ${pending} pending${isGrammar ? '' : ` · ${pendingSubs} subtopic pending`}`}
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-500 text-white"
              disabled={loading || busy}
              onClick={runAllSubjects}
              title="Biology → Modern History tak sab subjects, chapters + subtopic split, ek hi queue me"
            >
              {bulk ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Rocket className="w-4 h-4 mr-1" />}
              Run ALL subjects (queue)
            </Button>

            <Button size="sm" disabled={loading || busy || !pending} onClick={generateAllPending}>
              {bulk ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <RefreshCw className="w-4 h-4 mr-1" />}
              All pending {isGrammar ? 'topics' : 'chapters'}
            </Button>
            {!isGrammar && (
              <>
                <Button size="sm" variant="outline" disabled={loading || busy || !pendingSubs} onClick={generateAllPendingSubtopics}>
                  <RefreshCw className="w-4 h-4 mr-1" /> All pending subtopics
                </Button>
                <Button size="sm" variant="secondary" disabled={loading || busy} onClick={autoBalanceAll}>
                  <Merge className="w-4 h-4 mr-1" /> Auto split / merge
                </Button>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white" disabled={loading || busy} onClick={mapAllChapters}>
                  {bulk ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Link2 className="w-4 h-4 mr-1" />}
                  Map questions → theory (all)
                </Button>
              </>
            )}
          </div>
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
            return (
              <div key={c.chapter} className="border rounded-md p-3 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <button className="min-w-0 text-left flex-1" disabled={!subs.length} onClick={() => setOpen(isOpen ? null : c.chapter)}>
                    <div className="text-sm font-medium truncate">{label}</div>
                    <div className="text-xs text-muted-foreground">
                      {c.count} questions · {subs.length ? `${subs.length} subtopics` : 'single'} ·{' '}
                      {status[keyOf(c.chapter)] || (t ? `generated ${new Date(t.generated_at).toLocaleDateString()}` : 'not generated')}
                    </div>
                  </button>
                  <div className="flex items-center gap-2 shrink-0">
                    {t ? <Badge variant="secondary">Ready</Badge> : <Badge variant="outline">Pending</Badge>}
                    {t && <Button size="sm" variant="ghost" onClick={() => setPreview(t)}><Eye className="w-4 h-4" /></Button>}
                    {t && (
                      <Button size="sm" variant="ghost" title="Repetition hatao" disabled={busy} onClick={() => refine('dedupe', c.chapter, '')}>
                        <Wand2 className="w-4 h-4" />
                      </Button>
                    )}
                    {!isGrammar && !!subs.length && t && (
                      <Button size="sm" variant="ghost" title="Chapter theory ko subtopics me baanto" disabled={busy} onClick={() => splitToSubtopics(c)}>
                        <Split className="w-4 h-4" />
                      </Button>
                    )}
                    {!isGrammar && !!subs.length && (
                      <Button size="sm" variant="ghost" title="Subtopic theories ko chapter me merge karo" disabled={busy} onClick={() => refine('merge', c.chapter, '')}>
                        <Merge className="w-4 h-4" />
                      </Button>
                    )}
                    {!isGrammar && !!subs.length && (
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={busy || !subs.some((s) => !theories[keyOf(c.chapter, s.name)])}
                        onClick={() => generateChapterSubtopics(c)}
                      >
                        All subtopics
                      </Button>
                    )}
                    {!isGrammar && (
                      <Button
                        size="sm"
                        variant="ghost"
                        title="Questions ko theory se map karo (UPSC base + Covers: Q…)"
                        disabled={busy}
                        onClick={() => mapChunked(c.chapter, '', c.count)}
                      >
                        <Link2 className="w-4 h-4" />
                      </Button>
                    )}
                    <Button size="sm" variant={t ? 'outline' : 'default'} disabled={busy} onClick={() => generateChunked(c.chapter, '', c.count)}>
                      {running === keyOf(c.chapter) ? <Loader2 className="w-4 h-4 animate-spin" /> : (t ? 'Regenerate' : 'Generate')}
                    </Button>
                  </div>
                </div>

                {isOpen && (
                  <div className="space-y-1.5 pt-1">
                    {subs.map((s) => {
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
                            {st && (
                              <Button size="sm" variant="ghost" title="Repetition hatao" disabled={busy} onClick={() => refine('dedupe', c.chapter, s.name)}>
                                <Wand2 className="w-4 h-4" />
                              </Button>
                            )}
                            {theories[keyOf(c.chapter)] && (
                              <Button size="sm" variant="ghost" title="Chapter theory se is subtopic ka hissa nikaalo" disabled={busy} onClick={() => refine('split', c.chapter, s.name)}>
                                <Split className="w-4 h-4" />
                              </Button>
                            )}
                            <Button size="sm" variant={st ? 'outline' : 'default'} disabled={busy} onClick={() => generateChunked(c.chapter, s.name, s.count)}>
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
