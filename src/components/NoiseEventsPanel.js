import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import './NoiseEventsPanel.css';

/**
 * Noise Events panel — surfaces the noise-events endpoint that had no UI:
 *   GET /api/observability/noise?limit=&offset=
 * READ-ONLY: recording noise (POST) and setting decision feedback
 * (PATCH /api/observability/decision/:id/feedback) are write ops and are
 * intentionally NOT wired. Handles 503 (noise events not available).
 */
const PAGE = 50;
const short = (s) => (s ? String(s).slice(0, 8) : '—');
const when = (t) => (t ? new Date(t).toLocaleString('he-IL') : '—');

function NoiseEventsPanel() {
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const [unavailable, setUnavailable] = useState(false);
    const [error, setError] = useState(null);

    const load = useCallback(async (nextOffset = 0, append = false) => {
        setLoading(true);
        setError(null);
        setUnavailable(false);
        try {
            const res = await api.get('/api/observability/noise', {
                params: { limit: PAGE, offset: nextOffset },
                timeout: 15000
            });
            const events = res.data.noise_events || [];
            setRows((prev) => (append ? [...prev, ...events] : events));
            setTotal(res.data.total ?? events.length);
            setOffset(nextOffset);
        } catch (e) {
            if (e.response?.status === 503) setUnavailable(true);
            else setError(e.response?.data?.error || e.message || 'שגיאה בטעינת אירועי Noise');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load(0, false);
    }, [load]);

    const canLoadMore = rows.length < total;

    return (
        <div className="noise-section">
            <div className="noise-header">
                <h3>Noise / Feedback — אירועי Noise</h3>
                <button className="section-button" onClick={() => load(0, false)} disabled={loading}>
                    {loading ? 'טוען…' : 'רענן'}
                </button>
            </div>
            <div className="noise-note">
                תצוגה בלבד — אירועים שסומנו כ-noise לצורך הערכה מחדש לאחר עדכון Kernel. סימון אירועים ומתן feedback הן פעולות כתיבה ואינן נכללות כאן.
            </div>

            {error && <div className="error-message">{error}</div>}

            {unavailable ? (
                <div className="empty-state">אירועי Noise אינם זמינים במערכת זו.</div>
            ) : loading && !rows.length ? (
                <div className="loading">טוען…</div>
            ) : !rows.length ? (
                <div className="empty-state">אין אירועי Noise להצגה</div>
            ) : (
                <>
                    <div className="noise-count">מוצג {rows.length} מתוך {total}</div>
                    <div className="noise-table-wrap">
                        <table className="noise-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Session</th>
                                    <th>Decision</th>
                                    <th>סוג אירוע</th>
                                    <th>Kernel בסיווג</th>
                                    <th>הערכה מחדש אחרי</th>
                                    <th>זמן</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((r) => (
                                    <tr key={r.id}>
                                        <td>{r.id}</td>
                                        <td title={r.session_id}>{short(r.session_id)}</td>
                                        <td>{r.decision_id ?? '—'}</td>
                                        <td><span className="noise-type">{r.event_type || '—'}</span></td>
                                        <td title={r.kernel_version_at_classification || ''}>{short(r.kernel_version_at_classification)}</td>
                                        <td title={r.re_evaluate_after_kernel_version || ''}>{short(r.re_evaluate_after_kernel_version)}</td>
                                        <td>{when(r.created_at)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {canLoadMore && (
                        <div className="noise-more">
                            <button className="section-button" onClick={() => load(offset + PAGE, true)} disabled={loading}>
                                {loading ? 'טוען…' : 'טען עוד'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default NoiseEventsPanel;
