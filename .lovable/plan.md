

## Plan: Add 100 Idioms & Phrases Questions to SSC Practice

### Current State
- 7 idioms_phrases questions exist in the database
- Need to add 93 more high-quality, SSC CGL/CHSL-level idioms & phrases MCQs

### Approach
Create a backend function `seed-ssc-questions` that inserts 100 curated idioms & phrases questions (replacing existing 7 to avoid duplicates). Each question will have:
- 4 options with 1 correct answer
- Difficulty spread: ~30 easy, ~40 medium, ~30 hard
- Explanations for each question
- Exam tags (CGL/CHSL) where relevant

### Implementation

**1. Create edge function `supabase/functions/seed-ssc-questions/index.ts`**
- Accepts a `topic` and `questions` array in the request body
- Deletes existing global questions (user_id = NULL) for that topic to avoid duplicates
- Inserts all new questions with `user_id: null` (global), `is_pyq: false`
- Protected by a simple check (only callable once)

**2. Seed 100 idioms & phrases questions**
- Call the edge function with 100 carefully curated questions covering the most frequently asked SSC idioms:
  - "Burn the midnight oil", "A piece of cake", "Break the ice", "Bite the bullet", "Hit the nail on the head", etc.
- Each with 4 meaning options, correct answer index, and brief explanation
- Mix of difficulty levels matching SSC exam patterns

**3. Cleanup**
- After successful seeding, the function can be reused for future topic batches (one_word_substitution, synonyms_antonyms next)

### Files to Create/Change

| File | Action |
|------|--------|
| `supabase/functions/seed-ssc-questions/index.ts` | Create — reusable seeder function |
| `supabase/config.toml` | Auto-updated for new function |

### Question Format
```json
{
  "question_text": "What does the idiom 'Burn the midnight oil' mean?",
  "options": ["To waste resources", "To work late into the night", "To start a fire", "To cook food"],
  "correct_option": 1,
  "explanation": "'Burn the midnight oil' means to work or study late into the night.",
  "difficulty": "easy",
  "topic": "idioms_phrases",
  "is_pyq": false
}
```

After this batch, the same function will be reused for one_word_substitution and synonyms_antonyms in subsequent prompts.

