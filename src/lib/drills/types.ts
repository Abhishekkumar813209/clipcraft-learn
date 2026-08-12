export interface DrillQ {
  id: string;
  context?: string;      // sentence / passage above the question
  question: string;
  options: string[];
  correctIndex: number;
  why: string[];         // per-option Hinglish explanation (flip on click)
  solution: string;      // overall Hinglish solution
  tag?: string;          // e.g. tense name / POS name
}

export interface DrillTheory {
  head: string[];
  rows: string[][];
  caption?: string;
}

export interface DrillMeta {
  key: string;
  label: string;
  emoji: string;
  blurb: string;
  total: number;                       // total MCQs available
  notes?: string[];                    // short theory bullets
  tables?: DrillTheory[];              // theory tables
  build: (limit: number, from?: number, to?: number) => DrillQ[];
}

export const shuffle = <T,>(a: T[]): T[] => {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
};
