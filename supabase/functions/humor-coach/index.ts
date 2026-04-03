const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
import { callGemini } from "../_shared/gemini.ts";

const SYSTEM_PROMPT = `You are a witty Hinglish humor coach. When given a conversation or situation, respond with EXACTLY 10 numbered punchlines/comebacks the user could use.

Rules:
- Output ONLY 10 numbered punchlines (1-10)
- Each punchline should be a one-liner or max 2 lines
- Mix of safe, edgy, and absurdist styles
- Use natural Hinglish (Hindi-English mix)
- Make them actually funny — sharp, unexpected, clever
- No explanations, no difficulty ratings, no technique breakdowns
- No sections, no headers, no emojis in numbering
- Just: the 10 punchlines, numbered 1 to 10

Format:
1. [punchline]
2. [punchline]
...
10. [punchline]`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { transcript } = await req.json();

    if (!transcript || typeof transcript !== "string" || transcript.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: "Please provide a conversation transcript (at least 10 characters)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const geminiRes = await callGemini({
      model: "gemini-2.5-flash",
      stream: true,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Here's the conversation/situation:\n\n---\n${transcript}\n---\n\nGive me 10 punchlines!` },
      ],
      temperature: 0.9,
      max_tokens: 2000,
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini error:", errText);
      return new Response(
        JSON.stringify({ error: "AI service unavailable, please try again" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(geminiRes.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (e) {
    console.error("humor-coach error:", e);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
