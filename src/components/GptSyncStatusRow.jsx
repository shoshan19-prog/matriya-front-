import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import './GptSyncStatusRow.css';

/** Extensions eligible for cloud document sync (logical basename). */
const GPT_ELIGIBLE_RE = /\.(pdf|docx|doc|txt|xlsx|xls|pptx|csv|json|md|html|htm)$/i;

function hasEligibleFilenames(filenames) {
    if (!Array.isArray(filenames) || filenames.length === 0) return false;
    return filenames.some((n) => {
        const base = String(n || '').split('/').filter(Boolean).pop() || '';
        return base && GPT_ELIGIBLE_RE.test(base);
    });
}

/**
 * Cloud document sync status + actions (vendor-neutral UI).
 * @param {{ filenames: string[], onSyncComplete?: () => void, onSyncingChange?: (syncing: boolean) => void, className?: string }} props
 */
function GptSyncStatusRow({ filenames = [], onSyncComplete, onSyncingChange, className = '' }) {
    const [st, setSt] = useState(null);
    const [syncing, setSyncing] = useState(false);
    const [postSyncIndexingPoll, setPostSyncIndexingPoll] = useState(false);
    const [syncHadError, setSyncHadError] = useState(false);

    const refresh = useCallback(async () => {
        try {
            const res = await api.get('/gpt-rag/status');
            setSt(res.data || null);
        } catch {
            setSt(null);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    useEffect(() => {
        refresh();
    }, [filenames.length, refresh]);

    useEffect(() => {
        onSyncingChange?.(syncing || postSyncIndexingPoll);
    }, [syncing, postSyncIndexingPoll, onSyncingChange]);

    useEffect(() => {
        const onVis = () => {
            if (document.visibilityState === 'visible') refresh();
        };
        document.addEventListener('visibilitychange', onVis);
        return () => document.removeEventListener('visibilitychange', onVis);
    }, [refresh]);

    const runSync = useCallback(async () => {
        setSyncing(true);
        setSyncHadError(false);
        try {
            const res = await api.post('/gpt-rag/sync', {}, { timeout: 300000 });
            await refresh();
            onSyncComplete?.();
            if (res.data?.indexing_pending) {
                setPostSyncIndexingPoll(true);
                try {
                    for (let i = 0; i < 36; i++) {
                        await new Promise((r) => setTimeout(r, 5000));
                        await refresh();
                        const check = await api.get('/gpt-rag/status');
                        const s = check.data;
                        const fc = s?.file_counts || {};
                        const inProg = fc.in_progress ?? 0;
                        if (inProg === 0 && (fc.completed > 0 || s?.vector_store_status === 'completed')) break;
                    }
                } finally {
                    setPostSyncIndexingPoll(false);
                    await refresh();
                }
            }
        } catch (e) {
            setSyncHadError(true);
            console.warn('[GptSyncStatusRow]', e);
        } finally {
            setSyncing(false);
        }
    }, [refresh, onSyncComplete]);

    const hasAnyFile = filenames.length > 0;
    const hasEligible = hasEligibleFilenames(filenames);

    let dotColor = 'var(--matriya-border, #ccc)';
    let label = 'בודק חיבור לשירות המסמכים…';
    let hintId = 'gpt-sync-status-hint';
    let extraWarn = null;

    if (st) {
        if (!st.openai) {
            dotColor = 'var(--matriya-error, #c0392b)';
            label = 'חיפוש המסמכים בענן לא מוגדר. פנה למנהל המערכת.';
        } else if (syncing || postSyncIndexingPoll) {
            dotColor = 'var(--matriya-accent, #166534)';
            label = postSyncIndexingPoll ? 'מאנדקס מסמכים בענן…' : 'מסנכרן....';
        } else if (st.vector_store_id) {
            dotColor = 'var(--matriya-success, #166534)';
            label = 'מסונכרן';
            if (st.warning) {
                extraWarn = 'לא ניתן לאמת את מאגר המסמכים. נסה «רענון סטטוס» או «סנכרון מחדש».';
            }
        } else if (!hasEligible) {
            dotColor = 'var(--matriya-muted, #6b7280)';
            if (!hasAnyFile) {
                label = 'אין מסמכים לאינדוקס — העלו קבצים ואז סנכרנו.';
            } else {
                label = 'אין מסמכים בפורמט נתמך לסנכרון (PDF, Word, Excel, טקסט וכו׳).';
            }
        } else if (syncHadError) {
            dotColor = 'var(--matriya-error, #c0392b)';
            label = 'הסנכרון נכשל. בדקו את השרת או נסו שוב.';
        } else if (!st.use_openai_file_search) {
            dotColor = 'var(--matriya-muted, #6b7280)';
            label = 'חיפוש מסמכים בענן מושבת בהגדרות השרת. פנה למנהל המערכת.';
        } else {
            dotColor = 'var(--matriya-accent, #166534)';
            label = 'ממתין לסנכרון…';
        }
    }

    const uiBusy = syncing || postSyncIndexingPoll;
    const showResync =
        st?.openai && st?.use_openai_file_search && Boolean(st?.vector_store_id) && !uiBusy;
    const showRetry =
        st?.openai &&
        st?.use_openai_file_search &&
        !st?.vector_store_id &&
        !uiBusy &&
        hasEligible &&
        syncHadError;
    const showInitialSync =
        st?.openai &&
        st?.use_openai_file_search &&
        !st?.vector_store_id &&
        !uiBusy &&
        hasEligible &&
        !syncHadError;

    return (
        <div className={`gpt-sync-status-row ${className}`.trim()} role="region" aria-label="סטטוס סנכרון מסמכים">
            <div className="gpt-sync-status-row__inner">
                <span className="gpt-sync-status-row__dot" style={{ background: dotColor }} aria-hidden />
                <span id={hintId} className="gpt-sync-status-row__label">
                    {label}
                    {extraWarn ? <span className="gpt-sync-status-row__warn"> {extraWarn}</span> : null}
                </span>
                {showResync && (
                    <button
                        type="button"
                        className="gpt-sync-status-row__btn"
                        disabled={!hasEligible}
                        onClick={runSync}
                    >
                        סנכרון מחדש
                    </button>
                )}
                {showRetry && (
                    <button
                        type="button"
                        className="gpt-sync-status-row__btn"
                        onClick={() => {
                            setSyncHadError(false);
                            runSync();
                        }}
                    >
                        נסה שוב
                    </button>
                )}
                {showInitialSync && (
                    <button
                        type="button"
                        className="gpt-sync-status-row__btn gpt-sync-status-row__btn--primary"
                        disabled={!hasEligible}
                        onClick={runSync}
                    >
                        סנכרון
                    </button>
                )}
                <button type="button" className="gpt-sync-status-row__btn" disabled={uiBusy} onClick={refresh}>
                    רענון סטטוס
                </button>
            </div>
        </div>
    );
}

export default GptSyncStatusRow;
export { hasEligibleFilenames, GPT_ELIGIBLE_RE };
