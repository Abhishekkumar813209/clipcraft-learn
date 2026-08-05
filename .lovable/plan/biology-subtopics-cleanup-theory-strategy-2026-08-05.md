# Biology subtopics cleanup + theory strategy

## Problem (data se confirmed)

Biology me 2,566 questions, 22 chapters, lekin **135 alag subtopic labels** hain. Zyadatar duplicate ya noise hain:

- Numbering prefix: `(vii) Arthropoda` vs `Arthropoda`, `(i) Protozoa` vs `Protozoa`
- Source notes: `(ix) Chordata - (d) Mammalia [printed as (vii)(d)]`
- Spelling/case variants: `Platyhelmintnes`, `Animal Tissue` vs `Animal Tissues`, `Angiosperm` vs `Angiosperms`, `Nutrient in Plant` vs `Nutrients in plants`, `Flower/ Fruits` vs `Flower/Fruits`
- Placeholder labels: `General`, `Miscellaneous`, `VERIFY: ...`, aur chapter ka apna naam subtopic ke roop me (`Plant Kingdom` ke andar `Plant Kingdom`)
- Ek hi cheez ke tukde: Human Body me `Blood`, `Blood Circulatory System`, `Blood Circulatory System/ Blood` teen alag

Isi wajah se har chhote subtopic ke liye alag theory banani pad rahi thi — bekaar ka kaam.

## Decision (recommendation)

**Theory ka default unit = CHAPTER.** Subtopic theory sirf un chapters ke liye jahan genuinely bade, alag concepts hain.

Cleanup ke baad sirf 4 chapters me subtopic-level theory rakhi jayegi:

- **Human Body** (~440 Qs) — Digestive, Nervous, Circulatory, Endocrine, Skeleton, Excretory, Respiratory, Reproductive
- **Animal Kingdom** (~270 Qs) — Protozoa, Porifera, Coelenterata, Platyhelminthes, Annelida, Mollusca, Arthropoda, Echinodermata, Chordata
- **Plant Kingdom** (~215 Qs) — Algae, Fungi, Bryophyta, Pteridophyta, Gymnosperm, Angiosperm, Bacteria
- **Plant Physiology** (~130 Qs) — Photosynthesis, Transpiration, Transportation, Nutrition, Hormones, Adaptation, Respiration, Plant Disease

Baaki 18 chapters: **sirf ek chapter-level theory**, koi subtopic theory nahi. Isse ~135 theory jobs se ghat kar ~50 ho jayenge.

## Step 1 — Database normalization

`ssc_chapter_questions` (subject = biology) ke `subtopic` column ko in rules se update karenge:

**Global rules**
- Leading roman-numeral prefix hatao: `(vii) Arthropoda` -> `Arthropoda`
- `[printed as ...]` jaisa bracket note hatao
- `VERIFY: ` prefix hatao
- `General`, `Miscellaneous`, chapter-ka-apna-naam, aur khaali value -> sab `General` me merge (single bucket per chapter)

**Chapter-specific merges**

| Chapter | Merge |
|---|---|
| Animal Kingdom | `Chordata - Mammalia/Reptiles/Amphibia/Aves/Pisces`, aur standalone `Mammalia/Reptiles/Amphibia/Aves/Pisces` -> `Chordata`; `Platyhelmintnes` -> `Platyhelminthes`; `Aschelminthes`, `Animal Physiology`, `Animal Classification` -> `General` |
| Tissues | sirf `Animal Tissues` aur `Plant Tissues` (singular variants merge) |
| Chromosome | sab -> single (koi subtopic nahi, chapter-level) |
| Genetics | sab -> single |
| Organic-Evolution | sab -> single |
| Taxonomy | sab -> single (`Protozoa` bhi General me) |
| Origin of Life | single |
| Biomolecule | `Nucleic Acids R.N.A./D.N.A` variants -> `Nucleic Acids (DNA/RNA)`; baaki as-is |
| Cell | `Cell Structure and Organelles`, `Genetics and Plasmids`, chapter-naam -> `General`; `Animal Cell` / `Plant Cell` rahenge |
| Human Body | `Blood`, `Blood Circulatory System`, `Blood Circulatory System/ Blood` -> `Circulatory System & Blood`; `(i) Digestive System` -> `Digestive System`; `VERIFY: Respiratory System` -> `Respiratory System`; `Life Processes`, `General`, `Miscellaneous` -> `General` |
| Human Diseases | `Bacterial Infections`, `Viral Diseases` -> `Disease and Symptoms`; `Treatments` alag rahega |
| Vitamins and Nutrition | `Vitamin and Nutrition` + `Vitamins and Nutrition` + `General` + `Miscellaneous` + `Minerals` + `Carbohydrate` + `Biomolecules & Artificial Sweeteners` + `Nutrient in Plant` -> ek `Vitamins and Nutrition`; `Disease and Symptoms` + `Nutritional Deficiency Diseases` -> `Deficiency Diseases` |
| Plant Kingdom | `Angiosperms` -> `Angiosperm`; `Fungi & Economic Importance` -> `Fungi`; chapter-naam -> `General` |
| Plant Morphology | `Flower/ Fruits` -> `Flower/Fruits`; chapter-naam -> `General` |
| Plant Physiology | `Nutrients in plants` -> `Nutrient in Plant`; `Plant Movements` -> `Adaptation in Plants` |
| Ecology and Environment | `Ecosystem and Food Chain`, `Abiotic & Biotic Components`, `Trophic Levels` -> `Ecosystem` |
| Reproduction in flowering Plants | sab -> single |
| Economical Importance / Major Biologist / Major Branches / Miscellaneous / Genetic Engineering | sab -> single |

Purani `ssc_chapter_theory` rows jinke subtopic ab exist nahi karte, wo delete kar denge (stale theory).

## Step 2 — UI changes

- `src/pages/SscBiology.tsx`: chapter card tabhi expandable hoga jab us chapter me 2+ real subtopics hon. Single-subtopic chapters seedha Quiz + Theory buttons dikhayenge, koi expand arrow nahi.
- Subtopic row par Theory button tabhi dikhega jab us subtopic ki theory actually exist karti ho; warna sirf Quiz.
- `src/pages/admin/AdminSscTheory.tsx`: "All pending subtopics" ab sirf un chapters ke subtopics queue karega jo subtopic-theory ke liye eligible hain (upar wale 4 chapters). Header me ye count clearly dikhega.

## Technical notes

- Step 1 ek data-update operation hai (`UPDATE ... SET subtopic = ...`), schema change nahi — table structure waisa hi rahega.
- `fetchSscChapters` already subtopic ke naam se group karta hai, to normalization ke baad UI automatically clean list dikhayega — us function me change ki zarurat nahi.
- Eligible-chapters ki list `src/lib/sscChapters.ts` me ek exported constant hogi, taki UI aur admin dono ek hi source use karein.
- Questions, serial numbers, aur existing chapter-level theory par koi asar nahi — sirf subtopic labels badlenge.
