// Tracks the last two SSC practice/quiz sessions so users can resume where they left off.
const KEY = 'ssc:recent-sessions:v1';
const MAX = 2;

export interface SscHistoryEntry {
  url: string;         // pathname + search
  label: string;       // human-friendly title
  section: string;     // e.g. "Idioms", "Maths", "Grammar"
  timestamp: number;
}

function read(): SscHistoryEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SscHistoryEntry[]) : [];
  } catch {
    return [];
  }
}

function write(entries: SscHistoryEntry[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(entries.slice(0, MAX)));
  } catch {
    // ignore quota errors
  }
}

export function getSscHistory(): SscHistoryEntry[] {
  return read();
}

export function recordSscVisit(entry: Omit<SscHistoryEntry, 'timestamp'>) {
  const now = Date.now();
  const existing = read().filter((e) => e.url !== entry.url);
  const next = [{ ...entry, timestamp: now }, ...existing].slice(0, MAX);
  write(next);
}

export function clearSscHistory() {
  write([]);
}

/** Given a pathname (+ search), returns a friendly label & section, or null if not trackable. */
export function describeSscRoute(pathname: string, search: string): { label: string; section: string } | null {
  const p = pathname.replace(/\/+$/, '');
  const params = new URLSearchParams(search);

  // Only track actual practice / quiz sessions (not hubs/setup pages).
  const patterns: Array<{ test: RegExp; section: string; label: (m: RegExpMatchArray) => string }> = [
    { test: /^\/ssc\/practice\/([^/]+)$/, section: 'Practice', label: (m) => `Practice — ${decodeURIComponent(m[1])}` },
    { test: /^\/ssc\/blackbook\/practice\/([^/]+)$/, section: 'Black Book', label: (m) => `BB — ${decodeURIComponent(m[1])}` },
    { test: /^\/ssc\/blackbook\/practice$/, section: 'Black Book', label: () => `Black Book Practice` },
    { test: /^\/ssc\/roots\/practice$/, section: 'Vocabulary', label: () => `Roots Practice` },
    { test: /^\/ssc\/english\/synant\/practice$/, section: 'English', label: () => `Synonyms & Antonyms` },
    { test: /^\/ssc\/english\/grammar\/([^/]+)\/basic\/practice$/, section: 'Grammar', label: (m) => `Grammar — ${decodeURIComponent(m[1])} (Basic)` },
    { test: /^\/ssc\/maths\/calculation\/([^/]+)$/, section: 'Maths', label: (m) => `Maths — ${decodeURIComponent(m[1])}` },
  ];

  for (const pat of patterns) {
    const m = p.match(pat.test);
    if (m) {
      let label = pat.label(m);
      // Enrich with mode/count hints from query.
      const bits: string[] = [];
      const from = params.get('from');
      const to = params.get('to');
      const count = params.get('count');
      const mode = params.get('mode');
      const diff = params.get('difficulty');
      if (from && to) bits.push(`Q${from}-${to}`);
      else if (count) bits.push(`${count} Qs`);
      if (mode) bits.push(mode);
      if (diff) bits.push(diff);
      if (bits.length) label += ` · ${bits.join(' · ')}`;
      return { label, section: pat.section };
    }
  }

  // Idioms / OWS quizzes have their setup at /english/idioms & /english/ows;
  // once a session is running the query includes ?count= or ?from=. Track those.
  if (/^\/ssc\/english\/(idioms|ows)$/.test(p) && (params.has('count') || params.has('from'))) {
    const kind = p.endsWith('idioms') ? 'Idioms' : 'One-word Substitution';
    const bits: string[] = [];
    if (params.get('from') && params.get('to')) bits.push(`Q${params.get('from')}-${params.get('to')}`);
    else if (params.get('count')) bits.push(`${params.get('count')} Qs`);
    if (params.get('difficulty')) bits.push(params.get('difficulty')!);
    return { label: `${kind}${bits.length ? ' · ' + bits.join(' · ') : ''}`, section: 'English' };
  }

  return null;
}
