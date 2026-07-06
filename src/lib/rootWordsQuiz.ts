import { supabase } from '@/integrations/supabase/client';

export interface RootWord {
  id: number;
  sno: number | null;
  root: string;
  root_meaning: string | null;
  root_plus_word: string | null;
  word: string;
  definition: string | null;
  hinglish_meaning: string | null;
  example: string | null;
  synonym: string | null;
  antonym: string | null;
}

export type RootQType = 'definition' | 'root_match' | 'synonym';

export interface RootQuestion {
  wordId: number;
  word: RootWord;
  qtype: RootQType;
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

export async function fetchAllRootWords(): Promise<RootWord[]> {
  const all: RootWord[] = [];
  const pageSize = 1000;
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from('ssc_root_words' as never)
      .select('*')
      .order('id')
      .range(from, from + pageSize - 1);
    if (error) throw error;
    const rows = (data as RootWord[]) || [];
    all.push(...rows);
    if (rows.length < pageSize) break;
    from += pageSize;
  }
  return all;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickDistinct(pool: string[], correct: string, n: number): string[] {
  const seen = new Set([correct.toLowerCase()]);
  const out: string[] = [];
  for (const p of shuffle(pool)) {
    if (!p) continue;
    const k = p.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(p);
    if (out.length >= n) break;
  }
  return out;
}

function buildOne(word: RootWord, all: RootWord[]): RootQuestion | null {
  const types: RootQType[] = ['definition', 'root_match'];
  if (word.synonym && word.synonym.trim()) types.push('synonym');
  const qtype = types[Math.floor(Math.random() * types.length)];

  if (qtype === 'definition' && word.definition) {
    const pool = all.filter(w => w.id !== word.id && w.definition).map(w => w.definition!);
    const distractors = pickDistinct(pool, word.definition, 3);
    if (distractors.length < 3) return null;
    const options = shuffle([word.definition, ...distractors]);
    return {
      wordId: word.id, word, qtype,
      question: `Meaning of "${word.word}"?`,
      options, correct: options.indexOf(word.definition),
      explanation: word.hinglish_meaning || word.example || undefined,
    };
  }

  if (qtype === 'root_match') {
    // Which of these words belongs to root X?
    const sameRoot = all.filter(w => w.root === word.root && w.id !== word.id);
    if (!sameRoot.length) return buildOne(word, all.filter(w => w.id !== word.id));
    const correctWord = word.word;
    const pool = all.filter(w => w.root !== word.root).map(w => w.word);
    const distractors = pickDistinct(pool, correctWord, 3);
    if (distractors.length < 3) return null;
    const options = shuffle([correctWord, ...distractors]);
    return {
      wordId: word.id, word, qtype,
      question: `Which word comes from the root "${word.root}"${word.root_meaning ? ` (${word.root_meaning})` : ''}?`,
      options, correct: options.indexOf(correctWord),
      explanation: word.definition || undefined,
    };
  }

  if (qtype === 'synonym' && word.synonym) {
    const correct = word.synonym.split(',')[0].trim();
    const pool = all.filter(w => w.id !== word.id).map(w => w.word);
    const distractors = pickDistinct(pool, correct, 3);
    if (distractors.length < 3) return null;
    const options = shuffle([correct, ...distractors]);
    return {
      wordId: word.id, word, qtype,
      question: `Synonym of "${word.word}"?`,
      options, correct: options.indexOf(correct),
      explanation: word.definition || undefined,
    };
  }
  return null;
}

/** Pick `rootsCount` random roots, gather their words, generate `qCount` questions. */
export function buildRootSession(all: RootWord[], rootsCount = 30, qCount = 20) {
  const rootMap = new Map<string, RootWord[]>();
  for (const w of all) {
    if (!rootMap.has(w.root)) rootMap.set(w.root, []);
    rootMap.get(w.root)!.push(w);
  }
  const roots = shuffle(Array.from(rootMap.keys())).slice(0, rootsCount);
  const words = shuffle(roots.flatMap(r => rootMap.get(r) || []));
  const questions: RootQuestion[] = [];
  for (const w of words) {
    if (questions.length >= qCount) break;
    const q = buildOne(w, all);
    if (q) questions.push(q);
  }
  return { roots, questions };
}
