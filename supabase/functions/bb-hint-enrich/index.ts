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

type Mode = "fill" | "upgrade_hints" | "upgrade_hinglish";

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
    const { category = "idiom", subcategory = "all", mode = "fill" } = (await req.json().catch(() => ({}))) as {
      category?: "idiom" | "ows";
      subcategory?: string;
      mode?: Mode;
    };

    const isIdiom = category === "idiom";

    // Marker used in upgraded idiom hints — a " = " sign between scene + meaning
    const HINT_MARK = " = ";

    // Build query based on mode
    let q = admin
      .from("ssc_black_book_items")
      .select("id, prompt, answer, hinglish_meaning, english_meaning, example, hint")
      .eq("category", category)
      .eq("subcategory", subcategory);

    if (mode === "upgrade_hints") {
      // idioms only — rewrite hints into Hinglish "scene = meaning" style; skip already upgraded
      q = q.not("hint", "ilike", `%${HINT_MARK}%`);
    } else if (mode === "upgrade_hinglish") {
      // OWS all_repeated — descriptive hinglish; skip rows that already look descriptive (>= 25 chars)
      q = q.or("hinglish_meaning.is.null,hinglish_meaning.eq.");
      // We want to also grab short ones — do it with a second condition via filter chain:
      // supabase-js doesn't chain multiple .or easily; instead re-do with rpc-less filter:
    } else {
      // fill (default) — only rows missing hint
      q = q.is("hint", null);
    }

    // For upgrade_hinglish we want short-or-null hinglish. Simplest: fetch a broader set then filter in JS.
    if (mode === "upgrade_hinglish") {
      q = admin
        .from("ssc_black_book_items")
        .select("id, prompt, answer, hinglish_meaning, english_meaning, example, hint")
        .eq("category", category)
        .eq("subcategory", subcategory);
    }

    const { data: rawRows, error } = await q.limit(mode === "upgrade_hinglish" ? BATCH * 4 : BATCH);
    if (error) throw error;

    let rows = rawRows || [];
    if (mode === "upgrade_hinglish") {
      rows = rows
        .filter((r) => !r.hinglish_meaning || r.hinglish_meaning.trim().length < 25 || DEVANAGARI.test(r.hinglish_meaning))
        .slice(0, BATCH);
    }

    if (!rows || rows.length === 0) {
      return new Response(JSON.stringify({ processed: 0, remaining: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build mode-specific prompt
    let prompt = "";

    if (mode === "upgrade_hints" && isIdiom) {
      prompt = `You are rewriting SSC idiom HINTS in a fun, memorable "Literal Scene + Hinglish Meaning" format.

FORMULA: "<literal visual scene in Hinglish> = <what it actually means in Hinglish>"

Rules:
- Write in NATURAL Roman Hinglish (jaisa bolchaal me), NEVER Devanagari.
- Keep it 8–18 words total. Playful, relatable, exam-friendly.
- MUST contain " = " separating the literal scene from the real meaning.
- Do NOT repeat the exact English idiom or its direct English translation as the answer.
- The scene should hint at the meaning without giving the exact answer word.

Examples:
- "Beat around the bush" → "Bush ke around hi danda maar raha hai = seedhe mudde pe nahi aa raha"
- "Burn the midnight oil" → "Raat bhar tel jala raha hai = late night tak mehnat kar raha hai"
- "Hit the nail on the head" → "Keel ke sir par seedha hathoda = bilkul sahi baat pakdi"
- "Cry over spilt milk" → "Gira hua doodh dekh ke ro raha hai = jo ho gaya us par ab pachtana"
- "Bite the bullet" → "Goli daanton se dabaa raha hai = himmat karke mushkil kaam jhelna"

Input items (idiom + its meaning for your reference):
${JSON.stringify(rows.map((r) => ({ id: r.id, idiom: r.prompt, meaning: r.answer })))}

Return STRICT JSON: {"items":[{"id":"...","hint":"scene = meaning"}]}`;
    } else if (mode === "upgrade_hinglish" && !isIdiom) {
      prompt = `You are rewriting SSC OWS (one-word-substitution) Hinglish meanings to be more DESCRIPTIVE and natural.

Currently many rows have just 1–2 word Hindi translations. Make them descriptive Hinglish phrases (6–14 words) that BOTH:
1. Explain the definition/prompt in Hinglish (like the prompt column but in Hinglish), AND
2. Give a small hint toward the one-word answer.

Rules:
- NATURAL Roman Hinglish (bolchaal style), NEVER Devanagari.
- 6–14 words, casual, exam-friendly.
- Do NOT include the English answer word itself.
- Reflect BOTH the prompt definition and a subtle nudge to the answer.

Examples:
- prompt "A person who believes laws and governments are not necessary", answer "Anarchist" → "Wo vyakti jo maanta hai ki kanoon aur sarkar ki zarurat nahi, sab kuch mitade"
- prompt "Government by the wealthy", answer "Plutocracy" → "Aisi shasan vyavastha jisme sirf ameer log hi hukoomat karte hain"
- prompt "One who cannot make mistakes", answer "Infallible" → "Wo insaan jo kabhi galti nahi karta, hamesha sahi hi rehta hai"

Input items:
${JSON.stringify(rows.map((r) => ({ id: r.id, prompt: r.prompt, answer: r.answer, current_hinglish: r.hinglish_meaning || "" })))}

Return STRICT JSON: {"items":[{"id":"...","hinglish":"descriptive hinglish phrase"}]}`;
    } else {
      // fill mode — original combined enrich
      const label = isIdiom ? "idiom" : "one-word substitution (OWS)";
      const promptLabel = isIdiom ? "idiom" : "phrase / definition";
      const answerLabel = isIdiom ? "meaning" : "one word";

      prompt = `You are enriching SSC English ${label} data. For each item, return:
- "hint": for IDIOMS use format "<literal Hinglish scene> = <Hinglish meaning>" (8–18 words, Roman Hinglish, contains " = "). For OWS use a short 4–10 word English nudge (no answer word).
- "hinglish": NATURAL Roman Hinglish meaning, 6–14 words for OWS (descriptive, hints toward answer), 4–12 words for idioms. NEVER Devanagari.
- "english": SHORT proper ENGLISH meaning, 4–15 words. Pure English only.
${isIdiom ? `- "answer_fix": if current ${answerLabel} contains Hinglish, return corrected proper-English ${answerLabel}. Otherwise "".` : ""}

Rules:
- Output only Latin/Roman characters. No Devanagari.
- "english"${isIdiom ? ' and "answer_fix"' : ''} MUST be pure English.

Examples:
${isIdiom
  ? `Idiom "Beat around the bush" → {"hint":"Bush ke around hi danda maar raha hai = seedhe mudde pe nahi aa raha","hinglish":"seedhe mudde pe na aana, ghuma phira ke baat karna","english":"To avoid the main point","answer_fix":""}
Idiom "Have a ball" (answer "Bahut maza karna") → {"hint":"Ball ke saath khoob khel raha hai = full masti me hai","hinglish":"bahut maza karna, khoob enjoy karna","english":"To have great fun","answer_fix":"To have great fun"}`
  : `OWS prompt "Government by the wealthy" answer "Plutocracy" → {"hint":"Rule by rich people","hinglish":"aisi shasan vyavastha jisme sirf ameer log hukoomat karte hain","english":"Rule by the wealthy class"}`}

Input items:
${JSON.stringify(rows.map((r) => ({
  id: r.id,
  [promptLabel]: r.prompt,
  [answerLabel]: r.answer,
  current_english: r.english_meaning || "",
  current_hinglish: r.hinglish_meaning || "",
})))}

Return STRICT JSON: {"items":[{"id":"...","hint":"...","hinglish":"...","english":"..."${isIdiom ? ',"answer_fix":"..."' : ""}}]}`;
    }

    const res = await callGemini({
      model: "gemini-2.5-flash",
      messages: [
        { role: "system", content: "You output only valid JSON. Never use Devanagari characters." },
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
    const parsed = safeParseItems<{ id: string; hint?: string; hinglish?: string; english?: string; answer_fix?: string }>(content);

    let updated = 0;
    const byId = new Map(rows.map((r) => [r.id, r]));
    for (const it of parsed.items || []) {
      if (!it.id) continue;
      const src = byId.get(it.id);
      if (!src) continue;
      const patch: Record<string, string> = {};

      if (mode === "upgrade_hints") {
        if (it.hint && !DEVANAGARI.test(it.hint) && it.hint.includes("=")) {
          patch.hint = it.hint.trim();
        }
      } else if (mode === "upgrade_hinglish") {
        if (it.hinglish && !DEVANAGARI.test(it.hinglish) && it.hinglish.trim().length >= 15) {
          patch.hinglish_meaning = it.hinglish.trim();
        }
      } else {
        // fill
        if (!it.hint) continue;
        patch.hint = it.hint;
        if (it.hinglish && !DEVANAGARI.test(it.hinglish)) {
          if (!src.hinglish_meaning || DEVANAGARI.test(src.hinglish_meaning)) {
            patch.hinglish_meaning = it.hinglish;
          }
        }
        if (it.english && !DEVANAGARI.test(it.english)) {
          patch.english_meaning = it.english;
        }
        if (isIdiom && it.answer_fix && it.answer_fix.trim() && !DEVANAGARI.test(it.answer_fix)) {
          patch.answer = it.answer_fix.trim();
        }
      }

      if (Object.keys(patch).length === 0) continue;
      const { error: uErr } = await admin
        .from("ssc_black_book_items")
        .update(patch)
        .eq("id", it.id);
      if (!uErr) updated++;
    }

    // Remaining count for this mode
    let remaining = 0;
    if (mode === "upgrade_hints") {
      const { count } = await admin
        .from("ssc_black_book_items")
        .select("*", { count: "exact", head: true })
        .eq("category", category)
        .eq("subcategory", subcategory)
        .not("hint", "ilike", `%${HINT_MARK}%`);
      remaining = count || 0;
    } else if (mode === "upgrade_hinglish") {
      // approximate — count rows with null OR short hinglish
      const { data: rem } = await admin
        .from("ssc_black_book_items")
        .select("id, hinglish_meaning")
        .eq("category", category)
        .eq("subcategory", subcategory);
      remaining = (rem || []).filter((r) => !r.hinglish_meaning || r.hinglish_meaning.trim().length < 25 || DEVANAGARI.test(r.hinglish_meaning)).length;
    } else {
      const { count } = await admin
        .from("ssc_black_book_items")
        .select("*", { count: "exact", head: true })
        .eq("category", category)
        .eq("subcategory", subcategory)
        .is("hint", null);
      remaining = count || 0;
    }

    return new Response(JSON.stringify({ processed: updated, remaining }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
