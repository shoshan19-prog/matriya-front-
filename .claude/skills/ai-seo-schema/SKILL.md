---
name: ai-seo-schema
description: תבניות JSON-LD בעברית לאתר פרסקו — Product, Project, FAQPage, LocalBusiness, HowTo. הפעל כשבונים או עורכים עמוד אתר, דף מוצר, Case Study או כל תוכן שצריך להיות קריא למנועי חיפוש ול-AI.
---

# AI-SEO — סכמות JSON-LD בעברית לחברת חומרי בניין

## עקרונות
- כל עמוד = בלוק `<script type="application/ld+json">` אחד לפחות. ‏`inLanguage: "he-IL"` תמיד.
- הסכמה נשאבת מ**מסד הישויות** (ההיטל השישי של האובייקט הקנוני — AI projection), לא נכתבת ידנית פעמיים.
- ‏AI-SEO פירושו: מנועי AI (Gemini/ChatGPT/Perplexity) מצטטים את מי שנתן להם עובדות מובנות. סכמה מלאה = להיות המקור המצוטט על "טיח שימור" ו"צבע מתנפח" בעברית.
- טענת ביצועים בסכמה חייבת גיבוי ב-trust_asset (תו תקן/דוח בדיקה) — LAW-EVIDENCE חל גם על SEO.

## 1. Product — דף מוצר (נשאב מ-product + product_family + trust_asset)

```json
{
  "@context": "https://schema.org", "@type": "Product",
  "name": "פרסקולייט — צבע מתנפח לעץ", "sku": "70-105",
  "inLanguage": "he-IL",
  "brand": {"@type": "Brand", "name": "פרסקו צבעים"},
  "category": "הגנה מאש למבנים",
  "description": "ציפוי מתנפח (Intumescent) על בסיס מים לעץ, עמידות אש עד 60 דקות לפי EN 13501-1.",
  "hasCertification": {"@type": "Certification", "name": "EN 13501-1 B-s1,d0", "issuedBy": {"@type": "Organization", "name": "EFECTIS"}},
  "offers": {"@type": "Offer", "availability": "https://schema.org/InStock", "areaServed": "IL"}
}
```

## 2. פרויקט שימור — Case Study (נשאב מ-project + story + media)

```json
{
  "@context": "https://schema.org", "@type": "Project",
  "name": "שימור בית עבוד — עכו העתיקה",
  "inLanguage": "he-IL",
  "location": {"@type": "Place", "address": {"@type": "PostalAddress", "addressLocality": "עכו", "addressCountry": "IL"}},
  "provider": {"@type": "Organization", "name": "פרסקו צבעים"},
  "about": ["שימור מבנים", "טיח סיד הידראולי NHL"],
  "description": "<story.problem> — <story.decision> — <story.lesson>",
  "subjectOf": {"@type": "ImageObject", "contentUrl": "<media.path המאושר>", "copyrightHolder": {"@type": "Organization", "name": "פרסקו צבעים"}}
}
```

## 3. FAQPage — שאלות מקצועיות (הנכס הכי מצוטט ב-AI)

```json
{
  "@context": "https://schema.org", "@type": "FAQPage", "inLanguage": "he-IL",
  "mainEntity": [{
    "@type": "Question", "name": "מה ההבדל בין סיד הידראולי NHL 3.5 ל-NHL 5?",
    "acceptedAnswer": {"@type": "Answer", "text": "NHL 3.5 רך וגמיש יותר ומתאים לטיח שימור על בנייה היסטורית; NHL 5 חזק יותר ומתאים לאזורים רטובים ולבסיס. הבחירה נגזרת מחוזק התשתית הקיימת."}
  }]
}
```
כלל: כל תשובה — עובדתית, קצרה, בלי שיווק. שאלות נלקחות משאלות אמיתיות של אדריכלים (שכבה ד').

## 4. LocalBusiness — דף הבית/צור קשר

```json
{
  "@context": "https://schema.org", "@type": "LocalBusiness",
  "name": "פרסקו צבעים", "inLanguage": "he-IL",
  "description": "ייצור חומרי שימור, הגנה מאש וציפויים מינרליים למבנים — מפעל וייעוץ טכני בישראל.",
  "address": {"@type": "PostalAddress", "addressCountry": "IL"},
  "knowsAbout": ["שימור מבנים", "הגנה מאש", "טיח סיד", "צבע מתנפח", "שיקום בטון"]
}
```

## 5. HowTo — מדריך יישום (נגזר ממפרט טכני)

```json
{
  "@context": "https://schema.org", "@type": "HowTo", "inLanguage": "he-IL",
  "name": "יישום טיח סיד NHL על קיר אבן היסטורי",
  "step": [
    {"@type": "HowToStep", "name": "הכנת תשתית", "text": "הסרת טיח צמנטי קיים עד האבן; הרטבה 24 שעות לפני."},
    {"@type": "HowToStep", "name": "שכבת הרבצה", "text": "..."},
    {"@type": "HowToStep", "name": "אשפרה", "text": "הרטבה 3 ימים; הגנה מרוח ושמש."}
  ]
}
```

## בדיקה
כל בלוק עובר validator.schema.org לפני commit; עמוד עם סכמה שבורה גרוע מעמוד בלי סכמה.
