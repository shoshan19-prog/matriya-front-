# Knowledge Frontier — the WHY of a gap (governance before Laws)

*Prepared 2026-06-28. After the retrieval rounds, a deeper structural law appeared. "Missing knowledge" is not "missing documents." When a broad corpus scan no longer raises an asset's confidence, the gap is not a search failure — the **corpus is exhausted**, the knowledge space is **closed for retrieval**. So each asset needs a **Frontier**: not *what* is missing, but **why**, and how to close it. This is the last governance layer before Scientific Laws — it explains why the acquisition engine stops searching and starts generating. Code in `mvp/knowledge-map/frontier/`, runs with `node demo.mjs`.*

```
Knowledge Asset → Knowledge Frontier → { Retrieve · Generate · External · Closed }
```

---

## The FSCTM breakpoint

- **K (known):** Compression's confidence jumped 0.63 → 0.94 from new real sources; Density/Color/Workability deepened; the `MORE_MEASURED` event lost value (ΔK fell 0.118 → 0.078); Adhesion & Set/Cure stayed weak — for lack of *measurements*, not indexing.
- **C (contradiction):** PROTEUS assumed *missing knowledge → find another source.* But now `Missing Knowledge ≠ Missing Documents` — it equals **Missing Observation.**
- **B (breakdown):** when `∀ source ∈ Corpus : source ∈ Evidence(asset)`, no further document can raise confidence — the knowledge space is **closed**, because the corpus is exhausted, not because search failed.
- **N (the new layer):** the **Knowledge Frontier** — a reason for every gap.
- **L (the law):** below.

---

## The four frontier types (real classification)

```
asset                conf  measured  FRONTIER TYPE        expected ΔK
Compression          0.94    7        RETRIEVE_COMPLETE   low
Density              0.93    5        RETRIEVE_COMPLETE   low
Workability          0.81   13        RETRIEVE_COMPLETE   low
Color / Shade        0.67    4        RETRIEVE_AVAILABLE  medium
Granulometry         0.65    2        RETRIEVE_AVAILABLE  medium
Fire Resistance      0.62    2        EXTERNAL_ONLY       high (costly)
Water Resistance     0.62    2        EXTERNAL_ONLY       high (costly)
Adhesion             0.35    0        GENERATE_REQUIRED   high
Set / Cure           0.15    0        GENERATE_REQUIRED   high
```

Two cards — *why retrieve* vs *why generate*:

```
Asset: Adhesion                         Asset: Compression Strength
  Status:         GENERATE_REQUIRED       Status:         RETRIEVE_COMPLETE
  Reason:         0 measured pull-off;     Reason:         3 measured product families,
                  corpus scanned, none                    confidence 0.94, headroom 0.06
                  exists                                  → marginal gain low
  Closing Action: Run first Pull-Off       Closing Action: No further retrieval
  Expected ΔK:    high                     Expected ΔK:    low
```

---

## The structural law

> **When additional evidence no longer changes an asset's knowledge state, the knowledge frontier shifts from RETRIEVAL to GENERATION of new evidence.**

- **Validity conditions:** the corpus has been broadly scanned **and** the last evidence additions for that category drove a consistent decline in ΔKnowledge (or confidence is so high — headroom `1 − conf` so small — that any retrieval is marginal).
- **Reset conditions:** a **new unscanned source** appears (a new system, a fresh archive, historical documents), **or** a **new type of evidence** (a measurement/experiment) changes the state.

The law is *computed*, not declared: `retrievalSaturated()` reports the evidence (e.g. *"confidence 0.94, headroom only 0.06 → marginal gain low"*), so each `RETRIEVE_COMPLETE` verdict is justified from the transformation history.

---

## PROTEUS now reports Frontier Status, not just "next event"

```
RETRIEVE_AVAILABLE: 2   GENERATE_REQUIRED: 2   EXTERNAL_ONLY: 2   RETRIEVE_COMPLETE: 3

→ still RETRIEVABLE (corpus): Color, Granulometry
→ must be GENERATED (lab):    Adhesion, Set / Cure
→ EXTERNAL only (standards):  Fire, Water
```

So PROTEUS explains **why** it recommends what it does:

```
Asset: Adhesion              Asset: Compression
  Status: GENERATE_REQUIRED    Status: RETRIEVE_COMPLETE
  0 measured pull-off,         3 measured families, conf 0.94,
  corpus exhausted →           marginal gain low →
  Run first Pull-Off (ΔK high) No further retrieval
```

A clear structural boundary between the **existing corpus** and the **research frontier**.

---

## Architecture (the last layer before Laws)

```
... → Knowledge Demand → Decision Value → KNOWLEDGE FRONTIER → Scientific Laws → PROTEUS
```

The Frontier adds no new engine; it adds the ability to **explain why** the acquisition engine stops searching and starts generating — the governance boundary that must exist before promoting Scientific Laws.

## Retrieval round on the RETRIEVE_AVAILABLE frontier (the law in action)

Per the law, a scout was sent **only** to the two RETRIEVE_AVAILABLE assets (not to the exhausted or generate-only ones):

- **Granulometry:** captured the multi-supplier QC file (3 suppliers + 7 material PSDs) → confidence 0.65 → **0.78**, and the scout confirmed it is now **near-exhausted** — every corpus sieve table is in. But all of it is *raw-material* QC; *finished-product* PSD was never measured. So Granulometry flips to **RETRIEVE_COMPLETE**, and its remaining frontier is **GENERATE** (finished-product PSD).
- **Color:** captured the spectro **DE2000 / L\*a\*b\*** layer (440 measured records) + 3 more product substrates → 4 → **7 products, confidence 0.73**. Still **RETRIEVE_AVAILABLE** (the most untapped depth in the corpus).

The frontier has now shifted decisively:
```
RETRIEVE_AVAILABLE : Color (only one left)
RETRIEVE_COMPLETE  : Compression · Density · Workability · Granulometry
GENERATE_REQUIRED  : Adhesion · Set/Cure
EXTERNAL_ONLY      : Fire · Water
```
Exactly as the structural law predicts: as the corpus is consumed, the frontier moves from retrieval toward generation. One more Color pass and the RETRIEVE class closes entirely — after which **all** new knowledge must be *generated* or *sourced externally*.

## Status & next

- Built & runnable: `frontier.mjs` (4 frontier types · `retrievalSaturated` law · `classifyFrontier` · `frontierStatus` · `lawStatement`), `demo.mjs`.
- Real classification from the live corpus + transformation history; every `RETRIEVE_COMPLETE` is justified by computed headroom/ΔK decline or a confirmed exhaustion verdict.
- Next (opt-in): retrieve the still-available frontier (Color ΔE depth, Granulometry tables); route GENERATE_REQUIRED assets to the lab-emitter (pull-off, Vicat) under approval; route EXTERNAL_ONLY assets to standards/external labs; surface Frontier Status in every PROTEUS recommendation.

> The Knowledge Frontier turns "we don't know X" into "we don't know X **because** the data must be *generated* / *retrieved* / *sourced externally* / *is closed*". It is the structural boundary between the corpus and the research frontier — and the last governance layer before knowledge becomes Law.
