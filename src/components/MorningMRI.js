import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import './MorningMRI.css';

/**
 * Morning MRI — מסך הפתיחה של MATRIYA.
 * כל הנתונים מגיעים חיים מהשרת (GET /mri): ספירות DB, מאגר וקטורי, ping לניהול,
 * זהות פריסה. מוצגת רק דלתא מאז הריצה הקודמת; לכל היותר 10 פריטים; כל פריט → פעולה.
 * חיישן ה-Drive נקרא מקובץ שמפרסמת ה-GitHub Action (same-origin, לא מקודד קשיח).
 */
const SEVERITY_ICON = { red: '🔴', yellow: '🟡', green: '🟢' };

function MorningMRI({ onNavigate }) {
    const [board, setBoard] = useState(null);
    const [sensor, setSensor] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const [mriRes, sensorRes] = await Promise.allSettled([
                axios.get('/mri', { baseURL: API_BASE_URL, timeout: 25000 }),
                axios.get('/mri/drive-sensor.json', { timeout: 5000 }) // same-origin, published by the intake Action
            ]);
            if (mriRes.status === 'fulfilled') {
                setBoard(mriRes.value.data);
            } else {
                setError(mriRes.reason?.response?.data?.error || mriRes.reason?.message || 'MRI failed');
            }
            if (sensorRes.status === 'fulfilled' && sensorRes.value.data && typeof sensorRes.value.data === 'object') {
                setSensor(sensorRes.value.data);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleAction = (action) => {
        if (!action) return;
        if (action.tab && onNavigate) onNavigate(action.tab);
        else if (action.href) window.open(action.href, '_blank', 'noopener');
    };

    if (loading) {
        return <div className="mri-loading">סורק את המערכת…</div>;
    }
    if (error) {
        return (
            <div className="mri-error">
                <p>ה-MRI נכשל: {error}</p>
                <button onClick={load}>נסה שוב</button>
            </div>
        );
    }

    // Merge server items with the Drive-sensor alert (client-side, still live data).
    const items = [...(board?.items || [])];
    if (sensor && sensor.ok === false && items.length < 10) {
        items.push({
            severity: 'red', kind: 'alert',
            title: `חיישן ה-Drive מנותק (${sensor.reason || 'לא ידוע'})`,
            delta: sensor.at ? `נכון ל-${new Date(sensor.at).toLocaleString('he-IL')}` : '',
            action: { label: 'חדש את ה-Secrets ב-GitHub Actions', href: sensor.actions_url || undefined },
            evidence: 'live'
        });
    }

    return (
        <div className="mri-board" dir="rtl">
            <div className="mri-header">
                <h2>MATRIYA — Morning MRI</h2>
                <div className="mri-meta">
                    {board?.previous_run
                        ? <>Δ מאז {new Date(board.previous_run).toLocaleString('he-IL')}</>
                        : 'ריצה ראשונה — נקבע קו בסיס'}
                    <span className="mri-took"> · {board?.took_ms}ms</span>
                    <button className="mri-refresh" onClick={load} title="רענן">↻</button>
                </div>
            </div>

            {items.length === 0 ? (
                <div className="mri-quiet">
                    <span className="mri-quiet-icon">🟢</span>
                    <p>אין שינויים מאז הריצה הקודמת. המערכת יציבה.</p>
                </div>
            ) : (
                <ul className="mri-items">
                    {items.slice(0, 10).map((it, i) => (
                        <li key={i} className={`mri-item mri-${it.severity}`}>
                            <span className="mri-icon">{SEVERITY_ICON[it.severity] || '⚪'}</span>
                            <div className="mri-body">
                                <div className="mri-title">{it.title}</div>
                                {it.delta ? <div className="mri-delta">{it.delta}</div> : null}
                            </div>
                            {it.action ? (
                                <button className="mri-action" onClick={() => handleAction(it.action)}>
                                    {it.action.label}
                                </button>
                            ) : null}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default MorningMRI;
