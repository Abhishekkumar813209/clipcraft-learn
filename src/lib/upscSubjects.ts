export interface UpscSubjectConfig {
  slug: string;
  subject: string;
  label: string;
  emoji: string;
  blurb: string;
  /** optional era sections (used by History) */
  sections?: { key: string; label: string; fromChapter: number; toChapter: number }[];
}

export const UPSC_SUBJECTS: UpscSubjectConfig[] = [
  {
    slug: 'history',
    subject: 'history',
    label: 'History',
    emoji: '🏛️',
    blurb: 'Ancient · Medieval · Modern',
    sections: [
      { key: 'ancient', label: 'Ancient History', fromChapter: 1, toChapter: 12 },
      { key: 'medieval', label: 'Medieval History', fromChapter: 13, toChapter: 20 },
      { key: 'modern', label: 'Modern History', fromChapter: 21, toChapter: 999 },
    ],
  },
  { slug: 'geography', subject: 'geography', label: 'Geography', emoji: '🌍', blurb: 'Physical, Indian & World Geography' },
  { slug: 'polity', subject: 'polity', label: 'Polity', emoji: '⚖️', blurb: 'Constitution, governance & institutions' },
  { slug: 'economy', subject: 'economy', label: 'Economy', emoji: '📈', blurb: 'Indian economy & basic concepts' },
];

export const getUpscSubject = (slug?: string) =>
  UPSC_SUBJECTS.find((s) => s.slug === slug) ?? UPSC_SUBJECTS[0];
