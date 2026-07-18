// Client-side question generators for calculation speed drills.
export interface CalcQ {
  q: string;
  options: string[];
  correct: number;
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

// ============ SQUARES only ============
export function genSquaresOnly(): CalcQ[] {
  const qs: CalcQ[] = [];
  for (let x = 2; x <= 100; x++) {
    const c = x * x;
    const distractors = [(x - 1) * (x - 1), (x + 1) * (x + 1), x * x + x, x * x - x];
    const { options, correctIdx } = makeOptions(c, distractors);
    qs.push({ q: `${x}² = ?`, options, correct: correctIdx, explain: `${x} × ${x} = ${c}` });
  }
  return shuffle(qs);
}

// ============ SQUARE ROOTS only ============
export function genSquareRootsOnly(): CalcQ[] {
  const qs: CalcQ[] = [];
  for (let r = 2; r <= 100; r++) {
    const n = r * r;
    const distractors = [r - 1, r + 1, r - 2, r + 2].filter((d) => d > 0);
    const { options, correctIdx } = makeOptions(r, distractors);
    qs.push({ q: `√${n} = ?`, options, correct: correctIdx, explain: `${r} × ${r} = ${n}` });
  }
  return shuffle(qs);
}

// ============ CUBES only ============
export function genCubesOnly(): CalcQ[] {
  const qs: CalcQ[] = [];
  for (let x = 2; x <= 20; x++) {
    const c = x * x * x;
    const distractors = [(x - 1) ** 3, (x + 1) ** 3, x * x * (x + 1), x * x * (x - 1)];
    const { options, correctIdx } = makeOptions(c, distractors);
    qs.push({ q: `${x}³ = ?`, options, correct: correctIdx, explain: `${x} × ${x} × ${x} = ${c}` });
  }
  return shuffle(qs);
}

// ============ CUBE ROOTS only ============
export function genCubeRootsOnly(): CalcQ[] {
  const qs: CalcQ[] = [];
  for (let x = 2; x <= 20; x++) {
    const c = x * x * x;
    const distractors = [x - 1, x + 1, x - 2, x + 2].filter((d) => d > 0);
    const { options, correctIdx } = makeOptions(x, distractors);
    qs.push({ q: `∛${c} = ?`, options, correct: correctIdx, explain: `${x}³ = ${c}` });
  }
  return shuffle(qs);
}

const FRAC_TABLE: { n: number; pct: number; label: string }[] = [
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

// ============ % ↔ FRACTION CONVERSION only ============
export function genPercentConversion(): CalcQ[] {
  const qs: CalcQ[] = [];
  for (const f of FRAC_TABLE) {
    const set = new Set<string>([fmt(f.pct)]);
    [f.pct + 1, f.pct - 1, Math.round(100 / (f.n + 1) * 100) / 100, Math.round(100 / Math.max(1, f.n - 1) * 100) / 100]
      .forEach((d) => { if (d > 0) set.add(fmt(d)); });
    const arr = shuffle(Array.from(set)).slice(0, 4);
    if (!arr.includes(fmt(f.pct))) arr[0] = fmt(f.pct);
    const shuffled = shuffle(arr);
    qs.push({ q: `1/${f.n} × 100 = ? %`, options: shuffled, correct: shuffled.indexOf(fmt(f.pct)), explain: `1/${f.n} = ${f.label}` });
  }
  for (const f of FRAC_TABLE) {
    const correctStr = `1/${f.n}`;
    const opts = new Set<string>([correctStr]);
    while (opts.size < 4) {
      const d = f.n + Math.floor(Math.random() * 6) - 3;
      if (d > 0 && d !== f.n) opts.add(`1/${d}`);
    }
    const arr = shuffle(Array.from(opts));
    qs.push({ q: `${f.label} as a fraction = ?`, options: arr, correct: arr.indexOf(correctStr), explain: `${f.label} = 1/${f.n}` });
  }
  return shuffle(qs);
}

// ============ % / DECIMAL MULTIPLICATION only ============
export function genPercentCalculation(): CalcQ[] {
  const qs: CalcQ[] = [];
  const targets = FRAC_TABLE;
  for (let i = 0; i < 120; i++) {
    const t = targets[i % targets.length];
    const k = 2 + Math.floor(Math.random() * 12);
    const N = t.n * k;
    const answer = k;
    const distractors = [k + 1, k - 1, k * 2, Math.round(k / 2)].filter((d) => d > 0 && d !== answer);
    const { options, correctIdx } = makeOptions(answer, distractors);
    qs.push({ q: `${t.label} of ${N} = ?`, options, correct: correctIdx, explain: `${t.label} = 1/${t.n} → ${N} ÷ ${t.n} = ${answer}` });
  }
  const multiples = [
    { pct: 125, frac: 5 / 4, label: '125%', d: 4 },
    { pct: 150, frac: 3 / 2, label: '150%', d: 2 },
    { pct: 175, frac: 7 / 4, label: '175%', d: 4 },
    { pct: 133.33, frac: 4 / 3, label: '133.33%', d: 3 },
    { pct: 166.67, frac: 5 / 3, label: '166.67%', d: 3 },
    { pct: 200, frac: 2, label: '200%', d: 1 },
    { pct: 250, frac: 5 / 2, label: '250%', d: 2 },
    { pct: 66.67, frac: 2 / 3, label: '66.67%', d: 3 },
    { pct: 37.5, frac: 3 / 8, label: '37.5%', d: 8 },
    { pct: 62.5, frac: 5 / 8, label: '62.5%', d: 8 },
    { pct: 87.5, frac: 7 / 8, label: '87.5%', d: 8 },
    { pct: 40, frac: 2 / 5, label: '40%', d: 5 },
    { pct: 60, frac: 3 / 5, label: '60%', d: 5 },
    { pct: 80, frac: 4 / 5, label: '80%', d: 5 },
    { pct: 22.22, frac: 2 / 9, label: '22.22%', d: 9 },
    { pct: 44.44, frac: 4 / 9, label: '44.44%', d: 9 },
    { pct: 55.55, frac: 5 / 9, label: '55.55%', d: 9 },
    { pct: 77.77, frac: 7 / 9, label: '77.77%', d: 9 },
    { pct: 88.88, frac: 8 / 9, label: '88.88%', d: 9 },
    { pct: 27.27, frac: 3 / 11, label: '27.27%', d: 11 },
    { pct: 45.45, frac: 5 / 11, label: '45.45%', d: 11 },
    { pct: 90.9, frac: 10 / 11, label: '90.9%', d: 11 },
  ];
  for (let i = 0; i < 60; i++) {
    const m = multiples[i % multiples.length];
    const k = 2 + Math.floor(Math.random() * 15);
    const N = m.d * k;
    const answer = Math.round(m.frac * N);
    const distractors = [answer + k, answer - k, answer + 1, answer - 1].filter((x) => x > 0 && x !== answer);
    const { options, correctIdx } = makeOptions(answer, distractors);
    qs.push({ q: `${m.label} of ${N} = ?`, options, correct: correctIdx, explain: `${m.label} × ${N} = ${answer}` });
  }
  return shuffle(qs);
}

export function generateQuiz(slug: string): CalcQ[] {
  switch (slug) {
    case 'squares': return genSquaresOnly();
    case 'sqroots': return genSquareRootsOnly();
    case 'cubes': return genCubesOnly();
    case 'cbroots': return genCubeRootsOnly();
    case 'pct-conv': return genPercentConversion();
    case 'pct-calc': return genPercentCalculation();
  }
  return [];
}

export const CHAPTER_META: Record<string, { title: string; icon: string; perQSeconds: number }> = {
  squares: { title: 'Squares (1 → 100)', icon: '🟦', perQSeconds: 10 },
  sqroots: { title: 'Square Roots (√ up to 10 000)', icon: '√', perQSeconds: 10 },
  cubes: { title: 'Cubes (1 → 20)', icon: '🧊', perQSeconds: 12 },
  cbroots: { title: 'Cube Roots (∛ up to 8000)', icon: '∛', perQSeconds: 12 },
  'pct-conv': { title: '% ↔ Fraction Conversion', icon: '％', perQSeconds: 12 },
  'pct-calc': { title: '% / Decimal Multiplication', icon: '✖️', perQSeconds: 18 },
};
