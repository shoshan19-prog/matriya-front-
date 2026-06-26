# V1 Pre-registration — sealing a discovery test before running it

*Prepared 2026-06-26. V1 (rediscovery of a held-out boundary on real data) is worthless if the boundary, feature, or success criterion can be chosen after seeing the result. This is the enforcement that makes V1 honest: a test cannot be graded unless it was **sealed first**, and the seal is **tamper-evident**. Tooling in `mvp/validation/` (`preregister.mjs`, `run-v1.mjs`), runs end-to-end with zero dependencies.*

## The three hindsight failures it blocks

| Failure | Block |
|---|---|
| **Choosing the boundary after the result** | `hidden_boundary` is recorded in the sealed form and hashed; the runner reads the boundary from the seal, never re-derives it. Editing it after the fact breaks the hash → run refused. |
| **Choosing the feature after the result** | `candidate_features` is sealed and `hidden_boundary.feature` must be one of them at registration time; the detector is given only that set. |
| **Ignoring failures** | every run — PASS or FAIL — is appended to an append-only ledger; a pre-registration is **single-use** (no run-until-pass), so misses cannot be silently retried away. Failures count in `attempts`. |

## The form (fill every field BEFORE running)

`mvp/validation/v1-prereg.template.json`:

```
project, dataset_file, input_variable, target_variable, candidate_features,
hidden_boundary { feature, threshold, tolerance },
who_knows_boundary, who_runs_blind,
success_criterion, p_threshold, permutation_count, held_out_rule,
failure_reporting, decision
```

The **dataset file contains no boundary** — the held-out answer lives only in the sealed form, so the operator stays blind to it in the data.

## Workflow (and why the seal is a real timestamp)

```
1. node preregister.mjs my-test.json      # validates + hashes + assigns V1-xxxx, appends to preregistrations.jsonl
2. git add mvp/validation/preregistrations.jsonl && git commit && git push   # ← the seal's trusted timestamp
3. node run-v1.mjs V1-xxxx                # verifies seal, runs, grades vs sealed criteria, LOCKS pass/fail in v1-ledger.jsonl
```

Step 2 is the point: committing the sealed hash to git history *before* the run means git itself proves the boundary was declared before the result existed. Self-registration alone is only self-trust; the commit makes it externally checkable.

## DoD — verified end to end

A live run of the five guards (synthetic blind dataset, boundary held out):

```
1. run without pre-registration            -> REFUSED ✓
2. preregister                             -> SEALED, id V1-5466e3c30a
3. run V1-5466e3c30a                       -> breakdown humidity≥79.5, permutation p=0.0033
                                              graded vs sealed humidity≈80(±6): feature✓ threshold✓ p<0.05✓
                                              RESULT: PASS (LOCKED)
4. re-run V1-5466e3c30a                     -> REFUSED (single-use lock; no run-until-pass) ✓
5. edit sealed boundary to 12, re-check     -> seal invalid -> run would be REFUSED ✓
V1 status: attempts=1 passes=1 failures=0 distinct-projects-passed=1  (V1 needs >=2)
```

So: cannot run without a `pre_registration_id`; every run is logged; pass/fail is locked; failures are counted in `attempts`; post-hoc edits are detected.

## Honest limits

- **Self-registration is only as trustworthy as the git-commit discipline.** The hash makes edits *detectable*, but a determined operator could re-register after peeking unless the seal is committed before the run. Hence step 2 is mandatory, not optional. True adversarial protection (V3 blind) needs a third party to hold the boundary.
- **This grades retrodiction (V1), not discovery.** Passing V1 on ≥2 projects clears one rung; it is not evidence of prospective discovery (V4). Don't report a V1 pass as "MATRIYA discovered."
- **The grader inherits the engine's blind spots.** Per Benchmark 0, a subtle/gradual real boundary may be MISSED — a FAIL here can mean "engine too coarse," not "no boundary." The ledger records the result; interpreting *why* a FAIL happened is part of the protocol.

> Bottom line: V1 is now un-fakeable by construction — declared first, sealed, single-use, failures on the record. The only thing left to move VDI is the thing only you can supply: a real Fresco project, exported with its boundary held out, run through this gate.
