import { supabase } from '@/integrations/supabase/client';

export interface ChapterQuestion {
  id: string;
  chapter: string;
  subtopic: string;
  serial_no: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  exam_name: string | null;
  explanation_hinglish: string | null;
  source: string | null;
}

export interface ChapterInfo {
  chapter: string;
  count: number;
  subtopics: { name: string; count: number }[];
}

export async function fetchSscChapters(subject: string): Promise<ChapterInfo[]> {
  const rows: { chapter: string; subtopic: string }[] = [];
  const PAGE = 1000;
  for (let off = 0; ; off += PAGE) {
    const { data, error } = await supabase
      .from('ssc_chapter_questions' as never)
      .select('chapter,subtopic')
      .eq('subject', subject)
      .range(off, off + PAGE - 1);
    if (error) throw error;
    const page = (data as unknown as { chapter: string; subtopic: string }[]) || [];
    rows.push(...page);
    if (page.length < PAGE) break;
  }
  const map = new Map<string, Map<string, number>>();
  for (const r of rows) {
    if (!map.has(r.chapter)) map.set(r.chapter, new Map());
    const sub = map.get(r.chapter)!;
    const key = r.subtopic || '—';
    sub.set(key, (sub.get(key) || 0) + 1);
  }
  return [...map.entries()]
    .map(([chapter, subs]) => ({
      chapter,
      count: [...subs.values()].reduce((a, b) => a + b, 0),
      subtopics: [...subs.entries()]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => a.chapter.localeCompare(b.chapter));
}

export async function fetchSscChapterQuestions(
  subject: string,
  chapter: string,
  subtopic?: string,
): Promise<ChapterQuestion[]> {
  const rows: ChapterQuestion[] = [];
  const PAGE = 1000;
  for (let off = 0; ; off += PAGE) {
    let q = supabase
      .from('ssc_chapter_questions' as never)
      .select('*')
      .eq('subject', subject)
      .eq('chapter', chapter);
    if (subtopic) q = q.eq('subtopic', subtopic);
    const { data, error } = await q.order('serial_no', { ascending: true }).range(off, off + PAGE - 1);
    if (error) throw error;
    const page = (data as unknown as ChapterQuestion[]) || [];
    rows.push(...page);
    if (page.length < PAGE) break;
  }
  return rows;
}

export async function fetchSscTheory(subject: string, chapter: string, subtopic = '') {
  const { data } = await supabase
    .from('ssc_chapter_theory' as never)
    .select('chapter,subtopic,theory_md,question_count,generated_at')
    .eq('subject', subject)
    .eq('chapter', chapter)
    .eq('subtopic', subtopic)
    .maybeSingle();
  return (data as unknown as {
    chapter: string;
    subtopic: string;
    theory_md: string;
    question_count: number;
    generated_at: string;
  }) || null;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
