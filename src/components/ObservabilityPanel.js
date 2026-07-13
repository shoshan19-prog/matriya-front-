import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import './ObservabilityPanel.css';

/**
 * Observability panel — surfaces the backend observability endpoints that had no UI:
 *   GET /api/observability/dashboard  (False B / Missed B rates, confidence, latency)
 *   GET /api/observability/sem        (component breakdown, confidence range)
 *   GET /api/observability/gates      (recent gate decisions)
 * Read-only. Handles 503 (decision audit log not yet available) gracefully.
 */
const pct = (x) => (x == null ? '—' : `${(x * 100).toFixed(1)}%`);
const num = (x) => (x == null ? '—' : x);
const ms = (x) => (x == null ? '—' : `${x}ms`);
const short = (s) => (s ? String(s).slice(0, 8) : '—');
const fixed = (x, d = 2) => (x == null ? '—' : Number(x).toFixed(d));

function ObservabilityPanel() {
    const [dashboard, setDashboard] = useState(null);
    const [sem, setSem] = useState(null);
    const [gates, setGates] = useState(null);
    const [loading, setLoading] = useState(false);
    const [unavailable, setUnavailable] = useState(false);
    const [error, setError] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        setUnavailable(false);
        try {
            const [dRes, sRes, gRes] = await Promise.allSettled([
                api.get('/api/observability/dashboard', { timeout: 15000 }),
                api.get('/api/observability/sem', { timeout: 15000 }),
                api.get('/api/observability/gates?limit=50', { timeout: 15000 })
            ]);

            // 503 on all three = decision audit log not available yet
            const all503 = [dRes, sRes, gRes].every(
                (r) => r.status === 'rejected' && r.reason?.response?.status === 503
            );
            if (all503) {
                setUnavailable(true);
                return;
            }

            if (dRes.status === 'fulfilled') setDashboard(dRes.value.data);
            if (sRes.status === 'fulfilled') setSem(sRes.value.data);
            if (gRes.status === 'fulfilled') setGates(gRes.value.data);

            const firstErr = [dRes, sRes, gRes].find(
                (r) => r.status === 'rejected' && r.reason?.response?.status !== 503
            );
            if (firstErr) {
                setError(firstErr.reason?.response?.data?.error || firstErr.reason?.message || 'שגיאה בטעינת נתוני Observability');
            }
        } catch (e) {
            setError(e.response?.data?.error || e.message || 'שגיאה בטעינת נתוני Observability');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const cd = dashboard?.confidence_distribution || {};

    return (
        <div className="observability-section">
            <div className="observability-header">
                <h3>Observability</h3>
                <button className="section-button" onClick={load} disabled={loading}>
                    {loading ? 'טוען…' : 'רענן'}
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {unavailable ? (
                <div className="empty-state">
                    יומן ההחלטות (Decision Audit Log) עדיין לא זמין — לא נרשמו החלטות שער. הנתונים יופיעו לאחר ריצות מחקר.
                </div>
            ) : loading && !dashboard ? (
                <div className="loading">טוען…</div>
            ) : (
                <>
                    {/* KPI cards — reuse admin global-metrics styling */}
                    <div className="global-metrics-grid">
                        <div className="global-metric-card highlight">
                            <span className="global-metric-label">False B rate</span>
                            <span className="global-metric-value">{pct(dashboard?.false_b_rate)}</span>
                        </div>
                        <div className="global-metric-card highlight">
                            <span className="global-metric-label">Missed B rate</span>
                            <span className="global-metric-value">{pct(dashboard?.missed_b_rate)}</span>
                        </div>
                        <div className="global-metric-card">
                            <span className="global-metric-label">החלטות (סה״כ)</span>
                            <span className="global-metric-value">{num(dashboard?.total_decisions)}</span>
                        </div>
                        <div className="global-metric-card">
                            <span className="global-metric-label">שלב B (Stage B)</span>
                            <span className="global-metric-value">{num(dashboard?.stage_b_count)}</span>
                        </div>
                        <div className="global-metric-card">
                            <span className="global-metric-label">False B / Missed B</span>
                            <span className="global-metric-value">{num(dashboard?.false_b_count)} / {num(dashboard?.missed_b_count)}</span>
                        </div>
                        <div className="global-metric-card">
                            <span className="global-metric-label">בקשות (סה״כ)</span>
                            <span className="global-metric-value">{num(dashboard?.total_requests)}</span>
                        </div>
                        <div className="global-metric-card">
                            <span className="global-metric-label">שגיאות</span>
                            <span className="global-metric-value">{num(dashboard?.error_count)}</span>
                        </div>
                        <div className="global-metric-card">
                            <span className="global-metric-label">Latency p50 / p99</span>
                            <span className="global-metric-value">{ms(dashboard?.latency_p50)} / {ms(dashboard?.latency_p99)}</span>
                        </div>
                    </div>

                    {/* Confidence distribution */}
                    <div className="observability-block">
                        <h4>התפלגות ביטחון (Confidence)</h4>
                        <div className="observability-subgrid">
                            <div className="observability-mini">
                                <span className="observability-mini-title">Gate</span>
                                {cd.gate ? (
                                    <span>דגימות {cd.gate.samples} · min {fixed(cd.gate.min)} · max {fixed(cd.gate.max)} · ממוצע {fixed(cd.gate.mean)}</span>
                                ) : <span className="muted">—</span>}
                            </div>
                            <div className="observability-mini">
                                <span className="observability-mini-title">Stage B</span>
                                {cd.stage_b ? (
                                    <span>דגימות {cd.stage_b.samples} · min {fixed(cd.stage_b.min)} · max {fixed(cd.stage_b.max)} · ממוצע {fixed(cd.stage_b.mean)}</span>
                                ) : <span className="muted">—</span>}
                            </div>
                        </div>
                    </div>

                    {/* SEM output */}
                    {sem && (
                        <div className="observability-block">
                            <h4>SEM</h4>
                            <div className="observability-subgrid">
                                <div className="observability-mini">
                                    <span className="observability-mini-title">Component breakdown</span>
                                    <span>
                                        בדיקות {num(sem.component_breakdown?.gate_checks)} · עם ביטחון {num(sem.component_breakdown?.with_confidence)}
                                    </span>
                                    {sem.component_breakdown?.by_stage && (
                                        <span className="muted">
                                            לפי שלב: {Object.entries(sem.component_breakdown.by_stage).map(([k, v]) => `${k}:${v}`).join(' · ') || '—'}
                                        </span>
                                    )}
                                </div>
                                <div className="observability-mini">
                                    <span className="observability-mini-title">Confidence range</span>
                                    {sem.confidence_range ? (
                                        <span>min {fixed(sem.confidence_range.min)} · max {fixed(sem.confidence_range.max)} · p50 {fixed(sem.confidence_range.p50)} · p99 {fixed(sem.confidence_range.p99)}</span>
                                    ) : <span className="muted">—</span>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Gate records */}
                    <div className="observability-block">
                        <h4>החלטות שער אחרונות ({gates?.total ?? 0})</h4>
                        {!gates?.gates?.length ? (
                            <div className="empty-state">אין החלטות שער להצגה</div>
                        ) : (
                            <div className="observability-table-wrap">
                                <table className="observability-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Session</th>
                                            <th>Stage</th>
                                            <th>החלטה</th>
                                            <th>סוג תגובה</th>
                                            <th>Confidence</th>
                                            <th>Basis</th>
                                            <th>Model</th>
                                            <th>זמן</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {gates.gates.map((g) => (
                                            <tr key={g.id}>
                                                <td>{g.id}</td>
                                                <td title={g.session_id}>{short(g.session_id)}</td>
                                                <td>{g.stage || '—'}</td>
                                                <td>
                                                    <span className={`obs-decision obs-decision-${(g.decision || '').toLowerCase()}`}>
                                                        {g.decision || '—'}
                                                    </span>
                                                </td>
                                                <td>{g.response_type || '—'}</td>
                                                <td>{fixed(g.confidence_score)}</td>
                                                <td>{num(g.basis_count)}</td>
                                                <td title={g.model_version_hash}>{short(g.model_version_hash)}</td>
                                                <td>{g.created_at ? new Date(g.created_at).toLocaleString('he-IL') : '—'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default ObservabilityPanel;
