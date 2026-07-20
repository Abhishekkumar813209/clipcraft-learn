// Client-side question generators for calculation & mental-maths speed drills.
export interface CalcQ {
  q: string;
  options: string[];
  correct: number;
  explain?: string;
}

export type Mode = 'serial' | 'random';
export type Difficulty = 'easy' | 'medium';

export interface RangedParams {
  start?: number;
  end?: number;
  mode?: Mode;
  difficulty?: Difficulty;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function fmt(n: number): string {
  if (Number.isInteger(n)) return String(n);
  return (Math.round(n * 100) / 100).toString();
}

function pickOptions(correct: number, distractors: number[]): { options: string[]; correctIdx: number } {
  const uniq: number[] = [correct];
  for (const d of distractors) if (!uniq.includes(d) && d > 0) uniq.push(d);
  while (uniq.length < 4) {
    const d = correct + Math.floor(Math.random() * 20) - 10;
    if (!uniq.includes(d) && d > 0 && d !== correct) uniq.push(d);
  }
  const four = uniq.slice(0, 4);
  const shuffled = shuffle(four);
  return { options: shuffled.map(fmt), correctIdx: shuffled.indexOf(correct) };
}

// same-last-digit distractors (medium mode)
function sameLastDigitDistractors(correct: number, count = 3): number[] {
  const out: number[] = [];
  const seen = new Set<number>([correct]);
  // pick nearby multiples of 10 offsets (preserves last digit)
  const offsets = shuffle([-3, -2, -1, 1, 2, 3, 4, -4, 5, -5, 6, -6, 7, -7]);
  for (const off of offsets) {
    if (out.length >= count) break;
    const cand = correct + off * 10;
    if (cand <= 0 || seen.has(cand)) continue;
    seen.add(cand);
    out.push(cand);
  }
  return out;
}

function easyDistractors(correct: number, spread = 12): number[] {
  const out: number[] = [];
  const seen = new Set<number>([correct]);
  for (let i = 0; i < 40 && out.length < 3; i++) {
    const cand = correct + Math.floor(Math.random() * spread * 2) - spread;
    if (cand <= 0 || seen.has(cand)) continue;
    seen.add(cand);
    out.push(cand);
  }
  return out;
}

function buildNumberList(start: number, end: number, mode: Mode): number[] {
  const lo = Math.min(start, end);
  const hi = Math.max(start, end);
  const list: number[] = [];
  for (let x = lo; x <= hi; x++) list.push(x);
  return mode === 'random' ? shuffle(list) : list;
}

// ============ SQUARES ============
export function genSquares(p: RangedParams = {}): CalcQ[] {
  const { start = 2, end = 100, mode = 'serial', difficulty = 'easy' } = p;
  const nums = buildNumberList(start, end, mode);
  return nums.map((x) => {
    const c = x * x;
    const distractors = difficulty === 'medium' ? sameLastDigitDistractors(c) : easyDistractors(c, Math.max(8, Math.floor(c * 0.15)));
    const { options, correctIdx } = pickOptions(c, distractors);
    return { q: `${x}² = ?`, options, correct: correctIdx, explain: `${x} × ${x} = ${c}` };
  });
}

// ============ SQUARE ROOTS ============
export function genSquareRoots(p: RangedParams = {}): CalcQ[] {
  const { start = 2, end = 100, mode = 'serial', difficulty = 'easy' } = p;
  const nums = buildNumberList(start, end, mode);
  return nums.map((r) => {
    const n = r * r;
    // medium: distractors share unit digit with r (add ±10 offsets to r)
    const distractors = difficulty === 'medium'
      ? sameLastDigitDistractors(r).filter((d) => d > 0)
      : [r - 1, r + 1, r - 2, r + 2].filter((d) => d > 0);
    const { options, correctIdx } = pickOptions(r, distractors);
    return { q: `√${n} = ?`, options, correct: correctIdx, explain: `${r} × ${r} = ${n}` };
  });
}

// ============ CUBES ============
export function genCubes(p: RangedParams = {}): CalcQ[] {
  const { start = 2, end = 30, mode = 'serial', difficulty = 'easy' } = p;
  const nums = buildNumberList(start, end, mode);
  return nums.map((x) => {
    const c = x * x * x;
    const distractors = difficulty === 'medium'
      ? sameLastDigitDistractors(c)
      : easyDistractors(c, Math.max(20, Math.floor(c * 0.15)));
    const { options, correctIdx } = pickOptions(c, distractors);
    return { q: `${x}³ = ?`, options, correct: correctIdx, explain: `${x} × ${x} × ${x} = ${c}` };
  });
}

// ============ CUBE ROOTS ============
export function genCubeRoots(p: RangedParams = {}): CalcQ[] {
  const { start = 2, end = 30, mode = 'serial', difficulty = 'easy' } = p;
  const nums = buildNumberList(start, end, mode);
  return nums.map((x) => {
    const c = x * x * x;
    // medium: distractors share unit digit of x (so unit-digit prediction trick fails)
    const distractors = difficulty === 'medium'
      ? sameLastDigitDistractors(x).filter((d) => d > 0)
      : [x - 1, x + 1, x - 2, x + 2].filter((d) => d > 0);
    const { options, correctIdx } = pickOptions(x, distractors);
    return { q: `∛${c} = ?`, options, correct: correctIdx, explain: `${x}³ = ${c}` };
  });
}

// ============ % ↔ FRACTION ↔ DECIMAL CONVERSION (chart-based) ============
// Source: user-supplied Fraction_Percentage_Chart.xlsx (50 canonical rows).
interface ChartRow { frac: string; pct: number; dec: number; }
const CHART: ChartRow[] = [
  { frac: '1/1', pct: 100, dec: 1 },
  { frac: '1/2', pct: 50, dec: 0.5 },
  { frac: '1/3', pct: 33.33, dec: 0.3333 },
  { frac: '1/4', pct: 25, dec: 0.25 },
  { frac: '1/5', pct: 20, dec: 0.2 },
  { frac: '1/6', pct: 16.66, dec: 0.1667 },
  { frac: '1/7', pct: 14.28, dec: 0.1428 },
  { frac: '1/8', pct: 12.5, dec: 0.125 },
  { frac: '1/9', pct: 11.11, dec: 0.1111 },
  { frac: '1/10', pct: 10, dec: 0.1 },
  { frac: '1/11', pct: 9.09, dec: 0.0909 },
  { frac: '1/12', pct: 8.33, dec: 0.0833 },
  { frac: '1/13', pct: 7.69, dec: 0.0769 },
  { frac: '1/14', pct: 7.14, dec: 0.0714 },
  { frac: '1/15', pct: 6.66, dec: 0.0667 },
  { frac: '1/16', pct: 6.25, dec: 0.0625 },
  { frac: '1/17', pct: 5.88, dec: 0.0588 },
  { frac: '1/18', pct: 5.55, dec: 0.0556 },
  { frac: '1/19', pct: 5.26, dec: 0.0526 },
  { frac: '1/20', pct: 5, dec: 0.05 },
  { frac: '1/25', pct: 4, dec: 0.04 },
  { frac: '1/50', pct: 2, dec: 0.02 },
  { frac: '2/9', pct: 22.22, dec: 0.2222 },
  { frac: '4/9', pct: 44.44, dec: 0.4444 },
  { frac: '5/9', pct: 55.55, dec: 0.5555 },
  { frac: '7/9', pct: 77.77, dec: 0.7777 },
  { frac: '8/9', pct: 88.88, dec: 0.8888 },
  { frac: '2/11', pct: 18.18, dec: 0.1818 },
  { frac: '3/11', pct: 27.27, dec: 0.2727 },
  { frac: '4/11', pct: 36.36, dec: 0.3636 },
  { frac: '5/11', pct: 45.45, dec: 0.4545 },
  { frac: '6/11', pct: 54.54, dec: 0.5454 },
  { frac: '7/11', pct: 63.63, dec: 0.6363 },
  { frac: '8/11', pct: 72.72, dec: 0.7272 },
  { frac: '9/11', pct: 81.81, dec: 0.8181 },
  { frac: '10/11', pct: 90.9, dec: 0.909 },
  { frac: '3/8', pct: 37.5, dec: 0.375 },
  { frac: '5/8', pct: 62.5, dec: 0.625 },
  { frac: '7/8', pct: 87.5, dec: 0.875 },
  { frac: '2/5', pct: 40, dec: 0.4 },
  { frac: '3/5', pct: 60, dec: 0.6 },
  { frac: '4/5', pct: 80, dec: 0.8 },
  { frac: '3/4', pct: 75, dec: 0.75 },
  { frac: '5/6', pct: 83.33, dec: 0.8333 },
  { frac: '2/7', pct: 28.57, dec: 0.2857 },
  { frac: '3/7', pct: 42.85, dec: 0.4285 },
  { frac: '4/7', pct: 57.14, dec: 0.5714 },
  { frac: '5/7', pct: 71.42, dec: 0.7142 },
  { frac: '6/7', pct: 85.71, dec: 0.8571 },
];


// Standard mixed fractions (whole + proper fraction) → improper fraction.
interface MixedRow { mixed: string; improper: string; }
const MIXED: MixedRow[] = [
  { mixed: '1 1/2', improper: '3/2' },
  { mixed: '1 1/3', improper: '4/3' },
  { mixed: '1 2/3', improper: '5/3' },
  { mixed: '1 1/4', improper: '5/4' },
  { mixed: '1 3/4', improper: '7/4' },
  { mixed: '1 1/5', improper: '6/5' },
  { mixed: '1 2/5', improper: '7/5' },
  { mixed: '1 3/5', improper: '8/5' },
  { mixed: '1 4/5', improper: '9/5' },
  { mixed: '1 1/6', improper: '7/6' },
  { mixed: '1 5/6', improper: '11/6' },
  { mixed: '1 1/7', improper: '8/7' },
  { mixed: '1 1/8', improper: '9/8' },
  { mixed: '1 3/8', improper: '11/8' },
  { mixed: '1 5/8', improper: '13/8' },
  { mixed: '1 7/8', improper: '15/8' },
  { mixed: '1 1/9', improper: '10/9' },
  { mixed: '1 1/10', improper: '11/10' },
  { mixed: '2 1/2', improper: '5/2' },
  { mixed: '2 1/3', improper: '7/3' },
  { mixed: '2 2/3', improper: '8/3' },
  { mixed: '2 1/4', improper: '9/4' },
  { mixed: '2 3/4', improper: '11/4' },
  { mixed: '2 1/5', improper: '11/5' },
  { mixed: '2 3/5', improper: '13/5' },
  { mixed: '2 1/6', improper: '13/6' },
  { mixed: '2 1/8', improper: '17/8' },
  { mixed: '3 1/2', improper: '7/2' },
  { mixed: '3 1/3', improper: '10/3' },
  { mixed: '3 2/3', improper: '11/3' },
  { mixed: '3 1/4', improper: '13/4' },
  { mixed: '3 3/4', improper: '15/4' },
  { mixed: '3 1/5', improper: '16/5' },
  { mixed: '4 1/2', improper: '9/2' },
  { mixed: '4 1/3', improper: '13/3' },
  { mixed: '4 1/4', improper: '17/4' },
  { mixed: '4 3/4', improper: '19/4' },
  { mixed: '5 1/2', improper: '11/2' },
  { mixed: '5 1/3', improper: '16/3' },
  { mixed: '5 1/4', improper: '21/4' },
];

function pickDistractorStrings(correct: string, pool: string[], n = 3): string[] {
  const seen = new Set<string>([correct]);
  const out: string[] = [];
  for (const p of shuffle(pool)) {
    if (out.length >= n) break;
    if (seen.has(p)) continue;
    seen.add(p);
    out.push(p);
  }
  return out;
}

// Only: Decimal ↔ Fraction, and Mixed → Improper Fraction (standard mixed only).
// Percentage conversions are intentionally excluded.
export function genPercentConversion(): CalcQ[] {
  const qs: CalcQ[] = [];
  const fracPool = CHART.map((r) => r.frac);
  const decPool = CHART.map((r) => String(r.dec));
  const improperPool = MIXED.map((r) => r.improper);

  for (const r of CHART) {
    // Fraction → Decimal
    {
      const correct = String(r.dec);
      const dist = pickDistractorStrings(correct, decPool);
      const opts = shuffle([correct, ...dist]);
      qs.push({
        q: `${r.frac} as a decimal = ?`,
        options: opts, correct: opts.indexOf(correct),
        explain: `${r.frac} = ${r.dec}`,
      });
    }
    // Decimal → Fraction
    {
      const correct = r.frac;
      const dist = pickDistractorStrings(correct, fracPool);
      const opts = shuffle([correct, ...dist]);
      qs.push({
        q: `${r.dec} as a fraction = ?`,
        options: opts, correct: opts.indexOf(correct),
        explain: `${r.dec} = ${r.frac}`,
      });
    }
  }

  // Mixed → Improper Fraction (standard mixed only)
  for (const m of MIXED) {
    const correct = m.improper;
    const dist = pickDistractorStrings(correct, improperPool);
    const opts = shuffle([correct, ...dist]);
    qs.push({
      q: `Convert ${m.mixed} to an improper fraction = ?`,
      options: opts, correct: opts.indexOf(correct),
      explain: `${m.mixed} = ${m.improper}`,
    });
  }

  return shuffle(qs);
}

// ============ FRACTION ↔ PERCENTAGE (chart-based) ============
// Each row: a fraction and its equivalent % representations (decimal + optional mixed).
// Decimal % and mixed-fraction % represent the SAME entity — never mix them as
// distractors for the same fraction, and never use a same-row alt form as a
// distractor for the other form.
interface FPRow { frac: string; pcts: string[] } // pcts[0]=decimal, pcts[1]=mixed (if any)
const FP: FPRow[] = [
  { frac: '1/2', pcts: ['50%'] },
  { frac: '1/3', pcts: ['33.33%', '33 1/3%'] },
  { frac: '1/4', pcts: ['25%'] },
  { frac: '1/5', pcts: ['20%'] },
  { frac: '1/6', pcts: ['16.66%', '16 2/3%'] },
  { frac: '1/7', pcts: ['14.28%', '14 2/7%'] },
  { frac: '1/8', pcts: ['12.5%', '12 1/2%'] },
  { frac: '1/9', pcts: ['11.11%', '11 1/9%'] },
  { frac: '1/10', pcts: ['10%'] },
  { frac: '1/11', pcts: ['9.09%', '9 1/11%'] },
  { frac: '1/12', pcts: ['8.33%', '8 1/3%'] },
  { frac: '1/13', pcts: ['7.69%', '7 9/13%'] },
  { frac: '1/14', pcts: ['7.14%', '7 1/7%'] },
  { frac: '1/15', pcts: ['6.66%', '6 2/3%'] },
  { frac: '1/16', pcts: ['6.25%', '6 1/4%'] },
  { frac: '1/17', pcts: ['5.88%', '5 15/17%'] },
  { frac: '1/18', pcts: ['5.55%', '5 5/9%'] },
  { frac: '1/19', pcts: ['5.26%', '5 5/19%'] },
  { frac: '1/20', pcts: ['5%'] },
  { frac: '1/25', pcts: ['4%'] },
  { frac: '1/50', pcts: ['2%'] },
  { frac: '2/9', pcts: ['22.22%', '22 2/9%'] },
  { frac: '4/9', pcts: ['44.44%', '44 4/9%'] },
  { frac: '5/9', pcts: ['55.55%', '55 5/9%'] },
  { frac: '7/9', pcts: ['77.77%', '77 7/9%'] },
  { frac: '8/9', pcts: ['88.88%', '88 8/9%'] },
  { frac: '2/11', pcts: ['18.18%', '18 2/11%'] },
  { frac: '3/11', pcts: ['27.27%', '27 3/11%'] },
  { frac: '4/11', pcts: ['36.36%', '36 4/11%'] },
  { frac: '5/11', pcts: ['45.45%', '45 5/11%'] },
  { frac: '6/11', pcts: ['54.54%', '54 6/11%'] },
  { frac: '7/11', pcts: ['63.63%', '63 7/11%'] },
  { frac: '8/11', pcts: ['72.72%', '72 8/11%'] },
  { frac: '9/11', pcts: ['81.81%', '81 9/11%'] },
  { frac: '10/11', pcts: ['90.90%', '90 10/11%'] },
  { frac: '3/8', pcts: ['37.5%', '37 1/2%'] },
  { frac: '5/8', pcts: ['62.5%', '62 1/2%'] },
  { frac: '7/8', pcts: ['87.5%', '87 1/2%'] },
  { frac: '2/5', pcts: ['40%'] },
  { frac: '3/5', pcts: ['60%'] },
  { frac: '4/5', pcts: ['80%'] },
  { frac: '3/4', pcts: ['75%'] },
  { frac: '5/6', pcts: ['83.33%', '83 1/3%'] },
  { frac: '2/7', pcts: ['28.57%', '28 4/7%'] },
  { frac: '3/7', pcts: ['42.85%', '42 6/7%'] },
  { frac: '4/7', pcts: ['57.14%', '57 1/7%'] },
  { frac: '5/7', pcts: ['71.42%', '71 3/7%'] },
  { frac: '6/7', pcts: ['85.71%', '85 5/7%'] },
];

export function genFractionPercent(): CalcQ[] {
  const qs: CalcQ[] = [];
  const pickPct = (row: FPRow) => row.pcts[Math.floor(Math.random() * row.pcts.length)];

  // Fraction → Percentage
  for (const row of FP) {
    const correct = pickPct(row);
    const pool: string[] = [];
    for (const r of FP) if (r.frac !== row.frac) pool.push(pickPct(r));
    const dist = pickDistractorStrings(correct, pool);
    const opts = shuffle([correct, ...dist]);
    const allForms = row.pcts.join(' = ');
    qs.push({
      q: `${row.frac} as a percentage = ?`,
      options: opts,
      correct: opts.indexOf(correct),
      explain: `${row.frac} = ${allForms}`,
    });
  }

  // Percentage → Fraction (ask with either decimal or mixed form)
  for (const row of FP) {
    for (const pctForm of row.pcts) {
      const correct = row.frac;
      const pool = FP.filter((r) => r.frac !== row.frac).map((r) => r.frac);
      const dist = pickDistractorStrings(correct, pool);
      const opts = shuffle([correct, ...dist]);
      const allForms = row.pcts.join(' = ');
      qs.push({
        q: `${pctForm} as a fraction = ?`,
        options: opts,
        correct: opts.indexOf(correct),
        explain: `${allForms} = ${row.frac}`,
      });
    }
  }

  return shuffle(qs);
}

// ============ % / DECIMAL MULTIPLICATION ============
export function genPercentCalculation(): CalcQ[] {
  const qs: CalcQ[] = [];
  const bases: { pct: number; n: number; label: string }[] = [
    { n: 2, pct: 50, label: '50%' }, { n: 3, pct: 33.33, label: '33.33%' },
    { n: 4, pct: 25, label: '25%' }, { n: 5, pct: 20, label: '20%' },
    { n: 6, pct: 16.67, label: '16.67%' }, { n: 7, pct: 14.28, label: '14.28%' },
    { n: 8, pct: 12.5, label: '12.5%' }, { n: 9, pct: 11.11, label: '11.11%' },
    { n: 10, pct: 10, label: '10%' }, { n: 11, pct: 9.09, label: '9.09%' },
    { n: 12, pct: 8.33, label: '8.33%' }, { n: 15, pct: 6.67, label: '6.67%' },
    { n: 16, pct: 6.25, label: '6.25%' }, { n: 20, pct: 5, label: '5%' },
  ];
  for (let i = 0; i < 120; i++) {
    const t = bases[i % bases.length];
    const k = 2 + Math.floor(Math.random() * 12);
    const N = t.n * k;
    const answer = k;
    const distractors = [k + 1, k - 1, k * 2, Math.round(k / 2)].filter((d) => d > 0 && d !== answer);
    const { options, correctIdx } = pickOptions(answer, distractors);
    qs.push({ q: `${t.label} of ${N} = ?`, options, correct: correctIdx, explain: `${t.label} = 1/${t.n} → ${N} ÷ ${t.n} = ${answer}` });
  }
  const multiples = [
    { frac: 5 / 4, label: '125%', d: 4 }, { frac: 3 / 2, label: '150%', d: 2 },
    { frac: 7 / 4, label: '175%', d: 4 }, { frac: 4 / 3, label: '133.33%', d: 3 },
    { frac: 5 / 3, label: '166.67%', d: 3 }, { frac: 2, label: '200%', d: 1 },
    { frac: 2 / 3, label: '66.67%', d: 3 }, { frac: 3 / 8, label: '37.5%', d: 8 },
    { frac: 5 / 8, label: '62.5%', d: 8 }, { frac: 7 / 8, label: '87.5%', d: 8 },
    { frac: 2 / 5, label: '40%', d: 5 }, { frac: 3 / 5, label: '60%', d: 5 },
    { frac: 4 / 5, label: '80%', d: 5 }, { frac: 2 / 9, label: '22.22%', d: 9 },
    { frac: 4 / 9, label: '44.44%', d: 9 }, { frac: 5 / 9, label: '55.55%', d: 9 },
    { frac: 7 / 9, label: '77.77%', d: 9 }, { frac: 8 / 9, label: '88.88%', d: 9 },
  ];
  for (let i = 0; i < 80; i++) {
    const m = multiples[i % multiples.length];
    const k = 2 + Math.floor(Math.random() * 15);
    const N = m.d * k;
    const answer = Math.round(m.frac * N);
    const distractors = [answer + k, answer - k, answer + 1, answer - 1].filter((x) => x > 0 && x !== answer);
    const { options, correctIdx } = pickOptions(answer, distractors);
    qs.push({ q: `${m.label} of ${N} = ?`, options, correct: correctIdx, explain: `${m.label} × ${N} = ${answer}` });
  }
  return shuffle(qs);
}

// ============ MENTAL MATHS (+ − × ÷) ============
type Op = 'add' | 'sub' | 'mul' | 'div';

function randDigits(d: number): number {
  const lo = d === 1 ? 2 : Math.pow(10, d - 1);
  const hi = Math.pow(10, d) - 1;
  return lo + Math.floor(Math.random() * (hi - lo + 1));
}

function mentalOptions(correct: number): { options: string[]; correctIdx: number } {
  const spread = Math.max(4, Math.floor(Math.abs(correct) * 0.08));
  const distractors: number[] = [];
  const seen = new Set<number>([correct]);
  while (distractors.length < 3) {
    const off = Math.floor(Math.random() * spread * 2) - spread;
    if (off === 0) continue;
    const cand = correct + off;
    if (seen.has(cand) || cand < 0) continue;
    seen.add(cand);
    distractors.push(cand);
  }
  return pickOptions(correct, distractors);
}

export function genMental(op: Op, dA: number, dB: number, count = 100): CalcQ[] {
  const qs: CalcQ[] = [];
  for (let i = 0; i < count; i++) {
    let a = randDigits(dA);
    let b = randDigits(dB);
    let ans = 0;
    let sym = '+';
    if (op === 'add') { ans = a + b; sym = '+'; }
    else if (op === 'sub') {
      if (b > a) [a, b] = [b, a];
      ans = a - b; sym = '−';
    } else if (op === 'mul') { ans = a * b; sym = '×'; }
    else {
      // div: build quotient*divisor so answer is integer
      const q = randDigits(dA);
      const div = randDigits(dB);
      a = q * div; b = div; ans = q; sym = '÷';
    }
    const { options, correctIdx } = mentalOptions(ans);
    qs.push({ q: `${a} ${sym} ${b} = ?`, options, correct: correctIdx, explain: `${a} ${sym} ${b} = ${ans}` });
  }
  return qs;
}

// ============ Meta / dispatcher ============
export type ChapterKind = 'ranged' | 'percent' | 'mental';

export interface ChapterMeta {
  title: string;
  icon: string;
  perQSeconds: number;
  kind: ChapterKind;
  // ranged
  minAllowed?: number;
  maxAllowed?: number;
  defaultStart?: number;
  defaultEnd?: number;
  // mental
  op?: Op;
  digitsA?: number;
  digitsB?: number;
  count?: number;
}

export const CHAPTER_META: Record<string, ChapterMeta> = {
  squares:   { title: 'Squares',       icon: '🟦', perQSeconds: 10, kind: 'ranged', minAllowed: 2, maxAllowed: 100, defaultStart: 2, defaultEnd: 30 },
  sqroots:   { title: 'Square Roots',  icon: '√',  perQSeconds: 10, kind: 'ranged', minAllowed: 2, maxAllowed: 100, defaultStart: 2, defaultEnd: 30 },
  cubes:     { title: 'Cubes',         icon: '🧊', perQSeconds: 12, kind: 'ranged', minAllowed: 2, maxAllowed: 30,  defaultStart: 2, defaultEnd: 20 },
  cbroots:   { title: 'Cube Roots',    icon: '∛',  perQSeconds: 12, kind: 'ranged', minAllowed: 2, maxAllowed: 30,  defaultStart: 2, defaultEnd: 20 },

  'pct-conv': { title: 'Fraction ↔ Decimal & Mixed', icon: '½',  perQSeconds: 12, kind: 'percent' },
  'pct-calc': { title: '% / Decimal Multiplication', icon: '✖️', perQSeconds: 18, kind: 'percent' },

  // Addition (300 each)
  'add-2-2': { title: '2-digit + 2-digit', icon: '➕', perQSeconds: 8,  kind: 'mental', op: 'add', digitsA: 2, digitsB: 2, count: 300 },
  'add-2-3': { title: '2-digit + 3-digit', icon: '➕', perQSeconds: 10, kind: 'mental', op: 'add', digitsA: 2, digitsB: 3, count: 300 },
  'add-3-3': { title: '3-digit + 3-digit', icon: '➕', perQSeconds: 12, kind: 'mental', op: 'add', digitsA: 3, digitsB: 3, count: 300 },
  // Subtraction (300 each)
  'sub-2-1': { title: '2-digit − 1-digit', icon: '➖', perQSeconds: 7,  kind: 'mental', op: 'sub', digitsA: 2, digitsB: 1, count: 300 },
  'sub-2-2': { title: '2-digit − 2-digit', icon: '➖', perQSeconds: 8,  kind: 'mental', op: 'sub', digitsA: 2, digitsB: 2, count: 300 },
  'sub-3-2': { title: '3-digit − 2-digit', icon: '➖', perQSeconds: 10, kind: 'mental', op: 'sub', digitsA: 3, digitsB: 2, count: 300 },
  'sub-3-3': { title: '3-digit − 3-digit', icon: '➖', perQSeconds: 12, kind: 'mental', op: 'sub', digitsA: 3, digitsB: 3, count: 300 },
  // Multiplication (300 each)
  'mul-2-1': { title: '2-digit × 1-digit', icon: '✖️', perQSeconds: 10, kind: 'mental', op: 'mul', digitsA: 2, digitsB: 1, count: 300 },
  'mul-2-2': { title: '2-digit × 2-digit', icon: '✖️', perQSeconds: 15, kind: 'mental', op: 'mul', digitsA: 2, digitsB: 2, count: 300 },
  'mul-3-2': { title: '3-digit × 2-digit', icon: '✖️', perQSeconds: 20, kind: 'mental', op: 'mul', digitsA: 3, digitsB: 2, count: 300 },
  'mul-3-3': { title: '3-digit × 3-digit', icon: '✖️', perQSeconds: 25, kind: 'mental', op: 'mul', digitsA: 3, digitsB: 3, count: 300 },
  // Division
  'div-2-1': { title: '2-digit ÷ 1-digit', icon: '➗', perQSeconds: 10, kind: 'mental', op: 'div', digitsA: 1, digitsB: 1, count: 100 },
  'div-3-1': { title: '3-digit ÷ 1-digit', icon: '➗', perQSeconds: 12, kind: 'mental', op: 'div', digitsA: 2, digitsB: 1, count: 100 },
  'div-3-2': { title: '3-digit ÷ 2-digit', icon: '➗', perQSeconds: 15, kind: 'mental', op: 'div', digitsA: 2, digitsB: 2, count: 100 },
};

export interface GenerateParams extends RangedParams {}

export function generateQuiz(slug: string, params: GenerateParams = {}): CalcQ[] {
  const meta = CHAPTER_META[slug];
  if (!meta) return [];
  if (meta.kind === 'ranged') {
    switch (slug) {
      case 'squares': return genSquares(params);
      case 'sqroots': return genSquareRoots(params);
      case 'cubes':   return genCubes(params);
      case 'cbroots': return genCubeRoots(params);
    }
  }
  if (meta.kind === 'percent') {
    return slug === 'pct-conv' ? genPercentConversion() : genPercentCalculation();
  }
  if (meta.kind === 'mental' && meta.op && meta.digitsA && meta.digitsB) {
    return genMental(meta.op, meta.digitsA, meta.digitsB, meta.count ?? 100);
  }
  return [];
}
