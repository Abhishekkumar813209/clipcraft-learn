import facts from '@/data/polityFacts.json';

export interface PolityFact {
  sheet: string;
  prompt: string;
  answer: string;
  detail: string;
  extra: string;
}

export interface PolitySheetMeta {
  key: string;
  label: string;
  emoji: string;
  blurb: string;
  ask: string;      // prompt -> answer question template ({x} = prompt)
  askRev: string;   // answer -> prompt question template ({x} = answer)
}

export const POLITY_SHEETS: PolitySheetMeta[] = [
  { key: 'parts', label: 'Parts & Articles', emoji: '📜', blurb: 'Kaun sa Part kis subject se deal karta hai', ask: '{x} kis subject se deal karta hai?', askRev: '"{x}" kis Part me aata hai?' },
  { key: 'schedules', label: 'Schedules', emoji: '📚', blurb: '12 Schedules aur unke provisions', ask: '{x} me kya provision hai?', askRev: '"{x}" kis Schedule me hai?' },
  { key: 'sources', label: 'Sources of Constitution', emoji: '🌐', blurb: 'Kaun sa feature kaha se liya gaya', ask: '"{x}" feature kaha se liya gaya hai?', askRev: '{x} se kaun sa feature liya gaya hai?' },
  { key: 'articles', label: 'Important Articles', emoji: '⚖️', blurb: '146 important articles + exam points', ask: '{x} kis se related hai?', askRev: '"{x}" kis Article me hai?' },
  { key: 'duties', label: 'Fundamental Duties', emoji: '🤝', blurb: 'Art 51A ki 11 duties', ask: '{x} kya kehta hai?', askRev: '"{x}" kis clause me hai?' },
  { key: 'amendments', label: 'Constitutional Amendments', emoji: '✏️', blurb: '42 amendments — trigger aur badlav', ask: '{x} amendment kis naam se jana jata hai?', askRev: '"{x}" kaun sa amendment hai?' },
  { key: 'cases', label: 'Landmark Cases', emoji: '🏛️', blurb: '20 landmark judgments ka theme aur ratio', ask: '{x} case ka theme kya hai?', askRev: 'Theme "{x}" kis case se juda hai?' },
  { key: 'seats', label: 'RS & LS Seats', emoji: '🗳️', blurb: 'State-wise Rajya Sabha & Lok Sabha seats', ask: '{x} kitni hain?', askRev: 'Kis state me {x} seats hain?' },
];

export const politySheet = (key?: string): PolitySheetMeta =>
  POLITY_SHEETS.find((s) => s.key === key) || POLITY_SHEETS[0];

export const POLITY_FACTS = facts as PolityFact[];

export const factsOf = (sheet: string) => POLITY_FACTS.filter((f) => f.sheet === sheet);

export const polityCounts: Record<string, number> = POLITY_FACTS.reduce((acc, f) => {
  acc[f.sheet] = (acc[f.sheet] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

/** Har sheet ka MCQ target — facts se forward/reverse variants bana ke itne questions milte hain. */
export const POLITY_TARGETS: Record<string, number> = {
  parts: 100,
  schedules: 50,
  sources: 200,
  articles: 500,
  amendments: 200,
};

export const polityTarget = (sheet: string) =>
  POLITY_TARGETS[sheet] ?? (polityCounts[sheet] || 0);

export interface PolityOptionInfo {
  text: string;
  title: string;   // "Article 21 — Protection of Life & Personal Liberty"
  detail: string;  // fact detail
  extra: string;
}

export interface PolityQ {
  id: string;
  question: string;
  options: string[];
  optionInfo: PolityOptionInfo[];
  correctIndex: number;
  detail: string;
  extra: string;
  reference: string; // the fact "prompt — answer" line
}

const shuffle = <T,>(a: T[]) => {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
};

function pickDistractors(pool: string[], correct: string, n = 3) {
  const uniq = Array.from(new Set(pool.filter((p) => p && p !== correct)));
  return shuffle(uniq).slice(0, n);
}

/**
 * Builds MCQs for one sheet — pehle har fact ka forward variant (coverage guarantee),
 * phir reverse variants, phir cycle. Isse 500-question set me koi article chhoota nahi.
 */
export function buildPolityQuiz(sheet: string, limit = 20, from?: number, to?: number): PolityQ[] {
  const meta = politySheet(sheet);
  let rows = factsOf(sheet);
  if (from || to) rows = rows.slice((from ? from - 1 : 0), to ?? rows.length);
  if (!rows.length) return [];
  const answers = rows.map((r) => r.answer);
  const prompts = rows.map((r) => r.prompt);

  // value -> fact lookup (dono direction) taaki har option flip ho sake
  const byValue = new Map<string, PolityFact>();
  for (const f of rows) {
    if (!byValue.has(f.prompt)) byValue.set(f.prompt, f);
    if (!byValue.has(f.answer)) byValue.set(f.answer, f);
  }
  const infoFor = (text: string): PolityOptionInfo => {
    const f = byValue.get(text);
    return {
      text,
      title: f ? `${f.prompt} — ${f.answer}` : text,
      detail: f?.detail || '',
      extra: f?.extra || '',
    };
  };

  type Variant = { f: PolityFact; reverse: boolean };
  const forward: Variant[] = rows.map((f) => ({ f, reverse: false }));
  const reverse: Variant[] = prompts.length > 4 ? rows.map((f) => ({ f, reverse: true })) : [];

  const picked: Variant[] = [];
  let round = 0;
  while (picked.length < limit) {
    const batch = round % 2 === 0 ? shuffle(forward) : shuffle(reverse.length ? reverse : forward);
    picked.push(...batch.slice(0, limit - picked.length));
    round++;
    if (!forward.length) break;
  }

  const qs: PolityQ[] = picked.map(({ f, reverse: rev }, i) => {
    const correct = rev ? f.prompt : f.answer;
    const distractors = pickDistractors(rev ? prompts : answers, correct);
    const options = shuffle([correct, ...distractors]);
    return {
      id: `${sheet}-${i}-${rev ? 'r' : 'f'}-${f.prompt.slice(0, 24)}`,
      question: (rev ? meta.askRev : meta.ask).replace('{x}', rev ? f.answer : f.prompt),
      options,
      optionInfo: options.map(infoFor),
      correctIndex: options.indexOf(correct),
      detail: f.detail,
      extra: f.extra,
      reference: `${f.prompt} — ${f.answer}`,
    };
  });
  return qs.filter((q) => q.options.length >= 2);
}

/* ---------------- Match the column ---------------- */

export interface PolityMatchQ {
  id: string;
  left: PolityOptionInfo[];   // Column A (prompts)
  right: PolityOptionInfo[];  // Column B (answers, shuffled)
  /** correct[i] = index in `right` jo left[i] se match karta hai */
  correct: number[];
}

const infoOf = (f: PolityFact, text: string): PolityOptionInfo => ({
  text,
  title: `${f.prompt} — ${f.answer}`,
  detail: f.detail || '',
  extra: f.extra || '',
});

/** 5x5 match-the-column sets. `limit` = kitne sets chahiye. */
export function buildPolityMatch(sheet: string, limit = 20, from?: number, to?: number, rows_ = 5): PolityMatchQ[] {
  let rows = factsOf(sheet);
  if (from || to) rows = rows.slice((from ? from - 1 : 0), to ?? rows.length);
  if (rows.length < rows_) return [];
  const sets: PolityMatchQ[] = [];
  let pool: PolityFact[] = [];
  for (let s = 0; s < limit; s++) {
    if (pool.length < rows_) pool = shuffle(rows);
    const chunk = pool.splice(0, rows_);
    const left = chunk.map((f) => infoOf(f, f.prompt));
    const order = shuffle(chunk.map((_, i) => i));
    const right = order.map((i) => infoOf(chunk[i], chunk[i].answer));
    const correct = chunk.map((_, i) => order.indexOf(i));
    sets.push({ id: `${sheet}-m-${s}-${chunk[0].prompt.slice(0, 20)}`, left, right, correct });
  }
  return sets;
}


