import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { callGemini } from "../_shared/gemini.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const CHUNK_CHARS = 12000;

async function ai(system: string, user: string): Promise<string> {
  const res = await callGemini(
    {
      model: "gemini-2.5-flash",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.3,
      max_tokens: 8000,
    },
    { stripToolsForHF: true },
  );
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`AI ${res.status}: ${t.slice(0, 200)}`);
  }
  const json = await res.json();
  return String(json?.choices?.[0]?.message?.content ?? "").trim();
}

const BASE_RULES = `Language: simple Hinglish (Roman script), technical terms English me.
Markdown use karo: "## " subheadings, "### " sub-subheadings, chhote paragraphs + bullets.
Sirf diya gaya content use karo — naya unverified fact mat jodo.
Koi preamble/meta line mat likho, seedha content do.`;

function splitChunks(md: string): string[] {
  const parts = md.split(/\n(?=## )/g);
  const out: string[] = [];
  let cur = "";
  for (const p of parts) {
    if ((cur + p).length > CHUNK_CHARS && cur) {
      out.push(cur);
      cur = p;
    } else {
      cur += (cur ? "\n" : "") + p;
    }
  }
  if (cur.trim()) out.push(cur);
  return out;
}

const TIME_BUDGET_MS = 90_000;

interface DedupeState { index: number; outline: string[]; acc: string[] }

async function dedupeStep(
  title: string,
  md: string,
  state: DedupeState,
  startedAt: number,
): Promise<{ done: boolean; state: DedupeState; md: string; total: number }> {
  const chunks = splitChunks(md);
  let i = state.index;
  while (i < chunks.length) {
    if (i > state.index && Date.now() - startedAt > TIME_BUDGET_MS) break;
    const user = `Topic: ${title}
Yeh theory ka part ${i + 1}/${chunks.length} hai. Ise ek clean, non-repetitive book chapter section me rewrite karo.

${state.outline.length ? `PEHLE SE COVER HO CHUKE POINTS (inko dobara mat likho):\n${state.outline.join("\n")}` : "Yeh pehla part hai."}

--- CONTENT ---
${chunks[i]}
--- END ---

Rules:
${BASE_RULES}
- Duplicate facts, repeated headings aur repeated examples hata do.
- Related facts ko merge karke logical order me rakho.
- Har fact ka information loss nahi hona chahiye — sirf repetition hatani hai.`;
    const out = await ai(
      "Tum ek SSC/competitive exam faculty ho jo repetitive AI notes ko clean, book-jaisi theory me convert karta hai.",
      user,
    );
    if (out) {
      state.acc.push(out);
      state.outline.push(
        ...out.split("\n").filter((l) => l.startsWith("#")).map((l) => `- ${l.replace(/^#+\s*/, "")}`),
      );
    }
    i++;
  }
  state.index = i;
  return {
    done: i >= chunks.length,
    state,
    md: `# ${title}\n\n${state.acc.join("\n\n")}`,
    total: chunks.length,
  };
}

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
      mode?: "dedupe" | "split" | "merge";
      subject?: string;
      chapter?: string;
      subtopic?: string;
      state?: DedupeState;
      chunkIndex?: number;
    };
    const mode = body.mode || "dedupe";
    const subject = body.subject;
    const chapter = body.chapter;
    const subtopic = (body.subtopic || "").trim();
    if (!subject || !chapter) {
      return new Response(JSON.stringify({ error: "subject and chapter required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const startedAt = Date.now();
    const admin = createClient(url, service);
    const table = admin.from("ssc_chapter_theory");

    const save = async (sub: string, md: string, qCount: number) => {
      const { error } = await admin.from("ssc_chapter_theory").upsert(
        {
          subject,
          chapter,
          subtopic: sub,
          theory_md: md,
          question_count: qCount,
          generated_at: new Date().toISOString(),
        },
        { onConflict: "subject,chapter,subtopic" },
      );
      if (error) throw error;
    };

    if (mode === "dedupe") {
      const { data: row } = await table
        .select("theory_md,question_count")
        .eq("subject", subject).eq("chapter", chapter).eq("subtopic", subtopic)
        .maybeSingle();
      if (!row?.theory_md) {
        return new Response(JSON.stringify({ error: "Theory not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const title = subtopic ? `${chapter} — ${subtopic}` : chapter;
      const state: DedupeState = body.state ?? { index: 0, outline: [], acc: [] };
      const r = await dedupeStep(title, String(row.theory_md), state, startedAt);
      if (r.done) await save(subtopic, r.md, Number(row.question_count) || 0);
      return new Response(
        JSON.stringify({
          ok: true,
          done: r.done,
          chars: r.md.length,
          progress: `${r.state.index}/${r.total}`,
          state: r.done ? undefined : r.state,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (mode === "split") {
      // chapter theory -> ek subtopic ki theory nikaalo
      if (!subtopic) {
        return new Response(JSON.stringify({ error: "subtopic required for split" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data: chRow } = await table
        .select("theory_md")
        .eq("subject", subject).eq("chapter", chapter).eq("subtopic", "")
        .maybeSingle();
      if (!chRow?.theory_md) {
        return new Response(JSON.stringify({ error: "Chapter theory not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { count } = await admin
        .from("ssc_chapter_questions")
        .select("id", { count: "exact", head: true })
        .eq("subject", subject).eq("chapter", chapter).eq("subtopic", subtopic);

      const chunks = splitChunks(String(chRow.theory_md));
      const picked: string[] = body.state?.acc ?? [];
      const start = body.state?.index ?? 0;
      let i = start;
      for (; i < chunks.length; i++) {
        if (i > start && Date.now() - startedAt > TIME_BUDGET_MS) break;
        const out = await ai(
          "Tum ek SSC faculty ho jo bade chapter notes ko subtopic-wise clean notes me todta hai.",
          `Chapter: ${chapter}
Subtopic: ${subtopic}
Yeh chapter theory ka part ${i + 1}/${chunks.length} hai. Isme se SIRF "${subtopic}" se related content nikaal ke clean theory ke roop me likho.
Agar is part me is subtopic ka koi content nahi hai to sirf "NONE" likho.

--- CONTENT ---
${chunks[i]}
--- END ---

Rules:
${BASE_RULES}`,
        );
        if (out && out.trim().toUpperCase() !== "NONE") picked.push(out);
      }
      if (i < chunks.length) {
        return new Response(
          JSON.stringify({
            ok: true,
            done: false,
            progress: `${i}/${chunks.length}`,
            state: { index: i, outline: [], acc: picked },
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (!picked.length) {
        return new Response(JSON.stringify({ ok: true, done: true, skipped: true, note: "no matching content" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const md = `# ${chapter} — ${subtopic}\n\n${picked.join("\n\n")}`;
      await save(subtopic, md, count || 0);
      return new Response(JSON.stringify({ ok: true, done: true, chars: md.length }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // merge: subtopic theories -> chapter theory
    const { data: subRows } = await table
      .select("subtopic,theory_md,question_count")
      .eq("subject", subject).eq("chapter", chapter)
      .neq("subtopic", "");
    const rows = (subRows as { subtopic: string; theory_md: string; question_count: number }[]) || [];
    if (!rows.length) {
      return new Response(JSON.stringify({ error: "No subtopic theory found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    rows.sort((a, b) => a.subtopic.localeCompare(b.subtopic));
    const combined = rows
      .map((r) => `## ${r.subtopic}\n\n${String(r.theory_md).replace(/^#\s.*\n/, "").trim()}`)
      .join("\n\n");
    const mState: DedupeState = body.state ?? { index: 0, outline: [], acc: [] };
    const mr = await dedupeStep(chapter, combined, mState, startedAt);
    if (mr.done) {
      await save("", mr.md, rows.reduce((n, r) => n + (Number(r.question_count) || 0), 0));
    }
    return new Response(
      JSON.stringify({
        ok: true,
        done: mr.done,
        chars: mr.md.length,
        merged: rows.length,
        progress: `${mr.state.index}/${mr.total}`,
        state: mr.done ? undefined : mr.state,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("ssc-theory-refine error", e);
    return new Response(JSON.stringify({ error: String(e).slice(0, 400) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
