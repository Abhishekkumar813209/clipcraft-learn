# Admin Question Bank + Adaptive Quiz (Phase 1)

Bhai, ye plan tujhe ek admin-only dashboard dega jaha tu PDF upload karke questions extract karega, books/topics/subtopics ke saath tag karega, aur baad me jo topics tune padhe unhi pe ek "solo adaptive quiz" generate hoga. Live 1v1 baad ke phase me.

## Scope

**In:** Admin gating (sirf tera email), Book/Topic/Subtopic CRUD, PDF upload + generic AI extractor, question review/save, per-user "studied today" tracking, adaptive quiz from studied topics.
**Out:** Live 1v1 invite/lobby/realtime scoring — Phase 2.

---

## 1. Database (new tables)

```text
admin_books            (id, name, exam_tag, description)
admin_topics           (id, book_id → admin_books, name, order_index)
admin_subtopics        (id, topic_id → admin_topics, name, order_index)
admin_questions        (id, book_id, topic_id, subtopic_id, exam_tag,
                        question_text, options jsonb, correct_option,
                        explanation, difficulty, source_pdf_name, created_at)
admin_study_log        (id, user_id, subtopic_id, studied_at, questions_attempted)
```

- RLS: `admin_books/topics/subtopics/questions` — SELECT for `authenticated`, INSERT/UPDATE/DELETE only for admin (checked via `is_admin()` SECURITY DEFINER function that matches `auth.jwt() ->> 'email'` against a single hardcoded email constant in the function body).
- `admin_study_log` — user can SELECT/INSERT own rows only.
- All tables get GRANTs (`authenticated` + `service_role`).

## 2. Admin gating

- `is_admin(uid uuid)` SECURITY DEFINER returns `true` only for your email.
- Frontend: `useIsAdmin()` hook → hide admin routes for everyone else.
- New route group `/admin/*` wrapped in `ProtectedRoute` + admin check.

## 3. Admin Dashboard UI (`/admin`)

```text
/admin              → overview cards (books count, questions count, recent uploads)
/admin/books       → list + "Add Book" dialog (name, exam dropdown: SSC/NQT/BPSC/RBI/Other)
/admin/books/:id   → topics + subtopics manager (inline add/edit/delete, drag-order)
/admin/upload      → PDF upload screen (the main workhorse)
/admin/questions   → browse/edit/delete saved questions, filter by book/topic/subtopic/exam
```

### Upload screen flow
1. Select Exam → Book → Topic → Subtopic (cascading dropdowns from new tables).
2. Drop PDF (+ optional answer-key page hint, like RBI extractor).
3. Click Extract → calls new edge function `admin-question-extract`.
4. Review extracted questions in editable table (question, 4 options, correct, explanation, difficulty).
5. "Save All" → bulk insert into `admin_questions` with the selected tags.

## 4. Edge function: `admin-question-extract`

- New generic function (modeled on existing `pyq-extract` / `rbi-pyq-extract`).
- Uses existing 10-key Gemini rotation + HuggingFace fallback (`_shared/gemini.ts`).
- Verifies caller is admin via JWT → `is_admin()` RPC.
- Input: `{ pdf_base64, exam_tag, hints? }`. Output: array of `{question_text, options[4], correct_option, explanation, difficulty}`.
- `verify_jwt = false` in config.toml + manual JWT validation inside (matches project pattern).

## 5. Study tracking + Adaptive Quiz

- Whenever user opens any existing exam topic page (SSC/NQT/BPSC/RBI practice sessions), also log to `admin_study_log` if that topic is mapped to an admin subtopic. **Simplification for Phase 1:** also add a "Mark as studied" button on each admin subtopic page (`/admin/library/:subtopicId` — read-only library view for all users) so logging is explicit and reliable.
- New page `/quiz/daily` (all users): pulls `admin_study_log` rows for `today` (user's timezone via client), picks N questions from `admin_questions` where `subtopic_id` ∈ studied subtopics, weighted by recency. No AI call → zero quota burn.
- Result screen: score + per-subtopic breakdown + "weak subtopics" list.

## 6. Files

**New**
- `supabase/functions/admin-question-extract/index.ts`
- `src/pages/admin/AdminLayout.tsx`, `AdminDashboard.tsx`, `AdminBooks.tsx`, `AdminBookDetail.tsx`, `AdminUpload.tsx`, `AdminQuestions.tsx`
- `src/pages/DailyQuiz.tsx`
- `src/hooks/useIsAdmin.ts`, `useAdminTaxonomy.ts`
- `src/components/AdminRoute.tsx`

**Edited**
- `src/App.tsx` (new `/admin/*` and `/quiz/daily` routes)
- `src/components/Sidebar.tsx` (admin link visible only if admin; "Daily Quiz" link for all)
- `supabase/config.toml` (register new function with `verify_jwt = false`)

**Migrations**
- 1 migration creating all 5 tables + `is_admin()` + grants + RLS + policies + `updated_at` triggers.

## 7. Out of scope (Phase 2 — live 1v1)
- Realtime invite links, lobby, synced question stream, live scoreboard via Supabase Realtime channels, post-match analysis. Will reuse `admin_questions` as the question pool.

## 8. Open assumptions
- Tera admin email mujhe agle message me batana hoga (ya tu khud function body me hardcode kar lega) — main placeholder `'REPLACE_WITH_YOUR_EMAIL'` rakhunga migration me.
- Subtopic mandatory hai har question pe (cleaner adaptive logic ke liye). Agar optional chahiye to bata.
