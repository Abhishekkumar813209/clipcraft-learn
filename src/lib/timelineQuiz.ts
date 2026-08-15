import raw from '@/data/historyTimeline.json';

export interface TimelineEvent {
  y: string;
  title: string;
  who?: string;
  span?: string;
  kind?: string;
  detail?: string;
  reason?: string;
}

export interface TimelineChapter {
  key: string;
  title: string;
  blurb?: string;
  events: TimelineEvent[];
}

export interface TimelineSubject {
  label: string;
  emoji: string;
  chapters: TimelineChapter[];
}

export const TIMELINE = raw as unknown as Record<string, TimelineSubject>;

export const timelineSubject = (key?: string): TimelineSubject | undefined =>
  key ? TIMELINE[key] : undefined;

export interface TimelineQ {
  no: number;
  q: string;
  options: string[];
  correct: number;
  answer: string;
  solution: string;
  why: string[];
}

// deterministic PRNG so quiz is stable per chapter
function rng(seed: number) {
  let s = seed || 1;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function pickDistinct<T>(pool: T[], exclude: (v: T) => boolean, n: number, rand: () => number): T[] {
  const cand = pool.filter((v) => !exclude(v));
  const out: T[] = [];
  const used = new Set<number>();
  let guard = 0;
  while (out.length < n && used.size < cand.length && guard++ < 500) {
    const i = Math.floor(rand() * cand.length);
    if (used.has(i)) continue;
    used.add(i);
    out.push(cand[i]);
  }
  return out;
}

function shuffleWithAnswer(correct: string, others: string[], rand: () => number) {
  const opts = [correct, ...others];
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  return { options: opts, correct: opts.indexOf(correct) };
}

const kindWord = (k?: string) =>
  k === 'war' ? 'yudh / aakraman' : k === 'policy' ? 'policy' : k === 'accession' ? 'gaddi-nashini' : 'ghatna';

/** Build chronology MCQs (year, ruler, war-reason, policy-owner) from a chapter's events. */
export function buildTimelineQuiz(chapter: TimelineChapter, limit = 100): TimelineQ[] {
  const rand = rng(chapter.key.split('').reduce((a, c) => a + c.charCodeAt(0), 7));
  const evs = chapter.events;
  const qs: Omit<TimelineQ, 'no'>[] = [];

  const yearOf = (e: TimelineEvent) => e.y;

  for (const e of evs) {
    // 1. Event → year
    {
      const others = pickDistinct(evs, (x) => x.y === e.y, 3, rand).map(yearOf);
      if (others.length === 3) {
        const { options, correct } = shuffleWithAnswer(e.y, others, rand);
        qs.push({
          q: `"${e.title}" — ye ghatna kis saal hui?`,
          options,
          correct,
          answer: e.y,
          solution: `${e.y}: ${e.title}. ${e.detail || ''}${e.reason ? ` Reason: ${e.reason}` : ''}`.trim(),
          why: options.map((o) => {
            if (o === e.y) return `SAHI ✓ – ${e.y} me ${e.title}. ${e.detail || ''}`.trim();
            const other = evs.find((x) => x.y === o);
            return `GALAT ✗ – ${o} me ${other ? `${other.title} (${kindWord(other.kind)}) hua tha` : 'is chapter ki koi aur ghatna thi'}, ye event nahi.`;
          }),
        });
      }
    }

    // 2. Year → event
    {
      const others = pickDistinct(evs, (x) => x.title === e.title, 3, rand).map((x) => x.title);
      if (others.length === 3) {
        const { options, correct } = shuffleWithAnswer(e.title, others, rand);
        qs.push({
          q: `${e.y} me is chapter ki kaun si ghatna hui?`,
          options,
          correct,
          answer: e.title,
          solution: `${e.y} → ${e.title}. ${e.detail || ''}`.trim(),
          why: options.map((o) => {
            const other = evs.find((x) => x.title === o);
            if (o === e.title) return `SAHI ✓ – ${e.y} me yahi hua. ${e.detail || ''}`.trim();
            return `GALAT ✗ – "${o}" ${other ? `${other.y} me hua tha` : 'alag samay ka hai'}${other?.span ? ` (${other.span})` : ''}.`;
          }),
        });
      }
    }

    // 3. Reign span
    if (e.span && e.who) {
      const spanPool = evs.filter((x) => x.span && x.span !== e.span);
      const others = pickDistinct(spanPool, (x) => x.span === e.span, 3, rand).map((x) => x.span!);
      if (others.length === 3) {
        const { options, correct } = shuffleWithAnswer(e.span, others, rand);
        qs.push({
          q: `${e.who} ka shasan-kaal kaun sa tha?`,
          options,
          correct,
          answer: e.span,
          solution: `${e.who} — ${e.span}. ${e.detail || ''}`.trim(),
          why: options.map((o) => {
            if (o === e.span) return `SAHI ✓ – ${e.who} ka reign ${e.span}.`;
            const other = evs.find((x) => x.span === o);
            return `GALAT ✗ – ${o} ${other?.who ? `${other.who} ka period hai` : 'kisi aur shasak ka period hai'}.`;
          }),
        });
      }
    }

    // 4. Who did it (war / policy)
    if (e.who && (e.kind === 'war' || e.kind === 'policy')) {
      const whoPool = evs.filter((x) => x.who && x.who !== e.who);
      const others = pickDistinct(whoPool, (x) => x.who === e.who, 3, rand).map((x) => x.who!);
      if (others.length === 3) {
        const { options, correct } = shuffleWithAnswer(e.who, others, rand);
        qs.push({
          q: `"${e.title}" (${e.y}) kiske samay / kiske dwara hua?`,
          options,
          correct,
          answer: e.who,
          solution: `${e.who} — ${e.title} (${e.y}). ${e.detail || ''}${e.reason ? ` Reason: ${e.reason}` : ''}`.trim(),
          why: options.map((o) => {
            if (o === e.who) return `SAHI ✓ – ${e.who} se juda hai. ${e.detail || ''}`.trim();
            const other = evs.find((x) => x.who === o);
            return `GALAT ✗ – ${o} ${other?.span ? `(${other.span}) ` : ''}ka sambandh "${other?.title || 'doosri ghatna'}" se hai.`;
          }),
        });
      }
    }

    // 5. Reason / kyu hua
    if (e.reason) {
      const reasonPool = evs.filter((x) => x.reason && x.reason !== e.reason);
      const others = pickDistinct(reasonPool, (x) => x.reason === e.reason, 3, rand).map((x) => x.reason!);
      if (others.length === 3) {
        const { options, correct } = shuffleWithAnswer(e.reason, others, rand);
        qs.push({
          q: `"${e.title}" (${e.y}) kyu hui — sahi kaaran chuno.`,
          options,
          correct,
          answer: e.reason,
          solution: `${e.title} (${e.y}) ka kaaran: ${e.reason}`,
          why: options.map((o) => {
            if (o === e.reason) return `SAHI ✓ – yahi is ghatna ka kaaran tha.`;
            const other = evs.find((x) => x.reason === o);
            return `GALAT ✗ – ye kaaran "${other?.title || 'doosri ghatna'}"${other ? ` (${other.y})` : ''} se juda hai.`;
          }),
        });
      }
    }
  }

  // interleave types so consecutive questions aren't about the same event
  const out = qs.slice(0, limit).map((x, i) => ({ ...x, no: i + 1 }));
  return out;
}

export function buildSubjectQuiz(subjectKey: string, limit = 100): TimelineQ[] {
  const sub = TIMELINE[subjectKey];
  if (!sub) return [];
  const perChapter = sub.chapters.map((c) => buildTimelineQuiz(c, 999));
  const merged: TimelineQ[] = [];
  let i = 0;
  while (merged.length < limit) {
    let added = false;
    for (const list of perChapter) {
      if (list[i]) {
        merged.push(list[i]);
        added = true;
        if (merged.length >= limit) break;
      }
    }
    if (!added) break;
    i++;
  }
  return merged.map((q, idx) => ({ ...q, no: idx + 1 }));
}
