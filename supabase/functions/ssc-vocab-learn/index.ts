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
    const { root, root_meaning, words } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    if (!words || !Array.isArray(words) || words.length === 0) {
      return new Response(JSON.stringify({ error: "No words provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are an expert English vocabulary trainer for competitive exams (SSC, RBI, CAT).

You will be given:
- a root word
- its meaning
- a list of words with definitions

Your task is to enrich each word into a complete learning module.

FOR EACH WORD, GENERATE:

Meaning:
- Convert definition into simple Hinglish explanation

Synonyms:
- Provide 3 relevant synonyms

Antonyms:
- Provide 3 correct antonyms

One Word Substitution:
- If applicable, create a logical one-word substitution
- If not obvious, create a close conceptual phrase

Sentences (IMPORTANT):
Generate 3 sentences:
a) formal
b) casual
c) exam-type

For EACH sentence include:
- sentence
- Hindi translation
- 1 short grammar insight (e.g., tense, modal, subject-verb agreement)

MCQs (PER WORD):
Create 4 MCQs:
- Synonym
- Antonym
- Fill in the blank
- Error detection

Each MCQ must have:
- question
- 4 options
- correct answer

ROOT LEVEL EXERCISES:
Generate:
- 5 Fill in the blanks
- 3 Hindi to English translations
- 3 Error correction sentences
- 3 One word substitution questions

IMPORTANT RULES:
- Keep explanations short and clear
- Ensure grammar correctness
- Hindi should be natural (not literal translation)
- Avoid repetition
- Maintain exam-level difficulty`;

    const userContent = `Root: ${root || "N/A"}
Root Meaning: ${root_meaning || "N/A"}

Words:
${words.map((w: any) => `- ${w.word}: ${w.meaning || "no definition"}`).join("\n")}`;

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
          { role: "user", content: userContent },
        ],
        tools: [{
          type: "function",
          function: {
            name: "generate_learning_module",
            description: "Generate a complete vocabulary learning module for a root and its words",
            parameters: {
              type: "object",
              properties: {
                root: { type: "string" },
                root_meaning: { type: "string" },
                words: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      word: { type: "string" },
                      meaning: { type: "string", description: "Hinglish explanation" },
                      synonyms: { type: "array", items: { type: "string" } },
                      antonyms: { type: "array", items: { type: "string" } },
                      one_word_substitution: { type: "string" },
                      sentences: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            sentence: { type: "string" },
                            hindi: { type: "string" },
                            grammar: { type: "string" },
                          },
                          required: ["sentence", "hindi", "grammar"],
                          additionalProperties: false,
                        },
                      },
                      mcqs: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            question: { type: "string" },
                            options: { type: "array", items: { type: "string" } },
                            answer: { type: "string" },
                          },
                          required: ["question", "options", "answer"],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: ["word", "meaning", "synonyms", "antonyms", "one_word_substitution", "sentences", "mcqs"],
                    additionalProperties: false,
                  },
                },
                exercises: {
                  type: "object",
                  properties: {
                    fill_blanks: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          question: { type: "string" },
                          answer: { type: "string" },
                        },
                        required: ["question", "answer"],
                        additionalProperties: false,
                      },
                    },
                    translation: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          hindi: { type: "string" },
                          english: { type: "string" },
                        },
                        required: ["hindi", "english"],
                        additionalProperties: false,
                      },
                    },
                    error_correction: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          sentence: { type: "string" },
                          corrected: { type: "string" },
                        },
                        required: ["sentence", "corrected"],
                        additionalProperties: false,
                      },
                    },
                    one_word_substitution: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          description: { type: "string" },
                          answer: { type: "string" },
                        },
                        required: ["description", "answer"],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["fill_blanks", "translation", "error_correction", "one_word_substitution"],
                  additionalProperties: false,
                },
              },
              required: ["root", "root_meaning", "words", "exercises"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "generate_learning_module" } },
        stream: false,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const t = await response.text();
      console.error("AI error:", status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "No structured response from AI" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ssc-vocab-learn error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
