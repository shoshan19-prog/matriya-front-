import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import './AuditTrailPanel.css';

/**
 * Audit Trail panel — surfaces the decision audit log endpoints that had no UI:
 *   GET /api/audit/decisions?limit=&offset=                 (paged, all sessions)
 *   GET /api/audit/session/:sessionId/decisions?limit=      (one session, replay order)
 * Read-only. Handles 503 (decision audit log not yet available) gracefully.
 */
const PAGE = 50;
const short = (s) => (s ? String(s).slice(0, 8) : '—');
const fixed = (x, d = 2) => (x == null ? '—' : Number(x).toFixed(d));
const when = (t) => (t ? new Date(t).toLocaleString('he-IL') : '—');

function AuditTrailPanel() {
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [offset, setOffset] = useState(0);
    const [sessionFilter, setSessionFilter] = useState('');
    const [appliedSession, setAppliedSession] = useState('');
    const [loading, setLoading] = useState(false);
    const [unavailable, setUnavailable] = useState(false);
    const [error, setError] = useState(null);

    const loadAll = useCallback(async (nextOffset = 0, append = false) => {
        setLoading(true);
        setError(null);
        setUnavailable(false);
        try {
            const res = await api.get('/api/audit/decisions', {
                params: { limit: PAGE, offset: nextOffset },
                timeout: 15000
            });
            const decisions = res.data.decisions || [];
            setRows((prev) => (append ? [...prev, ...decisions] : decisions));
            setTotal(res.data.total ?? decisions.length);
            setOffset(nextOffset);
        } catch (e) {
            if (e.response?.status === 503) setUnavailable(true);
            else setError(e.response?.data?.error || e.message || 'שגיאה בטעינת יומן ההחלטות');
        } finally {
            setLoading(false);
        }
    }, []);

    const loadSession = useCallback(async (sessionId) => {
        setLoading(true);
        setError(null);
        setUnavailable(false);
        try {
            const res = await api.get(`/api/audit/session/${encodeURIComponent(sessionId)}/decisions`, {
                params: { limit: 200 },
                timeout: 15000
            });
            const decisions = res.data.decisions || [];
            setRows(decisions);
            setTotal(decisions.length);
            setOffset(0);
        } catch (e) {
            if (e.response?.status === 503) setUnavailable(true);
            else setError(e.response?.data?.error || e.message || 'שגיאה בטעינת החלטות הסשן');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAll(0, false);
    }, [loadAll]);

    const applyFilter = () => {
        const s = sessionFilter.trim();
        setAppliedSession(s);
        if (s) loadSession(s);
        else loadAll(0, false);
    };

    const clearFilter = () => {
        setSessionFilter('');
        setAppliedSession('');
        loadAll(0, false);
    };

    const canLoadMore = !appliedSession && rows.length < total;

    return (
        <div className="audit-section">
            <div className="audit-header">
                <h3>Audit Trail — יומן החלטות</h3>
                <div className="audit-filter">
                    <input
                        type="text"
                        placeholder="סינון לפי session_id…"
                        value={sessionFilter}
                        onChange={(e) => setSessionFilter(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') applyFilter(); }}
                    />
                    <button className="section-button" onClick={applyFilter} disabled={loading}>סנן</button>
                    {appliedSession && (
                        <button className="section-button" onClick={clearFilter} disabled={loading}>נקה</button>
                    )}
                </div>
            </div>

            {appliedSession && (
                <div className="audit-scope-note">מציג החלטות עבור סשן <code>{appliedSession}</code> (סדר replay)</div>
            )}

            {error && <div className="error-message">{error}</div>}

            {unavailable ? (
                <div className="empty-state">
                    יומן ההחלטות (Decision Audit Log) עדיין לא זמין — לא נרשמו החלטות שער. הנתונים יופיעו לאחר ריצות מחקר.
                </div>
            ) : loading && !rows.length ? (
                <div className="loading">טוען…</div>
            ) : !rows.length ? (
                <div className="empty-state">אין החלטות להצגה</div>
            ) : (
                <>
                    <div className="audit-count">
                        מוצג {rows.length}{!appliedSession ? ` מתוך ${total}` : ''}
                    </div>
                    <div className="audit-table-wrap">
                        <table className="audit-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Session</th>
                                    <th>Stage</th>
                                    <th>החלטה</th>
                                    <th>סוג תגובה</th>
                                    <th>שאילתה</th>
                                    <th>Confidence</th>
                                    <th>זמן</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((r) => (
                                    <tr key={r.id}>
                                        <td>{r.id}</td>
                                        <td title={r.session_id}>{short(r.session_id)}</td>
                                        <td>{r.stage || '—'}</td>
                                        <td>
                                            <span className={`audit-decision audit-decision-${(r.decision || '').toLowerCase()}`}>
                                                {r.decision || '—'}
                                            </span>
                                        </td>
                                        <td>{r.response_type || '—'}</td>
                                        <td className="audit-query" title={r.request_query || ''}>
                                            {r.request_query || '—'}
                                        </td>
                                        <td>{fixed(r.confidence_score)}</td>
                                        <td>{when(r.created_at)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {canLoadMore && (
                        <div className="audit-more">
                            <button
                                className="section-button"
                                onClick={() => loadAll(offset + PAGE, true)}
                                disabled={loading}
                            >
                                {loading ? 'טוען…' : 'טען עוד'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default AuditTrailPanel;
