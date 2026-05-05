## What is happening

- The screenshot shows `pdf-chat` returning **500 Internal Server Error** with `{ "error": "AI service error" }`.
- Your current PDF AI flow uses the shared Gemini key-rotation helper first. If Gemini returns `429`, the helper is supposed to rotate through keys and then fallback to Hugging Face.
- 40 MCQs can still burn quota quickly because one request sends a large PDF text range plus requests structured output. Also, translation prefetch can silently make extra AI calls for the next 3 pages when Hindi/Hinglish is active.
- The current error message hides the real upstream status/body, so it is hard to tell whether the 500 is from quota, invalid model payload, Hugging Face fallback format, credits, or another upstream failure.

## Plan to fix it

### 1. Make the error visible and user-friendly
- Update `pdf-chat` so it logs the real upstream response status and body safely.
- Return clear client messages for:
  - daily/RPM limit hit
  - AI credits exhausted
  - Hugging Face fallback failure
  - malformed/empty AI output
- Update the PDF reader toast so you see the actual reason instead of only “AI service error”.

### 2. Add a proper Hugging Face-first option for PDF quizzes
- Modify the shared AI helper to support choosing the provider:
  - default: existing Gemini rotation with Hugging Face fallback
  - quiz mode: Hugging Face-first or automatic fallback
- For Hugging Face quiz generation, avoid Gemini-style tool-calling if the selected HF model does not support it reliably.
- Generate strict JSON via prompt, then parse and validate it on the backend.

### 3. Reduce how fast quota gets consumed
- For quiz generation, chunk large page ranges into smaller page-text slices only when needed.
- Trim excessive PDF text before sending it to AI, keeping headings, page markers, and relevant content.
- Add UI guidance near the quiz form explaining that fewer pages/questions consume fewer AI requests.
- Keep the 40-question maximum, but make the default safer and discourage huge page ranges.

### 4. Stop hidden extra AI calls when not needed
- Review translation prefetch behavior.
- Disable or reduce automatic translation prefetch when quota-sensitive actions are happening, so opening Hindi/Hinglish does not unexpectedly consume extra requests.

### 5. Improve fallback reliability
- If Gemini is rate-limited and Hugging Face is used, ensure the response parser supports Hugging Face/OpenAI-compatible responses.
- If Hugging Face fails, return that exact failure category to the UI.

## Expected result

- Generating 40 MCQs should no longer immediately fail with a generic 500.
- If Gemini RPD is exhausted, the quiz can use Hugging Face instead.
- You will see a clear toast telling you exactly what failed.
- The app will consume fewer unnecessary AI calls, especially from PDF translation prefetch and large page ranges.

## No database changes

This is an Edge Function + frontend behavior fix only. No schema changes are needed.