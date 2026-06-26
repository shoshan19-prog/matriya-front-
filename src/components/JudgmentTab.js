import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import './JudgmentTab.css';

// One real Fresco case, used by the "טען דוגמת Fresco" button.
const FRESCO_EXAMPLE = {
  domain: 'render/plaster — heritage masonry',
  decided_by: '',
  context: {
    substrate: 'exterior stone wall, soft historic masonry',
    conditions: 'rising damp + sub-surface salts; previous cement render delaminating; Mediterranean exterior',
  },
  problem: 'Cement render is peeling and trapping moisture; salts crystallising behind the film and spalling the masonry.',
  decision: 'Strip cement render; apply breathable lime (NHL) render; finish with mineral silicate paint.',
  rationale: 'High vapour permeability lets the wall dry outward; lime\'s low elastic modulus matches soft masonry and avoids stress cracking; evaporation moves salt crystallisation to the cleanable surface instead of behind a film.',
  alternatives_considered: [
    { option: 'Cement render (re-do)', why_rejected: 'Low vapour permeability traps moisture; rigid, cracks on soft masonry; accelerates sub-surface salt damage.' },
    { option: 'Acrylic / film-forming paint', why_rejected: 'Non-breathable film; blisters and peels under vapour pressure from a damp wall.' },
  ],
  confidence: 0.8,
  predictions: [
    { metric: 'wall_moisture_pct', kind: 'numeric', comparator: '<', target: 5, partial_band: 1.5, horizon_days: 180 },
    { metric: 'delamination', kind: 'qualitative', expected_max: 'minimal', horizon_days: 365 },
    { metric: 'salt_efflorescence', kind: 'qualitative', expected_max: 'minimal', horizon_days: 180 },
  ],
};

const blankPrediction = () => ({ metric: '', kind: 'numeric', comparator: '<', target: 0, partial_band: '', expected_max: 'minimal', horizon_days: 180 });
const blankForm = () => ({
  domain: '', decided_by: '',
  context: { substrate: '', conditions: '' },
  problem: '', decision: '', rationale: '',
  alternatives_considered: [{ option: '', why_rejected: '' }],
  confidence: 0.7,
  predictions: [blankPrediction()],
});

export default function JudgmentTab() {
  const [form, setForm] = useState(blankForm());
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState(null);
  const [saved, setSaved] = useState(null);
  const [calExpert, setCalExpert] = useState('');
  const [calibration, setCalibration] = useState(null);
  const [recent, setRecent] = useState([]);

  const loadRecent = useCallback(async () => {
    try { const { data } = await api.get('/judgments'); setRecent(data.slice(0, 8)); } catch { /* not fatal */ }
  }, []);
  useEffect(() => { loadRecent(); }, [loadRecent]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const setCtx = (patch) => setForm((f) => ({ ...f, context: { ...f.context, ...patch } }));

  const setAlt = (i, patch) => setForm((f) => {
    const a = f.alternatives_considered.slice(); a[i] = { ...a[i], ...patch }; return { ...f, alternatives_considered: a };
  });
  const setPred = (i, patch) => setForm((f) => {
    const p = f.predictions.slice(); p[i] = { ...p[i], ...patch }; return { ...f, predictions: p };
  });

  // Build the payload, coercing prediction fields by kind.
  const buildPayload = () => ({
    ...form,
    confidence: Number(form.confidence),
    predictions: form.predictions.map((p) => p.kind === 'numeric'
      ? { metric: p.metric, kind: 'numeric', comparator: p.comparator, target: Number(p.target), ...(p.partial_band !== '' ? { partial_band: Number(p.partial_band) } : {}), horizon_days: Number(p.horizon_days) }
      : { metric: p.metric, kind: 'qualitative', expected_max: p.expected_max, horizon_days: Number(p.horizon_days) }),
  });

  const submit = async () => {
    setSaving(true); setErrors(null); setSaved(null);
    try {
      const { data } = await api.post('/judgments', buildPayload());
      setSaved(data);
      loadRecent();
    } catch (e) {
      if (e.response?.status === 422) setErrors(e.response.data.reasons || ['Refused at capture']);
      else setErrors([e.response?.data?.error || e.message]);
    } finally { setSaving(false); }
  };

  const recordObservation = async (judgmentId, predIdx, value) => {
    try {
      const { data } = await api.post(`/judgments/${judgmentId}/observations`, { prediction_idx: predIdx, value });
      setSaved(data); loadRecent();
    } catch (e) { alert('Observation failed: ' + (e.response?.data?.error || e.message)); }
  };

  const lookupCalibration = async () => {
    const { data } = await api.get('/judgments/calibration', { params: calExpert ? { expert: calExpert } : {} });
    setCalibration(data);
  };

  return (
    <div className="judgment-tab" dir="rtl">
      <div className="jt-intro">
        <h2>Validated Judgment — לכידת שיפוט מקצועי</h2>
        <p>
          היחידה האטומית אינה ניסוי אלא <b>שיפוט בר־הפרכה</b>: החלטה תחת אי־ודאות, עם חלופות שנפסלו
          ותחזית שניתן לבדוק מול המציאות. <b>אין שיפוט בלי תחזית בת־הפרכה</b> — המערכת תסרב לשמור.
        </p>
        <button className="jt-ghost" type="button" onClick={() => { setForm({ ...FRESCO_EXAMPLE, decided_by: form.decided_by }); setSaved(null); setErrors(null); }}>
          טען דוגמת Fresco (קיר אבן לח)
        </button>
      </div>

      <div className="jt-grid">
        <label>תחום (domain)<input value={form.domain} onChange={(e) => set({ domain: e.target.value })} placeholder="render/plaster — heritage masonry" /></label>
        <label>מי החליט (decided_by)<input value={form.decided_by} onChange={(e) => set({ decided_by: e.target.value })} placeholder="(ברירת מחדל: המשתמש המחובר)" /></label>
        <label>מצע (substrate)<input value={form.context.substrate} onChange={(e) => setCtx({ substrate: e.target.value })} /></label>
        <label>תנאים (conditions)<input value={form.context.conditions} onChange={(e) => setCtx({ conditions: e.target.value })} /></label>
      </div>

      <label className="jt-block">הבעיה (problem)<textarea value={form.problem} onChange={(e) => set({ problem: e.target.value })} rows={2} /></label>
      <label className="jt-block">ההחלטה (decision)<textarea value={form.decision} onChange={(e) => set({ decision: e.target.value })} rows={2} /></label>
      <label className="jt-block">למה — המנגנון (rationale)<textarea value={form.rationale} onChange={(e) => set({ rationale: e.target.value })} rows={3} /></label>

      <div className="jt-section">
        <div className="jt-section-head"><h3>חלופות שנפסלו (why-not)</h3><button type="button" className="jt-ghost" onClick={() => set({ alternatives_considered: [...form.alternatives_considered, { option: '', why_rejected: '' }] })}>+ הוסף</button></div>
        {form.alternatives_considered.map((a, i) => (
          <div className="jt-row" key={i}>
            <input placeholder="חלופה" value={a.option} onChange={(e) => setAlt(i, { option: e.target.value })} />
            <input placeholder="למה נפסלה" value={a.why_rejected} onChange={(e) => setAlt(i, { why_rejected: e.target.value })} />
            {form.alternatives_considered.length > 1 && <button type="button" className="jt-del" onClick={() => set({ alternatives_considered: form.alternatives_considered.filter((_, j) => j !== i) })}>×</button>}
          </div>
        ))}
      </div>

      <div className="jt-section">
        <div className="jt-section-head"><h3>תחזיות בנות־הפרכה (חובה)</h3><button type="button" className="jt-ghost" onClick={() => set({ predictions: [...form.predictions, blankPrediction()] })}>+ הוסף</button></div>
        {form.predictions.map((p, i) => (
          <div className="jt-pred" key={i}>
            <input placeholder="מדד (metric)" value={p.metric} onChange={(e) => setPred(i, { metric: e.target.value })} />
            <select value={p.kind} onChange={(e) => setPred(i, { kind: e.target.value })}>
              <option value="numeric">מספרי</option>
              <option value="qualitative">איכותני (חומרה)</option>
            </select>
            {p.kind === 'numeric' ? (
              <>
                <select value={p.comparator} onChange={(e) => setPred(i, { comparator: e.target.value })}>
                  {['<', '<=', '>', '>=', '=='].map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <input className="jt-num" type="number" placeholder="יעד" value={p.target} onChange={(e) => setPred(i, { target: e.target.value })} />
                <input className="jt-num" type="number" placeholder="±band" value={p.partial_band} onChange={(e) => setPred(i, { partial_band: e.target.value })} />
              </>
            ) : (
              <select value={p.expected_max} onChange={(e) => setPred(i, { expected_max: e.target.value })}>
                {['none', 'minimal', 'moderate', 'severe'].map((s) => <option key={s} value={s}>≤ {s}</option>)}
              </select>
            )}
            <input className="jt-num" type="number" placeholder="אופק (ימים)" value={p.horizon_days} onChange={(e) => setPred(i, { horizon_days: e.target.value })} />
            {form.predictions.length > 1 && <button type="button" className="jt-del" onClick={() => set({ predictions: form.predictions.filter((_, j) => j !== i) })}>×</button>}
          </div>
        ))}
      </div>

      <label className="jt-block jt-conf">ביטחון (confidence): <b>{Number(form.confidence).toFixed(2)}</b>
        <input type="range" min="0.05" max="1" step="0.05" value={form.confidence} onChange={(e) => set({ confidence: e.target.value })} />
      </label>

      {errors && (
        <div className="jt-errors">
          <b>נדחה בלכידה (Judgment refused):</b>
          <ul>{errors.map((er, i) => <li key={i}>{er}</li>)}</ul>
        </div>
      )}

      <button className="jt-primary" type="button" disabled={saving} onClick={submit}>{saving ? 'שומר…' : 'לכוד שיפוט'}</button>

      {saved && <SavedJudgment j={saved} onObserve={recordObservation} />}

      <div className="jt-calibration">
        <h3>Calibration לפי מומחה</h3>
        <div className="jt-row">
          <input placeholder="שם מומחה (ריק = הכל)" value={calExpert} onChange={(e) => setCalExpert(e.target.value)} />
          <button type="button" className="jt-ghost" onClick={lookupCalibration}>שלוף</button>
        </div>
        {calibration && (
          <div className="jt-cal-card">
            <span>שיפוטים: <b>{calibration.judgments}</b></span>
            <span>סגורים: <b>{calibration.closed}</b></span>
            {calibration.mean_outcome != null && <span>תוצאה ממוצעת: <b>{(calibration.mean_outcome * 100).toFixed(0)}%</b></span>}
            {calibration.mean_brier != null && <span>Brier: <b>{calibration.mean_brier.toFixed(3)}</b></span>}
            <span className={`jt-tag jt-${(calibration.calibration || '').replace(/[^a-z]/g, '')}`}>{calibration.calibration}</span>
          </div>
        )}
      </div>

      {recent.length > 0 && (
        <div className="jt-recent">
          <h3>שיפוטים אחרונים</h3>
          {recent.map((j) => (
            <div className="jt-recent-row" key={j.id}>
              <span className="jt-recent-dom">{j.domain}</span>
              <span>{j.decided_by}</span>
              <span className={`jt-tag jt-${j.status}`}>{j.status}</span>
              <span>{j.score?.closed}/{j.score?.total} closed</span>
              {j.score?.outcome != null && <span>{(j.score.outcome * 100).toFixed(0)}% · {j.score.verdict}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SavedJudgment({ j, onObserve }) {
  const [obs, setObs] = useState({});
  return (
    <div className="jt-saved" dir="rtl">
      <div className="jt-saved-head">
        <b>נשמר ✓ {j.id?.slice(0, 8)}</b>
        <span className={`jt-tag jt-${j.status}`}>{j.status}</span>
        {j.score?.outcome != null && <span>תוצאה: <b>{(j.score.outcome * 100).toFixed(0)}%</b> · {j.score.verdict} · Brier {j.score.brier?.toFixed(3)} ({j.score.calibration})</span>}
      </div>
      <table className="jt-pred-table">
        <thead><tr><th>מדד</th><th>תחזית</th><th>אופק</th><th>נצפה</th><th>ציון</th><th>רשום תצפית</th></tr></thead>
        <tbody>
          {j.predictions.map((p, i) => {
            const g = j.score?.graded?.find((x) => x.prediction_idx === i);
            const due = j.followups?.find((f) => f.prediction_idx === i);
            return (
              <tr key={i}>
                <td>{p.metric}</td>
                <td>{p.kind === 'numeric' ? `${p.comparator} ${p.target}` : `≤ ${p.expected_max}`}</td>
                <td>{due?.due_at || `${p.horizon_days}d`}</td>
                <td>{g ? String(g.observed) : '—'}</td>
                <td>{g ? <span className={`jt-grade jt-${g.grade}`}>{g.grade}</span> : <span className="jt-grade jt-pending">pending</span>}</td>
                <td>
                  {!g && (
                    <span className="jt-obs">
                      {p.kind === 'numeric'
                        ? <input className="jt-num" type="number" value={obs[i] ?? ''} onChange={(e) => setObs({ ...obs, [i]: e.target.value })} />
                        : <select value={obs[i] ?? 'none'} onChange={(e) => setObs({ ...obs, [i]: e.target.value })}>{['none', 'minimal', 'moderate', 'severe'].map((s) => <option key={s}>{s}</option>)}</select>}
                      <button type="button" className="jt-ghost" onClick={() => onObserve(j.id, i, obs[i])}>שמור</button>
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
