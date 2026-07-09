import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { callGemini } from "../_shared/gemini.ts";
import { safeParseItems } from "../_shared/json.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const BATCH = 25;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") || "";
    const url = Deno.env.get("SUPABASE_URL")!;
    const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
    const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

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

    const admin = createClient(url, service);
    const { subcategory = "all" } = (await req.json().catch(() => ({}))) as { subcategory?: string };

    const { data: rows, error } = await admin
      .from("ssc_black_book_items")
      .select("id, prompt, answer, hinglish_meaning, example")
      .eq("category", "idiom")
      .eq("subcategory", subcategory)
      .is("hint", null)
      .limit(BATCH);
    if (error) throw error;

    if (!rows || rows.length === 0) {
      return new Response(JSON.stringify({ processed: 0, remaining: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `You are writing SHORT hints for English idioms so that a learner can guess the meaning WITHOUT seeing the answer directly.

Rules for each hint:
- Length: 4 to 10 words only.
- Do NOT reveal or repeat the answer phrase or its literal translation.
- Nudge the learner: mention the emotion, situation, or context clue.
- Prefer plain English, optionally add a tiny Hinglish nudge in brackets if it helps.
- Never start with "It means" or "The idiom means".
- Never include the answer text.

Examples:
Idiom: "A blessing in disguise" → Hint: "Something bad that turned out good"
Idiom: "Bite the bullet" → Hint: "Face something painful with courage"
Idiom: "Once in a blue moon" → Hint: "Extremely rare event, kabhi kabhi hi"

Input idioms:
${JSON.stringify(rows.map((r) => ({ id: r.id, idiom: r.prompt, meaning: r.answer })))}

Return STRICT JSON only: {"items":[{"id":"...","hint":"..."}]}`;

    const res = await callGemini({
      model: "gemini-2.5-flash",
      messages: [
        { role: "system", content: "You output only valid JSON." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.6,
    });
    if (!res.ok) {
      const txt = await res.text();
      return new Response(JSON.stringify({ error: "AI failed", detail: txt.slice(0, 300) }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const json = await res.json();
    const content = json.choices?.[0]?.message?.content || "{}";
    const parsed = safeParseItems<{ id: string; hint: string }>(content);
    let updated = 0;
    for (const it of parsed.items || []) {
      if (!it.id || !it.hint) continue;
      const { error: uErr } = await admin
        .from("ssc_black_book_items")
        .update({ hint: it.hint })
        .eq("id", it.id);
      if (!uErr) updated++;
    }
    const { count } = await admin
      .from("ssc_black_book_items")
      .select("*", { count: "exact", head: true })
      .eq("category", "idiom")
      .eq("subcategory", subcategory)
      .is("hint", null);
    return new Response(JSON.stringify({ processed: updated, remaining: count || 0 }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
