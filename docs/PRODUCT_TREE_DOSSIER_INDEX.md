# Product Tree — Dossier Index (K-stage, read-only)

*Prepared 2026-06-26. Re-organizes the scattered Rachel LAB corpus into one dossier per product, so each product's development can be read as a line: **product → versions → formulations → experiments → results → decisions → gaps**. Built only from already-audited Google Drive evidence (`RACHEL_LAB_FORMULA_CORPUS_AUDIT.md`). No files moved, no DB writes, no compositions exposed (file names/paths + field-presence only).*

## Rules honored

- **Read-only.** This document is an index; nothing in Drive or any DB was modified.
- **No invented associations.** Every link carries a confidence tag.
- **Confidence tags:** `VERIFIED` = the product name appears in the named source file and the link is direct · `PARTIAL` = partial/indirect evidence (e.g., file sits in a product-named folder, or the product is one of several in a multi-product sheet) · `UNVERIFIED` = required field that the read content did **not** establish — left as `pending`, never guessed.
- **Every source is named** by file + folder path.
- **SharePoint_slot = pending** for all — fills only once SharePoint access exists.

> Recurring finding across the whole tree: **inputs are rich, the strength response is empty.** Each production sheet carries a "בדיקת לחיצה 28 יום" field that is blank — so `linked_results` is the universal gap (this is exactly what the DOE is meant to generate).

---

## 1. טיח תל אביב — Tel Aviv hydraulic-lime render  *(full first record)*

- **product_name:** טיח תל אביב (NHL / hydraulic-lime conservation render) — `VERIFIED`
- **product_code:** `pending` — `UNVERIFIED` (no official Priority/ERP code seen in read content; do **not** assume it equals the MPZ strength-grade line)
- **known_versions** (`VERIFIED`, by dated batch markers):
  - 11.04.2018 (earliest recipe) → 26.07.2021 (ערבוב 1–20 dev series) → 28.08.2022-001 … 13.11.2022 (pilot/production trials) → **25.05.2026-134 (latest)**
- **linked_formulations** — `VERIFIED`:
  - `Rachel LAB/טיח תל אביב/עותק של פורמולציות לטיח תל אביב.xlsx`
  - `Rachel LAB/טיח תל אביב/עותק של פורמולציות לטיח תל אביב-2.xlsx`
  - `Rachel LAB/פרויקטים/טיח תל אביב/טיח תל אביב 25.05.2026.xlsx` *(also contains a fire-retardant variant)*
  - `Rachel LAB/פרויקטים/תערובות חדשות/טיח תל אביב -פיילוט.xlsx`
- **linked_formulations (duplicates)** — `PARTIAL` (near-identical copies, keep for lineage, do not double-count):
  - `Rachel LAB/טיח תל אביב/עותק של עותק של פורמולציות לטיח תל אביב-2.xlsx חישוב חומרים.xlsx`
  - `Rachel LAB/פרויקטים/תערובות חדשות/טיח תל אביב -פיילוט 001.xlsx`
  - `Rachel LAB/פרויקטים/תערובות חדשות/תערובות חדשות.xlsx`
- **linked_experiments** — `VERIFIED`: the dated dev batches and pilot trials inside the files above are the experiments (each batch = one trial; ~20 mix trials in the 2021 series, multiple 2022 pilot batches).
- **linked_results** — `UNVERIFIED / mostly empty`:
  - `Rachel LAB/בדיקות מעבדה/בדיקת לחיצה.xlsx` contains a "טיח תל אביב" compression section (samples 1–6, 27.07.2021) — but the **strength values are blank** → `PARTIAL` link, **no measured strength**.
  - other quantitative results (density/viscosity) for this product: not established → `pending`.
- **decisions** — `PARTIAL`: the sheets carry qualitative process notes / mixing instructions (e.g. mixing time, water-to-consistency), but **no structured decision log** (why a version was chosen/rejected) → `pending` for structured decisions.
- **source_files:** all paths listed above (formulations + duplicates + `בדיקת לחיצה.xlsx`).
- **open_gaps:** ① 28-day compressive strength (field present, empty) · ② structured W/P per batch (only free-text "% מים") · ③ official product_code · ④ structured decision/rationale log · ⑤ standardized outcome metrics (cracking/adhesion).
- **SharePoint_slot:** `pending` (until SharePoint access).

---

## 2–13. Other products (same schema, compact)

Legend per row: `[code]` = product_code (`pending` unless a code literally appears). Sources by path. Confidence tags inline.

### 2. טיח תל אביב תרמי — thermal render
- code: `pending`(UNVERIFIED) · versions: 20.01.2025-001 … 25.02.2025-018 (18) `VERIFIED`
- formulations: `Rachel LAB/פרויקטים/טיח תל אביב תרמי/טיח תל אביב תרמי.xlsx` `VERIFIED` · experiments: 18 dated batches `VERIFIED` · results: `pending`(no strength) · decisions: `PARTIAL`(notes) · gaps: strength, structured W/P · SharePoint: pending

### 3. טיח מעכב בעירה — fire-retardant gypsum/vermiculite plaster
- code: `pending` (IGNIVER-equivalent, UNVERIFIED) · versions: 07.01.2025-001 … 21.07.2025-017 (17) `VERIFIED`
- formulations: `Rachel LAB/פרויקטים/טיח מעכב בעירה/פורמולציות.xlsx` `VERIFIED`; `…/פורמולציות ראשוניות.docx` `PARTIAL` · experiments: 17 batches `VERIFIED` · results: `pending` · decisions: `PARTIAL` · gaps: PSD, strength · SharePoint: pending

### 4. הגנת-אש לפלדה — steel fire-protection
- code: **BATF-126, VA29** `VERIFIED` · versions: 08.06.2025-001/-002 `VERIFIED`
- formulations: `Rachel LAB/פרויקטים/תערובות חדשות/טיח הגנה בפני אש לקורות ועמודי מתכת.xlsx` `VERIFIED` · experiments: ≥2 batches `VERIFIED` · results: `pending` · decisions: `PARTIAL` · gaps: PSD, strength · SharePoint: pending

### 5. שפכטל צמנטי — cementitious skim coat
- code: `pending` · versions: 001 … 013 (2025) `VERIFIED`
- formulations: `Rachel LAB/פרויקטים/שפכטל צמנטי חוץ/שפכטל צמנטי ניסויים.xlsx` `VERIFIED`; `…/שפכטל צמנטי חוץ.docx` `VERIFIED` · experiments: 13 batches `VERIFIED` · results: `pending` · decisions: `PARTIAL` · gaps: W/P, strength · SharePoint: pending

### 6. שליכט W100 — acrylic textured render
- code: **W100** `VERIFIED` · versions: W100-26.10.2025-001 … 15.03.2026-003 `VERIFIED`
- formulations: `Rachel LAB/פרויקטים/שליכט/SCHLICT_ACRYLIC_EXP_FORMULA_2026-03-15.xlsx` `VERIFIED` · experiments: dated batches `VERIFIED` · results: `pending` · decisions: `PARTIAL` · gaps: strength · SharePoint: pending

### 7. שליכט הידראולי תל אביב A/B
- code: `pending` · versions: 28.12.2022-001 … 25.01.2023-002 `VERIFIED`
- formulations: `Rachel LAB/פרויקטים/תערובות חדשות/שליכט הידראולי תל אביב.xlsx` `VERIFIED` · experiments: dated batches `VERIFIED` · results: `pending` · decisions: `PARTIAL` · gaps: strength · SharePoint: pending

### 8. מקביל לריפרה / אבוקל לבן / Natural Plaster — lime conservation renders
- code: `pending` · versions: 06.07.2022 … 23.08.2022 (~19) `VERIFIED`
- formulations: `Rachel LAB/פרויקטים/תערובות חדשות/מקביל לריפרה 60.xlsx` `VERIFIED`; `…/עותק אדוה של מקביל לריפרה 60.xlsx` `PARTIAL`(duplicate) · note: multi-product sheet (מקביל לריפרה, אבוקל לבן, Natural Plaster, שליכט A/B) → per-product split `PARTIAL` · results: `pending` · decisions: `PARTIAL` · gaps: W/P, strength · SharePoint: pending

### 9. טיח איטלקי — lime/marble-dust render
- code: `pending` · versions: 17.03.2026-001 `VERIFIED`
- formulations: `Rachel LAB/פרויקטים/מינרלי/טיח איטלקי.xlsx` `VERIFIED` · experiments: ≥1 `VERIFIED` · results: `pending` · decisions: `PARTIAL` · gaps: strength · SharePoint: pending
- ⚠ name-collision: "טיח איטלקי" also appears as a *silicate-paint* shade in product #10 — keep separate (`PARTIAL` distinction)

### 10. צבעים סיליקטיים — potassium-silicate / siloxane paints
- code: `pending` (shades: טיח איטלקי, סילוקסן, טרה פנלו) · versions: 01.12.2020-01 … 03.12.2025-206 (~209) `VERIFIED`
- formulations: `Rachel LAB/פרויקטים/צבעים סיליקטים.xlsx` `VERIFIED` · experiments: ~209 recipes `VERIFIED` · results: `pending`(some viscosity) · decisions: `PARTIAL` · gaps: PSD, strength · SharePoint: pending

### 11. F.SILICATO / PROTECH-A1 / BETONIZE 2030A/B — silicate corrosion system
- code: **F.SILICATO, PROTECH-A1, BETONIZE 2030A, BETONIZE 2030-B** `VERIFIED` · versions: 30.09.2021 (9 viscosity variants) `VERIFIED`
- formulations: `Rachel LAB/פרויקטים/חומרי גלם-חומרי סיליקטים.xlsx` `VERIFIED`; `…/פיתוח- שיפור צמיגות F.silicato.xlsx` `VERIFIED` · experiments: 9 viscosity variants `VERIFIED` · results: **viscosity + SG measured** `PARTIAL` (no strength) · decisions: `PARTIAL` · gaps: PSD, strength · SharePoint: pending

### 12. ממברנה — PU/acrylic waterproofing membrane
- code: `pending` · versions: 02.01.2025-001 … 21.07.2025-009 (9) `VERIFIED`
- formulations: `Rachel LAB/פרויקטים/ממברנה/פורמולציה.xlsx` `VERIFIED` · experiments: 9 batches `VERIFIED` · results: `pending` · decisions: `PARTIAL` · gaps: PSD, strength · SharePoint: pending

### 13. Primer אינטומסנטי / מעכבי קורוזיה — intumescent / anti-corrosion primer
- code: `pending` · versions: 23.07.2025-001 `VERIFIED`
- formulations: `Rachel LAB/פרויקטים/קורוזיה 2025.xlsx` `VERIFIED`; `Rachel LAB/פרויקטים/מעכבי קורוזיה.xlsx` `UNVERIFIED`(file unread — ~8.9 MB, left pending); `…-DESKTOP-US196DA.xlsx` `PARTIAL`(duplicate) · experiments: ≥1 `VERIFIED` · results: `pending` · decisions: `PARTIAL` · gaps: strength, read the 2 large files · SharePoint: pending

---

## Index summary

- **Products indexed:** 13 (each with versions + ≥1 named source).
- **Coverage by field (across the 13):** linked_formulations `VERIFIED` for all 13 · known_versions `VERIFIED` for 12 (1 partial) · product_code `VERIFIED` for 3 (BATF/VA29, W100, F.SILICATO family), `pending` for 10 · linked_results `VERIFIED` for **0** (strength empty everywhere; viscosity/SG partial in 2) · decisions structured `VERIFIED` for **0** (`PARTIAL` qualitative notes only).
- **Universal open_gaps:** ① 28-day strength (empty) · ② structured W/P · ③ official product codes · ④ structured decision/rationale log · ⑤ SharePoint sources (pending access).
- **`UNVERIFIED` items left as `pending` (not invented):** all product codes except 3; all structured decision logs; the 2 unread corrosion workbooks; any per-product split inside multi-product sheets (#8, #10).

## What this unlocks (no action taken here)

This index is the missing MATRIYA substrate: development is now **associated to products**, longitudinally. Two follow-ups, each opt-in and separate:
- **Materialize** (write): create a real Drive folder per product and **copy** (not move) its source files in — only on explicit go-ahead.
- **SharePoint merge:** once access exists, append each product's SharePoint files into its `SharePoint_slot`.
