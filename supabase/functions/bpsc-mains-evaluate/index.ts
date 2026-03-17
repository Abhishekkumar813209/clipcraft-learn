import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question_text, model_answer, user_answer, marks, word_limit } = await req.json();

    if (!question_text || !user_answer) {
      return new Response(JSON.stringify({ error: "question_text and user_answer required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are a BPSC Mains exam evaluator. Evaluate the candidate's answer for a descriptive question.

Rules:
- Score out of ${marks} marks
- Be strict but fair like a UPSC/BPSC examiner
- Evaluate on: Content Accuracy (40%), Structure & Organization (20%), Language & Expression (20%), Completeness (20%)
- ${word_limit ? `Word limit is ${word_limit} words. Penalize if significantly exceeded or too short.` : ''}
- Give specific, actionable feedback
- Mention what was good and what needs improvement
- If model answer is provided, compare the candidate's answer against it

Return your response in this exact format:
SCORE: [number]
FEEDBACK:
[Your detailed feedback here with sections for Strengths, Weaknesses, and Suggestions]`;

    const userPrompt = `QUESTION: ${question_text}

${model_answer ? `MODEL ANSWER: ${model_answer}` : 'No model answer available.'}

CANDIDATE'S ANSWER: ${user_answer}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI evaluation failed");
    }

    const aiResult = await response.json();
    const content = aiResult.choices?.[0]?.message?.content || "";

    // Parse score from response
    const scoreMatch = content.match(/SCORE:\s*(\d+)/i);
    const score = scoreMatch ? Math.min(Number(scoreMatch[1]), marks) : null;

    // Parse feedback
    const feedbackMatch = content.match(/FEEDBACK:\s*([\s\S]*)/i);
    const feedback = feedbackMatch ? feedbackMatch[1].trim() : content;

    return new Response(
      JSON.stringify({ score, feedback }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("evaluate error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
