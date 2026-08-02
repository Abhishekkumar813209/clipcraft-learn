// Trigonometry formula-recall drills (Class 10 formula sheet: sections 1-5)
import type { CalcQ } from './calcQuiz';

export type TrigMode = 'serial' | 'random';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Build an MCQ with a correct string answer + distractor pool. */
function mk(q: string, correct: string, pool: string[], explain: string): CalcQ {
  const opts: string[] = [correct];
  for (const p of shuffle(pool)) {
    if (opts.length >= 4) break;
    if (!opts.includes(p)) opts.push(p);
  }
  while (opts.length < 4) opts.push(`option ${opts.length}`);
  const s = shuffle(opts);
  return { q, options: s, correct: s.indexOf(correct), explain };
}

const RATIOS = ['sin θ', 'cos θ', 'tan θ', 'cosec θ', 'sec θ', 'cot θ'];

/* ---------------- 1. Basic Trigonometric Ratios ---------------- */
const RATIO_DEFS: { ratio: string; frac: string; words: string }[] = [
  { ratio: 'sin θ', frac: 'P / H', words: 'Perpendicular / Hypotenuse' },
  { ratio: 'cos θ', frac: 'B / H', words: 'Base / Hypotenuse' },
  { ratio: 'tan θ', frac: 'P / B', words: 'Perpendicular / Base' },
  { ratio: 'cosec θ', frac: 'H / P', words: 'Hypotenuse / Perpendicular' },
  { ratio: 'sec θ', frac: 'H / B', words: 'Hypotenuse / Base' },
  { ratio: 'cot θ', frac: 'B / P', words: 'Base / Perpendicular' },
];

const RECIPROCALS: [string, string][] = [
  ['sin θ', 'cosec θ'], ['cosec θ', 'sin θ'],
  ['cos θ', 'sec θ'], ['sec θ', 'cos θ'],
  ['tan θ', 'cot θ'], ['cot θ', 'tan θ'],
];

const QUOTIENTS: { q: string; a: string }[] = [
  { q: 'tan θ = ?  (sin & cos ke terms me)', a: 'sin θ / cos θ' },
  { q: 'cot θ = ?  (sin & cos ke terms me)', a: 'cos θ / sin θ' },
  { q: 'sin θ / cos θ kiske barabar hai?', a: 'tan θ' },
  { q: 'cos θ / sin θ kiske barabar hai?', a: 'cot θ' },
];

function genRatios(count: number): CalcQ[] {
  const out: CalcQ[] = [];
  const fracPool = RATIO_DEFS.map((d) => d.frac);
  const wordPool = RATIO_DEFS.map((d) => d.words);
  while (out.length < count) {
    for (const d of RATIO_DEFS) {
      out.push(mk(`${d.ratio} = ?`, d.frac, fracPool, `${d.ratio} = ${d.words}`));
      out.push(mk(`${d.frac} kiska ratio hai?`, d.ratio, RATIOS, `${d.frac} = ${d.ratio} (${d.words})`));
      out.push(mk(`${d.ratio} = ?  (words me)`, d.words, wordPool, `${d.ratio} = ${d.words}`));
    }
    for (const [a, b] of RECIPROCALS) {
      out.push(mk(`${a} ka reciprocal kya hai?`, b, RATIOS, `${a} × ${b} = 1, isliye ${a} = 1 / ${b}`));
      out.push(mk(`1 / ${b} = ?`, a, RATIOS, `1 / ${b} = ${a}`));
    }
    for (const qq of QUOTIENTS) {
      const pool = qq.a.includes('/') ? ['cos θ / sin θ', 'sin θ / cos θ', 'sec θ / cosec θ', 'cosec θ / sec θ'] : RATIOS;
      out.push(mk(qq.q, qq.a, pool, `Quotient identity: ${qq.q.split('=')[0].trim()} → ${qq.a}`));
    }
  }
  return out.slice(0, count);
}

/* ---------------- 2. Standard Angle Table ---------------- */
const ANGLES = ['0°', '30°', '45°', '60°', '90°'];
const TABLE: Record<string, string[]> = {
  'sin θ': ['0', '1/2', '1/√2', '√3/2', '1'],
  'cos θ': ['1', '√3/2', '1/√2', '1/2', '0'],
  'tan θ': ['0', '1/√3', '1', '√3', '∞ (undefined)'],
  'cosec θ': ['∞ (undefined)', '2', '√2', '2/√3', '1'],
  'sec θ': ['1', '2/√3', '√2', '2', '∞ (undefined)'],
  'cot θ': ['∞ (undefined)', '√3', '1', '1/√3', '0'],
};
const ALL_VALUES = Array.from(new Set(Object.values(TABLE).flat()));

function genTable(count: number): CalcQ[] {
  const out: CalcQ[] = [];
  const names = Object.keys(TABLE);
  while (out.length < count) {
    for (const name of names) {
      const fn = name.replace(' θ', '');
      for (let i = 0; i < ANGLES.length; i++) {
        const val = TABLE[name][i];
        out.push(mk(`${fn} ${ANGLES[i]} = ?`, val, ALL_VALUES, `Standard table: ${fn} ${ANGLES[i]} = ${val}`));
        // reverse question
        const matches = names.filter((n) => TABLE[n][i] === val);
        if (matches.length === 1) {
          out.push(mk(
            `Kis ratio ki value ${ANGLES[i]} par ${val} hai?`,
            name,
            RATIOS,
            `${fn} ${ANGLES[i]} = ${val}`,
          ));
        }
      }
    }
  }
  return out.slice(0, count);
}

/* ---------------- 3. Complementary Angles ---------------- */
const COMP: [string, string][] = [
  ['sin', 'cos'], ['cos', 'sin'], ['tan', 'cot'], ['cot', 'tan'], ['sec', 'cosec'], ['cosec', 'sec'],
];

function genComplementary(count: number): CalcQ[] {
  const out: CalcQ[] = [];
  const pool = ['sin θ', 'cos θ', 'tan θ', 'cot θ', 'sec θ', 'cosec θ', '−sin θ', '−cos θ'];
  const sampleAngles = [20, 25, 35, 40, 50, 55, 65, 70, 15, 10];
  while (out.length < count) {
    for (const [a, b] of COMP) {
      out.push(mk(`${a}(90° − θ) = ?`, `${b} θ`, pool, `Complementary rule: ${a}(90° − θ) = ${b} θ`));
      out.push(mk(`${b} θ ko (90° − θ) form me likho`, `${a}(90° − θ)`,
        COMP.map(([x]) => `${x}(90° − θ)`), `${b} θ = ${a}(90° − θ)`));
      for (const ang of sampleAngles) {
        out.push(mk(
          `${a} ${ang}° = ?`,
          `${b} ${90 - ang}°`,
          COMP.map(([, y]) => `${y} ${90 - ang}°`).concat([`${a} ${90 - ang}°`, `${b} ${ang}°`]),
          `${a} ${ang}° = ${a}(90° − ${90 - ang}°) = ${b} ${90 - ang}°`,
        ));
      }
    }
  }
  return out.slice(0, count);
}

/* ---------------- 4. Identities ---------------- */
const IDENTITIES: { q: string; a: string; e: string }[] = [
  { q: 'sin²θ + cos²θ = ?', a: '1', e: 'Pythagorean identity: sin²θ + cos²θ = 1' },
  { q: 'sec²θ − tan²θ = ?', a: '1', e: 'sec²θ − tan²θ = 1' },
  { q: 'cosec²θ − cot²θ = ?', a: '1', e: 'cosec²θ − cot²θ = 1' },
  { q: 'sin²θ = ?', a: '1 − cos²θ', e: 'sin²θ + cos²θ = 1 ⇒ sin²θ = 1 − cos²θ' },
  { q: 'cos²θ = ?', a: '1 − sin²θ', e: 'sin²θ + cos²θ = 1 ⇒ cos²θ = 1 − sin²θ' },
  { q: 'sec²θ = ?', a: '1 + tan²θ', e: 'sec²θ − tan²θ = 1 ⇒ sec²θ = 1 + tan²θ' },
  { q: 'cosec²θ = ?', a: '1 + cot²θ', e: 'cosec²θ − cot²θ = 1 ⇒ cosec²θ = 1 + cot²θ' },
  { q: 'tan²θ = ?', a: 'sec²θ − 1', e: 'sec²θ = 1 + tan²θ ⇒ tan²θ = sec²θ − 1' },
  { q: 'cot²θ = ?', a: 'cosec²θ − 1', e: 'cosec²θ = 1 + cot²θ ⇒ cot²θ = cosec²θ − 1' },
  { q: '1 + tan²θ = ?', a: 'sec²θ', e: '1 + tan²θ = sec²θ' },
  { q: '1 + cot²θ = ?', a: 'cosec²θ', e: '1 + cot²θ = cosec²θ' },
  { q: '1 − sin²θ = ?', a: 'cos²θ', e: '1 − sin²θ = cos²θ' },
  { q: '1 − cos²θ = ?', a: 'sin²θ', e: '1 − cos²θ = sin²θ' },
  { q: 'sec²θ − 1 = ?', a: 'tan²θ', e: 'sec²θ − 1 = tan²θ' },
  { q: 'cosec²θ − 1 = ?', a: 'cot²θ', e: 'cosec²θ − 1 = cot²θ' },
  { q: '(1 − cos²θ) / sin²θ = ?', a: '1', e: '1 − cos²θ = sin²θ, isliye ratio = 1' },
  { q: '(sec²θ − tan²θ) × 5 = ?', a: '5', e: 'sec²θ − tan²θ = 1 ⇒ 1 × 5 = 5' },
  { q: 'sin²θ + cos²θ + tan²θ = ?', a: 'sec²θ', e: '1 + tan²θ = sec²θ' },
  { q: 'cosec²θ − cot²θ + cot²θ = ?', a: 'cosec²θ', e: 'cosec²θ − cot²θ = 1 ⇒ 1 + cot²θ = cosec²θ' },
  { q: '√(1 − sin²θ) = ?  (0° ≤ θ ≤ 90°)', a: 'cos θ', e: '1 − sin²θ = cos²θ ⇒ √ = cos θ' },
  { q: '√(1 + tan²θ) = ?  (0° ≤ θ < 90°)', a: 'sec θ', e: '1 + tan²θ = sec²θ ⇒ √ = sec θ' },
  { q: '√(cosec²θ − 1) = ?  (0° < θ ≤ 90°)', a: 'cot θ', e: 'cosec²θ − 1 = cot²θ ⇒ √ = cot θ' },
];
const ID_POOL = [
  '1', '0', '2', '5', 'sin²θ', 'cos²θ', 'tan²θ', 'cot²θ', 'sec²θ', 'cosec²θ',
  '1 − sin²θ', '1 − cos²θ', '1 + tan²θ', '1 + cot²θ', 'sec²θ − 1', 'cosec²θ − 1',
  'sin θ', 'cos θ', 'tan θ', 'sec θ', 'cot θ', 'cosec θ',
];

function genIdentities(count: number): CalcQ[] {
  const out: CalcQ[] = [];
  while (out.length < count) {
    for (const it of IDENTITIES) out.push(mk(it.q, it.a, ID_POOL, it.e));
  }
  return out.slice(0, count);
}

/* ---------------- 5. Special Values (only 10) ---------------- */
const VAL_POOL = ['0', '1', '−1', '1/2', '√3/2', 'undefined'];
const ANG_POOL = ['0°', '30°', '45°', '60°', '90°'];
const TREND_POOL = ['badhti hai', 'ghatti hai', 'same rehti hai', 'pehle badhti phir ghatti hai'];

const SPECIAL: { q: string; a: string; e: string; pool: string[] }[] = [
  { q: 'sin 0° = ?', a: '0', e: 'sin 0° = 0', pool: VAL_POOL },
  { q: 'cos 0° = ?', a: '1', e: 'cos 0° = 1', pool: VAL_POOL },
  { q: 'tan 0° = ?', a: '0', e: 'tan 0° = 0', pool: VAL_POOL },
  { q: 'sin 90° = ?', a: '1', e: 'sin 90° = 1', pool: VAL_POOL },
  { q: 'cos 90° = ?', a: '0', e: 'cos 90° = 0', pool: VAL_POOL },
  { q: 'tan 90° = ?', a: 'undefined', e: 'tan 90° = sin90/cos90 = 1/0 → undefined', pool: VAL_POOL },
  { q: 'Kis angle par sin ki value 0 hai?', a: '0°', e: 'sin 0° = 0', pool: ANG_POOL },
  { q: 'Kis angle par cos ki value 0 hai?', a: '90°', e: 'cos 90° = 0', pool: ANG_POOL },
  { q: '0° se 90° tak sin, tan, sec ki value…', a: 'badhti hai', e: 'sin, tan, sec increasing hain 0° → 90°', pool: TREND_POOL },
  { q: '0° se 90° tak cos, cot, cosec ki value…', a: 'ghatti hai', e: 'cos, cot, cosec decreasing hain 0° → 90°', pool: TREND_POOL },
];

function genSpecial(): CalcQ[] {
  return SPECIAL.map((s) => mk(s.q, s.a, s.pool, s.e));
}

export const TRIG_CHAPTERS = ['trig-ratios', 'trig-table', 'trig-comp', 'trig-identities', 'trig-special'] as const;
export type TrigChapter = typeof TRIG_CHAPTERS[number];

export function generateTrigQuiz(slug: string, mode: TrigMode = 'serial'): CalcQ[] {
  let qs: CalcQ[] = [];
  switch (slug) {
    case 'trig-ratios': qs = genRatios(200); break;
    case 'trig-table': qs = genTable(200); break;
    case 'trig-comp': qs = genComplementary(200); break;
    case 'trig-identities': qs = genIdentities(200); break;
    case 'trig-special': qs = genSpecial(); break;
    default: return [];
  }
  return mode === 'random' ? shuffle(qs) : qs;
}
