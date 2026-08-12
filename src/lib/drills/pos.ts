import { DrillQ, DrillMeta, shuffle } from './types';
import data from '@/data/posWords.json';

interface Row { w: string; pos: string }
const WORDS = (data as { words: Row[]; hints: Record<string, string> }).words;
const HINTS = (data as { words: Row[]; hints: Record<string, string> }).hints;

const POS_LIST = Object.keys(HINTS);

function build(row: Row, i: number): DrillQ {
  const wrong = shuffle(POS_LIST.filter((p) => p !== row.pos)).slice(0, 3);
  const opts = shuffle([row.pos, ...wrong]);
  return {
    id: `pos-${i}-${row.w}`,
    context: `“${row.w}”`,
    question: 'Ye word kaunsa Part of Speech hai?',
    options: opts,
    correctIndex: opts.indexOf(row.pos),
    why: opts.map((o) =>
      o === row.pos
        ? `✅ Sahi — "${row.w}" ${o} hai. ${HINTS[o]}`
        : `❌ ${o} nahi. ${HINTS[o]} "${row.w}" is kaam ko nahi karta — ye ${row.pos} hai.`,
    ),
    solution: `"${row.w}" = ${row.pos}. ${HINTS[row.pos]}`,
    tag: row.pos,
  };
}

const ALL: DrillQ[] = WORDS.map(build);

export const posDrill: DrillMeta = {
  key: 'parts-of-speech',
  label: 'Identify Parts of Speech',
  emoji: '🏷️',
  blurb: `${ALL.length}+ words · word dekho aur POS batao · har option flip hoke reason`,
  total: ALL.length,
  notes: Object.entries(HINTS).map(([k, v]) => `${k}: ${v}`),
  tables: [{
    caption: '8 Parts of Speech — ek line me',
    head: ['Part of Speech', 'Kaam', 'Example'],
    rows: [
      ['Noun', 'Naam (person/place/thing/idea)', 'Ravi, village, honesty'],
      ['Pronoun', 'Noun ki jagah', 'he, she, they, mine'],
      ['Verb', 'Kaam / avastha', 'run, is, become'],
      ['Adjective', 'Noun ki quality', 'brave, tall, three'],
      ['Adverb', 'Verb/Adj/Adv ko modify', 'quickly, very, today'],
      ['Preposition', 'Noun ka relation', 'in, on, between'],
      ['Conjunction', 'Jodne wala', 'and, but, because'],
      ['Interjection', 'Achanak bhaav', 'Wow!, Alas!'],
    ],
  }],
  build: (limit, from, to) => shuffle(ALL.slice(from ? from - 1 : 0, to ?? ALL.length)).slice(0, limit),
};
