## Goal

`/ssc/maths` ke har topic card par click karne se ab ek **topic hub** khulega jisme 2 cards honge:

1. **Practice Questions** — existing MCQ practice (`/ssc/practice/:topic`)
2. **Pattern Trainer** — tumhara uploaded HTML file, website ke andar hi render hoga

## Upload guidance (tumhare sawaal ka jawaab)

- **Chapter/topic-wise upload karo — ek HTML per chapter.** Yahi best hai: har file apne topic card ke neeche map ho jaayegi, aur agar ek topic ke multiple chapters hain (e.g. Percentage Part 1 / Part 2), to us topic ke hub me multiple trainer cards dikh jaayenge.
- Ek hi giant merged file mat bhejo — usse na filtering hoti hai, na progress tracking.
- Jo 9 files abhi upload ki hain unka mapping:
  - percentage-p1-305 → Percentage
  - profit-loss-complete → Profit & Loss
  - time-and-work-merged → Time & Work
  - average-merged → Average
  - proportion-till-page50 → Ratio & Proportion
  - time-speed-distance-merged → Time Speed Distance
  - train-pattern-trainer-full → Time Speed Distance (Train chapter)
  - boat-and-stream-50 → Time Speed Distance (Boat & Stream chapter)
  - mixture-alligation-merged → **naya topic card** (Mixture & Alligation) banega

## Kaise render hoga

- Har HTML file `public/trainers/ssc-maths/<slug>.html` me rakhi jaayegi (files self-contained hain — apna CSS/JS andar hi hai).
- App ke andar ek full-height `<iframe>` me load hoga, upar ek slim header bar (back button + title + "Open full screen"), taaki trainer ka apna paper-style design bilkul waisa hi dikhe jaisa tumne banaya hai.
- Mobile par bhi iframe full-width, scroll trainer ke andar.

## Screens

```text
/ssc/maths                 -> topic cards (jaisa abhi hai)
/ssc/maths/:topic          -> NEW hub: [Practice Questions] [Pattern Trainer(s)]
/ssc/maths/:topic/trainer/:slug -> NEW: iframe viewer
```

Agar kisi topic ka trainer nahi hai, uska trainer card "Coming soon" state me dikhega; agar questions 0 hain to questions card disabled dikhega.

## Technical details

- **New file** `src/data/mathsTrainers.ts` — registry: `{ topic, slug, title, subtitle, file }` ka array. Naye HTML aane par bas yahan ek entry + file drop.
- **New page** `src/pages/SscMathsTopicHub.tsx` — topic ke liye 2 (ya zyada) cards, existing card design reuse.
- **New page** `src/pages/SscMathsTrainer.tsx` — header + `<iframe src={/trainers/...} className="w-full h-[calc(100vh-56px)]" />`, sandbox `allow-scripts allow-same-origin`.
- `src/types/ssc.ts` me `mixture_alligation` topic + TOPIC_META entry add.
- `src/pages/SscSubject.tsx` — quant topics ka navigate target `/ssc/maths/:topic` (baaki subjects untouched).
- `src/App.tsx` me 2 naye routes; `maths/calculation` routes pehle match hone chahiye (order maintain).
- Koi DB change nahi; trainers pure static assets.

## Next step

Plan approve karo, main ye 9 files integrate kar dunga. Aage jo bhi naya chapter HTML bhejoge, ek-ek karke us topic ke neeche add hota jaayega.
