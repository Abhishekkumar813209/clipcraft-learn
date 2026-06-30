import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { callGemini } from "../_shared/gemini.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface PageImg {
  pageNum: number;
  imageBase64: string; // data URL or raw base64
}

const PROMPT =
  "Transcribe ALL visible text from this scanned page verbatim. Preserve question numbers, option letters (A/B/C/D), tables, and line breaks. Do NOT summarize, translate, or add commentary. If the page is blank, reply with an empty string.";

async function ocrOne(p: PageImg): Promise<{ pageNum: number; text: string }> {
  const dataUrl = p.imageBase64.startsWith("data:")
    ? p.imageBase64
    : `data:image/jpeg;base64,${p.imageBase64}`;

  try {
    const res = await callGemini({
      model: "gemini-2.5-flash",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: PROMPT },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ],
      stream: false,
    });

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      console.error(`OCR page ${p.pageNum} failed ${res.status}: ${t.slice(0, 200)}`);
      return { pageNum: p.pageNum, text: "" };
    }
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content ?? "";
    return { pageNum: p.pageNum, text: typeof text === "string" ? text : "" };
  } catch (e) {
    console.error(`OCR page ${p.pageNum} threw:`, e);
    return { pageNum: p.pageNum, text: "" };
  }
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
    const pages: PageImg[] = Array.isArray(body?.pages) ? body.pages : [];
    if (!pages.length) {
      return new Response(JSON.stringify({ error: "pages[] required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (pages.length > 5) {
      return new Response(JSON.stringify({ error: "max 5 pages per call" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Sequential to avoid burning multiple keys at once on transient 429s
    const results: { pageNum: number; text: string }[] = [];
    for (const p of pages) {
      results.push(await ocrOne(p));
    }

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("admin-ocr-pages error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
