import { DrillQ, DrillMeta, shuffle } from './types';

const L = (n: number) => String.fromCharCode(64 + n); // 1 -> A
const P = (l: string) => l.charCodeAt(0) - 64;

const TOTAL = 100;

function build(i: number): DrillQ {
  const n = (i % 26) + 1;
  const letter = L(n);
  const comp = L(27 - n);
  const mode = i % 4;

  const wrongPool = shuffle(
    Array.from({ length: 26 }, (_, k) => L(k + 1)).filter((x) => x !== comp && x !== letter),
  ).slice(0, 3);
  const opts = shuffle([comp, ...wrongPool]);

  const q =
    mode === 0 ? `'${letter}' ka complementary (opposite) letter kaun sa hai?`
    : mode === 1 ? `${letter} + ? = 27 — question mark par kaun sa letter aayega?`
    : mode === 2 ? `Reverse order me '${letter}' ki jagah kaun sa letter aayega?`
    : `Kis letter ke saath '${letter}' ka sum 27 hota hai?`;

  return {
    id: `comp-${i}`,
    question: q,
    options: opts,
    correctIndex: opts.indexOf(comp),
    why: opts.map((o) =>
      o === comp
        ? `✅ Sahi — ${letter} = ${n}, aur 27 − ${n} = ${27 - n} = ${comp}. (EJOTY se: A=1, E=5, J=10, O=15, T=20, Y=25)`
        : `❌ ${o} = ${P(o)}. ${letter}(${n}) + ${o}(${P(o)}) = ${n + P(o)}, jo 27 nahi hai — isliye ye complementary pair nahi hai.`,
    ),
    solution: `Complementary pair ka rule: dono letters ki positions ka sum hamesha 27. ${letter} = ${n} → 27 − ${n} = ${27 - n} → ${comp}. Yaad rakho: A-Z, B-Y, C-X, D-W, E-V, F-U, G-T, H-S, I-R, J-Q, K-P, L-O, M-N.`,
    tag: `${letter} ↔ ${comp}`,
  };
}

const ALL: DrillQ[] = Array.from({ length: TOTAL }, (_, i) => build(i));

const PAIR_TABLE = {
  caption: '13 complementary pairs (position sum = 27)',
  head: ['Pair', 'Positions', 'Sum'],
  rows: Array.from({ length: 13 }, (_, k) => {
    const a = k + 1;
    const b = 27 - a;
    return [`${L(a)} ↔ ${L(b)}`, `${a} + ${b}`, '27'];
  }),
};

export const complementDrill: DrillMeta = {
  key: 'complementary-letters',
  label: 'Complementary Letter Pairs',
  emoji: '🔁',
  blurb: 'A↔Z, B↔Y … sum = 27 · 100 MCQs with position logic',
  total: TOTAL,
  notes: [
    'EJOTY trick: E=5, J=10, O=15, T=20, Y=25 — beech ki positions inhi se count karo.',
    'Complementary letter = 27 − position (opposite letter).',
    'Reasoning ke coding-decoding aur reverse-order questions me ye sabse zyada kaam aata hai.',
  ],
  tables: [PAIR_TABLE],
  build: (limit, from, to) => shuffle(ALL.slice(from ? from - 1 : 0, to ?? ALL.length)).slice(0, limit),
};
