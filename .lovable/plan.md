

## Plan: Hugging Face Fallback When All Gemini Keys Hit Rate Limit

### How It Works
The existing round-robin tries all 10 Gemini keys. Currently, if all return 429, it throws an error. Instead, we'll **fall back to Hugging Face's free Inference API** as a last resort.

### What Changes

**1. Add `HUGGINGFACE_TOKEN` secret**
You'll need a free Hugging Face API token (get it from https://huggingface.co/settings/tokens). We'll add it as a project secret.

**2. Update `supabase/functions/_shared/gemini.ts`**
- After all Gemini keys return 429, instead of throwing, call Hugging Face
- Use HF's OpenAI-compatible endpoint: `https://router.huggingface.co/hf-inference/v1/chat/completions`
- Model: `meta-llama/Llama-3.1-8B-Instruct` (best free option for instruction-following)
- Map model names: if the original request used `gemini-2.5-pro`, still use the same HF model (no pro equivalent on free tier)
- The response format is identical (OpenAI-compatible), so **zero changes needed in any of the 13 edge functions**

**3. No other files change**
Since `callGemini()` returns a `Response` object with the same shape, all 13 edge functions work as-is.

### Important Trade-offs
- HF free models (Llama 8B) are **weaker** than Gemini 2.5 Flash for Hindi/bilingual content and complex reasoning
- HF free tier also has rate limits (~100 RPM) but different daily limits
- This is a **degraded fallback**, not equal quality — but better than showing an error

### Files Modified
- `supabase/functions/_shared/gemini.ts` — add HF fallback after Gemini exhaustion
- New secret: `HUGGINGFACE_TOKEN`

