

## Plan: 20 More Mandir Templates + Simplified "10 Punchlines Only" Analysis

### 1. Add 20 new Mandir/Religious Approach templates (`src/data/humorTemplates.ts`)

Append IDs 221-240 with category "Approach", all set in mandir/religious contexts:
- Mandir shoe rack confusion, donation box queue, coconut breaking fail, rangoli near mandir, bell ringing turn, flower garland stall, mandir parking chaos, prasad plate sharing, mandir steps resting, havan/yajna smoke, temple pond/kund, mandir anniversary celebration, early morning mandir rush, mandir volunteer/seva, Janmashtami dahi handi, Shivratri night vigil, Chhath Puja ghat, Saraswati Puja pandal, Ram Navami procession, Hanuman Chalisa recitation group

Each template: 8-15 line Hinglish dialogue with situational opener → humor escalation → extended conversation hooks.

### 2. Simplify AI prompt to output ONLY 10 punchlines (`supabase/functions/humor-coach/index.ts`)

Replace the entire SYSTEM_PROMPT with a simplified one that instructs the AI to:
- Read the conversation
- Output exactly 10 numbered punchlines/comebacks the user could use
- No difficulty ratings, no technique breakdowns, no goldmine sections, no practice exercises
- Just: "Here are 10 punchlines for this situation:" followed by numbered list

### 3. Simplify response UI (`src/components/CoachResponse.tsx`)

- Remove goldmine, technique, opportunity, tip section types and their renderers
- Remove `getDifficultyColor` function
- Keep only punchline cards and markdown fallback
- Simplify the parser to just detect numbered punchlines (1-10)
- Clean, minimal UI: coach header + 10 punchline cards

### Files Modified
- `src/data/humorTemplates.ts` — Add 20 Mandir templates (IDs 221-240)
- `supabase/functions/humor-coach/index.ts` — Replace prompt to only ask for 10 punchlines
- `src/components/CoachResponse.tsx` — Strip down to only render punchline cards

