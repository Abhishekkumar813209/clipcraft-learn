import { callGemini } from "../_shared/gemini.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, arguments: userArgs } = await req.json();

    if (!topic || !userArgs) {
      return new Response(
        JSON.stringify({ error: "Topic and arguments are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are an expert Group Discussion (GD) evaluator for placement interviews in India. 
A student will give you a GD topic and their arguments/points. Evaluate them and provide detailed, constructive feedback.

Your response MUST be in this exact JSON format:
{
  "overallScore": <number 1-10>,
  "content": {
    "score": <number 1-10>,
    "feedback": "<2-3 sentences on argument depth, relevance, use of examples/data>"
  },
  "communication": {
    "score": <number 1-10>,
    "feedback": "<2-3 sentences on clarity, grammar, vocabulary, sentence structure>"
  },
  "persuasiveness": {
    "score": <number 1-10>,
    "feedback": "<2-3 sentences on how convincing the arguments are>"
  },
  "structure": {
    "score": <number 1-10>,
    "feedback": "<2-3 sentences on logical flow, organization of points>"
  },
  "improvements": ["<specific actionable improvement 1>", "<improvement 2>", "<improvement 3>"],
  "strongPoints": ["<what they did well 1>", "<what they did well 2>"],
  "counterArguments": [
    { "argument": "<A likely counter-argument an opponent might raise against the student's position>", "rebuttal": "<How the student should respond to this counter-argument effectively>" },
    { "argument": "<Another counter-argument>", "rebuttal": "<Suggested rebuttal>" },
    { "argument": "<A third counter-argument>", "rebuttal": "<Suggested rebuttal>" }
  ],
  "sampleResponse": "<A 100-word model response for the same topic showing ideal GD speaking style>"
}

For counterArguments, think about what OTHER participants in the GD would say to challenge this student's points, and provide smart rebuttals the student can use.
Be encouraging but honest. Give specific examples from their text when pointing out strengths or weaknesses.
Return ONLY the JSON, no markdown formatting.`;

    const res = await callGemini({
      contents: [
        { role: "user", parts: [{ text: `${systemPrompt}\n\nGD Topic: "${topic}"\n\nStudent's Arguments:\n${userArgs}` }] },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000,
      },
    });

    const data = await res.json();

    let feedbackText = "";
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      feedbackText = data.candidates[0].content.parts[0].text;
    } else if (data.choices?.[0]?.message?.content) {
      feedbackText = data.choices[0].message.content;
    }

    let feedback;
    try {
      const cleaned = feedbackText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      feedback = JSON.parse(cleaned);
    } catch {
      feedback = { raw: feedbackText };
    }

    return new Response(JSON.stringify(feedback), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GD feedback error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate feedback" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
