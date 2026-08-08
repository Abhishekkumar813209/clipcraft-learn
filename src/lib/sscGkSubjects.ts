export interface GkSubjectMeta {
  key: string;
  label: string;
  emoji: string;
  blurb: string;
}

export const GK_SUBJECTS: GkSubjectMeta[] = [
  { key: 'biology', label: 'Biology', emoji: '🧬', blurb: 'Chapter & subtopic wise quiz + Hinglish theory' },
  { key: 'polity', label: 'Polity', emoji: '🏛️', blurb: 'Constitution, Parliament, Judiciary — PYQ chapters' },
  { key: 'economy', label: 'Economy', emoji: '💹', blurb: 'Banking, budget, planning — chapterwise MCQs' },
  { key: 'indian_geography', label: 'Indian Geography', emoji: '🗺️', blurb: 'Physiography, rivers, climate, resources' },
  { key: 'world_geography', label: 'World Geography', emoji: '🌍', blurb: 'Universe, geomorphology, continents' },
  { key: 'ancient_history', label: 'Ancient History', emoji: '🏺', blurb: 'IVC, Vedic age, Mauryan & Gupta' },
  { key: 'medieval_history', label: 'Medieval History', emoji: '🕌', blurb: 'Sultanate, Mughals, Bhakti-Sufi' },
  { key: 'modern_history', label: 'Modern History', emoji: '⚔️', blurb: 'British rule, freedom struggle' },
];

export const gkSubject = (key?: string): GkSubjectMeta =>
  GK_SUBJECTS.find((s) => s.key === key) || GK_SUBJECTS[0];
