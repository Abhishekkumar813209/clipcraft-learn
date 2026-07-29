import { supabase } from '@/integrations/supabase/client';

export interface UpscQuestion {
  id: string;
  subject: string;
  chapter_no: number;
  chapter_name: string;
  topic_tag: string | null;
  serial_no: number;
  global_serial: number;
  q_type: string;
  question_text: string;
  statements: string | null;
  list_i: string | null;
  list_ii: string | null;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  ncert_source: string | null;
  explanation_hinglish: string | null;
  why_a: string | null;
  why_b: string | null;
  why_c: string | null;
  why_d: string | null;
  ncert_extra: string | null;
  hint_hinglish: string | null;
}

export interface UpscChapterInfo {
  chapter_no: number;
  chapter_name: string;
  count: number;
  minSerial: number;
  maxSerial: number;
}

export async function fetchUpscChapters(subject = 'ancient_history'): Promise<UpscChapterInfo[]> {
  const data: any[] = [];
  const PAGE = 1000;
  for (let offset = 0; ; offset += PAGE) {
    const { data: page } = await supabase
      .from('upsc_questions' as never)
      .select('chapter_no,chapter_name,global_serial')
      .eq('subject', subject)
      .order('global_serial', { ascending: true })
      .range(offset, offset + PAGE - 1);
    const rowsPage = (page as any[]) || [];
    data.push(...rowsPage);
    if (rowsPage.length < PAGE) break;
  }
  const map = new Map<number, UpscChapterInfo>();
  for (const r of ((data as any[]) || [])) {
    const cur = map.get(r.chapter_no);
    if (!cur) {
      map.set(r.chapter_no, {
        chapter_no: r.chapter_no,
        chapter_name: r.chapter_name,
        count: 1,
        minSerial: r.global_serial,
        maxSerial: r.global_serial,
      });
    } else {
      cur.count += 1;
      cur.minSerial = Math.min(cur.minSerial, r.global_serial);
      cur.maxSerial = Math.max(cur.maxSerial, r.global_serial);
    }
  }
  return [...map.values()].sort((a, b) => a.chapter_no - b.chapter_no);
}

export interface UpscQuizOptions {
  subject?: string;
  chapter?: number | null;   // null = all chapters
  from?: number | null;      // global serial range
  to?: number | null;
  order?: 'serial' | 'random';
  count?: number | null;
}

export async function fetchUpscQuestions(opts: UpscQuizOptions): Promise<UpscQuestion[]> {
  const { subject = 'ancient_history', chapter = null, from = null, to = null, order = 'serial', count = null } = opts;
  const PAGE = 1000;
  let rows: UpscQuestion[] = [];
  for (let offset = 0; ; offset += PAGE) {
    let q = supabase
      .from('upsc_questions' as never)
      .select('*')
      .eq('subject', subject)
      .order('global_serial', { ascending: true })
      .range(offset, offset + PAGE - 1);
    if (chapter != null) q = q.eq('chapter_no', chapter);
    if (from != null) q = q.gte('global_serial', from);
    if (to != null) q = q.lte('global_serial', to);
    const { data } = await q;
    const pageRows = ((data as unknown) as UpscQuestion[]) || [];
    rows = rows.concat(pageRows);
    if (pageRows.length < PAGE) break;
    if (count && count > 0 && order === 'serial' && rows.length >= count) break;
  }
  if (order === 'random') rows = [...rows].sort(() => Math.random() - 0.5);
  if (count && count > 0) rows = rows.slice(0, count);
  return rows;
}

export const OPTION_KEYS = ['a', 'b', 'c', 'd'] as const;
export type OptionKey = (typeof OPTION_KEYS)[number];

export function optionText(q: UpscQuestion, k: OptionKey): string {
  return (q as any)[`option_${k}`] ?? '';
}

export function optionWhy(q: UpscQuestion, k: OptionKey): string | null {
  return (q as any)[`why_${k}`] ?? null;
}
