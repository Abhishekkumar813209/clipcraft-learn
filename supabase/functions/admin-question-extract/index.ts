import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { callGemini } from "../_shared/gemini.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Admin gate
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: claims, error: claimsErr } = await userClient.auth.getClaims(
      authHeader.replace("Bearer ", ""),
    );
    if (claimsErr || !claims?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: isAdminData } = await userClient.rpc("is_admin");
    if (!isAdminData) {
      return new Response(JSON.stringify({ error: "Admin only" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { pageText, examTag, bookName, topicName, subtopicName, answerKeyText } = await req.json();
    if (!pageText || typeof pageText !== "string" || pageText.trim().length < 20) {
      return new Response(
        JSON.stringify({ questions: [], message: "Text too short." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const systemPrompt = `You are an expert at parsing ${examTag || "competitive exam"} question papers. Extract ALL multiple-choice questions (MCQs) from the given text.

Context (just metadata, do NOT echo back): Book: ${bookName || "n/a"}; Topic: ${topicName || "n/a"}; Subtopic: ${subtopicName || "n/a"}.

For each question:
1. Full question text (prepend any preceding Direction/passage so the question is self-contained).
2. Exactly 4 options.
3. correct_option (0-indexed). If unsure, best guess.
4. difficulty: easy | medium | hard.
5. Brief explanation.

If an ANSWER KEY is provided, prefer it over guessing.`;

    const response = await callGemini({
      model: "gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Extract all MCQ questions:\n\n${pageText}${
            answerKeyText ? `\n\n--- ANSWER KEY ---\n${answerKeyText}` : ""
          }`,
        },
      ],
      tools: [{
        type: "function",
        function: {
          name: "extract_questions",
          description: "Extract MCQs",
          parameters: {
            type: "object",
            properties: {
              questions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    question_text: { type: "string" },
                    options: { type: "array", items: { type: "string" } },
                    correct_option: { type: "number" },
                    difficulty: { type: "string", enum: ["easy", "medium", "hard"] },
                    explanation: { type: "string" },
                  },
                  required: ["question_text", "options", "correct_option", "difficulty", "explanation"],
                  additionalProperties: false,
                },
              },
            },
            required: ["questions"],
            additionalProperties: false,
          },
        },
      }],
      tool_choice: { type: "function", function: { name: "extract_questions" } },
      stream: false,
    });

    if (!response.ok) {
      const t = await response.text();
      console.error("AI error:", response.status, t);
      return new Response(JSON.stringify({ error: `AI service error (${response.status}): ${t.slice(0, 400)}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      const valid = (parsed.questions || []).filter(
        (q: any) => Array.isArray(q.options) && q.options.length === 4,
      );
      return new Response(JSON.stringify({ questions: valid }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ questions: [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("admin-question-extract error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
