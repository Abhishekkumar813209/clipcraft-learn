/** AI theory me aksar LaTeX-ish junk aa jata hai ($\text{...}$, \rightarrow) — usko readable text me badalta hai. */
export function cleanTheoryMd(md: string): string {
  if (!md) return md;
  return md
    .replace(/\\text\s*\{([^}]*)\}/g, '$1')
    .replace(/\\mathrm\s*\{([^}]*)\}/g, '$1')
    .replace(/\\(rightarrow|to)\b/g, '→')
    .replace(/\\times\b/g, '×')
    .replace(/\\[,;!]/g, ' ')
    .replace(/\$\$?([^$\n]{0,300}?)\$\$?/g, '$1')
    .replace(/\\\\/g, ' ')
    .replace(/[ \t]{2,}/g, ' ');
}
