# MATRIYA v1.0 — one product, one entry point

*Prepared 2026-06-28. The sign a system has crossed from development to **product**: all the internal machinery (assets, events, transformations, frontier, decision-value, telemetry) disappears behind a single command. For Rachel or the lab, MATRIYA is just: **ask a question · ingest a source · get a recommendation · approve an action.***

```
                MATRIYA
                   │
       ┌───────────┼───────────┐
     ask()      ingest()    analyze()
       └────── CORE ENGINE ──────┘
                   │
   Identity · Evidence · Episodes · Assets · Frontier · Decision · Telemetry
```

`assets/`, `events/`, `transformations/`, `frontier/`, `decision-value/` are now **internal modules**. The user never sees them.

---

## Install

```bash
alias matriya="$PWD/matriya"      # from the repo root
matriya                           # shows the verbs
```
(or `node mvp/knowledge-map/matriya.mjs <cmd>`)

## The v1.0 verbs

| Command | What it does |
|---------|--------------|
| `matriya ask "<question>"` | what we know about a property (+ why it's incomplete) |
| `matriya next` | PROTEUS's top recommendation (you approve) |
| `matriya frontier [asset]` | retrieve / generate / external / phase |
| `matriya material <name>` | a raw material's history across all products |
| `matriya status` | knowledge phase + weakest assets + headline recommendation |
| `matriya ingest <source>` | connect a source (drive · priority · gmail · sharepoint · lab) |
| `matriya analyze` | rebuild knowledge from the corpus |
| `matriya approve <EVENT>` | record approval + emit the work order |
| **`matriya why <asset>`** | **plain-language reasoning (innovation 1)** |
| **`matriya simulate <EVENT>`** | **what-if dry run (innovation 2)** |

---

## Examples (real output)

```
$ matriya ask "מה אנחנו יודעים על חוזק לחיצה?"
  Compression Strength — Evidence 15 (measured 7) · 3 products · Confidence 0.94
  Frontier: RETRIEVE_COMPLETE — marginal gain from more reports is low
  To close: No further retrieval — remaining frontier is external durability tests

$ matriya next
  ► GENERATE  FIRST_PULL_OFF  for Adhesion
    expected ΔK 0.48 · business impact 1 · priority 4.33

$ matriya material vermiculite
  vermiculite: 2 products (+0/−2) — dropped from TLV (adhesion), failed in thermal (drinks water)

$ matriya ingest priority
  ingest priority: adapter stub (not wired) — ERP → cost & duration
  governance: human-approved · append-only · no auto-extract.  Sources connect at ingest, never to the engine.
```

---

## Innovation 1 — `matriya why` (explainable recommendation)

Turns the priority math into a sentence a lab manager can read:

```
$ matriya why adhesion
Why MATRIYA wants to GENERATE FIRST_PULL_OFF for Adhesion:
  • grounding:   confidence 0.35 (0 measured across 2 products) — weak
  • frontier:    GENERATE_REQUIRED — 0 measured pull-off; corpus scanned, none exists
  • demand:      asked-for 12× and unanswered (router misses)
  • business:    impact 1 under "customer-returns-cracking" · decision-value 0.79
  • learning:    expected ΔK 0.48 (a first measurement moves the needle a lot)
  ⇒ net priority 4.33 — the highest available.
  ⇒ mode GENERATE: the data does not exist in the corpus — run the test.
```

No black box: every recommendation can be justified across grounding, frontier, demand, business value, and learning.

## Innovation 2 — `matriya simulate` (what-if before you commit)

Counterfactual dry run — predict the effect of an acquisition on the whole knowledge map, *before* spending a shekel:

```
$ matriya simulate FIRST_PULL_OFF
SIMULATE FIRST_PULL_OFF on Adhesion (dry run — nothing committed):
  confidence:   0.35 → 0.55  (+0.20)
  measured:     0 → 1
  frontier:     GENERATE_REQUIRED → grounded (first measurement of Adhesion)
  phase index:  0.20 → 0.20
  ⇒ high-value acquisition — run it.  (predicted; approve to make it real)
```

PROTEUS can show the *return* of an experiment before it is run — planning by foresight, not hindsight.

---

## Why this is the right packaging

- **One seam for the future.** Every integration (Priority, Gmail, SharePoint, lab equipment) connects at `ingest()` — it never touches the engine logic. New source = new adapter, zero core change.
- **Governance is built in.** `recommend` proposes, `approve` gates, `ingest` is human-approved and append-only — the no-auto-action rule is enforced at the product surface.
- **The complexity is real but hidden.** Eight internal layers still run; the user sees four verbs. That gap — deep engine, simple surface — is the mark of a product.

> MATRIYA v1.0: ask a question, connect a source, get a recommendation, approve an action. The Decision Learning System, packaged.
