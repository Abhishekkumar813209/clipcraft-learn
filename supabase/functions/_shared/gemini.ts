const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";

function getKeys(): string[] {
  const keys: string[] = [];
  for (let i = 1; i <= 8; i++) {
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
      // Consume body before retrying to avoid resource leak
      await res.text();
      continue;
    }
    return res;
  }
  throw new Error("All Gemini API keys rate-limited");
}
