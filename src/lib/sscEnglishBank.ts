export type BankCategory = 'spot_error' | 'sentence_improvement' | 'fill_blanks' | 'cloze' | 'parajumble';

export interface BankMeta {
  key: BankCategory;
  label: string;
  emoji: string;
  blurb: string;
}

export const BANK_CATEGORIES: BankMeta[] = [
  { key: 'spot_error', label: 'Error Detection', emoji: '🔍', blurb: 'Spot the error — Hinglish meaning, hint & solution' },
  { key: 'sentence_improvement', label: 'Sentence Improvement', emoji: '✍️', blurb: 'Best correction chuno — hint + Hinglish solution' },
  { key: 'fill_blanks', label: 'Fill in the Blanks', emoji: '🧩', blurb: 'Har option ka kyu sahi/galat — click karke dekho' },
  { key: 'cloze', label: 'Cloze Test', emoji: '📖', blurb: 'Passage-wise blanks with per-option explanation' },
  { key: 'parajumble', label: 'Parajumble', emoji: '🧵', blurb: 'Sentence rearrangement — position logic hint + solver lesson' },
];

export const bankMeta = (key?: string): BankMeta =>
  BANK_CATEGORIES.find((c) => c.key === key) || BANK_CATEGORIES[0];

export interface BankItem {
  id: string;
  category: BankCategory;
  serial_no: number;
  set_no: number | null;
  passage: string | null;
  question_text: string;
  question_hinglish: string | null;
  hint: string | null;
  option_a: string | null;
  option_b: string | null;
  option_c: string | null;
  option_d: string | null;
  correct_option: string;
  correct_answer: string | null;
  solution_hinglish: string | null;
  book_solution: string | null;
  word_meanings: string | null;
  why_a: string | null;
  why_b: string | null;
  why_c: string | null;
  why_d: string | null;
  usage_a: string | null;
  usage_b: string | null;
  usage_c: string | null;
  usage_d: string | null;
  error_word: string | null;
  correction: string | null;
  corrected_sentence: string | null;
  topic: string | null;
  exam: string | null;
}

/** Escapes HTML but keeps <u>…</u> underlines from the source sheets. */
export function underlineHtml(text: string | null | undefined): string {
  if (!text) return '';
  const esc = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return esc
    .replace(/&lt;u&gt;/gi, '<u class="underline decoration-2 decoration-rose-400 underline-offset-2">')
    .replace(/&lt;\/u&gt;/gi, '</u>');
}

export const optionLetters = ['a', 'b', 'c', 'd'] as const;

export const optionText = (it: BankItem, l: string) =>
  (it as unknown as Record<string, string | null>)[`option_${l}`] || '';
export const optionWhy = (it: BankItem, l: string) =>
  (it as unknown as Record<string, string | null>)[`why_${l}`] || '';
export const optionUsage = (it: BankItem, l: string) =>
  (it as unknown as Record<string, string | null>)[`usage_${l}`] || '';
