const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
const HF_URL = "https://router.huggingface.co/hf-inference/v1/chat/completions";
const HF_MODEL = "meta-llama/Llama-3.1-8B-Instruct";

function getKeys(): string[] {
  const keys: string[] = [];
  for (let i = 1; i <= 10; i++) {
    const k = Deno.env.get(`GEMINI_KEY_${i}`);
    if (k) keys.push(k);
  }
  return keys;
}

let currentIndex = 0;

export interface CallOptions {
  /** If true, skip Gemini entirely and use Hugging Face. */
  preferHuggingFace?: boolean;
  /** Strip Gemini-only fields (tools/tool_choice) before HF call. */
  stripToolsForHF?: boolean;
}

export async function callGemini(
  body: object,
  optsOrRetries?: CallOptions | number,
): Promise<Response> {
  const opts: CallOptions = typeof optsOrRetries === "object" ? optsOrRetries : {};

  if (opts.preferHuggingFace) {
    return callHuggingFace(body, opts);
  }

  const keys = getKeys();
  if (!keys.length) {
    // No Gemini keys — try HF if available
    return callHuggingFace(body, opts);
  }
  const retries = keys.length;
  let lastStatus = 0;
  let lastBody = "";

  for (let attempt = 0; attempt < retries; attempt++) {
    const key = keys[currentIndex % keys.length];
    currentIndex++;

    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (res.status === 429 || res.status === 503 || res.status === 502 || res.status === 504 || res.status === 500) {
      lastStatus = res.status;
      lastBody = await res.text().catch(() => "");
      console.log(`Gemini key #${currentIndex} got ${res.status}, rotating...`);
      continue;
    }

    if (!res.ok) {
      // Non-429 error — log and return so caller can see real reason
      const txt = await res.text().catch(() => "");
      console.error(`Gemini error ${res.status}: ${txt.slice(0, 500)}`);
      return new Response(txt, { status: res.status, headers: res.headers });
    }

    return res;
  }

  // All Gemini keys 429 → HF fallback
  console.log(`All ${keys.length} Gemini keys exhausted (429). Falling back to HF.`);
  return callHuggingFace(body, opts);
}

async function callHuggingFace(body: object, opts: CallOptions): Promise<Response> {
  const hfToken = Deno.env.get("HUGGINGFACE_TOKEN");
  if (!hfToken) {
    return new Response(
      JSON.stringify({ error: "All AI providers exhausted. Add HUGGINGFACE_TOKEN or wait for Gemini quota reset." }),
      { status: 429, headers: { "Content-Type": "application/json" } },
    );
  }

  const src = body as Record<string, unknown>;
  const hfBody: Record<string, unknown> = { ...src, model: HF_MODEL };

  // HF Llama doesn't reliably support tool-calling — strip if requested
  if (opts.stripToolsForHF) {
    delete hfBody.tools;
    delete hfBody.tool_choice;
    delete hfBody.response_format;
  }

  console.log("Calling Hugging Face:", HF_MODEL);

  const res = await fetch(HF_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${hfToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(hfBody),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error(`HF error ${res.status}: ${txt.slice(0, 500)}`);
    return new Response(txt || JSON.stringify({ error: "Hugging Face request failed" }), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  return res;
}
