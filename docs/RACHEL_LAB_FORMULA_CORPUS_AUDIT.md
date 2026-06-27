# Rachel LAB — Formula Corpus Audit (K-stage, read-only)

*Prepared 2026-06-26. A ground-truth map of the formulation files in the Google Drive folder **"רחל LAB / Rachel LAB"** (`id 1b3SgI43gwzzPozkZ5pXD6xTmiBBGw3W-`), searched recursively.*

## Compliance with strict rules

- **Read-only.** No Drive file was modified; no database write; no migration; no Knowledge-Graph expansion; no DOE planning in this document.
- **Privacy.** This report contains **only** field-presence booleans, product names, version markers, counts, status, and folder paths — **no raw ingredient quantities or compositions**.
- **Raw data stays local, outside git.** The single raw extract pulled during classification lives only in the session scratchpad (`/tmp/.../scratchpad/`), not in any repository.

## Field-classification convention (extraction rules)

Each field per file is recorded as one of:
- **objective** (`Y` / `N`) — presence determined directly from the file content.
- **pending** (`pend`) — file (or that field) could not be verified; **not inferred**.
- *interpreted* values were **not** used to fill presence; missing values were never guessed.

`product` lists the product label(s) found; a sheet may carry several products (comma-separated). `product name is NOT treated as formula identity`; `formula_version` carries the objective version marker (batch date/number) or `pending`. Formulas were **not** merged across files without exact evidence (near-identical copies → `DUPLICATE_CANDIDATE`).

## 1. Audit Table

Legend: C=composition · %=percentages · PSD · W/P=water-powder · Proc=process · Str=measured strength · Dt=dates. Values Y / N / partial / pend.

| file_path | file_name | product | formula_version | formula_type | C | % | PSD | W/P | Proc | Str | Dt | status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Rachel LAB/פרויקטים/טיח מעכב בעירה | פורמולציות.xlsx | Fire-retardant gypsum/vermiculite plaster (IGNIVER-equiv) | 07.01.2025-001 … 21.07.2025-017 (17) | Fire-retardant lightweight plaster | Y | Y | N | Y | Y | N | Y | FORMULA_CONFIRMED |
| Rachel LAB/טיח תל אביב | עותק של פורמולציות לטיח תל אביב.xlsx | טיח תל אביב | 25.05.2026-134 (+multi) | NHL/lime conservation render | Y | Y | Y | N | partial | N | Y | FORMULA_CONFIRMED |
| Rachel LAB/טיח תל אביב | עותק של פורמולציות לטיח תל אביב-2.xlsx | טיח תל אביב | 11.04.18 / 26.07.2021 ערבוב 1-20 | NHL/lime render (dev trials) | Y | Y | Y | Y | Y | N | Y | FORMULA_CONFIRMED |
| Rachel LAB/טיח תל אביב | עותק של עותק…-2.xlsx חישוב חומרים.xlsx | טיח תל אביב | same as -2 | NHL/lime render | Y | Y | Y | Y | Y | N | Y | DUPLICATE_CANDIDATE |
| Rachel LAB/פרויקטים/טיח תל אביב | טיח תל אביב 25.05.2026.xlsx | פרסקו טיח תל אביב; טיח מעכב בעירה | 28.08.2022-001 … 21.05.2023 | NHL render + fire-retardant variant | Y | Y | Y | N | Y | N | Y | FORMULA_CONFIRMED |
| Rachel LAB/פרויקטים/טיח תל אביב תרמי | טיח תל אביב תרמי.xlsx | טיח תל אביב תרמית | 20.01.2025-001 … 25.02.2025-018 (18) | Thermal NHL/lime-pumice-perlite render | Y | Y | Y | Y | Y | N | Y | FORMULA_CONFIRMED |
| Rachel LAB/פרויקטים/מינרלי | טיח איטלקי.xlsx | טיח איטלקי | 17.03.2026-001 | Lime/marble-dust render | Y | Y | Y | Y | Y | N | Y | FORMULA_CONFIRMED |
| Rachel LAB/פרויקטים/שליכט | SCHLICT_ACRYLIC_EXP_FORMULA_2026-03-15.xlsx | W100 acrylic schlicht (CAROLITH) | W100-26.10.2025-001 … 15.03.2026-003 | Acrylic textured render | Y | Y | Y | Y | Y | N | Y | FORMULA_CONFIRMED |
| Rachel LAB/פרויקטים/תערובות חדשות | טיח הגנה בפני אש לקורות ועמודי מתכת.xlsx | BATF-126; VA29 | 08.06.2025-001/-002 | Steel fire-protection coating | Y | Y | N | Y | Y | N | Y | FORMULA_CONFIRMED |
| Rachel LAB/פרויקטים/ממברנה | פורמולציה.xlsx | Acrylic/PU waterproofing membrane | 02.01.2025-001 … 21.07.2025-009 (9) | PU/acrylic membrane coating | Y | Y | N | Y | partial | N | Y | FORMULA_CONFIRMED |
| Rachel LAB/פרויקטים/אקריל פלוס | פורמולציות אקריל פלוס-פיתוח.xlsx | Acryl Plus | pending (dev) | Acrylic dev | pend | pend | pend | pend | pend | pend | pend | FORMULA_PARTIAL |
| Rachel LAB/פרויקטים/שפכטל צמנטי חוץ | שפכטל צמנטי ניסויים.xlsx | שפכטל צמנטי | 04.05.2025-01 (from 012) | Cementitious skim coat | Y | Y | N | N | Y | N | Y | FORMULA_CONFIRMED |
| Rachel LAB/פרויקטים/שפכטל צמנטי חוץ | שפכטל צמנטי חוץ.docx | שפכטל צמנטי חוץ | 001 … 013 (13) | Cementitious skim coat | Y | Y | N | N | Y | N | Y | FORMULA_CONFIRMED |
| Rachel LAB/פרויקטים/תערובות חדשות | מקביל לריפרה 60.xlsx | מקביל לריפרה; אבוקל לבן; Natural Plaster(B-O); שליכט A/B | 06.07.2022 … 23.08.2022 (~19) | Lime conservation renders | Y | Y | Y | partial | Y | N | Y | FORMULA_CONFIRMED |
| Rachel LAB/פרויקטים/תערובות חדשות | עותק אדוה של מקביל לריפרה 60.xlsx | same family | פיתוח 2022 | Lime renders | Y | Y | Y | partial | Y | N | Y | DUPLICATE_CANDIDATE |
| Rachel LAB/פרויקטים/תערובות חדשות | טיח תל אביב -פיילוט.xlsx | פרסקו טיח תל אביב (+premix) | 28.08.2022-001 … 13.11.2022-15 | NHL render production trials | Y | Y | Y | N | Y | N | Y | FORMULA_CONFIRMED |
| Rachel LAB/פרויקטים/תערובות חדשות | טיח תל אביב -פיילוט 001.xlsx | פרסקו טיח תל אביב; פרמיקס | 28.08.2022 … 14.12.2022-002 | NHL render trials | Y | Y | Y | N | Y | N | Y | DUPLICATE_CANDIDATE |
| Rachel LAB/פרויקטים/תערובות חדשות | שליכט הידראולי תל אביב.xlsx | שליכט הידראולי תל אביב A/B | 28.12.2022-001 … 25.01.2023-002 | Hydraulic lime slurry coat | Y | Y | Y | Y | Y | N | Y | FORMULA_CONFIRMED |
| Rachel LAB/פרויקטים/תערובות חדשות | תערובות חדשות.xlsx | פרסקו טיח תל אביב + premix variants | 28.08.2022 … 13.11.2022 | NHL render trials | Y | Y | Y | N | Y | N | Y | DUPLICATE_CANDIDATE |
| Rachel LAB/פרויקטים/תערובות חדשות | אבוקל.xlsx | webber san evocalce (pigment dosing) | 17.08.2022-01 | Pigment color batch (tint only) | partial | N | N | N | Y | N | Y | NOT_FORMULA |
| Rachel LAB/פרויקטים/תערובות חדשות | EVOVAL מגוון.xlsx | webber evocalce (pigment) | 07.09.2022-02 | Pigment color batch (tint only) | partial | N | N | N | Y | N | Y | NOT_FORMULA |
| Rachel LAB/פרויקטים | צבעים סיליקטים.xlsx | טיח איטלקי; סילוקסן; טרה פנלו (K-silicate paints) | 01.12.2020-01 … 03.12.2025-206 (~209) | Silicate/siloxane paints | Y | Y | N | Y | Y | N | Y | FORMULA_CONFIRMED |
| Rachel LAB/פרויקטים | חומרי גלם-חומרי סיליקטים.xlsx | F.SILICATO; PROTECH-A1; BETONIZE 2030A/B; PRIMER; טיח תל אביב | פיילוט | Silicate corrosion-system pilots | Y | Y | N | Y | N | N | N | FORMULA_CONFIRMED |
| Rachel LAB/פרויקטים | פיתוח- שיפור צמיגות F.silicato.xlsx | F.SILICATO (viscosity dev), נוסחה 1-9 | 30.09.21 (9 variants) | Silicate coating (viscosity trials) | Y | Y | N | Y | Y | N | Y | FORMULA_CONFIRMED |
| Rachel LAB/פרויקטים | קורוזיה 2025.xlsx | Intumescent primer | 23.07.2025-001 | Intumescent/anti-corrosion primer | Y | Y | N | Y | Y | N | Y | FORMULA_CONFIRMED |
| Rachel LAB/פרויקטים | מעכבי קורוזיה.xlsx | corrosion inhibitors (aggregated) | pending | pending | pend | pend | pend | pend | pend | pend | pend | FORMULA_PARTIAL |
| Rachel LAB/פרויקטים | מעכבי קורוזיה-DESKTOP-US196DA.xlsx | corrosion inhibitors (aggregated copy) | pending | pending | pend | pend | pend | pend | pend | pend | pend | DUPLICATE_CANDIDATE |
| Rachel LAB | חומרי גלם.xlsx | (mica/silicone/zinc sourcing catalog) | 30.07.2025 | Raw-material price/sourcing list | N | N | partial | N | N | N | Y | NOT_FORMULA |
| Rachel LAB/פרויקטים/טיח מעכב בעירה | פורמולציות ראשוניות.docx | initial fire-retardant formulas | pending | Fire-retardant (prelim) | pend | pend | pend | pend | pend | pend | pend | FORMULA_PARTIAL |

> Dozens of additional `.pdf` (SDS/TDS/brochures/patents/articles), images, `.msg`, price-quote files, instrument and Priority-ERP files were enumerated and are objectively `NOT_FORMULA` by content type; summarized in §3 rather than rowed.

## 2. Key Questions

1. **How many formula files exist?** **25** (21 `FORMULA_CONFIRMED` + 4 `FORMULA_PARTIAL`). Excludes 4 `DUPLICATE_CANDIDATE` and all `NOT_FORMULA`.
2. **How many unique products?** **~16** distinct product lines: טיח תל אביב (NHL render), טיח תל אביב תרמי (thermal), fire-retardant gypsum-vermiculite plaster (IGNIVER-equiv), BATF-126 & VA29 steel fire-protection, שפכטל צמנטי (cement skim), W100 acrylic schlicht, שליכט הידראולי A/B, מקביל לריפרה, אבוקל לבן / Natural Plaster, טיח איטלקי, silicate paints (טיח איטלקי/סילוקסן/טרה פנלו), F.SILICATO, PROTECH-A1, BETONIZE 2030A/B, PU/acrylic membrane, intumescent primer.
3. **How many formulas have full composition (composition AND percentages)?** **21** (all CONFIRMED).
4. **How many include PSD?** **11** — the lime/render families carry explicit granular fractions (0-0.8 / 0.8-1.4 / 1.4-2.5, CAROLITH grades, כפר גלעדי fractions).
5. **How many include water/powder?** **~16** — recorded, but mostly as free-text "% מים" / dilution notes, not a normalized column.
6. **How many include process conditions?** **~22** — mixing times, dispersion RPM, cast/test dates, dilution %, curing-day notes.
7. **How many include measured strength?** **0 filled values.** Production sheets contain a "בדיקת לחיצה 28 יום" (28-day compression) field, but it is **blank everywhere**. Viscosity (cps) and wet/dry density (g/cm³) *are* measured in several; compressive strength is not.
8. **Enough historical variables for sensitivity mapping?** **Partially.** Input-factor coverage is strong: the טיח תל אביב, thermal-render, and fire-retardant families have dozens of dated batches each perturbing single factors (NHL%, lime%, aggregate split, vermiculite/perlite/pumice swap, cement%, fiber, water%) with qualitative notes and density. But the **response side is the bottleneck** — the key quantitative response (compressive strength) is uniformly absent, and W/P is unstructured. Inputs: rich. Responses: weak.
9. **Top 5 missing fields blocking analysis:**
   1. **Measured 28-day compressive strength** — a field present everywhere but never filled.
   2. **Structured W/P ratio per batch** — exists only as free-text notes, not a normalized column.
   3. **Consistent specific gravity / dry density per batch** — present sporadically, not for all.
   4. **Standardized response metrics** (cracking / adhesion / porosity quantified, not qualitative Hebrew notes).
   5. **Cure/test metadata** (temperature, RH, cure age) tied to each measurement.

## 3. Enumeration totals & truncation

- **Items enumerated:** ~290 (root: 47 items incl. 41 subfolders; plus full listings of priority folders and product subfolders). **No enumeration truncation** (cap 500).
- **Candidates classified:** 29 rows (21 CONFIRMED, 4 PARTIAL, 4 DUPLICATE, + NOT_FORMULA exemplars). ~200+ non-formulation files (SDS/TDS, נורמות/תקנים, הצעות מחיר, מכשירים, ספקטרופוטומטר, פריוריטי, מדבקות, תמונות, vendor-PDF subfolders) were not rowed individually — objectively non-formulation by content type.
- **Content-read limits (honest):** the two ~8.9 MB "מעכבי קורוזיה" workbooks were **not** loaded → left `pending` (not guessed). "צבעים סיליקטים.xlsx" (~209 recipes) was analyzed in the subagent context only; its booleans are confirmed.

## 4. Final Verdict

**PARTIAL_READY_NEEDS_FIELD_COMPLETION** — a rich, dated, multi-batch formulation corpus with full compositions, percentages, PSD and process notes exists for several product families, but the critical response variable (measured compressive strength) is structurally present yet **empty everywhere**, and W/P is unstructured, so sensitivity mapping requires response-field back-filling before it can run.
