import { useContext, useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext';
import { api } from '../api';
import UserCalculations from '../components/UserCalculations';

const Dashboard = () => {
  const { username, name } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!username) return;
    let mounted = true;
    setLoading(true);
    api.get(`/users/${encodeURIComponent(username)}`)
      .then(res => {
        if (!mounted) return;
        setProfile(res.data.user);
        setCalculations(res.data.calculations || []);
      })
      .catch(err => {
        setError(err?.response?.data?.message || 'Failed to load dashboard');
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [username]);

  const totalData = calculations.reduce((s, c) => s + (c.dataWasted || 0), 0);
  // derive diet label from the most recent calculation's details (if provided)
  const dietMap = { average: 'Average Meat Eater', vegetarian: 'Vegetarian', vegan: 'Vegan', none: 'None' };
  let dietLabel = '—';
  if (calculations.length > 0) {
    try {
      const latest = calculations[0];
      const details = typeof latest.details === 'string' ? JSON.parse(latest.details) : latest.details;
      const diet = details?.diet || details?.Diet || null;
      dietLabel = dietMap[diet] || (diet ? String(diet) : '—');
    } catch (e) {
      dietLabel = '—';
    }
  }

  return (
    <>
      <Header />
      <main className="dashboard-page" style={{backgroundColor:"#4e9289ff"}}>
        <div className="container">
          <h1>{loading ? 'Loading...' : `Welcome ${profile?.name || profile?.username || name || ''}`}</h1>

          {error && <div style={{ color: 'crimson' }}>{error}</div>}

          <div className="dashboard-content">
            <div className="stats-card">
              <h3>Total Calculations</h3>
              <p className="stat-value">{calculations.length}</p>
              <p className="stat-comparison">Recent calculations shown below</p>
            </div>
            <div className="stats-card">
              <h3>Total Data Wasted</h3>
              <p className="stat-value">{totalData} kg CO2/month</p>
              <p className="stat-comparison">Sum of dataWasted from your calculations</p>
            </div>
            {/* <div className="stats-card">
              <h3>Role</h3>
              <p className="stat-value">{profile?.role || '—'}</p>
              <p className="stat-comparison">Account role</p>
            </div> */}
            <div className="stats-card">
              <h3>Diet Type (latest)</h3>
              <p className="stat-value">{dietLabel}</p>
              <p className="stat-comparison">From your most recent calculation</p>
            </div>
          </div>

          <UserCalculations calculations={calculations.length ? calculations : undefined} />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Dashboard;