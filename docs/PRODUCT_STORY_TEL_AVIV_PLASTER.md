# Product Reconstruction — טיח תל אביב (Tel Aviv Plaster)

> **MATRIYA / PROTEUS mission.** Reconstruct the complete development history of *טיח תל אביב* from the real Fresco corpus and answer one question: **how did Fresco arrive at the current production formula?**
>
> This is a *reconstruction*, not a summary. It is built only from documents actually read in Google Drive. Every statement carries its source. Verified facts are separated from assumptions. Where two sources disagree, both are kept and the contradiction is marked. Where the record is silent, the silence is reported as a finding — not filled in.
>
> **Privacy rule (standing constraint).** No proprietary full compositions appear here — changes are described *qualitatively* (which ingredient changed, in which direction, and why). Full raw recipes were read read-only and kept local, outside git.
>
> *Prepared 2026-06-28. Read-only reconstruction; nothing in Drive was modified.*

---

## 0. Scope and identity

**Product:** טיח תל אביב — a lime-based restoration / preservation plaster ("Natural Plaster" / "טיח סיד"), Priority product **PR00042**, family "פרסקו טיח תל אביב". `[VERIFIED — formula corpus]`

**Development target (the north star):** an in-house equivalent of the commercial Weber product **INTO-G** — "לפתח טיח שמקביל בתכונות לטיח של וובר INTO-G". `[VERIFIED — R&D report 20.12.2022, id 1_L_o6jm…]`

**Two product lines surfaced and are kept strictly separate:**

| Line | What it is | Status in the record |
|------|-----------|----------------------|
| **טיח תל אביב** (base) | The preservation plaster, PR00042. Main development 2022. | **Reached pilot → production → bagging** (Dec 2022). |
| **טיח תל אביב תרמי** (thermal variant) | A separate later effort to make a thermal-insulating version. | **Never finalized** — a chain of documented failures (Jan–Feb 2025), unfinished. |

The thermal variant is reported here only in its own clearly-labelled sections (Dead-End Memory §5, threads §6). The current production formula is the **base** product; that is the spine of this reconstruction.

**Also explicitly excluded as distinct products** (read, confirmed unrelated, not merged in): *שליכט הידראולי תל אביב* (hydraulic slurry coat, A/B), *פיילוט.xlsx* (a cement spackle). `[VERIFIED — read directly]`

---

## 1. Product Timeline

Date-stamped events for the **base** product, each anchored to a source. `[All VERIFIED unless tagged]`

| Date | Event | Source |
|------|-------|--------|
| (undated) | Baseline reference block "מנה מס' 2" present in the formula corpus | פורמולציות לטיח תל אביב.xlsx |
| **11.04.2018** | Earliest dated sheet — sample #1, author **דוד** | פורמולציות corpus |
| 26.07–10.08.2021 | "ערבוב 1–20" mixing trials — 20 qualitative mixing experiments | פורמולציות corpus |
| 29.11.2021 → 04.07.2022 | Day-by-day task log covering the active development period | מעקב משימות.docx (1GHwlkvy…) |
| 27.04.2022 | "Natural Plaster" pilot, **27.04.2022-001**, author **Raquel G. Balla** | פיילוט טיח תל אביב.pdf (1Y_ZKC8a…) |
| **24.04.2022** | **First field pilot (mix 20) FAILS** — lab result not reproduced; many cracks outdoors → triggers stage 2 | R&D report 20.12.2022 |
| 28.06.2022 | Explicit "Natural Plaster = טיח תל אביב" experiment defined (NHL3.5 swap, 3× foaming agent, INTO-G cube comparison) | מעקב משימות.docx |
| 04.07.2022 | INTO-G replication run — air-entrainer & thickener swaps tested | מעקב משימות.docx |
| 28.08.2022 → 13.11.2022 | Formal production pilot series, batches **001–015** (PREMIX route; CAROLITH; glass sand; lime 3.5→5.0) | pilot xlsx (1YBb2cAO…, 1tQZ2cvm…) |
| 11.12.2022 | "טיח תל אביב – מורשם מוכן לפיילוט" (formula ready for pilot) | משימות 11.12.2022.docx (1kq1484A…) |
| 13.12.2022 | PreMix 50 kg produced | R&D report |
| **14.12.2022** | **1.5-ton production batch (002)** — the last stable production sheet | R&D report; pilot xlsx |
| 15.12.2022 | Applied outdoors — "נדבק טוב… ללא בועות" (adhered well, no bubbles) | R&D report |
| 18.12.2022 | After 3-day cure — "דבוק חזק… ללא סדקים" → **approved to bag** | R&D report |
| **20.12.2022** | **R&D report written** (authors רחל ואדוה) — consolidates the entire rationale | דו"ח מו"פ (1_L_o6jm…) |
| **10.07.2023** | +1 kg TCO folded permanently into PreMix recipe **PR00049** | pilot xlsx PreMix sheet |
| 25.05.2026 | Latest touchpoint — recipe file with note "ניסוי לבדיקת הוספת 003 על חשבון 06" (a TRIAL; unsigned; measurement fields blank) | טיח תל אביב 25.05.2026.xlsx (1pnmGY48…) |

> **Reading the timeline.** The product was *born* around 2018 as an early sample, *explored* through 2021 mixing trials, *engineered* intensively April–December 2022 against the INTO-G benchmark, *frozen* into production on 14.12.2022, *codified* in the 20.12.2022 report, *amended once* (10.07.2023, +1 kg TCO), and has only one later, exploratory touch (25.05.2026 trial). **The current production formula is essentially the 14.12.2022-002 sheet plus the 10.07.2023 TCO amendment.**

---

## 2. Version Evolution Map

Versions are described **qualitatively** (per the privacy rule). "Change" = which lever moved and in which direction; raw quantities are withheld.

```
2018 sample #1 (דוד)
        │  early hand sample, no process route recorded
        ▼
2021 "ערבוב 1–20"  (mixing trials, qualitative results only)
        │  exploring mixing/dispersion behaviour
        ▼
2022 "Natural Plaster" dev series  (Raquel G. Balla)
        │  27.04.2022-001 pilot defines the INTO-G-equivalent goal
        │  24.04.2022 field pilot (mix 20) → CRACKS outdoors  ✗ dead end
        ▼
Stage 2 — chemistry rework (mixes ~16–19)
        │  ME15000 → COMBIZELL    (thickener)
        │  Reditit → UFAPORE TCO  (air entrainer)
        │  vermiculite REMOVED from base
        │  trace ingredients moved into a PRE-MIX
        ▼
Stage 3 — production pilot series 28.08 → 13.11.2022 (batches 001–015)
        │  hydraulic lime 3.5 MPa → 5.0 MPa   (strength)
        │  CAROLITH 0.3–0.8 added to pre-mix  (mixing)
        │  lime 0.6 supplier צמיתות → כפר גלעדי (fraction consistency)
        │  חול זכוכית (glass sand) added + aggregate rebalance
        │  pilots selected from mix 12 and mix 15
        ▼
14.12.2022-002  ── 1.5-ton batch, best in lab AND production → APPROVED TO BAG
        │
        │  10.07.2023: +1 kg TCO folded into PreMix → PR00049
        ▼
PR00049 (current production formula)
        ┊
        ┊  25.05.2026-134: a TRIAL only (adds 003 at expense of 06; unsigned; blank fields)
```

**Corpus-integrity notes (VERIFIED):**
- *פורמולציות לטיח תל אביב.xlsx* and *…-2.xlsx*: files A and B are **byte-identical**; *חישוב חומרים* is a **duplicate of B**. Treated as one source, not three. `[VERIFIED]`
- **CONTRADICTION preserved:** the 28.08.2022-001 sheet carries **two process routes** — an "Arik premix" variant and a plain variant — within the same dated version. Both are kept; neither is silently dropped. `[CONTRADICTION — pilot xlsx]`
- The 25.05.2026 sheet is **explicitly a trial** (unsigned, measurement fields empty). It is **not** a production version and is not treated as superseding PR00049. `[VERIFIED]`

---

## 3. Knowledge Episodes (decision cycles, not files)

Each episode is one decision cycle — *Question → Hypothesis → Experiment → Result → Decision → Why → Next* — unifying the files that belong to the same anchor. (This is the MATRIYA Knowledge-Episode unit applied to real data.)

### EP-TLV-01 — Does the lab formula survive on a real wall?
- **Question:** will the lab mix reproduce outdoors?
- **Experiment:** 24.04.2022 field pilot, mix 20.
- **Result:** lab result *not* reproduced; **many cracks outdoors**.
- **Decision:** REJECTED → open stage 2. **Why:** "התקבלה תוצאה שונה… התקבלו סדקים רבים."
- **Next:** rework the chemistry (thickener / air entrainer / vermiculite).
- **Confidence:** 0.9 (explicit outcome + reason). **Source:** R&D report 20.12.2022.

### EP-TLV-02 — Which thickener + air-entrainer system gives good adhesion?
- **Hypothesis:** the ME15000 + vermiculite + Reditit system is the problem.
- **Experiment:** stage-2 mixes (incl. mix 19 with UFAPORE TCO).
- **Result:** ME15000/vermiculite/Reditit → "לא התקבלה הדבקה טובה… ייבוש לא טוב וסמיכות לא טובה"; mix 19 (COMBIZELL + UFAPORE TCO, no vermiculite) → "הדבקה טובה, מרקם טוב ועבידות טובה".
- **Decision:** ACCEPTED COMBIZELL + UFAPORE TCO; **dropped vermiculite**. **Why:** adhesion/drying/consistency.
- **Confidence:** 0.9. **Source:** R&D report; task log 04.07.2022.

### EP-TLV-03 — How to guarantee even dispersion of trace ingredients?
- **Hypothesis:** trace additives are lost / uneven in a single big batch.
- **Decision:** ACCEPTED — mix all חומרי קורט separately as a **PRE-MIX**. **Why:** "לוודא פיזור מלא ואחיד… לצמצם איבוד… למנוע חוסר אחידות."
- **Confidence:** 0.9. **Source:** R&D report.

### EP-TLV-04 — Can we raise strength toward INTO-G?
- **Hypothesis:** stronger hydraulic lime → stronger plaster.
- **Decision:** ACCEPTED — hydraulic lime **3.5 MPa → 5.0 MPa** (same maker, Calce Raffinata). **Why:** "לשיפור החוזק."
- **Confidence:** 0.9. **Source:** R&D report; recipe 14.12.2022-002.

### EP-TLV-05 — The lime supplier's fractions are inconsistent — switch?
- **Evidence:** sieve (ניפוי) tests + COA show inconsistent fractions from צמיתות.
- **Decision:** ACCEPTED — lime 0.6 **צמיתות → כפר גלעדי**; then add **glass sand** + rebalance aggregates because Kfar Giladi 0.6 carries more fines. **Why:** fraction inconsistency could damage plaster structure; rebalance compensates.
- **Confidence:** 0.9. **Source:** R&D report.

### EP-TLV-06 — Production loses surfactant; the plaster slides off the spatula
- **Observation:** in 14.12.2022-002, 1 kg TCO + 200 g water → viscosity good **but wetting insufficient, plaster slid off the metal spatula**.
- **Decision:** ACCEPTED — add 1 kg TCO mid-batch ("צמיגות מצויינת והרטבה טובה"), then on **10.07.2023 fold +1 kg TCO permanently into PreMix PR00049**. **Why:** "כנראה חלק ממנו הולך לאיבוד בעירבוב" (surfactant lost during mixing).
- **Confidence:** 0.9. **Source:** R&D report (conclusions) + pilot PreMix sheet.

### EP-TLV-07 — Which pilot becomes the production formula?
- **Experiment:** lab + outdoor application + drying, compared against INTO-G; pilots taken from **mix 12 and mix 15**.
- **Result:** **14.12.2022-002** — "התוצאה הכי טובה במעבדה וגם ביצור."
- **Decision:** ACCEPTED → produce 1.5 t, apply, cure 3 days ("דבוק חזק… ללא סדקים"), **approve to bag**.
- **Confidence:** 0.9. **Source:** R&D report.

> Episodes EP-01 → EP-07 are the actual decision spine that turned a cracking 2022 field sample into the bagged PR00049 production formula.

---

## 4. Decision Memory (Decision → Reason → Evidence → Confidence)

The knowledge most lost after a few years: *why we chose, why we rejected.* All VERIFIED from the 20.12.2022 R&D report unless noted; confidence is high (0.9) because every entry carries an explicit recorded **reason**.

| # | Decision | Reason (WHY) | Evidence anchor |
|---|----------|--------------|-----------------|
| 1 | Develop the product at all | Build an in-house equivalent of Weber **INTO-G** | R&D report |
| 2 | Drop **vermiculite** from base | ME15000+vermiculite+Reditit → poor adhesion, bad drying, bad consistency | R&D report / EP-02 |
| 3 | Thickener **ME15000 → COMBIZELL** | ME15000 gave poor adhesion/drying/consistency | R&D report |
| 4 | Air entrainer **Reditit → UFAPORE TCO** | mix 19 with TCO → good adhesion, texture, workability | R&D report; log 04.07.22 |
| 5 | **PRE-MIX** for trace ingredients | ensure full even dispersion; reduce loss; prevent non-uniformity | R&D report |
| 6 | Hydraulic lime **3.5 → 5.0 MPa** | "לשיפור החוזק" (improve strength) | R&D report; recipe 14.12.22-002 |
| 7 | Add **CAROLITH 0.3–0.8** to pre-mix | "לשיפור הערבוב" (improve mixing) | R&D report |
| 8 | Lime 0.6 **צמיתות → כפר גלעדי** | Tzmitut fraction inconsistency (sieve+COA) risks plaster structure | R&D report (supplier event, §7) |
| 9 | Add **glass sand** + rebalance aggregates | Kfar Giladi 0.6 has more fines → balance the fractions | R&D report |
| 10 | Increase **TCO** dosage in production | some surfactant is lost during mixing | R&D report (conclusions) |
| 11 | **+1 kg TCO** mid-batch (14.12.22-002) | wetting insufficient — plaster slid off the spatula | R&D report |
| 12 | Fold +1 kg TCO into **PreMix PR00049** | codify the pilot finding (annotation 10.7.23) | pilot PreMix sheet |
| 13 | Pilots from **mix 12 & mix 15** | best lab + outdoor + drying vs INTO-G; 002 best overall | R&D report |

---

## 5. Dead-End Memory (negative knowledge — what was tried and failed, and why)

The most valuable, most-forgotten knowledge. Indexed so PROTEUS can warn *before* anyone repeats it.

### Base product (2022)
| Tried | Failed because | Source |
|-------|----------------|--------|
| First field pilot, 24.04.2022 (mix 20) | lab result not reproduced; **many cracks outdoors** | R&D report |
| ME15000 + vermiculite + Reditit branch | poor adhesion, poor drying, poor consistency | R&D report |
| Conductivity / קלגון (Calgon) as a water-hardness QC probe | Calgon *raised* conductivity ("משחרר יונים אחרי שתופס יוני קלציום ומגנזיום") → conductivity is **not** a valid hardness test | task log 02.02.2025 |

### Thermal variant (2025) — an entire failure chain, each with a stated reason `[separate product]`
| Tried | Failed because | Source |
|-------|----------------|--------|
| Mixes 001/002 (20–21.01.2025), vermiculite-based | "הורמיקוליט שותה את המים"; "חסר חומר מחבר, הטיח נשבר"; "אין זרימה" (density 1.36) | thermal xlsx; task log |
| Keep the large aggregate | Aric: "כי במיסטרפיקס אין" (reference Mister Fix has none) → remove it | thermal xlsx |
| Mix 008 (16.02.2025), light/airy | "נשבר יחסית בקלות" (breaks fairly easily) | thermal xlsx |
| Pumice variant (mix 010, 17.02.2025) | "חומר פחות טוב מהפומיס, שותה הרבה מים ולא מחובר טוב" | thermal xlsx |
| Mix 002 (26.01.2025) | "חומר שותה מים, אין חיבור" | task log |
| Mix 003 (29.01.2025) | "לא טובה" → fix = more cement; perlite absorbs less water than vermiculite | task log |

**Root cause codified across the thermal line:** lightweight fillers (vermiculite > perlite > pumice) **drink water, kill flow, weaken cohesion**; raising cement (3→5→10%) improved density/compaction. **The thermal product was never finalized in the available records.** `[VERIFIED]`

---

## 6. Causal Threads (decision lineage — how one decision led to the next)

Each thread links an episode's outcome to the next episode's starting point — the actual reasoning trajectory.

**Thread A — the base product's road to production:**
```
EP-01 cracks outdoors
   → (need better adhesion)        EP-02 swap thickener+entrainer, drop vermiculite
   → (need even dispersion)        EP-03 invent the PRE-MIX
   → (need more strength vs INTO-G) EP-04 lime 3.5→5.0 MPa
   → (lime fractions inconsistent)  EP-05 supplier swap + glass sand rebalance
   → (surfactant lost in mixing)    EP-06 +1 kg TCO → PR00049
   → (pick the winner)              EP-07 mix 12/15 → 14.12.2022-002 → BAG
```
Every arrow is a *Why* carried forward from one decision into the next problem. This thread **is** the answer to "how did Fresco arrive at the current formula."

**Thread B — the thermal variant (parallel, unfinished):**
```
05.01.2025 build thermal on base, swap aggregate→vermiculite
   → 001–003 "drink water, no cohesion, no flow"
   → try perlite / pumice → still break / still drink water
   → 12.02.2025 meeting w/ Aric: redo with NHL5, sample PORAVER 1–2 / 2–4 mm
   → (no convergence recorded)
```
Thread B never reaches a production node. Kept separate from Thread A.

---

## 7. Source Registry

Every source actually read, with role and trust tag. IDs abbreviated.

**Primary WHY sources (VERIFIED, read directly):**
| Source | id | Role |
|--------|----|------|
| דו"ח מו"פ – פיתוח טיח תל אביב, 20.12.2022 (authors רחל ואדוה) | 1_L_o6jm… (dup 1qG7y9_A…) | **The rationale core** — reasons for nearly every decision |
| מעקב משימות.docx | 1GHwlkvy… | Day-by-day task log 29.11.2021–04.07.2022 |
| דוח מעקב חודש דצמבר.docx | 1Qr2Hr2x… | Day-by-day log 25.09.2024–12.02.2025 (thermal era; title is misleading) |
| משימות 11.12.2022.docx | 1kq1484A… | "מורשם מוכן לפיילוט" milestone |
| אבהרם משימות שבעיות.docx | 16B_opnY… | Avraham tasks, Jan 2022 |

**Formulation / version sources (VERIFIED):**
| Source | id | Role |
|--------|----|------|
| פורמולציות לטיח תל אביב.xlsx | 1gn1fFsT… | Baseline + early samples (A) |
| פורמולציות …-2.xlsx | 1SE5f_WS… | Byte-identical to A |
| חישוב חומרים | 1ixMPOr-… | Duplicate of -2 |
| בדיקת לחיצה.xlsx | 1KypPsT1… | Compression-test sheet (has a TLV section) |
| טיח תל אביב -פיילוט.xlsx / -פיילוט 001.xlsx | 1YBb2cAO… / 1tQZ2cvm… | Pilot batch recipes Aug–Dec 2022; PreMix PR00049 sheet |
| עותק של טיח תל אביב280822 -פיילוט.xlsx | 1cixoszR… | Aug-2022 pilot copy (two-route contradiction lives here) |
| פיילוט טיח תל אביב.pdf | 1Y_ZKC8a… | Natural Plaster 27.04.2022-001 (Raquel G. Balla) |
| תערובות חדשות.xlsx | 1G7RqMLC… | Natural Plaster / טיח סיד lineage (+ unrelated products) |
| טיח תל אביב 25.05.2026.xlsx | 1pnmGY48… | Latest 2026 trial sheet (unsigned, blank fields) |

**Read and excluded as distinct products (VERIFIED unrelated):**
| Source | id | Why excluded |
|--------|----|--------------|
| טיח תל אביב תרמי.xlsx | 1FdBKtg… | Separate THERMAL product (its failure log informs §5/§6 only) |
| שליכט הידראולי תל אביב.xlsx | 1VlYLDgL… | Distinct hydraulic slurry coat |
| פיילוט.xlsx | 1aFw3aoe… | Distinct cement spackle |

*Authors named anywhere in the corpus:* **דוד** (2018 sample), **Raquel G. Balla** (2022 Natural Plaster pilot), **רחל ואדוה** (R&D report), **אריק/Aric** (thermal-variant verdicts). No other authorship is recorded.

---

## 8. Product Story (the narrative — how Fresco arrived at the current formula)

Fresco set out to build its own version of Weber's **INTO-G** preservation plaster. The earliest trace is a 2018 hand sample by דוד, followed by twenty exploratory mixing trials in 2021 — useful for learning how the material mixes, but with only qualitative notes.

The real engineering began in spring 2022. The first serious field pilot, on **24 April 2022**, failed in the most informative way possible: the lab mix did *not* reproduce on a real outdoor wall and **cracked badly**. That single failure set the entire agenda. It told the team the problem was not the headline recipe but the **adhesion-and-workability chemistry**.

Stage 2 reworked exactly that. The old system (thickener ME15000 + Reditit air-entrainer + vermiculite) gave poor adhesion, poor drying and poor consistency, so it was replaced — **COMBIZELL** for the thickener, **UFAPORE TCO** for the air-entrainer, and **vermiculite removed entirely** from the base. To stop the small trace additives from being lost or unevenly dispersed in a large batch, the team invented a **pre-mix** for them.

Stage 3 turned a working chemistry into a manufacturable product. To push strength toward INTO-G, the hydraulic lime was upgraded from **3.5 to 5.0 MPa**. **CAROLITH** went into the pre-mix to improve mixing. When sieve tests and COAs showed the lime supplier (צמיתות) had **inconsistent fractions** that could weaken the plaster's structure, the team switched that lime to **כפר גלעדי** — and, because the new lime carried more fines, added **glass sand** and rebalanced the aggregate fractions to compensate.

The production run on **14 December 2022 (batch 002)** exposed the last problem: the plaster *slid off the spatula* — wetting was insufficient because some surfactant is lost during mixing. Adding **1 kg of TCO** fixed it on the spot, and on **10 July 2023** that extra kilogram was folded permanently into the pre-mix recipe, **PR00049** — the current production formula. Pilots taken from mixes 12 and 15 were compared in the lab, outdoors, and on drying against INTO-G; **14.12.2022-002 was best in both lab and production**, adhered cleanly, cured in three days without cracks, and was **approved for bagging**.

In parallel, a **thermal variant** was attempted in 2025. It never worked: every lightweight filler tried (vermiculite, then perlite, then pumice) drank the mix's water and killed its flow and cohesion. Raising cement helped density but not the core problem, and the variant was left **unfinished**.

**So: the current production formula (PR00049) is the December-2022 production sheet plus the July-2023 TCO amendment** — the end of a clean causal chain that began with a cracked wall in April 2022. The single document that makes this story recoverable at all is the **20 December 2022 R&D report**, which recorded the *why* behind nearly every step.

---

## 9. Knowledge Coverage Report

How well is each layer of the product's knowledge actually captured in Drive?

| Knowledge layer | Coverage | Evidence |
|-----------------|----------|----------|
| **Decision rationale (WHY)** for the base product | ✅ **Strong** | 20.12.2022 R&D report documents reasons for ~13 decisions |
| **Date-stamped engineering direction** | ✅ **Strong** | two day-by-day task logs (2021–22, 2024–25) |
| **Formulation versions (inputs)** | ✅ **Strong** | full pilot series 001–015, PreMix PR00049, baseline corpus |
| **Failed directions / dead-ends** | ✅ **Good** | stage-1 cracks, ME15000 branch, full thermal failure chain |
| **Supplier-change events** | ⚠️ **Partial** | captured *as decisions inside logs*; no standalone supplier file |
| **Process route** | ⚠️ **Partial / conflicting** | 28.08.2022-001 carries two routes (premix vs plain) |
| **Measured responses (OUTPUTS)** | ❌ **Empty** | see §10 — the structural gap |
| **Meeting minutes** | ❌ Absent as documents | only one-line "after a meeting with Aric…" notes in logs |
| **Emails** | ❌ Absent in Drive | not present (Gmail not in scope) |
| **Handwritten notes / scans** | ❌ Absent | Drive images are application/finish photos, not lab notes |

**Verdict:** the *inputs* and the *reasoning* are unusually well covered for the base product; the *outputs* (test results) and the *human-channel* knowledge (meetings, email) are not.

---

## 10. Knowledge Gap Report

What a new R&D engineer still cannot recover from the record — the gaps that matter most.

1. **The measured response is structurally present but systematically EMPTY.** `[VERIFIED — critical]` Across essentially **all** versions, the key measurement fields exist but are blank: **משקל סגולי (specific weight)**, **28-day compressive strength**, **גוון (shade/colour)**. A viscosity field does not even exist as a column. The corpus is rich in *formulations* and poor in *quantified outcomes* — strength was the explicit goal ("לשיפור החוזק") yet there is **no recorded strength number** to confirm any version achieved it. *This is exactly the gap the prospective DOE was designed to fill — to generate the missing response data, not back-fit it.*

2. **No numeric INTO-G benchmark.** The whole project targets Weber INTO-G, but the comparison is recorded only qualitatively ("best vs INTO-G"). The actual target values (strength, density, shade) for the benchmark are not in the corpus.

3. **Process-route contradiction unresolved.** The 28.08.2022-001 two-route ambiguity (Arik premix variant vs plain) is never reconciled in a later document — a new engineer cannot tell which route is canonical from the record alone.

4. **The 2026 trail is a loose end.** The 25.05.2026 trial ("add 003 at the expense of 06") is unsigned with blank fields and no surrounding narrative — its purpose, result, and whether it ever fed back into PR00049 are unknown.

5. **Human-channel WHY is uncaptured.** Meeting outcomes survive only as log one-liners; emails and handwritten notes are absent. Reasoning that lived in conversation or inbox was never written into Drive and is effectively lost.

6. **The thermal variant has no closing decision.** Its failure chain is well documented but there is no record of a final go/no-go — it simply stops. A successor engineer cannot tell whether it was abandoned, paused, or handed off.

---

## Method & honesty notes

- **Reconstruction, not summary.** Every section is assembled from the documents listed in §7, read read-only. Nothing in Drive was modified.
- **Verified vs assumption.** Statements are tagged; the few inferences (e.g. "current formula = 14.12.2022-002 + 10.07.2023 TCO") are derived strictly from the dated amendment annotation, not invented.
- **Contradictions preserved.** The two-process-route ambiguity (§2, §10.3) and the byte-identical duplicates are reported, not smoothed over.
- **No proprietary compositions.** Changes are qualitative (lever + direction + reason). Full raw recipes were kept local, outside git, per the standing privacy rule.
- **Absence reported as a finding.** Empty measurement fields, missing benchmark numbers, and missing meeting/email/handwritten knowledge are stated explicitly (§9, §10) rather than filled in.

> **Bottom line.** Fresco arrived at PR00049 through one traceable causal chain: a cracked April-2022 wall forced an adhesion-chemistry rework (drop vermiculite; COMBIZELL + UFAPORE TCO; pre-mix), strength and supplier fixes (5.0 MPa lime; Kfar Giladi + glass sand), and a final wetting fix (+1 kg TCO, codified July 2023). The reasoning is recoverable **only because of the single 20.12.2022 R&D report** — and the one thing the record cannot show is whether any version hit its strength target, because that number was never measured.
