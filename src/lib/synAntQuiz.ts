import { supabase } from '@/integrations/supabase/client';

export type SAKind = 'synonym' | 'antonym';
export type SAMode = 'synonym' | 'antonym' | 'mixed';
export type SASub = 'top_100' | 'all_repeated';

export interface SAItem {
  id: string;
  kind: SAKind;
  subcategory: SASub;
  serial_no: number | null;
  word: string;
  meaning: string | null;
  hinglish_meaning: string | null;
  example_sentence: string | null;
  synonyms: string | null;
  antonyms: string | null;
  antonym_hinglish_meaning: string | null;
  antonym_example_sentence: string | null;
}

export interface SAQuestion {
  item: SAItem;
  kind: SAKind;
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function splitList(s: string | null): string[] {
  if (!s) return [];
  return s.split(/[,;/|]/).map((x) => x.trim()).filter(Boolean);
}

export async function fetchSAItems(mode: SAMode, sub: SASub): Promise<SAItem[]> {
  let q = supabase.from('ssc_syn_ant_items' as never).select('*').eq('subcategory', sub).limit(20000);
  if (mode !== 'mixed') q = q.eq('kind', mode);
  const { data, error } = await q;
  if (error) throw error;
  return (data as SAItem[]) || [];
}

function pickDistractors(pool: string[], correct: string, n: number): string[] {
  const seen = new Set<string>([correct.toLowerCase()]);
  const out: string[] = [];
  for (const p of shuffle(pool)) {
    const k = p.trim().toLowerCase();
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(p);
    if (out.length >= n) break;
  }
  return out;
}

const NUM_DISTRACTORS = 4;

export function buildSAQuestion(item: SAItem, all: SAItem[]): SAQuestion | null {
  const kind: SAKind = item.kind;
  const list = kind === 'synonym' ? splitList(item.synonyms) : splitList(item.antonyms);
  if (!list.length) return null;
  const correct = list[Math.floor(Math.random() * list.length)];
  const pool = all.flatMap((i) => splitList(kind === 'synonym' ? i.synonyms : i.antonyms));
  const distractors = pickDistractors(pool, correct, NUM_DISTRACTORS);
  if (distractors.length < NUM_DISTRACTORS) return null;
  const options = shuffle([correct, ...distractors]);
  return {
    item,
    kind,
    question: `${kind === 'synonym' ? 'Synonym' : 'Antonym'} of "${item.word}"?`,
    options,
    correct: options.indexOf(correct),
    explanation:
      kind === 'antonym'
        ? item.antonym_hinglish_meaning || item.antonym_example_sentence || item.meaning || undefined
        : item.hinglish_meaning || item.meaning || undefined,
  };
}

export function buildSAQuestionSet(items: SAItem[], count: number): SAQuestion[] {
  const source = shuffle(items);
  const out: SAQuestion[] = [];
  for (const it of source) {
    const q = buildSAQuestion(it, items);
    if (q) out.push(q);
    if (out.length >= count) break;
  }
  return out;
}
