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

export async function callGemini(body: object, maxRetries?: number): Promise<Response> {
  const keys = getKeys();
  if (!keys.length) throw new Error("No GEMINI_KEY_* secrets configured");
  const retries = maxRetries ?? keys.length;

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

    if (res.status === 429 && attempt < retries - 1) {
      await res.text();
      continue;
    }

    // If last Gemini key also returned 429, fall back to Hugging Face
    if (res.status === 429) {
      await res.text();
      return callHuggingFace(body);
    }

    return res;
  }

  // Should not reach here, but fallback just in case
  return callHuggingFace(body);
}

async function callHuggingFace(body: object): Promise<Response> {
  const hfToken = Deno.env.get("HUGGINGFACE_TOKEN");
  if (!hfToken) {
    throw new Error("All Gemini keys rate-limited and no HUGGINGFACE_TOKEN configured");
  }

  console.log("All Gemini keys exhausted (429). Falling back to Hugging Face:", HF_MODEL);

  // Replace model in the body with HF model, keep everything else
  const hfBody = { ...(body as Record<string, unknown>), model: HF_MODEL };

  const res = await fetch(HF_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${hfToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(hfBody),
  });

  return res;
}
