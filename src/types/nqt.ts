export const NQT_ALL_TOPICS = [
  // Aptitude
  'percentage', 'profit_loss', 'ratio_proportion', 'average', 'time_work',
  'time_speed_distance', 'probability', 'permutation_combination',
  'number_system', 'simple_compound_interest',
  // Reasoning
  'series', 'coding_decoding', 'blood_relation', 'direction',
  'seating_arrangement', 'puzzle', 'pattern_recognition', 'analogy',
  // Verbal
  'sentence_correction', 'error_detection', 'reading_comprehension',
  'vocabulary', 'synonyms_antonyms', 'fill_in_blanks', 'sentence_rearrangement',
  // Advanced
  'advanced_probability', 'perm_comb_puzzles', 'logical_mathematics',
  'mixture_problems', 'data_sufficiency', 'seating_puzzles',
  'multi_variable_logic', 'caselet_reasoning', 'pattern_deduction',
] as const;

export type NqtTopic = typeof NQT_ALL_TOPICS[number];

export type NqtSubject = 'aptitude' | 'reasoning' | 'verbal' | 'advanced';

export const NQT_SUBJECTS: { key: NqtSubject; label: string; icon: string }[] = [
  { key: 'aptitude', label: 'Quantitative Aptitude', icon: '🔢' },
  { key: 'reasoning', label: 'Logical Reasoning', icon: '🧠' },
  { key: 'verbal', label: 'Verbal Ability', icon: '📝' },
  { key: 'advanced', label: 'Advanced NQT', icon: '🚀' },
];

export const NQT_SUBJECT_TOPICS: Record<NqtSubject, NqtTopic[]> = {
  aptitude: [
    'percentage', 'profit_loss', 'ratio_proportion', 'average', 'time_work',
    'time_speed_distance', 'probability', 'permutation_combination',
    'number_system', 'simple_compound_interest',
  ],
  reasoning: [
    'series', 'coding_decoding', 'blood_relation', 'direction',
    'seating_arrangement', 'puzzle', 'pattern_recognition', 'analogy',
  ],
  verbal: [
    'sentence_correction', 'error_detection', 'reading_comprehension',
    'vocabulary', 'synonyms_antonyms', 'fill_in_blanks', 'sentence_rearrangement',
  ],
  advanced: [
    'advanced_probability', 'perm_comb_puzzles', 'logical_mathematics',
    'mixture_problems', 'data_sufficiency', 'seating_puzzles',
    'multi_variable_logic', 'caselet_reasoning', 'pattern_deduction',
  ],
};

export function getNqtSubjectForTopic(topic: NqtTopic): NqtSubject {
  for (const [subject, topics] of Object.entries(NQT_SUBJECT_TOPICS)) {
    if ((topics as readonly string[]).includes(topic)) return subject as NqtSubject;
  }
  return 'aptitude';
}

export const NQT_TOPIC_META: Record<NqtTopic, { label: string; icon: string }> = {
  // Aptitude
  percentage: { label: 'Percentage', icon: '📊' },
  profit_loss: { label: 'Profit & Loss', icon: '💰' },
  ratio_proportion: { label: 'Ratio & Proportion', icon: '⚖️' },
  average: { label: 'Averages', icon: '📈' },
  time_work: { label: 'Time & Work', icon: '⏰' },
  time_speed_distance: { label: 'Time Speed Distance', icon: '🚄' },
  probability: { label: 'Probability', icon: '🎲' },
  permutation_combination: { label: 'Permutation & Combination', icon: '🔀' },
  number_system: { label: 'Number System', icon: '🔢' },
  simple_compound_interest: { label: 'Simple & Compound Interest', icon: '🏦' },
  // Reasoning
  series: { label: 'Number Series', icon: '🔢' },
  coding_decoding: { label: 'Coding Decoding', icon: '🔐' },
  blood_relation: { label: 'Blood Relations', icon: '👨‍👩‍👧' },
  direction: { label: 'Direction Sense', icon: '🧭' },
  seating_arrangement: { label: 'Seating Arrangement', icon: '💺' },
  puzzle: { label: 'Logical Puzzles', icon: '🧩' },
  pattern_recognition: { label: 'Pattern Recognition', icon: '🔍' },
  analogy: { label: 'Analogy', icon: '🔗' },
  // Verbal
  sentence_correction: { label: 'Sentence Correction', icon: '✏️' },
  error_detection: { label: 'Error Detection', icon: '🔍' },
  reading_comprehension: { label: 'Reading Comprehension', icon: '📚' },
  vocabulary: { label: 'Vocabulary', icon: '📖' },
  synonyms_antonyms: { label: 'Synonyms & Antonyms', icon: '🔄' },
  fill_in_blanks: { label: 'Fill in the Blanks', icon: '📝' },
  sentence_rearrangement: { label: 'Sentence Rearrangement', icon: '🔀' },
  // Advanced
  advanced_probability: { label: 'Advanced Probability', icon: '🎯' },
  perm_comb_puzzles: { label: 'P&C Puzzles', icon: '🧮' },
  logical_mathematics: { label: 'Logical Mathematics', icon: '🧠' },
  mixture_problems: { label: 'Mixture Problems', icon: '🧪' },
  data_sufficiency: { label: 'Data Sufficiency', icon: '📋' },
  seating_puzzles: { label: 'Seating Puzzles', icon: '💺' },
  multi_variable_logic: { label: 'Multi-Variable Logic', icon: '🔣' },
  caselet_reasoning: { label: 'Caselet Reasoning', icon: '📑' },
  pattern_deduction: { label: 'Pattern Deduction', icon: '🔎' },
};

export interface NqtQuestion {
  id: string;
  topic: NqtTopic;
  question_text: string;
  options: string[];
  correct_option: number;
  explanation: string | null;
  difficulty: 'easy' | 'medium' | 'hard';
}
