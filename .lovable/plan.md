## Problem
Black Book pages (Hub, Practice, Duel, Duel New, Browse, Explanation card) use hardcoded dark slate/blue gradients (`bg-gradient-to-br from-slate-950 via-blue-950/40 to-slate-950`, `bg-slate-900/60`, `text-slate-100`, etc.). Text contrast is poor and vibe is heavy/black.

## New theme: soft white + mint/emerald
- Page bg: `bg-gradient-to-br from-emerald-50 via-white to-teal-50`
- Cards: `bg-white/80 backdrop-blur border border-emerald-100 shadow-sm`
- Headings: `text-slate-900`, body: `text-slate-700`, muted: `text-slate-500`
- Accents: emerald-600/500 for primary actions, teal-500 for secondary, amber-600 for Hindi text (readable on white), rose-600 for antonyms, indigo-600 for idiom accent
- Option buttons in quiz: white with emerald hover; correct = emerald-100/emerald-700; wrong = rose-100/rose-700
- Progress rings/bars: emerald

## Files to update
1. `src/pages/BlackBookHub.tsx` — bg, cards, target ring colors
2. `src/pages/BlackBookPractice.tsx` — bg, question card, option buttons, score chip
3. `src/pages/BlackBookDuel.tsx` — bg, match card, opponent score panel, option buttons
4. `src/pages/BlackBookDuelNew.tsx` — bg, form card
5. `src/pages/BlackBookBrowse.tsx` — bg, search input, category chips
6. `src/components/BlackBookExplanation.tsx` — swap slate-900 surfaces for white/emerald surfaces; adjust badge colors for light bg (emerald/rose/indigo/sky remain but with `bg-*-50 text-*-700 border-*-200`)

## Non-goals
- No changes to logic, routes, quiz generation, or DB.
- Only these 6 files; rest of app theme untouched.
