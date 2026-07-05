import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function supabaseForUser(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "list_weak_words",
  title: "List weak Black Book words",
  description:
    "Return the signed-in user's most-missed Black Book vocabulary items (words they got wrong most often in practice), grouped by category.",
  inputSchema: {
    category: z
      .enum(["synonyms_antonyms", "idioms_phrases", "one_word_substitutions"])
      .optional()
      .describe("Optional category filter."),
    limit: z.number().int().min(1).max(100).default(20).describe("Max items to return."),
  },
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: async ({ category, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("bb_practice_attempts")
      .select("item_id, category, question")
      .eq("user_id", ctx.getUserId())
      .eq("is_correct", false);
    if (category) query = query.eq("category", category);
    const { data, error } = await query.limit(2000);
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    const counts = new Map<string, { item_id: string; category: string; question: string; wrong: number }>();
    for (const row of data ?? []) {
      const key = row.item_id;
      const prev = counts.get(key);
      if (prev) prev.wrong++;
      else counts.set(key, { item_id: row.item_id, category: row.category, question: row.question, wrong: 1 });
    }
    const ranked = Array.from(counts.values()).sort((a, b) => b.wrong - a.wrong).slice(0, limit);
    return {
      content: [{ type: "text", text: JSON.stringify(ranked, null, 2) }],
      structuredContent: { items: ranked },
    };
  },
});
