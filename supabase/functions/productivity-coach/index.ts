import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { callGemini } from "../_shared/gemini.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { mode, remainingHours, productivityPercent, plannedHours, actualHours, hasStarted, currentSlot } = await req.json();

    let prompt = "";

    if (mode === "motivate") {
      prompt = `You are a tough-love Indian productivity coach speaking in Hinglish. The student has ${remainingHours} study hours left today. They have completed ${productivityPercent}% of their planned work. They ${hasStarted ? "have started studying" : "have NOT started studying yet"}. Current slot: ${currentSlot}.

Generate a short, punchy motivational message (2-3 lines max). Be direct, action-oriented. Push them to act NOW. No fluff. Examples of tone:
- "It takes only 10 minutes to reach the library. Why are you still sitting?"
- "You still have 4 hours. This day is not lost."
- "Underconfidence is stopping you, not your ability."

Give ONLY the motivational message, nothing else.`;
    } else {
      prompt = `You are a productivity coach. The student planned ${plannedHours} hours today and actually studied ${actualHours} hours (${productivityPercent}% completion).

Generate a brief daily reflection:
- Line 1-2: Performance review (honest but not harsh)
- Line 3: One specific improvement suggestion
- Line 4: One motivational closing line

Keep it in Hinglish. Be concise. Give ONLY the reflection, nothing else.`;
    }

    const res = await callGemini({
      model: "gemini-2.5-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9,
      max_tokens: 200,
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Gemini error:", res.status, errText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    const message = data.choices?.[0]?.message?.content?.trim() || "Keep pushing. Every minute counts.";

    return new Response(JSON.stringify({ message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("productivity-coach error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
