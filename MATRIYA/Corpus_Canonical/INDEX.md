# MATRIYA — Canonical Chapters Set (2026-08-05)

Canonical, de-duplicated versions of the Fresco strategy chapters received 2026-08-05 via session upload.
These are the versions that should enter Drive and the ingestion path. Byte-level provenance below.

## Dedup decisions (verified by MD5)

| Dropped file | Reason | Canonical kept |
|---|---|---|
| `...V2.4_Chapter231.docx` | byte-identical duplicate (md5 `d5b93d3...`) | `Fresco_Manufacturing_Master_Plan_V2.4_Chapter23.docx` |
| `...V1.0_Chapter261.docx` | byte-identical duplicate (md5 `78f4188...`) | `Fresco_Global_Technology_Roadmap_2040_V1.0_Chapter26.docx` |
| `...V1.8_Chapter171.docx` | filename artifact only (content is Chapter 17) | renamed → `..._V1.8_Chapter17.docx` |

Received: 16 files → Canonical: **14 files**.

## Canonical files (MD5)

| File | MD5 |
|---|---|
| Fresco_Manufacturing_Master_Plan_2040_V1.8_Chapter17.docx | 8cf7f3414a7c707a03393543fe487152 |
| Fresco_Manufacturing_Master_Plan_2040_V1.9_Chapter18.docx | b340e93ab7d7f604ba91b9342615dee3 |
| Fresco_Manufacturing_Master_Plan_2040_V2.0_Chapter19.docx | 86cadec551ed4d5cb7d84a508fe9f9eb |
| Fresco_Manufacturing_Master_Plan_2040_V2.1_Chapter20.docx | 00622cfca7e61a51085f27892a9a53ec |
| Fresco_Manufacturing_Master_Plan_V2.2_Chapter21.docx | 6ded477a6e773a7a4b6198b6d4a8a4a2 |
| Fresco_Manufacturing_Master_Plan_V2.3_Chapter22.docx | c49ef9578e7817210aac19757dac769b |
| Fresco_Manufacturing_Master_Plan_V2.4_Chapter23.docx | d5b93d38abbf25478b39b9f3c2de51df |
| Fresco_Manufacturing_Master_Plan_V2.5_Chapter24.docx | 860a33015d6b80dcef305f45104978f4 |
| Fresco_Manufacturing_Master_Plan_V2.6_Chapter25.docx | 6f58884c08011dadde584e52f182ad92 |
| Fresco_Global_Technology_Roadmap_2040_V1.0_Chapter26.docx | 78f41887d1e104390751ee615b8d91b5 |
| Fresco_Global_Technology_Roadmap_2040_V1.1_Chapter27.docx | eca00af8a22968ced21612da6d96c241 |
| Fresco_Global_Technology_Roadmap_2040_V1.2_Chapter28.docx | 16acabd1787f241dc3e3a822d74ef378 |
| Fresco_Global_Technology_Roadmap_2040_V1.3_Chapter29.docx | d06575d23c6f69f53aa561d9f9c3fd70 |
| Fresco_MATRIYA_Enterprise_Architecture_Chapter30_V1.0.docx | 5c535b88b64e1579f6efb865fc75c3db |

## Path to ingestion

1. These 14 files live in `MATRIYA/Corpus_Canonical/chapters/` (repo = provenance anchor).
2. Copy them into the Drive corpus (single drag into the Fresco Drive) — the intake sensor will queue them on its next 4-hour scan **once the three Google OAuth secrets are configured** (see `docs/DRIVE_INTAKE_ACTION.md`).
3. Backend `/ingest/file` parses them into the RAG (requires authenticated session; not reachable from the sandbox that produced this set).
