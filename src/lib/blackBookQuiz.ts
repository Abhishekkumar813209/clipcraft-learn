import { supabase } from '@/integrations/supabase/client';

export type BBCategory = 'syn_ant' | 'idiom' | 'ows';

export interface BBItem {
  id: string;
  category: BBCategory;
  serial_no: number | null;
  prompt: string;
  answer: string;
  pos: string | null;
  hindi_meaning: string | null;
  english_meaning: string | null;
  hinglish_meaning: string | null;
  synonyms: string[] | null;
  antonyms: string[] | null;
  example: string | null;
}

export interface BBQuestion {
  itemId: string;
  category: BBCategory;
  question: string;
  options: string[];
  correct: number; // index in options
  explanation?: string;
}

export async function fetchBBItems(category?: BBCategory | 'mixed'): Promise<BBItem[]> {
  let q = supabase.from('ssc_black_book_items' as never).select('*');
  if (category && category !== 'mixed') q = q.eq('category', category);
  const { data, error } = await q;
  if (error) throw error;
  return (data as BBItem[]) || [];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickDistractors(pool: string[], correct: string, n: number): string[] {
  const set = new Set<string>();
  const filtered = pool.filter((p) => p && p.toLowerCase() !== correct.toLowerCase());
  const shuffled = shuffle(filtered);
  for (const p of shuffled) {
    if (set.size >= n) break;
    if (!Array.from(set).some((x) => x.toLowerCase() === p.toLowerCase())) set.add(p);
  }
  return Array.from(set);
}

export function buildQuestion(item: BBItem, allItems: BBItem[]): BBQuestion | null {
  if (item.category === 'syn_ant') {
    // Randomly synonym or antonym question
    const useAnt = Math.random() < 0.5 && item.antonyms && item.antonyms.length > 0;
    const list = useAnt ? item.antonyms! : (item.synonyms || []);
    if (!list.length) {
      // fallback try the other
      const other = useAnt ? item.synonyms : item.antonyms;
      if (!other?.length) return null;
      return buildQuestion({ ...item, synonyms: other, antonyms: null }, allItems);
    }
    const correct = list[Math.floor(Math.random() * list.length)];
    const pool = allItems.flatMap((i) => (useAnt ? i.antonyms : i.synonyms) || []);
    const distractors = pickDistractors(pool, correct, 3);
    if (distractors.length < 3) return null;
    const options = shuffle([correct, ...distractors]);
    return {
      itemId: item.id,
      category: 'syn_ant',
      question: `${useAnt ? 'Antonym' : 'Synonym'} of "${item.prompt}"?`,
      options,
      correct: options.indexOf(correct),
      explanation: item.english_meaning || undefined,
    };
  }
  if (item.category === 'idiom') {
    const correct = item.answer;
    const pool = allItems.filter((i) => i.category === 'idiom').map((i) => i.answer);
    const distractors = pickDistractors(pool, correct, 3);
    if (distractors.length < 3) return null;
    const options = shuffle([correct, ...distractors]);
    return {
      itemId: item.id,
      category: 'idiom',
      question: `Meaning of the idiom: "${item.prompt}"?`,
      options,
      correct: options.indexOf(correct),
      explanation: item.example || item.hinglish_meaning || undefined,
    };
  }
  // ows
  const correct = item.answer;
  const pool = allItems.filter((i) => i.category === 'ows').map((i) => i.answer);
  const distractors = pickDistractors(pool, correct, 3);
  if (distractors.length < 3) return null;
  const options = shuffle([correct, ...distractors]);
  return {
    itemId: item.id,
    category: 'ows',
    question: `One word for: "${item.prompt}"`,
    options,
    correct: options.indexOf(correct),
    explanation: item.hinglish_meaning || undefined,
  };
}

export function buildQuestionSet(items: BBItem[], count: number, ids?: string[]): BBQuestion[] {
  const source = ids
    ? (ids.map((id) => items.find((i) => i.id === id)).filter(Boolean) as BBItem[])
    : shuffle(items).slice(0, count);
  const qs: BBQuestion[] = [];
  for (const it of source) {
    const q = buildQuestion(it, items);
    if (q) qs.push(q);
  }
  return qs.slice(0, count);
}
