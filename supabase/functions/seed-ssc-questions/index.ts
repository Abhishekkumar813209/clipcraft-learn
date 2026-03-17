import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, questions } = await req.json();

    if (!topic || !Array.isArray(questions) || questions.length === 0) {
      return new Response(JSON.stringify({ error: "topic and questions[] required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Delete existing global questions for this topic
    const { error: delError } = await supabase
      .from("ssc_questions")
      .delete()
      .eq("topic", topic)
      .is("user_id", null);

    if (delError) throw delError;

    // Insert new questions in batches of 50
    const rows = questions.map((q: any) => ({
      question_text: q.question_text,
      options: q.options,
      correct_option: q.correct_option,
      explanation: q.explanation || null,
      difficulty: q.difficulty || "medium",
      topic,
      is_pyq: q.is_pyq || false,
      exam: q.exam || null,
      user_id: null,
    }));

    let inserted = 0;
    for (let i = 0; i < rows.length; i += 50) {
      const batch = rows.slice(i, i + 50);
      const { error } = await supabase.from("ssc_questions").insert(batch);
      if (error) throw error;
      inserted += batch.length;
    }

    return new Response(
      JSON.stringify({ success: true, inserted, topic }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
