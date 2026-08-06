import type { SscTopic } from '@/types/ssc';

export interface MathsTrainer {
  topic: SscTopic;
  slug: string;
  title: string;
  subtitle: string;
  /** File inside public/trainers/ssc-maths/ */
  file: string;
}

/**
 * Registry of Pattern → Method HTML trainers.
 * Naya chapter add karna ho: HTML ko public/trainers/ssc-maths/ me daalo
 * aur yahan ek entry add kar do.
 */
export const MATHS_TRAINERS: MathsTrainer[] = [
  { topic: 'percentage', slug: 'percentage', title: 'Percentage — Pattern Trainer', subtitle: 'Pages 1–305 master patterns', file: 'percentage.html' },
  { topic: 'profit_loss', slug: 'profit-loss', title: 'Profit & Loss — Pattern Trainer', subtitle: 'Complete pattern set', file: 'profit-loss.html' },
  { topic: 'time_work', slug: 'time-work', title: 'Time & Work — Pattern Trainer', subtitle: 'Complete merged set', file: 'time-work.html' },
  { topic: 'average', slug: 'average', title: 'Average — Pattern Trainer', subtitle: 'Complete merged set', file: 'average.html' },
  { topic: 'ratio_proportion', slug: 'proportion', title: 'Proportion — Pattern Trainer', subtitle: 'Till page 50', file: 'proportion.html' },
  { topic: 'ratio_proportion', slug: 'ratio', title: 'Ratio — Pattern Trainer', subtitle: 'Merged pattern set', file: 'ratio.html' },
  { topic: 'time_speed_distance', slug: 'tsd', title: 'Time · Speed · Distance', subtitle: 'Combined pattern set', file: 'tsd.html' },
  { topic: 'train', slug: 'train', title: 'Train (Rail) — Pattern Trainer', subtitle: 'Complete chapter', file: 'train.html' },
  { topic: 'boat_stream', slug: 'boat-stream', title: 'Boat & Stream — Pattern Trainer', subtitle: 'Till page 50', file: 'boat-stream.html' },
  { topic: 'mixture_alligation', slug: 'mixture', title: 'Mixture — Pattern Trainer', subtitle: 'Merged pattern set', file: 'mixture-alligation.html' },
  { topic: 'alligation', slug: 'alligation', title: 'Alligation — 114 Patterns', subtitle: 'Pattern trainer', file: 'alligation.html' },
  { topic: 'simple_interest', slug: 'simple-interest', title: 'Simple Interest — Pattern Trainer', subtitle: 'Merged pattern set', file: 'simple-interest.html' },
  { topic: 'compound_interest', slug: 'compound-interest', title: 'Compound Interest — Master', subtitle: '53 patterns', file: 'compound-interest.html' },
  { topic: 'si_installment', slug: 'si-installment', title: 'S.I. Installment — Pattern Trainer', subtitle: 'Page 32 set', file: 'si-installment.html' },
  { topic: 'ci_installment', slug: 'ci-installment', title: 'C.I. Installment — Pattern Trainer', subtitle: 'Page 34 set', file: 'ci-installment.html' },
  { topic: 'arithmetic_progression', slug: 'arithmetic-progression', title: 'Arithmetic Progression', subtitle: 'Page 46 set', file: 'arithmetic-progression.html' },
  { topic: 'geometric_progression', slug: 'geometric-progression', title: 'Geometric Progression', subtitle: 'Page 40 set', file: 'geometric-progression.html' },
  { topic: 'discount', slug: 'discount', title: 'Discount — Pattern Trainer', subtitle: '132 patterns', file: 'discount.html' },
  { topic: 'partnership', slug: 'partnership', title: 'Partnership — Pattern Trainer', subtitle: 'Till page 77', file: 'partnership.html' },
  { topic: 'pipe_cistern', slug: 'pipe-cistern', title: 'Pipe & Cistern — Pattern Trainer', subtitle: 'Till page 37', file: 'pipe-cistern.html' },
  { topic: 'ages', slug: 'ages', title: 'Ages — Pattern Trainer', subtitle: '27 patterns', file: 'ages.html' },
  { topic: 'algebra', slug: 'algebra-merged', title: 'Algebra — Sheet 01', subtitle: 'Pages 1–170 merged patterns', file: 'algebra-merged.html' },
  { topic: 'algebra', slug: 'algebra-sheet02', title: 'Algebra — Sheet 02', subtitle: '25 patterns', file: 'algebra-sheet02.html' },
  { topic: 'algebra', slug: 'algebra-p1-92', title: 'Algebra — Sheet 03', subtitle: 'Pages 1–92 · Pattern → Method set', file: 'algebra-p1-92.html' },
  { topic: 'trigonometry', slug: 'trig-sheet01', title: 'Trigonometry — Sheet 01', subtitle: 'Q1–Q70', file: 'trig-sheet01.html' },
  { topic: 'trigonometry', slug: 'trig-25-patterns', title: 'Trigonometry — Sheet 02', subtitle: 'Complementary Angles · 25 patterns', file: 'trig-25-patterns.html' },
  { topic: 'trigonometry', slug: 'trig-identities', title: 'Trigonometry — Sheet 03', subtitle: 'Trigonometric Identities · Pages 1–103', file: 'trig-identities.html' },
  { topic: 'trigonometry', slug: 'trig-sheet04', title: 'Trigonometry — Sheet 04', subtitle: 'Pages 1–79', file: 'trig-sheet04.html' },

  { topic: 'geometry', slug: 'centers-of-triangle', title: 'Centers of Triangle', subtitle: 'Q1–Q61 pattern set', file: 'centers-of-triangle.html' },
];


export function trainersForTopic(topic: string): MathsTrainer[] {
  return MATHS_TRAINERS.filter((t) => t.topic === topic);
}

export function trainerBySlug(topic: string, slug: string): MathsTrainer | undefined {
  return MATHS_TRAINERS.find((t) => t.topic === topic && t.slug === slug);
}

export const TRAINER_BASE = '/trainers/ssc-maths/';
