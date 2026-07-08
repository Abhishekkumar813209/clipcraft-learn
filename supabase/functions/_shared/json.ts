// Robust JSON extraction for LLM outputs.
export function extractJson(response: string): unknown {
  let cleaned = response.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  const start = cleaned.search(/[\{\[]/);
  if (start === -1) throw new Error("No JSON found");
  const openChar = cleaned[start];
  const closeChar = openChar === "[" ? "]" : "}";
  const end = cleaned.lastIndexOf(closeChar);
  if (end === -1 || end < start) throw new Error("No JSON end");
  cleaned = cleaned.substring(start, end + 1);

  const attempts = [
    (s: string) => s,
    (s: string) =>
      s
        .replace(/,\s*}/g, "}")
        .replace(/,\s*]/g, "]")
        .replace(/[\x00-\x1F\x7F]/g, " "),
    (s: string) => repair(s),
  ];
  let lastErr: unknown;
  for (const fn of attempts) {
    try {
      return JSON.parse(fn(cleaned));
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

function repair(s: string): string {
  let braces = 0, brackets = 0, inStr = false, esc = false;
  for (const ch of s) {
    if (esc) { esc = false; continue; }
    if (ch === "\\") { esc = true; continue; }
    if (ch === '"') { inStr = !inStr; continue; }
    if (inStr) continue;
    if (ch === "{") braces++;
    else if (ch === "}") braces--;
    else if (ch === "[") brackets++;
    else if (ch === "]") brackets--;
  }
  let out = s
    .replace(/,\s*}/g, "}")
    .replace(/,\s*]/g, "]")
    .replace(/[\x00-\x1F\x7F]/g, " ");
  if (inStr) out += '"';
  // Trim trailing incomplete item after last comma if any
  out = out.replace(/,\s*[^,{}\[\]]*$/, "");
  while (brackets-- > 0) out += "]";
  while (braces-- > 0) out += "}";
  return out;
}

export function safeParseItems<T>(content: string): { items: T[] } {
  try {
    const obj = extractJson(content) as { items?: T[] };
    return { items: Array.isArray(obj?.items) ? obj.items : [] };
  } catch (e) {
    console.error("safeParseItems failed:", String(e).slice(0, 200), "content head:", content.slice(0, 200));
    return { items: [] };
  }
}
