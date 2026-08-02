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
  global_serial: number;
  chapter_name: string;
  topic_tag: string | null;
  q_type: string;
  question_text: string;
  statements: string | null;
  list_i: string | null;
  list_ii: string | null;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  ncert_source: string | null;
  explanation_hinglish: string | null;
  why_a: string | null;
  why_b: string | null;
  why_c: string | null;
  why_d: string | null;
  ncert_extra: string | null;
}

function rowToText(r: Row, i: number): string {
  const parts = [`### Q${i}. ${r.question_text}`];
  if (r.statements) parts.push(`Statements: ${r.statements}`);
  if (r.list_i) parts.push(`List-I: ${r.list_i}`);
  if (r.list_ii) parts.push(`List-II: ${r.list_ii}`);
  parts.push(
    `A) ${r.option_a} | B) ${r.option_b} | C) ${r.option_c} | D) ${r.option_d}`,
  );
  parts.push(`Correct: ${r.correct_option}`);
  if (r.explanation_hinglish) parts.push(`Explanation: ${r.explanation_hinglish}`);
  const whys = [
    r.why_a ? `A: ${r.why_a}` : "",
    r.why_b ? `B: ${r.why_b}` : "",
    r.why_c ? `C: ${r.why_c}` : "",
    r.why_d ? `D: ${r.why_d}` : "",
  ].filter(Boolean);
  if (whys.length) parts.push(`Option analysis: ${whys.join(" ; ")}`);
  if (r.ncert_source) parts.push(`NCERT source: ${r.ncert_source}`);
  if (r.ncert_extra) parts.push(`NCERT extra: ${r.ncert_extra}`);
  return parts.join("\n");
}

const SYSTEM = `Tum ek UPSC faculty ho jo NCERT-style chapter theory likhta hai, poori Hinglish (Roman script) me.

RULES (strictly follow):
- Sirf diye gaye questions, unke correct answers, explanations, option-analysis aur NCERT extra points se hi content banao. Apni taraf se koi naya fact mat jodo.
- Output ek book chapter jaisa flowing THEORY hona chahiye — "Q1, Q2" style bilkul nahi. Facts ko re-arrange karke logical / chronological order me likho (jaise asli history/NCERT book me hota hai).
- Markdown use karo: "## " se bold main subheadings, "### " se sub-subheadings, chhote paragraphs + bullet points.
- Bahut kam visual charts: poore chapter me maximum 2-3 markdown tables (timeline, ruler-dynasty, list-I/list-II type data). Baaki text + bullets.
- Language: simple Hinglish (Roman). Technical terms English me rehne do.
- Exam-relevant keywords bold karo (**...**).
- Koi preamble ya "Here is the theory" jaisa line mat likho — seedha content se shuru karo.`;

async function generateSection(
  chapterName: string,
  subject: string,
  partNo: number,
  totalParts: number,
  block: string,
): Promise<string> {
  const userPrompt = `Subject: ${subject}
Chapter: ${chapterName}
Yeh chapter ke questions ka part ${partNo}/${totalParts} hai.

${totalParts > 1 ? "Sirf is part ke content ki theory likho (chapter ka intro/outro dobara mat likho, agar part 1 nahi hai)." : ""}
${partNo === totalParts ? 'Sabse aakhir me "## Yaad Rakhne Wale Points" naam ka ek chhota bullet block do (max 10 bullets).' : ""}

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
  const text = json?.choices?.[0]?.message?.content ?? "";
  return String(text).trim();
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
      chapter_no?: number;
      force?: boolean;
    };
    const subject = body.subject;
    const chapterNo = Number(body.chapter_no);
    if (!subject || !Number.isFinite(chapterNo)) {
      return new Response(JSON.stringify({ error: "subject and chapter_no required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(url, service);

    if (!body.force) {
      const { data: existing } = await admin
        .from("upsc_chapter_theory")
        .select("id")
        .eq("subject", subject)
        .eq("chapter_no", chapterNo)
        .maybeSingle();
      if (existing) {
        return new Response(JSON.stringify({ ok: true, skipped: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const rows: Row[] = [];
    const PAGE = 500;
    for (let offset = 0; ; offset += PAGE) {
      const { data, error } = await admin
        .from("upsc_questions")
        .select(
          "serial_no,global_serial,chapter_name,topic_tag,q_type,question_text,statements,list_i,list_ii,option_a,option_b,option_c,option_d,correct_option,ncert_source,explanation_hinglish,why_a,why_b,why_c,why_d,ncert_extra",
        )
        .eq("subject", subject)
        .eq("chapter_no", chapterNo)
        .order("serial_no", { ascending: true })
        .range(offset, offset + PAGE - 1);
      if (error) throw error;
      const page = (data as Row[]) || [];
      rows.push(...page);
      if (page.length < PAGE) break;
    }

    if (!rows.length) {
      return new Response(JSON.stringify({ error: "No questions for this chapter" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const chapterName = rows[0].chapter_name;
    const blocks: string[] = [];
    for (let i = 0; i < rows.length; i += BATCH) {
      blocks.push(rows.slice(i, i + BATCH).map((r, j) => rowToText(r, i + j + 1)).join("\n\n"));
    }

    const sections: string[] = [];
    for (let i = 0; i < blocks.length; i++) {
      const md = await generateSection(chapterName, subject, i + 1, blocks.length, blocks[i]);
      if (md) sections.push(md);
      if (i < blocks.length - 1) await new Promise((r) => setTimeout(r, 600));
    }

    const theory = `# ${chapterName}\n\n${sections.join("\n\n---\n\n")}`;

    const { error: upErr } = await admin
      .from("upsc_chapter_theory")
      .upsert(
        {
          subject,
          chapter_no: chapterNo,
          chapter_name: chapterName,
          theory_md: theory,
          question_count: rows.length,
          generated_at: new Date().toISOString(),
        },
        { onConflict: "subject,chapter_no" },
      );
    if (upErr) throw upErr;

    return new Response(
      JSON.stringify({ ok: true, chars: theory.length, question_count: rows.length, parts: blocks.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("upsc-theory-generate error", e);
    return new Response(JSON.stringify({ error: String(e).slice(0, 400) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
