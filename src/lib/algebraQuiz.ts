// Algebra formula-recall drills: x + 1/x = n  aur  x − 1/x = n  family
import type { CalcQ } from './calcQuiz';

export type AlgMode = 'serial' | 'random';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function mk(q: string, correct: string, pool: string[], explain: string): CalcQ {
  const opts: string[] = [correct];
  for (const p of shuffle(pool)) {
    if (opts.length >= 4) break;
    if (!opts.includes(p)) opts.push(p);
  }
  let filler = 1;
  while (opts.length < 4) {
    const cand = `${correct} + ${filler}`;
    if (!opts.includes(cand)) opts.push(cand);
    filler++;
  }
  const s = shuffle(opts);
  return { q, options: s, correct: s.indexOf(correct), explain };
}

/* superscript helpers so questions x² / x⁵ style me dikhein */
const SUP = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
const sup = (n: number) => String(n).split('').map((d) => SUP[Number(d)]).join('');
const xp = (k: number) => (k === 1 ? 'x' : `x${sup(k)}`);
/** x^k + 1/x^k  ya  x^k − 1/x^k */
const expr = (k: number, sign: '+' | '−') => `${xp(k)} ${sign} 1/${xp(k)}`;

/* ---------------- Profile A: x + 1/x = n ---------------- */
interface Formula {
  k: number;
  sign: '+' | '−';
  text: string;                    // formula in n
  value: (n: number) => number;    // numeric value for integer n
  steps: string;
}

const PLUS_FORMULAS: Formula[] = [
  { k: 2, sign: '+', text: 'n² − 2', value: (n) => n * n - 2, steps: '(x + 1/x)² = x² + 1/x² + 2 ⇒ x² + 1/x² = n² − 2' },
  { k: 3, sign: '+', text: 'n³ − 3n', value: (n) => n ** 3 - 3 * n, steps: '(x + 1/x)³ = x³ + 1/x³ + 3(x + 1/x) ⇒ x³ + 1/x³ = n³ − 3n' },
  { k: 4, sign: '+', text: '(n² − 2)² − 2', value: (n) => (n * n - 2) ** 2 - 2, steps: 'x⁴ + 1/x⁴ = (x² + 1/x²)² − 2 = (n² − 2)² − 2' },
  { k: 5, sign: '+', text: '(n² − 2)(n³ − 3n) − n', value: (n) => (n * n - 2) * (n ** 3 - 3 * n) - n, steps: '(x² + 1/x²)(x³ + 1/x³) = x⁵ + 1/x⁵ + (x + 1/x) ⇒ x⁵ + 1/x⁵ = (n² − 2)(n³ − 3n) − n' },
  { k: 6, sign: '+', text: '(n³ − 3n)² − 2', value: (n) => (n ** 3 - 3 * n) ** 2 - 2, steps: 'x⁶ + 1/x⁶ = (x³ + 1/x³)² − 2 = (n³ − 3n)² − 2' },
  { k: 7, sign: '+', text: '(n³ − 3n)((n² − 2)² − 2) − n', value: (n) => (n ** 3 - 3 * n) * ((n * n - 2) ** 2 - 2) - n, steps: 'x⁷ + 1/x⁷ = (x³ + 1/x³)(x⁴ + 1/x⁴) − (x + 1/x)' },
];

const MINUS_FORMULAS: Formula[] = [
  { k: 2, sign: '+', text: 'n² + 2', value: (n) => n * n + 2, steps: '(x − 1/x)² = x² + 1/x² − 2 ⇒ x² + 1/x² = n² + 2' },
  { k: 3, sign: '−', text: 'n³ + 3n', value: (n) => n ** 3 + 3 * n, steps: '(x − 1/x)³ = x³ − 1/x³ − 3(x − 1/x) ⇒ x³ − 1/x³ = n³ + 3n' },
  { k: 4, sign: '+', text: '(n² + 2)² − 2', value: (n) => (n * n + 2) ** 2 - 2, steps: 'x⁴ + 1/x⁴ = (x² + 1/x²)² − 2 = (n² + 2)² − 2' },
  { k: 5, sign: '−', text: '(n² + 2)(n³ + 3n) − n', value: (n) => (n * n + 2) * (n ** 3 + 3 * n) - n, steps: '(x² + 1/x²)(x³ − 1/x³) = x⁵ − 1/x⁵ + (x − 1/x) ⇒ x⁵ − 1/x⁵ = (n² + 2)(n³ + 3n) − n' },
  { k: 6, sign: '+', text: '(n³ + 3n)² + 2', value: (n) => (n ** 3 + 3 * n) ** 2 + 2, steps: 'x⁶ + 1/x⁶ = (x³ − 1/x³)² + 2 = (n³ + 3n)² + 2' },
];

const PLUS_POOL = [
  'n² − 2', 'n² + 2', 'n³ − 3n', 'n³ + 3n', '(n² − 2)² − 2', '(n² + 2)² − 2',
  '(n³ − 3n)² − 2', '(n³ + 3n)² + 2', '(n² − 2)(n³ − 3n) − n', '(n² + 2)(n³ + 3n) − n',
  'n² − 4', 'n³ − 2n', '(n² − 2)² + 2', 'n⁴ − 2', 'n⁵ − 5n',
];

function numericDistractors(v: number): string[] {
  const cands = [v + 2, v - 2, v + 4, v - 4, v * 2, v + 1, v - 1, v + 10, v - 10];
  return shuffle(cands).filter((c) => c !== v).map(String);
}

function buildProfile(formulas: Formula[], baseSign: '+' | '−', count: number): CalcQ[] {
  const out: CalcQ[] = [];
  const given = `x ${baseSign} 1/x = n`;
  const nValues = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12];

  // 1) Formula recall (dono direction)
  for (const f of formulas) {
    out.push(mk(
      `Agar ${given}, to ${expr(f.k, f.sign)} = ?`,
      f.text, PLUS_POOL, f.steps,
    ));
    out.push(mk(
      `${given} par kis expression ki value ${f.text} hoti hai?`,
      expr(f.k, f.sign),
      formulas.map((g) => expr(g.k, g.sign)).concat([expr(8, '+'), expr(9, '−')]),
      f.steps,
    ));
  }

  // 2) Numeric drills — har formula × har n
  for (const n of nValues) {
    for (const f of formulas) {
      const v = f.value(n);
      out.push(mk(
        `Agar x ${baseSign} 1/x = ${n}, to ${expr(f.k, f.sign)} = ?`,
        String(v),
        numericDistractors(v),
        `${expr(f.k, f.sign)} = ${f.text} = ${v}  (n = ${n})\n${f.steps}`,
      ));
    }
  }

  // 3) Chain/step questions (intermediate values se aage)
  for (const n of nValues) {
    const sq = baseSign === '+' ? n * n - 2 : n * n + 2;
    out.push(mk(
      `x ${baseSign} 1/x = ${n} hai. Pehle x² + 1/x² nikaalo.`,
      String(sq), numericDistractors(sq),
      `x² + 1/x² = n² ${baseSign === '+' ? '−' : '+'} 2 = ${sq}`,
    ));
    const cu = baseSign === '+' ? n ** 3 - 3 * n : n ** 3 + 3 * n;
    out.push(mk(
      `x ${baseSign} 1/x = ${n} hai. ${expr(3, baseSign)} = ?`,
      String(cu), numericDistractors(cu),
      `${expr(3, baseSign)} = n³ ${baseSign === '+' ? '−' : '+'} 3n = ${cu}`,
    ));
    const q4 = sq * sq - 2;
    out.push(mk(
      `x ${baseSign} 1/x = ${n} hai aur x² + 1/x² = ${sq}. To x⁴ + 1/x⁴ = ?`,
      String(q4), numericDistractors(q4),
      `x⁴ + 1/x⁴ = (x² + 1/x²)² − 2 = ${sq}² − 2 = ${q4}`,
    ));
  }

  // pool ko repeat karke count tak le jao (shuffled variants)
  const base = out.slice();
  while (out.length < count) {
    for (const qq of base) {
      if (out.length >= count) break;
      const s = shuffle(qq.options);
      out.push({ ...qq, options: s, correct: s.indexOf(qq.options[qq.correct]) });
    }
  }
  return out.slice(0, count);
}

export const ALGEBRA_CHAPTERS = ['alg-xplus', 'alg-xminus', 'alg-mixed'] as const;

export function generateAlgebraQuiz(slug: string, mode: AlgMode = 'serial'): CalcQ[] {
  let qs: CalcQ[] = [];
  if (slug === 'alg-xplus') qs = buildProfile(PLUS_FORMULAS, '+', 220);
  else if (slug === 'alg-xminus') qs = buildProfile(MINUS_FORMULAS, '−', 220);
  else if (slug === 'alg-mixed') {
    const a = buildProfile(PLUS_FORMULAS, '+', 120);
    const b = buildProfile(MINUS_FORMULAS, '−', 120);
    qs = a.map((x, i) => [x, b[i]]).flat().slice(0, 240);
  } else return [];
  return mode === 'random' ? shuffle(qs) : qs;
}
