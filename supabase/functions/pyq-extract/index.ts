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
    const { pageText, year, exam, topics } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    if (!pageText || typeof pageText !== "string" || pageText.trim().length < 20) {
      return new Response(
        JSON.stringify({ questions: [], message: "Text too short to extract questions." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const examName = exam || "Competitive";
    const topicList: string[] = topics || [];

    const systemPrompt = `You are an expert at parsing ${examName} exam question papers. Extract ALL multiple-choice questions (MCQs) from the given text.

For each question:
1. Extract the full question text
2. Extract exactly 4 options (A, B, C, D)
3. Identify the correct option (0-indexed: 0=A, 1=B, 2=C, 3=D). If the answer is not clear from the text, make your best educated guess.
${topicList.length > 0 ? `4. Classify into one of these topics: ${topicList.join(", ")}` : "4. Classify into a relevant topic category"}
5. Assess difficulty as "easy", "medium", or "hard"
6. Write a brief explanation for the correct answer

Rules:
- Extract EVERY question you can find, even if formatting is inconsistent
- If options are numbered (1,2,3,4) convert to (A,B,C,D) format
- If a question has less or more than 4 options, skip it
- Clean up OCR artifacts and formatting issues
- Keep the original language of the question (Hindi or English)
- If you cannot determine the correct answer, set correct_option to 0 and note it in the explanation`;

    const topicSchema = topicList.length > 0
      ? { type: "string", enum: topicList, description: `${examName} topic classification` }
      : { type: "string", description: "Topic classification" };

    const response = await fetch(AI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Extract all MCQ questions from this ${examName} ${year || ""} exam paper text:\n\n${pageText}` },
        ],
        tools: [{
          type: "function",
          function: {
            name: "extract_questions",
            description: "Extract structured MCQ questions from exam paper text",
            parameters: {
              type: "object",
              properties: {
                questions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      question_text: { type: "string", description: "The full question text" },
                      options: { type: "array", items: { type: "string" }, description: "Exactly 4 options" },
                      correct_option: { type: "number", description: "0-indexed correct option (0=A, 1=B, 2=C, 3=D)" },
                      topic: topicSchema,
                      difficulty: { type: "string", enum: ["easy", "medium", "hard"] },
                      explanation: { type: "string", description: "Brief explanation for the correct answer" },
                    },
                    required: ["question_text", "options", "correct_option", "topic", "difficulty", "explanation"],
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
      const valid = (parsed.questions || []).filter((q: any) => Array.isArray(q.options) && q.options.length === 4);
      return new Response(JSON.stringify({ questions: valid }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ questions: [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("pyq-extract error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
