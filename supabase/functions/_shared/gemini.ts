const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
const HF_URL = "https://router.huggingface.co/hf-inference/v1/chat/completions";
const HF_MODEL = "meta-llama/Llama-3.1-8B-Instruct";

function getKeys(): string[] {
  const keys: string[] = [];
  for (let i = 1; i <= 32; i++) {
    const k = Deno.env.get(`GEMINI_KEY_${i}`);
    if (k) keys.push(k);
  }
  return keys;
}

let currentIndex = 0;

// Some Gemini model ids get retired for new API keys (404 NOT_FOUND).
// Try these in order and remember the one that works for this instance.
const MODEL_FALLBACKS = [
  "gemini-2.5-flash",
  "gemini-flash-latest",
  "gemini-2.0-flash",
  "gemini-2.0-flash-001",
];
let workingModel: string | null = null;


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

  const reqBody = { ...(body as Record<string, unknown>) };
  const requested = String(reqBody.model || "");
  // Build the model chain: requested model first, then known-good fallbacks.
  const modelChain = [
    ...(workingModel && workingModel !== requested ? [workingModel] : []),
    ...(requested ? [requested] : []),
    ...MODEL_FALLBACKS,
  ].filter((m, i, a) => m && a.indexOf(m) === i);
  let modelPos = 0;

  for (let attempt = 0; attempt < retries; attempt++) {
    const key = keys[currentIndex % keys.length];
    currentIndex++;
    reqBody.model = modelChain[Math.min(modelPos, modelChain.length - 1)];

    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    });

    // Rotate on rate limits, server errors, and billing/permission denials (dunning, quota, disabled key).
    const rotatable = [429, 503, 502, 504, 500, 403, 401];
    if (rotatable.includes(res.status)) {
      lastStatus = res.status;
      lastBody = await res.text().catch(() => "");
      console.log(`Gemini key #${currentIndex} got ${res.status}, rotating... detail: ${lastBody.slice(0, 200)}`);
      continue;
    }

    // Retired / unavailable model → switch to next model id and retry.
    if (res.status === 404 && modelPos < modelChain.length - 1) {
      lastStatus = 404;
      lastBody = await res.text().catch(() => "");
      modelPos++;
      console.log(`Model ${reqBody.model} unavailable (404). Trying ${modelChain[modelPos]}`);
      attempt--; // model swap shouldn't burn a key attempt
      currentIndex--;
      continue;
    }

    if (!res.ok) {
      // Non-429 error — log and return so caller can see real reason
      const txt = await res.text().catch(() => "");
      console.error(`Gemini error ${res.status}: ${txt.slice(0, 500)}`);
      return new Response(txt, { status: res.status, headers: res.headers });
    }

    workingModel = String(reqBody.model);
    return res;
  }


  // All Gemini keys exhausted/overloaded → HF fallback
  console.log(`All ${keys.length} Gemini keys exhausted (last status ${lastStatus}). Falling back to HF.`);
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
