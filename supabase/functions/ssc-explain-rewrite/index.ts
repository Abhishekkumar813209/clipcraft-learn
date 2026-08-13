import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { callGemini } from "../_shared/gemini.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/**
 * SSC chapter questions ke explanation_hinglish ko saaf, grammatically sahi
 * Hinglish me dobara likhta hai (batch wise, time-budgeted).
 */

interface Row {
  id: string;
  serial_no: number;
  chapter: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  explanation_hinglish: string | null;
}

const SYSTEM = `Tum SSC GK ke experienced teacher ho. Tumhe har question ka solution SAAF, SAHI GRAMMAR wali Hinglish (Roman script) me likhna hai.

RULES:
- Hinglish = simple Hindi sentence structure + English technical terms. Natural bolchaal jaisi, lekin grammatically correct. Tooti-phooti ya machine-translated language bilkul nahi.
- Har solution 2-4 line ka ho: (1) correct option kya hai aur kyu, (2) 1-2 supporting exam-worthy facts (saal, vyakti, jagah, act ka naam), (3) zarurat ho to baaki options me confusion clear karo.
- Sirf verified facts likho jo question/options/purane explanation se nikalte hain. Naya galat fact mat gadho.
- Koi markdown heading nahi, koi "Answer:" prefix nahi. Plain text, zaroorat ho to bullet "- " use kar sakte ho.
- Important keyword ko **bold** kar sakte ho (max 2-3 per solution).
- LaTeX ya $...$ bilkul mat use karo.

OUTPUT: sirf ek JSON array, aur kuch nahi:
[{"n": <question number>, "sol": "<rewritten hinglish solution>"}]`;

function qText(r: Row, n: number) {
  return `Q${n}. ${r.question_text}
A) ${r.option_a} | B) ${r.option_b} | C) ${r.option_c} | D) ${r.option_d}
Correct: ${r.correct_option}
Purana (kharab) solution: ${r.explanation_hinglish || "(nahi hai)"}`;
}

function parseJsonArray(txt: string): { n: number; sol: string }[] {
  let t = txt.trim().replace(/^```(json)?/i, "").replace(/```$/, "").trim();
  const s = t.indexOf("[");
  const e = t.lastIndexOf("]");
  if (s >= 0 && e > s) t = t.slice(s, e + 1);
  try {
    const arr = JSON.parse(t);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
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
      fromSerial?: number;
      toSerial?: number;
      batch?: number;
    };
    const subject = body.subject;
    if (!subject) {
      return new Response(JSON.stringify({ error: "subject required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const BATCH = Math.min(Math.max(5, Number(body.batch) || 10), 20);

    const admin = createClient(url, service);
    let q = admin
      .from("ssc_chapter_questions")
      .select(
        "id,serial_no,chapter,question_text,option_a,option_b,option_c,option_d,correct_option,explanation_hinglish",
      )
      .eq("subject", subject);
    if (body.chapter) q = q.eq("chapter", body.chapter);
    if (body.fromSerial) q = q.gte("serial_no", body.fromSerial);
    if (body.toSerial) q = q.lte("serial_no", body.toSerial);
    const { data, error } = await q.order("serial_no", { ascending: true }).limit(500);
    if (error) throw error;
    const rows = (data as Row[]) || [];
    if (!rows.length) {
      return new Response(JSON.stringify({ ok: true, updated: 0, done: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const started = Date.now();
    let updated = 0;
    let lastSerial = 0;
    let done = true;

    for (let i = 0; i < rows.length; i += BATCH) {
      if (Date.now() - started > 90_000) {
        done = false;
        break;
      }
      const chunk = rows.slice(i, i + BATCH);
      const prompt = chunk.map((r, j) => qText(r, i + j + 1)).join("\n\n");
      let out: { n: number; sol: string }[] = [];
      try {
        const res = await callGemini(
          {
            model: "gemini-2.5-flash",
            messages: [
              { role: "system", content: SYSTEM },
              { role: "user", content: `Chapter: ${chunk[0].chapter}\n\n${prompt}` },
            ],
            temperature: 0.3,
            max_tokens: 6000,
          },
          { stripToolsForHF: true, preferLovable: true },
        );
        if (res.ok) {
          const json = await res.json();
          out = parseJsonArray(String(json?.choices?.[0]?.message?.content ?? ""));
        }
      } catch (_e) {
        out = [];
      }

      for (const item of out) {
        const r = chunk[Number(item.n) - i - 1];
        const sol = String(item.sol || "").trim();
        if (!r || sol.length < 10) continue;
        const { error: uErr } = await admin
          .from("ssc_chapter_questions")
          .update({ explanation_hinglish: sol })
          .eq("id", r.id);
        if (!uErr) updated++;
      }
      lastSerial = chunk[chunk.length - 1].serial_no;
    }

    return new Response(
      JSON.stringify({ ok: true, updated, done, lastSerial, fetched: rows.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: String((e as Error).message || e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
