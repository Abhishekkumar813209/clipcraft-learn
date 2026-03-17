export const BPSC_ALL_TOPICS = [
  'indian_history', 'bihar_history', 'indian_polity', 'indian_economy',
  'geography_india', 'geography_bihar', 'environment_ecology',
  'general_science', 'current_affairs_bpsc', 'aptitude_bpsc', 'reasoning_bpsc',
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
    'general_science', 'current_affairs_bpsc', 'aptitude_bpsc', 'reasoning_bpsc',
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
  aptitude_bpsc: { label: 'Aptitude', icon: '🧮' },
  reasoning_bpsc: { label: 'Reasoning', icon: '🧠' },
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

// --- BPSC Mains Types ---

export type BpscMainsPaper = 'gs1' | 'gs2' | 'essay' | 'hindi';

export const BPSC_MAINS_PAPERS: { key: BpscMainsPaper; label: string; icon: string; description: string }[] = [
  { key: 'gs1', label: 'GS Paper 1', icon: '📘', description: 'General Science, Polity, Economy, Geography, History' },
  { key: 'gs2', label: 'GS Paper 2', icon: '📗', description: 'Indian & Bihar History, Culture, Geography of Bihar' },
  { key: 'essay', label: 'Essay', icon: '✍️', description: 'Hindi/English essay writing' },
  { key: 'hindi', label: 'Hindi', icon: '🔤', description: 'Hindi language proficiency' },
];

export interface BpscMainsQuestion {
  id: string;
  paper: BpscMainsPaper;
  topic: string;
  question_text: string;
  model_answer: string | null;
  marks: number;
  word_limit: number | null;
  year: number | null;
  is_pyq: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface BpscMainsUserAnswer {
  id: string;
  user_id: string;
  question_id: string;
  answer_text: string;
  ai_feedback: string | null;
  ai_score: number | null;
  submitted_at: string;
}
