# Fresco Marketing OS — מלאי מאומת ומיפוי מול MATRIYA (2026-08-07)

> התיקייה הועלתה ל-Drive: ‏"fresco markting os" (id ‏`1t7eOkP96-28LoLR_LBiNfdbNhmS2mIME`), כולל `.git` מלא.
> מסמך זה **מחליף** את הכרעת "לא קיים" מ-`marketing_os_mapping_2026-08-05.md`: המערכת קיימת, בנויה ומתועדת ברמה גבוהה. הקביעה "לא קיים באף רפו" נותרת נכונה — היא חיה מקומית בלבד (חסם S7 שלהם עצמם: אין GitHub remote).

## מה קיים בפועל (🟢 — נקרא מהקבצים)

**מסמכי יסוד:** ‏PROJECT-MAP.md ‏(18.7, "כל מספר נספר בפועל"), מסמך-אב v3 + v4, ‏CLAUDE.md, יומן הכרעות 1–22, כללים עסקיים RULE-001–006.

**סכמת DB מלאה (Supabase/Postgres, ‏15 מיגרציות עד 24.7):** חמש שכבות — ‏(1) מראה-Priority לקריאה בלבד: ‏customer, ‏contact, ‏product/family, ‏delivery_note/line; ‏(2) נגזרות: ‏purchase_occasion/episode, ‏customer_state עם `p_alive` ו-`days_silent`; ‏(3) ידע: ‏project (עם confidence + גיאוקוד), ‏media, ‏**story** (בעיה/החלטה/כשל-קודם/לקח), ‏trust_asset, ‏shade, ‏project_product; ‏(4) קהלים ותוכן: ‏audience_member (4 שכבות), ‏content_asset עם מסלול אישור; ‏(5) מדידה: ‏metric עם **kill_rule מובנה** + ‏approval_item ("תחנת האישור — 15 דק'/שבוע"). הכול עם `tenant_id` + `domain` מהיום הראשון.

**מנועי pipeline (פותחו עד 2–3.8 — ימים ספורים לפני ההעלאה):** ‏opportunity_engine, ‏**asset_graph**, ‏**business_factory**, ‏market_engine/brain/twin/scanner/command/prep, ‏**experiment_engine**, ‏category_engine, ‏signal_library, ‏source_library, ‏service_factory, ‏intent_framework, ‏free_exposure + תיקיית ‏**priority/** (קוד סנכרון) + ‏slice/.

**נכסי נתונים מוכנים:** רשימת שיחות M1 ‏(90 לקוחות, ‏5.6M ₪ בסיכון), רשימת דיוור 3,584 ‏(3,224 מוכנות), ‏104 פרויקטים מדורגי-ביטחון, מלאי מדיה 20,232, קטלוג 2,025 מק"טים, ‏4,224 אנשי קשר, ‏294 נכסי אמון, ארכיון 48,496 קבצים מסווג.

**מה לא ניתן לאמת מכאן (⚪):** האם ה-DB פרוס ורץ (חסם S8 שלהם: "פרויקט Supabase נדרש"), והאם המנועים הורצו על נתונים. הקוד 🟢; הריצה ⚪.

## הטבלה של דוד — מאומתת סופית

| חיבור נדרש | קיים ב-Marketing OS | ראיה |
|---|---|---|
| Opportunity → Research Question / Business Case | ✅ ‏opportunity_engine.py + purchase_episode | 🟢 קוד |
| Customer Need → Experiment / Product Requirement | ✅ ‏customer_state (p_alive, days_silent) + story.problem | 🟢 סכמה |
| Asset Graph → Technology / Formula / Capability | ✅ ‏asset_graph.py (בהיקף שיווקי) | 🟢 קוד |
| Campaign / Market Signal → Evidence / Assumption | ✅ ‏market_scanner + signal_library + source_library | 🟢 קוד |
| Commercial Result → Validation / Economic Evidence | ✅ ‏delivery/purchase + metric_reading (עם kill rules) | 🟢 סכמה |
| Priority Data → Cost / Margin / Inventory | 🟡 שכבת מראה + קוד סנכרון בנויים; **חסום C1** — אין גישת OData | 🟢 קוד, ⚪ חיבור |
| Agent Workflow → MATRIYA Decision / Next Action | ✅ ‏market_command/brain + approval_item | 🟢 קוד |

**תיקוני constraints:** ‏F-004 מתוקן — המערכת קיימת (מקומית + עותק Drive), בשלות: קוד+סכמה 🟢, ריצה ⚪. ‏F-001 מקבל scope note — ל-matriya-back אין Priority, אבל ה-Marketing OS **כן** בנה שכבת-מראה וקוד סנכרון הממתינים ל-credentials של OData; הטענה המקורית "Priority בשלב החיבור" הייתה נכונה — כאן.

## הפערים האמיתיים (מה שנשאר לחבר, לא לבנות)

1. **כפילות מושגית מתהווה — experiment_engine:** ל-Marketing OS יש מנוע ניסויים משלו ול-MATRIYA יש FSCTM+NBE מאומת. לפי פרק 30 אסור שניים. **החוזה הנכון:** ‏Marketing OS פולט אירועי Opportunity/MarketSignal/CustomerNeed → ‏MATRIYA (הקנונית) מחליטה על ניסויים ומחזירה Decision; ‏experiment_engine השיווקי מוגבל לניסויי שיווק (A/B דיוור) בלבד.
2. **F-005 מתרחב — שלוש סטאקים של נתונים:** ‏matriya-back (ריק, ארכוב), ‏System-Project ‏(158 טבלאות, קנונית מדעית), ‏Marketing OS ‏(Supabase משלו, קנונית מסחרית). זה תקין לפי פרק 30 (System of Record per domain) **בתנאי** שמגדירים חוזה אירועים ומזהים משותפים (priority_id, ‏sku, ‏project) בין השתיים — זו בדיוק משימת ה-Enterprise Object Map של שלב A.
3. **story = גשר ה-Validation:** טבלת story (בעיה/החלטה/כשל/לקח) היא ה-Field-Performance Evidence שפרק 30 דורש. חיבור עתידי: ‏story מאושר → ‏Validation Evidence ב-MATRIYA.
4. **asset_graph השיווקי מול Asset Graph הארגוני:** להשאיר שיווקי עכשיו; איחוד רק דרך מזהים משותפים, לא מיזוג קוד.

## ⚠️ אבטחה — דורש טיפול מיידי

1. **קובץ `.env` ‏(3.8KB) עלה ל-Drive** יחד עם התיקייה. ה-Drive פרטי, אבל: להסיר את העותק מה-Drive, לסובב מפתחות שמופיעים בו, ולא לכלול אותו בשום push עתידי.
2. המסמכים הפנימיים שלהם עצמם מסמנים **S11: סיסמאות בטקסט גלוי** ‏(docs/security-finding.md) — מצטרף ל-P-002 (רוטציית JWTs).

## הצעד הבא

ההעלאה ל-Drive פתרה את המיפוי. לחיבור אמיתי (git, אינטגרציה, המשך פיתוח) עדיין נדרש push ל-GitHub — חסם S7 המתועד אצלם ("gh לא מותקן"). הפרומפט המוכן ל-Cowork מהשיחה עדיין תקף, ורק להוסיף לו: לא לכלול `.env`.
