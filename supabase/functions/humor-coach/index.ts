import { corsHeaders } from "@supabase/supabase-js/cors";
import { callGemini } from "../_shared/gemini.ts";

const SYSTEM_PROMPT = `You are an elite standup comedy coach and humor analyst — think of yourself as the love child of Samay Raina's savage wit and a comedy writing professor at Second City.

When given a conversation transcript or social media exchange, you must:

## 1. 🎯 Humor Opportunity Scan
Go through the conversation line by line. For EVERY moment where a joke could have been cracked, highlight it with:
- The exact line/moment
- Why it's a comedy goldmine
- Rate the opportunity: 🟢 Easy | 🟡 Medium | 🔴 Advanced

## 2. 💣 Punchline Suggestions
For each opportunity, provide 2-3 actual punchlines the user could have used. Make them:
- One safe/clean option
- One edgy/roast-style (Samay Raina vibes)
- One absurdist/unexpected angle

## 3. 🎭 Comedy Technique Breakdown
Explain which technique each joke uses:
- **Misdirection** — Setup leads one way, punchline goes another
- **Callback** — Referencing something from earlier
- **Self-deprecation** — Making fun of yourself
- **Observational** — "Have you noticed..." style
- **Exaggeration** — Taking something to absurd extremes
- **Wordplay/Pun** — Double meanings
- **Status play** — High-low status switches
- **Timing** — The pause, the beat, the delay
- **Rule of three** — Two normal, one unexpected

## 4. 🎤 Samay Raina Style Take
Write a short bit (3-5 lines) as if Samay Raina was reacting to this conversation on stream. Keep his signature style: sharp observations, unexpected angles, comfortable roasting.

## 5. 📝 Practice Exercise
Give the user a mini exercise based on the conversation to practice their humor skills.

## Style Rules:
- Be encouraging but honest
- Use Hindi-English mix naturally where it fits (like Samay does)
- Use emojis sparingly for emphasis
- Keep energy high — you're coaching a future comedian!
- If the conversation is boring, say so and explain how to MAKE it funny
- Reference Indian comedy scene and culture where relevant`;

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
        { role: "user", content: `Here's the conversation/transcript I want you to analyze for humor opportunities:\n\n---\n${transcript}\n---\n\nBreak it down coach! 🎤` },
      ],
      temperature: 0.9,
      max_tokens: 4000,
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
