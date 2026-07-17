import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const body = await req.json();
    // Accept either legacy array (ssc_pos_spot_error) or { table, rows }
    const table: string = Array.isArray(body) ? "ssc_pos_spot_error" : String(body.table || "ssc_pos_spot_error");
    const rows: any[] = Array.isArray(body) ? body : body.rows;
    if (!Array.isArray(rows)) throw new Error("rows must be an array");
    const allowed = new Set(["ssc_pos_spot_error", "ssc_syn_ant_items"]);
    if (!allowed.has(table)) throw new Error("table not allowed");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const chunk = 100;
    let inserted = 0;
    for (let i = 0; i < rows.length; i += chunk) {
      const slice = rows.slice(i, i + chunk);
      const { error } = await supabase.from(table).insert(slice);
      if (error) throw error;
      inserted += slice.length;
    }
    return new Response(JSON.stringify({ inserted, table }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
