import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { callGemini } from "../_shared/gemini.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/**
 * SSC theory ko questions se map karta hai:
 *  - agar SSC theory nahi hai to UPSC theory ki COPY base bana leta hai (UPSC row bilkul unchanged rehta hai)
 *  - phir 100-question chunk lekar AI se poochta hai: kaun sa heading kaun se question numbers cover karta hai
 *  - headings ke neeche "> Covers: Q12, Q45" line add/merge karta hai + missing facts ke bullets jodta hai
 */

interface Q {
  serial_no: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  explanation_hinglish: string | null;
}

const UPSC_SUBJECT_FOR: Record<string, string> = {
  polity: "polity",
  economy: "economy",
  indian_geography: "geography",
  world_geography: "geography",
  ancient_history: "history",
  medieval_history: "history",
  modern_history: "history",
};

/** SSC chapter names → UPSC umbrella chapters (fuzzy match fail hota tha). */
const SSC_TO_UPSC_MAP: Record<string, Record<string, string>> = {
  polity: {
    "attorney general/comptroller and auditor general": "Constitutional and Non-Constitutional Bodies",
    "commission/committee": "Constitutional and Non-Constitutional Bodies",
    "constituent assembly": "Making of the Indian Constitution",
    "governor": "State Executive",
    "legislative assembly": "State Legislature",
    "legislative council": "State Legislature",
    "lok sabha": "Union Legislature",
    "rajya sabha": "Union Legislature",
    "parliament miscellaneous": "Union Legislature",
    "panchayat raj system": "Local Self Government",
    "president / vice-president": "Union Executive",
    "prime minister and council of ministers": "Union Executive",
    "sources of indian constitution": "Making of the Indian Constitution",
    "the preamble": "Salient Features of Indian Constitution and Preamble",
    "union and its territory": "Union and Its Territories",
  },
};

const norm = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length > 2);

function bestUpscMatch(
  chapter: string,
  rows: { chapter_name: string; theory_md: string }[],
): { chapter_name: string; theory_md: string; score: number } | null {
  const a = norm(chapter);
  let best: { chapter_name: string; theory_md: string; score: number } | null = null;
  for (const r of rows) {
    const b = norm(r.chapter_name);
    const hit = a.filter((w) => b.includes(w)).length;
    const score = hit / Math.max(1, Math.min(a.length, b.length));
    if (!best || score > best.score) best = { ...r, score };
  }
  return best && best.score >= 0.34 ? best : null;
}

/** LaTeX-ish junk (`$\text{X}$`, `\rightarrow`) ko plain text me badalta hai. */
function cleanMd(md: string): string {
  return md
    .replace(/\\text\s*\{([^}]*)\}/g, "$1")
    .replace(/\\mathrm\s*\{([^}]*)\}/g, "$1")
    .replace(/\\(rightarrow|to)\b/g, "→")
    .replace(/\\times\b/g, "×")
    .replace(/\\[,;!]/g, " ")
    .replace(/\$\$?([^$\n]{0,200}?)\$\$?/g, "$1")
    .replace(/\\\\/g, " ")
    .replace(/[ \t]{2,}/g, " ");
}

interface Heading {
  line: number;
  text: string;
}

function headingsOf(lines: string[]): Heading[] {
  const out: Heading[] = [];
  lines.forEach((l, i) => {
    if (/^#{2,3}\s+/.test(l)) out.push({ line: i, text: l.replace(/^#+\s*/, "").trim() });
  });
  return out;
}

const COVERS_RE = /^>\s*Covers:\s*(.*)$/i;

function mergeIntoMd(
  md: string,
  map: { h: number; title?: string; qs: number[] }[],
  addons: { h: number; title?: string; points: string[] }[],
): { md: string; merged: number } {
  const lines = md.split("\n");
  const heads = headingsOf(lines);
  if (!heads.length) return { md, merged: 0 };

  /** index invalid ho to heading title se resolve karo, warna pehli heading. */
  const resolve = (h: number, title?: string): number => {
    if (Number.isInteger(h) && heads[h]) return h;
    if (title) {
      const t = title.toLowerCase().trim();
      const exact = heads.findIndex((x) => x.text.toLowerCase().trim() === t);
      if (exact >= 0) return exact;
      const partial = heads.findIndex(
        (x) => x.text.toLowerCase().includes(t) || t.includes(x.text.toLowerCase()),
      );
      if (partial >= 0) return partial;
    }
    return 0;
  };

  const byHead = new Map<number, { qs: Set<number>; points: string[] }>();
  let merged = 0;
  for (const m of map) {
    const hi = resolve(m.h, m.title);
    const e = byHead.get(hi) ?? { qs: new Set<number>(), points: [] };
    for (const q of m.qs || []) {
      if (Number.isFinite(q)) {
        e.qs.add(Number(q));
        merged++;
      }
    }
    byHead.set(hi, e);
  }
  for (const a of addons) {
    const hi = resolve(a.h, a.title);
    const e = byHead.get(hi) ?? { qs: new Set<number>(), points: [] };
    for (const p of a.points || []) if (p && p.trim()) e.points.push(p.trim());

    byHead.set(a.h, e);
  }

  // Peeche se edit karo taaki line numbers shift na ho
  const idxs = [...byHead.keys()].sort((x, y) => y - x);
  for (const hi of idxs) {
    const e = byHead.get(hi)!;
    const at = heads[hi].line;
    let insertAt = at + 1;
    // existing covers line dhoondo (heading ke turant baad, blank lines skip)
    let scan = at + 1;
    while (scan < lines.length && lines[scan].trim() === "") scan++;
    let existing: number[] = [];
    if (scan < lines.length && COVERS_RE.test(lines[scan])) {
      existing = (lines[scan].match(COVERS_RE)![1].match(/\d+/g) || []).map(Number);
      lines.splice(scan, 1);
      insertAt = scan;
    } else {
      insertAt = at + 1;
    }
    const all = [...new Set([...existing, ...e.qs])].sort((a, b) => a - b);
    const block: string[] = [];
    if (all.length) block.push(`> Covers: ${all.map((n) => `Q${n}`).join(", ")}`, "");
    for (const p of e.points) block.push(`- ${cleanMd(p)}`);
    if (e.points.length) block.push("");
    lines.splice(insertAt, 0, ...block);
  }
  return lines.join("\n");
}

async function ai(system: string, user: string): Promise<string> {
  const res = await callGemini(
    {
      model: "gemini-2.5-flash",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.2,
      max_tokens: 4000,
    },
    { stripToolsForHF: true, preferLovable: true },
  );
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`AI ${res.status}: ${t.slice(0, 200)}`);
  }
  const json = await res.json();
  return String(json?.choices?.[0]?.message?.content ?? "").trim();
}

function parseJson(raw: string): { map: { h: number; qs: number[] }[]; addons: { h: number; points: string[] }[] } {
  const s = raw.replace(/```json|```/g, "").trim();
  const start = s.indexOf("{");
  const end = s.lastIndexOf("}");
  if (start < 0 || end < 0) return { map: [], addons: [] };
  try {
    const o = JSON.parse(s.slice(start, end + 1));
    return { map: Array.isArray(o.map) ? o.map : [], addons: Array.isArray(o.addons) ? o.addons : [] };
  } catch {
    return { map: [], addons: [] };
  }
}

const SYSTEM =
  `Tum ek SSC/UPSC faculty ho jo existing theory ko exam questions se map karta hai.
Sirf JSON output do, koi extra text nahi.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
    const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const authHeader = req.headers.get("Authorization") || "";

    const userClient = createClient(url, anon, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: isAdmin } = await userClient.rpc("is_admin");
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json().catch(() => ({}))) as {
      subject?: string;
      chapter?: string;
      subtopic?: string;
      offset?: number;
      limit?: number;
    };
    const subject = body.subject;
    const chapter = body.chapter;
    const subtopic = (body.subtopic || "").trim();
    const offset = Math.max(0, Number(body.offset) || 0);
    const limit = Math.min(Math.max(20, Number(body.limit) || 100), 150);

    if (!subject || !chapter) {
      return new Response(JSON.stringify({ error: "subject and chapter required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(url, service);

    // 1) base theory
    const { data: row } = await admin
      .from("ssc_chapter_theory")
      .select("theory_md,question_count")
      .eq("subject", subject).eq("chapter", chapter).eq("subtopic", subtopic)
      .maybeSingle();

    let md = String(row?.theory_md || "");
    let basis: "existing" | "upsc_copy" | "none" = row ? "existing" : "none";

    if (!md) {
      const upscSubject = UPSC_SUBJECT_FOR[subject];
      if (upscSubject) {
        const { data: upscRows } = await admin
          .from("upsc_chapter_theory")
          .select("chapter_name,theory_md")
          .eq("subject", upscSubject);
        const rows = (upscRows as { chapter_name: string; theory_md: string }[]) || [];
        const explicit = SSC_TO_UPSC_MAP[subject]?.[chapter.trim().toLowerCase()];
        const match =
          (explicit && rows.find((r) => r.chapter_name.trim().toLowerCase() === explicit.toLowerCase())) ||
          bestUpscMatch(chapter, rows);
        if (match) {
          md = `# ${chapter}\n\n_UPSC theory (${match.chapter_name}) par based, SSC questions ke hisaab se annotated._\n\n` +
            String(match.theory_md).replace(/^#\s.*\n/, "").trim();
          basis = "upsc_copy";
        }
      }
    }

    if (md) md = cleanMd(md);

    // 2) questions chunk (hamesha SSC bank se)
    let qq = admin
      .from("ssc_chapter_questions")
      .select("serial_no,question_text,option_a,option_b,option_c,option_d,correct_option,explanation_hinglish")
      .eq("subject", subject).eq("chapter", chapter);
    if (subtopic) qq = qq.eq("subtopic", subtopic);
    const { data: qData, error: qErr } = await qq
      .order("serial_no", { ascending: true })
      .range(offset, offset + limit - 1);
    if (qErr) throw qErr;
    const qs = (qData as Q[]) || [];

    if (!qs.length) {
      return new Response(
        JSON.stringify({ ok: true, hasMore: false, nextOffset: offset, mapped: 0, basis, chars: md.length }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // 2b) koi UPSC base nahi mila → SSC questions se hi fresh skeleton theory bana lo (skip nahi karenge)
    if (!md) {
      const seedBlock = qs
        .slice(0, 60)
        .map((q) => `Q${q.serial_no}: ${q.question_text}${q.explanation_hinglish ? ` | ${String(q.explanation_hinglish).slice(0, 200)}` : ""}`)
        .join("\n");
      const fresh = await ai(
        "Tum SSC faculty ho. Hinglish me exam-ready theory likho. Sirf markdown do.",
        `Chapter: ${chapter} (subject: ${subject}). Neeche SSC ke actual questions hain. Inhi se 5-10 "## " headings wali Hinglish theory banao (bullets, facts, dates). Koi LaTeX/$ nahi.\n\n${seedBlock}`,
      );
      md = cleanMd(`# ${chapter}\n\n${fresh.replace(/```/g, "").trim()}`);
      basis = "none";
    }


    // 3) headings outline
    const heads = headingsOf(md.split("\n"));
    if (!heads.length) {
      return new Response(JSON.stringify({ ok: false, error: "theory me koi ## heading nahi hai" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const outline = heads.map((h, i) => `${i}: ${h.text}`).join("\n");

    const qBlock = qs
      .map((q) => {
        const correct = { a: q.option_a, b: q.option_b, c: q.option_c, d: q.option_d }[
          q.correct_option.toLowerCase() as "a" | "b" | "c" | "d"
        ];
        return `Q${q.serial_no}: ${q.question_text}\nAns: ${correct ?? q.correct_option}${
          q.explanation_hinglish ? `\nExp: ${String(q.explanation_hinglish).slice(0, 300)}` : ""
        }`;
      })
      .join("\n\n");

    const user = `Chapter: ${chapter}${subtopic ? ` — ${subtopic}` : ""} (subject: ${subject})

THEORY HEADINGS (index: title):
${outline}

QUESTIONS (${qs.length}):
${qBlock}

Kaam:
1. Har question ko us heading index se map karo jiski theory us question ko solve karati hai. Har question exactly ek baar map hona chahiye (best fit heading).
2. Agar kisi question ka fact theory me bilkul nahi hai, to us heading ke liye "addons" me chhota Hinglish bullet do (max 25 words, plain text, koi LaTeX/$ nahi) jisme wo fact ho.

Output STRICT JSON:
{"map":[{"h":0,"qs":[12,15]}],"addons":[{"h":0,"points":["..."]}]}`;

    const raw = await ai(SYSTEM, user);
    const { map, addons } = parseJson(raw);

    const updated = mergeIntoMd(md, map, addons);
    const mapped = map.reduce((n, m) => n + (m.qs?.length || 0), 0);

    const { error: upErr } = await admin.from("ssc_chapter_theory").upsert(
      {
        subject,
        chapter,
        subtopic,
        theory_md: updated,
        question_count: Math.max(Number(row?.question_count) || 0, offset + qs.length),
        generated_at: new Date().toISOString(),
      },
      { onConflict: "subject,chapter,subtopic" },
    );
    if (upErr) throw upErr;

    return new Response(
      JSON.stringify({
        ok: true,
        basis,
        mapped,
        addons: addons.reduce((n, a) => n + (a.points?.length || 0), 0),
        fetched: qs.length,
        hasMore: qs.length === limit,
        nextOffset: offset + qs.length,
        chars: updated.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("ssc-theory-map error", e);
    return new Response(JSON.stringify({ error: String(e).slice(0, 400) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
