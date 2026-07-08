import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { callGemini } from "../_shared/gemini.ts";
import { safeParseItems } from "../_shared/json.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const WORD_BATCH = 40;

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
    const { mode = "words" } = (await req.json().catch(() => ({}))) as { mode?: "words" | "idioms" | "ows" };

    if (mode === "idioms" || mode === "ows") {
      // Translate answer -> hindi_meaning for rows missing it
      const { data: rows, error } = await admin
        .from("ssc_black_book_items")
        .select("id, prompt, answer, category")
        .eq("category", mode === "idioms" ? "idiom" : "ows")
        .is("hindi_meaning", null)
        .limit(30);
      if (error) throw error;
      if (!rows || rows.length === 0) {
        return new Response(JSON.stringify({ processed: 0, remaining: 0 }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const prompt = `Translate each English "answer" phrase to natural Hindi (Devanagari). Keep it short and dictionary-like.
Input:
${JSON.stringify(rows.map((r) => ({ id: r.id, prompt: r.prompt, answer: r.answer })))}
Return STRICT JSON: {"items":[{"id":"...","hindi":"..."}]}`;
      const res = await callGemini({
        model: "gemini-2.5-flash",
        messages: [
          { role: "system", content: "You output only valid JSON." },
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
      const parsed = safeParseItems<{ id: string; hindi: string }>(content);
      let updated = 0;
      for (const it of parsed.items || []) {
        if (!it.id || !it.hindi) continue;
        const { error: uErr } = await admin
          .from("ssc_black_book_items")
          .update({ hindi_meaning: it.hindi })
          .eq("id", it.id);
        if (!uErr) updated++;
      }
      const { count } = await admin
        .from("ssc_black_book_items")
        .select("*", { count: "exact", head: true })
        .eq("category", mode === "idioms" ? "idiom" : "ows")
        .is("hindi_meaning", null);
      return new Response(JSON.stringify({ processed: updated, remaining: count || 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // mode = "words": collect unique tokens missing from ssc_word_hindi
    const { data: bbItems } = await admin
      .from("ssc_black_book_items")
      .select("category, prompt, answer, synonyms, antonyms");
    const tokens = new Set<string>();
    const displayMap = new Map<string, string>();
    for (const it of bbItems || []) {
      const push = (s?: string | null) => {
        if (!s) return;
        const t = s.trim();
        if (!t) return;
        const k = t.toLowerCase();
        if (!displayMap.has(k)) displayMap.set(k, t);
        tokens.add(k);
      };
      if (it.category === "syn_ant") {
        push(it.prompt);
        (it.synonyms || []).forEach(push);
        (it.antonyms || []).forEach(push);
      }
    }
    // Skip tokens we already have
    const { data: existing } = await admin.from("ssc_word_hindi").select("word_key");
    const have = new Set((existing || []).map((r: { word_key: string }) => r.word_key));
    const pending = Array.from(tokens).filter((t) => !have.has(t));

    if (pending.length === 0) {
      return new Response(JSON.stringify({ processed: 0, remaining: 0, total: tokens.size }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const batch = pending.slice(0, WORD_BATCH);
    const prompt = `Translate each English word/phrase to short natural Hindi (Devanagari only). Give ONE meaning per item, dictionary-style.
Words:
${JSON.stringify(batch.map((k) => displayMap.get(k)))}
Return STRICT JSON: {"items":[{"word":"...","hindi":"..."}]}`;

    const res = await callGemini({
      model: "gemini-2.5-flash",
      messages: [
        { role: "system", content: "You output only valid JSON." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
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
    const parsed = safeParseItems<{ word: string; hindi: string }>(content);

    const upserts: { word_key: string; display: string; hindi: string; kind: string }[] = [];
    for (const it of parsed.items || []) {
      if (!it.word || !it.hindi) continue;
      const key = it.word.trim().toLowerCase();
      if (!key) continue;
      upserts.push({
        word_key: key,
        display: displayMap.get(key) || it.word,
        hindi: it.hindi,
        kind: it.word.includes(" ") ? "phrase" : "word",
      });
    }
    if (upserts.length) {
      const { error: uErr } = await admin
        .from("ssc_word_hindi")
        .upsert(upserts, { onConflict: "word_key" });
      if (uErr) throw uErr;
    }

    return new Response(
      JSON.stringify({
        processed: upserts.length,
        remaining: pending.length - batch.length,
        total: tokens.size,
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
