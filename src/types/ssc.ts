export const SSC_TOPICS = [
  // English
  'idioms_phrases', 'one_word_substitution', 'synonyms_antonyms', 'error_detection',
  'sentence_improvement', 'fill_in_blanks', 'cloze_test', 'reading_comprehension',
  'active_passive', 'direct_indirect', 'parajumbles', 'spelling_correction',
  // Quant
  'percentage', 'profit_loss', 'ratio_proportion', 'average', 'time_work',
  'time_speed_distance', 'number_system', 'algebra', 'geometry', 'trigonometry',
  'data_interpretation', 'simplification',
  // Reasoning
  'analogy', 'coding_decoding', 'series', 'blood_relation', 'direction',
  'syllogism', 'puzzle', 'venn_diagram', 'statement_conclusion',
  // GK
  'history', 'polity', 'geography', 'economy', 'static_gk', 'current_affairs',
] as const;

export type SscTopic = typeof SSC_TOPICS[number];

export const SSC_EXAMS = ['CGL', 'CHSL', 'MTS', 'GD'] as const;
export type SscExam = typeof SSC_EXAMS[number];

export type SscDifficulty = 'easy' | 'medium' | 'hard';

export type SscSubject = 'english' | 'quant' | 'reasoning' | 'gk';

export const SSC_SUBJECTS: { key: SscSubject; label: string; icon: string; color: string }[] = [
  { key: 'english', label: 'English', icon: '📝', color: 'hsl(var(--primary))' },
  { key: 'quant', label: 'Quantitative Aptitude', icon: '🔢', color: 'hsl(25 95% 53%)' },
  { key: 'reasoning', label: 'Reasoning', icon: '🧠', color: 'hsl(262 83% 58%)' },
  { key: 'gk', label: 'General Awareness', icon: '🌍', color: 'hsl(142 71% 45%)' },
];

export const SUBJECT_TOPICS: Record<SscSubject, SscTopic[]> = {
  english: ['idioms_phrases', 'one_word_substitution', 'synonyms_antonyms', 'error_detection', 'sentence_improvement', 'fill_in_blanks', 'cloze_test', 'reading_comprehension', 'active_passive', 'direct_indirect', 'parajumbles', 'spelling_correction'],
  quant: ['percentage', 'profit_loss', 'ratio_proportion', 'average', 'time_work', 'time_speed_distance', 'number_system', 'algebra', 'geometry', 'trigonometry', 'data_interpretation', 'simplification'],
  reasoning: ['analogy', 'coding_decoding', 'series', 'blood_relation', 'direction', 'syllogism', 'puzzle', 'venn_diagram', 'statement_conclusion'],
  gk: ['history', 'polity', 'geography', 'economy', 'static_gk', 'current_affairs'],
};

export function getSubjectForTopic(topic: SscTopic): SscSubject {
  for (const [subject, topics] of Object.entries(SUBJECT_TOPICS)) {
    if ((topics as readonly string[]).includes(topic)) return subject as SscSubject;
  }
  return 'english';
}

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
  // English
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
  // Quant
  percentage: { label: 'Percentage', icon: '📊', color: 'hsl(25 95% 53%)' },
  profit_loss: { label: 'Profit & Loss', icon: '💰', color: 'hsl(142 71% 45%)' },
  ratio_proportion: { label: 'Ratio & Proportion', icon: '⚖️', color: 'hsl(199 89% 48%)' },
  average: { label: 'Average', icon: '📈', color: 'hsl(262 83% 58%)' },
  time_work: { label: 'Time & Work', icon: '⏰', color: 'hsl(45 93% 47%)' },
  time_speed_distance: { label: 'Time Speed Distance', icon: '🚄', color: 'hsl(0 84% 60%)' },
  number_system: { label: 'Number System', icon: '🔢', color: 'hsl(330 81% 60%)' },
  algebra: { label: 'Algebra', icon: '🧮', color: 'hsl(174 72% 40%)' },
  geometry: { label: 'Geometry', icon: '📐', color: 'hsl(280 68% 50%)' },
  trigonometry: { label: 'Trigonometry', icon: '📏', color: 'hsl(15 80% 50%)' },
  data_interpretation: { label: 'Data Interpretation', icon: '📉', color: 'hsl(210 70% 50%)' },
  simplification: { label: 'Simplification', icon: '➗', color: 'hsl(var(--primary))' },
  // Reasoning
  analogy: { label: 'Analogy', icon: '🔗', color: 'hsl(262 83% 58%)' },
  coding_decoding: { label: 'Coding Decoding', icon: '🔐', color: 'hsl(25 95% 53%)' },
  series: { label: 'Series', icon: '🔢', color: 'hsl(199 89% 48%)' },
  blood_relation: { label: 'Blood Relation', icon: '👨‍👩‍👧', color: 'hsl(0 84% 60%)' },
  direction: { label: 'Direction', icon: '🧭', color: 'hsl(142 71% 45%)' },
  syllogism: { label: 'Syllogism', icon: '🧩', color: 'hsl(45 93% 47%)' },
  puzzle: { label: 'Puzzle', icon: '🧩', color: 'hsl(330 81% 60%)' },
  venn_diagram: { label: 'Venn Diagram', icon: '⭕', color: 'hsl(174 72% 40%)' },
  statement_conclusion: { label: 'Statement & Conclusion', icon: '💡', color: 'hsl(280 68% 50%)' },
  // GK
  history: { label: 'History', icon: '🏛️', color: 'hsl(25 95% 53%)' },
  polity: { label: 'Polity', icon: '⚖️', color: 'hsl(199 89% 48%)' },
  geography: { label: 'Geography', icon: '🌍', color: 'hsl(142 71% 45%)' },
  economy: { label: 'Economy', icon: '💹', color: 'hsl(262 83% 58%)' },
  static_gk: { label: 'Static GK', icon: '📖', color: 'hsl(45 93% 47%)' },
  current_affairs: { label: 'Current Affairs', icon: '📰', color: 'hsl(0 84% 60%)' },
};
