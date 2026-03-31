import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { weakQuestions, language } = await req.json();

    if (!weakQuestions || !Array.isArray(weakQuestions) || weakQuestions.length === 0) {
      return new Response(JSON.stringify({ error: "weakQuestions array is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const lang = language || "english";
    const questionsContext = weakQuestions.map((q: any, i: number) =>
      `${i + 1}. [Type: ${q.type}] ${q.question}\n   Correct Answer: ${q.correctAnswer}${q.options ? `\n   Options: ${q.options.join(', ')}` : ''}`
    ).join('\n');

    const systemPrompt = `You are an expert question paper setter. Given a set of questions that a student got wrong or didn't attempt, analyze the topics/concepts tested and generate NEW practice questions on those same topics.

Rules:
- Generate 3-5 additional questions per distinct topic area identified
- Match the question types (mcq, true_false, fill_blank, short, multiple_correct) from the original questions
- For MCQ questions, always provide exactly 4 options
- For multiple_correct questions, provide 4 options and specify multiple correct answers separated by commas
- For true_false, the correctAnswer must be "True" or "False"
- Make questions slightly different in wording but testing the same concepts
- Language: ${lang}
- Questions should be at similar difficulty level

You MUST respond with a valid JSON array of question objects. Each object must have:
- "question": string (the question text)
- "type": "mcq" | "true_false" | "fill_blank" | "short" | "multiple_correct"
- "options": string[] (only for mcq and multiple_correct, exactly 4 options)
- "correctAnswer": string

Return ONLY the JSON array, no other text.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Here are the questions the student struggled with:\n\n${questionsContext}\n\nGenerate additional practice questions on the same topics. Return a JSON array only.` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content || "";

    // Parse JSON from the response (handle markdown code blocks)
    let parsed;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      console.error("Failed to parse AI response:", content);
      return new Response(JSON.stringify({ error: "Failed to parse AI response", questions: [] }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ questions: parsed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-weak-area-questions error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
