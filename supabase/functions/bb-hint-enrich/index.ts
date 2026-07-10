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
const DEVANAGARI = /[\u0900-\u097F]/;

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
    const { category = "idiom", subcategory = "all" } = (await req.json().catch(() => ({}))) as {
      category?: "idiom" | "ows";
      subcategory?: string;
    };

    const { data: rows, error } = await admin
      .from("ssc_black_book_items")
      .select("id, prompt, answer, hinglish_meaning, english_meaning, example")
      .eq("category", category)
      .eq("subcategory", subcategory)
      .is("hint", null)
      .limit(BATCH);
    if (error) throw error;

    if (!rows || rows.length === 0) {
      return new Response(JSON.stringify({ processed: 0, remaining: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const isIdiom = category === "idiom";
    const label = isIdiom ? "idiom" : "one-word substitution (OWS)";
    const promptLabel = isIdiom ? "idiom" : "phrase / definition";
    const answerLabel = isIdiom ? "meaning" : "one word";

    const prompt = `You are enriching SSC English ${label} data. For each item, return:
- "hint": a SHORT 4–10 word English nudge helping a learner GUESS without revealing the answer. Never repeat the answer phrase. No "It means…". Optionally a tiny Hinglish nudge in brackets.
- "hinglish": NATURAL Roman Hinglish meaning, 4–12 words, casual bolchaal style (jaisa "bahut kam hota hai, kabhi kabhi hi"). If the input is in Devanagari, transliterate + naturalize into Hinglish. NEVER return Devanagari characters.
- "english": SHORT proper ENGLISH meaning, 4–15 words. Must be pure English (no Hindi/Hinglish words like "maza", "karna", "wala"). If the current answer/meaning is actually Hinglish (e.g. "Bahut maza karna"), rewrite it as proper English (e.g. "To have great fun").
${isIdiom ? `- "answer_fix": if the current ${answerLabel} contains Hinglish/Roman-Hindi words instead of proper English, return a corrected proper-English ${answerLabel} here. Otherwise return empty string "".` : ""}

Rules:
- Output only Latin/Roman characters.
- Keep everything terse and exam-focused.
- "english" and ${isIdiom ? '"answer_fix"' : '"english"'} MUST be pure English — zero Hindi/Hinglish tokens.

Examples:
${isIdiom
  ? `Idiom: "Bite the bullet", current answer "Face difficult situation with courage" → {"hint":"Face something painful with courage","hinglish":"himmat karke mushkil kaam karna","english":"Endure something difficult bravely","answer_fix":""}
Idiom: "Have a ball", current answer "Bahut maza karna" → {"hint":"Enjoy thoroughly, party hard","hinglish":"bahut maza karna, khoob enjoy karna","english":"To have great fun","answer_fix":"To have great fun"}`
  : `OWS: prompt "One who cannot make mistakes", answer "Infallible" → {"hint":"Someone who never goes wrong","hinglish":"jo kabhi galti nahi karta","english":"A person who never errs"}
OWS: prompt "Government by the wealthy", answer "Plutocracy" → {"hint":"Rule by rich people","hinglish":"ameeron dwara shasan","english":"Rule by the wealthy class"}`}

Input items:
${JSON.stringify(rows.map((r) => ({
  id: r.id,
  [promptLabel]: r.prompt,
  [answerLabel]: r.answer,
  current_english: r.english_meaning || "",
  current_hinglish: r.hinglish_meaning || "",
})))}

Return STRICT JSON only: {"items":[{"id":"...","hint":"...","hinglish":"...","english":"..."${isIdiom ? ',"answer_fix":"..."' : ""}}]}`;

    const res = await callGemini({
      model: "gemini-2.5-flash",
      messages: [
        { role: "system", content: "You output only valid JSON. Never use Devanagari characters." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
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
    const parsed = safeParseItems<{ id: string; hint: string; hinglish?: string; english?: string }>(content);
    let updated = 0;
    const byId = new Map(rows.map((r) => [r.id, r]));
    for (const it of parsed.items || []) {
      if (!it.id || !it.hint) continue;
      const src = byId.get(it.id);
      if (!src) continue;
      const patch: Record<string, string> = { hint: it.hint };
      // Fix hinglish if currently missing OR contains Devanagari
      if (it.hinglish && !DEVANAGARI.test(it.hinglish)) {
        if (!src.hinglish_meaning || DEVANAGARI.test(src.hinglish_meaning)) {
          patch.hinglish_meaning = it.hinglish;
        }
      }
      // Fix english_meaning if missing
      if (it.english && !src.english_meaning) {
        patch.english_meaning = it.english;
      }
      const { error: uErr } = await admin
        .from("ssc_black_book_items")
        .update(patch)
        .eq("id", it.id);
      if (!uErr) updated++;
    }
    const { count } = await admin
      .from("ssc_black_book_items")
      .select("*", { count: "exact", head: true })
      .eq("category", category)
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
