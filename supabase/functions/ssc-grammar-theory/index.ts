import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { callGemini } from "../_shared/gemini.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUBJECT = "english_grammar";
const BATCH = 25;

interface Row {
  q_no: number;
  full_sentence: string;
  part_a: string;
  part_b: string;
  part_c: string;
  part_d: string;
  error_in: string;
  correct_form: string | null;
  rule_tag: string | null;
  hint: string | null;
  solution: string | null;
}

function rowToText(r: Row, _i: number): string {
  const parts = [`### Q${r.q_no}. ${r.full_sentence}`];
  parts.push(`A) ${r.part_a} | B) ${r.part_b} | C) ${r.part_c} | D) ${r.part_d}`);
  parts.push(`Answer: ${r.error_in}${r.correct_form ? ` → ${r.correct_form}` : ""}`);
  if (r.rule_tag) parts.push(`Rule: ${r.rule_tag}`);
  if (r.solution) parts.push(`Solution: ${r.solution}`);
  return parts.join("\n");
}

const SYSTEM =
  `Tum ek SSC English grammar faculty ho jo book-jaisi grammar theory likhta hai, poori Hinglish (Roman script) me.

RULES (strictly follow):
- Sirf diye gaye questions, unke answers aur solutions se hi rules banao — naya unverified rule mat jodo.
- Output ek grammar book ka chapter jaisa flowing THEORY ho — "Q1, Q2" style bilkul nahi.
- MAPPING ZARURI: har rule/sub-point ke heading ke turant baad ek line do:
  \`> Covers: Q12, Q45, Q78\` — usme wahi question numbers likho jo us rule se solve hote hain (data me diye gaye Q numbers hi use karo, apne se number mat banao).
- Har rule ke saath 1-2 short example sentences (questions se hi) do, example ke aage bracket me uska number likho jaise (Q45), aur galat vs sahi form dikhao.
- Har question number kam se kam ek rule me zaroor aana chahiye — koi question chhoot na jaye. Jo questions kisi bade rule me fit na ho, unke liye end me "## Miscellaneous / Mixed" section bana kar cover karo (waha bhi Covers line do).
- Markdown: "## " rule headings, "### " sub-points, bullets aur zaroorat par chhoti tables (max 3).
- Exam-relevant keywords/structures bold karo (**...**).
- Koi preamble mat likho — seedha content se shuru karo.`;

async function generateSection(
  title: string,
  partNo: number,
  totalParts: number,
  block: string,
  qNos: number[],
): Promise<string> {
  const userPrompt = `Grammar topic: ${title}
Yeh topic ke questions ka part ${partNo}/${totalParts} hai (serial-wise).
${totalParts > 1 ? "Sirf is part ke rules likho, pehle wale parts ka intro repeat mat karo." : ""}

Is part ke question numbers: ${qNos.join(", ")}
In sab numbers ko rules ki "> Covers:" lines me distribute karna hai — ek bhi number chhoota nahi chahiye.

--- QUESTIONS DATA ---
${block}
--- END DATA ---`;

  const res = await callGemini(
    {
      model: "gemini-2.5-flash",
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.4,
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
      pos?: string;
      offset?: number;
      limit?: number;
      append?: boolean;
      force?: boolean;
    };
    const pos = body.pos;
    if (!pos) {
      return new Response(JSON.stringify({ error: "pos required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(url, service);
    const { data: existingRow } = await admin
      .from("ssc_chapter_theory")
      .select("theory_md,question_count")
      .eq("subject", SUBJECT).eq("chapter", pos).eq("subtopic", "")
      .maybeSingle();

    if (existingRow && !body.append && !body.force) {
      return new Response(JSON.stringify({ ok: true, skipped: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const offset = Math.max(0, Number(body.offset) || 0);
    const limit = body.limit && body.limit > 0 ? Math.min(Number(body.limit), 200) : 100;

    const { data, error } = await admin
      .from("ssc_pos_spot_error")
      .select("q_no,full_sentence,part_a,part_b,part_c,part_d,error_in,correct_form,rule_tag,hint,solution")
      .eq("pos", pos)
      .order("q_no", { ascending: true })
      .range(offset, offset + limit - 1);
    if (error) throw error;
    const rows = (data as Row[]) || [];

    if (!rows.length) {
      return new Response(JSON.stringify({ ok: true, fetched: 0, hasMore: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const blocks: string[] = [];
    for (let i = 0; i < rows.length; i += BATCH) {
      blocks.push(rows.slice(i, i + BATCH).map((r, j) => rowToText(r, offset + i + j + 1)).join("\n\n"));
    }

    const sections: string[] = [];
    for (let i = 0; i < blocks.length; i++) {
      const md = await generateSection(pos, i + 1, blocks.length, blocks[i]);
      if (md) sections.push(md);
      if (i < blocks.length - 1) await new Promise((r) => setTimeout(r, 600));
    }

    const fresh = sections.join("\n\n---\n\n");
    const prevMd = body.append && existingRow ? String(existingRow.theory_md || "") : "";
    const theory = prevMd ? `${prevMd}\n\n---\n\n${fresh}` : `# ${pos}\n\n${fresh}`;
    const totalCount =
      (body.append && existingRow ? Number(existingRow.question_count) || 0 : 0) + rows.length;

    const { error: upErr } = await admin.from("ssc_chapter_theory").upsert(
      {
        subject: SUBJECT,
        chapter: pos,
        subtopic: "",
        theory_md: theory,
        question_count: totalCount,
        generated_at: new Date().toISOString(),
      },
      { onConflict: "subject,chapter,subtopic" },
    );
    if (upErr) throw upErr;

    return new Response(
      JSON.stringify({
        ok: true,
        chars: theory.length,
        fetched: rows.length,
        question_count: totalCount,
        hasMore: rows.length === limit,
        nextOffset: offset + rows.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("ssc-grammar-theory error", e);
    return new Response(JSON.stringify({ error: String(e).slice(0, 400) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
