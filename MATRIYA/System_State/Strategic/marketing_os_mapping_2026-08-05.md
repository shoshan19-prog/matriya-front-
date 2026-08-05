# אימות "Fresco Marketing OS" ומיפוי מול MATRIYA (2026-08-05)

> משימה: לא לבנות מחדש Enterprise Object Map אם הוא קיים ב-"Fresco Marketing OS"; למפות קיים מול נדרש ולסמן רק פערים אמיתיים.
> שיטה: סריקת כל הרפוזיטוריז הנגישים בחשבון + סריקת התוכן של הרפו העדכני ביותר (`Matriya-System-Project`, נדחף 2026-08-02).

---

## ההכרעה

## ❌ "Fresco Marketing OS" אינו קיים כמערכת בנויה באף רפו נגיש.

**הראיות (🟢 VERIFIED):**
1. **11 רפוזיטוריז בחשבון** — אף אחד לא נושא שם שיווקי: ‏matriya-front-/back/system/System-Project, ‏maneger-front/back (×2 גרסאות), ‏matriya-front/back- (ישנים), ‏Waqas56jb/Matriya-Proj.
2. **סריקת `Matriya-System-Project`** (העדכני והעשיר ביותר, ‏134 פריטי-על, ‏18 תתי-פרויקטים): **אפס** קוד עבור CRM / ‏Asset Graph / ‏Business Factory / ‏Campaign. אזכורי "marketing" היחידים: דף HTML שיווקי שהאודיט הפנימי ממליץ **להוציא** מהמערכת, ומשפטי "no marketing tone" באודיטים.
3. **"Opportunity" מופיע פעם אחת** — דף פרוטוטייפ `lab-fresco-view` שמוגדר בעצמו: ‏backend "אין", ‏db "demo", חסם "מסלולי הזדמנות מדומים".
4. **ה-System Atlas הפנימי** (59 רכיבים): ‏20 production, ‏16 prototype, ‏15 idle, ‏4 dead — אף רכיב production אינו מסחרי/שיווקי.

**מה שכן קיים בשכבה המסחרית:** חשבון **HubSpot CRM** ‏(SaaS, ‏Hub 48189256 — סטטוס Unknown, תוכנו מעולם לא נבדק) ו-**Priority = ABSENT** ‏(F-001/D-006). כלומר: ה-System of Record המסחרי האמיתי הוא HubSpot, לא רפו.

---

## תיקון מפת הטענות (הטבלה שהוצעה, מאומתת)

| הטענה: "קיים ב-Marketing OS" | מצב מאומת | המקור האמיתי לחיבור |
|---|---|---|
| Opportunity | ❌ פרוטוטייפ מדומה בלבד | HubSpot (Deals?) — טעון בדיקה; עד אז: אין |
| Customer Need | ❌ לא קיים בקוד | HubSpot (Contacts/Notes?) — טעון בדיקה |
| Asset Graph | ❌ לא קיים בקוד | לא קיים — לבנות רק אחרי Gates |
| Campaign / Market Signal | ❌ לא קיים בקוד | HubSpot — טעון בדיקה |
| Commercial Result | ❌ לא קיים בקוד | Priority (ABSENT) / הנה"ח — אין כרגע |
| Priority Data | ❌ ABSENT (F-001, D-006) | — |
| Agent Workflow | 🟡 חלקי | ‏skills (matriya-council וכו') + מחסנית ההסקה (ראו למטה) |

## הממצא החיובי: עמודת "MATRIYA Decision / Next Action" כבר קיימת — ומאומתת

ב-`Matriya-System-Project` נמצאה מחסנית הסקה **שאומתה בפרודקשן** (‏MATRIYA_CAPABILITY_STATE.md, ‏2026-06-03): ‏8 שכבות מ-Scalar ועד **Research Management**, כולל:
- **`NEXT_BEST_EXPERIMENT` v1 — קיים ועובד** (בסקייל מעבדה/XLSX, על מרחב הניסויים הנצפה), עם Evidence Boundary דו-צירי, ‏`SYNTHESIS_REQUIRED`, וסירובים כנים.
- ‏`RESEARCH_PROGRAM` ‏(RPB v1) — תכנון סט הניסויים הזול ביותר לבידוד משתנים.

**זה מתקן את פרק 30:** השורה "Next Best Experiment — חסר, לבנות" אינה מדויקת — קיים v1 מאומת בהיקף מעבדה. הפער האמיתי הוא הרחבתו לערך עסקי (Economic Twin), לא בנייתו מאפס.

בנוסף, ‏REALITY_AUDIT_V1 ‏(2026-07-03, מדוד מ-DB פרודקשן) קובע: הליבה החיה = Project + Lab + RAG ‏(924 + 4,582 וקטורים) + WhatsApp + Finance + Knowledge Kernel ‏(456 אובייקטים) — עטופה ב-~50% סכמה מתה, ‏12 דפים יתומים ו-4 פיצולי-מושג. **הערה חשובה:** ממצא זה מתייחס ל-backend של System-Project ואינו סותר את F-003 (ה-RAG של matriya-back ריק) — יש שתי מערכות RAG נפרדות, וזה עצמו פיצול שדורש הכרעת System-of-Record.

## ה-Enterprise Object Map: חומר הגלם כבר קיים — במקום אחר

המפה לא צריכה להיכתב מאפס ולא להישלף מ-Marketing OS דמיוני. חומר הגלם המדוד קיים:
1. ‏**REALITY_AUDIT_V1** — ‏158 טבלאות פרודקשן עם סטטוס לכל אחת (LIVE/DORMANT/DEAD), כולל זיהוי 4 טבלאות "ניסוי" ו-6 טבלאות "מסמך" כפולות.
2. ‏**system-atlas.data.js** — ‏59 רכיבי UI עם סטטוס, בעלים, backend ו-DB לכל אחד.
3. ‏**MATRIYA_ARCHITECTURE_MAP / CLAUDE.md Reality Map** — מפת הקוד.

**הפעולה הנכונה לשלב A (פרק 30):** לגזור את ה-Object Map משלושת המקורות המדודים האלה + בדיקת אובייקטי HubSpot בפועל, ולענות על 10 שאלות נספח א'. לא לבנות שכבה חדשה.

## עדכון constraints

- ‏**F-004 (חדש):** "Fresco Marketing OS" אינו קיים כמערכת — אין למפות אליו, אין להניח את קיומו. השכבה המסחרית בפועל: HubSpot (לא נבדק) + Priority (ABSENT).
- ‏**F-005 (חדש):** קיימות שתי מערכות RAG/backend נפרדות (matriya-back הריק מול System-Project החי) — נדרשת הכרעת System-of-Record לפני כל ingestion נוסף, אחרת Gate 1 ייסגר על המערכת הלא-נכונה.
