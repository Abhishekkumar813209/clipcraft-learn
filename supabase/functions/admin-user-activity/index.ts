import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAIL = "abhishek.kumar.chy21@itbhu.ac.in";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) throw new Error("Missing auth");

    const url = Deno.env.get("SUPABASE_URL")!;
    const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // verify caller
    const anonClient = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: u, error: uErr } = await anonClient.auth.getUser();
    if (uErr || !u?.user) throw new Error("Not authenticated");
    if (u.user.email !== ADMIN_EMAIL) throw new Error("Forbidden");

    const supa = createClient(url, service);
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data: users } = await supa.auth.admin.listUsers({ page: 1, perPage: 500 });
    const profiles = (users?.users || []).map((x) => ({
      id: x.id,
      email: x.email,
      display_name: (x.user_metadata as any)?.display_name || null,
      created_at: x.created_at,
      last_sign_in_at: x.last_sign_in_at,
    }));

    const [bb, root, dailyProgress, bbSessions] = await Promise.all([
      supa.from("bb_practice_attempts").select("user_id,is_correct,category,created_at").gte("created_at", since),
      supa.from("root_practice_attempts").select("user_id,is_correct,created_at").gte("created_at", since),
      supa.from("black_book_daily_progress").select("user_id,date,category,attempted,correct").gte("date", since.slice(0, 10)),
      supa.from("bb_practice_sessions").select("user_id,category,total,correct,created_at").gte("created_at", since),
    ]);

    const perUser: Record<string, {
      attempts: number; correct: number;
      byCategory: Record<string, { attempts: number; correct: number }>;
      byDay: Record<string, number>;
      sessions: number;
    }> = {};

    const bump = (uid: string, cat: string, ok: boolean, day: string) => {
      const p = (perUser[uid] ||= { attempts: 0, correct: 0, byCategory: {}, byDay: {}, sessions: 0 });
      p.attempts++; if (ok) p.correct++;
      const c = (p.byCategory[cat] ||= { attempts: 0, correct: 0 });
      c.attempts++; if (ok) c.correct++;
      p.byDay[day] = (p.byDay[day] || 0) + 1;
    };

    (bb.data || []).forEach((r: any) =>
      bump(r.user_id, r.category || "bb", !!r.is_correct, (r.created_at || "").slice(0, 10)),
    );
    (root.data || []).forEach((r: any) =>
      bump(r.user_id, "root_words", !!r.is_correct, (r.created_at || "").slice(0, 10)),
    );
    (bbSessions.data || []).forEach((r: any) => {
      const p = (perUser[r.user_id] ||= { attempts: 0, correct: 0, byCategory: {}, byDay: {}, sessions: 0 });
      p.sessions++;
    });

    const rows = profiles.map((p) => ({
      ...p,
      activity: perUser[p.id] || { attempts: 0, correct: 0, byCategory: {}, byDay: {}, sessions: 0 },
    }));

    rows.sort((a, b) => (b.activity.attempts - a.activity.attempts));

    return new Response(JSON.stringify({ since, users: rows }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
