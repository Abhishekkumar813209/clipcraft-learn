# Fix SSC Polity theory mapping — full 1006 question coverage

## First, the accusation: questions UPSC ke nahi the

Checked the mapping function directly. It reads questions **only** from the SSC question bank (`ssc_chapter_questions`, filtered by `subject='polity'`). UPSC data is touched in exactly one place: as a **starting draft of the theory text** when SSC theory for a chapter doesn't exist yet. No UPSC question was ever sent for mapping.

So the questions were right. The **coverage** is genuinely broken, and here is the real reason.

## What the database actually shows

SSC Polity bank: **1006 questions across 30 chapters**.

Theory rows exist for only **18 chapters (664 questions)**. **12 chapters (342 questions) have no theory row at all**:

Attorney General/CAG, Commission/Committee, Constituent Assembly, Governor, Legislative Assembly, Legislative Council, Lok Sabha, National Symbol of India, Panchayat Raj System, President / Vice-President, Prime Minister and Council of Ministers, Rajya Sabha.

Worse — of the 18 chapters that do have theory, only **5** carry any `> Covers: Q…` citation, and the total distinct question numbers cited across all of Polity is **87**. Also `question_count` is **0** on every single Polity theory row, so the admin panel had no way to show that anything was missing.

## Root causes

1. **Chapter-name matching is too strict.** The seeding step fuzzy-matches an SSC chapter name against a UPSC chapter name and requires a 0.5 similarity score. SSC uses granular names ("Lok Sabha", "Rajya Sabha", "Governor", "President / Vice-President") while UPSC uses umbrella names ("Union Legislature", "Union Executive", "State Executive"). No match → the function bails out with "no base theory" → the chapter is silently skipped. That's the 342 lost questions.

2. **The chunk loop didn't run to completion.** Mapping walks questions 100 at a time and must be re-invoked until `hasMore` is false. Most chapters got zero or one pass, which is why only 87 question numbers are cited.

3. **`question_count` never updated.** The save step copies the old value (always 0) instead of writing the number of questions actually mapped, so progress was invisible and nothing looked wrong.

## The fix

**1. Explicit chapter mapping instead of fuzzy guessing**
Add a hand-written SSC-chapter → UPSC-chapter table for Polity (and the other GK subjects), so every SSC chapter has a defined UPSC source:
- Lok Sabha, Rajya Sabha, Parliament Miscellaneous → Union Legislature
- President / Vice-President, Prime Minister and Council of Ministers → Union Executive
- Governor → State Executive
- Legislative Assembly, Legislative Council → State Legislature
- Panchayat Raj System → Local Self Government
- Commission/Committee, Attorney General/CAG → Constitutional and Non-Constitutional Bodies
- Constituent Assembly → Making of the Indian Constitution
- National Symbol of India → Miscellaneous
Fuzzy matching stays only as a last-resort fallback.

**2. No chapter gets skipped**
If a chapter has neither SSC theory nor a UPSC source, generate fresh theory from its own SSC questions instead of bailing out. Every chapter ends up with a theory row.

**3. Run the chunk loop to the end**
The admin "Map questions → theory (all)" action keeps re-invoking each chapter until `hasMore` is false before moving to the next chapter, with retry on transient AI failures.

**4. Real coverage counter**
Save the actual number of SSC questions mapped into `question_count`, and show per-chapter coverage in the admin panel as `covered / total` (e.g. `Lok Sabha 59/59`) so any gap is visible immediately.

**5. Re-run Polity end to end**
Run the corrected bulk mapping across all 30 Polity chapters with visible progress, then verify with a database check that all 1006 questions carry a `> Covers:` citation. UPSC theory rows stay untouched throughout.

## Technical notes

- `supabase/functions/ssc-theory-map/index.ts`: add the explicit `SSC_TO_UPSC_CHAPTER` lookup keyed by `subject|chapter`; keep `bestUpscMatch` as fallback; replace the `needsGenerate` early-return with a fresh-generation path; write the true mapped count into `question_count` on upsert.
- `src/pages/admin/AdminSscTheory.tsx`: make the bulk runner loop on `hasMore` per chapter with retry/backoff, and display `covered / total` per chapter.
- Coverage verification query counts distinct `Q(\d+)` matches in `theory_md` against the chapter's SSC question count.
- Same explicit mapping approach then applies to economy, geography and history subjects.
