

## Plan: Add 2 More Gemini API Keys

### Step 1 — Add Secrets
Add `GEMINI_KEY_9` and `GEMINI_KEY_10` as project secrets (you'll be prompted to paste each key).

### Step 2 — Update Key Loop
In `supabase/functions/_shared/gemini.ts`, change the loop from `i <= 8` to `i <= 10` so the round-robin system picks up all 10 keys.

### Files Modified
- `supabase/functions/_shared/gemini.ts` — one-line change (`8` → `10`)

