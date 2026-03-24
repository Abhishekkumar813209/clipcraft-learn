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
    const { root, root_meaning, word, meaning } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    if (!word) {
      return new Response(JSON.stringify({ error: "No word provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are an expert English vocabulary trainer for competitive exams (SSC, RBI, CAT).

You will be given a single word with its root and definition.

FOR THE WORD, GENERATE:

Meaning: Convert definition into simple Hinglish explanation
Synonyms: 3 relevant synonyms
Antonyms: 3 correct antonyms
One Word Substitution: If applicable, a logical one-word substitution, else a close conceptual phrase

Sentences (3):
a) formal b) casual c) exam-type
Each with: sentence, Hindi translation, 1 grammar insight

MCQs (4): Synonym, Antonym, Fill in the blank, Error detection
Each with: question, 4 options (each option must have english text AND its hindi meaning), correct answer (in english)

ROOT LEVEL EXERCISES:
- 5 Fill in the blanks (each with hindi meaning of the sentence)
- 3 Hindi to English translations (each with grammar explanation in both English and Hindi)
- 3 Error correction sentences (each with explanation of WHY it's wrong and the correct grammar rule, in both English and Hindi)
- 3 One word substitution questions

RULES: Short & clear, grammar correct, natural Hindi, no repetition, exam-level difficulty.`;

    const userContent = `Root: ${root || "N/A"}
Root Meaning: ${root_meaning || "N/A"}
Word: ${word}
Definition: ${meaning || "no definition"}`;

    const response = await fetch(AI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent },
        ],
        tools: [{
          type: "function",
          function: {
            name: "generate_word_module",
            description: "Generate a vocabulary learning module for a single word",
            parameters: {
              type: "object",
              properties: {
                word_module: {
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
                          options: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                english: { type: "string" },
                                hindi: { type: "string" },
                              },
                              required: ["english", "hindi"],
                              additionalProperties: false,
                            },
                          },
                          answer: { type: "string", description: "The correct english option text" },
                        },
                        required: ["question", "options", "answer"],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["word", "meaning", "synonyms", "antonyms", "one_word_substitution", "sentences", "mcqs"],
                  additionalProperties: false,
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
                          hindi: { type: "string", description: "Hindi meaning of the sentence" },
                        },
                        required: ["question", "answer", "hindi"],
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
                          explanation: { type: "string", description: "Grammar structure explanation in English" },
                          explanation_hindi: { type: "string", description: "Grammar structure explanation in Hindi" },
                        },
                        required: ["hindi", "english", "explanation", "explanation_hindi"],
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
                          explanation: { type: "string", description: "Why the error exists and the correct grammar rule in English" },
                          explanation_hindi: { type: "string", description: "Why the error exists and the correct grammar rule in Hindi" },
                        },
                        required: ["sentence", "corrected", "explanation", "explanation_hindi"],
                        additionalProperties: false,
                      },
                    },
                    one_word_substitution: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: { description: { type: "string" }, answer: { type: "string" } },
                        required: ["description", "answer"],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["fill_blanks", "translation", "error_correction", "one_word_substitution"],
                  additionalProperties: false,
                },
              },
              required: ["word_module", "exercises"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "generate_word_module" } },
        stream: false,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
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
