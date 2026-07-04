import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import './SnapshotsPanel.css';

/**
 * Snapshots panel — surfaces the system snapshot endpoints that had no UI:
 *   GET /admin/snapshots            (list metadata)
 *   GET /admin/snapshots/:id        (one snapshot + payload counts)
 * READ-ONLY: no create / no restore (those are write actions, intentionally omitted).
 */
const when = (t) => (t ? new Date(t).toLocaleString('he-IL') : '—');

function SnapshotsPanel() {
    const [snapshots, setSnapshots] = useState([]);
    const [selected, setSelected] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadList = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get('/admin/snapshots', { params: { limit: 100 }, timeout: 15000 });
            setSnapshots(res.data.snapshots || []);
        } catch (e) {
            setError(e.response?.data?.error || e.message || 'שגיאה בטעינת תמונות מצב');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadList();
    }, [loadList]);

    const openDetail = async (id) => {
        setDetailLoading(true);
        setError(null);
        try {
            const res = await api.get(`/admin/snapshots/${id}`, { timeout: 15000 });
            setSelected(res.data);
        } catch (e) {
            setError(e.response?.data?.error || e.message || 'שגיאה בטעינת פרטי תמונת מצב');
        } finally {
            setDetailLoading(false);
        }
    };

    return (
        <div className="snapshots-section">
            <div className="snapshots-header">
                <h3>Snapshots — תמונות מצב</h3>
                <button className="section-button" onClick={loadList} disabled={loading}>
                    {loading ? 'טוען…' : 'רענן'}
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {loading && !snapshots.length ? (
                <div className="loading">טוען…</div>
            ) : !snapshots.length ? (
                <div className="empty-state">אין תמונות מצב שמורות</div>
            ) : (
                <div className="snapshots-layout">
                    <div className="snapshots-table-wrap">
                        <table className="snapshots-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>שם</th>
                                    <th>סוג</th>
                                    <th>נוצר ע״י</th>
                                    <th>זמן</th>
                                </tr>
                            </thead>
                            <tbody>
                                {snapshots.map((s) => (
                                    <tr
                                        key={s.id}
                                        className={selected?.id === s.id ? 'selected' : ''}
                                        onClick={() => openDetail(s.id)}
                                    >
                                        <td>{s.id}</td>
                                        <td>{s.name || '—'}</td>
                                        <td>{s.snapshot_type || '—'}</td>
                                        <td>{s.created_by || '—'}</td>
                                        <td>{when(s.created_at)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="snapshots-detail">
                        {detailLoading ? (
                            <div className="loading">טוען פרטים…</div>
                        ) : !selected ? (
                            <div className="empty-state">בחרו תמונת מצב לצפייה בפרטים</div>
                        ) : (
                            <div className="snapshot-detail-card">
                                <h4>{selected.name || `Snapshot #${selected.id}`}</h4>
                                {selected.description && <p className="snapshot-desc">{selected.description}</p>}
                                <dl className="snapshot-meta">
                                    <dt>מזהה</dt><dd>{selected.id}</dd>
                                    <dt>סוג</dt><dd>{selected.snapshot_type || '—'}</dd>
                                    <dt>נוצר ע״י</dt><dd>{selected.created_by || '—'}</dd>
                                    <dt>זמן</dt><dd>{when(selected.created_at)}</dd>
                                </dl>
                                {selected.counts && (
                                    <div className="snapshot-counts">
                                        <div className="snapshot-count-card">
                                            <span className="snapshot-count-label">נקודות מחזור (Integrity)</span>
                                            <span className="snapshot-count-value">{selected.counts.integrity_cycle_snapshots ?? 0}</span>
                                        </div>
                                        <div className="snapshot-count-card">
                                            <span className="snapshot-count-label">הפרות (Violations)</span>
                                            <span className="snapshot-count-value">{selected.counts.violations ?? 0}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default SnapshotsPanel;
