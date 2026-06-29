// BUILD STUDIO — render the MATRIYA Control Room as a self-contained HTML file.
// Server-side rendered from the real studioData() so it opens anywhere (mobile,
// file://) with no runtime dependency. CSS handles the live animations.
//   run: node studio/build-studio.mjs   →   studio/control-room.html
import { studioData } from './studio-data.mjs';
import { writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export function buildStudio() {
const D = studioData();
const here = dirname(fileURLToPath(import.meta.url));
const dot = (s) => ({ online: '#39d98a', offline: '#ff5470', standby: '#6b7280', green: '#39d98a', amber: '#ffb454', red: '#ff5470' }[s] || '#6b7280');
const chip = (c) => ({ NEW: '#39d98a', UPDATED: '#54a0ff', DELETED: '#ff5470' }[c] || '#6b7280');
const tagColor = (t) => ({ adhesion: '#54a0ff', strength: '#ffb454', color: '#c56cf0', fire: '#ff5470', flow: '#39d98a', process: '#48dbfb', note: '#6b7280' }[t] || '#6b7280');
const LL = { idle: ['#6b7280', 'IDLE'], evidence: ['#39d98a', 'EVIDENCE IN'], event: ['#ffb454', 'KNOWLEDGE EVENT'], discovery: ['#c56cf0', 'DISCOVERY'], boundary: ['#ff9f43', 'BOUNDARY'], refutation: ['#ff5470', 'REFUTATION'] };
const [llColor, llText] = LL[D.learningLight.state] || LL.idle;

const meter = (label, val, max, color) => {
  const pct = Math.max(4, Math.round((val / Math.max(1, max)) * 100));
  return `<div class="meter"><div class="meter-row"><span>${label}</span><b>${val}</b></div><div class="bar"><i style="width:${pct}%;background:${color}"></i></div></div>`;
};
const vbar = (label, val, max, color) => {
  const pct = Math.max(6, Math.round((val / Math.max(1, max)) * 100));
  return `<div class="vbar"><div class="vfill" style="height:${pct}%;background:${color}"></div><span>${label}</span><b>${val}</b></div>`;
};

const maxPhase = Math.max(D.researchPhase.discovery, D.researchPhase.validation, D.researchPhase.production, 1);
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>MATRIYA · Control Room</title>
<style>
:root{--bg:#0a0e14;--panel:#121823;--panel2:#0e141d;--ink:#e6edf3;--dim:#8b98a9;--line:#1e2733;--accent:#48dbfb}
*{box-sizing:border-box}body{margin:0;background:radial-gradient(1200px 600px at 70% -10%,#16202e,var(--bg));color:var(--ink);font:14px/1.4 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif}
.wrap{max-width:1180px;margin:0 auto;padding:22px}
header{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:16px 20px;background:linear-gradient(180deg,#141c28,#0e141d);border:1px solid var(--line);border-radius:16px}
.brand{font-weight:800;letter-spacing:.5px}.brand small{display:block;color:var(--dim);font-weight:500;letter-spacing:3px;font-size:11px;margin-top:2px}
.led{display:flex;align-items:center;gap:12px;background:#0a0f16;border:1px solid var(--line);padding:10px 16px;border-radius:12px}
.led .lamp{width:18px;height:18px;border-radius:50%;background:${llColor};box-shadow:0 0 18px ${llColor},0 0 4px ${llColor};animation:pulse 1.1s infinite}
.led b{letter-spacing:2px;font-size:12px}.led small{color:var(--dim);display:block;font-size:10px;letter-spacing:1px}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.45;transform:scale(.86)}}
.health{display:flex;gap:10px;flex-wrap:wrap;margin:14px 0}
.src{display:flex;align-items:center;gap:8px;background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:8px 12px;font-size:12px}
.src i{width:9px;height:9px;border-radius:50%}
.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:6px}
.ch{background:linear-gradient(180deg,var(--panel),var(--panel2));border:1px solid var(--line);border-radius:14px;padding:14px;min-height:150px;position:relative;overflow:hidden}
.ch .n{position:absolute;top:10px;right:12px;color:#33404f;font-weight:800;font-size:11px;letter-spacing:1px}
.ch h3{margin:0 0 10px;font-size:12px;letter-spacing:1.5px;color:var(--accent);text-transform:uppercase}
.ch h3 span{color:var(--dim);letter-spacing:0;text-transform:none;font-weight:400}
.row{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:4px 0;border-bottom:1px dashed #18212d;font-size:12.5px}
.row:last-child{border:0}.pill{font-size:10px;font-weight:700;padding:2px 7px;border-radius:20px;color:#0a0e14}
.lights{display:flex;flex-direction:column;gap:9px;margin-top:4px}
.light{display:flex;align-items:center;gap:10px;font-size:12.5px}.light i{width:12px;height:12px;border-radius:50%;box-shadow:0 0 10px currentColor}
.meter{margin:8px 0}.meter-row{display:flex;justify-content:space-between;font-size:12px;color:var(--dim)}.meter-row b{color:var(--ink)}
.bar{height:9px;background:#0a0f16;border-radius:8px;margin-top:4px;overflow:hidden;border:1px solid #18212d}.bar i{display:block;height:100%;border-radius:8px}
.vumeter{display:flex;gap:14px;align-items:flex-end;height:96px;padding-top:6px}
.vbar{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;position:relative;background:#0a0f16;border-radius:8px;border:1px solid #18212d;padding:6px 0}
.vbar .vfill{width:64%;border-radius:6px;transition:height .4s}.vbar span{font-size:10px;color:var(--dim);margin-top:6px}.vbar b{position:absolute;top:6px;font-size:11px}
.grow{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.kpi{background:#0a0f16;border:1px solid #18212d;border-radius:10px;padding:10px;text-align:center}
.kpi b{display:block;font-size:22px}.kpi span{font-size:10.5px;color:var(--dim);letter-spacing:.5px}
.tl{display:flex;align-items:center;gap:0;margin-top:18px;position:relative}
.tl:before{content:"";position:absolute;left:0;right:0;top:50%;height:2px;background:#1e2733}
.tl .pt{position:relative;flex:1;display:flex;flex-direction:column;align-items:center}
.tl .pt i{width:13px;height:13px;border-radius:50%;z-index:1;box-shadow:0 0 10px currentColor}
.tl .pt span{position:absolute;top:16px;font-size:9px;color:var(--dim);white-space:nowrap}
.entropy{display:flex;gap:10px;align-items:flex-end;height:96px}
.ent{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%}
.ent .col{width:70%;background:#0a0f16;border:1px solid #18212d;border-radius:8px;height:100%;display:flex;align-items:flex-end;overflow:hidden}
.ent .col i{width:100%;border-radius:6px}.ent span{font-size:9.5px;color:var(--dim);margin-top:5px;text-align:center}
.foot{margin-top:14px;display:flex;flex-wrap:wrap;gap:8px;align-items:center;background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:12px 14px}
.foot .v{font-size:11.5px;color:var(--dim)}.foot .v b{color:#39d98a}
.tag{font-size:9px;color:#33404f;letter-spacing:1px;text-transform:uppercase}
.legend{color:var(--dim);font-size:11px;margin-top:10px}
@media(max-width:880px){.grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:520px){.grid{grid-template-columns:1fr}}
</style></head><body><div class="wrap">

<header>
  <div class="brand">MATRIYA<small>RESEARCH STUDIO · CONTROL ROOM</small></div>
  <div class="led" title="${D.learningLight.states[D.learningLight.state]}">
    <span class="lamp"></span><div><b>${llText}</b><small>LEARNING</small></div>
  </div>
</header>

<div class="health">
  ${D.systemHealth.map((s) => `<div class="src" title="${s.note}"><i style="background:${dot(s.state)}"></i>${s.source} <span style="color:var(--dim)">· ${s.state}</span></div>`).join('')}
</div>

<div class="grid">

  <div class="ch"><div class="n">CH1</div><h3>Incoming Signals <span>· sources</span></h3>
    ${D.incoming.map((g) => `<div class="row"><span style="color:var(--dim)">${g.source}</span><span>${g.items.map((i) => `<b style="color:${chip(i.change)}">${i.name.split('.')[0].slice(0, 14)}</b>`).join(', ')}</span></div>`).join('') || '<div class="row">quiet</div>'}
  </div>

  <div class="ch"><div class="n">CH2</div><h3>Change Feed <span>· peak</span></h3>
    ${meter('changes today', D.changeFeed.changesToday, Math.max(D.changeFeed.changesToday, 6), '#48dbfb')}
    ${meter('waiting review', D.changeFeed.waiting, Math.max(D.changeFeed.changesToday, 6), '#ffb454')}
    ${meter('approved', D.changeFeed.approved, Math.max(D.changeFeed.changesToday, 6), '#39d98a')}
    <div class="tag">NEW ${D.changeFeed.breakdown.NEW} · UPD ${D.changeFeed.breakdown.UPDATED} · DEL ${D.changeFeed.breakdown.DELETED} · ${D.changeFeed.source}</div>
  </div>

  <div class="ch"><div class="n">CH3</div><h3>Qualification <span>· compressor</span></h3>
    <div class="lights">
      <div class="light"><i style="color:${dot(D.qualification.units)}"></i>Units <span style="color:var(--dim)">— intelligible?</span></div>
      <div class="light"><i style="color:${dot(D.qualification.baseline)}"></i>Baseline <span style="color:var(--dim)">— vs corpus?</span></div>
      <div class="light"><i style="color:${dot(D.qualification.physics)}"></i>Physics <span style="color:var(--dim)">— possible?</span></div>
      <div class="light"><i style="color:${dot(D.qualification.review)}"></i>Review <span style="color:var(--dim)">— to human</span></div>
    </div>
    <div class="tag" style="margin-top:8px">gate ${D.qualification.gate.passed}/${D.qualification.gate.total} · red ⇒ it does not pass</div>
  </div>

  <div class="ch"><div class="n">CH4</div><h3>Human Review <span>· control</span></h3>
    <div class="kpi" style="margin-bottom:8px"><b>${D.humanReview.waiting}</b><span>WAITING FOR A HUMAN</span></div>
    ${D.humanReview.lanes.map((l) => `<div class="row"><span style="color:var(--dim)">${l.lane}</span><b>${l.count}</b></div>`).join('')}
  </div>

  <div class="ch"><div class="n">CH5</div><h3>Knowledge Growth <span>· today</span></h3>
    <div class="grow">
      <div class="kpi"><b style="color:#39d98a">+${D.knowledgeGrowth.confirmations}</b><span>CONFIRMATIONS</span></div>
      <div class="kpi"><b style="color:#c56cf0">+${D.knowledgeGrowth.discoveries}</b><span>DISCOVERIES</span></div>
      <div class="kpi"><b style="color:#ff9f43">+${D.knowledgeGrowth.boundaries}</b><span>BOUNDARIES</span></div>
      <div class="kpi"><b style="color:#ff5470">${D.knowledgeGrowth.refutations}</b><span>REFUTATIONS</span></div>
    </div>
  </div>

  <div class="ch" style="grid-column:span 2"><div class="n">CH6</div><h3>Evolution <span>· ${D.evolution.product}</span></h3>
    <div class="tl">
      ${D.evolution.events.map((e) => `<div class="pt" title="${e.label}"><i style="color:${tagColor(e.tag)}"></i><span>${e.tag}</span></div>`).join('')}
    </div>
  </div>

  <div class="ch"><div class="n">CH7</div><h3>Research Phase <span>· VU</span></h3>
    <div class="vumeter">
      ${vbar('Disc', D.researchPhase.discovery, maxPhase, '#39d98a')}
      ${vbar('Valid', D.researchPhase.validation, maxPhase, '#ffb454')}
      ${vbar('Prod', D.researchPhase.production, maxPhase, '#ff5470')}
    </div>
    <div class="tag" style="margin-top:6px">phase ${D.researchPhase.phase} · index ${D.researchPhase.phaseIndex}</div>
  </div>

  <div class="ch" style="grid-column:span 2"><div class="n">CH8</div><h3>Knowledge Entropy <span>· lower = more understood</span></h3>
    <div class="entropy">
      ${D.entropy.byProject.map((p) => { const h = Math.round(p.entropy * 100); const c = p.entropy > 0.6 ? '#ff5470' : p.entropy > 0.4 ? '#ffb454' : '#39d98a'; return `<div class="ent"><div class="col"><i style="height:${h}%;background:${c}"></i></div><span>${p.project.length > 8 ? p.project.slice(0, 7) + '…' : p.project}<br>${p.entropy}</span></div>`; }).join('')}
    </div>
    <div class="tag" style="margin-top:6px">overall ${D.entropy.overall} — the goal is to make this bar fall</div>
  </div>

</div>

<div class="foot">
  <span class="v">VALIDATION BOARD —</span>
  <span class="v">reproducibility <b>${D.validation.reproducibility}</b></span>·
  <span class="v">discrimination <b>${D.validation.discrimination ? '✓' : '✗'}</b></span>·
  <span class="v">independence <b>${D.validation.independence ? '✓' : '✗'}</b></span>·
  <span class="v">sensitivity <b>${D.validation.sensitivity}</b></span>·
  <span class="v">authority isolation <b>${D.validation.authorityIsolation}</b></span>·
  <span class="v">reasoning <b>${D.validation.reasoning}</b></span>·
  <span class="v">promotable <b>${D.validation.promotable ? 'YES' : 'no'}</b> · auto-promote <b style="color:#ff9f43">${D.validation.autoPromote ? 'yes' : 'no — a human decides'}</b></span>
</div>

<div class="legend">LEARNING light: dark = no change · lit = evidence in · blinking = knowledge event · violet = discovery · amber = boundary · red = refutation. &nbsp; Channels carry REAL module data; sources/feed are sample until SharePoint opens.</div>

</div></body></html>`;

const out = `${here}/control-room.html`;
writeFileSync(out, html);
// also emit the static JSON the React tab reads (read-only snapshot for the app)
try { writeFileSync(`${here}/../../../public/control-room.json`, JSON.stringify(D, null, 2)); } catch { /* public/ optional */ }
return out;
}

if (import.meta.url === `file://${process.argv[1]}`) console.log(buildStudio());
