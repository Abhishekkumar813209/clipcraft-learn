import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { callGemini } from "../_shared/gemini.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const BATCH = 30;

interface Row {
  serial_no: number;
  chapter: string;
  subtopic: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  explanation_hinglish: string | null;
}

function rowToText(r: Row, i: number): string {
  const parts = [`### Q${i}. ${r.question_text}`];
  parts.push(
    `A) ${r.option_a} | B) ${r.option_b} | C) ${r.option_c} | D) ${r.option_d}`,
  );
  parts.push(`Correct: ${r.correct_option}`);
  if (r.explanation_hinglish) parts.push(`Explanation: ${r.explanation_hinglish}`);
  if (r.subtopic) parts.push(`Subtopic: ${r.subtopic}`);
  return parts.join("\n");
}

const SYSTEM =
  `Tum ek SSC/competitive exam faculty ho jo NCERT-style chapter theory likhta hai, poori Hinglish (Roman script) me.

RULES (strictly follow):
- Sirf diye gaye questions, unke correct answers aur explanations se hi content banao. Apni taraf se galat ya naya unverified fact mat jodo.
- Output ek book chapter jaisa flowing THEORY hona chahiye — "Q1, Q2" style bilkul nahi. Facts ko logical order me re-arrange karo.
- Markdown: "## " main subheadings, "### " sub-subheadings, chhote paragraphs + bullet points.
- Maximum 2-3 markdown tables poore chapter me (classification/values type data). Baaki text + bullets.
- Language: simple Hinglish (Roman). Technical terms English me.
- Exam-relevant keywords bold karo (**...**).
- Koi preamble mat likho — seedha content se shuru karo.`;

async function generateSection(
  title: string,
  subject: string,
  partNo: number,
  totalParts: number,
  block: string,
): Promise<string> {
  const userPrompt = `Subject: ${subject}
Topic: ${title}
Yeh topic ke questions ka part ${partNo}/${totalParts} hai.

${totalParts > 1 ? "Sirf is part ke content ki theory likho (intro/outro dobara mat likho agar part 1 nahi hai)." : ""}
${partNo === totalParts ? 'Sabse aakhir me "## Yaad Rakhne Wale Points" naam ka chhota bullet block do (max 10 bullets).' : ""}

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
      subject?: string;
      chapter?: string;
      subtopic?: string;
      force?: boolean;
      /** chunked mode: question offset to start from */
      offset?: number;
      /** chunked mode: how many questions this call should cover (default all) */
      limit?: number;
      /** chunked mode: append output to existing theory instead of replacing */
      append?: boolean;
    };
    const subject = body.subject;
    const chapter = body.chapter;
    const subtopic = (body.subtopic || "").trim();
    if (!subject || !chapter) {
      return new Response(JSON.stringify({ error: "subject and chapter required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(url, service);

    const { data: existingRow } = await admin
      .from("ssc_chapter_theory")
      .select("id,theory_md,question_count")
      .eq("subject", subject)
      .eq("chapter", chapter)
      .eq("subtopic", subtopic)
      .maybeSingle();

    if (!body.force && !body.append && existingRow) {
      return new Response(JSON.stringify({ ok: true, skipped: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const offset = Math.max(0, Number(body.offset) || 0);
    const limit = body.limit && body.limit > 0 ? Math.min(Number(body.limit), 500) : 0;

    const rows: Row[] = [];
    const PAGE = 500;
    const hardEnd = limit ? offset + limit : Infinity;
    for (let off = offset; off < hardEnd; off += PAGE) {
      const take = Math.min(PAGE, hardEnd - off);
      let q = admin
        .from("ssc_chapter_questions")
        .select(
          "serial_no,chapter,subtopic,question_text,option_a,option_b,option_c,option_d,correct_option,explanation_hinglish",
        )
        .eq("subject", subject)
        .eq("chapter", chapter);
      if (subtopic) q = q.eq("subtopic", subtopic);
      const { data, error } = await q
        .order("serial_no", { ascending: true })
        .range(off, off + take - 1);
      if (error) throw error;
      const page = (data as Row[]) || [];
      rows.push(...page);
      if (page.length < take) break;
    }

    if (!rows.length) {
      return new Response(
        JSON.stringify({ ok: true, fetched: 0, hasMore: false, note: "no questions in this range" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const title = subtopic ? `${chapter} — ${subtopic}` : chapter;
    const blocks: string[] = [];
    for (let i = 0; i < rows.length; i += BATCH) {
      blocks.push(rows.slice(i, i + BATCH).map((r, j) => rowToText(r, offset + i + j + 1)).join("\n\n"));
    }

    const sections: string[] = [];
    for (let i = 0; i < blocks.length; i++) {
      const md = await generateSection(title, subject, i + 1, blocks.length, blocks[i]);
      if (md) sections.push(md);
      if (i < blocks.length - 1) await new Promise((r) => setTimeout(r, 600));
    }

    const fresh = sections.join("\n\n---\n\n");
    const prevMd = body.append && existingRow ? String(existingRow.theory_md || "") : "";
    const theory = prevMd
      ? `${prevMd}\n\n---\n\n${fresh}`
      : `# ${title}\n\n${fresh}`;
    const totalCount = (body.append && existingRow ? Number(existingRow.question_count) || 0 : 0) + rows.length;

    const { error: upErr } = await admin
      .from("ssc_chapter_theory")
      .upsert(
        {
          subject,
          chapter,
          subtopic,
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
        question_count: totalCount,
        fetched: rows.length,
        hasMore: limit ? rows.length === limit : false,
        nextOffset: offset + rows.length,
        parts: blocks.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("ssc-theory-generate error", e);
    return new Response(JSON.stringify({ error: String(e).slice(0, 400) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
