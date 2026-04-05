import { useContext, useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { api } from "../../api";
import { AuthContext } from "../../context/AuthContext";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const { name, token } = useContext(AuthContext);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getMonthValue = (items = [], month) => {
    const found = items.find((m) => m.month === month);
    return Number(found?.totalKg || 0);
  };

  const [stats, setStats] = useState({
    loggedInMembers: 0,
    totalMembers: 0,
    totalUsageKg: 0,
    activeMonths: 0,
    monthlyTotals: [],
    users: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchStats = async () => {
      try {
        const { data } = await api.get("/admin/stats", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!mounted) return;
        setStats(data);
      } catch (err) {
        if (!mounted) return;
        setError(
          err?.response?.data?.message ||
            err?.response?.data?.msg ||
            "Failed to load admin stats",
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchStats();
    return () => {
      mounted = false;
    };
  }, [token]);

  return (
    <>
      <Header />
      <main className="dashboard-page">
        <div className="container">
          <h1>Admin Dashboard</h1>
          <p style={{ marginTop: 4, marginBottom: 20 }}>
            Welcome {name || "Admin"}. Monitor member login activity here.
          </p>

          {loading && <p>Loading stats...</p>}
          {error && <p style={{ color: "crimson" }}>{error}</p>}

          {!loading && !error && (
            <>
              <div className="dashboard-content">
                <div className="stats-card">
                  <h3>Logged-in Members</h3>
                  <p className="stat-value">{stats.loggedInMembers}</p>
                  <p className="stat-comparison">Currently marked active</p>
                </div>

                <div className="stats-card">
                  <h3>Total Members</h3>
                  <p className="stat-value">{stats.totalMembers}</p>
                  <p className="stat-comparison">Registered member accounts</p>
                </div>

                <div className="stats-card">
                  <h3>Total Usage</h3>
                  <p className="stat-value">
                    {Number(stats.totalUsageKg || 0).toLocaleString()} kg
                  </p>
                  <p className="stat-comparison">All users combined</p>
                </div>

                <div className="stats-card">
                  <h3>Active Months</h3>
                  <p className="stat-value">{stats.activeMonths}</p>
                  <p className="stat-comparison">Months with recorded usage</p>
                </div>
              </div>

              <section className="admin-usage-section">
                <h2>Monthwise Usage Table (January to December)</h2>
                <div className="admin-usage-table-wrap">
                  <table className="admin-usage-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        {months.map((month) => (
                          <th key={`head-${month}`}>{month.slice(0, 3)}</th>
                        ))}
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.users?.length ? (
                        stats.users.map((user) => (
                          <tr key={user.userId}>
                            <td>
                              <div className="admin-user-cell">
                                <strong>{user.name}</strong>
                                <small>{user.email}</small>
                              </div>
                            </td>
                            {months.map((month) => (
                              <td key={`${user.userId}-${month}`}>
                                {getMonthValue(
                                  user.monthwise,
                                  month,
                                ).toLocaleString()}
                              </td>
                            ))}
                            <td className="admin-total-cell">
                              {Number(user.totalUsageKg || 0).toLocaleString()}{" "}
                              kg
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={months.length + 2}>No members found.</td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr>
                        <th>Overall</th>
                        {months.map((month) => (
                          <th key={`foot-${month}`}>
                            {getMonthValue(
                              stats.monthlyTotals,
                              month,
                            ).toLocaleString()}
                          </th>
                        ))}
                        <th>
                          {Number(stats.totalUsageKg || 0).toLocaleString()} kg
                        </th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
