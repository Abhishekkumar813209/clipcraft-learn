import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pageText } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    if (!pageText || typeof pageText !== "string" || pageText.trim().length < 20) {
      return new Response(
        JSON.stringify({ entries: [], message: "Text too short to extract vocabulary." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are an expert linguistic parser and data extractor.

You will be given raw text extracted from a vocabulary book PDF. The text may be messy, contain broken formatting, tables, extra symbols, inconsistent spacing, or OCR errors.

Your task is to clean, interpret, and extract structured vocabulary data.

CRITICAL RULE — STRICT ROOT-TO-WORD MAPPING:
- Each word MUST ONLY be assigned to the root it appears next to in the original table/list/row in the source material.
- Do NOT infer or guess roots from word prefixes. Only use the root explicitly shown in the source.
- If a word appears in a row/section with root "AB", it goes under "AB" — even if the word also starts with "ABS" or "AD".
- Preserve the EXACT grouping from the source material. Do not reorganize or re-assign words.
- When in doubt, keep the word under the root it was listed with in the original text.

OBJECTIVE:
- Identify the ROOT word (if present) — use exactly what is shown in the source.
- Extract the ROOT meaning exactly as given.
- Extract all valid English words listed under that root.

Ignore noise such as: page numbers, headings unrelated to vocabulary, table borders or formatting symbols, incomplete or broken words, duplicate entries.

UNDERSTANDING RULES:
- Root words are usually short (2–5 letters) like: AB, AD, BEN, MAL
- Root meaning is usually given near the root (e.g., "AD = towards")
- Words may appear in bullet lists, tables, comma-separated format, or line-by-line format
- If NO root is clearly present, set root to null, still extract words alphabetically

CLEANING RULES:
- Remove special characters: |, —, _, extra punctuation
- Fix spacing issues
- Convert all words to lowercase
- Remove duplicates
- Keep only valid English words (ignore random fragments)

WORD VALIDATION:
- A valid word should contain only alphabets, be at least 3 characters long
- Not be a number or symbol
- Not be a heading like "Exercise", "Chapter", etc.

EXTRA RULES:
- Sort words alphabetically within each entry
- Ensure no duplicates within each root entry
- Each entry should have one root (or null) with its associated words
- Do NOT merge entries from different roots — keep them separate even if roots look similar`;

    const response = await fetch(AI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Extract all vocabulary words from this text:\n\n${pageText}` },
        ],
        tools: [{
          type: "function",
          function: {
            name: "extract_vocabulary",
            description: "Extract structured vocabulary entries with roots and words from text",
            parameters: {
              type: "object",
              properties: {
                entries: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      root: { type: "string", description: "The root word (lowercase, 2-5 chars), or null if none" },
                      root_meaning: { type: "string", description: "Meaning of the root word, or null" },
                      words: {
                        type: "array",
                        items: { type: "string" },
                        description: "List of valid English words associated with this root, lowercase, sorted alphabetically",
                      },
                    },
                    required: ["words"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["entries"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "extract_vocabulary" } },
        stream: false,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const t = await response.text();
      console.error("AI error:", status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      const entries = (parsed.entries || []).filter((e: any) => Array.isArray(e.words) && e.words.length > 0);
      return new Response(JSON.stringify({ entries }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ entries: [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ssc-vocab-extract error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
