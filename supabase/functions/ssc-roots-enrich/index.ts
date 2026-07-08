import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { callGemini } from "../_shared/gemini.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const BATCH = 20;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") || "";
    const url = Deno.env.get("SUPABASE_URL")!;
    const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
    const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify caller is admin
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

    // Fetch a batch of rows without hindi_meaning
    const { data: rows, error } = await admin
      .from("ssc_root_words")
      .select("id, word, definition, root, root_meaning")
      .is("hindi_meaning", null)
      .limit(BATCH);
    if (error) throw error;

    if (!rows || rows.length === 0) {
      const { count } = await admin
        .from("ssc_root_words")
        .select("*", { count: "exact", head: true });
      return new Response(JSON.stringify({ processed: 0, remaining: 0, total: count }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const list = rows.map((r) => ({
      id: r.id,
      word: r.word,
      definition: r.definition || "",
      root: r.root,
      root_meaning: r.root_meaning || "",
    }));

    const prompt = `You are a Hindi linguist writing SSC study material.
For each English word below, produce:
1. "hindi_meaning": ONE concise line in pure Devanagari Hindi (no romanized/Hinglish). Describe the meaning naturally (like a dictionary), not "matlab hai" filler.
2. "example": ONE natural English sentence that actually uses the word. NEVER mention committee, manager, professor, novel, team, meeting — use varied fresh contexts (nature, daily life, science, travel, emotions, sports, history, etc.).

Input JSON:
${JSON.stringify(list)}

Return STRICT JSON only, no prose:
{"items":[{"id":123,"hindi_meaning":"...","example":"..."}]}`;

    const res = await callGemini({
      model: "gemini-2.5-flash",
      messages: [
        { role: "system", content: "You output only valid JSON." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    if (!res.ok) {
      const txt = await res.text();
      return new Response(JSON.stringify({ error: "AI failed", detail: txt.slice(0, 500) }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const json = await res.json();
    const content = json.choices?.[0]?.message?.content || "{}";
    const parsed = safeParseItems<{ id: number; hindi_meaning: string; example: string }>(content);

    let updated = 0;
    for (const it of parsed.items || []) {
      if (!it.id) continue;
      const { error: uErr } = await admin
        .from("ssc_root_words")
        .update({ hindi_meaning: it.hindi_meaning || null, example: it.example || null })
        .eq("id", it.id);
      if (!uErr) updated++;
    }

    const { count: remaining } = await admin
      .from("ssc_root_words")
      .select("*", { count: "exact", head: true })
      .is("hindi_meaning", null);

    return new Response(
      JSON.stringify({ processed: updated, batch: rows.length, remaining: remaining || 0 }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
