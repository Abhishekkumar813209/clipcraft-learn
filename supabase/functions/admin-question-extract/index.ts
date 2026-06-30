import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { callGemini } from "../_shared/gemini.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type ContentType = "mcq" | "vocab" | "qa";

function buildSystemPrompt(
  contentType: ContentType,
  examTag: string,
  bookName: string,
  topicName: string,
  subtopicName: string,
): string {
  const ctx = `Context (metadata, do NOT echo): Book: ${bookName || "n/a"}; Topic: ${topicName || "n/a"}; Subtopic: ${subtopicName || "n/a"}; Exam: ${examTag || "n/a"}.`;

  if (contentType === "vocab") {
    return `You are an expert at converting English vocabulary lists into MCQs for ${examTag || "competitive exam"} prep.
${ctx}

The text contains vocabulary entries (word → meaning/synonyms/example). For EACH headword you find, SYNTHESIZE one multiple-choice question.

Rules:
1. question_text: "Choose the correct meaning of: <WORD>" (or "Choose the synonym/antonym of: <WORD>" — mix it up).
2. options: exactly 4 short meanings/synonyms. The CORRECT one is the meaning of that word from the text. The 3 distractors must be meanings of OTHER words from the SAME page (pick plausible, similar-register words — never invent meanings).
3. correct_option: 0-indexed position of the right answer.
4. difficulty: easy | medium | hard (rare/long words = hard).
5. explanation: one short line giving the meaning + a usage hint.

Skip any entry where you cannot find a clear meaning. Do not output the same word twice.`;
  }

  if (contentType === "qa") {
    return `You are an expert at parsing ${examTag || "competitive exam"} study material.
${ctx}

The text may contain Q&A, fill-in-the-blank, true/false, or short-answer items. Convert EACH into a 4-option MCQ.

For each item:
1. question_text: rewrite as a clear, self-contained question (prepend any direction/passage).
2. options: exactly 4 plausible options. The correct one comes from the source; distractors must be reasonable.
3. correct_option: 0-indexed.
4. difficulty: easy | medium | hard.
5. explanation: brief.

If an ANSWER KEY is provided, use it for correct_option.`;
  }

  // MCQ (default)
  return `You are an expert at parsing ${examTag || "competitive exam"} question papers. Extract ALL multiple-choice questions (MCQs) from the given text.
${ctx}

For each question:
1. Full question text (prepend any preceding Direction/passage so the question is self-contained).
2. Exactly 4 options.
3. correct_option (0-indexed). If unsure, best guess.
4. difficulty: easy | medium | hard.
5. Brief explanation.

If an ANSWER KEY is provided, prefer it over guessing.`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
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
    const { data: userData, error: userErr } = await userClient.auth.getUser(
      authHeader.replace("Bearer ", ""),
    );
    if (userErr || !userData?.user) {
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

    const body = await req.json();
    const {
      pageText,
      examTag,
      bookName,
      topicName,
      subtopicName,
      answerKeyText,
      contentType: rawType,
      format,
    } = body;

    const contentType: ContentType =
      rawType === "vocab" || rawType === "qa" ? rawType : "mcq";

    if (!pageText || typeof pageText !== "string" || pageText.trim().length < 20) {
      return new Response(
        JSON.stringify({
          questions: [],
          message: "Text too short.",
          sentChars: pageText?.length ?? 0,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const systemPrompt = buildSystemPrompt(
      contentType,
      examTag,
      bookName,
      topicName,
      subtopicName,
    );

    const csvHint =
      format === "csv"
        ? `\n\nNOTE: Input is CSV. The first row is the header (column names). Each subsequent row is ONE item (question or vocabulary entry). Map columns intelligently (e.g. question/q/stem, optionA-D / opt1-4, answer/correct, explanation, word, meaning).`
        : "";

    const userMsg =
      contentType === "vocab"
        ? `Vocabulary text — generate one MCQ per word:${csvHint}\n\n${pageText}`
        : `Extract all questions:${csvHint}\n\n${pageText}${
            answerKeyText ? `\n\n--- ANSWER KEY ---\n${answerKeyText}` : ""
          }`;

    const response = await callGemini({
      model: "gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMsg },
      ],
      tools: [{
        type: "function",
        function: {
          name: "extract_questions",
          description: "Return MCQs",
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
      return new Response(
        JSON.stringify({
          questions: valid,
          sentChars: pageText.length,
          contentType,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    return new Response(
      JSON.stringify({
        questions: [],
        sentChars: pageText.length,
        contentType,
        message: "AI returned no tool call",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("admin-question-extract error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
