# ארכיטקטורת היעד — שלושה מוחות, חוזה אחד (2026-08-07)

> תרגום D-008 + פרק 30 + מלאי ה-Marketing OS לארכיטקטורה מחייבת. עיקרון: **לא בונים — מחברים.**

## 1. הטופולוגיה

```
                    ┌─────────────────────────────────────┐
                    │   MATRIYA הקנונית (System-Project)   │
                    │  Runtime · FSCTM · NBE · RAG · Ledger │
                    │        System of REASONING            │
                    └──────▲───────────────▲───────────────┘
              events │               │ events
        ┌────────────┴───┐       ┌───┴────────────────┐
        │  Marketing OS   │       │  מעבדה (maneger-*)  │
        │ SoR מסחרי       │       │ SoR ניסויי          │
        │ Priority mirror │       │ INT-TFX · QC        │
        └────────▲────────┘       └────────▲───────────┘
                 │ OData (C1)               │ בעתיד: MES/SCADA (פרקים 17-23)
            Priority ERP                מפעל 2040
```

‏matriya-back (עצמאי) — ארכיון. ‏HubSpot — מקור צד שנקרא ע"י Marketing OS. ‏Drive — המאגר; חיישן intake ב-matriya-front-.

## 2. חוק הזהויות (Shared Identity Contract)

כל אירוע חוצה-מערכת חייב לשאת לפחות מזהה קנוני אחד:

| מזהה | בעלים (SoR) | קיים היום |
|---|---|---|
| `priority_id` (לקוח) | Priority דרך Marketing OS mirror | ✅ customer.priority_id |
| `sku` | Priority דרך product | ✅ ‏2,025 מק"טים |
| `project_id` | Marketing OS ‏(project) | ✅ ‏104 רשומות |
| `experiment_id` | מעבדה / קנונית (experiments) | ✅ ‏INT-TFX-EXP-* |
| `knowledge_object_id` | קנונית (Knowledge Kernel) | ✅ ‏456 אובייקטים |
| `assumption_id / breakdown_id` | קנונית (Runtime) | ✅ מסלול חי מ-3.8 |

איסור: אף מערכת לא ממציאה מזהה של תחום זר; מיפוי שמות (אלקונין/אלקולין) נעשה ב-SoR של התחום בלבד.

## 3. חוזה האירועים v0 (שמונה אירועים, לא יותר)

| אירוע | פולט | צרכן | payload מינימלי | תולדה בקנונית |
|---|---|---|---|---|
| MarketSignalDetected | market_scanner | קנונית | signal, source, domain | Research Question מועמדת |
| OpportunityScored | opportunity_engine | קנונית | priority_id?, domain, score | Business Case קשור ל-Evidence |
| CustomerWentSilent | customer_state | קנונית + תחנת אישור | priority_id, days_silent, p_alive | Observation |
| StoryApproved | תחנת האישור | קנונית | project_id, lesson | Validation Evidence |
| ExperimentCompleted | מעבדה | קנונית | experiment_id, results ref | Evidence + Comparability check |
| AssumptionFailed | Runtime | קנונית (Gate 3) | assumption_id, breakdown_id | Paradigm candidate |
| DecisionIssued | קנונית | Marketing OS / מעבדה | decision_id, why_tree ref | ‏Ledger + הפצה |
| CommercialResultRecorded | Marketing OS ‏(metric_reading) | קנונית | metric_code, value, project_id? | Economic Evidence |

**מימוש v0 בזול (בלי תשתית חדשה):** טבלת `events` אחת ב-DB הקנוני + polling; ‏Bus אמיתי רק כשהנפח יצדיק. פרק 30 §11 נשמר כיעד, זה תת-הקבוצה המינימלית שמניעה את Q2.

## 4. גבולות אחריות קשיחים

1. ‏experiment_engine השיווקי = ניסויי שיווק (A/B דיוור, מסרים) **בלבד**; כל ניסוי חומרים עובר דרך NBE הקנוני.
2. שכבת מראה-Priority לעולם לא נכתבת חזרה (כבר מעוגן בסכמה שלהם).
3. הקנונית לא מחזיקה נתוני CRM — היא מחזיקה הפניות (priority_id) בלבד.
4. כל DecisionIssued נושא Why Tree; אין החלטה בלי Provenance (LAW-EVIDENCE-001).

## 5. סדר מימוש

‏Q1: אירוע 5 בלבד (ExperimentCompleted → Evidence) — כי הוא סוגר את Gate 1 עם המעבדה. ‏Q2: אירועים 1–4 + 7. ‏Q3: אירוע 6 (מזין Gate 3). ‏Q4: אירוע 8 (מזין Economic Twin).
