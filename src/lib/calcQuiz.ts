// Client-side question generators for calculation speed drills.
export interface CalcQ {
  q: string;
  options: string[];
  correct: number; // index
  explain?: string;
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

function makeOptions(correct: number, distractors: number[]): { options: string[]; correctIdx: number } {
  const uniq = Array.from(new Set([correct, ...distractors])).slice(0, 4);
  while (uniq.length < 4) {
    const d = correct + Math.floor(Math.random() * 20) - 10;
    if (!uniq.includes(d) && d !== correct) uniq.push(d);
  }
  const shuffled = shuffle(uniq);
  return { options: shuffled.map(fmt), correctIdx: shuffled.indexOf(correct) };
}

function makeFloatOptions(correct: number, spread = 5): { options: string[]; correctIdx: number } {
  const set = new Set<string>([fmt(correct)]);
  while (set.size < 4) {
    const d = correct + (Math.random() * spread * 2 - spread);
    const r = Math.round(d * 100) / 100;
    if (r !== correct && r > 0) set.add(fmt(r));
  }
  const arr = shuffle(Array.from(set));
  return { options: arr, correctIdx: arr.indexOf(fmt(correct)) };
}

// ============ SQUARES & SQUARE ROOTS (1..100) ============
export function genSquares(): CalcQ[] {
  const qs: CalcQ[] = [];
  // Squares: x² = ?
  for (let x = 2; x <= 100; x++) {
    const c = x * x;
    const distractors = [(x - 1) * (x - 1), (x + 1) * (x + 1), x * x + x, x * x - x];
    const { options, correctIdx } = makeOptions(c, distractors);
    qs.push({ q: `${x}² = ?`, options, correct: correctIdx, explain: `${x} × ${x} = ${c}` });
  }
  // Square roots: √(x²) = ?
  const roots = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225, 256, 289, 324, 361, 400, 441, 484, 529, 576, 625, 676, 729, 784, 841, 900, 961, 1024, 1089, 1156, 1225, 1296, 1369, 1444, 1521, 1600, 1681, 1764, 1849, 1936, 2025, 2116, 2209, 2304, 2401, 2500, 2601, 2704, 2809, 2916, 3025, 3136, 3249, 3364, 3481, 3600, 3721, 3844, 3969, 4096, 4225, 4356, 4489, 4624, 4761, 4900, 5041, 5184, 5329, 5476, 5625, 5776, 5929, 6084, 6241, 6400, 6561, 6724, 6889, 7056, 7225, 7396, 7569, 7744, 7921, 8100, 8281, 8464, 8649, 8836, 9025, 9216, 9409, 9604, 9801, 10000];
  for (const n of roots) {
    const r = Math.round(Math.sqrt(n));
    const distractors = [r - 1, r + 1, r - 2, r + 2].filter((d) => d > 0);
    const { options, correctIdx } = makeOptions(r, distractors);
    qs.push({ q: `√${n} = ?`, options, correct: correctIdx, explain: `${r} × ${r} = ${n}` });
  }
  return shuffle(qs);
}

// ============ CUBES & CUBE ROOTS (1..20) ============
export function genCubes(): CalcQ[] {
  const qs: CalcQ[] = [];
  for (let x = 2; x <= 20; x++) {
    const c = x * x * x;
    const distractors = [(x - 1) ** 3, (x + 1) ** 3, x * x * (x + 1), x * x * (x - 1)];
    const { options, correctIdx } = makeOptions(c, distractors);
    qs.push({ q: `${x}³ = ?`, options, correct: correctIdx, explain: `${x} × ${x} × ${x} = ${c}` });
  }
  for (let x = 2; x <= 20; x++) {
    const c = x * x * x;
    const distractors = [x - 1, x + 1, x - 2, x + 2].filter((d) => d > 0);
    const { options, correctIdx } = makeOptions(x, distractors);
    qs.push({ q: `∛${c} = ?`, options, correct: correctIdx, explain: `${x}³ = ${c}` });
  }
  // A few 2-digit cube roots (perfect cubes only up to 20³=8000)
  return shuffle(qs);
}

// ============ PERCENTAGE / FRACTION CONVERSION ============
// Base fraction table 1/n with common decimal percents.
const FRAC_TABLE: { n: number; pct: number; label: string }[] = [
  { n: 1, pct: 100, label: '100%' },
  { n: 2, pct: 50, label: '50%' },
  { n: 3, pct: 33.33, label: '33.33%' },
  { n: 4, pct: 25, label: '25%' },
  { n: 5, pct: 20, label: '20%' },
  { n: 6, pct: 16.67, label: '16.67%' },
  { n: 7, pct: 14.28, label: '14.28%' },
  { n: 8, pct: 12.5, label: '12.5%' },
  { n: 9, pct: 11.11, label: '11.11%' },
  { n: 10, pct: 10, label: '10%' },
  { n: 11, pct: 9.09, label: '9.09%' },
  { n: 12, pct: 8.33, label: '8.33%' },
  { n: 13, pct: 7.69, label: '7.69%' },
  { n: 14, pct: 7.14, label: '7.14%' },
  { n: 15, pct: 6.67, label: '6.67%' },
  { n: 16, pct: 6.25, label: '6.25%' },
  { n: 17, pct: 5.88, label: '5.88%' },
  { n: 18, pct: 5.55, label: '5.55%' },
  { n: 19, pct: 5.26, label: '5.26%' },
  { n: 20, pct: 5, label: '5%' },
];

export function genPercentage(): CalcQ[] {
  const qs: CalcQ[] = [];

  // Type 1: Fraction → Percentage. "1/n × 100 = ?"
  for (const f of FRAC_TABLE) {
    const distractors = [f.pct + 1, f.pct - 1, Math.round(100 / (f.n + 1) * 100) / 100, Math.round(100 / (f.n - 1 || 1) * 100) / 100];
    const set = new Set<string>([fmt(f.pct)]);
    distractors.forEach((d) => { if (d > 0) set.add(fmt(d)); });
    const arr = shuffle(Array.from(set)).slice(0, 4);
    if (!arr.includes(fmt(f.pct))) arr[0] = fmt(f.pct);
    const shuffled = shuffle(arr);
    qs.push({
      q: `1/${f.n} × 100 = ? %`,
      options: shuffled,
      correct: shuffled.indexOf(fmt(f.pct)),
      explain: `1/${f.n} = ${f.label}`,
    });
  }

  // Type 2: Percentage → Fraction. "33.33% = ?"
  for (const f of FRAC_TABLE.filter((x) => x.n >= 2)) {
    const correctStr = `1/${f.n}`;
    const opts = new Set<string>([correctStr]);
    while (opts.size < 4) {
      const d = f.n + Math.floor(Math.random() * 6) - 3;
      if (d > 0 && d !== f.n) opts.add(`1/${d}`);
    }
    const arr = shuffle(Array.from(opts));
    qs.push({
      q: `${f.label} as a fraction = ?`,
      options: arr,
      correct: arr.indexOf(correctStr),
      explain: `${f.label} = 1/${f.n}`,
    });
  }

  // Type 3: "P% of X = ?" — decimal percents like 33.33% of 90, 12.5% of 64, 11.11% of 90…
  // Pick number N as k × n so answer is integer k × pct-fraction cleanly.
  const targets: { pct: number; label: string; n: number }[] = FRAC_TABLE.filter((x) => x.n >= 2);
  for (let i = 0; i < 90; i++) {
    const t = targets[i % targets.length];
    const k = 2 + Math.floor(Math.random() * 12); // 2..13
    const N = t.n * k; // clean number
    const answer = k; // (1/n) × (n*k) = k
    const distractors = [k + 1, k - 1, k * 2, Math.round(k / 2)];
    const { options, correctIdx } = makeOptions(answer, distractors.filter((d) => d > 0 && d !== answer));
    qs.push({
      q: `${t.label} of ${N} = ?`,
      options,
      correct: correctIdx,
      explain: `${t.label} = 1/${t.n} → ${N} ÷ ${t.n} = ${answer}`,
    });
  }

  // Type 4: multiples (like 125% of 54, 150% of 40, 175% of 80)
  const multiples = [
    { pct: 125, frac: 5 / 4, label: '125%' },
    { pct: 150, frac: 3 / 2, label: '150%' },
    { pct: 175, frac: 7 / 4, label: '175%' },
    { pct: 133.33, frac: 4 / 3, label: '133.33%' },
    { pct: 166.67, frac: 5 / 3, label: '166.67%' },
    { pct: 200, frac: 2, label: '200%' },
    { pct: 250, frac: 5 / 2, label: '250%' },
    { pct: 66.67, frac: 2 / 3, label: '66.67%' },
    { pct: 37.5, frac: 3 / 8, label: '37.5%' },
    { pct: 62.5, frac: 5 / 8, label: '62.5%' },
    { pct: 87.5, frac: 7 / 8, label: '87.5%' },
    { pct: 40, frac: 2 / 5, label: '40%' },
    { pct: 60, frac: 3 / 5, label: '60%' },
    { pct: 80, frac: 4 / 5, label: '80%' },
    { pct: 22.22, frac: 2 / 9, label: '22.22%' },
    { pct: 44.44, frac: 4 / 9, label: '44.44%' },
    { pct: 55.55, frac: 5 / 9, label: '55.55%' },
    { pct: 77.77, frac: 7 / 9, label: '77.77%' },
    { pct: 88.88, frac: 8 / 9, label: '88.88%' },
    { pct: 27.27, frac: 3 / 11, label: '27.27%' },
    { pct: 45.45, frac: 5 / 11, label: '45.45%' },
    { pct: 90.90, frac: 10 / 11, label: '90.9%' },
  ];
  for (let i = 0; i < 40; i++) {
    const m = multiples[i % multiples.length];
    // find denominator to make integer
    const denomMap: Record<string, number> = { '125%': 4, '150%': 2, '175%': 4, '133.33%': 3, '166.67%': 3, '200%': 1, '250%': 2, '66.67%': 3, '37.5%': 8, '62.5%': 8, '87.5%': 8, '40%': 5, '60%': 5, '80%': 5, '22.22%': 9, '44.44%': 9, '55.55%': 9, '77.77%': 9, '88.88%': 9, '27.27%': 11, '45.45%': 11, '90.9%': 11 };
    const d = denomMap[m.label] || 1;
    const k = 2 + Math.floor(Math.random() * 15);
    const N = d * k;
    const answer = Math.round(m.frac * N);
    const distractors = [answer + k, answer - k, answer + 1, answer - 1];
    const { options, correctIdx } = makeOptions(answer, distractors.filter((x) => x > 0 && x !== answer));
    qs.push({
      q: `${m.label} of ${N} = ?`,
      options,
      correct: correctIdx,
      explain: `${m.label} = ${m.frac.toFixed(4).replace(/\.?0+$/, '')} → ${m.frac.toFixed(2)} × ${N} = ${answer}`,
    });
  }

  return shuffle(qs);
}

export function generateQuiz(slug: string): CalcQ[] {
  if (slug === 'squares') return genSquares();
  if (slug === 'cubes') return genCubes();
  if (slug === 'percentage') return genPercentage();
  return [];
}

export const CHAPTER_META: Record<string, { title: string; icon: string; perQSeconds: number }> = {
  squares: { title: 'Squares & Square Roots', icon: '🟦', perQSeconds: 10 },
  cubes: { title: 'Cubes & Cube Roots', icon: '🧊', perQSeconds: 12 },
  percentage: { title: 'Percentage · Fraction Conversion', icon: '％', perQSeconds: 15 },
};
