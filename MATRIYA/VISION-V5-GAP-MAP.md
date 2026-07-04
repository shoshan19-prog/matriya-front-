# MATRIYA V5 — מפת פערים: חזון מול מציאות

נגזר מ-[VISION-V5.md](./VISION-V5.md) מול סריקת קוד מלאה של חמשת הריפוזיטוריים.
תאריך סריקה: 2026-07-04. כפוף ל-LAW-EVIDENCE-001: כל שורה מסומנת לפי איכות הראיה שלה.

סימון סטטוס:
- 🟢 **קיים** — קוד רץ + מאגר נתונים אמיתי
- 🟡 **חלקי** — מימוש דק / מוגבל בהיקף / היוריסטי
- 🔵 **Stub** — קיים בשם/כ-mock/כנתונים סטטיים בלבד, ללא מנוע חי
- ⚪ **חסר** — אין קוד ואין נתונים

---

## תמונת מצב בשורה אחת

> שכבות 1–2 (מציאות + זיכרון ארגוני) קיימות באמת — אך במערכת הניהול (`maneger-back-`), לא ב-MATRIYA.
> מנוע הידע (RAG) חי בשני עולמות נפרדים שאינם מאוחדים.
> שכבות 3–4 (ידע עולמי + מנגנונים) ורוב מנועי האינטליגנציה של V5 קיימים כיום **רק כ-mockup סטטי** ב-`public/cockpit/snapshot.json`.

---

## שכבות הידע

| # | שכבה בחזון | סטטוס | הראיה החזקה ביותר |
|---|---|---|---|
| 1 | **המציאות** — ניסויים, פורמולציות, מדידות, תוצאות | 🟢 קיים | `maneger-back-`: טבלאות `lab_experiments` (formula, materials, percentages, `experiment_outcome` ∈ success/failure/partial/production_formula), `experiment_materials` (role + percentage), ייבוא Excel ב-`lib/labExperimentParse.js`, `/import/experiment-excel` |
| 2 | **זיכרון ארגוני** — Material Library | 🟢 קיים | `maneger-back-`: `material_library` + טבלת `materials` מרכזית (aliases, family, role, technology_domain) |
| 2 | זיכרון ארגוני — Decision Memory | 🟡 חלקי | `matriya-back`: `decision_audit_log`, `justification_templates`; `System_State/Decisions/decisions.json` — ברמת המערכת, לא ברמת המעבדה |
| 2 | זיכרון ארגוני — Traceability / Project History | 🟢 קיים | `maneger-back-`: `audit_log`, `runs`, `run_fsm_trace`, `import_log`, `analysis_log` |
| 2 | זיכרון ארגוני — Laboratory Methods | ⚪ חסר | לא נמצאה ישות/טבלה של שיטות מעבדה באף ריפו |
| 3 | **ידע מדעי עולמי** — מאמרים, פטנטים, תקנים, TDS, SDS, רגולציה | 🔵 Stub | מוזכר להמחשה בלבד ב-`cockpit/snapshot.json` (למשל "EN 13381-8 / ISO 834"). אין ingestion, אין טבלאות מקורות, אין חיבור למאגרים חיצוניים |
| 4 | **שכבת המנגנונים** — מנגנון כיחידת ידע ראשונית | 🔵 Stub | קשתות הגרף ב-`cockpit/snapshot.json` נושאות `mechanism` / `competingMechanisms` (כולל "char formation") — אבל זהו JSON סטטי. אין טבלה, אין endpoint, אין מחולל |
| 5 | **גרף הידע** | 🔵→🟡 | מודל הנתונים המלא (`graph.nodes/edges` עם tier/confidence/evidence/deltaK/contradictions) הוא mock ב-cockpit. זרע אמיתי: `experiment_relations` (`derived_from`/`similar_to`/`inspired_by`) + `parent_experiment_id` ב-`maneger-back-` — גרף ניסויים, לא גרף ידע מלא |

---

## מנועי האינטליגנציה

| מנוע בחזון | סטטוס | הראיה החזקה ביותר |
|---|---|---|
| מנוע הידע (RAG) | 🟢 קיים | `matriya-back`: `ragService.js` + `rag_documents` (pgvector 384, מודל מקומי); `maneger-back-`: `lib/ragService.js` + `management_vector` (pgvector 1536, OpenAI). שני מרחבים וקטוריים **נפרדים ולא תואמים** |
| מנוע הידע השלילי | 🟡 חלקי | `maneger-back-`: `/analysis/failure-patterns` (אגרגציית כשלונות לפי domain/material), אזהרת "פורמולה דומה כבר נכשלה" (similarityScore); `matriya-back`: `failure_patterns` כעוגן Kernel בלבד |
| מנוע פערי הידע | 🟡 חלקי | `matriya-back/lib/researchEvidenceGaps.js` (`detectGaps`) — מזהה פערי ראיות באחזור בלבד, לא מפת חזית מדעית ("מה העולם עדיין אינו יודע") |
| מנוע העברת ידע בין תחומים | 🟡 תוך-פרויקטי / 🔵 בין-תחומי | `maneger-back-`: `/analysis/similar-experiments`, `formulation-intelligence` — דמיון בתוך פרויקט בלבד. חוצה-תחומים: mock ב-cockpit (`transfer.candidates`, "structural-similarity-only") |
| מנוע השאלות | 🔵 Stub | `coPilotQuestions` ב-`cockpit/snapshot.json` — סטטי |
| מנוע נגד-אינטואיציה | 🔵 Stub | `observationClasses` (Surprise/Artifact) ב-cockpit; דגל `patches_without_hypothesis` ב-`kernelV16.js` — איתות, לא מנוע. זרע אמיתי: `/analysis/contradictions` ב-`maneger-back-` (אותה פורמולה → תוצאות שונות) |
| מנוע גנאלוגיית הרעיונות | 🟡 חלקי | `maneger-back-`: `parent_experiment_id` + `experiment_relations` — שושלת קיימת בנתונים; אין שכבת הסקה גנאלוגית |
| מנוע חשיבה אבדוקטיבית | ⚪ חסר | אין קוד באף ריפו |
| מנוע הסרנדיפיות | 🔵 Stub | רק תווית "Surprise" ב-observationClasses של ה-cockpit |
| אינטליגנציית פרויקט | 🟡 חלקי | אנליטיקת פרויקטים ב-`maneger-back-` + `System_State/Projects` + `Strategic/*` (momentum/readiness) — ברמת מערכת, לא הבנת-פרויקט מדעית אוטומטית |
| מנוע ההשערות | 🔵 Stub | `topHypothesis`/`proposedHypothesis` (כולל mri, epistemic) ב-cockpit — סטטי. אין טבלת השערות, אין endpoint |
| מנוע התחזיות | 🟡 חלקי | `matriya-back/riskOracle.js` + `/agent/risk` — חוזה סיכון תהליכי (שלמות מחקר), לא תחזית מדעית; אזהרות formula-validate ב-`maneger-back-` |
| מנוע גילוי החוקים | 🔵 Stub | `phases.law`/`lawExamples` ב-cockpit — סטטי. ה-"LAW-*" בקוד הם חוקי משילות (governance), לא גילוי עקרונות מדעיים |

---

## ממצאים מבניים קריטיים

1. **ה-cockpit הוא חזון-כדמו, לא מימוש.** `public/cockpit/snapshot.json` (~14KB) מכיל את *כל* מושגי V5 — מנגנונים, השערות, חוקים, גרף, transfer — אבל ה-README שלו טוען שהוא נוצר ע"י `npm run cockpit:export` מ-`matriya-back`, **וסקריפט כזה אינו קיים**. זהו snapshot שנכתב ידנית. המשמעות החיובית: מודל הנתונים של V5 כבר מעוצב ומוסכם; נותר לבנות את המנועים שמייצרים אותו באמת.

2. **הנתונים האמיתיים של שכבות 1–2 חיים במערכת הניהול, לא ב-MATRIYA.** `lab_experiments`, `experiment_materials`, `materials`, `experiment_relations` — כולם ב-`maneger-back-`. כל מנוע V5 (ידע שלילי, גנאלוגיה, סרנדיפיות) חייב גישה לנתונים האלה. נדרשת החלטה: איחוד, שכפול, או API-bridge (קיים גשר data-only חלקי).

3. **שני מרחבים וקטוריים לא תואמים.** `rag_documents` (384, מקומי) מול `management_vector` (1536, OpenAI). "מיפוי ידע פנימי + ידע עולמי" בזרימת V5 דורש מרחב אחזור אחוד או שכבת federation.

4. **`matriya-system` הוא שלד מת.** ~30 קבצי 0-byte; רק route טריוויאלי אחד חי. מנגד — מבנה התיקיות שלו (rag/formulations/chunks/pipeline: ingest→parse→embed→store) הוא בדיוק הארכיטקטורה הנקייה שמנוע ידע V5 צריך. מועמד טבעי לבנייה מחדש כ-V5 core, או למחיקה (שאלת drift פתוחה מ-2026-07-01).

5. **אין שום ingestion של ידע עולמי.** שכבה 3 כולה — מאמרים, פטנטים, תקנים, TDS/SDS — לא קיימת. זהו הפער הגדול ביותר בין החזון למציאות, והוא תנאי-קדם למנוע פערי הידע ולמנוע העברת הידע הבין-תחומי.

---

## סדר בנייה נגזר (dependency-ordered)

הסדר נובע מתלות בין השכבות, לא מסדר החזון:

1. **איחוד גישה לשכבה 1–2** — מנועי V5 צריכים לקרוא את `lab_experiments`/`materials`/`experiment_relations` (החלטת bridge/merge).
2. **שכבת מנגנונים כישות אמת** — טבלת `mechanisms` + קישור mechanism↔material↔experiment↔evidence. זו "יחידת הידע המרכזית" של V5 והבסיס לכל המנועים.
3. **גרף ידע חי** — הרחבת `experiment_relations` לסכמת nodes/edges של ה-cockpit (tier, confidence, evidence, contradictions), והפיכת `cockpit:export` מ-fiction לאמת.
4. **ingestion ידע עולמי (שכבה 3)** — צינור מקורות: TDS/SDS/תקנים תחילה (כבר קיימים כקבצים בארגון), מאמרים/פטנטים אחר-כך.
5. **מנועים בעלי זרע קיים** (הרחבה, לא בנייה מאפס): ידע שלילי (מ-failure-patterns), גנאלוגיה (מ-experiment_relations), נגד-אינטואיציה (מ-contradictions), פערי ידע (מ-researchEvidenceGaps).
6. **מנועים חדשים**: השערות → שאלות → תחזיות (דירוג) → אבדוקציה → סרנדיפיות → גילוי חוקים. מנוע ההשערות קודם — הוא הצרכן של כל השאר והספק של מנוע החוקים.

---

*מסמך זה הוא תצלום-מצב, לא תוכנית מחייבת. עדכון הבא: אחרי הכרעת שאלת ה-drift של `matriya-system` והחלטת האיחוד של שכבה 1–2.*
