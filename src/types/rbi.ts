export const RBI_ALL_TOPICS = [
  // Phase 1 - English
  'idioms_phrases', 'synonyms_antonyms', 'error_detection', 'reading_comprehension',
  'sentence_improvement', 'fill_in_blanks', 'vocabulary',
  // Phase 1 - Quant
  'percentage', 'profit_loss', 'number_system', 'data_interpretation',
  'simplification', 'ratio_proportion', 'average', 'time_work',
  'simple_compound_interest',
  // Phase 1 - Reasoning
  'analogy', 'coding_decoding', 'series', 'syllogism', 'puzzle',
  'seating_arrangement', 'blood_relation', 'direction',
  // Phase 1 - GA
  'history', 'polity', 'economy', 'geography', 'current_affairs', 'static_gk',
  // Phase 2 - ESI & Finance
  'economic_social_issues', 'monetary_policy', 'fiscal_policy',
  'banking_regulation', 'financial_markets', 'management_theory',
] as const;

export type RbiTopic = typeof RBI_ALL_TOPICS[number];

export type RbiSubject = 'english' | 'quant' | 'reasoning' | 'ga' | 'esi_finance';

export const RBI_SUBJECTS: { key: RbiSubject; label: string; icon: string; phase: string }[] = [
  { key: 'english', label: 'English Language', icon: '📝', phase: 'Phase 1' },
  { key: 'quant', label: 'Quantitative Aptitude', icon: '🔢', phase: 'Phase 1' },
  { key: 'reasoning', label: 'Reasoning', icon: '🧠', phase: 'Phase 1' },
  { key: 'ga', label: 'General Awareness', icon: '🌍', phase: 'Phase 1' },
  { key: 'esi_finance', label: 'ESI & Finance', icon: '🏦', phase: 'Phase 2' },
];

export const RBI_SUBJECT_TOPICS: Record<RbiSubject, RbiTopic[]> = {
  english: ['idioms_phrases', 'synonyms_antonyms', 'error_detection', 'reading_comprehension', 'sentence_improvement', 'fill_in_blanks', 'vocabulary'],
  quant: ['percentage', 'profit_loss', 'number_system', 'data_interpretation', 'simplification', 'ratio_proportion', 'average', 'time_work', 'simple_compound_interest'],
  reasoning: ['analogy', 'coding_decoding', 'series', 'syllogism', 'puzzle', 'seating_arrangement', 'blood_relation', 'direction'],
  ga: ['history', 'polity', 'economy', 'geography', 'current_affairs', 'static_gk'],
  esi_finance: ['economic_social_issues', 'monetary_policy', 'fiscal_policy', 'banking_regulation', 'financial_markets', 'management_theory'],
};

export function getRbiSubjectForTopic(topic: RbiTopic): RbiSubject {
  for (const [subject, topics] of Object.entries(RBI_SUBJECT_TOPICS)) {
    if ((topics as readonly string[]).includes(topic)) return subject as RbiSubject;
  }
  return 'english';
}

export const RBI_TOPIC_META: Record<RbiTopic, { label: string; icon: string }> = {
  // English
  idioms_phrases: { label: 'Idioms & Phrases', icon: '💬' },
  synonyms_antonyms: { label: 'Synonyms & Antonyms', icon: '🔄' },
  error_detection: { label: 'Error Detection', icon: '🔍' },
  reading_comprehension: { label: 'Reading Comprehension', icon: '📚' },
  sentence_improvement: { label: 'Sentence Improvement', icon: '✏️' },
  fill_in_blanks: { label: 'Fill in the Blanks', icon: '📝' },
  vocabulary: { label: 'Vocabulary', icon: '📖' },
  // Quant
  percentage: { label: 'Percentage', icon: '📊' },
  profit_loss: { label: 'Profit & Loss', icon: '💰' },
  number_system: { label: 'Number System', icon: '🔢' },
  data_interpretation: { label: 'Data Interpretation', icon: '📉' },
  simplification: { label: 'Simplification', icon: '➗' },
  ratio_proportion: { label: 'Ratio & Proportion', icon: '⚖️' },
  average: { label: 'Averages', icon: '📈' },
  time_work: { label: 'Time & Work', icon: '⏰' },
  simple_compound_interest: { label: 'SI & CI', icon: '🏦' },
  // Reasoning
  analogy: { label: 'Analogy', icon: '🔗' },
  coding_decoding: { label: 'Coding Decoding', icon: '🔐' },
  series: { label: 'Series', icon: '🔢' },
  syllogism: { label: 'Syllogism', icon: '🧩' },
  puzzle: { label: 'Puzzles', icon: '🧩' },
  seating_arrangement: { label: 'Seating Arrangement', icon: '💺' },
  blood_relation: { label: 'Blood Relations', icon: '👨‍👩‍👧' },
  direction: { label: 'Direction Sense', icon: '🧭' },
  // GA
  history: { label: 'History', icon: '🏛️' },
  polity: { label: 'Polity', icon: '⚖️' },
  economy: { label: 'Economy', icon: '💹' },
  geography: { label: 'Geography', icon: '🌍' },
  current_affairs: { label: 'Current Affairs', icon: '📰' },
  static_gk: { label: 'Static GK', icon: '📖' },
  // Phase 2 - ESI & Finance
  economic_social_issues: { label: 'Economic & Social Issues', icon: '📊' },
  monetary_policy: { label: 'Monetary Policy', icon: '🏦' },
  fiscal_policy: { label: 'Fiscal Policy', icon: '💰' },
  banking_regulation: { label: 'Banking Regulation', icon: '🏛️' },
  financial_markets: { label: 'Financial Markets', icon: '📈' },
  management_theory: { label: 'Management Theory', icon: '📋' },
};

export interface RbiQuestion {
  id: string;
  topic: RbiTopic;
  question_text: string;
  options: string[];
  correct_option: number;
  explanation: string | null;
  difficulty: 'easy' | 'medium' | 'hard';
}
