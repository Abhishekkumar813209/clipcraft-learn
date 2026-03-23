export const RBI_ALL_TOPICS = [
  'english',
  'quant',
  'reasoning',
  'ga',
  'esi_finance',
] as const;

export type RbiTopic = typeof RBI_ALL_TOPICS[number];

export const RBI_PHASE1_TOPICS: RbiTopic[] = ['english', 'quant', 'reasoning', 'ga'];
export const RBI_PHASE2_TOPICS: RbiTopic[] = ['esi_finance'];

export const RBI_TOPIC_META: Record<RbiTopic, { label: string; icon: string; phase: string }> = {
  english: { label: 'English Language', icon: '📝', phase: 'Phase 1' },
  quant: { label: 'Quantitative Aptitude', icon: '🔢', phase: 'Phase 1' },
  reasoning: { label: 'Reasoning', icon: '🧠', phase: 'Phase 1' },
  ga: { label: 'General Awareness', icon: '🌍', phase: 'Phase 1' },
  esi_finance: { label: 'ESI & Finance', icon: '🏦', phase: 'Phase 2' },
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
