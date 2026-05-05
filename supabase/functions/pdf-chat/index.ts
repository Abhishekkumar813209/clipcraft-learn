import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { callGemini } from "../_shared/gemini.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Cap how much PDF text we send to AI to keep token usage sane.
const MAX_TEXT_CHARS = 60_000;
function trimText(t?: string): string {
  if (!t) return "";
  if (t.length <= MAX_TEXT_CHARS) return t;
  // Keep start + end (often most informative), drop middle
  const half = Math.floor(MAX_TEXT_CHARS / 2);
  return t.slice(0, half) + "\n\n[...content trimmed for AI quota...]\n\n" + t.slice(-half);
}

function errorResponse(status: number, message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function mapUpstreamError(status: number, body: string): { status: number; message: string } {
  const lower = (body || "").toLowerCase();
  if (status === 429 || lower.includes("rate") || lower.includes("quota") || lower.includes("resource_exhausted")) {
    return { status: 429, message: "Daily AI limit reached across all keys. Try again later or use Hugging Face fallback." };
  }
  if (status === 402 || lower.includes("payment") || lower.includes("credit")) {
    return { status: 402, message: "AI credits exhausted. Add credits in Settings." };
  }
  if (status === 401 || status === 403) {
    return { status, message: "AI auth failed. Check API keys." };
  }
  return { status: 500, message: `AI service error (${status}): ${body.slice(0, 200) || "unknown"}` };
}

function extractJsonObject(text: string): any | null {
  if (!text) return null;
  // Try direct parse
  try { return JSON.parse(text); } catch {}
  // Strip code fences
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) {
    try { return JSON.parse(fence[1]); } catch {}
  }
  // Find first { ... last }
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first >= 0 && last > first) {
    try { return JSON.parse(text.slice(first, last + 1)); } catch {}
  }
  return null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, pageText: rawText, action, language, answers, numQuestions, questionTypes, focusTopics } = await req.json();
    const pageText = trimText(rawText);

    // --- TRANSLATE action ---
    if (action === "translate") {
      const targetLang = language || 'hindi';
      const systemPrompt = targetLang === 'hinglish'
        ? `Convert the following text into Hinglish (Hindi written in Roman/English script mixed with English words as naturally spoken). Stay strictly within the content of the text — do not add extra information or headings. Just give the converted text.\n\nText:\n${pageText || "No text available."}`
        : `Translate the following text into simple, easy-to-understand Hindi. Stay strictly within the content of the text — do not add extra information, headings, or elaborate breakdowns. Just give the translated text.\n\nText:\n${pageText || "No text available."}`;

      const userPrompt = targetLang === 'hinglish' ? "Convert this page into Hinglish." : "Translate this page into Hindi.";

      const response = await callGemini({
        model: "gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: false,
      });

      if (!response.ok) {
        const body = await response.text().catch(() => "");
        const m = mapUpstreamError(response.status, body);
        return errorResponse(m.status, m.message);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "Translation failed.";
      return new Response(JSON.stringify({ translation: content }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- QUIZ action ---
    if (action === "quiz") {
      const lang = language === "hindi" ? "Hindi" : language === "hinglish" ? "Hinglish (Hindi in Roman script mixed with English)" : "English";
      const numQ = Math.min(Math.max(numQuestions || 4, 1), 40);

      const types: string[] = questionTypes && questionTypes.length > 0 ? questionTypes : ['mcq', 'short'];
      const typeDescriptions: Record<string, string> = {
        mcq: 'MCQ (multiple choice with 4 options, one correct)',
        true_false: 'True/False (statement that is either true or false)',
        fill_blank: 'Fill in the Blank (sentence with a blank ___ to fill)',
        multiple_correct: 'Multiple Correct (MCQ with 4 options where 2+ can be correct, separate correct answers with commas)',
        short: 'Short Answer (requires a brief text answer)',
      };
      const typeList = types.map((t: string) => typeDescriptions[t] || t).join(', ');

      const focusInstruction = focusTopics?.length
        ? `\n\nIMPORTANT: Focus questions on these weak-area topics:\n${focusTopics.map((t: string, i: number) => `${i + 1}. ${t}`).join('\n')}`
        : '';

      const systemPrompt = `You are an expert quiz generator. Based on the page text, generate exactly ${numQ} questions in ${lang}.

Question types to use (distribute evenly): ${typeList}

Type field values: "mcq", "true_false", "fill_blank", "multiple_correct", "short".
For true_false: correctAnswer is "True" or "False".
For fill_blank: write ___ in question, correctAnswer = the missing word(s).
For multiple_correct: 4 options, correctAnswer lists correct ones comma-separated.${focusInstruction}

Page text:
${pageText || "No text available."}`;

      const validTypes = ["mcq", "short", "true_false", "fill_blank", "multiple_correct"];

      // First try Gemini with tool-calling
      const response = await callGemini({
        model: "gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate ${numQ} quiz questions in ${lang}. Types: ${types.join(', ')}.` },
        ],
        tools: [{
          type: "function",
          function: {
            name: "generate_quiz",
            description: "Generate quiz questions",
            parameters: {
              type: "object",
              properties: {
                questions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "number" },
                      question: { type: "string" },
                      type: { type: "string", enum: validTypes },
                      options: { type: "array", items: { type: "string" } },
                      correctAnswer: { type: "string" },
                    },
                    required: ["id", "question", "type", "correctAnswer"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["questions"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "generate_quiz" } },
        stream: false,
      }, { stripToolsForHF: true });

      if (!response.ok) {
        const body = await response.text().catch(() => "");
        const m = mapUpstreamError(response.status, body);
        return errorResponse(m.status, m.message);
      }

      const data = await response.json();
      const choice = data.choices?.[0]?.message;

      // Gemini path: tool_calls
      const toolCall = choice?.tool_calls?.[0];
      if (toolCall?.function?.arguments) {
        try {
          const parsed = JSON.parse(toolCall.function.arguments);
          return new Response(JSON.stringify(parsed), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } catch (e) {
          console.error("Failed to parse tool args:", e);
        }
      }

      // HF path / fallback: parse JSON out of plain content
      const content = choice?.content || "";
      const parsed = extractJsonObject(content);
      if (parsed?.questions?.length) {
        return new Response(JSON.stringify({ questions: parsed.questions }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // If first attempt produced nothing useful AND we still have HF available, retry HF in JSON-prompt mode
      const hfRetry = await callGemini({
        model: "gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt + `\n\nReturn ONLY valid JSON in this exact shape: {"questions":[{"id":1,"question":"...","type":"mcq","options":["a","b","c","d"],"correctAnswer":"a"}]}. No markdown, no commentary.` },
          { role: "user", content: `Generate ${numQ} quiz questions in ${lang}. JSON only.` },
        ],
        stream: false,
      }, { preferHuggingFace: true, stripToolsForHF: true });

      if (hfRetry.ok) {
        const d2 = await hfRetry.json().catch(() => null);
        const c2 = d2?.choices?.[0]?.message?.content || "";
        const p2 = extractJsonObject(c2);
        if (p2?.questions?.length) {
          return new Response(JSON.stringify({ questions: p2.questions }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }

      return errorResponse(502, "AI returned no usable questions. Try fewer pages or fewer questions.");
    }

    // --- CHECK-ANSWERS action ---
    if (action === "check-answers") {
      const lang = language === "hindi" ? "Hindi" : "English";
      const systemPrompt = `You are an expert educator. Evaluate each answer, give a score, and explain wrong answers briefly.

If any answer is "(skipped)" or empty, mark as a WEAK AREA. End feedback with a "Weak Areas" section listing topics to practice.

Respond in ${lang}.

Page text:
${pageText || "No text available."}

Answers:
${JSON.stringify(answers || [])}`;

      const response = await callGemini({
        model: "gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Please check my answers and give feedback." },
        ],
        stream: false,
      });

      if (!response.ok) {
        const body = await response.text().catch(() => "");
        const m = mapUpstreamError(response.status, body);
        return errorResponse(m.status, m.message);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "Could not evaluate answers.";
      return new Response(JSON.stringify({ feedback: content }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- DEFAULT: Chat (streaming) ---
    const systemPrompt = `You are an expert study assistant. Help students understand PDF content with clear summaries and explanations.

Use bullet points and structured formatting when helpful.

Current page text:
${pageText || "No page text available."}`;

    const response = await callGemini({
      model: "gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      stream: true,
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      const m = mapUpstreamError(response.status, body);
      return errorResponse(m.status, m.message);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("pdf-chat error:", e);
    return errorResponse(500, e instanceof Error ? e.message : "Unknown error");
  }
});
