import React, { useContext, useEffect, useState } from 'react';
import { api } from '../api';
import { AuthContext } from '../context/AuthContext';

const MONTH_ORDER = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function UserCalculations({ calculations: propCalculations }) {
  const { name, role } = useContext(AuthContext);
  const [calculations, setCalculations] = useState(propCalculations || []);
  const [loading, setLoading] = useState(propCalculations ? false : true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (propCalculations) {
      setCalculations(propCalculations);
      return;
    }
    let mounted = true;

    const fetchCalcs = async () => {
      try {
        const res = await api.get('/calculations');
        if (!mounted) return;
        setCalculations(res.data || []);
      } catch (e) {
        setError(
          e?.response?.data?.message ||
          e?.response?.data?.msg ||
          'Failed to load calculations'
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchCalcs();
    return () => { mounted = false; };
  }, [propCalculations]);

  const totalDataWasted = calculations.reduce(
    (s, c) => s + (c.dataWasted || 0), 0
  );

  const sortedCalculations = [...calculations].sort((a, b) => {
    const getMonthIndex = (calc) => {
      try {
        const d = typeof calc.details === 'string'
          ? JSON.parse(calc.details)
          : calc.details;
        const month = d?.month || d?.Month;
        const idx = MONTH_ORDER.indexOf(month);
        return idx === -1 ? 999 : idx;
      } catch {
        return 999;
      }
    };
    return getMonthIndex(a) - getMonthIndex(b);
  });

  return (
    <section className="user-calculations" style={{backgroundColor:"#4e9289ff", marginTop: 30 }}>
      <div className="container">
        <h2 style={{ marginBottom: 12 }}>Calculation History</h2>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
          <div className="stats-card">
            <strong style={{ color: "#2e7d32" }}>Total calculations</strong>
            <div style={{ fontSize: 20, color: "#2e7d32" }}>
              {calculations.length}
            </div>
          </div>
          <div className="stats-card">
            <strong style={{ color: "#2e7d32" }}>Total data wasted</strong>
            <div style={{ fontSize: 20, color: "#2e7d32" }}>
              {totalDataWasted} MB
            </div>
          </div>
        </div>

        {loading && <div>Loading calculations...</div>}
        {error && <div style={{ color: 'crimson' }}>{error}</div>}

        {!loading && !error && (
          <>
            {sortedCalculations.length === 0 ? (
              <div  className='stats-card' style={{color: "#2e7d32"}}>No calculations yet.</div>
            ) : (
              <div  style={{ overflowX: 'hidden', background: '#87efe1ff', padding: 12, borderRadius: 8 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead className="stats-card">
                    <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                      <th style={{ padding: '8px 12px' }}>Month</th>
                      <th style={{ padding: '8px 12px' }}>Data Wasted (kg CO₂/month)</th>
                      <th style={{ padding: '8px 12px' }}>Diet / Details</th>
                      <th style={{ padding: '8px 12px' }}>Raw Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedCalculations.map((c) => {
                      let detailsText = '-';
                      let monthText = '-';

                      try {
                        const d = typeof c.details === 'string'
                          ? JSON.parse(c.details)
                          : c.details;
                        detailsText = d?.diet || d?.Diet || JSON.stringify(d) || '-';
                        monthText = d?.month || d?.Month || '-';
                      } catch {
                        detailsText = c.details || '-';
                      }

                      return (
                        <tr className="stats-card" key={c._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                          <td style={{ padding: '10px 12px' }}>{monthText}</td>
                          <td style={{ padding: '10px 12px' }}>{c.dataWasted}</td>
                          <td style={{ padding: '10px 12px' }}>{detailsText}</td>
                          <td style={{ padding: '10px 12px', fontSize: 12, color: '#555' }}>
                            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                              {typeof c.details === 'string'
                                ? c.details
                                : JSON.stringify(c.details)}
                            </pre>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
