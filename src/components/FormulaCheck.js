import React, { useState } from 'react';
import api from '../utils/api';
import './FormulaCheck.css';

/**
 * בדיקת פורמולה מול ניסויי עבר — surface for the existing POST /analysis/formula
 * engine (matriya-back). Before running an experiment: has a similar formulation
 * already been tried, and how did it end?
 */
const OUTCOME_LABEL = {
    success: { text: 'הצלחה', cls: 'fc-outcome-success' },
    failure: { text: 'כישלון', cls: 'fc-outcome-failure' },
    partial: { text: 'חלקי', cls: 'fc-outcome-partial' },
    production_formula: { text: 'פורמולת ייצור', cls: 'fc-outcome-production' }
};

function FormulaCheck() {
    const [domain, setDomain] = useState('');
    const [materials, setMaterials] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const runCheck = async () => {
        setLoading(true);
        setError('');
        setResult(null);
        try {
            const body = {
                domain: domain.trim() || undefined,
                materials: materials.trim()
                    ? materials.split(',').map(s => s.trim()).filter(Boolean)
                    : undefined
            };
            const res = await api.post('/analysis/formula', body);
            setResult(res.data);
        } catch (e) {
            setError(e.response?.data?.error || e.message || 'הבדיקה נכשלה');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fc-panel" dir="rtl">
            <h3 className="fc-title">🧪 בדיקת פורמולה מול ניסויי עבר</h3>
            <p className="fc-hint">
                לפני ניסוי: האם פורמולה דומה כבר נוסתה — ואיך היא נגמרה? (מבוסס ניסויי המעבדה המסונכרנים)
            </p>
            <div className="fc-inputs">
                <input
                    className="fc-input"
                    type="text"
                    placeholder="תחום (למשל: intumescent)"
                    value={domain}
                    onChange={e => setDomain(e.target.value)}
                    disabled={loading}
                />
                <input
                    className="fc-input fc-input-wide"
                    type="text"
                    placeholder="חומרים, מופרדים בפסיק (למשל: APP, PER, melamine)"
                    value={materials}
                    onChange={e => setMaterials(e.target.value)}
                    disabled={loading}
                />
                <button className="fc-button" onClick={runCheck} disabled={loading}>
                    {loading ? 'בודק…' : 'בדוק'}
                </button>
            </div>

            {error ? <div className="fc-error">{error}</div> : null}

            {result ? (
                result.similar_experiments && result.similar_experiments.length > 0 ? (
                    <table className="fc-table">
                        <thead>
                            <tr>
                                <th>מזהה ניסוי</th>
                                <th>תחום</th>
                                <th>תוצאה</th>
                                <th>פורמולה</th>
                            </tr>
                        </thead>
                        <tbody>
                            {result.similar_experiments.map((ex, i) => {
                                const o = OUTCOME_LABEL[ex.experiment_outcome] || { text: ex.experiment_outcome, cls: '' };
                                return (
                                    <tr key={i}>
                                        <td>{ex.experiment_id}</td>
                                        <td>{ex.technology_domain}</td>
                                        <td>
                                            <span className={`fc-outcome ${o.cls}`}>
                                                {ex.is_production_formula ? '★ ' : ''}{o.text}
                                            </span>
                                        </td>
                                        <td className="fc-formula">{(ex.formula || '').slice(0, 120)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <div className="fc-empty">אין ניסויים תואמים במאגר לתחום שהוזן.</div>
                )
            ) : null}

            {result && result.warnings && result.warnings.length > 0 ? (
                <ul className="fc-warnings">
                    {result.warnings.map((w, i) => <li key={i}>⚠️ {typeof w === 'string' ? w : JSON.stringify(w)}</li>)}
                </ul>
            ) : null}
        </div>
    );
}

export default FormulaCheck;
