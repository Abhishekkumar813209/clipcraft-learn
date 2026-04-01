

## Plan: Replace Lovable AI Gateway with Gemini API Keys + Round-Robin

### What Changes

Create a shared utility file that all 10 edge functions import. This utility handles:
- Loading up to 8 Gemini API keys from environment secrets (`GEMINI_KEY_1` through `GEMINI_KEY_8`)
- Round-robin key selection with automatic failover on 429 (rate limit) errors
- Retry with the next key when one gets rate-limited

Then update all 10 edge functions to use this utility instead of the Lovable AI gateway.

### New File: `supabase/functions/_shared/gemini.ts`

```typescript
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";

// Load all available keys
function getKeys(): string[] {
  const keys: string[] = [];
  for (let i = 1; i <= 8; i++) {
    const k = Deno.env.get(`GEMINI_KEY_${i}`);
    if (k) keys.push(k);
  }
  return keys;
}

let currentIndex = 0;

// Round-robin call with auto-retry on 429
export async function callGemini(body: object, maxRetries?: number): Promise<Response> {
  const keys = getKeys();
  if (!keys.length) throw new Error("No GEMINI_KEY_* secrets configured");
  const retries = maxRetries ?? keys.length;
  
  for (let attempt = 0; attempt < retries; attempt++) {
    const key = keys[currentIndex % keys.length];
    currentIndex++;
    
    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    
    if (res.status === 429 && attempt < retries - 1) continue; // try next key
    return res; // return success or final failure
  }
  throw new Error("All API keys rate-limited");
}
```

### Model Mapping

Current Lovable models map to Gemini models:
- `google/gemini-2.5-flash` → `gemini-2.5-flash`
- `google/gemini-3-flash-preview` → `gemini-2.5-flash` (or `gemini-2.5-pro` for extraction tasks)

The Gemini OpenAI-compatible endpoint supports the same request format, so minimal changes needed per function.

### Edge Functions Modified (10 files)

Each function changes from:
```typescript
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
  headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, ... },
  body: JSON.stringify({ model: "google/gemini-...", ... }),
});
```

To:
```typescript
import { callGemini } from "../_shared/gemini.ts";
const response = await callGemini({ model: "gemini-2.5-flash", messages: [...] });
```

**Functions to update:**
1. `pdf-chat/index.ts` (4 fetch calls)
2. `video-chat/index.ts`
3. `nqt-explain/index.ts`
4. `bpsc-mains-evaluate/index.ts`
5. `bpsc-pyq-extract/index.ts`
6. `pyq-extract/index.ts`
7. `rbi-pyq-extract/index.ts`
8. `generate-weak-area-questions/index.ts`
9. `ssc-vocab-extract/index.ts`
10. `ssc-vocab-learn/index.ts`

### Secrets Required

You'll need to add 8 secrets: `GEMINI_KEY_1` through `GEMINI_KEY_8`. I'll prompt you to enter each one.

### Technical Details

- Gemini's OpenAI-compatible endpoint: `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`
- Supports the same `messages`, `model`, `tools`, `tool_choice` format
- Round-robin index is per function invocation (stateless across cold starts, which is fine — distributes load naturally)
- If a key hits 429, the utility immediately tries the next key without returning an error to the user

