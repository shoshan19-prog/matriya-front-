// Negative Control + Mechanism Independence — does convergence prove anything?
//
// Convergence on one project is weak evidence: the mechanisms might all lean on
// the same base data and so NOT be independent. The right test is DISCRIMINATION:
// do they DIVERGE where there is a reason to diverge? And an INNOVATION (mine) —
// the Mechanism Independence Matrix: rank-agreement between mechanisms across
// many scenarios. If two always agree, they are REDUNDANT (e.g. IP ≈ entropy
// gradient, both ΔEntropy/Cost). If Business and Order diverge where value and
// disorder disagree, they are genuinely independent.
//
// ⚠ HYPOTHESIS-testing instrument, not a law.

import { REAL_EPISODES } from '../domains/corpus.mjs';
import { informationPotential } from './information-potential.mjs';
import { entropyGradient } from '../evidence/entropy.mjs';
import { buildDecisionPriorities } from '../decision-value/decision-value.mjs';

const OBJECTIVES = ['customer-returns-cracking', 'regulatory-certification', 'win-new-sales'];

const topBusiness = (obj) => buildDecisionPriorities(REAL_EPISODES, obj)[0].event;
const topIP = () => informationPotential()[0].event;
const topGradient = () => entropyGradient()[0].event;

/** INNOVATION — Mechanism Independence Matrix (pairwise agreement across scenarios). */
export function independenceMatrix() {
  const rows = OBJECTIVES.map((obj) => ({ scenario: obj, Business: topBusiness(obj), Information: topIP(), Gradient: topGradient() }));
  const agree = (a, b) => +(rows.filter((r) => r[a] === r[b]).length / rows.length).toFixed(2);
  const matrix = {
    'Business~Information': agree('Business', 'Information'),
    'Business~Gradient': agree('Business', 'Gradient'),
    'Information~Gradient': agree('Information', 'Gradient'),
  };
  const verdict = [];
  if (matrix['Information~Gradient'] >= 0.99) verdict.push('Information ≈ Gradient are REDUNDANT (both ΔEntropy/Cost) — not two independent witnesses');
  if (matrix['Business~Information'] <= 0.5) verdict.push('Business ⟂ Information are INDEPENDENT (diverge across objectives) — genuine cross-checks');
  return { rows, matrix, verdict };
}

/** Discrimination / negative-control: do Business and Order diverge where they should? */
export function discrimination() {
  // Global (no asset filter): the most business-critical vs the most disordered.
  const business = buildDecisionPriorities(REAL_EPISODES, 'customer-returns-cracking')[0];
  const order = informationPotential()[0];
  const diverge = business.event !== order.event;
  // and across objectives:
  const perObj = OBJECTIVES.map((o) => ({ objective: o, business: topBusiness(o), order: topIP() }));
  const divergeCount = perObj.filter((p) => p.business !== p.order).length;
  return {
    global: { business: `${business.event} (${business.asset})`, order: `${order.event} (${order.asset})`, diverge },
    perObjective: perObj, divergeCount, ofN: perObj.length,
    pass: diverge && divergeCount >= 1,
    note: diverge
      ? 'PASS — globally Business (customer-critical) and Order (most-disordered) pick DIFFERENT actions → the mechanisms discriminate; they are not all the same metric.'
      : 'WARNING — they converge even here; suspect shared base data / non-independence.',
  };
}

// ── 2-D promotion gate: reproducibility (≥3 projects) × discrimination (≥1) ──
export function promotionGate({ projectsConverged = 1, discriminationPassed = false } = {}) {
  const reproducibility = projectsConverged >= 3;
  const discriminationOk = !!discriminationPassed;
  return {
    reproducibility, discrimination: discriminationOk,
    promote: reproducibility && discriminationOk,
    need: [reproducibility ? null : `${3 - projectsConverged} more positive project(s)`,
           discriminationOk ? null : 'a passing negative control'].filter(Boolean),
    note: 'a metric earns promotion only if it REPLICATES (≥3 projects) AND DISCRIMINATES (≥1 negative control). Convergence alone is not enough.',
  };
}
