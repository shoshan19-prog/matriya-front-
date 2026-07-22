import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import './RecoveryRulesPanel.css';

/**
 * Recovery Rules panel — surfaces the recovery rules endpoint that had no UI:
 *   GET /admin/recovery/rules   (default rules + available condition types)
 * READ-ONLY: shows the deterministic recovery rulebook. The rollback action
 * (POST /admin/recovery/rollback) is a write op and is intentionally NOT wired.
 */
const label = (x) => {
    if (x == null) return '—';
    if (typeof x === 'string') return x;
    if (typeof x === 'object') return x.type || x.name || JSON.stringify(x);
    return String(x);
};

function RecoveryRulesPanel() {
    const [rules, setRules] = useState([]);
    const [conditionTypes, setConditionTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get('/admin/recovery/rules', { timeout: 15000 });
            setRules(res.data.rules || []);
            setConditionTypes(res.data.conditionTypes || []);
        } catch (e) {
            setError(e.response?.data?.error || e.message || 'שגיאה בטעינת כללי ה-Recovery');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    return (
        <div className="rules-section">
            <div className="rules-header">
                <h3>Recovery Rules — כללי שחזור</h3>
                <button className="section-button" onClick={load} disabled={loading}>
                    {loading ? 'טוען…' : 'רענן'}
                </button>
            </div>

            <div className="rules-note">תצוגה בלבד — חוקת ה-Recovery הדטרמיניסטית. פעולת rollback אינה נכללת כאן.</div>

            {error && <div className="error-message">{error}</div>}

            {loading && !rules.length ? (
                <div className="loading">טוען…</div>
            ) : !rules.length ? (
                <div className="empty-state">אין כללים להצגה</div>
            ) : (
                <>
                    <div className="rules-table-wrap">
                        <table className="rules-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>תנאי</th>
                                    <th>פרמטרים</th>
                                    <th>פעולה</th>
                                    <th>סיבה</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rules.map((r, i) => (
                                    <tr key={r.id ?? i}>
                                        <td>{r.id ?? i + 1}</td>
                                        <td>{label(r.condition?.type)}</td>
                                        <td className="rules-params">
                                            {r.condition?.params && Object.keys(r.condition.params).length
                                                ? JSON.stringify(r.condition.params)
                                                : '—'}
                                        </td>
                                        <td><span className="rules-action">{label(r.action)}</span></td>
                                        <td className="rules-reason" title={r.reason || ''}>{r.reason || '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {conditionTypes.length > 0 && (
                        <div className="rules-condition-types">
                            <div className="rules-ct-label">סוגי תנאים זמינים</div>
                            <div className="rules-ct-list">
                                {conditionTypes.map((c, i) => (
                                    <span className="rules-ct-chip" key={i}>{label(c)}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default RecoveryRulesPanel;
