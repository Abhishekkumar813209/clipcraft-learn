# Add Hints for 200 Idioms & Phrases

## Goal
Har idiom ke saath ek chhota "hint" store karo (jo tumne 200 numbered lines me diye hain), aur practice screen par answer mark karne se pehle ek **💡 Hint** button dikhe jo woh hint reveal kare.

## 1. Database change
Table: `ssc_black_book_items`

- Naya nullable column `hint text` add karo.
- Sirf `category = 'idiom'` rows ke liye populate karenge — baaki categories NULL rahengi.

## 2. Hint mapping (insertion order)
- Idioms ko `created_at ASC, id ASC` order me fetch karke pehle 200 rows lo.
- Line 1 → 1st idiom, line 2 → 2nd, … line 200 → 200th.
- Migration me ek `WITH ordered AS (SELECT id, row_number() OVER (ORDER BY created_at, id) rn FROM ssc_black_book_items WHERE category='idiom')` + `UPDATE … FROM (VALUES (1,'…'),(2,'…'),…(200,'…')) v(rn,hint)` pattern use karenge — ek hi migration me saare 200 hints seed ho jayenge.
- Agar DB me 200 se kam idioms hain to extra hints skip ho jaayenge (safe).
- Re-run safety: `UPDATE` idempotent hai; column already exists check ke saath `ADD COLUMN IF NOT EXISTS`.

## 3. Types
`src/integrations/supabase/types.ts` auto-regen ho jayega migration approve hone ke baad — usme `hint: string | null` add ho jayega `ssc_black_book_items` row me.

## 4. Practice UI change — `src/pages/BlackBookPractice.tsx`

State: pehle se `picked` (selected option index or null) available hai. `picked === null` ka matlab "abhi answer nahi diya".

- Har current question ke saath uska `hint` bhi fetch karo (already `fetchBBItems` idiom rows return karta hai — bas hint field include karna hai).
- Question card ke andar, options ke ऊpar ek chhota inline button:
  ```
  [💡 Hint]
  ```
  - Sirf tab dikhe jab:
    - `category === 'idiom'` (ya current question ka category idiom hai — mixed mode ke liye)
    - `currentItem.hint` non-empty hai
    - `picked === null` (answer abhi mark nahi hua)
  - Click karne par local state `hintShown` true ho jaye → button ke neeche italic emerald-tinted line me hint text dikhe.
  - Naya question load hote hi `hintShown` reset ho jaye.
- Answer mark hone ke baad hint button hide ho jaye (distraction na ho); Hindi meaning wala existing double-tap flow as-is chalega.

## 5. Kya nahi chhoo rahe
- Hindi/Hinglish meaning wala flow, history page, roots practice — koi change nahi.
- Baaki categories (syn_ant, ows, word) — koi hint UI nahi.

## Technical summary
```text
Migration
├── ALTER TABLE ssc_black_book_items ADD COLUMN IF NOT EXISTS hint text
└── UPDATE …idiom rows by row_number ordering with VALUES(1..200, '…')

Frontend (BlackBookPractice.tsx)
├── fetchBBItems: ensure `hint` included in select
├── currentItem.hint + picked === null + category idiom → render 💡 Hint button
├── local useState hintShown; reset on question change
└── No other files touched
```

## Open confirmation
Mixed-category practice me bhi jab idiom question aaye tab hint button dikhe — yehi assume kar raha hoon. Agar sirf pure "Idioms only" practice me chahiye to bata dena, condition tighten kar dunga.
