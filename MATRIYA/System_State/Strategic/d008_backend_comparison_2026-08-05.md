# D-008 — השוואה מחייבת: matriya-back מול System-Project backend (2026-08-05)

> משימה: "עצרו ingestion ל-matriya-back. בצעו השוואה מחייבת... קבעו backend קנוני אחד... אין להפעיל ingestion לפני החלטת D-008."
> שיטה: clone של שני הרפוזיטוריז והשוואת קוד ישירה (קבצים, גדלים, checksums, קומיטים, מודולים, מסלולי API). כל שורה כאן נמדדה, לא שוערה.

---

## הממצא המבני: אלו לא שתי מערכות — זה fork אחד שקפא ו-fork אחד שחי

בתוך `Matriya-System-Project` קיימת תיקיית `matriya-back/` שהיא **אותה שושלת קוד** של הרפו העצמאי:
- `kernelV16.js` ו-`integrityRulesEngine.js` — **זהים בייט-לבייט** בשניהם.
- הרפו העצמאי קפא ב-**2026-07-04** ("Remove committed node_modules").
- הגרסה במונו-רפו המשיכה להתפתח עד **2026-08-03**, והקומיט האחרון שלה הוא בדיוק העבודה של השערים: *"feat(assumption): GATE 3 partial — declare-at-Breakdown; first live path proven (Breakdown→declaration→resolution→REFUSE-legal→kernel birth→**replay idempotent**; SAME/MC never write; **provenance mandatory**)"*.

## טבלת ההשוואה (כולה 🟢 — נמדד מהקוד)

| ציר | matriya-back (עצמאי) | System-Project backend |
|---|---|---|
| Runtime מדעי | **אין** תיקיית runtime | תיקיית `runtime/` מלאה: ‏governor, ‏replayEngine, ‏eventStore, ‏evidenceEngine, ‏fsm, ‏contractEngine, ‏counterfactualEngine, ‏entropyEngine, ‏noveltyEngine, ‏orchestrator, ‏circuitBreaker ועוד (~25 מודולים) |
| Ledger | אין | `selfEvolutionLedger.js` + נתוני `self-evolution-ledger.jsonl` חיים |
| Replay | אין | `replayEngine.js`; ‏replay idempotent הוכח בקומיט האחרון |
| Provenance | חלקי (researchGate) | "provenance mandatory" — חלק מהמסלול החי שהוכח |
| Assumption (Gate 2/3) | אין | **מסלול חי מוכח**: ‏Breakdown→declaration→resolution→kernel birth |
| RAG | **ריק** ‏(F-003) | **חי**: ‏924 pgvector + ‏4,582 management_vector + OpenAI VS |
| Knowledge Kernel | לא מחווט | חי: ‏456 אובייקטים, ‏414 hashed ‏(REALITY_AUDIT) |
| API | ‏32 routes | ‏75 routes + ‏runtimeRoutes |
| מודולים ייחודיים | `mriEndpoint.js` בלבד (Morning MRI) | ‏agents/, ‏science/, ‏services/, ‏migrations/, ‏experiments/, ‏lab_data/, ‏baselines/ ו-30+ נוספים |
| server.js | ‏78KB | ‏298KB (פי ~4) |
| פעילות | קפוא מ-2026-07-04 | פעיל; קומיט אחרון 2026-08-03 |
| טבלאות | סכמה משותפת-חלקית (SHARED-DB-SETUP בשניהם) | ‏158 טבלאות פרודקשן נמדדו ‏(REALITY_AUDIT) |

**שאלות פתוחות (⚪, לא חוסמות את ההכרעה):** (א) האם שניהם מצביעים על אותו Supabase — ה-configs מונעי-env, לא ניתן לקבוע מהקוד; (ב) איזה קוד רץ בפועל ב-`matriya-back.vercel.app` שה-front מדבר איתו — סביר שהגרסה הקפואה, כלומר **ייתכן שה-UI מדבר היום עם ה-backend הישן**. שתיהן להכרעה בסביבת התפעול.

---

## ההכרעה — D-008

## ✅ ה-backend הקנוני של MATRIYA: ‏`Matriya-System-Project/matriya-back`

זו אינה בחירה בין שתי מערכות מקבילות אלא הכרה במציאות: הרפו העצמאי הוא **snapshot מיושן** של המערכת הקנונית. לפי עקרון פרק 30 ("אין לשכפל מנועי מחקר שכבר קיימים") ולפי כלל ההכרעה של דוד ("matriya-back לא מקבל ingestion עד שמוכחת יכולת ייחודית") — היכולת הייחודית היחידה שנמצאה היא `mriEndpoint.js`, קובץ אחד שניתן להעביר.

### גזירות מיידיות

1. **HOLD מוחלט על ingestion ל-matriya-back העצמאי** — נכנס לתוקף עכשיו (עוגן גם ב-P-004/P-005).
2. **יעד Gate 1 מעודכן:** ‏ingestion, שלוש שאילתות הבדיקה, Evidence, ‏Provenance ו-Replay — כולם מול ה-backend של System-Project.
3. **גורל הרפו העצמאי: ARCHIVE** (לא adapter — אין מה לתווך, זה אותו קוד ישן): להעביר את `mriEndpoint.js` ל-System-Project, להוסיף README-הפניה, ולארכב את הרפו. עד הארכוב — אין לגעת בו.
4. **לוודא לאן ה-front מצביע:** אם `matriya-back.vercel.app` מריץ את הקוד הקפוא — לעדכן את ‏`REACT_APP_API_BASE_URL` ל-deploy של System-Project (יש Dockerfile) או לפרוס את הקנוני ל-vercel. בלי זה ה-UI ימשיך לדבר עם העבר.
5. **חיישן ה-Drive לא מושפע** — הוא חי ברפו ה-front וכותב flow-log בלבד; אבל תור ה-QUEUED_FOR_REVIEW יוזרם לקנוני בלבד.

### עדכון מפת המערכות (תואם פרק 30)

HubSpot (מסחרי) → **MATRIYA = System-Project** (ידע, הסקה, Runtime, החלטות) → מעבדה/מפעל (maneger-*) → Priority (עתידי, ABSENT כרגע)

‏Asset Graph, ‏Business Factory ו-Marketing OS: חזון ומפרט — ייבנו כהרחבות על הקנונית, אחרי בדיקת HubSpot.
