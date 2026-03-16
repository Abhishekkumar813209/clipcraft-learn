export const BPSC_ALL_TOPICS = [
  'indian_history', 'bihar_history', 'indian_polity', 'indian_economy',
  'geography_india', 'geography_bihar', 'environment_ecology',
  'general_science', 'current_affairs_bpsc',
] as const;

export type BpscTopic = typeof BPSC_ALL_TOPICS[number];

export type BpscSubject = 'general_studies';

export const BPSC_SUBJECTS: { key: BpscSubject; label: string; icon: string }[] = [
  { key: 'general_studies', label: 'General Studies', icon: '📚' },
];

export const BPSC_SUBJECT_TOPICS: Record<BpscSubject, BpscTopic[]> = {
  general_studies: [
    'indian_history', 'bihar_history', 'indian_polity', 'indian_economy',
    'geography_india', 'geography_bihar', 'environment_ecology',
    'general_science', 'current_affairs_bpsc',
  ],
};

export function getBpscSubjectForTopic(_topic: BpscTopic): BpscSubject {
  return 'general_studies';
}

export const BPSC_TOPIC_META: Record<BpscTopic, { label: string; icon: string }> = {
  indian_history: { label: 'Indian History', icon: '🏛️' },
  bihar_history: { label: 'Bihar History', icon: '🗿' },
  indian_polity: { label: 'Indian Polity', icon: '⚖️' },
  indian_economy: { label: 'Indian Economy', icon: '💹' },
  geography_india: { label: 'Geography of India', icon: '🗺️' },
  geography_bihar: { label: 'Geography of Bihar', icon: '🌾' },
  environment_ecology: { label: 'Environment & Ecology', icon: '🌿' },
  general_science: { label: 'General Science', icon: '🔬' },
  current_affairs_bpsc: { label: 'Current Affairs', icon: '📰' },
};

export interface BpscQuestion {
  id: string;
  topic: BpscTopic;
  question_text: string;
  options: string[];
  correct_option: number;
  explanation: string | null;
  difficulty: 'easy' | 'medium' | 'hard';
}
