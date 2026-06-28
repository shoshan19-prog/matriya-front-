// Identity calibration — LABELED TEST SET (gold labels).
//
// SYNTHETIC FIXTURE — to be REPLACED by 30–50 real human-labeled lab files.
// The harness logic is what matters; swap `LABELED` for real {signals, gold}.
// Includes positives, weak-signal cases, true orphans, and ADVERSARIAL
// "mention-in-passing" negatives (an entity of another product appears inside).
//
// item: { id, signals:{name,path,content,metadata}, gold:{product, version, experiment} }
// gold.product === null  => the correct answer is "orphan / no link".

export const LABELED = [
  // --- strong positives (code/date/experiment in content) -------------------
  { id: 'L01', signals: { name: 'בדיקת לחיצה.xlsx', path: 'בדיקות מעבדה/בדיקת לחיצה.xlsx', content: 'MPZ 15 לחיצה 28 יום 14.12.2025 שם לבורנט דוד' }, gold: { product: 'MPZ hydraulic line', version: null, experiment: null } },
  { id: 'L02', signals: { name: 'Furnace_Report.pdf', path: 'Fire/Furnace_Report.pdf', content: 'Fire Test Version 044 INT-TFX-044 Thickness=2000µm Operator Rachel 2024-03-11' }, gold: { product: 'טיח מעכב בעירה', version: 'v044', experiment: 'INT-TFX-044' } },
  { id: 'L03', signals: { name: 'Brookfield.xlsx', path: 'Viscosity/Brookfield.xlsx', content: 'F.SILICATO נוסחה 9 צמיגות 30.09.2021 דוד' }, gold: { product: 'F.SILICATO system', version: null, experiment: null } },
  { id: 'L04', signals: { name: 'results.xlsx', path: 'שליכט/results.xlsx', content: 'W100 v002 רחל' }, gold: { product: 'שליכט W100', version: 'v002', experiment: null } },
  { id: 'L05', signals: { name: 'compress2.xlsx', path: 'lab/compress2.xlsx', content: 'MPZ 20 28 יום 15.12.2025 דוד' }, gold: { product: 'MPZ hydraulic line', version: null, experiment: null } },
  { id: 'L06', signals: { name: 'fire_b.pdf', path: 'fire/fire_b.pdf', content: 'INT-TFX-045 Version 045 Fire 2024-03-11' }, gold: { product: 'טיח מעכב בעירה', version: 'v045', experiment: 'INT-TFX-045' } },
  { id: 'L07', signals: { name: 'visc_pro.xlsx', path: 'proj/visc_pro.xlsx', content: 'PROTECH-A1 BETONIZE2030A' }, gold: { product: 'F.SILICATO system', version: null, experiment: null } },
  { id: 'L08', signals: { name: 'mpz5.xlsx', path: 'lab/mpz5.xlsx', content: 'MPZ5 28 יום' }, gold: { product: 'MPZ hydraulic line', version: null, experiment: null } },

  // --- name/path positives (filename or folder carries the product) ---------
  { id: 'L09', signals: { name: 'פורמולציות לטיח תל אביב.xlsx', path: 'טיח תל אביב/x.xlsx', content: '' }, gold: { product: 'טיח תל אביב', version: null, experiment: null } },
  { id: 'L10', signals: { name: 'SCHLICT W100.xlsx', path: 'שליכט/x.xlsx', content: '' }, gold: { product: 'שליכט W100', version: null, experiment: null } },
  { id: 'L11', signals: { name: 'data.xlsx', path: 'פרויקטים/שפכטל צמנטי/data.xlsx', content: '' }, gold: { product: 'שפכטל צמנטי', version: null, experiment: null } },
  { id: 'L12', signals: { name: 'x.xlsx', path: 'טיח תל אביב תרמי/x.xlsx', content: '' }, gold: { product: 'טיח תל אביב תרמי', version: null, experiment: null } },

  // --- weak-signal cases (only operator/date; honest if it can or cannot) ----
  { id: 'L13', signals: { name: 'sheet.xlsx', path: 'lab/sheet.xlsx', content: 'שם לבורנט דוד 14.12.2025' }, gold: { product: 'MPZ hydraulic line', version: null, experiment: null } }, // date is registry-confirmed to MPZ batch
  { id: 'L14', signals: { name: 'op.xlsx', path: 'lab/op.xlsx', content: 'Operator Rachel' }, gold: { product: null, version: null, experiment: null } },                                       // operator alone is NOT enough -> orphan

  // --- true orphans (no identifying entities) -------------------------------
  { id: 'L15', signals: { name: 'SEM001.tif', path: 'SEM/SEM001.tif' }, gold: { product: null, version: null, experiment: null } },
  { id: 'L16', signals: { name: 'IMG_3421.jpg', path: 'Photos/IMG_3421.jpg', metadata: 'OCR: v043' }, gold: { product: null, version: null, experiment: null } },          // version-only, no product anchor
  { id: 'L17', signals: { name: 'notes.docx', path: 'misc/notes.docx', content: 'general meeting notes' }, gold: { product: null, version: null, experiment: null } },
  { id: 'L18', signals: { name: 'Patcham-brochure.pdf', path: 'SDS/Patcham.pdf', content: 'additive datasheet' }, gold: { product: null, version: null, experiment: null } },

  // --- ADVERSARIAL: another product mentioned IN PASSING (must NOT false-link) ---
  { id: 'A01', signals: { name: 'w100_dev.xlsx', path: 'שליכט/w100_dev.xlsx', content: 'W100 v003. Compared to INT-TFX for reference only.' }, gold: { product: 'שליכט W100', version: 'v003', experiment: null } },
  { id: 'A02', signals: { name: 'mpz_test.xlsx', path: 'lab/mpz_test.xlsx', content: 'MPZ15 results. (benchmark vs F.SILICATO).' }, gold: { product: 'MPZ hydraulic line', version: null, experiment: null } },
  { id: 'A03', signals: { name: 'review.pdf', path: 'docs/review.pdf', content: 'Survey mentions INT-TFX, W100, BETONIZE2030A — no single subject.' }, gold: { product: null, version: null, experiment: null } }, // genuinely ambiguous -> orphan
  { id: 'A04', signals: { name: 'fire_note.pdf', path: 'fire/fire_note.pdf', content: 'INT-TFX-045 main subject. (earlier we tried W100.)' }, gold: { product: 'טיח מעכב בעירה', version: 'v045', experiment: 'INT-TFX-045' } },
];
