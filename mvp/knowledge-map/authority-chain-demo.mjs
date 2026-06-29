// The Authority Chain + the No-Authority-Leakage invariants.
//   run: node authority-chain-demo.mjs
import { AUTHORITIES, checkAuthorityIsolation } from './authority-chain.mjs';

console.log('\n═══ MATRIYA AS AN AUTHORITY CHAIN (not a pipeline) ═══\n');
console.log('  each link is authorised for ONE question, on its OWN domain, and may not speak for the next.\n');

for (const a of AUTHORITIES) {
  const tag = a.status === 'FUTURE' ? '  [FUTURE — declared, not active]' : '';
  console.log(`  ┌─ ${a.id}  (${a.station})${tag}`);
  console.log(`  │   asks:   ${a.question}`);
  console.log(`  │   judges: ${a.judges}`);
  if (a.subAuthorities) for (const s of a.subAuthorities)
    console.log(`  │     · ${s.id.padEnd(9)} ${s.question.padEnd(36)} authority: ${s.authority} → ${s.emits}`);
  console.log(`  │   may say:     ${a.mayEmit.join(' · ')}`);
  console.log(`  │   must NOT say: ${a.mustNotSay.join(' · ')}`);
  if (a.why) console.log(`  │   why:    ${a.why}`);
  console.log('  └' + '─'.repeat(40));
}

console.log('\n═══ NO AUTHORITY LEAKAGE — verified against the real modules ═══\n');
const r = checkAuthorityIsolation();
for (const c of r.checks) console.log(`  ${c.pass ? '✓' : '✗'} ${c.invariant}`);
console.log(`\n  ⇒ authority isolation holds: ${r.allHold} (${r.passed}/${r.total})`);
console.log('  each authority can now be tested, improved or replaced on its own — without changing');
console.log('  the meaning of the others. That is what makes the chain scientifically auditable.\n');
