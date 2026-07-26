import { supabase } from '@/integrations/supabase/client';

export interface RbiVocabItem {
  id: string;
  serial_no: number;
  word: string;
  meaning: string;
  example: string | null;
  hinglish_meaning: string | null;
  root_word: string;
  root_meaning: string;
}

export interface RbiVocabQuestion {
  item: RbiVocabItem;
  question: string;
  options: string[];
  correct: number;
}

export async function fetchRbiVocab(): Promise<RbiVocabItem[]> {
  const { data, error } = await supabase
    .from('rbi_vocab_words' as never)
    .select('*')
    .order('serial_no', { ascending: true })
    .limit(20000);
  if (error) throw error;
  return ((data as unknown) as RbiVocabItem[]) || [];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildRbiVocabQuestions(
  pool: RbiVocabItem[],
  count: number,
  order: 'serial' | 'random' = 'random',
  allItems?: RbiVocabItem[],
): RbiVocabQuestion[] {
  if (!pool.length) return [];
  const distractorPool = (allItems && allItems.length > 4 ? allItems : pool);
  const picked = (order === 'serial' ? [...pool].sort((a, b) => a.serial_no - b.serial_no) : shuffle(pool))
    .slice(0, Math.max(1, count));

  return picked.map((item) => {
    const wrong = shuffle(distractorPool.filter((x) => x.id !== item.id && x.meaning !== item.meaning))
      .slice(0, 3)
      .map((x) => x.meaning);
    const options = shuffle([item.meaning, ...wrong]);
    return {
      item,
      question: `What does "${item.word}" mean?`,
      options,
      correct: options.indexOf(item.meaning),
    };
  });
}
