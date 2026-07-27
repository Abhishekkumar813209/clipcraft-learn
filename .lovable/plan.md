## Goal
UPSC extraction template aur prompt ko chhota karna — 3 columns hata ke fresh downloadable files dena.

## Columns hatane hain
- `ncert_refs` (chapter-level reference list)
- `explanation_en` (PDF ka original English "Exp." text)
- `exam_tags` (past-exam tags)

`ncert_source` (per-question bracketed reference) aur `ncert_extra` (Hinglish background) rahenge.

## Final column order (22)
```text
chapter_no, chapter_name, topic_tag, serial_no, q_type,
question_text, statements, list_i, list_ii,
option_a, option_b, option_c, option_d, correct_option,
ncert_source, explanation_hinglish,
why_a, why_b, why_c, why_d, ncert_extra, hint_hinglish
```

## Deliverables
1. `upsc_mcq_sample_template_v2.xlsx`
   - Sheet `questions` — wahi 5 sample rows (mcq, statement, match, assertion, multi_select) naye 22-column layout me, header styling + column widths + wrap intact.
   - Sheet `README` — har column ka rule, updated list ke hisaab se.
2. `upsc_pdf_to_excel_prompt_v2.md`
   - Column list 25 → 22, numbering re-flow.
   - Rule 8 (exam_tags) aur rule 9 (explanation_en) delete.
   - `explanation_hinglish` rule ab self-sufficient: PDF ke English "Exp." ko padh kar seedha Hinglish me richer version likhna (English column output me nahi jayega).
   - Rule 14 se `ncert_refs` ka mention hata.
   - "Do NOT add a difficulty column" ke saath "Do NOT add exam_tags / explanation_en / ncert_refs" bhi.
   - Quality-check checklist updated column count ke saath.

## Verification
Generated xlsx ko padh kar column order + row count confirm karunga, aur dono files artifact ke roop me dunga.
