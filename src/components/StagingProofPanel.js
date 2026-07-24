import React, { useState } from 'react';
import api from '../utils/api';
import './StagingProofPanel.css';

/**
 * Staging Proof panel — surfaces the research staging-proof endpoint that had no UI:
 *   GET /research/staging-proof?session_id=<uuid>
 * Read-only: shows a session's gate state (current/next stage, lock, last snapshot cycle,
 * kernel v16 flags). Requires a session_id. Handles 400 (missing) / 404 (not found).
 */
function StagingProofPanel() {
    const [sessionId, setSessionId] = useState('');
    const [proof, setProof] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const check = async () => {
        const sid = sessionId.trim();
        if (!sid) {
            setError('יש להזין session_id');
            return;
        }
        setLoading(true);
        setError(null);
        setProof(null);
        try {
            const res = await api.get('/research/staging-proof', { params: { session_id: sid }, timeout: 15000 });
            setProof(res.data);
        } catch (e) {
            if (e.response?.status === 404) setError('סשן לא נמצא');
            else setError(e.response?.data?.error || e.message || 'שגיאה בבדיקת staging proof');
        } finally {
            setLoading(false);
        }
    };

    const kv = proof?.kernel_v16 || {};

    return (
        <div className="staging-section">
            <div className="staging-header">
                <h3>Staging Proof — הוכחת שלב</h3>
            </div>
            <div className="staging-note">בדיקת מצב השער עבור סשן מחקר (תצוגה בלבד).</div>

            <div className="staging-filter">
                <input
                    type="text"
                    placeholder="session_id…"
                    value={sessionId}
                    onChange={(e) => setSessionId(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') check(); }}
                />
                <button className="section-button" onClick={check} disabled={loading}>
                    {loading ? 'בודק…' : 'בדוק'}
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {proof && (
                <div className="staging-result">
                    <div className={`staging-gate ${proof.gate_locked ? 'locked' : 'open'}`}>
                        {proof.gate_locked ? '🔒 השער נעול' : '✅ השער פתוח'}
                        {proof.gate_locked && proof.violation_id != null && (
                            <span className="staging-gate-sub"> · violation #{proof.violation_id}</span>
                        )}
                    </div>

                    <div className="staging-grid">
                        <div className="staging-card">
                            <span className="staging-label">שלב נוכחי</span>
                            <span className="staging-value">{proof.current_stage ?? '—'}</span>
                        </div>
                        <div className="staging-card">
                            <span className="staging-label">שלב הבא מותר</span>
                            <span className="staging-value">{proof.next_allowed ?? '—'}</span>
                        </div>
                        <div className="staging-card">
                            <span className="staging-label">מחזור snapshot אחרון</span>
                            <span className="staging-value">{proof.last_snapshot_cycle_index ?? '—'}</span>
                        </div>
                    </div>

                    <div className="staging-block">
                        <span className="staging-label">שלבים שהושלמו</span>
                        <div className="staging-chips">
                            {(proof.completed_stages || []).length
                                ? proof.completed_stages.map((s, i) => <span className="staging-chip" key={i}>{s}</span>)
                                : <span className="staging-muted">—</span>}
                        </div>
                    </div>

                    <div className="staging-block">
                        <span className="staging-label">Kernel v16</span>
                        <div className="staging-kv">
                            <span>spec: <b>{kv.spec ?? '—'}</b></span>
                            <span>possibility_shutdown: <b>{kv.possibility_shutdown ? 'כן' : 'לא'}</b></span>
                            <span>document_mode_n: <b>{kv.document_mode_n ? 'כן' : 'לא'}</b></span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StagingProofPanel;
