# Gate 1 — Runbook לביצוע (מעודכן 2026-08-07)

> להרצה מסביבה עם גישה ל-backend (מחשב מקומי / Cowork). כל שלב עם פקודת אימות. היעד: הקנונית (D-008) בלבד.

## שלב 0 — תנאי פתיחה (חד-פעמי)
- [ ] **Secrets:** רפו `matriya-front-` → Settings → Secrets and variables → Actions → טאב **Secrets** (לא Variables) → ‏`GOOGLE_CLIENT_ID`, ‏`GOOGLE_CLIENT_SECRET`, ‏`GOOGLE_REFRESH_TOKEN`. ‏אימות: הריצה הבאה של matriya-drive-intake מציגה בסיכום `QUEUED_FOR_REVIEW` או `0 new` — לא `SKIPPED`.
- [ ] **אמת פריסה:** לבדוק מה רץ ב-`matriya-back.vercel.app` ‏(`GET /health` + השוואת sha). אם זה ה-fork הקפוא — לפרוס את הקנונית (יש Dockerfile) ולעדכן `REACT_APP_API_BASE_URL`.
- [ ] **רוטציית סודות (P-002 + ממצא הנוזקה):** ‏Supabase JWTs, מפתחות `.env` של ה-OS, וכל סוד שחי בסביבת הפרודקשן לפני 12.7 — להחליף.

## שלב 1 — ingestion (לקנונית בלבד)
- [ ] גרירת 14 הפרקים מ-`MATRIYA/Corpus_Canonical/chapters/` לתיקיית Drive ‏`MATRIYA_Canonical_Chapters_2026-08-05`.
- [ ] העלאת robust-core (6 המאומתים + השלמת רשימת ה-13 מארטיפקט האודיט) דרך UploadTab / ‏`POST /ingest/file`.
- [ ] אימות: ‏`GET /collection/info` מציג count>0; רישום המספר.

## שלב 2 — שלוש שאילתות הבדיקה (פעמיים כל אחת)
1. "מה הרכב הפורמולציה בניסוי INTUMESCENT 2026-04-26?"
2. "מה תוצאות דוח 25IC0391 על חמשת הצבעים?"
3. "מה קובע פרק 30 לגבי System of Record מול System of Reasoning?"

לכל שאילתה לתעד: מסמכים שאותרו · ‏Evidence · מקור+Provenance · האם ריצה 2 = ריצה 1 (Replay).

## שלב 3 — עדכון מצב
- [ ] ‏knowledge.json: ‏KUR, ‏coverage לפי הספירה בפועל.
- [ ] ‏integrations.json: ‏Drive sensor → Connected.
- [ ] ‏gate1_report: הכרעה ✅/❌ + הראיות.
- [ ] commit + push לענף `claude/matriya-status-plan-2dhnfr`.

## קריטריון סגירה (בינארי)
‏Gate 1 סגור ⇔ ‏coverage>0 ∧ שלוש השאילתות החזירו Evidence עם מקור ∧ ‏Replay זהה בשתי ריצות ∧ החיישן ok:true. אחרת — פתוח, בלי קיצורי דרך.
