import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { callGemini } from "../_shared/gemini.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/**
 * Ek SSC GK/GS question ke chaaron options ke liye Hinglish reason banata hai
 * (kaunsa sahi kyu hai, baaki galat kyu) aur DB me cache kar deta hai.
 */
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = (await req.json()) as { id?: string };
    const id = (body.id || "").trim();
    if (!id) {
      return new Response(JSON.stringify({ error: "id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: q, error } = await supabase
      .from("ssc_chapter_questions")
      .select(
        "id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation_hinglish, why_a, why_b, why_c, why_d",
      )
      .eq("id", id)
      .maybeSingle();

    if (error || !q) {
      return new Response(JSON.stringify({ error: "question not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (q.why_a && q.why_b && q.why_c && q.why_d) {
      return new Response(
        JSON.stringify({
          ok: true,
          cached: true,
          why: { a: q.why_a, b: q.why_b, c: q.why_c, d: q.why_d },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const correct = String(q.correct_option || "").toLowerCase();
    const prompt = `Neeche ek SSC GK/GS MCQ hai. Har option (a, b, c, d) ke liye 1-2 line ka Hinglish reason likho:
- Sahi option: wo sahi kyu hai + ek supporting fact.
- Galat options: wo galat kyu hai, aur wo option asal me kis cheez se related hai (short fact).
Bilkul simple Hinglish (Roman script), koi LaTeX/markdown nahi.

Question: ${q.question_text}
a) ${q.option_a}
b) ${q.option_b}
c) ${q.option_c}
d) ${q.option_d}
Correct option: ${correct}
${q.explanation_hinglish ? `Existing explanation: ${q.explanation_hinglish}` : ""}

Sirf JSON return karo is shape me:
{"a":"...","b":"...","c":"...","d":"..."}`;

    const res = await callGemini(
      {
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      },
      { preferLovable: true },
    );

    if (!res.ok) {
      const t = await res.text();
      return new Response(JSON.stringify({ error: "AI failed", detail: t.slice(0, 300) }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const json = await res.json();
    const raw: string = json?.choices?.[0]?.message?.content ?? "";
    const match = raw.match(/\{[\s\S]*\}/);
    let why: Record<string, string> = {};
    try {
      why = JSON.parse(match ? match[0] : raw);
    } catch {
      return new Response(JSON.stringify({ error: "parse failed" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const clean = (v: unknown) => (typeof v === "string" ? v.trim().slice(0, 800) : null);
    const payload = {
      why_a: clean(why.a),
      why_b: clean(why.b),
      why_c: clean(why.c),
      why_d: clean(why.d),
    };

    await supabase.from("ssc_chapter_questions").update(payload).eq("id", id);

    return new Response(
      JSON.stringify({
        ok: true,
        cached: false,
        why: { a: payload.why_a, b: payload.why_b, c: payload.why_c, d: payload.why_d },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
