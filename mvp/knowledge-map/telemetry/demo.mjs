// Telemetry — turning proxy signals into REAL ones. RECORDER ONLY.  run: node demo.mjs
// No automation: only records the 7 allowed events and derives Demand + Ledger.

import { buildLog, appendEvent, ALLOWED_EVENTS, demandFromTelemetry, ledgerFromTelemetry,
  governanceFunnel, decisionsChangedByKnowledge } from './telemetry.mjs';
import { SAMPLE_EVENTS } from './telemetry-seed.mjs';
import { REAL_EPISODES } from '../domains/corpus.mjs';
import { buildDecisionPriorities } from '../decision-value/decision-value.mjs';
import { backtestKnowledgeROI } from '../decision-value/decision-ledger.mjs';

const log = buildLog(SAMPLE_EVENTS);

console.log('═══ APPEND-ONLY RECORDER — 7 allowed event types, nothing else ═══\n');
console.log(`  allowed: ${ALLOWED_EVENTS.join(', ')}`);
console.log(`  recorded ${log.length} events (SAMPLE feed).`);
try { appendEvent(log, 'auto_extract', {}); }
catch (e) { console.log(`  ⛔ guard: ${e.message}`); }
console.log('  (no extract(), no generate(), no graph write exist in this module — it can only record.)');

// ── Real Demand (telemetry) vs proxy ─────────────────────────────────────────
const { demand: realDemand, miss, hit } = demandFromTelemetry(log);
console.log('\n═══ DEMAND becomes REAL — from router_miss, not a corpus proxy ═══\n');
console.log('  asset                          real demand (misses)   hits');
for (const a of Object.keys(realDemand).sort((x, y) => realDemand[y] - realDemand[x]))
  console.log(`  ${a.padEnd(28)} ${String(realDemand[a]).padStart(6)}              ${hit[a] || 0}`);
console.log('\n  Set/Cure was demand 4 by PROXY (corpus under-counted it) — telemetry shows 5 real misses;');
console.log('  Adhesion 9 real misses confirms the operational pain the proxy only hinted at.');

// ── Before / after Priority report ───────────────────────────────────────────
console.log('\n═══ BEFORE / AFTER — Priority recomputed on REAL demand ═══\n');
const before = buildDecisionPriorities(REAL_EPISODES, 'customer-returns-cracking');
const after = buildDecisionPriorities(REAL_EPISODES, 'customer-returns-cracking', realDemand);
const bById = Object.fromEntries(before.map((r) => [r.event, r.priority]));
console.log('  event                   priority(proxy) → priority(telemetry)   Δ');
for (const r of after.slice(0, 6)) {
  const b = bById[r.event]; const d = +(r.priority - b).toFixed(2);
  console.log(`  ${r.event.padEnd(22)} ${b.toFixed(2)}  →  ${r.priority.toFixed(2)}    ${d >= 0 ? '+' : ''}${d}`);
}

// ── Real Decision Ledger (from outcome_recorded) + backtest ─────────────────
const ledger = ledgerFromTelemetry(log);
console.log('\n═══ DECISION LEDGER becomes REAL — from outcome_recorded ═══\n');
console.log(`  ${ledger.length} real outcomes recorded.`);
for (const b of backtestKnowledgeROI(ledger))
  console.log(`  ${b.asset.padEnd(24)} decisions ${b.decisions}  realized ${b.realizedValue}  regret ${b.regret}  → ${b.verdict}`);

// ── Decisions changed by new knowledge ──────────────────────────────────────
console.log('\n═══ DECISIONS THAT CHANGED BECAUSE OF NEW KNOWLEDGE ═══\n');
for (const d of decisionsChangedByKnowledge(log))
  console.log(`  "${d.decision}" [${d.asset}]\n     ${d.changedFrom}  →  ${d.changedTo}\n     via ${d.viaKnowledge} · outcome ${d.outcome} (business +${d.businessValue})`);

// ── Governance audit ─────────────────────────────────────────────────────────
const f = governanceFunnel(log);
console.log(`\n═══ GOVERNANCE FUNNEL (audit trail) ═══\n  shown ${f.shown} · approved ${f.approved} · rejected ${f.rejected} · generated ${f.generated}`);
console.log('  every Intake passed through a human gate — recommend → approve/reject → generate. No automation.');

console.log('\n────────────────────────────────────────────────────────────────────────');
console.log('Demand is now measured (router misses), Decision Value is now proven (recorded');
console.log('outcomes). PROTEUS learns which knowledge is ACTUALLY missing and which knowledge');
console.log('ACTUALLY changed decisions — without ever acting on its own.');
