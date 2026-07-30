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
  { topic: 'time_speed_distance', slug: 'train', title: 'Train (Rail) — Pattern Trainer', subtitle: 'Complete chapter', file: 'train.html' },
  { topic: 'time_speed_distance', slug: 'boat-stream', title: 'Boat & Stream — Pattern Trainer', subtitle: 'Till page 50', file: 'boat-stream.html' },
  { topic: 'mixture_alligation', slug: 'mixture-alligation', title: 'Mixture & Alligation', subtitle: 'Merged pattern set', file: 'mixture-alligation.html' },
  { topic: 'mixture_alligation', slug: 'alligation', title: 'Alligation & Mixture — 114 Patterns', subtitle: 'Pattern trainer', file: 'alligation.html' },
  { topic: 'simple_interest', slug: 'simple-interest', title: 'Simple Interest — Pattern Trainer', subtitle: 'Merged pattern set', file: 'simple-interest.html' },
  { topic: 'compound_interest', slug: 'compound-interest', title: 'Compound Interest — Master', subtitle: '53 patterns', file: 'compound-interest.html' },
  { topic: 'discount', slug: 'discount', title: 'Discount — Pattern Trainer', subtitle: '132 patterns', file: 'discount.html' },
  { topic: 'partnership', slug: 'partnership', title: 'Partnership — Pattern Trainer', subtitle: 'Till page 77', file: 'partnership.html' },
  { topic: 'pipe_cistern', slug: 'pipe-cistern', title: 'Pipe & Cistern — Pattern Trainer', subtitle: 'Till page 37', file: 'pipe-cistern.html' },
  { topic: 'ages', slug: 'ages', title: 'Ages — Pattern Trainer', subtitle: '27 patterns', file: 'ages.html' },
];

export function trainersForTopic(topic: string): MathsTrainer[] {
  return MATHS_TRAINERS.filter((t) => t.topic === topic);
}

export function trainerBySlug(topic: string, slug: string): MathsTrainer | undefined {
  return MATHS_TRAINERS.find((t) => t.topic === topic && t.slug === slug);
}

export const TRAINER_BASE = '/trainers/ssc-maths/';
