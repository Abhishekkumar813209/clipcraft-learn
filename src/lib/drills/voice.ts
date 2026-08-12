import { DrillQ, DrillMeta, shuffle } from './types';

interface Tense {
  key: string;
  name: string;
  activeFormula: string;
  passiveFormula: string;
  active: (s: Subj, v: Verb, o: Obj) => string;
  passive: (s: Subj, v: Verb, o: Obj) => string;
}
interface Subj { nom: string; obj: string; plural: boolean }
interface Verb { v1: string; v1s: string; ing: string; v2: string; v3: string }
interface Obj { text: string; plural: boolean }

const isAre = (p: boolean) => (p ? 'are' : 'is');
const wasWere = (p: boolean) => (p ? 'were' : 'was');
const hasHave = (p: boolean) => (p ? 'have' : 'has');
const doDoes = (p: boolean) => (p ? 'do' : 'does');

export const VOICE_TENSES: Tense[] = [
  {
    key: 'pres_simple', name: 'Present Simple',
    activeFormula: 'V1 / V1+s', passiveFormula: 'is/am/are + V3',
    active: (s, v, o) => `${s.nom} ${s.plural ? v.v1 : v.v1s} ${o.text}.`,
    passive: (s, v, o) => `${cap(o.text)} ${isAre(o.plural)} ${v.v3} by ${s.obj}.`,
  },
  {
    key: 'pres_cont', name: 'Present Continuous',
    activeFormula: 'is/am/are + V1+ing', passiveFormula: 'is/am/are + being + V3',
    active: (s, v, o) => `${s.nom} ${isAre(s.plural)} ${v.ing} ${o.text}.`,
    passive: (s, v, o) => `${cap(o.text)} ${isAre(o.plural)} being ${v.v3} by ${s.obj}.`,
  },
  {
    key: 'pres_perf', name: 'Present Perfect',
    activeFormula: 'has/have + V3', passiveFormula: 'has/have + been + V3',
    active: (s, v, o) => `${s.nom} ${hasHave(s.plural)} ${v.v3} ${o.text}.`,
    passive: (s, v, o) => `${cap(o.text)} ${hasHave(o.plural)} been ${v.v3} by ${s.obj}.`,
  },
  {
    key: 'past_simple', name: 'Past Simple',
    activeFormula: 'V2', passiveFormula: 'was/were + V3',
    active: (s, v, o) => `${s.nom} ${v.v2} ${o.text}.`,
    passive: (s, v, o) => `${cap(o.text)} ${wasWere(o.plural)} ${v.v3} by ${s.obj}.`,
  },
  {
    key: 'past_cont', name: 'Past Continuous',
    activeFormula: 'was/were + V1+ing', passiveFormula: 'was/were + being + V3',
    active: (s, v, o) => `${s.nom} ${wasWere(s.plural)} ${v.ing} ${o.text}.`,
    passive: (s, v, o) => `${cap(o.text)} ${wasWere(o.plural)} being ${v.v3} by ${s.obj}.`,
  },
  {
    key: 'past_perf', name: 'Past Perfect',
    activeFormula: 'had + V3', passiveFormula: 'had + been + V3',
    active: (s, v, o) => `${s.nom} had ${v.v3} ${o.text}.`,
    passive: (s, v, o) => `${cap(o.text)} had been ${v.v3} by ${s.obj}.`,
  },
  {
    key: 'fut_simple', name: 'Future Simple',
    activeFormula: 'will + V1', passiveFormula: 'will + be + V3',
    active: (s, v, o) => `${s.nom} will ${v.v1} ${o.text}.`,
    passive: (s, v, o) => `${cap(o.text)} will be ${v.v3} by ${s.obj}.`,
  },
  {
    key: 'fut_perf', name: 'Future Perfect',
    activeFormula: 'will have + V3', passiveFormula: 'will have been + V3',
    active: (s, v, o) => `${s.nom} will have ${v.v3} ${o.text}.`,
    passive: (s, v, o) => `${cap(o.text)} will have been ${v.v3} by ${s.obj}.`,
  },
  {
    key: 'modal', name: 'Modal (can/must/should)',
    activeFormula: 'modal + V1', passiveFormula: 'modal + be + V3',
    active: (s, v, o) => `${s.nom} must ${v.v1} ${o.text}.`,
    passive: (s, v, o) => `${cap(o.text)} must be ${v.v3} by ${s.obj}.`,
  },
  {
    key: 'imperative', name: 'Imperative (order/request)',
    activeFormula: 'V1 + object', passiveFormula: 'Let + object + be + V3',
    active: (s, v, o) => `${cap(v.v1)} ${o.text}.`,
    passive: (s, v, o) => `Let ${o.text} be ${v.v3}.`,
  },
  {
    key: 'pres_simple_neg', name: 'Present Simple — Negative',
    activeFormula: 'do/does not + V1', passiveFormula: 'is/am/are + not + V3',
    active: (s, v, o) => `${s.nom} ${doDoes(s.plural)} not ${v.v1} ${o.text}.`,
    passive: (s, v, o) => `${cap(o.text)} ${isAre(o.plural)} not ${v.v3} by ${s.obj}.`,
  },
  {
    key: 'past_simple_q', name: 'Past Simple — Question',
    activeFormula: 'Did + subject + V1', passiveFormula: 'Was/Were + object + V3 + by…',
    active: (s, v, o) => `Did ${s.nom.toLowerCase()} ${v.v1} ${o.text}?`,
    passive: (s, v, o) => `${cap(wasWere(o.plural))} ${o.text} ${v.v3} by ${s.obj}?`,
  },
];

function cap(t: string) {
  return t.charAt(0).toUpperCase() + t.slice(1);
}

const SUBJECTS: Subj[] = [
  { nom: 'He', obj: 'him', plural: false },
  { nom: 'She', obj: 'her', plural: false },
  { nom: 'They', obj: 'them', plural: true },
  { nom: 'The teacher', obj: 'the teacher', plural: false },
  { nom: 'The workers', obj: 'the workers', plural: true },
  { nom: 'Ravi', obj: 'Ravi', plural: false },
  { nom: 'The police', obj: 'the police', plural: true },
  { nom: 'My mother', obj: 'my mother', plural: false },
  { nom: 'The students', obj: 'the students', plural: true },
  { nom: 'The company', obj: 'the company', plural: false },
];

const VERBS: Verb[] = [
  { v1: 'write', v1s: 'writes', ing: 'writing', v2: 'wrote', v3: 'written' },
  { v1: 'eat', v1s: 'eats', ing: 'eating', v2: 'ate', v3: 'eaten' },
  { v1: 'build', v1s: 'builds', ing: 'building', v2: 'built', v3: 'built' },
  { v1: 'send', v1s: 'sends', ing: 'sending', v2: 'sent', v3: 'sent' },
  { v1: 'catch', v1s: 'catches', ing: 'catching', v2: 'caught', v3: 'caught' },
  { v1: 'finish', v1s: 'finishes', ing: 'finishing', v2: 'finished', v3: 'finished' },
  { v1: 'sing', v1s: 'sings', ing: 'singing', v2: 'sang', v3: 'sung' },
  { v1: 'repair', v1s: 'repairs', ing: 'repairing', v2: 'repaired', v3: 'repaired' },
  { v1: 'read', v1s: 'reads', ing: 'reading', v2: 'read', v3: 'read' },
  { v1: 'clean', v1s: 'cleans', ing: 'cleaning', v2: 'cleaned', v3: 'cleaned' },
];

const OBJECTS: Obj[] = [
  { text: 'a letter', plural: false },
  { text: 'the mangoes', plural: true },
  { text: 'the house', plural: false },
  { text: 'the parcels', plural: true },
  { text: 'the thief', plural: false },
  { text: 'the work', plural: false },
  { text: 'a song', plural: false },
  { text: 'the bikes', plural: true },
  { text: 'the novel', plural: false },
  { text: 'the rooms', plural: true },
];

const VOICE_TABLE = {
  caption: 'Tense-wise Active → Passive conversion (V3 hamesha lagega)',
  head: ['Tense', 'Active form', 'Passive form'],
  rows: VOICE_TENSES.map((t) => [t.name, t.activeFormula, t.passiveFormula]),
};

const TOTAL = 100;

function buildOne(i: number): DrillQ {
  const t = VOICE_TENSES[i % VOICE_TENSES.length];
  const s = SUBJECTS[i % SUBJECTS.length];
  const v = VERBS[(i * 3) % VERBS.length];
  const o = OBJECTS[(i * 7) % OBJECTS.length];

  const correct = t.passive(s, v, o);
  const others = shuffle(VOICE_TENSES.filter((x) => x.key !== t.key)).slice(0, 3);
  const raw = [{ t, text: correct }, ...others.map((x) => ({ t: x, text: x.passive(s, v, o) }))];
  const uniq = raw.filter((r, idx) => raw.findIndex((z) => z.text === r.text) === idx);
  const opts = shuffle(uniq);

  return {
    id: `voice-${i}`,
    context: `Active: ${t.active(s, v, o)}   (${t.name})`,
    question: 'Iska sahi Passive Voice kaun sa hai?',
    options: opts.map((x) => x.text),
    correctIndex: opts.findIndex((x) => x.text === correct),
    why: opts.map((x) =>
      x.t.key === t.key
        ? `✅ Sahi — ye ${x.t.name} ka passive hai: ${x.t.passiveFormula}. Active ${x.t.activeFormula} tha, isliye same tense ka passive banega.`
        : `❌ Ye ${x.t.name} ka passive hai (${x.t.passiveFormula}). Yaha active sentence ${t.name} me tha (${t.activeFormula}), tense badal nahi sakta — sirf voice badalti hai.`,
    ),
    solution: `${t.name}: Active = ${t.activeFormula}, Passive = ${t.passiveFormula}. Object "${o.text}" subject ban gaya, verb ${v.v3} (V3) hua aur karta "by ${s.obj}" ke saath aaya.`,
    tag: t.name,
  };
}

const ALL: DrillQ[] = Array.from({ length: TOTAL }, (_, i) => buildOne(i));

export const voiceDrill: DrillMeta = {
  key: 'voice-conversion',
  label: 'Active → Passive Conversion',
  emoji: '🔄',
  blurb: 'Tense-wise conversion table + 100 MCQs · option flip se pata chalega kaun se tense ka conversion hai',
  total: TOTAL,
  notes: [
    'Passive me hamesha V3 lagta hai; helping verb tense se decide hota hai.',
    'Voice badalne par tense kabhi nahi badalta — sirf structure badalta hai.',
    'Object → Subject, Subject → "by + objective case" (I→me, he→him, they→them).',
    'Perfect Continuous aur Future Continuous ka passive normally nahi banta (N.A.).',
  ],
  tables: [VOICE_TABLE],
  build: (limit, from, to) => {
    const rows = ALL.slice(from ? from - 1 : 0, to ?? ALL.length);
    return shuffle(rows).slice(0, limit);
  },
};
