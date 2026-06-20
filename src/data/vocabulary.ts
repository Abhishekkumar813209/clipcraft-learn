import raw from './vocabularyData.json';

export interface VocabularyWord {
  id: number;
  word: string;
  meaning: string;
  synonyms: string;
  section: string;       // "OWS" | "Hindu Vocab" | "Phobia" | "Mania" | "Phile"
  subsection: string;    // e.g. "Top 500", "All OWS"
  is_top500: boolean;
  ssc_frequency: number | null;
}

interface VocabMeta {
  title: string;
  author: string;
  source: string;
  total_words: number;
  sections: Record<string, number>;
}

const data = raw as unknown as { meta: VocabMeta; vocabulary: VocabularyWord[] };

export const VOCABULARY: VocabularyWord[] = data.vocabulary;
export const META = data.meta;

// Build section tree from actual data so subsections are accurate.
export interface SectionNode {
  section: string;
  total: number;
  subsections: { name: string; count: number }[];
}

export const SECTION_TREE: SectionNode[] = (() => {
  const map = new Map<string, Map<string, number>>();
  for (const w of VOCABULARY) {
    if (!map.has(w.section)) map.set(w.section, new Map());
    const sub = map.get(w.section)!;
    sub.set(w.subsection, (sub.get(w.subsection) || 0) + 1);
  }
  return Array.from(map.entries()).map(([section, subs]) => ({
    section,
    total: Array.from(subs.values()).reduce((a, b) => a + b, 0),
    subsections: Array.from(subs.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
  }));
})();

const byId = new Map<number, VocabularyWord>(VOCABULARY.map(w => [w.id, w]));
export const getWordById = (id: number) => byId.get(id) || null;

export function filterWords(opts: {
  section?: string | null;
  subsection?: string | null;
  top500Only?: boolean;
  search?: string;
  letter?: string | null;
}): VocabularyWord[] {
  const q = opts.search?.trim().toLowerCase();
  return VOCABULARY.filter(w => {
    if (opts.section && w.section !== opts.section) return false;
    if (opts.subsection && w.subsection !== opts.subsection) return false;
    if (opts.top500Only && !w.is_top500) return false;
    if (opts.letter && w.word.charAt(0).toUpperCase() !== opts.letter) return false;
    if (q && !w.word.toLowerCase().includes(q) && !w.meaning.toLowerCase().includes(q)) return false;
    return true;
  });
}

export function sortByFrequency(list: VocabularyWord[]): VocabularyWord[] {
  return [...list].sort((a, b) => {
    const af = a.ssc_frequency ?? Number.POSITIVE_INFINITY;
    const bf = b.ssc_frequency ?? Number.POSITIVE_INFINITY;
    if (af !== bf) return af - bf;
    return a.word.localeCompare(b.word);
  });
}

export function sortAlpha(list: VocabularyWord[]): VocabularyWord[] {
  return [...list].sort((a, b) => a.word.localeCompare(b.word));
}

/** Pick N random distractor meanings (different word ids), preferring same section. */
export function pickDistractorMeanings(correct: VocabularyWord, n: number): string[] {
  const pool = VOCABULARY.filter(w => w.id !== correct.id && w.section === correct.section && w.meaning);
  const source = pool.length >= n ? pool : VOCABULARY.filter(w => w.id !== correct.id && w.meaning);
  const picked = new Set<string>();
  const result: string[] = [];
  let guard = 0;
  while (result.length < n && guard < 500) {
    guard++;
    const m = source[Math.floor(Math.random() * source.length)].meaning;
    if (m === correct.meaning) continue;
    if (picked.has(m)) continue;
    picked.add(m);
    result.push(m);
  }
  return result;
}
