import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { callGemini } from "../_shared/gemini.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { question, options, correctOption, userOption, topic } = await req.json();

    const correctAns = options?.[correctOption] || "N/A";
    const userAns = userOption >= 0 ? (options?.[userOption] || "Time up") : "Time up";

    const systemPrompt = `You are an expert TCS NQT exam tutor. For each question, provide:
1. **Concept**: Brief explanation of the underlying concept
2. **Step-by-step Solution**: Clear step-by-step approach to solve it
3. **Shortcut Method**: A faster way to solve similar questions in exams

Keep it concise but thorough. Use simple language suitable for competitive exam preparation.`;

    const userPrompt = `Topic: ${topic}
Question: ${question}
Options: ${options?.map((o: string, i: number) => `${String.fromCharCode(65 + i)}) ${o}`).join(', ')}
Correct Answer: ${correctAns}
Student's Answer: ${userAns}

Please explain this question with concept, step-by-step solution, and shortcut method.`;

    const response = await callGemini({
      model: "gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI error");
    }

    const data = await response.json();
    const explanation = data.choices?.[0]?.message?.content || "Could not generate explanation.";

    return new Response(JSON.stringify({ explanation }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("nqt-explain error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
