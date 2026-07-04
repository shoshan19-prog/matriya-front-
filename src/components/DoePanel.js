import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import './DoePanel.css';

/**
 * DOE (Design of Experiments) panel — surfaces the DoE endpoints that had no UI:
 *   GET /admin/doe/designs            (list)
 *   GET /admin/doe/designs/:id        (one design)
 *   GET /admin/doe/export?format=     (research-loop runs, json/csv)
 * READ-ONLY: no create / patch / delete / execute (write actions omitted).
 */
const when = (t) => (t ? new Date(t).toLocaleString('he-IL') : '—');

function DoePanel() {
    const [designs, setDesigns] = useState([]);
    const [selected, setSelected] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // export
    const [runs, setRuns] = useState(null);
    const [exportLoading, setExportLoading] = useState(false);
    const [csvLoading, setCsvLoading] = useState(false);

    const loadDesigns = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get('/admin/doe/designs', { timeout: 15000 });
            setDesigns(res.data.designs || []);
        } catch (e) {
            setError(e.response?.data?.error || e.message || 'שגיאה בטעינת תכנוני DoE');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDesigns();
    }, [loadDesigns]);

    const openDetail = async (id) => {
        setDetailLoading(true);
        setError(null);
        try {
            const res = await api.get(`/admin/doe/designs/${id}`, { timeout: 15000 });
            setSelected(res.data);
        } catch (e) {
            setError(e.response?.data?.error || e.message || 'שגיאה בטעינת פרטי תכנון');
        } finally {
            setDetailLoading(false);
        }
    };

    const loadRuns = async () => {
        setExportLoading(true);
        setError(null);
        try {
            const res = await api.get('/admin/doe/export', { params: { format: 'json', limit: 100 }, timeout: 20000 });
            setRuns(res.data.runs || []);
        } catch (e) {
            setError(e.response?.data?.error || e.message || 'שגיאה בטעינת ריצות');
        } finally {
            setExportLoading(false);
        }
    };

    const downloadCsv = async () => {
        setCsvLoading(true);
        setError(null);
        try {
            const res = await api.get('/admin/doe/export', {
                params: { format: 'csv', limit: 500 },
                responseType: 'blob',
                timeout: 30000
            });
            const url = URL.createObjectURL(res.data);
            const a = document.createElement('a');
            a.href = url;
            a.download = `doe-export-${new Date().toISOString().slice(0, 10)}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (e) {
            setError(e.response?.data?.error || e.message || 'שגיאה בהורדת CSV');
        } finally {
            setCsvLoading(false);
        }
    };

    return (
        <div className="doe-section">
            <div className="doe-header">
                <h3>DOE — Design of Experiments</h3>
                <button className="section-button" onClick={loadDesigns} disabled={loading}>
                    {loading ? 'טוען…' : 'רענן'}
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {/* Designs */}
            {loading && !designs.length ? (
                <div className="loading">טוען…</div>
            ) : !designs.length ? (
                <div className="empty-state">אין תכנוני DoE שמורים</div>
            ) : (
                <div className="doe-layout">
                    <div className="doe-table-wrap">
                        <table className="doe-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>שם</th>
                                    <th>תיאור</th>
                                    <th>זמן</th>
                                </tr>
                            </thead>
                            <tbody>
                                {designs.map((d) => (
                                    <tr
                                        key={d.id}
                                        className={selected?.id === d.id ? 'selected' : ''}
                                        onClick={() => openDetail(d.id)}
                                    >
                                        <td>{d.id}</td>
                                        <td>{d.name || '—'}</td>
                                        <td className="doe-desc-cell" title={d.description || ''}>{d.description || '—'}</td>
                                        <td>{when(d.created_at)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="doe-detail">
                        {detailLoading ? (
                            <div className="loading">טוען פרטים…</div>
                        ) : !selected ? (
                            <div className="empty-state">בחרו תכנון לצפייה בפרטים</div>
                        ) : (
                            <div className="doe-detail-card">
                                <h4>{selected.name || `Design #${selected.id}`}</h4>
                                {selected.description && <p className="doe-detail-desc">{selected.description}</p>}
                                {selected.query_template && (
                                    <>
                                        <div className="doe-detail-label">Query template</div>
                                        <pre className="doe-pre">{selected.query_template}</pre>
                                    </>
                                )}
                                <div className="doe-detail-label">Design</div>
                                <pre className="doe-pre">{JSON.stringify(selected.design ?? {}, null, 2)}</pre>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Export */}
            <div className="doe-export">
                <div className="doe-export-head">
                    <h4>ייצוא ריצות (Research Loop)</h4>
                    <div className="doe-export-actions">
                        <button className="section-button" onClick={loadRuns} disabled={exportLoading}>
                            {exportLoading ? 'טוען…' : 'טען ריצות'}
                        </button>
                        <button className="section-button" onClick={downloadCsv} disabled={csvLoading}>
                            {csvLoading ? 'מוריד…' : 'הורד CSV'}
                        </button>
                    </div>
                </div>
                {runs && (
                    runs.length ? (
                        <div className="doe-table-wrap">
                            <table className="doe-table">
                                <thead>
                                    <tr>
                                        <th>Run</th>
                                        <th>Session</th>
                                        <th>שאילתה</th>
                                        <th>Design</th>
                                        <th>משך (ms)</th>
                                        <th>זמן</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {runs.map((r) => (
                                        <tr key={r.run_id}>
                                            <td>{r.run_id}</td>
                                            <td title={r.session_id}>{r.session_id ? String(r.session_id).slice(0, 8) : '—'}</td>
                                            <td className="doe-desc-cell" title={r.query || ''}>{r.query || '—'}</td>
                                            <td>{r.doe_design_id ?? '—'}</td>
                                            <td>{r.duration_ms ?? '—'}</td>
                                            <td>{when(r.created_at)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-state">אין ריצות להצגה</div>
                    )
                )}
            </div>
        </div>
    );
}

export default DoePanel;
