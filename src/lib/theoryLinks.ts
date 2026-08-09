/**
 * Theory <-> Questions linking.
 * Theory markdown me AI `> Covers: Q12, Q45-Q50` lines daalta hai.
 * Yahan hum theory ko sections me todte hain aur har section ke covered
 * question serials nikalte hain, taaki dono taraf navigation ho sake.
 */

export interface TheorySection {
  id: string;
  title: string;
  level: number;
  /** section ka markdown (Covers line hata ke) */
  body: string;
  /** is section se linked question serial numbers */
  serials: number[];
}

const COVERS_RE = /^\s*>\s*covers\s*:\s*(.+)$/i;

export function parseCoversLine(line: string): number[] | null {
  const m = line.match(COVERS_RE);
  if (!m) return null;
  const out = new Set<number>();
  const re = /Q?\s*(\d+)\s*(?:[-–—]\s*Q?\s*(\d+))?/gi;
  let x: RegExpExecArray | null;
  while ((x = re.exec(m[1]))) {
    const a = Number(x[1]);
    const b = x[2] ? Number(x[2]) : a;
    if (!a) continue;
    if (b >= a && b - a <= 500) for (let i = a; i <= b; i++) out.add(i);
    else out.add(a);
  }
  return [...out].sort((p, q) => p - q);
}

const slug = (s: string, i: number) =>
  `sec-${i}-${s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'part'}`;

export function parseTheorySections(md: string): TheorySection[] {
  const lines = (md || '').split('\n');
  const sections: TheorySection[] = [];
  let cur: TheorySection = { id: 'sec-0-intro', title: '', level: 0, body: '', serials: [] };
  const bodyLines: string[][] = [[]];

  const push = () => {
    cur.body = bodyLines[bodyLines.length - 1].join('\n').trim();
    sections.push(cur);
  };

  for (const line of lines) {
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      push();
      cur = { id: '', title: h[2].trim(), level: h[1].length, body: '', serials: [] };
      cur.id = slug(cur.title, sections.length);
      bodyLines.push([]);
      continue;
    }
    const covers = parseCoversLine(line);
    if (covers) {
      cur.serials.push(...covers);
      continue;
    }
    bodyLines[bodyLines.length - 1].push(line);
  }
  push();

  return sections
    .map((s) => ({ ...s, serials: [...new Set(s.serials)].sort((a, b) => a - b) }))
    .filter((s) => s.title || s.body);
}

/** serial -> section id (pehla section jo us question ko cover karta hai) */
export function buildSerialIndex(sections: TheorySection[]): Map<number, string> {
  const map = new Map<number, string>();
  for (const s of sections) for (const n of s.serials) if (!map.has(n)) map.set(n, s.id);
  return map;
}

export function theoryHasMapping(md: string): boolean {
  return /(^|\n)\s*>\s*covers\s*:/i.test(md || '');
}

/** Q1, Q2, Q3, Q7 -> "Q1–Q3, Q7" */
export function compactSerials(serials: number[]): string {
  if (!serials.length) return '';
  const parts: string[] = [];
  let start = serials[0];
  let prev = serials[0];
  for (let i = 1; i <= serials.length; i++) {
    const n = serials[i];
    if (n === prev + 1) { prev = n; continue; }
    parts.push(start === prev ? `Q${start}` : `Q${start}–Q${prev}`);
    start = n;
    prev = n;
  }
  return parts.join(', ');
}
