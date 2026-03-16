export const SSC_TOPICS = [
  'idioms_phrases', 'one_word_substitution', 'synonyms_antonyms', 'error_detection',
  'sentence_improvement', 'fill_in_blanks', 'cloze_test', 'reading_comprehension',
  'active_passive', 'direct_indirect', 'parajumbles', 'spelling_correction'
] as const;

export type SscTopic = typeof SSC_TOPICS[number];

export const SSC_EXAMS = ['CGL', 'CHSL', 'MTS', 'GD'] as const;
export type SscExam = typeof SSC_EXAMS[number];

export type SscDifficulty = 'easy' | 'medium' | 'hard';

export interface SscQuestion {
  id: string;
  topic: SscTopic;
  exam: SscExam | null;
  year: number | null;
  question_text: string;
  options: string[];
  correct_option: number;
  explanation: string | null;
  difficulty: SscDifficulty;
  is_pyq: boolean;
}

export interface SscUserProgress {
  id: string;
  user_id: string;
  question_id: string;
  is_correct: boolean;
  answered_at: string;
  time_taken_seconds: number;
}

export interface SscUserStats {
  id: string;
  user_id: string;
  date: string;
  questions_solved: number;
  correct_count: number;
  streak_days: number;
  xp_points: number;
}

export const TOPIC_META: Record<SscTopic, { label: string; icon: string; color: string }> = {
  idioms_phrases: { label: 'Idioms & Phrases', icon: '💬', color: 'hsl(var(--primary))' },
  one_word_substitution: { label: 'One Word Substitution', icon: '🔤', color: 'hsl(25 95% 53%)' },
  synonyms_antonyms: { label: 'Synonyms & Antonyms', icon: '🔄', color: 'hsl(262 83% 58%)' },
  error_detection: { label: 'Error Detection', icon: '🔍', color: 'hsl(0 84% 60%)' },
  sentence_improvement: { label: 'Sentence Improvement', icon: '✏️', color: 'hsl(199 89% 48%)' },
  fill_in_blanks: { label: 'Fill in the Blanks', icon: '📝', color: 'hsl(142 71% 45%)' },
  cloze_test: { label: 'Cloze Test', icon: '📖', color: 'hsl(45 93% 47%)' },
  reading_comprehension: { label: 'Reading Comprehension', icon: '📚', color: 'hsl(330 81% 60%)' },
  active_passive: { label: 'Active & Passive Voice', icon: '🔃', color: 'hsl(174 72% 40%)' },
  direct_indirect: { label: 'Direct & Indirect Speech', icon: '💭', color: 'hsl(280 68% 50%)' },
  parajumbles: { label: 'Parajumbles', icon: '🧩', color: 'hsl(15 80% 50%)' },
  spelling_correction: { label: 'Spelling Correction', icon: '🔠', color: 'hsl(210 70% 50%)' },
};
